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
const IS_PRODUCTION = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
const AUTH_COOKIE_NAME = String(process.env.AUTH_COOKIE_NAME || 'drivecalc_session').trim() || 'drivecalc_session';
const AUTH_COOKIE_MAX_AGE_MS = Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || 12 * 60 * 60 * 1000;
const JWT_EXPIRES_IN = String(process.env.JWT_EXPIRES_IN || '12h');
const AUTH_COOKIE_SECURE = String(process.env.AUTH_COOKIE_SECURE || (IS_PRODUCTION ? 'true' : 'false')).toLowerCase() === 'true';
const AUTH_COOKIE_SAMESITE_RAW = String(process.env.AUTH_COOKIE_SAMESITE || (AUTH_COOKIE_SECURE ? 'none' : 'lax')).toLowerCase();
const AUTH_COOKIE_SAMESITE = ['lax', 'strict', 'none'].includes(AUTH_COOKIE_SAMESITE_RAW) ? AUTH_COOKIE_SAMESITE_RAW : 'lax';
const CORS_ORIGIN = String(process.env.CORS_ORIGIN || '').trim();
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
const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY || '').trim();
const OPENAI_MODEL = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
const AI_CHAT_MAX_MESSAGE_CHARS = 340;
const AI_CHAT_MAX_REPLY_CHARS = 900;
const AI_CHAT_RATE_WINDOW_MS = 60 * 1000;
const AI_CHAT_RATE_MAX_REQUESTS = 12;
const aiChatRateBuckets = new Map();
const FUEL_ZONE_API_URL = 'https://carburanti.mise.gov.it/ospzApi/search/zone';
const FUEL_STATION_MIN_RADIUS_KM = 1;
const FUEL_STATION_MAX_RADIUS_KM = 20;
const FUEL_STATION_MAX_RESULTS = 180;
const FUEL_PRICE_MAX_AGE_HOURS_RAW = Number(process.env.FUEL_PRICE_MAX_AGE_HOURS);
const FUEL_PRICE_MAX_AGE_HOURS = Number.isFinite(FUEL_PRICE_MAX_AGE_HOURS_RAW) && FUEL_PRICE_MAX_AGE_HOURS_RAW > 0
    ? clampNumber(Math.round(FUEL_PRICE_MAX_AGE_HOURS_RAW), 6, 168)
    : 72;
