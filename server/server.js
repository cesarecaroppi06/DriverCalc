const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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
const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY || '').trim();
const GEMINI_MODEL = String(process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY || '').trim();
const OPENAI_MODEL = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
const AI_CHAT_MAX_MESSAGE_CHARS = 1800;
const AI_CHAT_MAX_REPLY_CHARS = 9000;
const AI_CHAT_REMOTE_TIMEOUT_MS = 60000;
const AI_CHAT_MAX_OUTPUT_TOKENS = 3072;
const AI_CHAT_GEMINI_CONTINUATION_STEPS = 8;
const AI_CHAT_RATE_WINDOW_MS = 60 * 1000;
const AI_CHAT_RATE_MAX_REQUESTS = 12;
const AI_CHAT_HISTORY_TURNS = 14;
const AI_CHAT_CONTEXT_MAX_CHARS = 9000;
const AI_CHAT_BUDGET_TOP_ROUTES_LIMIT = 8;
const AI_CHAT_BUDGET_RECENT_TRIPS_LIMIT = 12;
const AI_CHAT_BUDGET_MEMORY_NOTES_LIMIT = 36;
const AI_BUDGET_MEMORY_MAX_HISTORY = 320;
const AI_BUDGET_MEMORY_MAX_NOTES = 420;
const AI_BUDGET_MESSAGE_MAX_CHARS = 7000;
const AI_BUDGET_NOTE_MAX_CHARS = 420;
const AI_CHAT_MEMORY_MAX_HISTORY = 320;
const AI_CHAT_MESSAGE_MAX_CHARS = 7000;
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
const AUTH_VERIFY_EMAIL_TTL_MINUTES_RAW = Number(process.env.AUTH_VERIFY_EMAIL_TTL_MINUTES);
const AUTH_VERIFY_EMAIL_TTL_MINUTES = Number.isFinite(AUTH_VERIFY_EMAIL_TTL_MINUTES_RAW) && AUTH_VERIFY_EMAIL_TTL_MINUTES_RAW > 0
    ? clampNumber(Math.round(AUTH_VERIFY_EMAIL_TTL_MINUTES_RAW), 10, 60 * 24 * 14)
    : 60 * 24;
const AUTH_RESET_PASSWORD_TTL_MINUTES_RAW = Number(process.env.AUTH_RESET_PASSWORD_TTL_MINUTES);
const AUTH_RESET_PASSWORD_TTL_MINUTES = Number.isFinite(AUTH_RESET_PASSWORD_TTL_MINUTES_RAW) && AUTH_RESET_PASSWORD_TTL_MINUTES_RAW > 0
    ? clampNumber(Math.round(AUTH_RESET_PASSWORD_TTL_MINUTES_RAW), 5, 180)
    : 30;
const PUBLIC_APP_BASE_URL = String(process.env.PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || '').trim();
const EMAIL_FROM = String(process.env.EMAIL_FROM || '').trim();
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const AUTH_EMAIL_DELIVERY_CONFIGURED = Boolean(RESEND_API_KEY && EMAIL_FROM);
const AUTH_REQUIRE_EMAIL_VERIFICATION_RAW = String(
    process.env.AUTH_REQUIRE_EMAIL_VERIFICATION || (AUTH_EMAIL_DELIVERY_CONFIGURED ? 'true' : 'false')
).trim().toLowerCase();
const AUTH_REQUIRE_EMAIL_VERIFICATION = ['1', 'true', 'yes', 'on'].includes(AUTH_REQUIRE_EMAIL_VERIFICATION_RAW);

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

function sanitizeAuthTokenEntry(entry = {}) {
    const userId = String(entry.userId || '').trim();
    const tokenHash = String(entry.tokenHash || '').trim().toLowerCase();
    const createdAt = Number(entry.createdAt) || Date.now();
    const expiresAt = Number(entry.expiresAt);
    const usedAtRaw = Number(entry.usedAt);
    const usedAt = Number.isFinite(usedAtRaw) && usedAtRaw > 0 ? usedAtRaw : 0;
    const fallbackId = `${userId}:${tokenHash.slice(0, 16)}`;
    const id = String(entry.id || fallbackId).trim();
    if (!userId) return null;
    if (!/^[a-f0-9]{64}$/.test(tokenHash)) return null;
    if (!Number.isFinite(expiresAt) || expiresAt <= 0) return null;

    return {
        id,
        userId,
        tokenHash,
        createdAt,
        expiresAt,
        usedAt
    };
}

function pruneAuthTokenEntries(entries = [], now = Date.now()) {
    if (!Array.isArray(entries)) return [];
    return entries
        .map(sanitizeAuthTokenEntry)
        .filter((entry) => entry && !entry.usedAt && Number(entry.expiresAt) > now);
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
    const emailVerified = typeof user.emailVerified === 'boolean' ? user.emailVerified : true;
    const emailVerifiedAt = emailVerified ? (Number(user.emailVerifiedAt) || createdAt) : 0;

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
        emailVerified,
        emailVerifiedAt,
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
        emailVerified: !!shaped.emailVerified,
        emailVerifiedAt: Number(shaped.emailVerifiedAt) || 0,
        createdAt: shaped.createdAt,
        lastLoginAt: shaped.lastLoginAt,
        updatedAt: shaped.updatedAt
    };
}

function ensureDbShape(db) {
    if (!db || typeof db !== 'object') db = {};
    if (!Array.isArray(db.users)) db.users = [];
    db.users = db.users.map(ensureUserShape).filter((user) => user.id && user.email && user.passwordHash);
    const now = Date.now();
    if (!db.favorites || typeof db.favorites !== 'object') db.favorites = {};
    if (!db.companions || typeof db.companions !== 'object') db.companions = {};
    if (!db.completed || typeof db.completed !== 'object') db.completed = {};
    if (!db.aiChatMemory || typeof db.aiChatMemory !== 'object') db.aiChatMemory = {};
    if (!db.aiBudgetMemory || typeof db.aiBudgetMemory !== 'object') db.aiBudgetMemory = {};
    if (!db.mycarPhotos || typeof db.mycarPhotos !== 'object') db.mycarPhotos = {};
    if (!Array.isArray(db.friendRequests)) db.friendRequests = [];
    if (!db.friendships || typeof db.friendships !== 'object') db.friendships = {};
    if (!db.shareSettings || typeof db.shareSettings !== 'object') db.shareSettings = {};
    db.emailVerificationTokens = pruneAuthTokenEntries(db.emailVerificationTokens, now);
    db.passwordResetTokens = pruneAuthTokenEntries(db.passwordResetTokens, now);
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
const SITEMAP_ROUTE_ENTRIES = [
    { path: '/', fileName: 'index.html', changefreq: 'weekly', priority: '1.0' },
    { path: '/guida-costo-viaggio-auto.html', fileName: 'guida-costo-viaggio-auto.html', changefreq: 'monthly', priority: '0.8' },
    { path: '/guida-pedaggi-autostrada-italia.html', fileName: 'guida-pedaggi-autostrada-italia.html', changefreq: 'monthly', priority: '0.8' },
    { path: '/guida-risparmio-carburante-viaggio.html', fileName: 'guida-risparmio-carburante-viaggio.html', changefreq: 'monthly', priority: '0.8' }
];

function normalizeForwardedHeaderValue(value = '') {
    const raw = String(value || '').split(',')[0].trim();
    return raw.replace(/\s+/g, '');
}

function getRequestOrigin(req) {
    const forwardedProto = normalizeForwardedHeaderValue(req?.headers?.['x-forwarded-proto']);
    const forwardedHost = normalizeForwardedHeaderValue(req?.headers?.['x-forwarded-host']);
    const host = forwardedHost || normalizeForwardedHeaderValue(req?.headers?.host);
    if (!host) return '';
    const protoCandidate = String(forwardedProto || req?.protocol || 'https').toLowerCase();
    const proto = protoCandidate === 'http' || protoCandidate === 'https' ? protoCandidate : 'https';
    return `${proto}://${host}`;
}

function escapeHtml(value = '') {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function resolvePublicAppBase(req) {
    const configuredBase = String(PUBLIC_APP_BASE_URL || '').trim();
    if (configuredBase && /^https?:\/\//i.test(configuredBase)) {
        return configuredBase.replace(/\/+$/, '');
    }

    const reqOrigin = getRequestOrigin(req);
    if (reqOrigin) return reqOrigin.replace(/\/+$/, '');

    const corsBase = String(CORS_ORIGIN || '').split(',')[0].trim();
    if (corsBase && /^https?:\/\//i.test(corsBase)) {
        return corsBase.replace(/\/+$/, '');
    }

    return '';
}

function buildAuthActionLink(req, action = '', token = '') {
    const safeAction = String(action || '').trim();
    const safeToken = String(token || '').trim();
    const base = resolvePublicAppBase(req);
    if (!base || !safeAction || !safeToken) return '';
    const url = new URL(`${base}/`);
    url.searchParams.set('authAction', safeAction);
    url.searchParams.set('token', safeToken);
    return url.toString();
}

function hashAuthToken(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return crypto.createHash('sha256').update(raw).digest('hex');
}

function createRawAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}

function createOneTimeAuthToken(db, {
    collectionKey = 'emailVerificationTokens',
    userId = '',
    ttlMinutes = 30,
    revokeExisting = false
} = {}) {
    if (!db || typeof db !== 'object') return null;
    const safeCollection = collectionKey === 'passwordResetTokens' ? 'passwordResetTokens' : 'emailVerificationTokens';
    const safeUserId = String(userId || '').trim();
    if (!safeUserId) return null;

    const now = Date.now();
    db[safeCollection] = pruneAuthTokenEntries(db[safeCollection], now);

    if (revokeExisting) {
        db[safeCollection] = db[safeCollection].filter((entry) => entry.userId !== safeUserId);
    }

    const ttlValue = Number(ttlMinutes);
    const ttlMs = (Number.isFinite(ttlValue) && ttlValue > 0 ? ttlValue : 30) * 60 * 1000;
    const rawToken = createRawAuthToken();
    const tokenHash = hashAuthToken(rawToken);
    const expiresAt = now + ttlMs;

    db[safeCollection].push({
        id: uuidv4(),
        userId: safeUserId,
        tokenHash,
        createdAt: now,
        expiresAt,
        usedAt: 0
    });

    return { rawToken, expiresAt };
}

function consumeOneTimeAuthToken(db, {
    collectionKey = 'emailVerificationTokens',
    rawToken = ''
} = {}) {
    if (!db || typeof db !== 'object') return null;
    const safeCollection = collectionKey === 'passwordResetTokens' ? 'passwordResetTokens' : 'emailVerificationTokens';
    const tokenHash = hashAuthToken(rawToken);
    if (!tokenHash) return null;

    const now = Date.now();
    db[safeCollection] = pruneAuthTokenEntries(db[safeCollection], now);
    const tokenEntry = db[safeCollection].find((entry) => entry.tokenHash === tokenHash);
    if (!tokenEntry) return null;

    tokenEntry.usedAt = now;
    return tokenEntry;
}

async function sendTransactionalEmail({
    to = '',
    subject = '',
    text = '',
    html = ''
} = {}) {
    const recipient = normalizeEmail(to);
    const safeSubject = String(subject || '').trim();
    if (!recipient || !safeSubject) {
        return { ok: false, error: 'Destinatario o soggetto mancanti' };
    }

    if (RESEND_API_KEY && EMAIL_FROM) {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: EMAIL_FROM,
                    to: [recipient],
                    subject: safeSubject,
                    text: String(text || ''),
                    html: String(html || '')
                })
            });

            if (!response.ok) {
                const detail = await response.text().catch(() => '');
                throw new Error(detail || `Resend HTTP ${response.status}`);
            }

            return { ok: true, provider: 'resend' };
        } catch (err) {
            console.error('[DriveCalc API] Errore invio email:', err.message);
            return { ok: false, error: err.message };
        }
    }

    console.log(`[DriveCalc API] Email simulata (configura RESEND_API_KEY + EMAIL_FROM): to=${recipient} subject="${safeSubject}"`);
    if (text) {
        console.log(text);
    }
    return { ok: true, simulated: true };
}

