const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim();
const USE_POSTGRES_STATE = Boolean(DATABASE_URL);
const DEFAULT_DB_FILE = 'db.json';
const FALLBACK_DB_PATH = path.join(__dirname, 'data', DEFAULT_DB_FILE);
const APP_STATE_ROW_ID = 1;

let dbCache = null;
let pgPool = null;
let pendingRemoteWrite = Promise.resolve();
const OFFICIAL_MODELS_YEAR_MIN = 1980;
const OFFICIAL_MODELS_MAX_YEAR_SPAN = 26;
const officialModelsCache = new Map();
const officialModelsPending = new Map();
const ACCOUNT_AVATAR_MAX_BYTES = 4 * 1024 * 1024;

function normalizeEmail(value = '') {
    return String(value || '').trim().toLowerCase();
}

function deriveUsernameFromEmail(email = '') {
    const base = normalizeEmail(email).split('@')[0] || '';
    const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, '');
    return cleaned || 'utente';
}

function sanitizeUsername(value = '', { fallback = '' } = {}) {
    const normalized = String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^a-zA-Z0-9._ -]+/g, '');
    const collapsed = normalized.replace(/\s+/g, ' ').trim();
    const picked = collapsed || fallback || '';
    return picked.slice(0, 32);
}

function sanitizeProfileText(value = '', maxLen = 160) {
    return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function isValidDataImageUrl(value = '') {
    if (!value) return true;
    if (typeof value !== 'string') return false;
    if (!/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) return false;
    return Buffer.byteLength(value, 'utf8') <= ACCOUNT_AVATAR_MAX_BYTES;
}

function ensureUserShape(user = {}) {
    const email = normalizeEmail(user.email);
    const createdAt = Number(user.createdAt) || Date.now();
    const lastLoginAt = Number(user.lastLoginAt) || createdAt;
    const updatedAt = Number(user.updatedAt) || lastLoginAt;
    const usernameFallback = deriveUsernameFromEmail(email);
    const username = sanitizeUsername(user.username, { fallback: usernameFallback }) || usernameFallback;
    const avatarCandidate = String(user.avatarUrl || '');
    const avatarUrl = isValidDataImageUrl(avatarCandidate) ? avatarCandidate : '';

    return {
        ...user,
        id: String(user.id || ''),
        email,
        passwordHash: String(user.passwordHash || ''),
        username,
        bio: sanitizeProfileText(user.bio || '', 220),
        location: sanitizeProfileText(user.location || '', 80),
        avatarUrl,
        createdAt,
        lastLoginAt,
        updatedAt
    };
}

function buildPublicUser(user = {}) {
    const shaped = ensureUserShape(user);
    return {
        id: shaped.id,
        email: shaped.email,
        username: shaped.username,
        bio: shaped.bio,
        location: shaped.location,
        avatarUrl: shaped.avatarUrl,
        createdAt: shaped.createdAt,
        lastLoginAt: shaped.lastLoginAt,
        updatedAt: shaped.updatedAt
    };
}

function ensureDbShape(db) {
    if (!db || typeof db !== 'object') db = {};
    if (!Array.isArray(db.users)) db.users = [];
    db.users = db.users.map(ensureUserShape).filter((user) => user.id && user.email && user.passwordHash);
    if (!db.favorites || typeof db.favorites !== 'object') db.favorites = {};
    if (!db.companions || typeof db.companions !== 'object') db.companions = {};
    if (!db.completed || typeof db.completed !== 'object') db.completed = {};
    if (!db.mycarPhotos || typeof db.mycarPhotos !== 'object') db.mycarPhotos = {};
    if (!Array.isArray(db.friendRequests)) db.friendRequests = [];
    if (!db.friendships || typeof db.friendships !== 'object') db.friendships = {};
    if (!db.shareSettings || typeof db.shareSettings !== 'object') db.shareSettings = {};
    return db;
}

function tryInitDbFile(filePath) {
    try {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(ensureDbShape({}), null, 2), 'utf-8');
        }
        fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function resolveDbPath() {
    const explicitDbPath = String(process.env.DB_PATH || '').trim();
    if (explicitDbPath) {
        if (!tryInitDbFile(explicitDbPath)) {
            throw new Error(`Impossibile accedere a DB_PATH: ${explicitDbPath}`);
        }
        return explicitDbPath;
    }

    const dbFileName = String(process.env.DB_FILE_NAME || DEFAULT_DB_FILE).trim() || DEFAULT_DB_FILE;
    const candidateDirs = [
        String(process.env.DRIVECALC_DATA_DIR || '').trim(),
        String(process.env.RENDER_DISK_PATH || '').trim(),
        '/var/data',
        path.join(__dirname, 'data')
    ].filter(Boolean);

    for (const dir of candidateDirs) {
        const candidatePath = path.join(dir, dbFileName);
        if (tryInitDbFile(candidatePath)) {
            return candidatePath;
        }
    }

    if (!tryInitDbFile(FALLBACK_DB_PATH)) {
        throw new Error('Impossibile inizializzare il database');
    }
    return FALLBACK_DB_PATH;
}

const DB_PATH = resolveDbPath();
console.log(`[DriveCalc API] Database path: ${DB_PATH}`);

app.use(cors());
app.use(express.json({ limit: '5mb' }));

function readDbFromFile() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return ensureDbShape(JSON.parse(raw));
    } catch (err) {
        return ensureDbShape({});
    }
}