const FUEL_PRICE_HIGH_CONFIDENCE_HOURS = Math.min(24, FUEL_PRICE_MAX_AGE_HOURS);

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
    const tokenVersion = Number.isInteger(Number(user.tokenVersion)) && Number(user.tokenVersion) > 0
        ? Number(user.tokenVersion)
        : 1;

    return {
        ...user,
        id: String(user.id || ''),
        email,
        passwordHash: String(user.passwordHash || ''),
        username,
        bio: sanitizeProfileText(user.bio || '', 220),
        location: sanitizeProfileText(user.location || '', 80),
        avatarUrl,
        tokenVersion,
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

app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN, credentials: true } : { origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

const WEB_ROOT = path.resolve(__dirname, '..');
const WEB_INDEX_PATH = path.join(WEB_ROOT, 'index.html');
const HAS_WEB_CLIENT = fs.existsSync(WEB_INDEX_PATH);

function registerWebClientRoutes() {
    if (!HAS_WEB_CLIENT) return;

    const staticDirs = [
        ['assets', path.join(WEB_ROOT, 'assets')],
        ['models', path.join(WEB_ROOT, 'models')]
    ];

    staticDirs.forEach(([routePrefix, dirPath]) => {
        if (!fs.existsSync(dirPath)) return;
        app.use(`/${routePrefix}`, express.static(dirPath, { fallthrough: true }));
    });

    const staticFiles = [
        'index.html',
        'guida-costo-viaggio-auto.html',
        'guida-pedaggi-autostrada-italia.html',
        'guida-risparmio-carburante-viaggio.html',
        'style.css',
        'script.js',
        'config.public.js',
        'manifest.webmanifest',
        'sw.js',
        'car_models.json',
        'logo.png',
        'background-travel.jpg',
        'header-hero.jpg',
        'robots.txt',
        'sitemap.xml'
    ];

    staticFiles.forEach((fileName) => {
        const filePath = path.join(WEB_ROOT, fileName);
        if (!fs.existsSync(filePath)) return;
        app.get(`/${fileName}`, (_req, res) => res.sendFile(filePath));
    });

    app.get(/^\/google[0-9a-z]+\.html$/i, (req, res) => {
        const fileName = path.basename(String(req.path || '').trim());
        const filePath = path.join(WEB_ROOT, fileName);
        if (!filePath.startsWith(WEB_ROOT) || !fs.existsSync(filePath)) {
            return res.status(404).send('Not found');
        }
        return res.sendFile(filePath);
    });

    app.get('/', (_req, res) => res.sendFile(WEB_INDEX_PATH));

    // SPA fallback for non-API routes without explicit file extension.
    app.get(/^\/(?!api(?:\/|$)).+/, (req, res, next) => {
        const pathname = String(req.path || '/');
        if (path.extname(pathname)) return next();
        return res.sendFile(WEB_INDEX_PATH);
    });
}

registerWebClientRoutes();

function parseCookies(headerValue = '') {
    const raw = String(headerValue || '').trim();
    if (!raw) return {};
    return raw.split(';').reduce((acc, part) => {
        const idx = part.indexOf('=');
        if (idx <= 0) return acc;
        const key = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim();
        if (!key) return acc;
        try {
            acc[key] = decodeURIComponent(value);
        } catch (err) {
            acc[key] = value;
        }
        return acc;
    }, {});
}

function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: AUTH_COOKIE_SECURE,
        sameSite: AUTH_COOKIE_SAMESITE,
        maxAge: AUTH_COOKIE_MAX_AGE_MS,
        path: '/'
    };
}

function setAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

function clearAuthCookie(res) {
    res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        secure: AUTH_COOKIE_SECURE,
        sameSite: AUTH_COOKIE_SAMESITE,
        path: '/'
    });
}

function normalizeAiChatText(value = '', maxLen = AI_CHAT_MAX_MESSAGE_CHARS) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, Math.max(1, Number(maxLen) || AI_CHAT_MAX_MESSAGE_CHARS));
}

function formatMoney(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '-';
    return `€${amount.toFixed(2)}`;
}

function getRequestIp(req) {
    const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    return xff || req.ip || req.socket?.remoteAddress || 'unknown';
}

function isAiChatRateLimited(req) {
    const ip = getRequestIp(req);
    const now = Date.now();
    const bucket = aiChatRateBuckets.get(ip) || [];
    const recent = bucket.filter((ts) => (now - Number(ts || 0)) <= AI_CHAT_RATE_WINDOW_MS);
    if (recent.length >= AI_CHAT_RATE_MAX_REQUESTS) {
        aiChatRateBuckets.set(ip, recent);
        return true;
    }
    recent.push(now);
    aiChatRateBuckets.set(ip, recent);

    if (aiChatRateBuckets.size > 1200) {
        const threshold = now - (AI_CHAT_RATE_WINDOW_MS * 2);
        aiChatRateBuckets.forEach((arr, key) => {
            const active = (arr || []).filter((ts) => Number(ts || 0) >= threshold);
            if (!active.length) aiChatRateBuckets.delete(key);
            else aiChatRateBuckets.set(key, active);
        });
    }
    return false;
}