function buildVerificationEmailContent(user = {}, actionUrl = '') {
    const username = String(user.username || '').trim() || 'utente';
    const expiresHours = Math.max(1, Math.round(AUTH_VERIFY_EMAIL_TTL_MINUTES / 60));
    const safeLink = String(actionUrl || '').trim();
    const subject = 'Conferma la tua email DriveCalc';
    const fallback = 'Se non riesci a cliccare il link, copialo e aprilo nel browser.';
    const text = [
        `Ciao ${username},`,
        '',
        'Grazie per esserti registrato su DriveCalc.',
        safeLink ? `Conferma la tua email qui: ${safeLink}` : 'Link verifica non disponibile. Richiedi un nuovo link dal login.',
        '',
        `Il link scade tra ${expiresHours} ore.`,
        fallback,
        '',
        'Se non hai richiesto tu la registrazione, ignora questa email.'
    ].join('\n');

    const html = `
<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
  <h2 style="margin:0 0 12px;">Conferma il tuo account DriveCalc</h2>
  <p>Ciao <strong>${escapeHtml(username)}</strong>, grazie per esserti registrato.</p>
  <p>Per attivare l'account conferma la tua email:</p>
  <p>
    ${safeLink
        ? `<a href="${escapeHtml(safeLink)}" style="display:inline-block;padding:10px 16px;background:#0b5fff;color:#ffffff;text-decoration:none;border-radius:8px;">Conferma email</a>`
        : '<strong>Link verifica non disponibile. Richiedi un nuovo link dal login.</strong>'}
  </p>
  <p>Il link scade tra ${escapeHtml(String(expiresHours))} ore.</p>
  <p style="color:#475569;">Se non hai richiesto tu la registrazione, ignora questa email.</p>
</div>
`.trim();

    return { subject, text, html };
}

function buildPasswordResetEmailContent(user = {}, actionUrl = '') {
    const username = String(user.username || '').trim() || 'utente';
    const safeLink = String(actionUrl || '').trim();
    const subject = 'Reset password DriveCalc';
    const text = [
        `Ciao ${username},`,
        '',
        'Abbiamo ricevuto una richiesta di reset della password.',
        safeLink ? `Imposta una nuova password qui: ${safeLink}` : 'Link reset non disponibile. Richiedi un nuovo reset password.',
        '',
        `Il link scade tra ${AUTH_RESET_PASSWORD_TTL_MINUTES} minuti.`,
        '',
        'Se non sei stato tu, ignora questa email.'
    ].join('\n');

    const html = `
<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
  <h2 style="margin:0 0 12px;">Recupero password DriveCalc</h2>
  <p>Ciao <strong>${escapeHtml(username)}</strong>,</p>
  <p>abbiamo ricevuto una richiesta di reset password.</p>
  <p>
    ${safeLink
        ? `<a href="${escapeHtml(safeLink)}" style="display:inline-block;padding:10px 16px;background:#0b5fff;color:#ffffff;text-decoration:none;border-radius:8px;">Imposta nuova password</a>`
        : '<strong>Link reset non disponibile. Richiedi un nuovo reset password.</strong>'}
  </p>
  <p>Il link scade tra ${escapeHtml(String(AUTH_RESET_PASSWORD_TTL_MINUTES))} minuti.</p>
  <p style="color:#475569;">Se non sei stato tu, ignora questa email.</p>
</div>
`.trim();

    return { subject, text, html };
}

async function dispatchVerificationEmail(req, user = {}, rawToken = '') {
    const safeToken = String(rawToken || '').trim();
    if (!safeToken || !user?.email) return { ok: false, error: 'Token verifica non valido' };
    const actionUrl = buildAuthActionLink(req, 'verify-email', safeToken);
    const content = buildVerificationEmailContent(user, actionUrl);
    return sendTransactionalEmail({
        to: user.email,
        subject: content.subject,
        text: content.text,
        html: content.html
    });
}

async function dispatchPasswordResetEmail(req, user = {}, rawToken = '') {
    const safeToken = String(rawToken || '').trim();
    if (!safeToken || !user?.email) return { ok: false, error: 'Token reset non valido' };
    const actionUrl = buildAuthActionLink(req, 'reset-password', safeToken);
    const content = buildPasswordResetEmailContent(user, actionUrl);
    return sendTransactionalEmail({
        to: user.email,
        subject: content.subject,
        text: content.text,
        html: content.html
    });
}