function writeDbToFile(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(ensureDbShape(db), null, 2), 'utf-8');
}

function cloneDb(db) {
    return JSON.parse(JSON.stringify(ensureDbShape(db)));
}

function getPgSslOption() {
    if (String(process.env.PGSSLMODE || '').toLowerCase() === 'disable') {
        return false;
    }
    if (DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')) {
        return false;
    }
    return { rejectUnauthorized: false };
}

async function ensureRemoteStateTable() {
    await pgPool.query(`
        CREATE TABLE IF NOT EXISTS app_state (
            id SMALLINT PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
}

async function loadDbFromPostgres() {
    const result = await pgPool.query('SELECT data FROM app_state WHERE id = $1', [APP_STATE_ROW_ID]);
    if (result.rows.length && result.rows[0] && result.rows[0].data) {
        return ensureDbShape(result.rows[0].data);
    }
    return null;
}

async function saveDbToPostgres(db) {
    await pgPool.query(
        `
        INSERT INTO app_state (id, data, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `,
        [APP_STATE_ROW_ID, JSON.stringify(ensureDbShape(db))]
    );
}

function queueRemotePersist(db) {
    if (!USE_POSTGRES_STATE || !pgPool) return;
    const payload = cloneDb(db);
    pendingRemoteWrite = pendingRemoteWrite
        .then(() => saveDbToPostgres(payload))
        .catch((err) => {
            console.error('[DriveCalc API] Errore salvataggio remoto DB:', err.message);
            // Manteniamo comunque un fallback locale per debug/recovery.
            writeDbToFile(payload);
        });
}

async function initStorage() {
    if (USE_POSTGRES_STATE) {
        let PoolCtor = null;
        try {
            ({ Pool: PoolCtor } = require('pg'));
        } catch (err) {
            throw new Error('Dipendenza "pg" mancante. Esegui npm install nella cartella server.');
        }

        pgPool = new PoolCtor({
            connectionString: DATABASE_URL,
            ssl: getPgSslOption()
        });

        await pgPool.query('SELECT 1');
        await ensureRemoteStateTable();

        const remoteDb = await loadDbFromPostgres();
        if (remoteDb) {
            dbCache = ensureDbShape(remoteDb);
            console.log('[DriveCalc API] Storage: PostgreSQL (remote app_state)');
        } else {
            const localDb = readDbFromFile();
            dbCache = ensureDbShape(localDb);
            await saveDbToPostgres(dbCache);
            console.log('[DriveCalc API] Storage: PostgreSQL inizializzato da file locale');
        }
        return;
    }

    dbCache = readDbFromFile();
    console.log('[DriveCalc API] Storage: file locale');
}

function readDb() {
    if (!dbCache) {
        dbCache = readDbFromFile();
    }
    return cloneDb(dbCache);
}

function writeDb(db) {
    const shaped = ensureDbShape(db);
    dbCache = cloneDb(shaped);
    writeDbToFile(shaped);
    queueRemotePersist(shaped);
}

function issueToken(user) {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');
    if (!token) return res.status(401).json({ error: 'Token mancante' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token non valido' });
    }
}

app.post('/api/auth/register', async (req, res) => {
    const { email, password, username } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    const rawPassword = String(password || '');
    const rawUsername = String(username || '');
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!normalizedEmail || !rawPassword) return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    if (!isEmailValid) return res.status(400).json({ error: 'Formato email non valido' });
    if (rawPassword.length < 6) return res.status(400).json({ error: 'La password deve avere almeno 6 caratteri' });

    const db = readDb();
    if (db.users.find(u => u.email === normalizedEmail)) {
        return res.status(409).json({ error: 'Utente già registrato' });
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const now = Date.now();
    const safeUsername = sanitizeUsername(rawUsername, { fallback: deriveUsernameFromEmail(normalizedEmail) });
    const user = ensureUserShape({
        id: uuidv4(),
        email: normalizedEmail,
        passwordHash,
        username: safeUsername,
        bio: '',
        location: '',
        avatarUrl: '',
        createdAt: now,
        lastLoginAt: now,
        updatedAt: now
    });
    db.users.push(user);
    getShareSettings(db, user.id);
    writeDb(db);

    const token = issueToken(user);
    const stats = computeUserStats(db, user.id);
    return res.json({ token, user: buildPublicUser(user), stats });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    const rawPassword = String(password || '');
    if (!normalizedEmail || !rawPassword) return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    const db = readDb();
    const user = db.users.find(u => u.email === normalizedEmail);
    if (!user) return res.status(401).json({ error: 'Credenziali non valide' });
    const ok = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenziali non valide' });
    user.lastLoginAt = Date.now();
    user.updatedAt = Date.now();
    writeDb(db);
    const token = issueToken(user);
    const stats = computeUserStats(db, user.id);
    return res.json({ token, user: buildPublicUser(user), stats });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    return res.json({
        user: buildPublicUser(user),
        stats: computeUserStats(db, user.id)
    });
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const incoming = req.body || {};
    if (incoming.username !== undefined) {
        const safeUsername = sanitizeUsername(incoming.username, { fallback: '' });
        if (!safeUsername || safeUsername.length < 3) {
            return res.status(400).json({ error: 'Username non valido (minimo 3 caratteri)' });
        }
        user.username = safeUsername;
    }

    if (incoming.bio !== undefined) {
        user.bio = sanitizeProfileText(incoming.bio, 220);
    }

    if (incoming.location !== undefined) {
        user.location = sanitizeProfileText(incoming.location, 80);
    }

    if (incoming.avatarUrl !== undefined) {
        const avatarUrl = String(incoming.avatarUrl || '');
        if (!isValidDataImageUrl(avatarUrl)) {
            return res.status(400).json({ error: 'Immagine profilo non valida (usa JPG/PNG/WebP/GIF)' });
        }
        user.avatarUrl = avatarUrl;
    }

    user.updatedAt = Date.now();
    writeDb(db);
    return res.json({
        user: buildPublicUser(user),
        stats: computeUserStats(db, user.id)
    });
});

app.put('/api/auth/password', authMiddleware, async (req, res) => {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const currentPassword = String((req.body || {}).currentPassword || '');
    const newPassword = String((req.body || {}).newPassword || '');
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Password attuale e nuova password sono obbligatorie' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La nuova password deve avere almeno 6 caratteri' });
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: 'Password attuale non corretta' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.updatedAt = Date.now();
    writeDb(db);
    return res.json({ ok: true });
});

function getCollection(db, key, userId) {
    if (!db[key][userId]) db[key][userId] = [];
    return db[key][userId];
}

function getFriendList(db, userId) {
    if (!db.friendships[userId]) db.friendships[userId] = [];
    return db.friendships[userId];
}

function getShareSettings(db, userId) {
    if (!db.shareSettings[userId]) {
        db.shareSettings[userId] = {
            shareFavorites: true,
            shareMyCar: true,
            shareCompanionTrips: true
        };
    }
    return db.shareSettings[userId];
}

function computeUserStats(db, userId) {
    const favoritesCount = getCollection(db, 'favorites', userId).length;
    const companionTripsCount = getCollection(db, 'companions', userId).length;
    const completed = getCollection(db, 'completed', userId);
    const completedTripsCount = completed.length;
    const friendsCount = getFriendList(db, userId).length;

    let totalCompletedKm = 0;
    let totalCompletedCost = 0;
    completed.forEach((trip) => {
        const km = Number.parseFloat(trip.distance || 0);
        const cost = Number.parseFloat(trip.totalCost || 0);
        if (Number.isFinite(km)) totalCompletedKm += km;
        if (Number.isFinite(cost)) totalCompletedCost += cost;
    });

    return {
        favoritesCount,
        companionTripsCount,
        completedTripsCount,
        friendsCount,
        totalCompletedKm: Number(totalCompletedKm.toFixed(2)),
        totalCompletedCost: Number(totalCompletedCost.toFixed(2))
    };
}

function normalizeSearchValue(value = '') {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]+/g, ' ')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function scoreModelQueryMatch(modelName = '', query = '') {
    const candidate = normalizeSearchValue(modelName);
    const q = normalizeSearchValue(query);
    if (!candidate) return 0;
    if (!q) return 100;
    if (candidate.includes(q)) return 100;

    const tokens = q.split(' ').filter((token) => token.length >= 2);
    if (!tokens.length) return 0;

    let matched = 0;
    tokens.forEach((token) => {
        if (candidate.includes(token)) matched += 1;
    });

    const minRequired = tokens.length <= 2 ? 1 : Math.max(2, tokens.length - 1);
    if (matched < minRequired) return 0;
    return 40 + (matched * 15);
}

function parseBoolFlag(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function parseClampedYear(value, maxYear) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    const rounded = Math.trunc(numeric);
    if (rounded < OFFICIAL_MODELS_YEAR_MIN || rounded > maxYear) return null;
    return rounded;
}

async function fetchOfficialModelsFromVpic(make, year = null) {
    const cacheKey = `${String(make || '').toLowerCase()}|${year || 'all'}`;
    if (officialModelsCache.has(cacheKey)) return officialModelsCache.get(cacheKey);
    if (officialModelsPending.has(cacheKey)) return officialModelsPending.get(cacheKey);

    const encodedMake = encodeURIComponent(make);
    const url = year
        ? `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
        : `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodedMake}?format=json`;

    const request = fetch(url, { headers: { Accept: 'application/json' } })
        .then(async (apiRes) => {
            if (!apiRes.ok) {
                const detail = await apiRes.text().catch(() => '');
                throw new Error(detail || `HTTP ${apiRes.status}`);
            }
            const data = await apiRes.json();
            const rawItems = Array.isArray(data.Results) ? data.Results : [];
            const models = Array.from(
                new Set(
                    rawItems
                        .map((item) => String(item.Model_Name || '').trim())
                        .filter(Boolean)
                )
            ).sort((a, b) => a.localeCompare(b, 'it'));
            officialModelsCache.set(cacheKey, models);
            return models;
        })
        .finally(() => {
            officialModelsPending.delete(cacheKey);
        });

    officialModelsPending.set(cacheKey, request);
    return request;
}

function isFriends(db, a, b) {
    const list = getFriendList(db, a);
    return list.includes(b);
}

function addCrudRoutes(resourceKey) {
    app.get(`/api/${resourceKey}`, authMiddleware, (req, res) => {
        const db = readDb();
        const items = getCollection(db, resourceKey, req.user.userId);
        return res.json({ items });
    });

    app.post(`/api/${resourceKey}`, authMiddleware, (req, res) => {
        const db = readDb();
        const items = getCollection(db, resourceKey, req.user.userId);
        const incoming = req.body || {};
        const tripId = incoming.tripId || Date.now();
        const normalized = { ...incoming, tripId };
        const existingIdx = items.findIndex(i => i.tripId === tripId);
        if (existingIdx >= 0) items[existingIdx] = normalized; else items.unshift(normalized);
        writeDb(db);
        return res.json({ item: normalized });
    });

    app.delete(`/api/${resourceKey}/:tripId`, authMiddleware, (req, res) => {
        const db = readDb();
        const items = getCollection(db, resourceKey, req.user.userId);
        const tripId = req.params.tripId;
        const idx = items.findIndex(i => String(i.tripId) === String(tripId));
        if (idx >= 0) {
            items.splice(idx, 1);
            writeDb(db);
            return res.json({ ok: true });
        }
        return res.status(404).json({ error: 'Elemento non trovato' });
    });
}

['favorites', 'companions', 'completed'].forEach(addCrudRoutes);

app.get('/api/mycar-photo', authMiddleware, (req, res) => {
    const db = readDb();
    const photos = (db.mycarPhotos && db.mycarPhotos[req.user.userId]) || {};
    return res.json({ items: photos });
});

app.post('/api/mycar-photo', authMiddleware, (req, res) => {
    const { modelId, dataUrl } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Foto mancante' });
    }
    const db = readDb();
    if (!db.mycarPhotos) db.mycarPhotos = {};
    if (!db.mycarPhotos[req.user.userId]) db.mycarPhotos[req.user.userId] = {};
    const key = modelId || 'default';
    db.mycarPhotos[req.user.userId][key] = dataUrl;
    writeDb(db);
    return res.json({ ok: true });
});

app.delete('/api/mycar-photo/:modelId', authMiddleware, (req, res) => {
    const db = readDb();
    const modelId = req.params.modelId || 'default';
    const bucket = db.mycarPhotos && db.mycarPhotos[req.user.userId];
    if (bucket && bucket[modelId]) {
        delete bucket[modelId];
        writeDb(db);
        return res.json({ ok: true });
    }
    return res.status(404).json({ error: 'Foto non trovata' });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/share-settings', authMiddleware, (req, res) => {
    const db = readDb();
    const settings = getShareSettings(db, req.user.userId);
    writeDb(db);
    return res.json({ settings });
});

app.put('/api/share-settings', authMiddleware, (req, res) => {
    const db = readDb();
    const current = getShareSettings(db, req.user.userId);
    const incoming = req.body || {};
    const settings = {
        shareFavorites: typeof incoming.shareFavorites === 'boolean' ? incoming.shareFavorites : current.shareFavorites,
        shareMyCar: typeof incoming.shareMyCar === 'boolean' ? incoming.shareMyCar : current.shareMyCar,
        shareCompanionTrips: typeof incoming.shareCompanionTrips === 'boolean' ? incoming.shareCompanionTrips : current.shareCompanionTrips
    };
    db.shareSettings[req.user.userId] = settings;
    writeDb(db);
    return res.json({ settings });
});

app.get('/api/friends', authMiddleware, (req, res) => {
    const db = readDb();
    const friendIds = getFriendList(db, req.user.userId);
    const items = friendIds
        .map(friendId => db.users.find(u => u.id === friendId))
        .filter(Boolean)
        .map(u => buildPublicUser(u));
    return res.json({ items });
});

app.get('/api/friends/search', authMiddleware, (req, res) => {
    const db = readDb();
    const q = String(req.query.q || '').trim().toLowerCase();
    if (!q || q.length < 2) return res.json({ items: [] });
    const items = db.users
        .filter(u => (u.email.toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q)))
        .filter(u => u.id !== req.user.userId)
        .slice(0, 10)
        .map(u => buildPublicUser(u));
    return res.json({ items });
});

