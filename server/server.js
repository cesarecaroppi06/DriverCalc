const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

function readDb() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        return { users: [], favorites: {}, companions: {}, completed: {}, mycarPhotos: {} };
    }
}

function writeDb(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
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
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    const db = readDb();
    if (db.users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'Utente già registrato' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), email, passwordHash };
    db.users.push(user);
    writeDb(db);
    const token = issueToken(user);
    return res.json({ token, user: { id: user.id, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    const db = readDb();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Credenziali non valide' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenziali non valide' });
    const token = issueToken(user);
    return res.json({ token, user: { id: user.id, email: user.email } });
});

function getCollection(db, key, userId) {
    if (!db[key][userId]) db[key][userId] = [];
    return db[key][userId];
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

app.listen(PORT, () => {
    console.log(`DriveCalc API in ascolto su http://localhost:${PORT}`);
});