function escapeXml(value = '') {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getSitemapLastmodDate(fileName = '') {
    const safeName = String(fileName || '').trim();
    if (!safeName) return new Date().toISOString().slice(0, 10);
    const filePath = path.join(WEB_ROOT, safeName);
    try {
        const stats = fs.statSync(filePath);
        return new Date(stats.mtimeMs || Date.now()).toISOString().slice(0, 10);
    } catch (_err) {
        return new Date().toISOString().slice(0, 10);
    }
}

function buildSitemapXml(origin = '') {
    const base = String(origin || '').replace(/\/+$/, '');
    const urlNodes = SITEMAP_ROUTE_ENTRIES.map((entry) => {
        const pathname = String(entry.path || '/').startsWith('/') ? String(entry.path || '/') : `/${entry.path}`;
        const loc = `${base}${pathname === '/' ? '/' : pathname}`;
        const lastmod = getSitemapLastmodDate(entry.fileName);
        const changefreq = escapeXml(entry.changefreq || 'monthly');
        const priority = escapeXml(entry.priority || '0.8');
        return [
            '  <url>',
            `    <loc>${escapeXml(loc)}</loc>`,
            `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
            '  </url>'
        ].join('\n');
    }).join('\n');

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        urlNodes,
        '</urlset>'
    ].join('\n');
}

function buildRobotsTxt(origin = '') {
    const base = String(origin || '').replace(/\/+$/, '');
    const sitemapPath = base ? `${base}/sitemap.xml` : '/sitemap.xml';
    return [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${sitemapPath}`
    ].join('\n');
}

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
        'budget.html',
        'companions.html',
        'friends.html',
        'fuel-finder.html',
        'ai-chat.html',
        'favorites.html',
        'security.html',
        'account.html',
        'info.html',
        'guida-costo-viaggio-auto.html',
        'guida-pedaggi-autostrada-italia.html',
        'guida-risparmio-carburante-viaggio.html',
        'style.css',
        'script.js',
        'config.public.js',
        'manifest.webmanifest',
        'sw.js',
        'car_models.json',
        'logo-96.png',
        'logo-160.png',
        'logo.png',
        'background-travel.jpg',
        'header-hero-sm.jpg',
        'header-hero.jpg',
        'header-hero-mobile-sm.jpg',
        'header-hero-mobile.jpg'
    ];

    app.get('/robots.txt', (req, res) => {
        const origin = getRequestOrigin(req);
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.type('text/plain; charset=utf-8').send(buildRobotsTxt(origin));
    });

    app.get('/sitemap.xml', (req, res) => {
        const origin = getRequestOrigin(req);
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.type('application/xml; charset=utf-8').send(buildSitemapXml(origin));
    });

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

function sanitizeAiContextLine(value = '', maxLen = 220) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, Math.max(1, Number(maxLen) || 220));
}