app.get('/api/friends/requests', authMiddleware, (req, res) => {
    const db = readDb();
    const incoming = db.friendRequests
        .filter(r => r.toUserId === req.user.userId && r.status === 'pending')
        .map(r => {
            const fromUser = db.users.find(u => u.id === r.fromUserId);
            return {
                id: r.id,
                fromUserId: r.fromUserId,
                fromEmail: fromUser ? fromUser.email : 'utente',
                fromUsername: fromUser ? fromUser.username : '',
                fromLocation: fromUser ? fromUser.location : '',
                fromAvatarUrl: fromUser ? fromUser.avatarUrl : '',
                createdAt: r.createdAt
            };
        });
    const outgoing = db.friendRequests
        .filter(r => r.fromUserId === req.user.userId && r.status === 'pending')
        .map(r => {
            const toUser = db.users.find(u => u.id === r.toUserId);
            return {
                id: r.id,
                toUserId: r.toUserId,
                toEmail: toUser ? toUser.email : 'utente',
                toUsername: toUser ? toUser.username : '',
                toLocation: toUser ? toUser.location : '',
                toAvatarUrl: toUser ? toUser.avatarUrl : '',
                createdAt: r.createdAt
            };
        });
    return res.json({ incoming, outgoing });
});

app.post('/api/friends/request', authMiddleware, (req, res) => {
    const db = readDb();
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email obbligatoria' });
    const toUser = db.users.find(u => u.email.toLowerCase() === email);
    if (!toUser) return res.status(404).json({ error: 'Utente non trovato' });
    if (toUser.id === req.user.userId) return res.status(400).json({ error: 'Non puoi aggiungere te stesso' });
    if (isFriends(db, req.user.userId, toUser.id)) return res.status(409).json({ error: 'Siete già amici' });

    const existingPending = db.friendRequests.find(r =>
        r.status === 'pending' &&
        ((r.fromUserId === req.user.userId && r.toUserId === toUser.id) ||
         (r.fromUserId === toUser.id && r.toUserId === req.user.userId))
    );
    if (existingPending) return res.status(409).json({ error: 'Richiesta già esistente' });

    const now = Date.now();
    const request = {
        id: uuidv4(),
        fromUserId: req.user.userId,
        toUserId: toUser.id,
        status: 'pending',
        createdAt: now,
        updatedAt: now
    };
    db.friendRequests.push(request);
    writeDb(db);
    return res.json({ item: { id: request.id, toEmail: toUser.email, status: request.status } });
});