function buildLocalAiChatReply(message = '', context = {}) {
    const q = normalizeAiChatText(message, AI_CHAT_MAX_MESSAGE_CHARS).toLowerCase();
    const trip = context && typeof context === 'object' ? (context.trip || null) : null;
    const travelAi = context && typeof context === 'object' ? (context.travelAi || null) : null;

    if (q.includes('meteo')) {
        if (travelAi && travelAi.weatherLine) {
            return `${travelAi.weatherLine} ${travelAi.impactLine || ''}`.slice(0, AI_CHAT_MAX_REPLY_CHARS);
        }
        return 'Meteo non ancora disponibile. Calcola una tratta e poi chiedimi di nuovo il meteo sul percorso.';
    }

    if (q.includes('pedagg') || q.includes('autostrad')) {
        if (trip) {
            return `Pedaggi stimati: ${formatMoney(trip.tollCost)}. Totale tratta: ${formatMoney(trip.totalCost)}.`;
        }
        return 'Calcola prima una tratta e poi posso darti il peso preciso dei pedaggi sul costo totale.';
    }

    if (q.includes('consum') || q.includes('carbur')) {
        if (trip) {
            return `Stima attuale carburante: ${formatMoney(trip.fuelCost)} su ${Number(trip.distanceKm || 0).toFixed(0)} km.`;
        }
        return 'Posso stimare consumi e carburante appena calcoli una tratta.';
    }

    if (q.includes('conviene') || q.includes('risparm')) {
        if (travelAi && travelAi.bestWindow && travelAi.bestWindow.timeIso) {
            const dt = new Date(travelAi.bestWindow.timeIso);
            const hhmm = Number.isNaN(dt.getTime())
                ? '--:--'
                : dt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            return `Per risparmiare conviene partire verso le ${hhmm}: impatto meteo previsto circa ${Number(travelAi.bestWindow.impactPercent || 0).toFixed(1)}%.`;
        }
        return 'Per ridurre i costi: guida regolare, velocita costante, gomme alla pressione corretta e partenza fuori orari di punta.';
    }

    if (trip) {
        return `Tratta attuale: ${trip.departure || '-'} -> ${trip.arrival || '-'} (${Number(trip.distanceKm || 0).toFixed(0)} km), totale stimato ${formatMoney(trip.totalCost)}. Dimmi cosa vuoi ottimizzare.`;
    }

    return 'Posso aiutarti su meteo, pedaggi, consumi, costi e orario migliore di partenza. Fai una domanda specifica e ti rispondo subito.';
}

async function requestOpenAiChatReply(message = '', history = [], context = {}) {
    if (!OPENAI_API_KEY) return null;

    const safeMessage = normalizeAiChatText(message, AI_CHAT_MAX_MESSAGE_CHARS);
    if (!safeMessage) return null;

    const safeHistory = Array.isArray(history)
        ? history
            .map((item) => ({
                role: item && item.role === 'user' ? 'user' : 'assistant',
                text: normalizeAiChatText(item && item.text, AI_CHAT_MAX_MESSAGE_CHARS)
            }))
            .filter((item) => item.text)
            .slice(-8)
        : [];

    const contextJsonRaw = JSON.stringify(context || {});
    const contextJson = contextJsonRaw.length > 2400 ? `${contextJsonRaw.slice(0, 2400)}...` : contextJsonRaw;
    const messages = [
        {
            role: 'system',
            content: 'Sei DriveCalc AI Assistant. Rispondi in italiano, chiaro e pratico, in max 6 frasi. Usa i dati del contesto se presenti. Se manca un dato, dichiaralo senza inventare numeri.'
        },
        {
            role: 'system',
            content: `Contesto app (JSON): ${contextJson}`
        },
        ...safeHistory.map((item) => ({
            role: item.role,
            content: item.text
        })),
        {
            role: 'user',
            content: safeMessage
        }
    ];

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => {
        try {
            controller && controller.abort();
        } catch (e) {}
    }, 9200);

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                temperature: 0.2,
                messages
            }),
            signal: controller ? controller.signal : undefined
        });

        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            throw new Error(detail || `OpenAI HTTP ${res.status}`);
        }

        const payload = await res.json();
        const reply = normalizeAiChatText(payload?.choices?.[0]?.message?.content || '', AI_CHAT_MAX_REPLY_CHARS);
        return reply || null;
    } finally {
        clearTimeout(timeoutId);
    }
}

function clampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return min;
    return Math.min(max, Math.max(min, numeric));
}

function normalizeFuelSearchType(value = '') {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'benzina';
    if (raw === 'diesel' || raw === 'gasolio' || raw === 'ibrido-elettrico-diesel') return 'diesel';
    if (raw === 'gpl') return 'gpl';
    if (raw === 'metano' || raw === 'gnc' || raw === 'gnl' || raw === 'metano-benzina') return 'metano';
    return 'benzina';
}