function parseAiNumeric(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function isBudgetAssistantContext(context = {}) {
    return !!(context && typeof context === 'object' && (context.budgetAssistant || context.budget));
}

function buildBudgetContextNarrative(context = {}) {
    if (!isBudgetAssistantContext(context)) return '';
    const budget = context && typeof context === 'object' ? (context.budget || {}) : {};
    const period = budget && typeof budget.period === 'object' ? budget.period : {};
    const range = budget && typeof budget.range === 'object' ? budget.range : {};
    const history = budget && typeof budget.history === 'object' ? budget.history : {};
    const trend = range && typeof range.trend === 'object' ? range.trend : {};
    const peakMonth = range && typeof range.peakMonth === 'object' ? range.peakMonth : null;
    const lines = [];

    const periodLabel = sanitizeAiContextLine(period.label || 'Periodo non specificato', 120);
    const periodMonths = parseAiNumeric(period.months, 0);
    const periodTrips = parseAiNumeric(range.tripsCount, 0);
    const periodTotal = parseAiNumeric(range.totalCost, 0);
    const periodFuel = parseAiNumeric(range.totalFuel, 0);
    const periodToll = parseAiNumeric(range.totalToll, 0);
    const periodKm = parseAiNumeric(range.totalKm, 0);
    const avgTrip = parseAiNumeric(range.avgCostPerTrip, 0);
    const avgMonth = parseAiNumeric(range.avgCostPerMonth, 0);

    lines.push('Modalita assistente bilancio attiva.');
    lines.push(`Periodo selezionato: ${periodLabel} (${periodMonths} mesi).`);
    lines.push(`Riepilogo periodo: ${periodTrips} tratte, totale ${formatMoney(periodTotal)}, carburante ${formatMoney(periodFuel)}, pedaggi ${formatMoney(periodToll)}, km ${periodKm.toFixed(1)}, media tratta ${formatMoney(avgTrip)}, media mese ${formatMoney(avgMonth)}.`);

    if (peakMonth) {
        lines.push(`Mese di picco: ${sanitizeAiContextLine(peakMonth.label || '-', 90)} con ${formatMoney(parseAiNumeric(peakMonth.totalCost, 0))}.`);
    }

    const trendDirection = sanitizeAiContextLine(trend.direction || 'stable', 24);
    const trendDelta = parseAiNumeric(trend.delta, 0);
    const trendPercent = parseAiNumeric(trend.percent, 0);
    lines.push(`Trend periodo: ${trendDirection}, variazione ${formatMoney(trendDelta)} (${trendPercent.toFixed(1)}%).`);

    const topRoutes = Array.isArray(range.topRoutes)
        ? range.topRoutes.slice(0, AI_CHAT_BUDGET_TOP_ROUTES_LIMIT)
        : [];
    if (topRoutes.length) {
        const routeLine = topRoutes.map((item, index) => {
            const route = sanitizeAiContextLine(item?.route || '-', 100);
            const trips = parseAiNumeric(item?.trips, 0);
            const total = parseAiNumeric(item?.totalCost, 0);
            const avg = parseAiNumeric(item?.avgCostPerTrip, 0);
            return `${index + 1}) ${route}: ${trips} tratte, totale ${formatMoney(total)}, media ${formatMoney(avg)}`;
        }).join(' | ');
        lines.push(`Top tratte periodo: ${routeLine}`);
    }

    const historyTrips = parseAiNumeric(history.tripsCount, 0);
    const historyTotal = parseAiNumeric(history.totalCost, 0);
    const historyFuel = parseAiNumeric(history.totalFuel, 0);
    const historyToll = parseAiNumeric(history.totalToll, 0);
    const historyKm = parseAiNumeric(history.totalKm, 0);
    lines.push(`Storico completo: ${historyTrips} tratte, totale ${formatMoney(historyTotal)}, carburante ${formatMoney(historyFuel)}, pedaggi ${formatMoney(historyToll)}, km ${historyKm.toFixed(1)}.`);

    const recentTrips = Array.isArray(history.recentTrips)
        ? history.recentTrips.slice(0, AI_CHAT_BUDGET_RECENT_TRIPS_LIMIT)
        : [];
    if (recentTrips.length) {
        const recentLine = recentTrips.map((trip) => {
            const departure = sanitizeAiContextLine(trip?.departure || '-', 40);
            const arrival = sanitizeAiContextLine(trip?.arrival || '-', 40);
            const total = formatMoney(parseAiNumeric(trip?.totalCost, 0));
            const dateIso = sanitizeAiContextLine(trip?.dateIso || '', 40);
            return `${dateIso || 'data-n/d'} ${departure}->${arrival} ${total}`;
        }).join(' | ');
        lines.push(`Ultime tratte: ${recentLine}`);
    }

    const memoryNotes = Array.isArray(context?.memory?.notes)
        ? context.memory.notes
            .map((note) => sanitizeAiContextLine(note, 180))
            .filter(Boolean)
            .slice(-AI_CHAT_BUDGET_MEMORY_NOTES_LIMIT)
        : [];
    if (memoryNotes.length) {
        lines.push(`Memoria conversazione (ordine cronologico): ${memoryNotes.join(' || ')}`);
    }

    return sanitizeAiContextLine(lines.join('\n'), AI_CHAT_CONTEXT_MAX_CHARS);
}

function buildAiContextNarrative(context = {}) {
    const safeContext = context && typeof context === 'object' ? context : {};
    const lines = [];

    const trip = safeContext.trip && typeof safeContext.trip === 'object' ? safeContext.trip : null;
    if (trip) {
        lines.push(`Tratta corrente: ${sanitizeAiContextLine(trip.departure || '-', 48)} -> ${sanitizeAiContextLine(trip.arrival || '-', 48)}, ${parseAiNumeric(trip.distanceKm, 0).toFixed(1)} km, totale ${formatMoney(parseAiNumeric(trip.totalCost, 0))}, carburante ${formatMoney(parseAiNumeric(trip.fuelCost, 0))}, pedaggi ${formatMoney(parseAiNumeric(trip.tollCost, 0))}.`);
    }

    const travelAi = safeContext.travelAi && typeof safeContext.travelAi === 'object' ? safeContext.travelAi : null;
    if (travelAi) {
        const weatherLine = sanitizeAiContextLine(travelAi.weatherLine || '', 220);
        const impactLine = sanitizeAiContextLine(travelAi.impactLine || '', 220);
        if (weatherLine) lines.push(`Meteo: ${weatherLine}`);
        if (impactLine) lines.push(`Impatto stimato: ${impactLine}`);
    }

    const budgetNarrative = buildBudgetContextNarrative(safeContext);
    if (budgetNarrative) {
        lines.push(budgetNarrative);
    }

    if (!lines.length) {
        const contextJson = sanitizeAiContextLine(JSON.stringify(safeContext || {}), AI_CHAT_CONTEXT_MAX_CHARS);
        lines.push(`Contesto app: ${contextJson}`);
    }

    return sanitizeAiContextLine(lines.join('\n'), AI_CHAT_CONTEXT_MAX_CHARS);
}

function buildAiSystemPrompt(context = {}) {
    const lines = [
        'Sei un assistente AI conversazionale, utile e preciso.',
        'Rispondi in italiano (o nella lingua richiesta dall utente).',
        'Quando mancano dati certi, dichiaralo chiaramente senza inventare numeri.',
        'Mantieni coerenza con il contesto disponibile.'
    ];

    if (isBudgetAssistantContext(context)) {
        lines.push(
            'Modalita attiva: Assistente Bilancio DriveCalc.',
            'Analizza i dati di bilancio e storico tratte presenti nel contesto, spiegandoli in modo chiaro.',
            'Struttura preferita: sintesi numerica iniziale, spiegazione in punti, consigli pratici.',
            'Rispondi sempre alla domanda dell utente, anche se non strettamente legata al bilancio.',
            'Usa la memoria conversazione nel contesto per mantenere continuita.'
        );
    } else {
        lines.push('Usa il contesto viaggio solo quando e pertinente alla richiesta.');
    }

    return lines.join(' ');
}

function buildLocalBudgetAiChatReply(message = '', context = {}) {
    const q = sanitizeAiContextLine(message, 220).toLowerCase();
    const budget = context && typeof context === 'object' ? (context.budget || null) : null;
    if (!budget || typeof budget !== 'object') return '';

    const period = budget.period && typeof budget.period === 'object' ? budget.period : {};
    const range = budget.range && typeof budget.range === 'object' ? budget.range : {};
    const trend = range.trend && typeof range.trend === 'object' ? range.trend : {};
    const topRoute = Array.isArray(range.topRoutes) ? range.topRoutes[0] : null;
    const peakMonth = range.peakMonth && typeof range.peakMonth === 'object' ? range.peakMonth : null;

    const summary = `Periodo ${sanitizeAiContextLine(period.label || 'selezionato', 80)}: ${parseAiNumeric(range.tripsCount, 0)} tratte, totale ${formatMoney(parseAiNumeric(range.totalCost, 0))}, carburante ${formatMoney(parseAiNumeric(range.totalFuel, 0))}, pedaggi ${formatMoney(parseAiNumeric(range.totalToll, 0))}, km ${parseAiNumeric(range.totalKm, 0).toFixed(1)}.`;
    const trendLine = `Trend ${sanitizeAiContextLine(trend.direction || 'stable', 24)}: ${formatMoney(parseAiNumeric(trend.delta, 0))} (${parseAiNumeric(trend.percent, 0).toFixed(1)}%).`;

    if (q.includes('totale') || q.includes('spesa') || q.includes('quanto')) {
        return summary;
    }

    if (q.includes('carbur')) {
        return `${summary} Carburante periodo: ${formatMoney(parseAiNumeric(range.totalFuel, 0))}.`;
    }

    if (q.includes('pedagg') || q.includes('autostrad')) {
        return `${summary} Pedaggi periodo: ${formatMoney(parseAiNumeric(range.totalToll, 0))}.`;
    }

    if (q.includes('trend') || q.includes('andamento') || q.includes('mese')) {
        const peakLine = peakMonth
            ? `Mese di picco: ${sanitizeAiContextLine(peakMonth.label || '-', 80)} (${formatMoney(parseAiNumeric(peakMonth.totalCost, 0))}).`
            : 'Mese di picco non disponibile.';
        return `${trendLine} ${peakLine}`;
    }

    if (q.includes('tratta') || q.includes('route') || q.includes('percorso')) {
        if (topRoute) {
            return `Tratta piu impattante nel periodo: ${sanitizeAiContextLine(topRoute.route || '-', 120)}, ${parseAiNumeric(topRoute.trips, 0)} tratte per ${formatMoney(parseAiNumeric(topRoute.totalCost, 0))} (media ${formatMoney(parseAiNumeric(topRoute.avgCostPerTrip, 0))}).`;
        }
        return 'Non ho abbastanza tratte nel periodo per individuare il percorso piu costoso.';
    }

    return `${summary} ${trendLine}`;
}

function buildLocalAiChatReply(message = '', context = {}) {
    const q = normalizeAiChatText(message, AI_CHAT_MAX_MESSAGE_CHARS).toLowerCase();
    const trip = context && typeof context === 'object' ? (context.trip || null) : null;
    const travelAi = context && typeof context === 'object' ? (context.travelAi || null) : null;
    const remoteUnavailable = !!(context && typeof context === 'object' && context.__remoteAiUnavailable);

    const budgetReply = buildLocalBudgetAiChatReply(q, context);
    if (budgetReply) return budgetReply.slice(0, AI_CHAT_MAX_REPLY_CHARS);

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

    if (remoteUnavailable) {
        return 'La chat AI avanzata è momentaneamente non disponibile (configurazione provider). Appena la chiave Gemini è valida posso conversare su qualsiasi argomento.';
    }
    return 'Posso conversare su qualsiasi argomento (studio, tecnologia, cultura, lavoro, viaggi). Fai una domanda e andiamo nel dettaglio.';
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
            .slice(-AI_CHAT_HISTORY_TURNS)
        : [];

    const contextNarrative = buildAiContextNarrative(context);
    const systemPrompt = buildAiSystemPrompt(context);
    const messages = [
        {
            role: 'system',
            content: systemPrompt
        },
        ...(contextNarrative ? [{
            role: 'system',
            content: `Contesto app: ${contextNarrative}`
        }] : []),
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
    }, AI_CHAT_REMOTE_TIMEOUT_MS);

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

async function requestGeminiChatReply(message = '', history = [], context = {}) {
    if (!GEMINI_API_KEY) return null;

    const safeMessage = normalizeAiChatText(message, AI_CHAT_MAX_MESSAGE_CHARS);
    if (!safeMessage) return null;
    const wantsDetailedAnswer = /dettagli|dettagliat|approfond|spiega|spiegami|analizza|analisi|paragraf|tutorial|guida|passo\s*passo|completo|esteso|almeno\s+\d+/i.test(safeMessage);

    const safeHistory = Array.isArray(history)
        ? history
            .map((item) => ({
                role: item && item.role === 'assistant' ? 'assistant' : 'user',
                text: normalizeAiChatText(item && item.text, AI_CHAT_MAX_MESSAGE_CHARS)
            }))
            .filter((item) => item.text)
            .slice(-AI_CHAT_HISTORY_TURNS)
        : [];

    const contextNarrative = buildAiContextNarrative(context);
    const systemPromptBase = buildAiSystemPrompt(context);
    const systemPrompt = [
        systemPromptBase,
        `Contesto app: ${contextNarrative}`
    ].join(' ');

    const contents = [
        ...safeHistory.map((item) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }]
        })),
        {
            role: 'user',
            parts: [{ text: safeMessage }]
        }
    ];

    const deadlineTs = Date.now() + AI_CHAT_REMOTE_TIMEOUT_MS;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    async function callGemini(turnContents = []) {
        const remainingMs = Math.max(1200, deadlineTs - Date.now());
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = setTimeout(() => {
            try {
                controller && controller.abort();
            } catch (e) {}
        }, remainingMs);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: systemPrompt }]
                    },
                    contents: turnContents,
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: AI_CHAT_MAX_OUTPUT_TOKENS
                    }
                }),
                signal: controller ? controller.signal : undefined
            });

            if (!res.ok) {
                const detail = await res.text().catch(() => '');
                throw new Error(detail || `Gemini HTTP ${res.status}`);
            }

            const payload = await res.json();
            const candidate = payload?.candidates?.[0] || {};
            const parts = candidate?.content?.parts;
            const text = Array.isArray(parts)
                ? parts.map((part) => String(part?.text || '').trim()).filter(Boolean).join('\n')
                : '';
            const finishReason = String(candidate?.finishReason || '').toUpperCase();
            return { text, finishReason };
        } finally {
            clearTimeout(timeoutId);
        }
    }

    let combinedText = '';
    let finishReason = '';
    let rollingContents = [...contents];
    for (let step = 0; step <= AI_CHAT_GEMINI_CONTINUATION_STEPS; step += 1) {
        if (Date.now() >= deadlineTs) break;
        const turn = await callGemini(rollingContents);
        const turnText = String(turn?.text || '').trim();
        if (!turnText) break;

        if (!combinedText) {
            combinedText = turnText;
        } else {
            // Evita duplicazioni quando il modello ripete l'ultima parte nel chunk successivo.
            const tail = combinedText.slice(-420).trim();
            const normalizedTurn = tail && turnText.startsWith(tail)
                ? turnText.slice(tail.length).trim()
                : turnText;
            if (normalizedTurn) combinedText = `${combinedText}\n${normalizedTurn}`.trim();
        }

        combinedText = normalizeAiChatText(combinedText, AI_CHAT_MAX_REPLY_CHARS);
        finishReason = String(turn?.finishReason || '').toUpperCase();
        const trimmedCombined = combinedText.trim();
        const endsLikeCompletedSentence = /[.!?…]["')\]]?\s*$/.test(trimmedCombined);
        const underDetailedTarget = wantsDetailedAnswer && trimmedCombined.length < 1200;
        const looksAbrupt = trimmedCombined.length < 180 || !endsLikeCompletedSentence;
        const canContinue =
            step < AI_CHAT_GEMINI_CONTINUATION_STEPS &&
            combinedText.length < (AI_CHAT_MAX_REPLY_CHARS - 120) &&
            (
                finishReason === 'MAX_TOKENS' ||
                underDetailedTarget ||
                looksAbrupt
            );
        if (!canContinue) break;

        const modelTail = combinedText.slice(-2400);
        const continuePrompt = wantsDetailedAnswer
            ? 'Continua in modo dettagliato dal punto esatto in cui eri arrivato, senza ripetere parti già scritte, fino a completare bene la richiesta.'
            : 'Continua dal punto esatto in cui eri arrivato. Non ripetere parti già scritte.';
        rollingContents = [
            ...contents,
            { role: 'model', parts: [{ text: modelTail }] },
            { role: 'user', parts: [{ text: continuePrompt }] }
        ];
    }

    return combinedText || null;
}