app.post('/api/friends/requests/:id/accept', authMiddleware, (req, res) => {
    const db = readDb();
    const reqId = req.params.id;
    const request = db.friendRequests.find(r => r.id === reqId);
    if (!request) return res.status(404).json({ error: 'Richiesta non trovata' });
    if (request.toUserId !== req.user.userId) return res.status(403).json({ error: 'Operazione non consentita' });
    if (request.status !== 'pending') return res.status(409).json({ error: 'Richiesta non più valida' });

    request.status = 'accepted';
    request.updatedAt = Date.now();
    const fromList = getFriendList(db, request.fromUserId);
    const toList = getFriendList(db, request.toUserId);
    if (!fromList.includes(request.toUserId)) fromList.push(request.toUserId);
    if (!toList.includes(request.fromUserId)) toList.push(request.fromUserId);
    writeDb(db);
    return res.json({ ok: true });
});

app.post('/api/friends/requests/:id/reject', authMiddleware, (req, res) => {
    const db = readDb();
    const reqId = req.params.id;
    const request = db.friendRequests.find(r => r.id === reqId);
    if (!request) return res.status(404).json({ error: 'Richiesta non trovata' });
    if (request.toUserId !== req.user.userId) return res.status(403).json({ error: 'Operazione non consentita' });
    if (request.status !== 'pending') return res.status(409).json({ error: 'Richiesta non più valida' });
    request.status = 'rejected';
    request.updatedAt = Date.now();
    writeDb(db);
    return res.json({ ok: true });
});