function fuelNameMatchesType(fuelName = '', targetType = 'benzina') {
    const name = String(fuelName || '').trim().toLowerCase();
    if (!name) return false;
    const target = normalizeFuelSearchType(targetType);
    if (target === 'diesel') return name.includes('gasolio') || name.includes('diesel');
    if (target === 'gpl') return name.includes('gpl');
    if (target === 'metano') return name.includes('metano') || name.includes('gnc') || name.includes('gnl');
    return name.includes('benzina') || name.includes('super');
}

function parseFuelPrice(value) {
    if (value === null || value === undefined) return null;
    const normalized = String(value).replace(',', '.').trim();
    const amount = Number(normalized);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return Number(amount.toFixed(3));
}

function parseFuelIsSelf(value) {
    if (typeof value === 'boolean') return value;
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return null;
    if (raw === '1' || raw === 'true' || raw === 'self' || raw === 'self-service' || raw === 'self service') return true;
    if (raw === '0' || raw === 'false' || raw === 'servito' || raw === 'service') return false;
    return null;
}

function parseFuelTimestamp(value) {
    if (!value) return null;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    const normalized = String(value).trim();
    const match = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
    if (!match) return null;
    const [, dd, mm, yyyy, hh = '00', min = '00'] = match;
    const dt = new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString();
}

function computeFuelFreshness(updatedAt, nowMs = Date.now()) {
    if (!updatedAt) {
        return {
            updatedAt: null,
            ageMinutes: null,
            freshnessLevel: 'unknown',
            isRecent: false
        };
    }

    const parsedMs = Date.parse(updatedAt);
    if (!Number.isFinite(parsedMs)) {
        return {
            updatedAt: null,
            ageMinutes: null,
            freshnessLevel: 'unknown',
            isRecent: false
        };
    }

    const safeAgeMinutes = Math.max(0, Math.round((nowMs - parsedMs) / 60000));
    const ageHours = safeAgeMinutes / 60;

    let freshnessLevel = 'stale';
    if (ageHours <= 2) freshnessLevel = 'live';
    else if (ageHours <= FUEL_PRICE_HIGH_CONFIDENCE_HOURS) freshnessLevel = 'fresh';
    else if (ageHours <= FUEL_PRICE_MAX_AGE_HOURS) freshnessLevel = 'recent';

    return {
        updatedAt: new Date(parsedMs).toISOString(),
        ageMinutes: safeAgeMinutes,
        freshnessLevel,
        isRecent: ageHours <= FUEL_PRICE_MAX_AGE_HOURS
    };
}