async function requestRemoteAiChatReply(message = '', history = [], context = {}) {
    try {
        const geminiReply = await requestGeminiChatReply(message, history, context);
        if (geminiReply) return { reply: geminiReply, source: 'gemini' };
    } catch (err) {
        console.warn('[AI] Gemini unavailable:', String(err?.message || 'unknown error').slice(0, 220));
    }

    try {
        const openAiReply = await requestOpenAiChatReply(message, history, context);
        if (openAiReply) return { reply: openAiReply, source: 'openai' };
    } catch (err) {
        console.warn('[AI] OpenAI unavailable:', String(err?.message || 'unknown error').slice(0, 220));
    }

    return null;
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
    const shouldRequireEmailVerification = AUTH_REQUIRE_EMAIL_VERIFICATION;
    const safeUsername = sanitizeUsername(rawUsername, { fallback: deriveUsernameFromEmail(normalizedEmail) });
    const user = ensureUserShape({
        id: uuidv4(),
        email: normalizedEmail,
        passwordHash,
        username: safeUsername,
        bio: '',
        location: '',
        avatarUrl: '',
        emailVerified: !shouldRequireEmailVerification,
        emailVerifiedAt: shouldRequireEmailVerification ? 0 : now,
        createdAt: now,
        lastLoginAt: now,
        updatedAt: now
    });
    db.users.push(user);
    getShareSettings(db, user.id);

    if (!shouldRequireEmailVerification) {
        writeDb(db);
        const token = issueToken(user);
        const stats = computeUserStats(db, user.id);
        setAuthCookie(res, token);
        return res.status(201).json({
            ok: true,
            token,
            user: buildPublicUser(user),
            stats,
            requiresEmailVerification: false,
            message: 'Registrazione completata. Accesso eseguito.'
        });
    }

    const verificationToken = createOneTimeAuthToken(db, {
        collectionKey: 'emailVerificationTokens',
        userId: user.id,
        ttlMinutes: AUTH_VERIFY_EMAIL_TTL_MINUTES,
        revokeExisting: true
    });
    writeDb(db);

    const emailResult = await dispatchVerificationEmail(req, user, verificationToken?.rawToken || '');
    if (!emailResult.ok) {
        console.error(`[DriveCalc API] Invio email verifica fallito per ${user.email}: ${emailResult.error || 'errore sconosciuto'}`);
    }

    return res.status(201).json({
        ok: true,
        email: user.email,
        requiresEmailVerification: true,
        verificationEmailSent: !!emailResult.ok,
        message: emailResult.ok
            ? 'Registrazione completata. Controlla la tua email per verificare l’account.'
            : 'Registrazione completata. Invio email temporaneamente non disponibile: usa "Password dimenticata?" o richiedi un nuovo link.'
    });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password, identifier } = req.body || {};
    const rawIdentifier = String(identifier || email || '').trim();
    const normalizedEmail = normalizeEmail(rawIdentifier);
    const normalizedIdentifier = rawIdentifier.toLowerCase();
    const rawPassword = String(password || '');
    if (!rawIdentifier || !rawPassword) return res.status(400).json({ error: 'Nome utente/email e password sono obbligatori' });
    const db = readDb();
    const user = db.users.find((u) => (
        u.email === normalizedEmail
        || String(u.username || '').trim().toLowerCase() === normalizedIdentifier
    ));
    if (!user) return res.status(401).json({ error: 'Credenziali non valide' });
    const ok = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenziali non valide' });
    if (AUTH_REQUIRE_EMAIL_VERIFICATION && !user.emailVerified) {
        return res.status(403).json({
            error: 'Email non verificata. Controlla la tua casella o richiedi un nuovo link di verifica.',
            code: 'EMAIL_NOT_VERIFIED'
        });
    }
    user.lastLoginAt = Date.now();
    user.updatedAt = Date.now();
    writeDb(db);
    const token = issueToken(user);
    const stats = computeUserStats(db, user.id);
    setAuthCookie(res, token);
    return res.json({ token, user: buildPublicUser(user), stats });
});

app.post('/api/auth/verify-email', async (req, res) => {
    const rawToken = String((req.body || {}).token || '').trim();
    if (!rawToken) return res.status(400).json({ error: 'Token di verifica mancante' });

    const db = readDb();
    const tokenEntry = consumeOneTimeAuthToken(db, {
        collectionKey: 'emailVerificationTokens',
        rawToken
    });
    if (!tokenEntry) return res.status(400).json({ error: 'Token non valido o scaduto' });

    const user = db.users.find((u) => u.id === tokenEntry.userId);
    if (!user) {
        writeDb(db);
        return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = Date.now();
    user.updatedAt = Date.now();
    db.emailVerificationTokens = db.emailVerificationTokens.filter((entry) => entry.userId !== user.id);
    writeDb(db);

    return res.json({
        ok: true,
        message: 'Email verificata con successo. Ora puoi accedere.',
        user: buildPublicUser(user)
    });
});

app.post('/api/auth/resend-verification', async (req, res) => {
    if (!AUTH_REQUIRE_EMAIL_VERIFICATION) {
        return res.json({ ok: true, message: 'Verifica email non richiesta in questo ambiente.' });
    }

    const { email, identifier } = req.body || {};
    const rawIdentifier = String(identifier || email || '').trim();
    if (!rawIdentifier) {
        return res.status(400).json({ error: 'Inserisci email o username' });
    }

    const normalizedEmail = normalizeEmail(rawIdentifier);
    const normalizedIdentifier = rawIdentifier.toLowerCase();
    const db = readDb();
    const user = db.users.find((u) => (
        u.email === normalizedEmail
        || String(u.username || '').trim().toLowerCase() === normalizedIdentifier
    ));

    if (!user) {
        return res.json({
            ok: true,
            message: 'Se l’account esiste, abbiamo inviato una nuova email di verifica.'
        });
    }

    if (user.emailVerified) {
        return res.json({
            ok: true,
            alreadyVerified: true,
            message: 'Email già verificata. Puoi accedere.'
        });
    }

    const verificationToken = createOneTimeAuthToken(db, {
        collectionKey: 'emailVerificationTokens',
        userId: user.id,
        ttlMinutes: AUTH_VERIFY_EMAIL_TTL_MINUTES,
        revokeExisting: true
    });
    writeDb(db);

    const emailResult = await dispatchVerificationEmail(req, user, verificationToken?.rawToken || '');
    if (!emailResult.ok) {
        return res.status(500).json({ error: 'Impossibile inviare la email di verifica al momento' });
    }

    return res.json({ ok: true, message: 'Nuova email di verifica inviata' });
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email, identifier } = req.body || {};
    const rawIdentifier = String(identifier || email || '').trim();
    if (!rawIdentifier) {
        return res.status(400).json({ error: 'Inserisci email o username' });
    }

    const normalizedEmail = normalizeEmail(rawIdentifier);
    const normalizedIdentifier = rawIdentifier.toLowerCase();
    const db = readDb();
    const user = db.users.find((u) => (
        u.email === normalizedEmail
        || String(u.username || '').trim().toLowerCase() === normalizedIdentifier
    ));

    const genericMessage = 'Se l’account esiste, riceverai una email con le istruzioni per il reset password.';
    if (!user) {
        return res.json({ ok: true, message: genericMessage });
    }

    if (AUTH_REQUIRE_EMAIL_VERIFICATION && !user.emailVerified) {
        const verifyToken = createOneTimeAuthToken(db, {
            collectionKey: 'emailVerificationTokens',
            userId: user.id,
            ttlMinutes: AUTH_VERIFY_EMAIL_TTL_MINUTES,
            revokeExisting: true
        });
        writeDb(db);
        const verifyEmailResult = await dispatchVerificationEmail(req, user, verifyToken?.rawToken || '');
        if (!verifyEmailResult.ok) {
            return res.status(500).json({ error: 'Impossibile inviare la email di verifica al momento' });
        }
        return res.json({ ok: true, message: genericMessage });
    }

    const resetToken = createOneTimeAuthToken(db, {
        collectionKey: 'passwordResetTokens',
        userId: user.id,
        ttlMinutes: AUTH_RESET_PASSWORD_TTL_MINUTES,
        revokeExisting: true
    });
    writeDb(db);

    const resetEmailResult = await dispatchPasswordResetEmail(req, user, resetToken?.rawToken || '');
    if (!resetEmailResult.ok) {
        return res.status(500).json({ error: 'Impossibile inviare la email di reset password al momento' });
    }

    return res.json({ ok: true, message: genericMessage });
});