app.get('/api/friends/:friendId/shared', authMiddleware, (req, res) => {
    const db = readDb();
    const friendId = req.params.friendId;
    if (!isFriends(db, req.user.userId, friendId)) {
        return res.status(403).json({ error: 'Utente non tra i tuoi amici' });
    }
    const friendUser = db.users.find(u => u.id === friendId);
    if (!friendUser) return res.status(404).json({ error: 'Utente non trovato' });

    const settings = getShareSettings(db, friendId);
    const shared = {
        friend: buildPublicUser(friendUser),
        settings,
        favorites: settings.shareFavorites ? (db.favorites[friendId] || []) : [],
        companions: settings.shareCompanionTrips ? (db.companions[friendId] || []) : [],
        mycarPhotos: settings.shareMyCar ? (db.mycarPhotos[friendId] || {}) : {}
    };
    return res.json({ item: shared });
});

app.get('/api/official-models', async (req, res) => {
    const make = String(req.query.make || '').trim();
    const maxYear = new Date().getFullYear() + 1;
    const year = parseClampedYear(req.query.year, maxYear);
    const withYears = parseBoolFlag(req.query.withYears);
    const query = String(req.query.query || req.query.q || '').trim();

    if (!make || make.length < 2) {
        return res.status(400).json({ error: 'Parametro make obbligatorio' });
    }

    try {
        if (withYears) {
            const normalizedQuery = normalizeSearchValue(query);
            if (normalizedQuery.length < 3) {
                return res.json({
                    source: 'vpic-nhtsa',
                    make,
                    query,
                    items: []
                });
            }

            let yearFrom = parseClampedYear(req.query.yearFrom, maxYear);
            let yearTo = parseClampedYear(req.query.yearTo, maxYear);
            if (!Number.isFinite(yearFrom)) yearFrom = Math.max(OFFICIAL_MODELS_YEAR_MIN, maxYear - 20);
            if (!Number.isFinite(yearTo)) yearTo = maxYear;
            if (yearFrom > yearTo) {
                const tmp = yearFrom;
                yearFrom = yearTo;
                yearTo = tmp;
            }
            if ((yearTo - yearFrom + 1) > OFFICIAL_MODELS_MAX_YEAR_SPAN) {
                yearFrom = yearTo - OFFICIAL_MODELS_MAX_YEAR_SPAN + 1;
            }

            const years = [];
            for (let y = yearTo; y >= yearFrom; y -= 1) years.push(y);

            const yearRows = [];
            const batchSize = 4;
            for (let i = 0; i < years.length; i += batchSize) {
                const batch = years.slice(i, i + batchSize);
                const rows = await Promise.all(
                    batch.map(async (y) => ({
                        year: y,
                        names: await fetchOfficialModelsFromVpic(make, y)
                    }))
                );
                yearRows.push(...rows);
            }

            const items = [];
            const seen = new Set();
            yearRows.forEach((row) => {
                (row.names || []).forEach((name) => {
                    if (scoreModelQueryMatch(name, normalizedQuery) <= 0) return;
                    const key = `${name.toLowerCase()}|${row.year}`;
                    if (seen.has(key)) return;
                    seen.add(key);
                    items.push({ name, year: row.year });
                });
            });

            items.sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year;
                return a.name.localeCompare(b.name, 'it');
            });

            return res.json({
                source: 'vpic-nhtsa',
                make,
                query,
                yearFrom,
                yearTo,
                items
            });
        }

        const models = await fetchOfficialModelsFromVpic(make, year);

        return res.json({
            source: 'vpic-nhtsa',
            make,
            year,
            items: models
        });
    } catch (err) {
        return res.status(502).json({ error: 'Errore servizio modelli ufficiali' });
    }
});