function toRadians(value) {
    return (Number(value) * Math.PI) / 180;
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const dPhi = toRadians(Number(lat2) - Number(lat1));
    const dLambda = toRadians(Number(lng2) - Number(lng1));
    const a = Math.sin(dPhi / 2) ** 2
        + (Math.cos(phi1) * Math.cos(phi2) * (Math.sin(dLambda / 2) ** 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
}

function getStationLatLng(row = {}) {
    const location = row.location && typeof row.location === 'object' ? row.location : {};
    const lat = Number(location.lat ?? location.latitude ?? row.lat ?? row.latitude);
    const lng = Number(location.lng ?? location.lon ?? location.longitude ?? row.lng ?? row.lon ?? row.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
}

function buildStationAddress(row = {}) {
    if (typeof row.address === 'string' && row.address.trim()) return row.address.trim();
    const location = row.location && typeof row.location === 'object' ? row.location : {};
    if (typeof location.address === 'string' && location.address.trim()) return location.address.trim();

    const street = row.street || row.via || location.street || location.via || '';
    const houseNumber = row.houseNumber || row.civic || location.houseNumber || location.civic || '';
    const city = row.city || row.comune || row.town || location.city || location.comune || location.town || '';
    const province = row.province || location.province || '';
    const parts = [
        `${String(street || '').trim()} ${String(houseNumber || '').trim()}`.trim(),
        String(city || '').trim(),
        String(province || '').trim()
    ].filter(Boolean);
    return parts.join(', ');
}

function pickFuelCandidate(row = {}, fuelType = 'benzina') {
    const fuels = Array.isArray(row.fuels) ? row.fuels : [];
    if (!fuels.length) return null;

    const matches = fuels
        .filter((fuel) => fuelNameMatchesType(fuel.name || fuel.fuel || '', fuelType))
        .map((fuel) => ({
            fuelName: String(fuel.name || fuel.fuel || '').trim(),
            price: parseFuelPrice(fuel.price ?? fuel.prezzo ?? fuel.amount),
            isSelf: parseFuelIsSelf(fuel.isSelf ?? fuel.self ?? fuel.isSelfService ?? fuel.service),
            updatedAt: parseFuelTimestamp(fuel.updateDate || fuel.insertDate || fuel.date || row.insertDate || row.updateDate),
            raw: fuel
        }))
        .filter((fuel) => Number.isFinite(fuel.price));

    if (!matches.length) return null;
    matches.sort((a, b) => a.price - b.price);
    return matches[0];
}

async function fetchFuelStationsFromMimit({ lat, lng, radiusKm }) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => {
        try {
            controller && controller.abort();
        } catch (e) {}
    }, 9500);

    try {
        const payload = {
            points: [{ lat: Number(lat), lng: Number(lng) }],
            radius: Number(radiusKm)
        };
        const apiRes = await fetch(FUEL_ZONE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller ? controller.signal : undefined
        });

        if (!apiRes.ok) {
            const detail = await apiRes.text().catch(() => '');
            throw new Error(detail || `Fuel zone API HTTP ${apiRes.status}`);
        }

        const data = await apiRes.json();
        const rows = Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.items)
                ? data.items
                : Array.isArray(data)
                    ? data
                    : [];
        return rows;
    } finally {
        clearTimeout(timeoutId);
    }
}

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
    const shaped = ensureUserShape(user);
    return jwt.sign(
        { userId: shaped.id, email: shaped.email, tokenVersion: shaped.tokenVersion },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [, bearerToken] = authHeader.split(' ');
    const cookies = parseCookies(req.headers.cookie || '');
    const cookieToken = cookies[AUTH_COOKIE_NAME];
    const token = bearerToken || cookieToken;
    if (!token) return res.status(401).json({ error: 'Token mancante' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const db = readDb();
        const user = db.users.find((u) => u.id === payload.userId);
        if (!user) return res.status(401).json({ error: 'Sessione non valida' });
        if (Number(payload.tokenVersion || 0) !== Number(user.tokenVersion || 1)) {
            return res.status(401).json({ error: 'Sessione invalidata, rifai login' });
        }
        req.user = { ...payload, userId: user.id, email: user.email };
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
    setAuthCookie(res, token);
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
    setAuthCookie(res, token);
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
    user.tokenVersion = Number(user.tokenVersion || 1) + 1;
    user.updatedAt = Date.now();
    writeDb(db);
    const token = issueToken(user);
    setAuthCookie(res, token);
    return res.json({ ok: true });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.userId);
    if (user) {
        user.tokenVersion = Number(user.tokenVersion || 1) + 1;
        user.updatedAt = Date.now();
        writeDb(db);
    }
    clearAuthCookie(res);
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

app.post('/api/fuel-stations/nearby', async (req, res) => {
    const incoming = req.body || {};
    const lat = Number(incoming.lat);
    const lng = Number(incoming.lng);
    const fuelType = normalizeFuelSearchType(incoming.fuelType || 'benzina');
    const radiusKm = clampNumber(
        Number(incoming.radiusKm || 5),
        FUEL_STATION_MIN_RADIUS_KM,
        FUEL_STATION_MAX_RADIUS_KM
    );

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({ error: 'Coordinate non valide' });
    }

    try {
        const rows = await fetchFuelStationsFromMimit({ lat, lng, radiusKm });
        const fetchedAt = Date.now();
        const dedupe = new Set();
        const items = [];
        let droppedStale = 0;
        let droppedMissingUpdate = 0;

        rows.forEach((row = {}) => {
            const coords = getStationLatLng(row);
            if (!coords) return;

            const distanceKm = haversineDistanceKm(lat, lng, coords.lat, coords.lng);
            if (!Number.isFinite(distanceKm) || distanceKm > (radiusKm + 0.8)) return;

            const fuel = pickFuelCandidate(row, fuelType);
            if (!fuel || !Number.isFinite(fuel.price)) return;
            const freshness = computeFuelFreshness(fuel.updatedAt, fetchedAt);
            if (!freshness.isRecent) {
                if (freshness.freshnessLevel === 'unknown') droppedMissingUpdate += 1;
                else droppedStale += 1;
                return;
            }

            const stationId = String(row.id ?? row.idImpianto ?? row.stationId ?? '');
            const stationName = String(row.name || row.stationName || row.gestore || '').trim() || 'Benzinaio';
            const stationBrand = String(row.brand || row.marca || '').trim();
            const address = buildStationAddress(row) || 'Indirizzo non disponibile';
            const dedupeKey = stationId || `${stationName.toLowerCase()}|${coords.lat.toFixed(5)}|${coords.lng.toFixed(5)}|${fuel.price}`;
            if (dedupe.has(dedupeKey)) return;
            dedupe.add(dedupeKey);

            items.push({
                id: stationId || dedupeKey,
                name: stationName,
                brand: stationBrand || stationName,
                address,
                lat: Number(coords.lat.toFixed(6)),
                lng: Number(coords.lng.toFixed(6)),
                distanceKm: Number(distanceKm.toFixed(2)),
                price: Number(fuel.price.toFixed(3)),
                fuelName: fuel.fuelName || fuelType,
                isSelf: fuel.isSelf,
                lastUpdate: freshness.updatedAt,
                ageMinutes: freshness.ageMinutes,
                freshnessLevel: freshness.freshnessLevel,
                isReliable: true
            });
        });

        items.sort((a, b) => {
            if (a.price !== b.price) return a.price - b.price;
            const ageA = Number.isFinite(Number(a.ageMinutes)) ? Number(a.ageMinutes) : Number.MAX_SAFE_INTEGER;
            const ageB = Number.isFinite(Number(b.ageMinutes)) ? Number(b.ageMinutes) : Number.MAX_SAFE_INTEGER;
            if (ageA !== ageB) return ageA - ageB;
            if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
            return String(a.brand || a.name || '').localeCompare(String(b.brand || b.name || ''), 'it');
        });

        return res.json({
            source: 'mimit-ospz',
            center: { lat, lng },
            fuelType,
            radiusKm,
            reliableOnly: true,
            freshnessMaxHours: FUEL_PRICE_MAX_AGE_HOURS,
            items: items.slice(0, FUEL_STATION_MAX_RESULTS),
            dropped: {
                stale: droppedStale,
                missingUpdate: droppedMissingUpdate
            },
            fetchedAt,
            updatedAt: fetchedAt
        });
    } catch (err) {
        return res.status(502).json({ error: 'Ricerca benzinai temporaneamente non disponibile' });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    const incoming = req.body || {};
    const message = normalizeAiChatText(incoming.message, AI_CHAT_MAX_MESSAGE_CHARS);
    const context = incoming && typeof incoming.context === 'object' && incoming.context ? incoming.context : {};
    const history = Array.isArray(incoming.history) ? incoming.history : [];

    if (!message) {
        return res.status(400).json({ error: 'Messaggio obbligatorio' });
    }

    if (isAiChatRateLimited(req)) {
        return res.status(429).json({ error: 'Troppi messaggi in poco tempo. Riprova tra qualche secondo.' });
    }

    try {
        const remoteReply = await requestOpenAiChatReply(message, history, context);
        if (remoteReply) {
            return res.json({
                reply: remoteReply,
                source: 'openai'
            });
        }
    } catch (err) {
        // fallback locale sotto
    }

    return res.json({
        reply: buildLocalAiChatReply(message, context),
        source: 'local'
    });
});

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

app.get('/api/health/google', async (req, res) => {
    const hasGoogleKey = !!GOOGLE_MAPS_API_KEY;
    const shouldCheckUpstream = ['1', 'true', 'yes', 'on'].includes(
        String(req.query?.check || '').trim().toLowerCase()
    );
    const keyPreview = hasGoogleKey
        ? `${GOOGLE_MAPS_API_KEY.slice(0, 6)}...${GOOGLE_MAPS_API_KEY.slice(-4)}`
        : '';
    const payload = {
        ok: hasGoogleKey,
        timestamp: new Date().toISOString(),
        hasGoogleMapsApiKey: hasGoogleKey,
        googleMapsApiKeyPreview: keyPreview,
        requiredGoogleApis: [
            'Maps JavaScript API',
            'Routes API',
            'Geocoding API'
        ],
        upstreamChecked: false
    };

    if (!hasGoogleKey) {
        return res.status(503).json({
            ...payload,
            error: 'GOOGLE_MAPS_API_KEY non configurata sul server'
        });
    }

    if (!shouldCheckUpstream) {
        return res.json(payload);
    }

    try {
        const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('Roma')}&language=it&region=IT&key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
        const apiRes = await fetch(testUrl);
        const data = await apiRes.json().catch(() => ({}));
        const geocodingStatus = String(data.status || '').toUpperCase();
        const isUpstreamOk = apiRes.ok && geocodingStatus === 'OK';

        return res.status(isUpstreamOk ? 200 : 502).json({
            ...payload,
            ok: isUpstreamOk,
            upstreamChecked: true,
            geocodingStatus: geocodingStatus || 'UNKNOWN',
            geocodingErrorMessage: data.error_message || ''
        });
    } catch (err) {
        return res.status(502).json({
            ...payload,
            ok: false,
            upstreamChecked: true,
            error: 'Errore nel test upstream Google Geocoding API'
        });
    }
});

function normalizeGoogleWaypoint(input) {
    if (!input) return null;

    if (typeof input === 'string') {
        const address = input.trim();
        return address ? { address, regionCode: 'IT' } : null;
    }

    if (typeof input === 'object') {
        if (input.location && input.location.latLng) {
            const latitude = Number(input.location.latLng.latitude);
            const longitude = Number(input.location.latLng.longitude);
            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                return {
                    location: {
                        latLng: {
                            latitude,
                            longitude
                        }
                    }
                };
            }
        }

        const latitude = Number(input.lat ?? input.latitude);
        const longitude = Number(input.lng ?? input.lon ?? input.longitude);
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            return {
                location: {
                    latLng: {
                        latitude,
                        longitude
                    }
                }
            };
        }

        const address = String(input.address || input.label || '').trim();
        if (address) {
            return { address, regionCode: 'IT' };
        }
    }

    return null;
}