app.post('/api/auth/reset-password', async (req, res) => {
    const rawToken = String((req.body || {}).token || '').trim();
    const newPassword = String((req.body || {}).newPassword || '');

    if (!rawToken || !newPassword) {
        return res.status(400).json({ error: 'Token e nuova password sono obbligatori' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La nuova password deve avere almeno 6 caratteri' });
    }

    const db = readDb();
    const tokenEntry = consumeOneTimeAuthToken(db, {
        collectionKey: 'passwordResetTokens',
        rawToken
    });
    if (!tokenEntry) return res.status(400).json({ error: 'Token reset non valido o scaduto' });

    const user = db.users.find((u) => u.id === tokenEntry.userId);
    if (!user) {
        writeDb(db);
        return res.status(400).json({ error: 'Token reset non valido o scaduto' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = Number(user.tokenVersion || 1) + 1;
    user.updatedAt = Date.now();
    db.passwordResetTokens = db.passwordResetTokens.filter((entry) => entry.userId !== user.id);
    writeDb(db);
    clearAuthCookie(res);

    return res.json({
        ok: true,
        message: 'Password aggiornata. Ora puoi accedere con la nuova password.'
    });
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

function buildAiChatMessageKey(item = {}) {
    return `${item.role || 'assistant'}|${Number(item.timestamp) || 0}|${String(item.text || '')}`;
}

function normalizeAiChatMemoryItem(item = {}) {
    const role = item && item.role === 'user' ? 'user' : 'assistant';
    const maxLen = role === 'user' ? AI_CHAT_MAX_MESSAGE_CHARS : AI_CHAT_MESSAGE_MAX_CHARS;
    const text = normalizeAiChatText(item && item.text, maxLen);
    if (!text) return null;

    const rawTimestamp = Number(item && item.timestamp);
    const timestamp = Number.isFinite(rawTimestamp) && rawTimestamp > 0
        ? Math.round(rawTimestamp)
        : Date.now();
    return { role, text, timestamp };
}

function normalizeAiChatMemoryShape(memory = {}) {
    const safe = memory && typeof memory === 'object' ? memory : {};
    const history = Array.isArray(safe.history)
        ? safe.history
            .map((item) => normalizeAiChatMemoryItem(item))
            .filter(Boolean)
            .slice(-AI_CHAT_MEMORY_MAX_HISTORY)
        : [];
    const updatedAtRaw = Number(safe.updatedAt);
    const updatedAt = Number.isFinite(updatedAtRaw) && updatedAtRaw > 0 ? Math.round(updatedAtRaw) : Date.now();
    return { history, updatedAt };
}

function getAiChatMemoryStore(db, userId) {
    if (!db.aiChatMemory || typeof db.aiChatMemory !== 'object') {
        db.aiChatMemory = {};
    }
    const existing = db.aiChatMemory[userId];
    const normalized = normalizeAiChatMemoryShape(existing || {});
    db.aiChatMemory[userId] = normalized;
    return normalized;
}

function appendAiChatMemory(store = {}, incoming = {}) {
    const memory = normalizeAiChatMemoryShape(store);
    const sourceMessages = Array.isArray(incoming?.messages) ? incoming.messages : [];
    const existingMessageKeys = new Set(memory.history.map((item) => buildAiChatMessageKey(item)));

    sourceMessages
        .map((item) => normalizeAiChatMemoryItem(item))
        .filter(Boolean)
        .forEach((item) => {
            const key = buildAiChatMessageKey(item);
            if (existingMessageKeys.has(key)) return;
            existingMessageKeys.add(key);
            memory.history.push(item);
        });

    if (memory.history.length > AI_CHAT_MEMORY_MAX_HISTORY) {
        memory.history = memory.history.slice(-AI_CHAT_MEMORY_MAX_HISTORY);
    }

    memory.updatedAt = Date.now();
    return memory;
}

function buildBudgetAiMessageKey(item = {}) {
    return `${item.role || 'assistant'}|${Number(item.timestamp) || 0}|${String(item.text || '')}`;
}

function normalizeBudgetAiHistoryItem(item = {}) {
    const role = item && item.role === 'user' ? 'user' : 'assistant';
    const text = normalizeAiChatText(item && item.text, AI_BUDGET_MESSAGE_MAX_CHARS);
    if (!text) return null;

    const rawTimestamp = Number(item && item.timestamp);
    const timestamp = Number.isFinite(rawTimestamp) && rawTimestamp > 0
        ? Math.round(rawTimestamp)
        : Date.now();
    return { role, text, timestamp };
}

function normalizeBudgetAiNote(note = '') {
    const text = normalizeAiChatText(note, AI_BUDGET_NOTE_MAX_CHARS);
    return text || '';
}

function normalizeBudgetAiMemoryShape(memory = {}) {
    const safe = memory && typeof memory === 'object' ? memory : {};
    const history = Array.isArray(safe.history)
        ? safe.history
            .map((item) => normalizeBudgetAiHistoryItem(item))
            .filter(Boolean)
            .slice(-AI_BUDGET_MEMORY_MAX_HISTORY)
        : [];
    const notes = Array.isArray(safe.notes)
        ? safe.notes
            .map((item) => normalizeBudgetAiNote(item))
            .filter(Boolean)
            .slice(-AI_BUDGET_MEMORY_MAX_NOTES)
        : [];
    const updatedAtRaw = Number(safe.updatedAt);
    const updatedAt = Number.isFinite(updatedAtRaw) && updatedAtRaw > 0 ? Math.round(updatedAtRaw) : Date.now();
    return { history, notes, updatedAt };
}

function getBudgetAiMemoryStore(db, userId) {
    if (!db.aiBudgetMemory || typeof db.aiBudgetMemory !== 'object') {
        db.aiBudgetMemory = {};
    }
    const existing = db.aiBudgetMemory[userId];
    const normalized = normalizeBudgetAiMemoryShape(existing || {});
    db.aiBudgetMemory[userId] = normalized;
    return normalized;
}

function appendBudgetAiMemory(store = {}, incoming = {}) {
    const memory = normalizeBudgetAiMemoryShape(store);
    const sourceMessages = Array.isArray(incoming?.messages) ? incoming.messages : [];
    const sourceNotes = Array.isArray(incoming?.notes) ? incoming.notes : [];

    const existingMessageKeys = new Set(memory.history.map((item) => buildBudgetAiMessageKey(item)));
    sourceMessages
        .map((item) => normalizeBudgetAiHistoryItem(item))
        .filter(Boolean)
        .forEach((item) => {
            const key = buildBudgetAiMessageKey(item);
            if (existingMessageKeys.has(key)) return;
            existingMessageKeys.add(key);
            memory.history.push(item);
        });

    if (memory.history.length > AI_BUDGET_MEMORY_MAX_HISTORY) {
        memory.history = memory.history.slice(-AI_BUDGET_MEMORY_MAX_HISTORY);
    }

    const seenNotes = new Set(memory.notes.map((item) => String(item)));
    sourceNotes
        .map((item) => normalizeBudgetAiNote(item))
        .filter(Boolean)
        .forEach((note) => {
            if (seenNotes.has(note)) return;
            seenNotes.add(note);
            memory.notes.push(note);
        });

    if (memory.notes.length > AI_BUDGET_MEMORY_MAX_NOTES) {
        memory.notes = memory.notes.slice(-AI_BUDGET_MEMORY_MAX_NOTES);
    }

    memory.updatedAt = Date.now();
    return memory;
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

function sanitizeCompanionName(value = '') {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 80);
}

function normalizeCompanionParticipants(incoming = {}, db = {}, ownerUserId = '') {
    const sourceDetails = Array.isArray(incoming.participantDetails) && incoming.participantDetails.length
        ? incoming.participantDetails
        : Array.isArray(incoming.participants)
            ? incoming.participants.map((name) => ({ name }))
            : [];
    const ownerFriendIds = new Set(getFriendList(db, ownerUserId).map((id) => String(id)));
    const participants = [];
    const seenRegistered = new Set();
    const seenGuests = new Set();

    const pushGuest = (rawName) => {
        const name = sanitizeCompanionName(rawName);
        if (!name) return;
        const guestKey = name.toLowerCase();
        if (seenGuests.has(guestKey)) return;
        seenGuests.add(guestKey);
        participants.push({
            type: 'guest',
            friendId: '',
            name,
            email: '',
            avatarUrl: ''
        });
    };

    const pushRegistered = (rawFriendId) => {
        const friendId = String(rawFriendId || '').trim();
        if (!friendId) return;
        if (!ownerFriendIds.has(friendId)) return;
        if (seenRegistered.has(friendId)) return;
        const friendUser = db.users.find((u) => u.id === friendId);
        if (!friendUser) return;
        seenRegistered.add(friendId);
        participants.push({
            type: 'registered',
            friendId: friendUser.id,
            name: sanitizeCompanionName(friendUser.username || friendUser.email || 'Amico'),
            email: String(friendUser.email || '').trim(),
            avatarUrl: String(friendUser.avatarUrl || '')
        });
    };

    sourceDetails.forEach((item) => {
        if (typeof item === 'string') {
            pushGuest(item);
            return;
        }

        if (!item || typeof item !== 'object') return;
        const friendIdCandidate = String(item.friendId || item.id || '').trim();
        const rawType = String(item.type || '').trim().toLowerCase();
        if (friendIdCandidate && (rawType === 'registered' || ownerFriendIds.has(friendIdCandidate))) {
            pushRegistered(friendIdCandidate);
            return;
        }

        const guestName = item.name || item.username || item.email || '';
        pushGuest(guestName);
    });

    const explicitSharedFriendIds = Array.isArray(incoming.sharedFriendIds) ? incoming.sharedFriendIds : [];
    explicitSharedFriendIds.forEach((friendId) => pushRegistered(friendId));

    return participants;
}

function computeCompanionShareValue(totalCost, participantsCount, fallbackValue = '0.00') {
    const count = Math.max(0, Number(participantsCount) || 0);
    const parsedTotal = Number.parseFloat(totalCost);
    if (count > 0 && Number.isFinite(parsedTotal)) {
        return (parsedTotal / count).toFixed(2);
    }
    const parsedFallback = Number.parseFloat(fallbackValue);
    if (Number.isFinite(parsedFallback)) return parsedFallback.toFixed(2);
    return '0.00';
}

function upsertIncomingCompanionShare(db, {
    friendId = '',
    sourceTrip = {},
    ownerUser = {}
} = {}) {
    const safeFriendId = String(friendId || '').trim();
    if (!safeFriendId) return;
    const sourceTripId = String(sourceTrip.tripId || '').trim();
    if (!sourceTripId) return;
    const ownerUserId = String(ownerUser.id || '').trim();
    if (!ownerUserId || safeFriendId === ownerUserId) return;

    const mirrorTripId = `${sourceTripId}::shared-by::${ownerUserId}`;
    const targetItems = getCollection(db, 'companions', safeFriendId);
    const now = Date.now();
    const existingIdx = targetItems.findIndex((item) => (
        String(item.tripId || '') === mirrorTripId
        || (
            String(item.sourceTripId || '') === sourceTripId
            && String(item.sharedByUserId || '') === ownerUserId
        )
    ));
    const existing = existingIdx >= 0 ? targetItems[existingIdx] : null;

    const mirrorEntry = {
        ...sourceTrip,
        tripId: mirrorTripId,
        sourceTripId,
        isIncomingShare: true,
        sharedByUserId: ownerUserId,
        sharedByUsername: String(ownerUser.username || ''),
        sharedByEmail: String(ownerUser.email || ''),
        sharedAt: now,
        createdAt: Number(existing?.createdAt) || now,
        updatedAt: now
    };

    if (existingIdx >= 0) targetItems[existingIdx] = mirrorEntry;
    else targetItems.unshift(mirrorEntry);
}

function removeIncomingCompanionShare(db, {
    friendId = '',
    ownerUserId = '',
    sourceTripId = ''
} = {}) {
    const safeFriendId = String(friendId || '').trim();
    const safeOwnerUserId = String(ownerUserId || '').trim();
    const safeSourceTripId = String(sourceTripId || '').trim();
    if (!safeFriendId || !safeOwnerUserId || !safeSourceTripId) return;

    const items = getCollection(db, 'companions', safeFriendId);
    db.companions[safeFriendId] = items.filter((item) => !(
        String(item.sharedByUserId || '') === safeOwnerUserId
        && String(item.sourceTripId || '') === safeSourceTripId
    ));
}

app.get('/api/companions', authMiddleware, (req, res) => {
    const db = readDb();
    const items = getCollection(db, 'companions', req.user.userId);
    return res.json({ items });
});

app.post('/api/companions', authMiddleware, (req, res) => {
    const db = readDb();
    const ownerUser = db.users.find((u) => u.id === req.user.userId);
    if (!ownerUser) return res.status(404).json({ error: 'Utente non trovato' });

    const ownerItems = getCollection(db, 'companions', req.user.userId);
    const incoming = req.body || {};
    const tripId = String(incoming.tripId || Date.now());
    const existingIdx = ownerItems.findIndex((item) => String(item.tripId || '') === tripId);
    const previousOwnerEntry = existingIdx >= 0 ? ownerItems[existingIdx] : null;
    const participants = normalizeCompanionParticipants(incoming, db, req.user.userId);
    if (!participants.length) {
        return res.status(400).json({ error: 'Aggiungi almeno un partecipante' });
    }

    const sharedFriendIds = participants
        .filter((participant) => participant.type === 'registered' && participant.friendId)
        .map((participant) => String(participant.friendId));
    const participantsCount = participants.length;
    const participantsNames = participants.map((participant) => participant.name);
    const now = Date.now();
    const normalizedOwnerEntry = {
        ...incoming,
        tripId,
        type: 'shared',
        participants: participantsNames,
        participantDetails: participants,
        participantsCount,
        sharedFriendIds,
        perPerson: computeCompanionShareValue(incoming.totalCost, participantsCount, incoming.perPerson),
        ownerUserId: ownerUser.id,
        ownerUsername: ownerUser.username,
        ownerEmail: ownerUser.email,
        sourceTripId: tripId,
        isIncomingShare: false,
        createdAt: Number(previousOwnerEntry?.createdAt) || Number(incoming.createdAt) || now,
        updatedAt: now
    };

    if (existingIdx >= 0) ownerItems[existingIdx] = normalizedOwnerEntry;
    else ownerItems.unshift(normalizedOwnerEntry);

    const previousSharedFriendIds = Array.isArray(previousOwnerEntry?.sharedFriendIds)
        ? previousOwnerEntry.sharedFriendIds.map((id) => String(id))
        : [];
    const nextSharedIdSet = new Set(sharedFriendIds);
    previousSharedFriendIds
        .filter((friendId) => !nextSharedIdSet.has(friendId))
        .forEach((friendId) => {
            removeIncomingCompanionShare(db, {
                friendId,
                ownerUserId: ownerUser.id,
                sourceTripId: tripId
            });
        });

    sharedFriendIds.forEach((friendId) => {
        upsertIncomingCompanionShare(db, {
            friendId,
            sourceTrip: normalizedOwnerEntry,
            ownerUser
        });
    });

    writeDb(db);
    return res.json({ item: normalizedOwnerEntry });
});

app.delete('/api/companions/:tripId', authMiddleware, (req, res) => {
    const db = readDb();
    const items = getCollection(db, 'companions', req.user.userId);
    const tripId = String(req.params.tripId || '');
    const idx = items.findIndex((item) => String(item.tripId || '') === tripId);
    if (idx < 0) {
        return res.status(404).json({ error: 'Elemento non trovato' });
    }

    const removedEntry = items[idx];
    items.splice(idx, 1);

    const isOwnerEntry = !removedEntry?.isIncomingShare
        && String(removedEntry?.ownerUserId || req.user.userId) === String(req.user.userId);
    if (isOwnerEntry) {
        const explicitShared = Array.isArray(removedEntry.sharedFriendIds)
            ? removedEntry.sharedFriendIds.map((id) => String(id))
            : [];
        const ownerFriendIds = getFriendList(db, req.user.userId).map((id) => String(id));
        const targets = new Set([...explicitShared, ...ownerFriendIds]);
        targets.forEach((friendId) => {
            removeIncomingCompanionShare(db, {
                friendId,
                ownerUserId: req.user.userId,
                sourceTripId: tripId
            });
        });
    }

    writeDb(db);
    return res.json({ ok: true });
});

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

['favorites', 'completed'].forEach(addCrudRoutes);

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

app.get('/api/health/ai', async (req, res) => {
    const hasGemini = !!GEMINI_API_KEY;
    const hasOpenAi = !!OPENAI_API_KEY;
    const shouldCheckUpstream = ['1', 'true', 'yes', 'on'].includes(
        String(req.query?.check || '').trim().toLowerCase()
    );

    const payload = {
        ok: hasGemini || hasOpenAi,
        timestamp: new Date().toISOString(),
        providerPriority: ['gemini', 'openai', 'local'],
        activeProvider: hasGemini ? 'gemini' : (hasOpenAi ? 'openai' : 'local'),
        hasGeminiApiKey: hasGemini,
        geminiModel: GEMINI_MODEL,
        hasOpenAiApiKey: hasOpenAi,
        upstreamChecked: false
    };

    if (!shouldCheckUpstream) {
        return res.json(payload);
    }

    if (hasGemini) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
            const apiRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
                    generationConfig: { maxOutputTokens: 8, temperature: 0 }
                })
            });
            if (apiRes.ok) {
                return res.json({
                    ...payload,
                    ok: true,
                    upstreamChecked: true,
                    geminiStatus: 'OK'
                });
            }
            const detail = await apiRes.text().catch(() => '');
            return res.status(502).json({
                ...payload,
                ok: false,
                upstreamChecked: true,
                geminiStatus: 'ERROR',
                geminiError: (detail || `Gemini HTTP ${apiRes.status}`).slice(0, 500)
            });
        } catch (err) {
            return res.status(502).json({
                ...payload,
                ok: false,
                upstreamChecked: true,
                geminiStatus: 'ERROR',
                geminiError: String(err?.message || 'Gemini request failed').slice(0, 500)
            });
        }
    }

    return res.status(hasOpenAi ? 200 : 503).json({
        ...payload,
        ok: hasOpenAi,
        upstreamChecked: true,
        geminiStatus: hasGemini ? 'UNKNOWN' : 'MISSING_KEY'
    });
});

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

    const remoteReply = await requestRemoteAiChatReply(message, history, context);
    if (remoteReply) return res.json(remoteReply);

    return res.json({
        reply: buildLocalAiChatReply(message, {
            ...context,
            __remoteAiUnavailable: true
        }),
        source: 'local'
    });
});