app.post('/api/google/routes', async (req, res) => {
    if (!GOOGLE_MAPS_API_KEY) return res.status(500).json({ error: 'Google API key mancante' });
    const { origin, destination } = req.body || {};
    if (!origin || !destination) return res.status(400).json({ error: 'Origin e destination obbligatori' });

    try {
        const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        const body = {
            origin: { address: origin, regionCode: 'IT' },
            destination: { address: destination, regionCode: 'IT' },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_UNAWARE',
            computeAlternativeRoutes: false,
            units: 'METRIC'
        };
        const apiRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.tollInfo,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation'
            },
            body: JSON.stringify(body)
        });
        if (!apiRes.ok) {
            const errText = await apiRes.text();
            return res.status(502).json({ error: 'Errore Routes API', detail: errText });
        }
        const data = await apiRes.json();
        return res.json(data);
    } catch (err) {
        return res.status(502).json({ error: 'Errore Routes API' });
    }
});

app.get('/api/google/reverse-geocode', async (req, res) => {
    if (!GOOGLE_MAPS_API_KEY) return res.status(500).json({ error: 'Google API key mancante' });
    const { lat, lng } = req.query || {};
    if (!lat || !lng) return res.status(400).json({ error: 'lat e lng obbligatori' });

    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&language=it&region=IT&key=${GOOGLE_MAPS_API_KEY}`;
        const apiRes = await fetch(url);
        if (!apiRes.ok) {
            const errText = await apiRes.text();
            return res.status(502).json({ error: 'Errore Geocoding API', detail: errText });
        }
        const data = await apiRes.json();
        return res.json(data);
    } catch (err) {
        return res.status(502).json({ error: 'Errore Geocoding API' });
    }
});

async function startServer() {
    try {
        await initStorage();
        app.listen(PORT, () => {
            console.log(`DriveCalc API in ascolto su http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('[DriveCalc API] Errore inizializzazione storage:', err.message);
        process.exit(1);
    }
}

startServer();
