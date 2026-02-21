import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE_URL = 'https://drivercalc.onrender.com';

const ROUTE_META = [
  {
    file: 'index.html',
    path: '/',
    title: 'DriveCalc | Calcolatore costo viaggio con pedaggi e carburante',
    description: 'Calcola costo viaggio auto con pedaggi, carburante, tempo e km su autostrada e strade ordinarie.'
  },
  {
    file: 'budget.html',
    path: '/budget.html',
    title: 'Bilancio Viaggi | DriveCalc',
    description: 'Analizza costi, trend e storico tratte con il bilancio intelligente di DriveCalc.'
  },
  {
    file: 'companions.html',
    path: '/companions.html',
    title: 'Tratta in Compagnia | DriveCalc',
    description: 'Dividi costi carburante e pedaggi tra amici e salva tratte condivise in modo rapido.'
  },
  {
    file: 'friends.html',
    path: '/friends.html',
    title: 'I Miei Amici | DriveCalc',
    description: 'Gestisci la rete amici e condividi tratte, preferiti e dati utili in sicurezza.'
  },
  {
    file: 'fuel-finder.html',
    path: '/fuel-finder.html',
    title: 'Ricerca Benzinaio Smart | DriveCalc',
    description: 'Trova benzinai vicini, confronta prezzi e filtra per carburante e distanza.'
  },
  {
    file: 'ai-chat.html',
    path: '/ai-chat.html',
    title: 'Chat AI Viaggio | DriveCalc',
    description: 'Ottieni suggerimenti intelligenti su percorsi, costi e risparmio carburante.'
  },
  {
    file: 'favorites.html',
    path: '/favorites.html',
    title: 'Preferiti | DriveCalc',
    description: 'Salva e riusa rapidamente le tratte piu frequenti con tutti i dettagli di costo.'
  },
  {
    file: 'security.html',
    path: '/security.html',
    title: 'Sicurezza Account | DriveCalc',
    description: 'Gestisci password, sessioni e impostazioni di sicurezza del tuo account DriveCalc.'
  },
  {
    file: 'account.html',
    path: '/account.html',
    title: 'Account | DriveCalc',
    description: 'Gestisci profilo, auto preferita e impostazioni personali del tuo account.'
  },
  {
    file: 'info.html',
    path: '/info.html',
    title: 'Info e Guida | DriveCalc',
    description: 'Consulta guida, FAQ e dettagli su come DriveCalc stima costi, pedaggi e tempi di viaggio.'
  }
];

function escapeReplacement(value = '') {
  return String(value).replace(/\$/g, '$$$$');
}

function replaceTag(content, pattern, replacement, file) {
  if (!pattern.test(content)) {
    throw new Error(`Pattern non trovato in ${file}: ${pattern}`);
  }
  return content.replace(pattern, replacement);
}

async function syncMetaForFile(entry) {
  const absoluteFile = path.join(ROOT, entry.file);
  const url = `${BASE_URL}${entry.path === '/' ? '/' : entry.path}`;
  let html = await fs.readFile(absoluteFile, 'utf8');

  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeReplacement(entry.title)}</title>`, entry.file);
  html = replaceTag(
    html,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeReplacement(entry.description)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${escapeReplacement(url)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escapeReplacement(entry.title)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeReplacement(entry.description)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${escapeReplacement(url)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${escapeReplacement(entry.title)}">`,
    entry.file
  );
  html = replaceTag(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeReplacement(entry.description)}">`,
    entry.file
  );

  await fs.writeFile(absoluteFile, html, 'utf8');
}

async function main() {
  for (const entry of ROUTE_META) {
    await syncMetaForFile(entry);
  }
  console.log(`Metadati sincronizzati per ${ROUTE_META.length} pagine.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