app.get('/api/ai/chat-memory', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getAiChatMemoryStore(db, req.user.userId);
    writeDb(db);
    return res.json({ memory });
});

app.post('/api/ai/chat-memory/append', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getAiChatMemoryStore(db, req.user.userId);
    const incoming = req.body || {};
    const nextMemory = appendAiChatMemory(memory, incoming);
    db.aiChatMemory[req.user.userId] = nextMemory;
    writeDb(db);
    return res.json({ memory: nextMemory });
});

app.post('/api/ai/chat-memory/reset', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getAiChatMemoryStore(db, req.user.userId);
    memory.history = [];
    memory.updatedAt = Date.now();
    db.aiChatMemory[req.user.userId] = memory;
    writeDb(db);
    return res.json({ memory });
});

app.get('/api/ai/budget-memory', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getBudgetAiMemoryStore(db, req.user.userId);
    writeDb(db);
    return res.json({ memory });
});

app.post('/api/ai/budget-memory/append', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getBudgetAiMemoryStore(db, req.user.userId);
    const incoming = req.body || {};
    const nextMemory = appendBudgetAiMemory(memory, incoming);
    db.aiBudgetMemory[req.user.userId] = nextMemory;
    writeDb(db);
    return res.json({ memory: nextMemory });
});

app.post('/api/ai/budget-memory/reset-history', authMiddleware, (req, res) => {
    const db = readDb();
    const memory = getBudgetAiMemoryStore(db, req.user.userId);
    memory.history = [];
    memory.updatedAt = Date.now();
    db.aiBudgetMemory[req.user.userId] = memory;
    writeDb(db);
    return res.json({ memory });
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
            'Geocoding API',
            'Places API (New)'
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

app.get('/api/google/place-autocomplete', async (req, res) => {
    if (!GOOGLE_MAPS_API_KEY) return res.status(500).json({ error: 'Google API key mancante' });
    const input = String(req.query.input || '').trim();
    if (!input || input.length < 2) {
        return res.json({ status: 'INVALID_REQUEST', predictions: [] });
    }

    const languageCode = String(req.query.languageCode || 'it').trim() || 'it';
    const regionCode = String(req.query.regionCode || '').trim().toUpperCase();

    const mapAutocompletePredictions = (payload = {}) => {
        const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
        return suggestions
            .map((item) => item?.placePrediction)
            .filter(Boolean)
            .map((prediction = {}) => {
                const placeId = String(
                    prediction.placeId ||
                    String(prediction.place || '').replace(/^places\//, '')
                ).trim();
                const description = String(prediction?.text?.text || '').trim();
                const mainText = String(prediction?.structuredFormat?.mainText?.text || '').trim();
                const secondaryText = String(prediction?.structuredFormat?.secondaryText?.text || '').trim();
                return {
                    place_id: placeId,
                    description: description || [mainText, secondaryText].filter(Boolean).join(', '),
                    structured_formatting: {
                        main_text: mainText || description || placeId,
                        secondary_text: secondaryText || ''
                    }
                };
            })
            .filter((item) => item.place_id && item.description);
    };

    const mapSearchTextPredictions = (payload = {}) => {
        const places = Array.isArray(payload?.places) ? payload.places : [];
        return places.map((place = {}) => {
            const placeId = String(place.id || '').trim();
            const mainText = String(place?.displayName?.text || '').trim();
            const secondaryText = String(place?.formattedAddress || '').trim();
            return {
                place_id: placeId,
                description: [mainText, secondaryText].filter(Boolean).join(', ') || mainText || secondaryText || placeId,
                structured_formatting: {
                    main_text: mainText || secondaryText || placeId,
                    secondary_text: secondaryText || ''
                }
            };
        }).filter((item) => item.place_id && item.description);
    };

    try {
        const autocompleteBody = {
            input,
            languageCode
        };
        if (regionCode) autocompleteBody.regionCode = regionCode;

        let predictions = [];
        let autocompleteErrorDetail = '';

        try {
            const apiRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                    'X-Goog-FieldMask': 'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat.mainText,suggestions.placePrediction.structuredFormat.secondaryText'
                },
                body: JSON.stringify(autocompleteBody)
            });
            if (!apiRes.ok) {
                autocompleteErrorDetail = await apiRes.text().catch(() => '');
            } else {
                const data = await apiRes.json();
                predictions = mapAutocompletePredictions(data);
            }
        } catch (err) {
            autocompleteErrorDetail = String(err?.message || 'Autocomplete request failed');
        }

        // Amplia i risultati con Text Search per coprire più POI reali (bar, ristoranti, negozi, monumenti, ecc.)
        if (predictions.length < 8) {
            const searchBody = {
                textQuery: input,
                languageCode
            };
            if (regionCode) searchBody.regionCode = regionCode;
            try {
                const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location'
                    },
                    body: JSON.stringify(searchBody)
                });
                if (searchRes.ok) {
                    const searchData = await searchRes.json();
                    const searchPredictions = mapSearchTextPredictions(searchData);
                    const seen = new Set(predictions.map((item) => String(item.place_id).toLowerCase()));
                    searchPredictions.forEach((item) => {
                        const key = String(item.place_id || '').toLowerCase();
                        if (!key || seen.has(key)) return;
                        seen.add(key);
                        predictions.push(item);
                    });
                } else if (!predictions.length) {
                    const searchErr = await searchRes.text().catch(() => '');
                    return res.status(502).json({
                        error: 'Errore Places API',
                        detail: searchErr || autocompleteErrorDetail || 'Nessun risultato Places disponibile',
                        predictions: []
                    });
                }
            } catch (err) {
                if (!predictions.length) {
                    return res.status(502).json({
                        error: 'Errore Places API',
                        detail: autocompleteErrorDetail || String(err?.message || 'Places request failed'),
                        predictions: []
                    });
                }
            }
        }

        return res.json({
            status: 'OK',
            predictions: predictions.slice(0, 12)
        });
    } catch (err) {
        return res.status(502).json({ error: 'Errore Places Autocomplete API' });
    }
});