app.post('/api/google/routes', async (req, res) => {
    if (!GOOGLE_MAPS_API_KEY) return res.status(500).json({ error: 'Google API key mancante' });
    const incoming = req.body || {};
    const origin = normalizeGoogleWaypoint(incoming.origin);
    const destination = normalizeGoogleWaypoint(incoming.destination);
    if (!origin || !destination) return res.status(400).json({ error: 'Origin e destination obbligatori' });

    const preferredRouting = String(incoming.routingPreference || '').trim().toUpperCase();
    const allowedRoutingPreferences = new Set([
        'TRAFFIC_AWARE',
        'TRAFFIC_AWARE_OPTIMAL',
        'TRAFFIC_UNAWARE'
    ]);
    const routingPreference = allowedRoutingPreferences.has(preferredRouting)
        ? preferredRouting
        : 'TRAFFIC_AWARE';

    try {
        const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        const body = {
            origin,
            destination,
            travelMode: 'DRIVE',
            routingPreference,
            computeAlternativeRoutes: false,
            units: 'METRIC',
            languageCode: 'it-IT',
            routeModifiers: {
                avoidTolls: false,
                avoidHighways: false,
                avoidFerries: false
            }
        };
        const apiRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.tollInfo,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation,routes.legs.duration,routes.legs.staticDuration,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.navigationInstruction.instructions'
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