app.get('/api/google/place-geocode', async (req, res) => {
    if (!GOOGLE_MAPS_API_KEY) return res.status(500).json({ error: 'Google API key mancante' });
    const placeId = String(req.query.placeId || '').trim();
    if (!placeId) return res.status(400).json({ error: 'placeId obbligatorio' });

    try {
        const params = new URLSearchParams({
            languageCode: String(req.query.languageCode || 'it').trim() || 'it'
        });
        const regionCode = String(req.query.regionCode || '').trim().toUpperCase();
        if (regionCode) params.set('regionCode', regionCode);
        const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?${params.toString()}`;
        const apiRes = await fetch(url, {
            headers: {
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'id,displayName,formattedAddress,location'
            }
        });
        if (!apiRes.ok) {
            const errText = await apiRes.text();
            return res.status(502).json({ error: 'Errore Places Details API', detail: errText });
        }
        const data = await apiRes.json();
        const lat = Number(data?.location?.latitude);
        const lng = Number(data?.location?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return res.status(404).json({ error: 'Luogo non trovato', status: 'ZERO_RESULTS' });
        }
        const result = {
            place_id: String(data?.id || placeId),
            name: String(data?.displayName?.text || '').trim(),
            formatted_address: String(data?.formattedAddress || '').trim(),
            geometry: {
                location: { lat, lng }
            }
        };
        return res.json({ status: 'OK', result });
    } catch (err) {
        return res.status(502).json({ error: 'Errore Places Details API' });
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
