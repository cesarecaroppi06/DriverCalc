// Database di città italiane (capoluoghi di provincia + località extra)
const cities = [
    { name: 'Agrigento', region: 'Sicilia' },
    { name: 'Alessandria', region: 'Piemonte' },
    { name: 'Ancona', region: 'Marche' },
    { name: 'Andria', region: 'Puglia' },
    { name: 'Aosta', region: "Valle d'Aosta" },
    { name: 'Arezzo', region: 'Toscana' },
    { name: 'Ascoli Piceno', region: 'Marche' },
    { name: 'Asti', region: 'Piemonte' },
    { name: 'Avellino', region: 'Campania' },
    { name: 'Bari', region: 'Puglia' },
    { name: 'Barletta', region: 'Puglia' },
    { name: 'Belluno', region: 'Veneto' },
    { name: 'Benevento', region: 'Campania' },
    { name: 'Bergamo', region: 'Lombardia' },
    { name: 'Biella', region: 'Piemonte' },
    { name: 'Bologna', region: 'Emilia-Romagna' },
    { name: 'Bolzano', region: 'Trentino-Alto Adige' },
    { name: 'Brescia', region: 'Lombardia' },
    { name: 'Brindisi', region: 'Puglia' },
    { name: 'Cagliari', region: 'Sardegna' },
    { name: 'Caltanissetta', region: 'Sicilia' },
    { name: 'Campobasso', region: 'Molise' },
    { name: 'Carbonia', region: 'Sardegna' },
    { name: 'Carrara', region: 'Toscana' },
    { name: 'Caserta', region: 'Campania' },
    { name: 'Catania', region: 'Sicilia' },
    { name: 'Catanzaro', region: 'Calabria' },
    { name: 'Cesena', region: 'Emilia-Romagna' },
    { name: 'Chieti', region: 'Abruzzo' },
    { name: 'Como', region: 'Lombardia' },
    { name: 'Cosenza', region: 'Calabria' },
    { name: 'Cremona', region: 'Lombardia' },
    { name: 'Crotone', region: 'Calabria' },
    { name: 'Cuneo', region: 'Piemonte' },
    { name: 'Enna', region: 'Sicilia' },
    { name: 'Ferrara', region: 'Emilia-Romagna' },
    { name: 'Firenze', region: 'Toscana' },
    { name: 'Foggia', region: 'Puglia' },
    { name: 'Forlì', region: 'Emilia-Romagna' },
    { name: 'Frosinone', region: 'Lazio' },
    { name: 'Genova', region: 'Liguria' },
    { name: 'Gorizia', region: 'Friuli-Venezia Giulia' },
    { name: 'Grosseto', region: 'Toscana' },
    { name: 'Imperia', region: 'Liguria' },
    { name: 'Isernia', region: 'Molise' },
    { name: 'La Spezia', region: 'Liguria' },
    { name: "L'Aquila", region: 'Abruzzo' },
    { name: 'Latina', region: 'Lazio' },
    { name: 'Lecce', region: 'Puglia' },
    { name: 'Lecco', region: 'Lombardia' },
    { name: 'Livorno', region: 'Toscana' },
    { name: 'Massa', region: 'Toscana' },
    { name: 'Lodi', region: 'Lombardia' },
    { name: 'Lucca', region: 'Toscana' },
    { name: 'Macerata', region: 'Marche' },
    { name: 'Mantova', region: 'Lombardia' },
    { name: 'Matera', region: 'Basilicata' },
    { name: 'Messina', region: 'Sicilia' },
    { name: 'Milano', region: 'Lombardia' },
    { name: 'Modena', region: 'Emilia-Romagna' },
    { name: 'Monza', region: 'Lombardia' },
    { name: 'Napoli', region: 'Campania' },
    { name: 'Novara', region: 'Piemonte' },
    { name: 'Nuoro', region: 'Sardegna' },
    { name: 'Oristano', region: 'Sardegna' },
    { name: 'Padova', region: 'Veneto' },
    { name: 'Palermo', region: 'Sicilia' },
    { name: 'Parma', region: 'Emilia-Romagna' },
    { name: 'Pavia', region: 'Lombardia' },
    { name: 'Perugia', region: 'Umbria' },
    { name: 'Pesaro', region: 'Marche' },
    { name: 'Pescara', region: 'Abruzzo' },
    { name: 'Piacenza', region: 'Emilia-Romagna' },
    { name: 'Pisa', region: 'Toscana' },
    { name: 'Pistoia', region: 'Toscana' },
    { name: 'Pordenone', region: 'Friuli-Venezia Giulia' },
    { name: 'Porto San Giorgio', region: 'Marche' },
    { name: 'Potenza', region: 'Basilicata' },
    { name: 'Prato', region: 'Toscana' },
    { name: 'Ragusa', region: 'Sicilia' },
    { name: 'Ravenna', region: 'Emilia-Romagna' },
    { name: 'Reggio Calabria', region: 'Calabria' },
    { name: 'Reggio Emilia', region: 'Emilia-Romagna' },
    { name: 'Rieti', region: 'Lazio' },
    { name: 'Rimini', region: 'Emilia-Romagna' },
    { name: 'Roma', region: 'Lazio' },
    { name: 'Rovigo', region: 'Veneto' },
    { name: 'Salerno', region: 'Campania' },
    { name: 'San Marino', region: 'San Marino' },
    { name: 'Sassari', region: 'Sardegna' },
    { name: 'Savona', region: 'Liguria' },
    { name: 'Siena', region: 'Toscana' },
    { name: 'Siracusa', region: 'Sicilia' },
    { name: 'Sondrio', region: 'Lombardia' },
    { name: 'Taranto', region: 'Puglia' },
    { name: 'Terni', region: 'Umbria' },
    { name: 'Teramo', region: 'Abruzzo' },
    { name: 'Torino', region: 'Piemonte' },
    { name: 'Trapani', region: 'Sicilia' },
    { name: 'Trani', region: 'Puglia' },
    { name: 'Trento', region: 'Trentino-Alto Adige' },
    { name: 'Treviso', region: 'Veneto' },
    { name: 'Trieste', region: 'Friuli-Venezia Giulia' },
    { name: 'Udine', region: 'Friuli-Venezia Giulia' },
    { name: 'Urbino', region: 'Marche' },
    { name: 'Varese', region: 'Lombardia' },
    { name: 'Venezia', region: 'Veneto' },
    { name: 'Verbania', region: 'Piemonte' },
    { name: 'Vercelli', region: 'Piemonte' },
    { name: 'Verona', region: 'Veneto' },
    { name: 'Vibo Valentia', region: 'Calabria' },
    { name: 'Vicenza', region: 'Veneto' },
    { name: 'Viterbo', region: 'Lazio' },
    { name: 'Assisi', region: 'Umbria' },
    { name: 'Civitanova Marche', region: 'Marche' },
    { name: 'Fermo', region: 'Marche' },
    { name: 'Ponte di Legno', region: 'Lombardia' }
];

// API key ORS (profilo driving-car)
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE0MDIxYTVkMjA4NzRhODY4MjAwMDg1YzhhMTRjMWQ2IiwiaCI6Im11cm11cjY0In0=';
// API key HERE Routing v8 (imposta la tua chiave)
const HERE_API_KEY = 'YOUR_HERE_API_KEY';
// API key Google Maps (imposta la tua chiave in config.js)
const GOOGLE_MAPS_API_KEY = typeof window !== 'undefined' ? (window.GOOGLE_MAPS_API_KEY || '') : '';
// Forza OpenStreetMap/Leaflet (disabilita Google Maps UI)
const USE_GOOGLE_MAPS = false;
// Disabilita Photon (fallback su Nominatim)
const USE_PHOTON = false;

// Database rotte: distanza totale e pedaggi (i segmenti arrivano dall'API)
const routeInfo = {
    'Milano-Roma': { totalDistance: 582.52, tollCost: 43.0, segments: { highway: 0, expressway: 0, extra: 582.52, urban: 0 } },
    'Milano-Torino': { totalDistance: 141.25, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 141.25, urban: 0 } },
    'Milano-Napoli': { totalDistance: 772.78, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 772.78, urban: 0 } },
    'Milano-Genova': { totalDistance: 155.3, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 155.3, urban: 0 } },
    'Milano-Palermo': { totalDistance: 1473.56, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 1473.56, urban: 0 } },
    'Milano-Firenze': { totalDistance: 303.76, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 303.76, urban: 0 } },
    'Milano-Bologna': { totalDistance: 214.36, tollCost: 16.8, segments: { highway: 0, expressway: 0, extra: 214.36, urban: 0 } },
    'Milano-Bari': { totalDistance: 881.71, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 881.71, urban: 0 } },
    'Milano-Catania': { totalDistance: 1342.3, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 1342.3, urban: 0 } },
    'Milano-Venezia': { totalDistance: 309.56, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 309.56, urban: 0 } },
    'Milano-Verona': { totalDistance: 163, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 163, urban: 0 } },
    'Milano-Padova': { totalDistance: 271.45, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 271.45, urban: 0 } },
    'Milano-Brescia': { totalDistance: 102.25, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 102.25, urban: 0 } },
    'Milano-Fermo': { totalDistance: 489.46, tollCost: 35.2, segments: { highway: 0, expressway: 0, extra: 489.46, urban: 0 } },
    'Milano-Porto San Giorgio': { totalDistance: 481.97, tollCost: 35.2, segments: { highway: 0, expressway: 0, extra: 481.97, urban: 0 } },
    'Milano-Ponte di Legno': { totalDistance: 193.93, tollCost: 4.5, segments: { highway: 0, expressway: 0, extra: 193.93, urban: 0 } },
    'Roma-Torino': { totalDistance: 699.16, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 699.16, urban: 0 } },
    'Roma-Napoli': { totalDistance: 217.32, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 217.32, urban: 0 } },
    'Roma-Genova': { totalDistance: 522.64, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 522.64, urban: 0 } },
    'Roma-Palermo': { totalDistance: 918.11, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 918.11, urban: 0 } },
    'Roma-Firenze': { totalDistance: 281.75, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 281.75, urban: 0 } },
    'Roma-Bologna': { totalDistance: 384.74, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 384.74, urban: 0 } },
    'Roma-Bari': { totalDistance: 501.91, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 501.91, urban: 0 } },
    'Roma-Catania': { totalDistance: 786.84, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 786.84, urban: 0 } },
    'Roma-Venezia': { totalDistance: 569.2, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 569.2, urban: 0 } },
    'Roma-Reggio Calabria': { totalDistance: 695.29, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 695.29, urban: 0 } },
    'Roma-Perugia': { totalDistance: 181.21, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 181.21, urban: 0 } },
    'Roma-Porto San Giorgio': { totalDistance: 244, tollCost: 22.0, segments: { highway: 0, expressway: 0, extra: 244, urban: 0 } },
    'Roma-Fermo': { totalDistance: 252.74, tollCost: 22.0, segments: { highway: 0, expressway: 0, extra: 252.74, urban: 0 } },
    'Roma-Ancona': { totalDistance: 300.9, tollCost: 21.8, segments: { highway: 0, expressway: 0, extra: 300.9, urban: 0 } },
    'Roma-Ponte di Legno': { totalDistance: 665, tollCost: 60.0, segments: { highway: 0, expressway: 0, extra: 665, urban: 0 } },
    'Torino-Genova': { totalDistance: 165.15, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 165.15, urban: 0 } },
    'Torino-Napoli': { totalDistance: 890.1, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 890.1, urban: 0 } },
    'Torino-Como': { totalDistance: 168.21, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 168.21, urban: 0 } },
    'Torino-Ponte di Legno': { totalDistance: 322.25, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 322.25, urban: 0 } },
    'Napoli-Bari': { totalDistance: 263.73, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 263.73, urban: 0 } },
    'Napoli-Palermo': { totalDistance: 735.28, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 735.28, urban: 0 } },
    'Napoli-Salerno': { totalDistance: 62.65, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 62.65, urban: 0 } },
    'Napoli-Reggio Calabria': { totalDistance: 512.47, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 512.47, urban: 0 } },
    'Firenze-Bologna': { totalDistance: 104.69, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 104.69, urban: 0 } },
    'Firenze-Pisa': { totalDistance: 105.48, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 105.48, urban: 0 } },
    'Firenze-Siena': { totalDistance: 87.39, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 87.39, urban: 0 } },
    'Firenze-Perugia': { totalDistance: 157.61, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 157.61, urban: 0 } },
    'Firenze-Fermo': { totalDistance: 305.29, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 305.29, urban: 0 } },
    'Firenze-Porto San Giorgio': { totalDistance: 310.15, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 310.15, urban: 0 } },
    'Firenze-Arezzo': { totalDistance: 85.77, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 85.77, urban: 0 } },
    'Bologna-Venezia': { totalDistance: 185.84, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 185.84, urban: 0 } },
    'Bologna-Modena': { totalDistance: 50.41, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 50.41, urban: 0 } },
    'Bologna-Ravenna': { totalDistance: 80.46, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 80.46, urban: 0 } },
    'Bologna-Rimini': { totalDistance: 120.56, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 120.56, urban: 0 } },
    'Bologna-Fermo': { totalDistance: 278.6, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 278.6, urban: 0 } },
    'Venezia-Verona': { totalDistance: 150.75, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 150.75, urban: 0 } },
    'Venezia-Padova': { totalDistance: 91.81, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 91.81, urban: 0 } },
    'Venezia-Trieste': { totalDistance: 143.78, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 143.78, urban: 0 } },
    'Verona-Brescia': { totalDistance: 73.13, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 73.13, urban: 0 } },
    'Verona-Ponte di Legno': { totalDistance: 182.69, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 182.69, urban: 0 } },
    'Brescia-Bergamo': { totalDistance: 50.73, tollCost: 4.50, segments: { highway: 0, expressway: 0, extra: 50.73, urban: 0 } },
    'Brescia-Como': { totalDistance: 134.09, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 134.09, urban: 0 } },
    'Porto San Giorgio-Ponte di Legno': { totalDistance: 572, tollCost: 55.0, segments: { highway: 0, expressway: 0, extra: 572, urban: 0 } },
    // Fermo non ha casello: stesso pedaggio di Porto San Giorgio, +7.5 km di raccordo
    'Fermo-Ponte di Legno': { totalDistance: 579.5, tollCost: 55.0, segments: { highway: 0, expressway: 0, extra: 579.5, urban: 0 } },
    'Ancona-Fermo': { totalDistance: 69.56, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 69.56, urban: 0 } },
    'Ancona-Porto San Giorgio': { totalDistance: 62.07, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 62.07, urban: 0 } },
    'Fermo-Porto San Giorgio': { totalDistance: 7.5, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 7.5, urban: 0 } },
    'Fermo-Macerata': { totalDistance: 53.86, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 53.86, urban: 0 } },
    'Fermo-Pesaro': { totalDistance: 139.24, tollCost: 0, segments: { highway: 0, expressway: 0, extra: 139.24, urban: 0 } },
};

// Grafo delle rotte disponibili (bidirezionali)
function buildRouteGraph() {
    const graph = new Map();
    Object.keys(routeInfo).forEach(key => {
        const [a, b] = key.split('-');
        if (!a || !b) return;
        if (!graph.has(a)) graph.set(a, new Set());
        if (!graph.has(b)) graph.set(b, new Set());
        graph.get(a).add(b);
        graph.get(b).add(a);
    });
    return graph;
}

const routeGraph = buildRouteGraph();

// Geocoding città -> coordinate (lon/lat) via ORS con fallback Nominatim
async function geocodeCity(cityName) {
    try {
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(cityName)}&boundary.country=ITA&size=1`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const feat = data.features && data.features[0];
            if (feat && feat.geometry && feat.geometry.coordinates) {
                return feat.geometry.coordinates; // [lon, lat]
            }
        }
    } catch (e) {
        // fallback below
    }
    if (USE_PHOTON) {
        try {
            return await geocodeCityPhoton(cityName);
        } catch (e) {
            // fallback below
        }
    }
    return geocodeCityNominatim(cityName);
}

async function geocodeCityNominatim(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=it&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Nominatim geocoding failed');
    const data = await res.json();
    const item = data && data[0];
    if (!item || !item.lon || !item.lat) throw new Error('No coordinates found');
    return [parseFloat(item.lon), parseFloat(item.lat)];
}

async function geocodeCityPhoton(cityName) {
    const url = `https://photon.komoot.io/api/?limit=1&lang=it&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Photon geocoding failed');
    const data = await res.json();
    const feat = data.features && data.features[0];
    if (!feat || !feat.geometry || !feat.geometry.coordinates) throw new Error('No coordinates found');
    return feat.geometry.coordinates; // [lon, lat]
}

function hasHereKey() {
    return HERE_API_KEY && HERE_API_KEY !== 'YOUR_HERE_API_KEY';
}

function hasGoogleKey() {
    if (!USE_GOOGLE_MAPS) return false;
    return GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';
}

// Richiede distanza e pedaggi via HERE Routing v8 (se disponibile)
async function fetchRouteFromHereAPI(from, to) {
    if (!hasHereKey()) return null;
    const [startLon, startLat] = await geocodeCity(from);
    const [endLon, endLat] = await geocodeCity(to);
    const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${startLat},${startLon}&destination=${endLat},${endLon}&return=summary,travelSummary,tolls&currency=EUR&apiKey=${HERE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes && data.routes[0];
    const section = route && route.sections && route.sections[0];
    if (!section || !section.summary) return null;

    const totalDistanceKm = (section.summary.length || 0) / 1000;
    // Somma i prezzi in EUR dei pedaggi se presenti
    const tolls = section.tolls || [];
    let tollCost = 0;
    tolls.forEach(t => {
        (t.price || []).forEach(p => {
            if (p.currency === 'EUR' && typeof p.value === 'number') {
                tollCost += p.value;
            }
        });
    });

    // Stima dei segmenti (HERE non fornisce breakdown per tipo di strada in questa chiamata)
    const estimatedHighway = totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION;
    const estimatedExtra = Math.max(totalDistanceKm - estimatedHighway, 0);

    return {
        totalDistance: totalDistanceKm,
        tollCost: tollCost,
        segments: { highway: estimatedHighway, expressway: 0, extra: estimatedExtra, urban: 0 }
    };
}

let googleMapInstance = null;
let googleRoutePolyline = null;
let googleRouteMarkers = [];
let googleMapsLoaded = false;
let googleMapsAuthFailed = false;
let googleMapsErrorCheckTimer = null;
let leafletMapInstance = null;
let leafletRouteLayer = null;
let leafletRouteMarkers = [];
let userLocationMarkerGoogle = null;
let userLocationMarkerLeaflet = null;
let lastUserLocation = null;
let activeMapProvider = null;

function hasLeaflet() {
    return typeof window !== 'undefined' && typeof window.L !== 'undefined';
}

function registerGoogleAuthFailureHandler() {
    if (typeof window === 'undefined') return;
    if (window.gm_authFailure) return;
    window.gm_authFailure = () => {
        googleMapsAuthFailed = true;
        googleMapsLoaded = false;
        activeMapProvider = null;
        const mapEl = document.getElementById('map');
        if (mapEl) destroyGoogleMap(mapEl);
        const mapStatus = document.getElementById('mapStatus');
        if (mapStatus) {
            mapStatus.textContent = 'Google Maps non disponibile. Uso OpenStreetMap.';
        }
        ensureMapReady('leaflet');
    };
}

function scheduleGoogleErrorCheck(mapEl) {
    if (!mapEl) return;
    if (googleMapsErrorCheckTimer) clearTimeout(googleMapsErrorCheckTimer);
    googleMapsErrorCheckTimer = setTimeout(() => {
        const hasErrorOverlay = mapEl.querySelector('.gm-err-container, .gm-err-title, .gm-err-icon');
        if (hasErrorOverlay) {
            googleMapsAuthFailed = true;
            googleMapsLoaded = false;
            activeMapProvider = null;
            const mapStatus = document.getElementById('mapStatus');
            if (mapStatus) {
                mapStatus.textContent = 'Google Maps non disponibile. Uso OpenStreetMap.';
            }
            destroyGoogleMap(mapEl);
            ensureMapReady('leaflet');
        }
    }, 1500);
}

function clearMapContainer(mapEl) {
    if (!mapEl) return;
    mapEl.innerHTML = '';
}

function destroyGoogleMap(mapEl) {
    clearGoogleRoute();
    if (userLocationMarkerGoogle) {
        userLocationMarkerGoogle.setMap(null);
        userLocationMarkerGoogle = null;
    }
    googleMapInstance = null;
    clearMapContainer(mapEl);
}

function destroyLeafletMap(mapEl) {
    clearLeafletRoute();
    if (userLocationMarkerLeaflet) {
        userLocationMarkerLeaflet.remove();
        userLocationMarkerLeaflet = null;
    }
    if (leafletMapInstance) {
        leafletMapInstance.remove();
        leafletMapInstance = null;
    }
    clearMapContainer(mapEl);
}

function loadGoogleMapsScript() {
    if (googleMapsAuthFailed) return Promise.reject(new Error('Google Maps auth failed'));
    if (googleMapsLoaded || !hasGoogleKey()) return Promise.resolve();
    return new Promise((resolve, reject) => {
        registerGoogleAuthFailureHandler();
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=geometry&region=IT&language=it`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            googleMapsLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('Google Maps JS non disponibile'));
        document.head.appendChild(script);
    });
}

async function ensureMapReady(preferredProvider) {
    const mapEl = document.getElementById('map');
    if (!mapEl) return null;

    if (activeMapProvider && preferredProvider && activeMapProvider !== preferredProvider) {
        if (activeMapProvider === 'leaflet') {
            destroyLeafletMap(mapEl);
        } else if (activeMapProvider === 'google') {
            destroyGoogleMap(mapEl);
        }
        activeMapProvider = null;
    }

    const tryGoogle = async () => {
        if (googleMapsAuthFailed) return false;
        if (!hasGoogleKey()) return false;
        try {
            await loadGoogleMapsScript();
        } catch (e) {
            return false;
        }
        if (!window.google || !google.maps) return false;
        if (!googleMapInstance) {
            if (leafletMapInstance) {
                destroyLeafletMap(mapEl);
            }
            googleMapInstance = new google.maps.Map(mapEl, {
                center: { lat: 41.9028, lng: 12.4964 },
                zoom: 6,
                mapTypeControl: false,
                streetViewControl: false
            });
            scheduleGoogleErrorCheck(mapEl);
        }
        activeMapProvider = 'google';
        return true;
    };

    const tryLeaflet = async () => {
        if (!hasLeaflet()) return false;
        if (!leafletMapInstance) {
            if (googleMapInstance) {
                destroyGoogleMap(mapEl);
            }
            leafletMapInstance = L.map(mapEl, { zoomControl: true }).setView([41.9028, 12.4964], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMapInstance);
        }
        activeMapProvider = 'leaflet';
        return true;
    };

    if (preferredProvider === 'google') {
        if (await tryGoogle()) return 'google';
        if (await tryLeaflet()) return 'leaflet';
        return null;
    }

    if (preferredProvider === 'leaflet') {
        if (await tryLeaflet()) return 'leaflet';
        if (await tryGoogle()) return 'google';
        return null;
    }

    if (activeMapProvider === 'google') {
        if (await tryGoogle()) return 'google';
    }
    if (activeMapProvider === 'leaflet') {
        if (await tryLeaflet()) return 'leaflet';
    }
    if (await tryGoogle()) return 'google';
    if (await tryLeaflet()) return 'leaflet';
    return null;
}

function clearGoogleRoute() {
    if (googleRoutePolyline) {
        googleRoutePolyline.setMap(null);
        googleRoutePolyline = null;
    }
    googleRouteMarkers.forEach(m => m.setMap(null));
    googleRouteMarkers = [];
}

async function renderGoogleRouteOnMap(polyline, startLatLng, endLatLng) {
    const ok = await ensureMapReady('google');
    const mapSection = document.getElementById('mapSection');
    const mapStatus = document.getElementById('mapStatus');
    if (!mapSection) return;
    if (ok !== 'google') {
        mapSection.style.display = 'none';
        return;
    }

    mapSection.style.display = 'block';
    if (mapStatus) mapStatus.textContent = route?.isApproximate ? 'Percorso stimato (linea d’aria)' : '';
    clearGoogleRoute();

    if (!polyline || !window.google || !google.maps?.geometry?.encoding) return;
    const path = google.maps.geometry.encoding.decodePath(polyline);
    googleRoutePolyline = new google.maps.Polyline({
        path,
        strokeColor: '#ef4444',
        strokeOpacity: 0.95,
        strokeWeight: 6
    });
    googleRoutePolyline.setMap(googleMapInstance);

    if (startLatLng) {
        googleRouteMarkers.push(new google.maps.Marker({ position: startLatLng, map: googleMapInstance }));
    }
    if (endLatLng) {
        googleRouteMarkers.push(new google.maps.Marker({ position: endLatLng, map: googleMapInstance }));
    }
    if (lastUserLocation) {
        if (!userLocationMarkerGoogle) {
            userLocationMarkerGoogle = new google.maps.Marker({
                position: lastUserLocation,
                map: googleMapInstance,
                title: 'La tua posizione'
            });
        } else {
            userLocationMarkerGoogle.setPosition(lastUserLocation);
            userLocationMarkerGoogle.setMap(googleMapInstance);
        }
    }

    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    if (lastUserLocation) bounds.extend(lastUserLocation);
    googleMapInstance.fitBounds(bounds);
    if (google.maps?.event) google.maps.event.trigger(googleMapInstance, 'resize');
    scheduleGoogleErrorCheck(document.getElementById('map'));
}

function clearLeafletRoute() {
    if (leafletRouteLayer) {
        leafletRouteLayer.remove();
        leafletRouteLayer = null;
    }
    leafletRouteMarkers.forEach(m => m.remove());
    leafletRouteMarkers = [];
}

async function renderLeafletRouteOnMap(geometryCoords, startLatLng, endLatLng) {
    const ok = await ensureMapReady('leaflet');
    const mapSection = document.getElementById('mapSection');
    const mapStatus = document.getElementById('mapStatus');
    if (!mapSection) return;
    if (ok !== 'leaflet') {
        mapSection.style.display = 'none';
        return;
    }

    mapSection.style.display = 'block';
    if (mapStatus) mapStatus.textContent = 'Mappa OpenStreetMap (fallback)';
    clearLeafletRoute();

    if (!Array.isArray(geometryCoords) || !geometryCoords.length) return;
    const latLngs = geometryCoords.map(coord => [coord[1], coord[0]]);
    leafletRouteLayer = L.polyline(latLngs, {
        color: '#ef4444',
        weight: 6,
        opacity: 0.95
    }).addTo(leafletMapInstance);

    const start = startLatLng || { lat: latLngs[0][0], lng: latLngs[0][1] };
    const end = endLatLng || { lat: latLngs[latLngs.length - 1][0], lng: latLngs[latLngs.length - 1][1] };

    if (start) leafletRouteMarkers.push(L.marker([start.lat, start.lng]).addTo(leafletMapInstance));
    if (end) leafletRouteMarkers.push(L.marker([end.lat, end.lng]).addTo(leafletMapInstance));
    if (lastUserLocation) {
        if (!userLocationMarkerLeaflet) {
            userLocationMarkerLeaflet = L.marker([lastUserLocation.lat, lastUserLocation.lng], {
                title: 'La tua posizione'
            }).addTo(leafletMapInstance);
        } else {
            userLocationMarkerLeaflet.setLatLng([lastUserLocation.lat, lastUserLocation.lng]);
        }
    }

    leafletMapInstance.fitBounds(leafletRouteLayer.getBounds(), { padding: [20, 20] });
    leafletMapInstance.invalidateSize();
}

async function renderRouteOnMap(route, from, to, fromLoc, toLoc) {
    const mapSection = document.getElementById('mapSection');
    const mapStatus = document.getElementById('mapStatus');
    if (!mapSection) return;

    const preferred = 'leaflet';
    let provider = await ensureMapReady(preferred);

    if (!provider) {
        mapSection.style.display = 'none';
        return;
    }

    mapSection.style.display = 'block';
    if (mapStatus) mapStatus.textContent = '';

    if (provider === 'google' && route?.googlePolyline) {
        await renderGoogleRouteOnMap(route.googlePolyline, route.googleStart, route.googleEnd);
        return;
    }

    let geometryRoute = route;
    if (!geometryRoute?.orsGeometry) {
        try {
            if (fromLoc && toLoc) {
                geometryRoute = await fetchRouteFromORSCoords(
                    { lat: fromLoc.lat, lng: fromLoc.lng },
                    { lat: toLoc.lat, lng: toLoc.lng }
                );
            } else if (from && to) {
                geometryRoute = await fetchRouteFromORS(from, to);
            }
        } catch (e) {
            geometryRoute = null;
        }
    }
    if (!geometryRoute?.orsGeometry) {
        try {
            if (fromLoc && toLoc) {
                geometryRoute = await fetchRouteFromOSRMCoords(
                    { lat: fromLoc.lat, lng: fromLoc.lng },
                    { lat: toLoc.lat, lng: toLoc.lng }
                );
            } else if (from && to) {
                geometryRoute = await fetchRouteFromOSRM(from, to);
            }
        } catch (e) {
            geometryRoute = null;
        }
    }

    if (geometryRoute?.orsGeometry) {
        if (provider !== 'leaflet') {
            provider = await ensureMapReady('leaflet');
        }
        if (provider === 'leaflet') {
            await renderLeafletRouteOnMap(geometryRoute.orsGeometry, geometryRoute.orsStart, geometryRoute.orsEnd);
            return;
        }
    }

    if (mapStatus) mapStatus.textContent = 'Percorso non disponibile su mappa.';
}

async function renderUserLocationOnMap() {
    if (!lastUserLocation) return;
    const preferred = activeMapProvider || (hasGoogleKey() ? 'google' : 'leaflet');
    const provider = await ensureMapReady(preferred);
    const mapSection = document.getElementById('mapSection');
    const mapStatus = document.getElementById('mapStatus');
    if (!mapSection || !provider) return;
    mapSection.style.display = 'block';
    if (mapStatus) mapStatus.textContent = '';

    if (provider === 'google' && googleMapInstance) {
        if (!userLocationMarkerGoogle) {
            userLocationMarkerGoogle = new google.maps.Marker({
                position: lastUserLocation,
                map: googleMapInstance,
                title: 'La tua posizione'
            });
        } else {
            userLocationMarkerGoogle.setPosition(lastUserLocation);
        }
        googleMapInstance.setCenter(lastUserLocation);
        googleMapInstance.setZoom(12);
        if (google.maps?.event) google.maps.event.trigger(googleMapInstance, 'resize');
    }

    if (provider === 'leaflet' && leafletMapInstance) {
        if (!userLocationMarkerLeaflet) {
            userLocationMarkerLeaflet = L.marker([lastUserLocation.lat, lastUserLocation.lng], {
                title: 'La tua posizione'
            }).addTo(leafletMapInstance);
        } else {
            userLocationMarkerLeaflet.setLatLng([lastUserLocation.lat, lastUserLocation.lng]);
        }
        leafletMapInstance.setView([lastUserLocation.lat, lastUserLocation.lng], 12);
        leafletMapInstance.invalidateSize();
    }
}

async function fetchRouteFromGoogle(from, to) {
    const res = await fetch(`${getApiBase()}/google/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: from, destination: to })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes && data.routes[0];
    if (!route) return null;

    const totalDistanceKm = (route.distanceMeters || 0) / 1000;
    const tolls = route.tollInfo && route.tollInfo.estimatedPrice ? route.tollInfo.estimatedPrice : [];
    let tollCost = 0;
    tolls.forEach(price => {
        if (price.currencyCode === 'EUR') {
            tollCost += Number(price.units || 0) + Number(price.nanos || 0) / 1e9;
        }
    });

    const encodedPolyline = route.polyline && route.polyline.encodedPolyline;
    const start = route.legs && route.legs[0] && route.legs[0].startLocation && route.legs[0].startLocation.latLng;
    const end = route.legs && route.legs[0] && route.legs[0].endLocation && route.legs[0].endLocation.latLng;

    return {
        totalDistance: totalDistanceKm,
        tollCost: tollCost,
        segments: {
            highway: totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION,
            expressway: 0,
            extra: Math.max(totalDistanceKm - totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION, 0),
            urban: 0
        },
        googlePolyline: encodedPolyline,
        googleStart: start || null,
        googleEnd: end || null
    };
}

// Richiede distanza e segmenti via ORS Directions
async function fetchRouteFromORS(from, to) {
    const [startLon, startLat] = await geocodeCity(from);
    const [endLon, endLat] = await geocodeCity(to);
    return fetchRouteFromORSCoords({ lat: startLat, lng: startLon }, { lat: endLat, lng: endLon });
}

async function fetchRouteFromORSCoords(start, end) {
    const body = {
        coordinates: [
            [start.lng, start.lat],
            [end.lng, end.lat]
        ],
        geometry_format: 'geojson'
    };
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ORS_API_KEY
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Directions failed');
    const data = await res.json();
    const summary = data.routes && data.routes[0] && data.routes[0].summary;
    if (!summary) throw new Error('No route summary');
    const totalDistanceKm = summary.distance / 1000; // meters -> km
    const geometryCoords = data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates
        ? data.routes[0].geometry.coordinates
        : null;
    // ORS non separa i segmenti per tipo strada; stimiamo la quota autostrada
    const estimatedHighway = totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION;
    const estimatedExtra = Math.max(totalDistanceKm - estimatedHighway, 0);
    return {
        totalDistance: totalDistanceKm,
        tollCost: 0,
        segments: { highway: estimatedHighway, expressway: 0, extra: estimatedExtra, urban: 0 },
        orsGeometry: geometryCoords,
        orsStart: { lat: start.lat, lng: start.lng },
        orsEnd: { lat: end.lat, lng: end.lng }
    };
}

async function fetchRouteFromOSRM(from, to) {
    const [startLon, startLat] = await geocodeCity(from);
    const [endLon, endLat] = await geocodeCity(to);
    return fetchRouteFromOSRMCoords({ lat: startLat, lng: startLon }, { lat: endLat, lng: endLon });
}

async function fetchRouteFromOSRMCoords(start, end) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM route failed');
    const data = await res.json();
    const route = data.routes && data.routes[0];
    if (!route || !route.geometry || !route.geometry.coordinates) throw new Error('OSRM route geometry missing');
    const totalDistanceKm = (route.distance || 0) / 1000;
    const estimatedHighway = totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION;
    const estimatedExtra = Math.max(totalDistanceKm - estimatedHighway, 0);
    return {
        totalDistance: totalDistanceKm,
        tollCost: 0,
        segments: { highway: estimatedHighway, expressway: 0, extra: estimatedExtra, urban: 0 },
        orsGeometry: route.geometry.coordinates,
        orsStart: { lat: start.lat, lng: start.lng },
        orsEnd: { lat: end.lat, lng: end.lng }
    };
}

async function reverseGeocodeGoogle(lat, lng) {
    const res = await fetch(`${getApiBase()}/google/reverse-geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results && data.results[0];
    if (!result) return null;

    const locality = (result.address_components || []).find(c => c.types.includes('locality'));
    const fallback = (result.address_components || []).find(c => c.types.includes('administrative_area_level_2'));
    return (locality && locality.long_name) || (fallback && fallback.long_name) || null;
}

async function reverseGeocodeORS(lat, lng) {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lat=${encodeURIComponent(lat)}&point.lon=${encodeURIComponent(lng)}&size=1&layers=locality`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const feat = data.features && data.features[0];
    if (!feat || !feat.properties) return null;
    return feat.properties.locality || feat.properties.name || null;
}

async function reverseGeocodeNominatim(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=10&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const address = data && data.address;
    return (address && (address.city || address.town || address.village || address.county)) || null;
}

async function reverseGeocodeNominatimDetailed(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1&accept-language=it`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const address = data && data.address ? data.address : {};
    const city = address.city || address.town || address.village || address.county || '';
    const road = address.road || address.pedestrian || address.footway || address.cycleway || address.path || '';
    const number = address.house_number || address.housenumber || '';
    const fullAddress = road
        ? `${road}${number ? ` ${number}` : ''}${city ? `, ${city}` : ''}`.trim()
        : (data.display_name || city || '');
    return {
        city: city || null,
        fullAddress: fullAddress || null
    };
}

async function reverseGeocodePhoton(lat, lng) {
    const url = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&lang=it`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const feat = data.features && data.features[0];
    const props = feat && feat.properties;
    return (props && (props.city || props.town || props.village || props.county || props.name)) || null;
}

async function resolveCityFromCoordinates(lat, lng) {
    let city = null;
    if (hasGoogleKey()) {
        try {
            city = await reverseGeocodeGoogle(lat, lng);
        } catch (e) {
            city = null;
        }
    }
    if (!city) {
        try {
            city = await reverseGeocodeORS(lat, lng);
        } catch (e) {
            city = null;
        }
    }
    if (!city && USE_PHOTON) {
        try {
            city = await reverseGeocodePhoton(lat, lng);
        } catch (e) {
            city = null;
        }
    }
    if (!city) {
        try {
            city = await reverseGeocodeNominatim(lat, lng);
        } catch (e) {
            city = null;
        }
    }
    return city;
}

function normalizeCityName(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/^citt[aà]\s+di\s+/i, '')
        .replace(/^comune\s+di\s+/i, '')
        .trim();
}

async function resolveLocation(roleLabel, addressInput, citySelect) {
    const addressValue = (addressInput?.value || '').trim();
    if (addressValue) {
        const pickedKind = addressInput?.dataset?.kind || '';
        const pickedCity = addressInput?.dataset?.city || '';
        const lat = parseFloat(addressInput?.dataset?.lat || '');
        const lng = parseFloat(addressInput?.dataset?.lng || '');

        if (pickedKind === 'city' && (pickedCity || addressValue)) {
            const cityValue = pickedCity || addressValue;
            const [lon, cityLat] = await geocodeCity(cityValue);
            return { label: cityValue, lat: cityLat, lng: lon, kind: 'city', city: cityValue };
        }

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { label: addressValue, lat, lng, kind: 'address', address: addressValue };
        }

        const exactCity = cities.find(c => normalizeCityName(c.name) === normalizeCityName(addressValue));
        if (exactCity) {
            const [lon, cityLat] = await geocodeCity(exactCity.name);
            return { label: exactCity.name, lat: cityLat, lng: lon, kind: 'city', city: exactCity.name };
        }

        try {
            const suggestions = await fetchUnifiedLocationSuggestions(addressValue);
            if (suggestions.length) {
                const best = suggestions[0];
                if (best.kind === 'city') {
                    const [lon, cityLat] = await geocodeCity(best.city);
                    addressInput.value = best.city;
                    addressInput.dataset.kind = 'city';
                    addressInput.dataset.city = best.city;
                    addressInput.dataset.lat = '';
                    addressInput.dataset.lng = '';
                    return { label: best.city, lat: cityLat, lng: lon, kind: 'city', city: best.city };
                }
                addressInput.value = best.label;
                addressInput.dataset.kind = 'address';
                addressInput.dataset.city = '';
                addressInput.dataset.lat = String(best.lat);
                addressInput.dataset.lng = String(best.lng);
                return { label: best.label, lat: best.lat, lng: best.lng, kind: 'address', address: best.label };
            }
        } catch (e) {
            // fallback below
        }
        try {
            const coords = await geocodeAddress(addressValue, citySelect?.value || '');
            addressInput.dataset.kind = 'address';
            addressInput.dataset.city = '';
            addressInput.dataset.lat = String(coords.lat);
            addressInput.dataset.lng = String(coords.lng);
            return { label: addressValue, lat: coords.lat, lng: coords.lng, kind: 'address', address: addressValue };
        } catch (e) {
            throw new Error(`Indirizzo ${roleLabel} non trovato.`);
        }
    }

    const cityValue = (citySelect?.value || '').trim();
    if (!cityValue) {
        throw new Error(`Seleziona ${roleLabel}.`);
    }
    const [lon, lat] = await geocodeCity(cityValue);
    return { label: cityValue, lat, lng: lon, kind: 'city', city: cityValue };
}

async function geocodeAddress(addressValue, cityBias = '') {
    const query = cityBias && !addressValue.toLowerCase().includes(cityBias.toLowerCase())
        ? `${addressValue}, ${cityBias}`
        : addressValue;
    if (USE_PHOTON) {
        try {
            const coords = await geocodeCityPhoton(query);
            return { lat: coords[1], lng: coords[0] };
        } catch (e) {
            // fallback below
        }
    }
    const coords = await geocodeCityNominatim(query);
    return { lat: coords[1], lng: coords[0] };
}

function findCityOptionByName(cityName) {
    if (!cityName) return null;
    const normalized = normalizeCityName(cityName);
    return Array.from(departureSelect.options).find(opt => normalizeCityName(opt.value) === normalized) || null;
}

function applyLocationToForm(entry) {
    if (!entry) return;
    const depIsAddr = !!entry.departureIsAddress;
    const arrIsAddr = !!entry.arrivalIsAddress;

    if (depIsAddr) {
        if (departureAddressInput) {
            departureAddressInput.value = entry.departureAddress || entry.departure || '';
            departureAddressInput.dataset.kind = 'address';
            departureAddressInput.dataset.city = '';
            departureAddressInput.dataset.lat = entry.departureLat ? String(entry.departureLat) : '';
            departureAddressInput.dataset.lng = entry.departureLng ? String(entry.departureLng) : '';
        }
        if (departureSelect) departureSelect.value = '';
    } else {
        const depCity = entry.departureCity || entry.departure || '';
        if (departureSelect) departureSelect.value = depCity;
        if (departureAddressInput) {
            departureAddressInput.value = depCity;
            departureAddressInput.dataset.kind = depCity ? 'city' : '';
            departureAddressInput.dataset.city = depCity;
            departureAddressInput.dataset.lat = '';
            departureAddressInput.dataset.lng = '';
        }
    }

    if (arrIsAddr) {
        if (arrivalAddressInput) {
            arrivalAddressInput.value = entry.arrivalAddress || entry.arrival || '';
            arrivalAddressInput.dataset.kind = 'address';
            arrivalAddressInput.dataset.city = '';
            arrivalAddressInput.dataset.lat = entry.arrivalLat ? String(entry.arrivalLat) : '';
            arrivalAddressInput.dataset.lng = entry.arrivalLng ? String(entry.arrivalLng) : '';
        }
        if (arrivalSelect) arrivalSelect.value = '';
    } else {
        const arrCity = entry.arrivalCity || entry.arrival || '';
        if (arrivalSelect) arrivalSelect.value = arrCity;
        if (arrivalAddressInput) {
            arrivalAddressInput.value = arrCity;
            arrivalAddressInput.dataset.kind = arrCity ? 'city' : '';
            arrivalAddressInput.dataset.city = arrCity;
            arrivalAddressInput.dataset.lat = '';
            arrivalAddressInput.dataset.lng = '';
        }
    }

    clearResultsContainer(departureAddressResults);
    clearResultsContainer(arrivalAddressResults);
}

function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Costante costo casello medio in Italia (€ per casello)
const TOLL_BOOTH_COST = 1.80; // Media 2024
const HIGHWAY_KM_PER_TOLL_BOOTH = 25; // Circa un casello ogni 25 km
// Pedaggio stimato per km di autostrada (media classe A)
const TOLL_RATE_EUR_PER_KM = 0.09;
// Frazione stimata di autostrada per rotte calcolate via API quando manca il dettaglio
const ESTIMATED_HIGHWAY_FRACTION = 0.7;

// Velocità medie (km/h) per tipo di strada
const SPEEDS = {
    highway: 130,     // Autostrada
    expressway: 110,  // Superstrada/extraurbana principale (es. SS, E)
    extra: 90,        // Altre extraurbane
    urban: 50         // Urbano
};

// Consumi per 100 km per tipo di auto e alimentazione (L/100 km, kg/100 km per metano, kWh/100 km per elettrico)
const carConsumption = {
    'city-car': {
        label: 'City Car',
        fuels: { benzina: 5.2, diesel: 4.2, gpl: 6.5, metano: 4.1, elettrico: 15.5 }
    },
    'sedan': {
        label: 'Berlina',
        fuels: { benzina: 6.4, diesel: 5.1, gpl: 7.4, metano: 4.8, elettrico: 17.5 }
    },
    'suv': {
        label: 'SUV',
        fuels: { benzina: 7.8, diesel: 6.6, gpl: 9.0, metano: 5.9, elettrico: 19.5 }
    },
    'estate': {
        label: 'Station Wagon',
        fuels: { benzina: 6.9, diesel: 5.7, gpl: 8.0, metano: 5.0, elettrico: 18.5 }
    },
    'hybrid': {
        label: 'Ibrida',
        fuels: { benzina: 4.2, diesel: 3.8, gpl: 5.8, metano: 4.0, elettrico: 14.0 }
    },
    'electric': {
        label: 'Full Electric',
        fuels: { elettrico: 15.5 }
    },
    'brand-fiat': {
        label: 'Fiat (medio)',
        fuels: { benzina: 5.8, diesel: 5.2, gpl: 6.8 }
    },
    'brand-toyota': {
        label: 'Toyota (medio)',
        fuels: { benzina: 5.2, elettrico: 16.0 }
    },
    'brand-volkswagen': {
        label: 'Volkswagen (medio)',
        fuels: { benzina: 5.5, diesel: 5.0 }
    },
    'brand-renault': {
        label: 'Renault (medio)',
        fuels: { benzina: 5.4, diesel: 4.9 }
    },
    'brand-peugeot': {
        label: 'Peugeot (medio)',
        fuels: { benzina: 5.3, diesel: 4.9 }
    },
    'brand-ford': {
        label: 'Ford (medio)',
        fuels: { benzina: 5.6, diesel: 5.2 }
    },
    'brand-opel': {
        label: 'Opel (medio)',
        fuels: { benzina: 5.5, diesel: 5.0 }
    },
    'brand-bmw': {
        label: 'BMW (medio)',
        fuels: { benzina: 6.0, diesel: 5.5 }
    },
    'brand-mercedes': {
        label: 'Mercedes (medio)',
        fuels: { benzina: 6.2, diesel: 5.7 }
    },
    'brand-audi': {
        label: 'Audi (medio)',
        fuels: { benzina: 5.9, diesel: 5.3 }
    },
    'brand-kia': {
        label: 'Kia (medio)',
        fuels: { benzina: 5.7, diesel: 5.3 }
    },
    'brand-hyundai': {
        label: 'Hyundai (medio)',
        fuels: { benzina: 5.6, diesel: 5.2 }
    },
    'brand-nissan': {
        label: 'Nissan (medio)',
        fuels: { benzina: 5.8, diesel: 5.2 }
    },
    'brand-dacia': {
        label: 'Dacia (medio)',
        fuels: { benzina: 5.5, diesel: 5.0, gpl: 6.8 }
    },
    'brand-jeep': {
        label: 'Jeep (medio)',
        fuels: { benzina: 7.2, diesel: 6.5 }
    },
    'brand-alfa-romeo': {
        label: 'Alfa Romeo (medio)',
        fuels: { benzina: 6.1, diesel: 5.6 }
    },
    'brand-volvo': {
        label: 'Volvo (medio)',
        fuels: { benzina: 6.8, diesel: 6.0 }
    },
    'brand-skoda': {
        label: 'Skoda (medio)',
        fuels: { benzina: 5.3, diesel: 4.8 }
    },
    'brand-seat': {
        label: 'Seat (medio)',
        fuels: { benzina: 5.5, diesel: 5.0 }
    },
    'brand-citroen': {
        label: 'Citroen (medio)',
        fuels: { benzina: 5.6, diesel: 5.1 }
    },
    'brand-tesla': {
        label: 'Tesla (medio)',
        fuels: { elettrico: 16.5 }
    },
    'brand-mazda': {
        label: 'Mazda (medio)',
        fuels: { benzina: 6.2, diesel: 5.6 }
    },
    'brand-honda': {
        label: 'Honda (medio)',
        fuels: { benzina: 5.5 }
    },
    'brand-suzuki': {
        label: 'Suzuki (medio)',
        fuels: { benzina: 5.0 }
    },
    'brand-land-rover': {
        label: 'Land Rover (medio)',
        fuels: { diesel: 8.0 }
    },
    'brand-lexus': {
        label: 'Lexus (medio)',
        fuels: { benzina: 6.0 }
    },
    'brand-mitsubishi': {
        label: 'Mitsubishi (medio)',
        fuels: { benzina: 6.6 }
    },
    'brand-subaru': {
        label: 'Subaru (medio)',
        fuels: { benzina: 6.9 }
    },
    'brand-porsche': {
        label: 'Porsche (medio)',
        fuels: { benzina: 9.5 }
    },
    'brand-mini': {
        label: 'Mini (medio)',
        fuels: { benzina: 6.0 }
    },
    'brand-smart': {
        label: 'Smart (medio)',
        fuels: { elettrico: 16.5 }
    },
    'brand-byd': {
        label: 'BYD (medio)',
        fuels: { elettrico: 16.0 }
    },
    'brand-mg': {
        label: 'MG (medio)',
        fuels: { benzina: 6.8, elettrico: 16.6 }
    },
    'brand-dr': {
        label: 'DR (medio)',
        fuels: { benzina: 7.5, gpl: 8.0 }
    },
    'brand-ds': {
        label: 'DS (medio)',
        fuels: { benzina: 5.5, diesel: 4.8 }
    },
    'brand-maserati': {
        label: 'Maserati (medio)',
        fuels: { benzina: 9.5 }
    },
    'brand-jaguar': {
        label: 'Jaguar (medio)',
        fuels: { diesel: 7.0 }
    },
    'brand-cupra': {
        label: 'Cupra (medio)',
        fuels: { benzina: 6.3 }
    },
    'brand-lancia': {
        label: 'Lancia (medio)',
        fuels: { benzina: 5.2 }
    },
    'fiat-panda-2024': {
        label: 'Fiat Panda 1.0 Hybrid (2024)',
        fuels: { benzina: 4.7, gpl: 6.0 }
    },
    'toyota-aygo-x-2024': {
        label: 'Toyota Aygo X 1.0 (2024)',
        fuels: { benzina: 4.8 }
    },
    'vw-golf-15tsi-2024': {
        label: 'VW Golf 1.5 TSI (2024)',
        fuels: { benzina: 5.6 }
    },
    'vw-golf-20tdi-2024': {
        label: 'VW Golf 2.0 TDI (2024)',
        fuels: { diesel: 4.7 }
    },
    'toyota-corolla-hybrid-2024': {
        label: 'Toyota Corolla 1.8 Hybrid (2024)',
        fuels: { benzina: 4.4 }
    },
    'tesla-model-3-2024': {
        label: 'Tesla Model 3 RWD (2024)',
        fuels: { elettrico: 14.5 }
    },
    'nissan-leaf-62-2022': {
        label: 'Nissan Leaf 62 kWh (2022)',
        fuels: { elettrico: 17.0 }
    },
    'jeep-renegade-16mjt-2024': {
        label: 'Jeep Renegade 1.6 Mjt (2024)',
        fuels: { diesel: 5.4 }
    },
    'bmw-320d-2024': {
        label: 'BMW 320d (2024)',
        fuels: { diesel: 5.1 }
    },
    'audi-a4-35tdi-2024': {
        label: 'Audi A4 35 TDI (2024)',
        fuels: { diesel: 5.3 }
    },
    'fiat-500-2024': {
        label: 'Fiat 500 1.0 Hybrid (2024)',
        fuels: { benzina: 4.6 }
    },
    'dacia-sandero-gpl-2024': {
        label: 'Dacia Sandero ECO-G 100 (2024)',
        fuels: { gpl: 6.8, benzina: 5.7 }
    },
    'renault-clio-15dci-2024': {
        label: 'Renault Clio 1.5 Blue dCi (2024)',
        fuels: { diesel: 4.2 }
    },
    'ford-puma-10mhev-2024': {
        label: 'Ford Puma 1.0 EcoBoost MHEV (2024)',
        fuels: { benzina: 5.5 }
    },
    'toyota-yaris-hybrid-2024': {
        label: 'Toyota Yaris 1.5 Hybrid (2024)',
        fuels: { benzina: 4.0 }
    },
    'peugeot-208-15bluedci-2024': {
        label: 'Peugeot 208 1.5 BlueHDi (2024)',
        fuels: { diesel: 4.1 }
    },
    'vw-polo-10tsi-2024': {
        label: 'VW Polo 1.0 TSI (2024)',
        fuels: { benzina: 5.0 }
    },
    'vw-tiguan-20tdi-2024': {
        label: 'VW Tiguan 2.0 TDI (2024)',
        fuels: { diesel: 5.8 }
    },
    'hyundai-tucson-hybrid-2024': {
        label: 'Hyundai Tucson 1.6 Hybrid (2024)',
        fuels: { benzina: 5.8 }
    },
    'fiat-500e-2024': {
        label: 'Fiat 500e 42 kWh (2024)',
        fuels: { elettrico: 14.8 }
    },
    'peugeot-e208-2024': {
        label: 'Peugeot e-208 (2024)',
        fuels: { elettrico: 15.5 }
    },
    'renault-zoe-2024': {
        label: 'Renault Zoe R135 (2024)',
        fuels: { elettrico: 17.4 }
    },
    'jeep-avenger-2024': {
        label: 'Jeep Avenger 1.2 (2024)',
        fuels: { benzina: 5.5 }
    },
    'citroen-c3-2024': {
        label: 'Citroen C3 1.2 (2024)',
        fuels: { benzina: 5.6 }
    },
    'dacia-duster-2024': {
        label: 'Dacia Duster 1.5 Blue dCi (2024)',
        fuels: { diesel: 4.9 }
    },
    'toyota-yaris-cross-2024': {
        label: 'Toyota Yaris Cross Hybrid (2024)',
        fuels: { benzina: 5.0 }
    },
    'mg-zs-2024': {
        label: 'MG ZS 1.5 (2024)',
        fuels: { benzina: 7.2 }
    },
    'renault-captur-2024': {
        label: 'Renault Captur Hybrid (2024)',
        fuels: { benzina: 5.2 }
    },
    'vw-t-roc-2024': {
        label: 'Volkswagen T-Roc 1.5 TSI (2024)',
        fuels: { benzina: 6.0 }
    },
    'fiat-600-2024': {
        label: 'Fiat 600 1.2 Hybrid (2024)',
        fuels: { benzina: 5.6 }
    },
    'opel-corsa-2024': {
        label: 'Opel Corsa 1.2 Turbo (2024)',
        fuels: { benzina: 5.4 }
    },
    'vw-t-cross-2024': {
        label: 'Volkswagen T-Cross 1.0 TSI (2024)',
        fuels: { benzina: 5.5 }
    },
    'peugeot-2008-2024': {
        label: 'Peugeot 2008 1.2 (2024)',
        fuels: { benzina: 5.7 }
    },
    'bmw-x1-2024': {
        label: 'BMW X1 sDrive18d (2024)',
        fuels: { diesel: 5.7 }
    },
    'nissan-qashqai-2024': {
        label: 'Nissan Qashqai Mild Hybrid (2024)',
        fuels: { benzina: 6.6 }
    },
    'kia-sportage-2024': {
        label: 'Kia Sportage 1.6 CRDi (2024)',
        fuels: { diesel: 5.5 }
    },
    'toyota-chr-2024': {
        label: 'Toyota C-HR Hybrid (2024)',
        fuels: { benzina: 4.9 }
    },
    'peugeot-3008-2024': {
        label: 'Peugeot 3008 1.5 BlueHDi (2024)',
        fuels: { diesel: 5.0 }
    },
    'audi-a3-2024': {
        label: 'Audi A3 30 TDI (2024)',
        fuels: { diesel: 4.7 }
    },
    'alfa-romeo-junior-2025': {
        label: 'Alfa Romeo Junior Ibrida (2025)',
        fuels: { benzina: 5.2 }
    },
    'mg3-2024': {
        label: 'MG3 1.5 VTi-Tech (2024)',
        fuels: { benzina: 6.2 }
    },
    'hyundai-i10-2024': {
        label: 'Hyundai i10 1.0 (2024)',
        fuels: { benzina: 5.2 }
    },
    'nissan-juke-2024': {
        label: 'Nissan Juke 1.0 (2024)',
        fuels: { benzina: 6.2 }
    },
    'ford-focus-2024': {
        label: 'Ford Focus 1.0 EcoBoost (2024)',
        fuels: { benzina: 5.8 }
    },
    'byd-seal-u-2024': {
        label: 'BYD Seal U EV (2024)',
        fuels: { elettrico: 17.5 }
    },
    'kia-picanto-2024': {
        label: 'Kia Picanto 1.0 (2024)',
        fuels: { benzina: 5.0 }
    },
    'mercedes-gla-2024': {
        label: 'Mercedes GLA 200d (2024)',
        fuels: { diesel: 5.3 }
    },
    'audi-q3-2024': {
        label: 'Audi Q3 35 TDI (2024)',
        fuels: { diesel: 5.7 }
    },
    'ford-kuga-2024': {
        label: 'Ford Kuga 1.5 EcoBlue (2024)',
        fuels: { diesel: 5.5 }
    },
    'ford-tourneo-courier-2024': {
        label: 'Ford Tourneo Courier 1.0 (2024)',
        fuels: { benzina: 6.5 }
    },
    'alfa-romeo-tonale-2024': {
        label: 'Alfa Romeo Tonale 1.5 Hybrid (2024)',
        fuels: { benzina: 5.6 }
    },
    'suzuki-swift-2024': {
        label: 'Suzuki Swift 1.2 Hybrid (2024)',
        fuels: { benzina: 4.7 }
    },
    'skoda-fabia-2024': {
        label: 'Skoda Fabia 1.0 TSI (2024)',
        fuels: { benzina: 5.3 }
    },
    'suzuki-vitara-2024': {
        label: 'Suzuki Vitara 1.4 Hybrid (2024)',
        fuels: { benzina: 5.8 }
    },
    'skoda-kamiq-2024': {
        label: 'Skoda Kamiq 1.0 TSI (2024)',
        fuels: { benzina: 5.4 }
    },
    'vw-taigo-2024': {
        label: 'Volkswagen Taigo 1.0 TSI (2024)',
        fuels: { benzina: 5.3 }
    },
    'lancia-ypsilon-2024': {
        label: 'Lancia Ypsilon 1.0 Hybrid (2024)',
        fuels: { benzina: 4.8 }
    },
    'audi-a1-2024': {
        label: 'Audi A1 30 TFSI (2024)',
        fuels: { benzina: 5.3 }
    },
    'bmw-serie1-2024': {
        label: 'BMW Serie 1 118d (2024)',
        fuels: { diesel: 5.0 }
    },
    'renault-symbioz-2024': {
        label: 'Renault Symbioz E-Tech (2024)',
        fuels: { benzina: 4.7 }
    },
    'dr-50-2024': {
        label: 'DR 5.0 1.5 Turbo (2024)',
        fuels: { benzina: 7.8, gpl: 8.0 }
    },
    'volvo-xc40-2024': {
        label: 'Volvo XC40 B4 (2024)',
        fuels: { benzina: 7.1 }
    },
    'fiat-500x-2024': {
        label: 'Fiat 500X 1.0 T3 (2024)',
        fuels: { benzina: 6.4 }
    },
    'fiat-tipo-2024': {
        label: 'Fiat Tipo 1.0 T3 (2024)',
        fuels: { benzina: 5.9 }
    },
    'jeep-compass-2024': {
        label: 'Jeep Compass 1.5 e-Hybrid (2024)',
        fuels: { benzina: 6.6 }
    },
    'citroen-c3-aircross-2024': {
        label: 'Citroen C3 Aircross 1.2 (2024)',
        fuels: { benzina: 6.0 }
    },
    'peugeot-5008-2024': {
        label: 'Peugeot 5008 1.5 BlueHDi (2024)',
        fuels: { diesel: 5.6 }
    },
    'peugeot-308-2024': {
        label: 'Peugeot 308 1.2 PureTech (2024)',
        fuels: { benzina: 5.6 }
    },
    'renault-austral-2024': {
        label: 'Renault Austral E-Tech (2024)',
        fuels: { benzina: 5.5 }
    },
    'opel-mokka-2024': {
        label: 'Opel Mokka 1.2 Turbo (2024)',
        fuels: { benzina: 5.8 }
    },
    'opel-crossland-2024': {
        label: 'Opel Crossland 1.2 Turbo (2024)',
        fuels: { benzina: 5.9 }
    },
    'ford-fiesta-2024': {
        label: 'Ford Fiesta 1.0 EcoBoost (2024)',
        fuels: { benzina: 5.4 }
    },
    'ford-ecosport-2024': {
        label: 'Ford EcoSport 1.0 EcoBoost (2024)',
        fuels: { benzina: 6.5 }
    },
    'hyundai-i20-2024': {
        label: 'Hyundai i20 1.0 T-GDi (2024)',
        fuels: { benzina: 5.3 }
    },
    'hyundai-kona-2024': {
        label: 'Hyundai Kona 1.0 T-GDi (2024)',
        fuels: { benzina: 5.9 }
    },
    'hyundai-santa-fe-2024': {
        label: 'Hyundai Santa Fe Hybrid (2024)',
        fuels: { benzina: 6.8 }
    },
    'kia-ceed-2024': {
        label: 'Kia Ceed 1.0 T-GDi (2024)',
        fuels: { benzina: 5.5 }
    },
    'kia-niro-2024': {
        label: 'Kia Niro Hybrid (2024)',
        fuels: { benzina: 4.8 }
    },
    'kia-sorento-2024': {
        label: 'Kia Sorento Hybrid (2024)',
        fuels: { benzina: 7.0 }
    },
    'nissan-micra-2024': {
        label: 'Nissan Micra 1.0 IG-T (2024)',
        fuels: { benzina: 5.6 }
    },
    'mazda-cx3-2024': {
        label: 'Mazda CX-3 2.0 (2024)',
        fuels: { benzina: 6.6 }
    },
    'mazda-cx30-2024': {
        label: 'Mazda CX-30 2.0 (2024)',
        fuels: { benzina: 6.4 }
    },
    'mazda-cx5-2024': {
        label: 'Mazda CX-5 2.2d (2024)',
        fuels: { diesel: 6.0 }
    },
    'audi-a6-2024': {
        label: 'Audi A6 40 TDI (2024)',
        fuels: { diesel: 5.7 }
    },
    'mercedes-classe-a-2024': {
        label: 'Mercedes Classe A 180d (2024)',
        fuels: { diesel: 5.1 }
    },
    'mercedes-classe-c-2024': {
        label: 'Mercedes Classe C 200d (2024)',
        fuels: { diesel: 5.5 }
    },
    'mercedes-classe-e-2024': {
        label: 'Mercedes Classe E 220d (2024)',
        fuels: { diesel: 5.6 }
    },
    'bmw-serie3-2024': {
        label: 'BMW Serie 3 320d (2024)',
        fuels: { diesel: 5.2 }
    },
    'bmw-serie5-2024': {
        label: 'BMW Serie 5 520d (2024)',
        fuels: { diesel: 5.4 }
    },
    'volvo-xc60-2024': {
        label: 'Volvo XC60 B4 (2024)',
        fuels: { benzina: 6.9 }
    },
    'volvo-s60-2024': {
        label: 'Volvo S60/V60 B4 (2024)',
        fuels: { benzina: 6.3 }
    },
    'seat-leon-2024': {
        label: 'Seat Leon 1.5 TSI (2024)',
        fuels: { benzina: 5.7 }
    },
    'seat-arona-2024': {
        label: 'Seat Arona 1.0 TSI (2024)',
        fuels: { benzina: 5.5 }
    },
    'skoda-octavia-2024': {
        label: 'Skoda Octavia 2.0 TDI (2024)',
        fuels: { diesel: 4.7 }
    },
    'skoda-superb-2024': {
        label: 'Skoda Superb 2.0 TDI (2024)',
        fuels: { diesel: 5.5 }
    },
    'toyota-highlander-2024': {
        label: 'Toyota Highlander Hybrid (2024)',
        fuels: { benzina: 7.1 }
    },
    'honda-civic-2024': {
        label: 'Honda Civic e:HEV (2024)',
        fuels: { benzina: 4.7 }
    },
    'honda-crv-2024': {
        label: 'Honda CR-V e:HEV (2024)',
        fuels: { benzina: 6.4 }
    },
    'tesla-model-y-2024': {
        label: 'Tesla Model Y RWD (2024)',
        fuels: { elettrico: 15.9 }
    },
    'byd-dolphin-2024': {
        label: 'BYD Dolphin (2024)',
        fuels: { elettrico: 14.5 }
    },
    'omoda-5-2024': {
        label: 'Omoda 5 EV (2024)',
        fuels: { elettrico: 17.8 }
    },
    'jaguar-e-pace-2024': {
        label: 'Jaguar E-Pace D165 (2024)',
        fuels: { diesel: 6.9 }
    },
    'fiat-punto-2012': {
        label: 'Fiat Punto 1.2 (2012)',
        fuels: { benzina: 6.0 }
    },
    'fiat-grande-punto-2015': {
        label: 'Fiat Grande Punto 1.3 MJET (2015)',
        fuels: { diesel: 4.6 }
    },
    'fiat-bravo-2014': {
        label: 'Fiat Bravo 1.6 MJET (2014)',
        fuels: { diesel: 5.0 }
    },
    'fiat-124-spider-2018': {
        label: 'Fiat 124 Spider 1.4 (2018)',
        fuels: { benzina: 6.4 }
    },
    'fiat-qubo-2018': {
        label: 'Fiat Qubo 1.3 MJET (2018)',
        fuels: { diesel: 5.1 }
    },
    'fiat-doblo-2020': {
        label: 'Fiat Doblo 1.6 MJET (2020)',
        fuels: { diesel: 5.8 }
    },
    'fiat-freemont-2014': {
        label: 'Fiat Freemont 2.0 MJET (2014)',
        fuels: { diesel: 7.5 }
    },
    'fiat-fiorino-2019': {
        label: 'Fiat Fiorino 1.3 MJET (2019)',
        fuels: { diesel: 5.1 }
    },
    'fiat-scudo-2022': {
        label: 'Fiat Scudo 2.0 (2022)',
        fuels: { diesel: 6.9 }
    },
    'lancia-delta-2014': {
        label: 'Lancia Delta 1.6 MJET (2014)',
        fuels: { diesel: 5.4 }
    },
    'lancia-musa-2012': {
        label: 'Lancia Musa 1.3 MJET (2012)',
        fuels: { diesel: 5.0 }
    },
    'toyota-supra-2024': {
        label: 'Toyota Supra 3.0 (2024)',
        fuels: { benzina: 8.2 }
    },
    'dacia-jogger-2024': {
        label: 'Dacia Jogger 1.0 TCe (2024)',
        fuels: { benzina: 6.2 }
    },
    'renault-megane-2024': {
        label: 'Renault Megane 1.3 TCe (2024)',
        fuels: { benzina: 6.0 }
    },
    'renault-scenic-2024': {
        label: 'Renault Scenic E-Tech (2024)',
        fuels: { elettrico: 15.4 }
    },
    'renault-talisman-2020': {
        label: 'Renault Talisman 1.7 dCi (2020)',
        fuels: { diesel: 5.5 }
    },
    'renault-kadjar-2022': {
        label: 'Renault Kadjar 1.3 TCe (2022)',
        fuels: { benzina: 6.4 }
    },
    'citroen-c4-2024': {
        label: 'Citroen C4 1.2 (2024)',
        fuels: { benzina: 5.7 }
    },
    'citroen-c5-aircross-2024': {
        label: 'Citroen C5 Aircross 1.5 BlueHDi (2024)',
        fuels: { diesel: 5.1 }
    },
    'peugeot-407-2010': {
        label: 'Peugeot 407 2.0 HDi (2010)',
        fuels: { diesel: 6.5 }
    },
    'peugeot-508-2024': {
        label: 'Peugeot 508 1.5 BlueHDi (2024)',
        fuels: { diesel: 4.8 }
    },
    'peugeot-206-2009': {
        label: 'Peugeot 206 1.4 (2009)',
        fuels: { benzina: 6.2 }
    },
    'opel-astra-2024': {
        label: 'Opel Astra 1.2 Turbo (2024)',
        fuels: { benzina: 5.5 }
    },
    'opel-insignia-2020': {
        label: 'Opel Insignia 2.0 CDTI (2020)',
        fuels: { diesel: 5.7 }
    },
    'opel-adam-2018': {
        label: 'Opel Adam 1.2 (2018)',
        fuels: { benzina: 5.4 }
    },
    'ford-mondeo-2020': {
        label: 'Ford Mondeo 2.0 EcoBlue (2020)',
        fuels: { diesel: 5.8 }
    },
    'vw-passat-2024': {
        label: 'Volkswagen Passat 2.0 TDI (2024)',
        fuels: { diesel: 4.9 }
    },
    'vw-touran-2022': {
        label: 'Volkswagen Touran 2.0 TDI (2022)',
        fuels: { diesel: 5.2 }
    },
    'vw-up-2023': {
        label: 'Volkswagen Up 1.0 (2023)',
        fuels: { benzina: 5.0 }
    },
    'vw-touareg-2024': {
        label: 'Volkswagen Touareg 3.0 TDI (2024)',
        fuels: { diesel: 7.5 }
    },
    'vw-sharan-2020': {
        label: 'Volkswagen Sharan 2.0 TDI (2020)',
        fuels: { diesel: 6.1 }
    },
    'vw-caddy-2023': {
        label: 'Volkswagen Caddy 2.0 TDI (2023)',
        fuels: { diesel: 5.7 }
    },
    'vw-golf-variant': {
        label: 'Volkswagen Golf Variant (2023)',
        fuels: { benzina: 5.5 }
    },
    'bmw-x3-2024': {
        label: 'BMW X3 20d (2024)',
        fuels: { diesel: 6.2 }
    },
    'bmw-x5-2024': {
        label: 'BMW X5 30d (2024)',
        fuels: { diesel: 7.0 }
    },
    'mercedes-glc-2024': {
        label: 'Mercedes GLC 220d (2024)',
        fuels: { diesel: 5.9 }
    },
    'mercedes-gle-2024': {
        label: 'Mercedes GLE 300d (2024)',
        fuels: { diesel: 6.8 }
    },
    'audi-q5-2024': {
        label: 'Audi Q5 40 TDI (2024)',
        fuels: { diesel: 5.9 }
    },
    'audi-q7-2024': {
        label: 'Audi Q7 45 TDI (2024)',
        fuels: { diesel: 7.1 }
    },
    'porsche-macan-2024': {
        label: 'Porsche Macan 2.0 (2024)',
        fuels: { benzina: 8.8 }
    },
    'porsche-cayenne-2024': {
        label: 'Porsche Cayenne 3.0 (2024)',
        fuels: { benzina: 9.8 }
    },
    'land-rover-range-rover-2024': {
        label: 'Land Rover Range Rover D300 (2024)',
        fuels: { diesel: 8.3 }
    },
    'land-rover-discovery-2024': {
        label: 'Land Rover Discovery D250 (2024)',
        fuels: { diesel: 8.0 }
    },
    'land-rover-defender-2024': {
        label: 'Land Rover Defender D250 (2024)',
        fuels: { diesel: 8.2 }
    },
    'land-rover-evoque-2024': {
        label: 'Land Rover Evoque D165 (2024)',
        fuels: { diesel: 6.9 }
    },
    'lexus-nx-2024': {
        label: 'Lexus NX 350h (2024)',
        fuels: { benzina: 5.8 }
    },
    'lexus-ux-2024': {
        label: 'Lexus UX 250h (2024)',
        fuels: { benzina: 5.3 }
    },
    'lexus-rx-2024': {
        label: 'Lexus RX 450h+ (2024)',
        fuels: { benzina: 6.7 }
    },
    'seat-ibiza-2024': {
        label: 'Seat Ibiza 1.0 TSI (2024)',
        fuels: { benzina: 5.3 }
    },
    'seat-tarraco-2024': {
        label: 'Seat Tarraco 2.0 TDI (2024)',
        fuels: { diesel: 6.4 }
    },
    'cupra-formentor-2024': {
        label: 'Cupra Formentor 1.5 TSI (2024)',
        fuels: { benzina: 6.0 }
    },
    'cupra-leon-2024': {
        label: 'Cupra Leon 1.5 TSI (2024)',
        fuels: { benzina: 6.1 }
    },
    'ds3-2024': {
        label: 'DS 3 1.2 PureTech (2024)',
        fuels: { benzina: 5.7 }
    },
    'ds4-2024': {
        label: 'DS 4 1.5 BlueHDi (2024)',
        fuels: { diesel: 4.8 }
    },
    'ds7-2024': {
        label: 'DS 7 1.5 BlueHDi (2024)',
        fuels: { diesel: 5.2 }
    },
    'maserati-ghibli-2023': {
        label: 'Maserati Ghibli Hybrid (2023)',
        fuels: { benzina: 8.6 }
    },
    'maserati-levante-2023': {
        label: 'Maserati Levante 2.0 Hybrid (2023)',
        fuels: { benzina: 9.4 }
    },
    'maserati-quattroporte-2020': {
        label: 'Maserati Quattroporte 3.0 (2020)',
        fuels: { benzina: 10.5 }
    },
    'jaguar-f-pace-2024': {
        label: 'Jaguar F-Pace D200 (2024)',
        fuels: { diesel: 6.8 }
    },
    'jaguar-xe-2021': {
        label: 'Jaguar XE D200 (2021)',
        fuels: { diesel: 5.7 }
    },
    'jaguar-xf-2021': {
        label: 'Jaguar XF D200 (2021)',
        fuels: { diesel: 5.9 }
    },
    'jeep-wrangler-2024': {
        label: 'Jeep Wrangler 2.0 (2024)',
        fuels: { benzina: 10.5 }
    },
    'jeep-grand-cherokee-2024': {
        label: 'Jeep Grand Cherokee 4xe (2024)',
        fuels: { benzina: 9.0 }
    },
    'jeep-cherokee-2020': {
        label: 'Jeep Cherokee 2.0 (2020)',
        fuels: { benzina: 8.9 }
    },
    'alfa-romeo-giulietta-2020': {
        label: 'Alfa Romeo Giulietta 1.6 JTDM (2020)',
        fuels: { diesel: 5.1 }
    },
    'alfa-romeo-giulia-2024': {
        label: 'Alfa Romeo Giulia 2.2 (2024)',
        fuels: { diesel: 5.3 }
    },
    'alfa-romeo-stelvio-2024': {
        label: 'Alfa Romeo Stelvio 2.2 (2024)',
        fuels: { diesel: 6.0 }
    },
    'alfa-romeo-159-2011': {
        label: 'Alfa Romeo 159 2.0 JTDM (2011)',
        fuels: { diesel: 6.1 }
    },
    'alfa-romeo-spider-2010': {
        label: 'Alfa Romeo Spider 2.2 (2010)',
        fuels: { benzina: 8.2 }
    },
    'suzuki-ignis-2024': {
        label: 'Suzuki Ignis Hybrid (2024)',
        fuels: { benzina: 4.7 }
    },
    'suzuki-s-cross-2024': {
        label: 'Suzuki S-Cross Hybrid (2024)',
        fuels: { benzina: 5.8 }
    },
    'mitsubishi-outlander-2024': {
        label: 'Mitsubishi Outlander PHEV (2024)',
        fuels: { benzina: 7.4 }
    },
    'mitsubishi-asx-2023': {
        label: 'Mitsubishi ASX 1.3 (2023)',
        fuels: { benzina: 6.5 }
    },
    'subaru-forester-2024': {
        label: 'Subaru Forester e-Boxer (2024)',
        fuels: { benzina: 7.2 }
    },
    'subaru-impreza-2024': {
        label: 'Subaru Impreza 2.0 (2024)',
        fuels: { benzina: 6.8 }
    },
    'land-rover-range-rover-sport-2024': {
        label: 'Land Rover Range Rover Sport D300 (2024)',
        fuels: { diesel: 8.5 }
    },
    'mini-cooper-2024': {
        label: 'Mini Cooper 1.5 (2024)',
        fuels: { benzina: 5.8 }
    },
    'mini-countryman-2024': {
        label: 'Mini Countryman 1.5 (2024)',
        fuels: { benzina: 6.3 }
    },
    'smart-fortwo-2020': {
        label: 'Smart ForTwo EQ (2020)',
        fuels: { elettrico: 15.9 }
    },
    'smart-forfour-2020': {
        label: 'Smart ForFour EQ (2020)',
        fuels: { elettrico: 17.0 }
    },
    'honda-jazz-2024': {
        label: 'Honda Jazz e:HEV (2024)',
        fuels: { benzina: 4.5 }
    },
    'honda-hrv-2024': {
        label: 'Honda HR-V e:HEV (2024)',
        fuels: { benzina: 5.4 }
    },
    'honda-accord-2019': {
        label: 'Honda Accord 2.0 Hybrid (2019)',
        fuels: { benzina: 5.4 }
    },
    'nissan-note-2017': {
        label: 'Nissan Note 1.5 dCi (2017)',
        fuels: { diesel: 4.6 }
    },
    'toyota-verso-2018': {
        label: 'Toyota Verso 1.8 (2018)',
        fuels: { benzina: 6.8 }
    },
    'mazda6-2020': {
        label: 'Mazda 6 2.2d (2020)',
        fuels: { diesel: 5.8 }
    },
    'toyota-land-cruiser-2024': {
        label: 'Toyota Land Cruiser 2.8 D (2024)',
        fuels: { diesel: 8.9 }
    },
    'nissan-xtrail-2024': {
        label: 'Nissan X-Trail e-Power (2024)',
        fuels: { benzina: 6.8 }
    },
    'toyota-proace-2023': {
        label: 'Toyota Proace 2.0 D (2023)',
        fuels: { diesel: 6.6 }
    },
    'peugeot-partner-2023': {
        label: 'Peugeot Partner 1.5 BlueHDi (2023)',
        fuels: { diesel: 5.8 }
    },
    'citroen-berlingo-2023': {
        label: 'Citroen Berlingo 1.5 BlueHDi (2023)',
        fuels: { diesel: 5.8 }
    },
    'peugeot-traveller-2023': {
        label: 'Peugeot Traveller 2.0 BlueHDi (2023)',
        fuels: { diesel: 6.9 }
    },
    'mercedes-v-class-2024': {
        label: 'Mercedes V-Class 220d (2024)',
        fuels: { diesel: 7.1 }
    },
    'opel-zafira-2021': {
        label: 'Opel Zafira Life 2.0 D (2021)',
        fuels: { diesel: 6.8 }
    },
    'ford-smax-2020': {
        label: 'Ford S-Max 2.0 EcoBlue (2020)',
        fuels: { diesel: 6.0 }
    },
    'ford-galaxy-2020': {
        label: 'Ford Galaxy 2.0 EcoBlue (2020)',
        fuels: { diesel: 6.1 }
    },
    'seat-alhambra-2020': {
        label: 'Seat Alhambra 2.0 TDI (2020)',
        fuels: { diesel: 6.1 }
    },
    'kia-carnival-2024': {
        label: 'Kia Carnival 2.2 CRDi (2024)',
        fuels: { diesel: 7.6 }
    },
    'peugeot-4008-2013': {
        label: 'Peugeot 4008 1.8 HDi (2013)',
        fuels: { diesel: 5.6 }
    },
    'mg4-2024': {
        label: 'MG4 Electric (2024)',
        fuels: { elettrico: 16.6 }
    },
    'tesla-model-s-2024': {
        label: 'Tesla Model S (2024)',
        fuels: { elettrico: 18.5 }
    },
    'tesla-model-x-2024': {
        label: 'Tesla Model X (2024)',
        fuels: { elettrico: 21.0 }
    },
    'chevrolet-spark-2015': {
        label: 'Chevrolet Spark 1.0 (2015)',
        fuels: { benzina: 5.7 }
    },
    'chevrolet-aveo-2015': {
        label: 'Chevrolet Aveo 1.2 (2015)',
        fuels: { benzina: 6.0 }
    },
    'citroen-c4-cactus-2019': {
        label: 'Citroen C4 Cactus 1.2 (2019)',
        fuels: { benzina: 5.3 }
    },
    'skoda-kodiaq-2024': {
        label: 'Skoda Kodiaq 2.0 TDI (2024)',
        fuels: { diesel: 6.2 }
    },
    'alfa-romeo-mito-2018': {
        label: 'Alfa Romeo MiTo 1.4 (2018)',
        fuels: { benzina: 6.1 }
    },
    'renault-espace-2019': {
        label: 'Renault Espace 2.0 dCi (2019)',
        fuels: { diesel: 6.4 }
    }
};

// Prezzi di riferimento per carburante/energia (per aggiornare il campo prezzo in automatico)
const fuelDefaults = {
    benzina: 1.85,
    diesel: 1.75,
    gpl: 0.75,
    metano: 1.40,
    elettrico: 0.30,
    'ibrido-elettrico-benzina': 1.85,
    'ibrido-elettrico-diesel': 1.75,
    'metano-benzina': 1.40
};

// Unità di misura per ogni alimentazione
const fuelUnits = {
    benzina: 'L',
    diesel: 'L',
    gpl: 'L',
    metano: 'kg',
    elettrico: 'kWh',
    'ibrido-elettrico-benzina': 'L',
    'ibrido-elettrico-diesel': 'L',
    'metano-benzina': 'kg'
};

// Alias per carburanti dual mode (usiamo il carburante base per consumi/prezzo/unità)
const fuelAliases = {
    'ibrido-elettrico-benzina': 'benzina',
    'ibrido-elettrico-diesel': 'diesel',
    'metano-benzina': 'metano'
};

function resolveBaseFuel(fuelType) {
    return fuelAliases[fuelType] || fuelType;
}

function getFuelUnit(fuelType) {
    const base = resolveBaseFuel(fuelType);
    return fuelUnits[fuelType] || fuelUnits[base] || 'L';
}

function getFuelDefault(fuelType) {
    const base = resolveBaseFuel(fuelType);
    if (fuelDefaults[fuelType] !== undefined) return fuelDefaults[fuelType];
    return fuelDefaults[base];
}

function enrichDualFuel(label, fuels) {
    if (!fuels) return fuels;
    const enriched = { ...fuels };
    const name = (label || '').toLowerCase();
    const isHybrid = /(ibrid|hybrid|plug|phev|mhev|hev|e-tech|e:hev)/i.test(name);
    const isCng = /(metano|natural power|cng)/i.test(name);

    if (isHybrid && enriched.benzina !== undefined && enriched['ibrido-elettrico-benzina'] === undefined) {
        enriched['ibrido-elettrico-benzina'] = enriched.benzina;
    }
    if (isHybrid && enriched.diesel !== undefined && enriched['ibrido-elettrico-diesel'] === undefined) {
        enriched['ibrido-elettrico-diesel'] = enriched.diesel;
    }
    if (isCng && enriched.metano !== undefined && enriched['metano-benzina'] === undefined) {
        enriched['metano-benzina'] = enriched.metano;
    }

    return enriched;
}

// Arricchisce i profili statici con i carburanti ibridi/bifuel quando coerenti con il modello
Object.keys(carConsumption).forEach(key => {
    const profile = carConsumption[key];
    profile.fuels = enrichDualFuel(profile.label, profile.fuels);
});

// Carica modelli estesi da JSON esterno per non appesantire il bundle
const DYNAMIC_MODELS_GROUP_ID = 'dynamic-models-group';
const BRAND_DATA_VERSION = '5';
const MODEL_YEAR_MIN = 1980;
const MODEL_YEAR_MAX = Math.max(new Date().getFullYear(), 2026);
const OFFICIAL_MODELS_SOURCE = 'vpic-nhtsa';
const officialModelNameCache = new Map();
const officialModelRequestCache = new Map();
const officialModelVariantCache = new Map();
const officialModelVariantRequestCache = new Map();
let modelSearchRequestId = 0;
const officialMakeAliases = {
    'alfa-romeo': 'alfa romeo',
    'land-rover': 'land rover',
    mercedes: 'mercedes-benz',
    ds: 'ds automobiles'
};
const brandInferenceAliases = {
    'land-rover': ['range rover', 'evoque', 'velar', 'defender', 'discovery sport', 'discovery'],
    audi: ['q8', 'q7', 'q6 e tron', 'q8 e tron', 'rs q8'],
    mercedes: ['mercedes benz'],
    'alfa-romeo': ['alfa romeo']
};
const MODEL_IMAGE_MAP = {
    // Esempio: 'fiat-panda-2024': 'assets/cars/fiat-panda-2024.png'
};
const SILHOUETTE_MAP = {
    city: 'assets/cars/silhouettes/city.svg',
    hatchback: 'assets/cars/silhouettes/hatchback.svg',
    sedan: 'assets/cars/silhouettes/sedan.svg',
    coupe: 'assets/cars/silhouettes/coupe.svg',
    sport: 'assets/cars/silhouettes/sport.svg',
    suv: 'assets/cars/silhouettes/suv.svg',
    wagon: 'assets/cars/silhouettes/wagon.svg',
    van: 'assets/cars/silhouettes/van.svg',
    pickup: 'assets/cars/silhouettes/pickup.svg'
};
const brandDataFiles = {
    fiat: 'models/brand_fiat.json',
    toyota: 'models/brand_toyota.json',
    volkswagen: 'models/brand_volkswagen.json',
    renault: 'models/brand_renault.json',
    peugeot: 'models/brand_peugeot.json',
    ford: 'models/brand_ford.json',
    opel: 'models/brand_opel.json',
    bmw: 'models/brand_bmw.json',
    mercedes: 'models/brand_mercedes.json',
    audi: 'models/brand_audi.json',
    kia: 'models/brand_kia.json',
    hyundai: 'models/brand_hyundai.json',
    nissan: 'models/brand_nissan.json',
    dacia: 'models/brand_dacia.json',
    jeep: 'models/brand_jeep.json',
    'alfa-romeo': 'models/brand_alfa_romeo.json',
    volvo: 'models/brand_volvo.json',
    skoda: 'models/brand_skoda.json',
    seat: 'models/brand_seat.json',
    citroen: 'models/brand_citroen.json',
    tesla: 'models/brand_tesla.json',
    mazda: 'models/brand_mazda.json',
    honda: 'models/brand_honda.json',
    suzuki: 'models/brand_suzuki.json',
    'land-rover': 'models/brand_land_rover.json',
    lexus: 'models/brand_lexus.json',
    mitsubishi: 'models/brand_mitsubishi.json',
    subaru: 'models/brand_subaru.json',
    porsche: 'models/brand_porsche.json',
    mini: 'models/brand_mini.json',
    smart: 'models/brand_smart.json',
    byd: 'models/brand_byd.json',
    mg: 'models/brand_mg.json',
    dr: 'models/brand_dr.json',
    ds: 'models/brand_ds.json',
    maserati: 'models/brand_maserati.json',
    jaguar: 'models/brand_jaguar.json',
    cupra: 'models/brand_cupra.json',
    lancia: 'models/brand_lancia.json'
};
const loadedBrandData = new Set();

function normalizeModelLabel(label = '') {
    return String(label)
        .replace(/\s*\((?:19|20)\d{2}\)\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeSearchText(text = '') {
    return String(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]+/g, ' ')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function scoreTextAgainstQuery(text = '', query = '') {
    const candidate = normalizeSearchText(text);
    const q = normalizeSearchText(query);
    if (!candidate || !q) return 0;

    if (candidate.includes(q)) return 100;

    const tokens = q.split(' ').filter(Boolean);
    if (!tokens.length) return 0;

    let matched = 0;
    tokens.forEach((token) => {
        if (candidate.includes(token)) matched += 1;
    });

    const minRequired = tokens.length <= 2 ? 1 : Math.max(2, tokens.length - 1);
    if (matched < minRequired) return 0;

    const longestToken = tokens.slice().sort((a, b) => b.length - a.length)[0] || '';
    const longestBoost = longestToken && candidate.includes(longestToken) ? 10 : 0;
    return 40 + (matched * 15) + longestBoost;
}

function escapeRegexLiteral(value = '') {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phraseInText(text = '', phrase = '') {
    const normalizedText = normalizeSearchText(text);
    const normalizedPhrase = normalizeSearchText(phrase);
    if (!normalizedText || !normalizedPhrase) return false;
    const pattern = normalizedPhrase.split(' ').map(escapeRegexLiteral).join('\\s+');
    return new RegExp(`\\b${pattern}\\b`, 'i').test(normalizedText);
}

function extractYearFromLabel(label = '') {
    const match = String(label).match(/\b((?:19|20)\d{2})\b/);
    if (!match) return null;
    const year = Number(match[1]);
    return Number.isFinite(year) ? year : null;
}

function slugifyModelToken(value = '') {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function buildModelVariantId(brandKey = '', baseLabel = '', year = '') {
    const brand = slugifyModelToken(brandKey) || 'brand';
    const model = slugifyModelToken(baseLabel) || 'model';
    return `${brand}-${model}-${year}`;
}

function resolveOfficialMakeName(brandKey = '', brandLabel = '') {
    if (officialMakeAliases[brandKey]) return officialMakeAliases[brandKey];
    if (brandLabel) return brandLabel.toLowerCase();
    return brandKey.replace(/-/g, ' ').toLowerCase();
}

function getBrandLabelFromKey(brandKey = '') {
    if (!brandKey || !carBrandSelect) return '';
    const value = `brand-${brandKey}`;
    const option = Array.from(carBrandSelect.options || []).find((opt) => (opt.value || '').toLowerCase() === value.toLowerCase());
    return formatBrandInputLabel((option?.textContent || '').trim()) || brandKey.replace(/-/g, ' ');
}

function inferBrandKeyFromModelQuery(query = '') {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return '';

    const entries = Object.entries(brandMatchers || {});
    for (const [brandKey, keys] of entries) {
        const terms = new Set();
        terms.add(brandKey.replace(/-/g, ' '));
        (keys || []).forEach((term) => terms.add(String(term).replace(/-/g, ' ')));
        (brandInferenceAliases[brandKey] || []).forEach((term) => terms.add(String(term)));
        for (const term of terms) {
            const compactTerm = term.replace(/\s+/g, '');
            const isShortCode = compactTerm.length >= 2 && /[a-z]/i.test(compactTerm) && /\d/.test(compactTerm);
            if (term.length < 3 && !isShortCode) continue;
            if (phraseInText(normalizedQuery, term)) {
                return brandKey;
            }
        }
    }
    return '';
}

function getRequestedYearHint(query = '') {
    const parsedYear = extractYearFromLabel(query);
    if (!Number.isFinite(parsedYear)) return null;
    return Math.min(Math.max(parsedYear, MODEL_YEAR_MIN), MODEL_YEAR_MAX);
}

async function fetchOfficialModelNames(brandKey = '', brandLabel = '', yearHint = null) {
    if (!brandKey) return [];
    const normalizedYear = Number.isFinite(yearHint) ? yearHint : null;
    const cacheKey = `${brandKey}|${normalizedYear || 'all'}`;

    if (officialModelNameCache.has(cacheKey)) {
        return officialModelNameCache.get(cacheKey);
    }
    if (officialModelRequestCache.has(cacheKey)) {
        return officialModelRequestCache.get(cacheKey);
    }

    const make = resolveOfficialMakeName(brandKey, brandLabel);
    const params = new URLSearchParams({ make });
    if (normalizedYear) params.set('year', String(normalizedYear));
    const endpoint = `${getApiBase()}/official-models?${params.toString()}`;

    const request = fetch(endpoint, { headers: { Accept: 'application/json' } })
        .then(async (res) => {
            if (!res.ok) return [];
            const payload = await res.json().catch(() => ({}));
            const names = Array.isArray(payload.items) ? payload.items : [];
            const deduped = Array.from(new Set(
                names.map((name) => normalizeModelLabel(name)).filter(Boolean)
            ));
            officialModelNameCache.set(cacheKey, deduped);
            return deduped;
        })
        .catch(() => [])
        .finally(() => {
            officialModelRequestCache.delete(cacheKey);
        });

    officialModelRequestCache.set(cacheKey, request);
    return request;
}

async function fetchOfficialModelVariantsByYear(brandKey = '', brandLabel = '', query = '') {
    if (!brandKey) return [];
    const normalizedQuery = normalizeSearchText(query);
    if (normalizedQuery.length < 6) return [];

    const cacheKey = `${brandKey}|${normalizedQuery}`;
    if (officialModelVariantCache.has(cacheKey)) {
        return officialModelVariantCache.get(cacheKey);
    }
    if (officialModelVariantRequestCache.has(cacheKey)) {
        return officialModelVariantRequestCache.get(cacheKey);
    }

    const make = resolveOfficialMakeName(brandKey, brandLabel);
    const currentYear = new Date().getFullYear();
    const yearFrom = Math.max(MODEL_YEAR_MIN, currentYear - 20);
    const yearTo = currentYear + 1;
    const params = new URLSearchParams({
        make,
        withYears: '1',
        query: normalizedQuery,
        yearFrom: String(yearFrom),
        yearTo: String(yearTo)
    });
    const endpoint = `${getApiBase()}/official-models?${params.toString()}`;

    const request = fetch(endpoint, { headers: { Accept: 'application/json' } })
        .then(async (res) => {
            if (!res.ok) return [];
            const payload = await res.json().catch(() => ({}));
            const rawItems = Array.isArray(payload.items) ? payload.items : [];
            const normalized = rawItems
                .map((entry) => ({
                    name: normalizeModelLabel(entry?.name || ''),
                    year: Number(entry?.year) || null
                }))
                .filter((entry) => entry.name && Number.isFinite(entry.year));
            officialModelVariantCache.set(cacheKey, normalized);
            return normalized;
        })
        .catch(() => [])
        .finally(() => {
            officialModelVariantRequestCache.delete(cacheKey);
        });

    officialModelVariantRequestCache.set(cacheKey, request);
    return request;
}

function buildEstimatedFuelsForBrand(brandSelectValue = '') {
    const brandFuels = carConsumption[brandSelectValue]?.fuels || {};
    const fallbackFuels = carConsumption.sedan?.fuels || { benzina: 6.4, diesel: 5.1, gpl: 7.4, metano: 4.8, elettrico: 17.5 };
    const result = {};
    ['benzina', 'diesel', 'gpl', 'metano', 'elettrico'].forEach((fuel) => {
        const brandValue = Number(brandFuels[fuel]);
        const fallbackValue = Number(fallbackFuels[fuel]);
        if (Number.isFinite(brandValue)) {
            result[fuel] = brandValue;
        } else if (Number.isFinite(fallbackValue)) {
            result[fuel] = fallbackValue;
        }
    });
    return result;
}

function buildSuggestedModelPayload(rawModelName = '', query = '', {
    official = false,
    brandKeyOverride = '',
    brandLabelOverride = '',
    yearOverride = null
} = {}) {
    const selectedBrandValue = (carBrandSelect?.value || '').trim();
    const selectedBrandKey = selectedBrandValue.replace(/^brand-/, '').trim().toLowerCase();
    const brandKey = (brandKeyOverride || selectedBrandKey || '').trim().toLowerCase();
    if (!brandKey) return null;

    const brandValue = carConsumption[`brand-${brandKey}`]
        ? `brand-${brandKey}`
        : selectedBrandValue;
    const brandLabel = (brandLabelOverride || formatBrandInputLabel(getSelectedOptionText(carBrandSelect)) || getBrandLabelFromKey(brandKey) || brandKey).trim();
    const modelName = normalizeModelLabel(rawModelName || query);
    if (!modelName || modelName.length < 2) return null;

    const queryYear = getRequestedYearHint(query);
    const parsedYearOverride = Number(yearOverride);
    const year = Number.isFinite(parsedYearOverride) ? parsedYearOverride : queryYear;
    const fullName = modelName.toLowerCase().startsWith(brandLabel.toLowerCase())
        ? (year ? `${modelName} (${year})` : modelName)
        : (year ? `${brandLabel} ${modelName} (${year})` : `${brandLabel} ${modelName}`);

    const idYearToken = year || 'nd';
    const idPrefix = official ? 'official' : 'custom';
    const modelId = `${buildModelVariantId(brandKey, normalizeModelLabel(fullName), idYearToken)}-${idPrefix}`;
    const modelData = {
        id: modelId,
        label: fullName,
        brand: brandKey,
        year: year || null,
        fuels: buildEstimatedFuelsForBrand(brandValue),
        source: official ? OFFICIAL_MODELS_SOURCE : 'manual'
    };

    return {
        value: modelId,
        label: official ? `Ufficiale: ${fullName}` : `Aggiungi: ${fullName}`,
        customModel: modelData
    };
}

async function collectOfficialModelMatches(query = '', brandKey = '', brandLabel = '') {
    if (!brandKey) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const yearHint = getRequestedYearHint(query);
    const names = await fetchOfficialModelNames(brandKey, brandLabel, yearHint);
    const baseMatches = names
        .map((name) => ({ name, score: scoreTextAgainstQuery(name, query) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 25)
        .map((item) => buildSuggestedModelPayload(item.name, query, {
            official: true,
            brandKeyOverride: brandKey,
            brandLabelOverride: brandLabel
        }))
        .filter(Boolean);

    let variantMatches = [];
    if (!yearHint) {
        const variants = await fetchOfficialModelVariantsByYear(brandKey, brandLabel, query);
        variantMatches = variants
            .map((entry) => ({
                name: entry.name,
                year: entry.year,
                score: scoreTextAgainstQuery(`${entry.name} ${entry.year}`, query)
            }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)
            .map((entry) => buildSuggestedModelPayload(entry.name, query, {
                official: true,
                brandKeyOverride: brandKey,
                brandLabelOverride: brandLabel,
                yearOverride: entry.year
            }))
            .filter(Boolean);
    }

    const merged = [];
    const seen = new Set();
    [...variantMatches, ...baseMatches].forEach((item) => {
        const key = (item?.label || '').toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        merged.push(item);
    });
    return merged;
}

async function loadCarModelsFromJson() {
    if (!carTypeSelect) return;
    if (carTypeSelect.dataset.dynamicLoaded === 'yes') return;
    try {
        const res = await fetch(`car_models.json?v=${BRAND_DATA_VERSION}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Impossibile caricare car_models.json');
        const models = await res.json();
        appendModelsToSelect(models, { replaceGroup: true });
        carTypeSelect.dataset.dynamicLoaded = 'yes';
    } catch (err) {
        console.error('Errore caricamento modelli estesi:', err);
        const errorOpt = document.createElement('option');
        errorOpt.value = '';
        errorOpt.textContent = '⚠️ Modelli estesi non disponibili (controlla connessione/server)';
        errorOpt.disabled = true;
        let group = carTypeSelect.querySelector(`#${DYNAMIC_MODELS_GROUP_ID}`);
        if (!group) {
            group = document.createElement('optgroup');
            group.id = DYNAMIC_MODELS_GROUP_ID;
            group.label = `Modelli estesi e ufficiali ${MODEL_YEAR_MIN}-${MODEL_YEAR_MAX}`;
            carTypeSelect.appendChild(group);
        }
        group.innerHTML = '';
        group.appendChild(errorOpt);
    }
}

// Mappa marche -> prefissi dei modelli (per filtrare la tendina modelli)
const brandMatchers = {
    fiat: ['fiat'],
    toyota: ['toyota'],
    volkswagen: ['volkswagen', 'vw'],
    renault: ['renault'],
    peugeot: ['peugeot'],
    ford: ['ford'],
    opel: ['opel'],
    bmw: ['bmw'],
    mercedes: ['mercedes'],
    audi: ['audi'],
    kia: ['kia'],
    hyundai: ['hyundai'],
    nissan: ['nissan'],
    dacia: ['dacia'],
    jeep: ['jeep'],
    'alfa-romeo': ['alfa-romeo', 'alfa'],
    volvo: ['volvo'],
    skoda: ['skoda'],
    seat: ['seat'],
    citroen: ['citroen'],
    tesla: ['tesla'],
    mazda: ['mazda'],
    honda: ['honda'],
    suzuki: ['suzuki'],
    'land-rover': ['land-rover', 'range-rover'],
    lexus: ['lexus'],
    mitsubishi: ['mitsubishi'],
    subaru: ['subaru'],
    porsche: ['porsche'],
    mini: ['mini'],
    smart: ['smart'],
    byd: ['byd'],
    mg: ['mg'],
    dr: ['dr'],
    ds: ['ds'],
    maserati: ['maserati'],
    jaguar: ['jaguar'],
    cupra: ['cupra'],
    lancia: ['lancia'],
    chevrolet: ['chevrolet'],
    omoda: ['omoda']
};

// Snapshot completo dei nodi option/optgroup per ricostruire il select (compatibilità mobile)
let carOptionsSnapshot = [];
function snapshotCarOptionsStructure() {
    if (!carTypeSelect) return;
    carOptionsSnapshot = Array.from(carTypeSelect.children).map(node => node.cloneNode(true));
}

let brandOptionsSnapshot = [];
function snapshotBrandOptions() {
    if (!carBrandSelect) return;
    brandOptionsSnapshot = Array.from(carBrandSelect.options).map(opt => ({
        value: opt.value,
        text: opt.textContent,
        disabled: opt.disabled
    }));
}

function clearResultsContainer(container) {
    if (!container) return;
    container.innerHTML = '';
    container.style.display = 'none';
}

function buildHighlightedText(text, query) {
    const fragment = document.createDocumentFragment();
    const raw = text || '';
    const needle = (query || '').trim();
    if (!needle) {
        fragment.appendChild(document.createTextNode(raw));
        return fragment;
    }

    const lowerText = raw.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    let fromIndex = 0;
    let matchIndex = lowerText.indexOf(lowerNeedle, fromIndex);

    if (matchIndex === -1) {
        fragment.appendChild(document.createTextNode(raw));
        return fragment;
    }

    while (matchIndex !== -1) {
        if (matchIndex > fromIndex) {
            fragment.appendChild(document.createTextNode(raw.slice(fromIndex, matchIndex)));
        }
        const mark = document.createElement('mark');
        mark.textContent = raw.slice(matchIndex, matchIndex + needle.length);
        fragment.appendChild(mark);
        fromIndex = matchIndex + needle.length;
        matchIndex = lowerText.indexOf(lowerNeedle, fromIndex);
    }

    if (fromIndex < raw.length) {
        fragment.appendChild(document.createTextNode(raw.slice(fromIndex)));
    }

    return fragment;
}

function renderResults(container, items, query, onPick) {
    if (!container) return;
    container.innerHTML = '';
    if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'filter-result-empty';
        empty.textContent = 'Nessun risultato';
        container.appendChild(empty);
        container.style.display = 'block';
        return;
    }

    items.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-result-item';
        btn.appendChild(buildHighlightedText(item.label, query));
        btn.addEventListener('click', () => onPick(item));
        container.appendChild(btn);
    });
    container.style.display = 'block';
}

function formatPhotonLabel(props = {}) {
    const parts = [];
    if (props.street) {
        const street = props.housenumber ? `${props.street} ${props.housenumber}` : props.street;
        parts.push(street);
    } else if (props.name) {
        parts.push(props.name);
    }
    if (props.city || props.town || props.village) {
        parts.push(props.city || props.town || props.village);
    }
    if (props.postcode) parts.push(props.postcode);
    return parts.filter(Boolean).join(', ');
}

function isStreetLike(props = {}) {
    if (props.street || props.housenumber) return true;
    if (props.type && String(props.type).toLowerCase().includes('street')) return true;
    if (props.osm_key === 'highway') return true;
    return false;
}

function isStreetLikeNominatim(item = {}) {
    const type = String(item.type || '').toLowerCase();
    const klass = String(item.class || '').toLowerCase();
    if (klass === 'highway') return true;
    if (klass === 'building' && type === 'house') return true;
    const streetTypes = new Set([
        'road', 'residential', 'tertiary', 'secondary', 'primary',
        'service', 'living_street', 'unclassified', 'trunk', 'motorway',
        'path', 'footway', 'cycleway', 'track'
    ]);
    return streetTypes.has(type);
}

function formatNominatimLabel(item = {}) {
    const address = item.address || {};
    const street = address.road || address.pedestrian || address.footway || address.cycleway || address.path;
    const house = address.house_number || address.housenumber;
    const locality = address.city || address.town || address.village || address.county;
    const parts = [];
    if (street) {
        parts.push(house ? `${street} ${house}` : street);
    } else if (item.display_name) {
        parts.push(item.display_name.split(',')[0]);
    }
    if (locality) parts.push(locality);
    if (address.postcode) parts.push(address.postcode);
    return parts.filter(Boolean).join(', ') || item.display_name || '';
}

function scoreNominatimItem(item = {}) {
    let score = 0;
    const address = item.address || {};
    if (address.house_number || address.housenumber) score += 3;
    if (String(item.type || '').toLowerCase() === 'house') score += 2;
    if (String(item.class || '').toLowerCase() === 'building') score += 1;
    if (isStreetLikeNominatim(item)) score += 1;
    return score;
}

async function fetchAddressSuggestionsPhoton(query, cityBias = '', signal) {
    const q = cityBias && !query.toLowerCase().includes(cityBias.toLowerCase())
        ? `${query}, ${cityBias}`
        : query;
    const url = `https://photon.komoot.io/api/?limit=6&lang=it&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal });
    if (!res.ok) return [];
    const data = await res.json();
    const features = data.features || [];
    const streetFirst = features.filter(f => isStreetLike(f.properties || {}));
    const picked = streetFirst.length ? streetFirst : features;
    return picked.map(f => {
        const coords = f.geometry && f.geometry.coordinates;
        const props = f.properties || {};
        const label = formatPhotonLabel(props) || props.name || query;
        return {
            label,
            lat: coords ? coords[1] : null,
            lng: coords ? coords[0] : null
        };
    }).filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));
}

async function fetchAddressSuggestionsNominatim(query, cityBias = '', signal) {
    const q = cityBias && !query.toLowerCase().includes(cityBias.toLowerCase())
        ? `${query}, ${cityBias}`
        : query;
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=it&accept-language=it&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal });
    if (!res.ok) return [];
    const data = await res.json();
    const sorted = data.slice().sort((a, b) => scoreNominatimItem(b) - scoreNominatimItem(a));
    const streetFirst = sorted.filter(isStreetLikeNominatim);
    const picked = streetFirst.length ? streetFirst : sorted;
    return picked.map(item => ({
        label: formatNominatimLabel(item) || item.display_name || query,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
    })).filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));
}

async function fetchAddressSuggestions(query, cityBias = '', signal) {
    const q = cityBias && !query.toLowerCase().includes(cityBias.toLowerCase())
        ? `${query}, ${cityBias}`
        : query;
    if (USE_PHOTON) {
        const photonItems = await fetchAddressSuggestionsPhoton(q, '', signal).catch(() => []);
        if (photonItems.length) return photonItems;
    }
    const nominatimItems = await fetchAddressSuggestionsNominatim(q, '', signal).catch(() => []);
    return nominatimItems;
}

function fetchCitySuggestions(query) {
    const normalizedQuery = normalizeCityName(query);
    if (!normalizedQuery) return [];
    return cities
        .filter(c => normalizeCityName(c.name).includes(normalizedQuery))
        .slice(0, 6)
        .map(c => ({
            kind: 'city',
            city: c.name,
            label: `${c.name} (${c.region})`
        }));
}

async function fetchUnifiedLocationSuggestions(query, signal) {
    const cityItems = fetchCitySuggestions(query);
    const addressItems = await fetchAddressSuggestions(query, '', signal).catch(() => []);
    const mappedAddresses = addressItems.map(item => ({
        kind: 'address',
        label: item.label,
        lat: item.lat,
        lng: item.lng
    }));

    const all = [...cityItems, ...mappedAddresses];
    const seen = new Set();
    return all.filter(item => {
        const key = `${item.kind}|${(item.city || item.label || '').toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, 10);
}

function debounce(fn, delay = 250) {
    let timer = null;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function setupAddressAutocomplete(input, resultsEl, citySelect) {
    if (!input || !resultsEl) return;
    let controller = null;
    const runSearch = async (value) => {
        if (controller) controller.abort();
        controller = new AbortController();
        const items = await fetchUnifiedLocationSuggestions(value, controller.signal).catch(() => []);
        if (input.value.trim() !== value) return;
        renderResults(resultsEl, items, value, (item) => {
            input.dataset.kind = item.kind || '';
            if (item.kind === 'city') {
                input.value = item.city || item.label || '';
                input.dataset.city = item.city || '';
                input.dataset.lat = '';
                input.dataset.lng = '';
                if (citySelect) citySelect.value = item.city || '';
            } else {
                input.value = item.label;
                input.dataset.city = '';
                input.dataset.lat = String(item.lat);
                input.dataset.lng = String(item.lng);
                if (citySelect) citySelect.value = '';
            }
            clearResultsContainer(resultsEl);
        });
    };
    const debouncedSearch = debounce(runSearch, 250);

    input.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        input.dataset.kind = '';
        input.dataset.city = '';
        input.dataset.lat = '';
        input.dataset.lng = '';
        if (citySelect) citySelect.value = '';
        if (!value || value.length < 2) {
            clearResultsContainer(resultsEl);
            return;
        }
        debouncedSearch(value);
    });
    input.addEventListener('blur', () => {
        setTimeout(() => clearResultsContainer(resultsEl), 150);
    });
}

function updateBrandResults(query = '') {
    if (!carBrandResults) return;
    const q = query.trim().toLowerCase();
    if (!q) {
        clearResultsContainer(carBrandResults);
        return;
    }

    if (!brandOptionsSnapshot.length) snapshotBrandOptions();
    const matches = brandOptionsSnapshot
        .filter((data, idx) => idx !== 0 && !data.disabled && (data.text.toLowerCase().includes(q) || data.value.toLowerCase().includes(q)))
        .map(data => ({ value: data.value, label: data.text }));

    renderResults(carBrandResults, matches, query, (item) => {
        carBrandSelect.value = item.value;
        syncBrandInputFromSelect();
        if (carTypeSearchInput) carTypeSearchInput.value = '';
        if (carTypeSelect) carTypeSelect.value = '';
        clearResultsContainer(carBrandResults);
        clearResultsContainer(carTypeResults);
        carBrandSelect.dispatchEvent(new Event('change'));
    });
}

function collectModelMatches(query = '', brandKey = '') {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const showAll = !brandKey;
    const results = [];
    const seen = new Set();
    const scoresByValue = new Map();

    carOptionsSnapshot.forEach(node => {
        if (node.tagName === 'OPTION') {
            const opt = node;
            if (!opt.value) return;
            const optBrand = (opt.dataset.brand || 'other').toLowerCase();
            const isGeneric = optBrand === 'all';
            const matchesBrand = showAll || isGeneric || optBrand === brandKey;
            const text = opt.textContent || '';
            const value = opt.value || '';
            const score = Math.max(scoreTextAgainstQuery(text, query), scoreTextAgainstQuery(value, query));
            if (matchesBrand && score > 0 && !seen.has(value)) {
                seen.add(value);
                scoresByValue.set(value, score);
                results.push({ value, label: text });
            }
            return;
        }

        if (node.tagName === 'OPTGROUP') {
            const options = Array.from(node.querySelectorAll('option'));
            options.forEach(opt => {
                if (!opt.value) return;
                const optBrand = (opt.dataset.brand || 'other').toLowerCase();
                const isGeneric = optBrand === 'all';
                const matchesBrand = showAll || isGeneric || optBrand === brandKey;
                const text = opt.textContent || '';
                const value = opt.value || '';
                const score = Math.max(scoreTextAgainstQuery(text, query), scoreTextAgainstQuery(value, query));
                if (matchesBrand && score > 0 && !seen.has(value)) {
                    seen.add(value);
                    scoresByValue.set(value, score);
                    results.push({ value, label: text });
                }
            });
        }
    });

    return results.sort((a, b) => (scoresByValue.get(b.value) || 0) - (scoresByValue.get(a.value) || 0));
}

async function updateModelResults(query = '') {
    const requestId = ++modelSearchRequestId;
    if (!carTypeResults) return;
    const q = query.trim().toLowerCase();
    if (!q) {
        clearResultsContainer(carTypeResults);
        return;
    }
    if (!carOptionsSnapshot.length) snapshotCarOptionsStructure();

    const selectedBrandKey = (carBrandSelect.value || '').replace(/^brand-/, '').trim().toLowerCase();
    const inferredBrandKey = selectedBrandKey ? '' : inferBrandKeyFromModelQuery(query);
    const brandKey = selectedBrandKey || inferredBrandKey;
    const selectedBrandLabel = formatBrandInputLabel(getSelectedOptionText(carBrandSelect));
    const brandLabel = selectedBrandLabel || getBrandLabelFromKey(brandKey);
    try {
        if (brandKey) await ensureBrandModelsLoaded(brandKey);
        const localMatches = collectModelMatches(query, brandKey);
        const officialMatches = await collectOfficialModelMatches(query, brandKey, brandLabel);
        if (requestId !== modelSearchRequestId) return;

        const merged = [];
        const seenLabels = new Set();
        [...localMatches, ...officialMatches].forEach((item) => {
            if (!item || !item.label) return;
            const key = item.label.toLowerCase();
            if (seenLabels.has(key)) return;
            seenLabels.add(key);
            merged.push(item);
        });

        let matches = merged.slice(0, 30);
        if (!matches.length) {
            const customSuggestion = buildSuggestedModelPayload(query, query, {
                official: false,
                brandKeyOverride: brandKey,
                brandLabelOverride: brandLabel
            });
            if (customSuggestion) matches = [customSuggestion];
        }

        renderResults(carTypeResults, matches, query, (item) => {
            if (item.customModel) {
                appendModelsToSelect([item.customModel]);
            }
            carTypeSelect.value = item.value;
            syncModelInputFromSelect();
            clearResultsContainer(carTypeResults);
            carTypeSelect.dispatchEvent(new Event('change'));
        });
    } catch (err) {
        if (requestId !== modelSearchRequestId) return;
        let fallbackMatches = collectModelMatches(query, brandKey).slice(0, 30);
        if (!fallbackMatches.length) {
            const customSuggestion = buildSuggestedModelPayload(query, query, {
                official: false,
                brandKeyOverride: brandKey,
                brandLabelOverride: brandLabel
            });
            if (customSuggestion) fallbackMatches = [customSuggestion];
        }
        renderResults(carTypeResults, fallbackMatches, query, (item) => {
            if (item.customModel) {
                appendModelsToSelect([item.customModel]);
            }
            carTypeSelect.value = item.value;
            syncModelInputFromSelect();
            clearResultsContainer(carTypeResults);
            carTypeSelect.dispatchEvent(new Event('change'));
        });
    }
}

function getSelectedOptionText(selectEl) {
    if (!selectEl) return '';
    const idx = selectEl.selectedIndex;
    if (idx < 0) return '';
    const opt = selectEl.options[idx];
    return (opt?.textContent || '').trim();
}

function formatBrandInputLabel(text = '') {
    return text.split(' (')[0].trim() || text.trim();
}

function syncBrandInputFromSelect() {
    if (!carBrandSearchInput || !carBrandSelect) return;
    const label = getSelectedOptionText(carBrandSelect);
    carBrandSearchInput.value = carBrandSelect.value ? formatBrandInputLabel(label) : '';
}

function syncModelInputFromSelect() {
    if (!carTypeSearchInput || !carTypeSelect) return;
    const label = getSelectedOptionText(carTypeSelect);
    carTypeSearchInput.value = carTypeSelect.value ? label : '';
}

// Elementi DOM
const departureSelect = document.getElementById('departure');
const arrivalSelect = document.getElementById('arrival');
const departureAddressInput = document.getElementById('departureAddress');
const arrivalAddressInput = document.getElementById('arrivalAddress');
const departureAddressResults = document.getElementById('departureAddressResults');
const arrivalAddressResults = document.getElementById('arrivalAddressResults');
const carBrandSelect = document.getElementById('carBrand');
const carTypeSelect = document.getElementById('carType');
const carBrandSearchInput = document.getElementById('carBrandSearch');
const carTypeSearchInput = document.getElementById('carTypeSearch');
const carBrandResults = document.getElementById('carBrandResults');
const carTypeResults = document.getElementById('carTypeResults');
const fuelTypeSelect = document.getElementById('fuelType');
const fuelPriceInput = document.getElementById('fuelPrice');
const fuelPriceLabel = document.getElementById('fuelPriceLabel');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('results');
const errorDiv = document.getElementById('error');
const homeBtn = document.getElementById('homeBtn');
const infoBtn = document.getElementById('infoBtn');
const infoPage = document.getElementById('infoPage');
const closeInfoViewBtn = document.getElementById('closeInfoView');
const backToCalculatorBtn = document.getElementById('backToCalculator');
const mainPanel = document.querySelector('main');
const settingsMenu = document.getElementById('settingsMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
const closeSettingsMenuBtn = document.getElementById('closeSettingsMenu');
const settingsMenuButtons = Array.from(document.querySelectorAll('#settingsMenu ul button'));
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesOverlay = document.getElementById('favoritesOverlay');
const favoritesList = document.getElementById('favoritesList');
const favoritesEmpty = document.getElementById('favoritesEmpty');
const closeFavoritesBtn = document.getElementById('closeFavorites');
const saveFavoriteBtn = document.getElementById('saveFavoriteBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const tripActionFeedback = document.getElementById('tripActionFeedback');
const accountBtn = document.getElementById('accountBtn');
const authOverlay = document.getElementById('authOverlay');
const closeAuthBtn = document.getElementById('closeAuth');
const friendRequestsBtn = document.getElementById('friendRequestsBtn');
const friendRequestsOverlay = document.getElementById('friendRequestsOverlay');
const closeFriendRequestsBtn = document.getElementById('closeFriendRequests');
const friendsBtn = document.getElementById('friendsBtn');
const friendsOverlay = document.getElementById('friendsOverlay');
const closeFriendsBtn = document.getElementById('closeFriends');
const authEmailInput = document.getElementById('authEmail');
const authUsernameInput = document.getElementById('authUsername');
const authPasswordInput = document.getElementById('authPassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authStatus = document.getElementById('authStatus');
const authFeedback = document.getElementById('authFeedback');
const accountGuestPanel = document.getElementById('accountGuestPanel');
const accountConnectedPanel = document.getElementById('accountConnectedPanel');
const accountAvatarPreview = document.getElementById('accountAvatarPreview');
const accountAvatarInput = document.getElementById('accountAvatarInput');
const accountAvatarUploadBtn = document.getElementById('accountAvatarUploadBtn');
const accountAvatarRemoveBtn = document.getElementById('accountAvatarRemoveBtn');
const accountDisplayName = document.getElementById('accountDisplayName');
const accountDisplayEmail = document.getElementById('accountDisplayEmail');
const accountMemberSince = document.getElementById('accountMemberSince');
const accountLastLogin = document.getElementById('accountLastLogin');
const accountProfileUsername = document.getElementById('accountProfileUsername');
const accountProfileEmail = document.getElementById('accountProfileEmail');
const accountProfileLocation = document.getElementById('accountProfileLocation');
const accountProfileBio = document.getElementById('accountProfileBio');
const accountSaveProfileBtn = document.getElementById('accountSaveProfileBtn');
const accountStatus = document.getElementById('accountStatus');
const accountCurrentPassword = document.getElementById('accountCurrentPassword');
const accountNewPassword = document.getElementById('accountNewPassword');
const accountChangePasswordBtn = document.getElementById('accountChangePasswordBtn');
const accountStatFavorites = document.getElementById('accountStatFavorites');
const accountStatCompleted = document.getElementById('accountStatCompleted');
const accountStatFriends = document.getElementById('accountStatFriends');
const accountStatKm = document.getElementById('accountStatKm');
const friendSearchInput = document.getElementById('friendSearchInput');
const friendSearchResults = document.getElementById('friendSearchResults');
const sendFriendRequestBtn = document.getElementById('sendFriendRequestBtn');
const friendsStatus = document.getElementById('friendsStatus');
const friendsStatusMirror = document.getElementById('friendsStatusMirror');
const friendRequestsList = document.getElementById('friendRequestsList');
const friendRequestsEmpty = document.getElementById('friendRequestsEmpty');
const friendOutgoingList = document.getElementById('friendOutgoingList');
const friendOutgoingEmpty = document.getElementById('friendOutgoingEmpty');
const shareFavoritesToggle = document.getElementById('shareFavoritesToggle');
const shareMyCarToggle = document.getElementById('shareMyCarToggle');
const shareCompanionsToggle = document.getElementById('shareCompanionsToggle');
const friendsList = document.getElementById('friendsList');
const friendsEmpty = document.getElementById('friendsEmpty');
const friendSharedList = document.getElementById('friendSharedList');
const friendSharedEmpty = document.getElementById('friendSharedEmpty');
const completedTripCheckbox = document.getElementById('completedTrip');
const companionsBtn = document.getElementById('companionsBtn');
const companionsOverlay = document.getElementById('companionsOverlay');
const closeCompanionsBtn = document.getElementById('closeCompanions');
const companionNameInput = document.getElementById('companionName');
const addCompanionBtn = document.getElementById('addCompanionBtn');
const companionsList = document.getElementById('companionsList');
const companionsEmpty = document.getElementById('companionsEmpty');
const participantsCount = document.getElementById('participantsCount');
const splitValue = document.getElementById('splitValue');
const companionsTripInfo = document.getElementById('companionsTripInfo');
const saveCompanionTripBtn = document.getElementById('saveCompanionTrip');
const companionsHistoryList = document.getElementById('companionsHistoryList');
const companionsHistoryEmpty = document.getElementById('companionsHistoryEmpty');
const budgetBtn = document.getElementById('budgetBtn');
const budgetOverlay = document.getElementById('budgetOverlay');
const closeBudgetBtn = document.getElementById('closeBudget');
const budgetTripsList = document.getElementById('budgetTripsList');
const budgetEmpty = document.getElementById('budgetEmpty');
const budgetMonthLabel = document.getElementById('budgetMonthLabel');
const budgetTotalTrips = document.getElementById('budgetTotalTrips');
const budgetTotalCost = document.getElementById('budgetTotalCost');
const budgetAvgCost = document.getElementById('budgetAvgCost');
const budgetFuelCost = document.getElementById('budgetFuelCost');
const budgetTollCost = document.getElementById('budgetTollCost');
const myCarBtn = document.getElementById('myCarBtn');
const myCarOverlay = document.getElementById('myCarOverlay');
const closeMyCarBtn = document.getElementById('closeMyCar');
const myCarImage = document.getElementById('myCarImage');
const myCarTitle = document.getElementById('myCarTitle');
const myCarMeta = document.getElementById('myCarMeta');
const myCarHint = document.getElementById('myCarHint');
const myCarBrandSelect = document.getElementById('myCarBrand');
const myCarModelSelect = document.getElementById('myCarModel');
const myCarKm = document.getElementById('myCarKm');
const myCarTrips = document.getElementById('myCarTrips');
const myCarTotalCost = document.getElementById('myCarTotalCost');
const myCarAvgCost = document.getElementById('myCarAvgCost');
const myCarUploadBtn = document.getElementById('myCarUploadBtn');
const myCarUploadInput = document.getElementById('myCarUploadInput');
const myCarRemoveBtn = document.getElementById('myCarRemoveBtn');
const myCarUploadStatus = document.getElementById('myCarUploadStatus');
const myCarConsentOverlay = document.getElementById('myCarConsentOverlay');
const useLocationBtn = document.getElementById('useLocationBtn');
const closeMyCarConsentBtn = document.getElementById('closeMyCarConsent');
const cancelMyCarConsentBtn = document.getElementById('cancelMyCarConsent');
const acceptMyCarConsentBtn = document.getElementById('acceptMyCarConsent');

// Inizializza i select con tutte le città (fallback API per tratte mancanti)
function initializeCities() {
    departureSelect.innerHTML = '<option value="">Seleziona città...</option>';
    arrivalSelect.innerHTML = '<option value="">Seleziona città...</option>';

    const cityNames = cities.map(c => c.name).sort();
    cityNames.forEach(city => {
        const optDep = document.createElement('option');
        optDep.value = city;
        optDep.textContent = city;
        departureSelect.appendChild(optDep);

        const optArr = document.createElement('option');
        optArr.value = city;
        optArr.textContent = city;
        arrivalSelect.appendChild(optArr);
    });

    // Imposta default fuel type e prezzo
    fuelTypeSelect.value = 'benzina';
    updateFuelPriceUI();
}

// Aggiorna etichetta e valore prezzo carburante in base al tipo scelto
function updateFuelPriceUI() {
    const fuelType = fuelTypeSelect.value;
    const baseFuelType = resolveBaseFuel(fuelType);
    const baseFuel = resolveBaseFuel(fuelType);
    const unit = getFuelUnit(fuelType);
    if (baseFuel === 'elettrico') {
        fuelPriceLabel.textContent = '⚡ Prezzo energia (€/kWh):';
    } else if (baseFuel === 'metano') {
        fuelPriceLabel.textContent = '⛽ Prezzo metano (€/kg):';
    } else {
        fuelPriceLabel.textContent = '⛽ Prezzo carburante (€/L):';
    }

    const defaultPrice = getFuelDefault(fuelType);
    if (defaultPrice !== undefined) {
        fuelPriceInput.value = defaultPrice;
    }

    // Imposta step più fine per elettrico/metano
    fuelPriceInput.step = baseFuel === 'elettrico' ? '0.01' : '0.01';
    fuelPriceInput.min = '0';
    fuelPriceInput.dataset.unit = unit;
}

function normalizeOptionLabel(text) {
        if (!text) return '';
        return text.split(' - ')[0].trim();
}

function buildCarPlaceholderSvg(title, subtitle) {
        const safeTitle = title || 'Auto';
        const safeSubtitle = subtitle || 'Seleziona modello';
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.8"/>
        </linearGradient>
    </defs>
    <rect width="800" height="450" rx="28" fill="url(#bg)"/>
    <rect x="32" y="32" width="736" height="386" rx="22" fill="none" stroke="rgba(255,255,255,0.08)"/>
    <path d="M140 300c40-70 130-110 260-110s220 40 260 110" fill="none" stroke="url(#accent)" stroke-width="10" stroke-linecap="round"/>
    <circle cx="260" cy="310" r="36" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>
    <circle cx="540" cy="310" r="36" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>
    <text x="400" y="170" text-anchor="middle" font-size="34" fill="#e2e8f0" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text>
    <text x="400" y="210" text-anchor="middle" font-size="20" fill="#94a3b8" font-family="Arial, sans-serif">${safeSubtitle}</text>
    <text x="400" y="250" text-anchor="middle" font-size="14" fill="#64748b" font-family="Arial, sans-serif">Texture demo: sostituisci con una tua immagine</text>
</svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

    function getCarImageSrc(modelId, title, subtitle) {
        if (modelId && MODEL_IMAGE_MAP[modelId]) {
            return MODEL_IMAGE_MAP[modelId];
        }
        const category = resolveModelCategory(modelId, `${title || ''} ${subtitle || ''}`);
        if (category && SILHOUETTE_MAP[category]) {
            return SILHOUETTE_MAP[category];
        }
        return buildCarPlaceholderSvg(title, subtitle);
    }

    function resolveModelCategory(modelId = '', labelText = '') {
        const raw = `${modelId} ${labelText}`.toLowerCase();
        if (!raw.trim()) return 'sedan';

        const directMap = {
            'city-car': 'city',
            sedan: 'sedan',
            suv: 'suv',
            estate: 'wagon',
            hybrid: 'sedan',
            electric: 'sedan'
        };
        if (directMap[modelId]) return directMap[modelId];

        const keywordSets = [
            { key: 'pickup', words: ['pickup', 'pick-up', 'ranger', 'hilux', 'navara', 'amarok'] },
            { key: 'van', words: ['van', 'touran', 'caddy', 'proace', 'zafira', 'traveller', 'berlingo', 'partner', 'v-class', 'galaxy', 's-max', 'alhambra', 'carnival', 'doblo', 'scudo', 'qubo', 'fiorino'] },
            { key: 'wagon', words: ['wagon', 'estate', 'touring', 'variant', 'station', 'sw', 'allroad', 'v60', 'v90'] },
            { key: 'coupe', words: ['coupe', 'coup', 'spider', 'cabrio', 'roadster'] },
            { key: 'sport', words: ['sport', 'gt', 'gti', 'rs', 'type-r', 'amg', 'm3', 'm4', 'm5', '911', 'cayman', 'supra', 'wrx'] },
            { key: 'suv', words: ['suv', 'crossover', 'cross', 'x1', 'x3', 'x5', 'x6', 'x7', 'q3', 'q5', 'q7', 'q8', 'gla', 'glb', 'glc', 'gle', 'gls', 't-roc', 't-cross', 'tiguan', 'taigo', 'tucson', 'sportage', 'qashqai', 'x-trail', 'rav4', 'c-hr', 'yaris cross', 'captur', 'kadjar', 'duster', 'karoq', 'kamiq', 'kodiaq', 'kuga', 'ecosport', 'puma', 'kona', 'santa fe', 'f-pace', 'e-pace', 'xc', 'stelvio', 'tonale', 'compass', 'renegade', 'avenger', 'wrangler', 'cherokee', 'defender', 'range rover', 'discovery', 'evoque', 'cayenne', 'macan'] },
            { key: 'city', words: ['city', 'panda', '500', 'aygo', 'up', 'picanto', 'i10', 'micra', 'corsa', 'clio', 'polo', 'swift', 'yaris', 'fiesta', 'mini', 'smart', 'sandero', 'ypsilon', 'fabia', 'ibiza', 'twingo', 'i20'] },
            { key: 'hatchback', words: ['hatch', 'golf', 'focus', 'megane', '308', 'i30', 'ceed', 'a3', 'serie 1', 'classe a', 'civic', 'corolla', 'astra', 'leon'] }
        ];

        for (const group of keywordSets) {
            if (group.words.some(word => raw.includes(word))) {
                return group.key;
            }
        }

        return 'sedan';
    }

    function populateMyCarBrandOptions() {
        if (!myCarBrandSelect) return;
        if (!brandOptionsSnapshot.length) snapshotBrandOptions();
        const previousValue = myCarBrandSelect.value;
        const fragment = document.createDocumentFragment();

        brandOptionsSnapshot.forEach(data => {
            const opt = document.createElement('option');
            opt.value = data.value;
            opt.textContent = data.text;
            if (data.disabled) opt.disabled = true;
            fragment.appendChild(opt);
        });

        myCarBrandSelect.innerHTML = '';
        myCarBrandSelect.appendChild(fragment);
        if (Array.from(myCarBrandSelect.options).some(o => o.value === previousValue)) {
            myCarBrandSelect.value = previousValue;
        }
    }

    async function populateMyCarModelOptions(brandKey = '') {
        if (!myCarModelSelect) return;
        const previousValue = myCarModelSelect.value;
        await ensureBrandModelsLoaded(brandKey);
        if (!carOptionsSnapshot.length) snapshotCarOptionsStructure();

        const showAll = !brandKey;
        const fragment = document.createDocumentFragment();

        carOptionsSnapshot.forEach(node => {
            if (node.tagName === 'OPTION') {
                const cloned = node.cloneNode(true);
                const optBrand = (cloned.dataset.brand || 'other').toLowerCase();
                const matchesBrand = showAll || optBrand === 'all' || optBrand === brandKey;
                if (matchesBrand) fragment.appendChild(cloned);
                return;
            }
            if (node.tagName === 'OPTGROUP') {
                const clonedGroup = node.cloneNode(true);
                const filtered = Array.from(clonedGroup.querySelectorAll('option')).filter(opt => {
                    const optBrand = (opt.dataset.brand || 'other').toLowerCase();
                    const isGeneric = optBrand === 'all';
                    return showAll || isGeneric || optBrand === brandKey;
                });
                if (!filtered.length) return;
                const newGroup = document.createElement('optgroup');
                newGroup.label = clonedGroup.label;
                if (clonedGroup.id) newGroup.id = clonedGroup.id;
                filtered.forEach(opt => newGroup.appendChild(opt.cloneNode(true)));
                fragment.appendChild(newGroup);
            }
        });

        if (!fragment.children.length) {
            const emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.disabled = true;
            emptyOpt.textContent = 'Nessun modello trovato';
            fragment.appendChild(emptyOpt);
        }

        myCarModelSelect.innerHTML = '';
        myCarModelSelect.appendChild(fragment);
        if (Array.from(myCarModelSelect.options).some(o => o.value === previousValue)) {
            myCarModelSelect.value = previousValue;
        } else {
            myCarModelSelect.value = '';
        }
    }

    function getPreferredCarSelection() {
        if (myCarBrandSelect && myCarModelSelect && (myCarBrandSelect.value || myCarModelSelect.value)) {
            return { brandSelect: myCarBrandSelect, modelSelect: myCarModelSelect };
        }
        return { brandSelect: carBrandSelect, modelSelect: carTypeSelect };
    }

function updateMyCarPreview() {
        if (!myCarImage || !myCarTitle || !myCarMeta) return;
    const { brandSelect, modelSelect } = getPreferredCarSelection();
    const hasBrand = !!brandSelect?.value;
    const hasModel = !!modelSelect?.value;
    const brandLabel = normalizeOptionLabel(brandSelect?.options[brandSelect.selectedIndex]?.textContent || '');
    const modelLabelRaw = modelSelect?.options[modelSelect.selectedIndex]?.textContent || '';
        const modelLabel = normalizeOptionLabel(modelLabelRaw);

        if (!hasBrand || !hasModel) {
            const savedPhoto = getSavedMyCarPhoto('');
                myCarTitle.textContent = 'Nessun modello selezionato';
                myCarMeta.textContent = 'Seleziona marca e modello nel calcolatore.';
                if (myCarHint) myCarHint.textContent = '';
                if (myCarUploadStatus) myCarUploadStatus.textContent = '';
            if (myCarUploadBtn) myCarUploadBtn.style.display = savedPhoto ? 'none' : 'block';
            if (myCarRemoveBtn) myCarRemoveBtn.style.display = savedPhoto ? 'inline-flex' : 'none';
            myCarImage.src = savedPhoto || buildCarPlaceholderSvg('La mia auto', 'Seleziona un modello');
            updateMyCarStats('');
                return;
        }

        myCarTitle.textContent = modelLabel || modelLabelRaw || 'Modello selezionato';
        myCarMeta.textContent = brandLabel || 'Marca selezionata';
        const savedPhoto = getSavedMyCarPhoto(modelSelect.value);
        if (!savedPhoto) {
            const defaultPhoto = getSavedMyCarPhoto('');
            if (defaultPhoto) {
                persistDefaultPhotoForModel(modelSelect.value, defaultPhoto);
            }
        }
        if (myCarHint) {
            const authNote = authToken ? 'Verrà salvata sul tuo account.' : 'Accedi per salvarla sul tuo account.';
            myCarHint.textContent = savedPhoto
                ? `Foto personale attiva. Puoi sostituirla caricandone un'altra. ${authNote}`
                : `Sagome automatiche attive. Puoi allegare una foto personale. ${authNote}`;
        }
        if (myCarUploadBtn) myCarUploadBtn.style.display = savedPhoto ? 'none' : 'block';
        if (myCarRemoveBtn) myCarRemoveBtn.style.display = savedPhoto ? 'inline-flex' : 'none';
        if (myCarUploadStatus) myCarUploadStatus.textContent = '';
        myCarImage.src = savedPhoto || getCarImageSrc(modelSelect.value, modelLabel || modelLabelRaw, brandLabel || '');
        updateMyCarStats(modelSelect.value);
}

    function updateMyCarStats(modelId) {
        if (!myCarKm || !myCarTrips || !myCarTotalCost || !myCarAvgCost) return;
        if (!modelId) {
            myCarKm.textContent = '-';
            myCarTrips.textContent = '-';
            myCarTotalCost.textContent = '-';
            myCarAvgCost.textContent = '-';
            return;
        }

        const tripsForCar = completedTrips.filter(trip => trip.carType === modelId);
        const totalTrips = tripsForCar.length;
        const totalKm = tripsForCar.reduce((sum, trip) => sum + (parseFloat(trip.distance) || 0), 0);
        const totalCost = tripsForCar.reduce((sum, trip) => sum + (parseFloat(trip.totalCost) || 0), 0);
        const avgCost = totalKm > 0 ? totalCost / totalKm : 0;

        myCarKm.textContent = totalKm ? `${totalKm.toFixed(0)} km` : '0 km';
        myCarTrips.textContent = totalTrips.toString();
        myCarTotalCost.textContent = `€${totalCost.toFixed(2)}`;
        myCarAvgCost.textContent = totalKm > 0 ? `€${avgCost.toFixed(2)}` : '€0.00';
    }

// Aggiunge data-brand agli option dei modelli, in base al prefisso del value
function tagModelOptionsByBrand() {
    const options = Array.from(carTypeSelect.querySelectorAll('option'));
    options.forEach(opt => {
        if (!opt.value) return;
        if (opt.dataset.brand && opt.dataset.brand !== '') return; // già impostato (dinamico)
        const val = opt.value.toLowerCase();
        const isGenericCategory = ['city-car', 'sedan', 'suv', 'estate', 'hybrid', 'electric'].includes(val);
        if (isGenericCategory) {
            opt.dataset.brand = 'all';
            return;
        }

        let detected = '';
        Object.entries(brandMatchers).some(([brand, prefixes]) => {
            const match = prefixes.some(pref => val.startsWith(`${pref}-`));
            if (match) {
                detected = brand;
            }
            return match;
        });
        opt.dataset.brand = detected || 'other';
    });
}

function getSavedMyCarPhoto(modelId) {
    if (authToken && myCarPhotos) {
        return myCarPhotos[modelId] || myCarPhotos.default || '';
    }
    if (myCarPhotos && myCarPhotos[modelId]) return myCarPhotos[modelId];
    if (myCarPhotos && myCarPhotos.default) return myCarPhotos.default;
    const key = buildMyCarPhotoKey(modelId);
    return localStorage.getItem(key) || '';
}

function buildMyCarPhotoKey(modelId) {
    const safeId = modelId || 'default';
    return `drivecalc_mycar_photo_${safeId}`;
}

function openMyCarConsent() {
    if (myCarConsentOverlay) myCarConsentOverlay.style.display = 'flex';
}

function closeMyCarConsent() {
    if (myCarConsentOverlay) myCarConsentOverlay.style.display = 'none';
}

async function handleMyCarPhotoSelected(file) {
    if (!file) return;
    if (myCarUploadStatus) myCarUploadStatus.textContent = 'Elaborazione foto...';

    const processed = await processMyCarPhotoFile(file);
    if (!processed) {
        if (myCarUploadStatus) {
            myCarUploadStatus.textContent = 'Formato non supportato. Usa JPG o PNG.';
        }
        return;
    }

    const { modelSelect } = getPreferredCarSelection();
    const modelId = modelSelect?.value || '';
    const result = processed;

    if (authToken) {
        apiRequest('/mycar-photo', 'POST', { modelId, dataUrl: result })
            .then(() => {
                myCarPhotos[modelId || 'default'] = result;
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto salvata sul tuo account.';
                updateMyCarPreview();
            })
            .catch(() => {
                myCarPhotos[modelId || 'default'] = result;
                localStorage.setItem(MYCAR_PHOTOS_KEY, JSON.stringify(myCarPhotos));
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto salvata in locale (offline).';
                updateMyCarPreview();
            });
    } else {
        myCarPhotos[modelId || 'default'] = result;
        localStorage.setItem(MYCAR_PHOTOS_KEY, JSON.stringify(myCarPhotos));
        if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto salvata in locale.';
        updateMyCarPreview();
    }
}

async function processMyCarPhotoFile(file) {
    const type = (file.type || '').toLowerCase();
    if (!type.startsWith('image/')) return null;

    const objectUrl = URL.createObjectURL(file);
    try {
        const bitmap = await loadImageBitmap(objectUrl);
        if (!bitmap) return null;

        const maxSize = 1280;
        const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        bitmap.close && bitmap.close();
        return dataUrl;
    } catch (e) {
        return null;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

async function loadImageBitmap(objectUrl) {
    if ('createImageBitmap' in window) {
        try {
            return await createImageBitmap(await fetch(objectUrl).then(r => r.blob()), { imageOrientation: 'from-image' });
        } catch (e) {
            // fallback below
        }
    }

    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = objectUrl;
    });
}

function removeMyCarPhoto() {
    const { modelSelect } = getPreferredCarSelection();
    const modelId = modelSelect?.value || '';

    delete myCarPhotos[modelId || 'default'];
    localStorage.setItem(MYCAR_PHOTOS_KEY, JSON.stringify(myCarPhotos));

    if (authToken) {
        apiRequest(`/mycar-photo/${encodeURIComponent(modelId || 'default')}`, 'DELETE')
            .then(() => {
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto rimossa dal tuo account.';
                updateMyCarPreview();
            })
            .catch(() => {
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto rimossa in locale.';
                updateMyCarPreview();
            });
    } else {
        if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto rimossa in locale.';
        updateMyCarPreview();
    }
}

function persistDefaultPhotoForModel(modelId, dataUrl) {
    if (!modelId || !dataUrl) return;
    if (myCarPhotos[modelId]) return;
    myCarPhotos[modelId] = dataUrl;
    localStorage.setItem(MYCAR_PHOTOS_KEY, JSON.stringify(myCarPhotos));

    if (authToken) {
        apiRequest('/mycar-photo', 'POST', { modelId, dataUrl })
            .then(() => {
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto predefinita applicata al modello.';
            })
            .catch(() => {
                if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto predefinita applicata in locale.';
            });
    } else {
        if (myCarUploadStatus) myCarUploadStatus.textContent = 'Foto predefinita applicata in locale.';
    }
}

// Aggiunge una lista di modelli al select, con deduplica
function appendModelsToSelect(models, { replaceGroup = false } = {}) {
    if (!carTypeSelect || !Array.isArray(models)) return;

    let group = carTypeSelect.querySelector(`#${DYNAMIC_MODELS_GROUP_ID}`);
    if (!group) {
        group = document.createElement('optgroup');
        group.id = DYNAMIC_MODELS_GROUP_ID;
        group.label = `Modelli estesi e ufficiali ${MODEL_YEAR_MIN}-${MODEL_YEAR_MAX}`;
        carTypeSelect.appendChild(group);
    }
    if (replaceGroup) group.innerHTML = '';

    const existingIds = new Set(Array.from(carTypeSelect.querySelectorAll('option')).map(o => o.value));

    models.forEach(model => {
        if (!model || !model.id || !model.label || !model.fuels) return;
        if (existingIds.has(model.id)) return;

        const enrichedFuels = enrichDualFuel(model.label, model.fuels);
        const cleanLabel = normalizeModelLabel(model.label);
        const yearLabel = Number(model.year) || extractYearFromLabel(model.label);
        const fullLabel = yearLabel ? `${cleanLabel} (${yearLabel})` : cleanLabel;
        carConsumption[model.id] = { label: fullLabel, fuels: enrichedFuels };

        const fuels = Object.keys(enrichedFuels);
        const firstFuel = fuels[0];
        const unit = getFuelUnit(firstFuel);
        const value = typeof enrichedFuels[firstFuel] === 'number' ? enrichedFuels[firstFuel] : null;
        const consumptionText = value !== null ? `${value} ${unit}/100 km` : 'consumo n/d';

        const opt = document.createElement('option');
        opt.value = model.id;
        opt.textContent = `${fullLabel} - ${consumptionText}`;
        const brand = (model.brand || '').toLowerCase();
        if (brand) opt.dataset.brand = brand;
        group.appendChild(opt);
        existingIds.add(model.id);
    });

    tagModelOptionsByBrand();
    snapshotCarOptionsStructure();
}

async function ensureBrandModelsLoaded(brandKey) {
    if (!brandKey) return;
    const file = brandDataFiles[brandKey];
    if (!file || loadedBrandData.has(brandKey)) return;
    try {
        const res = await fetch(`${file}?v=${BRAND_DATA_VERSION}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Impossibile caricare ${file}`);
        const models = await res.json();
        appendModelsToSelect(models);
        loadedBrandData.add(brandKey);
    } catch (err) {
        console.error('Errore caricamento modelli brand', brandKey, err);
    }
}

// Mostra solo i modelli della marca selezionata (se vuoto mostra tutto)
async function filterModelsByBrand(options = {}) {
    const brandKey = (carBrandSelect.value || '').replace(/^brand-/, '').trim().toLowerCase();
    const showAll = !brandKey;
    const searchTerm = (options.searchTerm ?? (carTypeSearchInput?.value || '')).trim().toLowerCase();
    const previousValue = carTypeSelect.value;

    await ensureBrandModelsLoaded(brandKey);

    if (!carOptionsSnapshot.length) snapshotCarOptionsStructure();
    if (!carTypeSelect) return;

    const fragment = document.createDocumentFragment();
    carOptionsSnapshot.forEach(node => {
        if (node.tagName === 'OPTION') {
            const cloned = node.cloneNode(true);
            const optBrand = (cloned.dataset.brand || 'other').toLowerCase();
            const matchesBrand = showAll || optBrand === 'all' || optBrand === brandKey;
            const matchesSearch = !searchTerm || cloned.textContent.toLowerCase().includes(searchTerm) || (cloned.value || '').toLowerCase().includes(searchTerm);
            if (matchesBrand && matchesSearch) fragment.appendChild(cloned);
            return;
        }
        if (node.tagName === 'OPTGROUP') {
            const clonedGroup = node.cloneNode(true);
            const filtered = Array.from(clonedGroup.querySelectorAll('option')).filter(opt => {
                const optBrand = (opt.dataset.brand || 'other').toLowerCase();
                const isGeneric = optBrand === 'all';
                const matchesBrand = showAll || isGeneric || optBrand === brandKey;
                const matchesSearch = !searchTerm || opt.textContent.toLowerCase().includes(searchTerm) || (opt.value || '').toLowerCase().includes(searchTerm);
                return matchesBrand && matchesSearch;
            });
            if (!filtered.length) return;
            const newGroup = document.createElement('optgroup');
            newGroup.label = clonedGroup.label;
            if (clonedGroup.id) newGroup.id = clonedGroup.id;
            filtered.forEach(opt => newGroup.appendChild(opt.cloneNode(true)));
            fragment.appendChild(newGroup);
        }
    });

    if (!fragment.children.length) {
        const emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.disabled = true;
        emptyOpt.textContent = 'Nessun modello trovato';
        fragment.appendChild(emptyOpt);
    }

    carTypeSelect.innerHTML = '';
    carTypeSelect.appendChild(fragment);
    if (Array.from(carTypeSelect.options).some(o => o.value === previousValue)) {
        carTypeSelect.value = previousValue;
    } else {
        carTypeSelect.value = '';
    }
    syncFuelWithCarType();
}

// Aggiorna automaticamente il carburante coerente con il tipo di auto scelto
function syncFuelWithCarType() {
    const profile = carConsumption[carTypeSelect.value];
    const supportedFuels = profile ? Object.keys(profile.fuels) : [];

    if (supportedFuels.length === 1) {
        fuelTypeSelect.value = supportedFuels[0];
    } else if (!supportedFuels.includes(fuelTypeSelect.value)) {
        fuelTypeSelect.value = supportedFuels[0] || 'benzina';
    }

    updateFuelPriceUI();
}

// Ottiene le info complete della rotta: prima database locale, poi ORS se mancante
async function getRouteInfo(fromLoc, toLoc) {
    const fromLabel = fromLoc?.label || '';
    const toLabel = toLoc?.label || '';
    const useLocalDb = fromLoc?.kind === 'city' && toLoc?.kind === 'city';
    const key1 = useLocalDb ? `${fromLabel}-${toLabel}` : null;
    const key2 = useLocalDb ? `${toLabel}-${fromLabel}` : null;

    if (USE_GOOGLE_MAPS && hasGoogleKey() && useLocalDb) {
        let googleRoute = null;
        try {
            googleRoute = await fetchRouteFromGoogle(fromLabel, toLabel);
        } catch (e) {
            googleRoute = null;
        }
        if (googleRoute) return googleRoute;
    }

    if (useLocalDb && key1 && routeInfo[key1]) return routeInfo[key1];
    if (useLocalDb && key2 && routeInfo[key2]) return routeInfo[key2];

    if (useLocalDb && hasHereKey()) {
        // Tentativo con HERE (include pedaggi se key presente)
        let hereRoute = null;
        try {
            hereRoute = await fetchRouteFromHereAPI(fromLabel, toLabel);
        } catch (e) {
            hereRoute = null;
        }
        if (hereRoute) {
            routeInfo[key1] = hereRoute; // cache in runtime
            return hereRoute;
        }
    }

    // Routing con coordinate
    const start = { lat: fromLoc.lat, lng: fromLoc.lng };
    const end = { lat: toLoc.lat, lng: toLoc.lng };

    let route = null;
    try {
        route = await fetchRouteFromORSCoords(start, end);
    } catch (e) {
        route = null;
    }
    if (route) {
        if (useLocalDb && key1) routeInfo[key1] = route;
        return route;
    }

    let osrmRoute = null;
    try {
        osrmRoute = await fetchRouteFromOSRMCoords(start, end);
    } catch (e) {
        osrmRoute = null;
    }
    if (osrmRoute) {
        if (useLocalDb && key1) routeInfo[key1] = osrmRoute;
        return osrmRoute;
    }

    // Ultima risorsa: distanza stimata con linea retta
    try {
        const airKm = haversineKm(start.lat, start.lng, end.lat, end.lng);
        const totalDistanceKm = airKm * 1.25; // stima strada
        const estimatedHighway = totalDistanceKm * ESTIMATED_HIGHWAY_FRACTION;
        const estimatedExtra = Math.max(totalDistanceKm - estimatedHighway, 0);
        const fallbackRoute = {
            totalDistance: totalDistanceKm,
            tollCost: 0,
            segments: { highway: estimatedHighway, expressway: 0, extra: estimatedExtra, urban: 0 },
            orsGeometry: [[start.lng, start.lat], [end.lng, end.lat]],
            orsStart: { lat: start.lat, lng: start.lng },
            orsEnd: { lat: end.lat, lng: end.lng },
            isApproximate: true
        };
        if (useLocalDb && key1) routeInfo[key1] = fallbackRoute;
        return fallbackRoute;
    } catch (e) {
        // no-op
    }
    return null;
}

// Calcola il numero di caselli autostradali
function calculateTollBooths(highwayDistance) {
    if (highwayDistance === 0) return 0;
    return Math.ceil(highwayDistance / HIGHWAY_KM_PER_TOLL_BOOTH);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function estimateHighwayFraction(totalDistance = 0, directDistance = 0) {
    let fraction = ESTIMATED_HIGHWAY_FRACTION;
    if (totalDistance < 25) fraction = 0.06;
    else if (totalDistance < 60) fraction = 0.2;
    else if (totalDistance < 120) fraction = 0.35;
    else if (totalDistance < 220) fraction = 0.5;
    else if (totalDistance < 400) fraction = 0.62;
    else fraction = 0.74;

    if (directDistance > 0) {
        const ratio = totalDistance / directDistance;
        if (ratio > 1.35) fraction -= 0.12;
        else if (ratio < 1.15) fraction += 0.06;
    }

    return clamp(fraction, 0.05, 0.85);
}

function buildSegmentDistribution(totalDistance = 0, highwayDistance = 0) {
    const safeTotal = Math.max(0, Number(totalDistance) || 0);
    const safeHighway = clamp(Number(highwayDistance) || 0, 0, safeTotal);
    const remaining = Math.max(0, safeTotal - safeHighway);
    if (!remaining) {
        return { highway: safeHighway, expressway: 0, extra: 0, urban: 0 };
    }

    const urbanCap = safeTotal < 50 ? 8 : 14;
    const urban = Math.min(urbanCap, remaining * 0.2);
    const afterUrban = Math.max(0, remaining - urban);
    const expresswayRatio = safeTotal >= 120 ? 0.35 : 0.22;
    const expressway = afterUrban * expresswayRatio;
    const extra = Math.max(0, afterUrban - expressway);
    return { highway: safeHighway, expressway, extra, urban };
}

// Restituisce distanze per tipo di strada; se non specificate, stima autostrada/non autostrada
function getSegmentDistances(route, context = {}) {
    const totalDistance = Math.max(0, Number(route?.totalDistance) || 0);
    const directDistance = Math.max(0, Number(context?.directDistance) || 0);
    const rawTollCost = Math.max(0, Number(route?.tollCost) || 0);

    if (route.segments) {
        const highway = Math.max(0, Number(route.segments.highway) || 0);
        const expressway = Math.max(0, Number(route.segments.expressway) || 0);
        const extra = Math.max(0, Number(route.segments.extra) || 0);
        const urban = Math.max(0, Number(route.segments.urban) || 0);
        const totalFromSegments = highway + expressway + extra + urban;
        const residual = Math.max(totalDistance - totalFromSegments, 0);
        const normalizedExtra = extra + residual;
        const onlyExtra = highway === 0 && expressway === 0 && urban === 0 && normalizedExtra > 0;
        if (onlyExtra) {
            if (rawTollCost > 0) {
                const inferredHighwayFromToll = clamp(rawTollCost / TOLL_RATE_EUR_PER_KM, 0, totalDistance * 0.95);
                return buildSegmentDistribution(totalDistance, inferredHighwayFromToll);
            }
            const estimatedHighway = totalDistance * estimateHighwayFraction(totalDistance, directDistance);
            return buildSegmentDistribution(totalDistance, estimatedHighway);
        }

        return {
            highway,
            expressway,
            extra: normalizedExtra,
            urban
        };
    }

    const explicitHighway = Math.max(0, Number(route.highwayDistance) || 0);
    if (explicitHighway > 0) {
        return buildSegmentDistribution(totalDistance, explicitHighway);
    }

    if (rawTollCost > 0) {
        const inferredHighwayFromToll = clamp(rawTollCost / TOLL_RATE_EUR_PER_KM, 0, totalDistance * 0.95);
        return buildSegmentDistribution(totalDistance, inferredHighwayFromToll);
    }

    const estimatedHighway = totalDistance * estimateHighwayFraction(totalDistance, directDistance);
    return buildSegmentDistribution(totalDistance, estimatedHighway);
}

// Calcola il costo del viaggio
async function calculateTrip() {
    if (isCalculatingTrip) return;
    setCalculateBusy(true);
    setTripActionFeedback('');
    const mapStatus = document.getElementById('mapStatus');
    if (mapStatus) mapStatus.textContent = 'Calcolo percorso in corso...';

    try {
        // Validazione
        if ((!departureSelect.value && !(departureAddressInput?.value || '').trim()) ||
            (!arrivalSelect.value && !(arrivalAddressInput?.value || '').trim()) ||
            !carBrandSelect.value || !carTypeSelect.value || !fuelTypeSelect.value) {
            showError('⚠️ Per favore, seleziona partenza, arrivo, marca, modello e carburante!');
            return;
        }

        if (completedTripCheckbox) completedTripCheckbox.checked = false;

        let fromLocation = null;
        let toLocation = null;
        try {
            fromLocation = await resolveLocation('la partenza', departureAddressInput, departureSelect);
            toLocation = await resolveLocation('l’arrivo', arrivalAddressInput, arrivalSelect);
        } catch (e) {
            showError(e.message || '❌ Errore nel recupero degli indirizzi.');
            return;
        }

        const samePoint = haversineKm(fromLocation.lat, fromLocation.lng, toLocation.lat, toLocation.lng) < 0.2;
        if (samePoint) {
            showError('❌ Il punto di partenza e arrivo non possono essere uguali!');
            return;
        }

        const departure = fromLocation.label;
        const arrival = toLocation.label;
        const carBrand = carBrandSelect.value;
        const carType = carTypeSelect.value;
        const fuelType = fuelTypeSelect.value;
        const baseFuelType = resolveBaseFuel(fuelType);
        const fuelPrice = parseFloat(fuelPriceInput.value);
        if (!Number.isFinite(fuelPrice) || fuelPrice <= 0) {
            showError('❌ Inserisci un prezzo carburante valido maggiore di zero.');
            return;
        }
        const fuelLabel = fuelTypeSelect.options[fuelTypeSelect.selectedIndex]?.textContent || fuelType;

        const carProfile = carConsumption[carType];
        const carBrandLabel = carBrandSelect.options[carBrandSelect.selectedIndex]?.textContent || carBrand;
        const carTypeLabel = carProfile?.label || carTypeSelect.options[carTypeSelect.selectedIndex]?.textContent || carType;
        const consumptionPer100 = carProfile && (carProfile.fuels[fuelType] ?? carProfile.fuels[baseFuelType]);
        if (!consumptionPer100) {
            showError('❌ Questa combinazione auto/alimentazione non è supportata. Scegli un altro carburante o tipo di auto.');
            return;
        }
        
        // Ottiene info rotta
        let route = null;
        try {
            route = await getRouteInfo(fromLocation, toLocation);
        } catch (e) {
            route = null;
        }
        if (!route) {
            showError('❌ Errore nel calcolo della rotta. Riprova oppure scegli una tratta diversa.');
            return;
        }

        try {
            await renderRouteOnMap(route, departure, arrival, fromLocation, toLocation);
        } catch (e) {
            // Se il rendering mappa fallisce, non bloccare il calcolo costi.
        }

        const directKm = haversineKm(fromLocation.lat, fromLocation.lng, toLocation.lat, toLocation.lng);
        // Normalizza distanze e pedaggi
        const totalDistance = Math.max(route.totalDistance, 0);
        const segments = getSegmentDistances(route, { directDistance: directKm });
        const highwayDistance = Math.min(segments.highway, totalDistance);
        const expresswayDistance = Math.min(segments.expressway, totalDistance - highwayDistance);
        const extraDistance = Math.min(segments.extra, totalDistance - highwayDistance - expresswayDistance);
        const urbanDistance = Math.min(segments.urban, totalDistance - highwayDistance - expresswayDistance - extraDistance);
        const roadDistance = totalDistance - highwayDistance;
        // Se è presente un pedaggio ufficiale nella rotta, usa quello; altrimenti stima al km
        const hasOfficialToll = route.tollCost !== undefined && route.tollCost !== null && route.tollCost > 0;
        const isShortTrip = totalDistance < 30;
        const isLikelyUrban = directKm < 18 && totalDistance < 45;
        const tollEligible = !hasOfficialToll && !isShortTrip && !isLikelyUrban && highwayDistance >= 10;
        const tollCost = hasOfficialToll
            ? route.tollCost
            : (tollEligible ? highwayDistance * TOLL_RATE_EUR_PER_KM : 0);
        
        // Calcola numero caselli (solo quando stimiamo i pedaggi)
        const tollBooths = tollEligible ? calculateTollBooths(highwayDistance) : 0;
        const tollBoothsCost = hasOfficialToll ? 0 : (tollBooths * TOLL_BOOTH_COST);

        // Consumo totale semplice: (distanza * consumo_per_100km) / 100
        const fuelUnit = getFuelUnit(fuelType);
        const fuelTotal = (totalDistance * consumptionPer100) / 100;
        const fuelCost = fuelTotal * fuelPrice;

        // Costo totale: carburante + pedaggi + caselli
        const totalCost = fuelCost + tollCost + tollBoothsCost;
        const costPerKm = (totalCost / totalDistance).toFixed(2);

        // Tempo stimato per segmenti
        const timeHours = 
            (highwayDistance / SPEEDS.highway) +
            (expresswayDistance / SPEEDS.expressway) +
            (extraDistance / SPEEDS.extra) +
            (urbanDistance / SPEEDS.urban);
        const estimatedTimeMinutes = Math.round(timeHours * 60);

        const nowTs = Date.now();
        lastCalculatedTrip = {
            departure,
            arrival,
            departureIsAddress: fromLocation.kind === 'address',
            arrivalIsAddress: toLocation.kind === 'address',
            departureAddress: fromLocation.kind === 'address' ? fromLocation.label : '',
            arrivalAddress: toLocation.kind === 'address' ? toLocation.label : '',
            departureCity: fromLocation.kind === 'city' ? fromLocation.label : '',
            arrivalCity: toLocation.kind === 'city' ? toLocation.label : '',
            departureLat: fromLocation.lat,
            departureLng: fromLocation.lng,
            arrivalLat: toLocation.lat,
            arrivalLng: toLocation.lng,
            carBrand,
            carType,
            fuelType,
            fuelLabel,
            carLabel: `${carBrandLabel} • ${carTypeLabel}`,
            distance: totalDistance.toFixed(0),
            totalCost: totalCost.toFixed(2),
            tollCost: (parseFloat(tollCost) + parseFloat(tollBoothsCost)).toFixed(2),
            fuelCost: fuelCost.toFixed(2),
            timestamp: nowTs,
            tripId: nowTs,
            completed: completedTripCheckbox?.checked || false,
            type: 'solo'
        };

        // Aggiorna i risultati
        displayResults({
            totalDistance: totalDistance.toFixed(0),
            highwayDistance: highwayDistance.toFixed(1),
            roadDistance: roadDistance.toFixed(1),
            expresswayDistance: expresswayDistance.toFixed(1),
            extraDistance: extraDistance.toFixed(1),
            urbanDistance: urbanDistance.toFixed(1),
            fuelTotal: fuelTotal.toFixed(2),
            fuelUnit: fuelUnit,
            fuelCost: fuelCost.toFixed(2),
            tollCost: tollCost.toFixed(2),
            tollBooths: tollBooths,
            tollBoothsCost: tollBoothsCost.toFixed(2),
            hasOfficialToll: hasOfficialToll,
            isTollEligible: tollEligible,
            totalCost: totalCost.toFixed(2),
            costPerKm: costPerKm,
            departure: departure,
            arrival: arrival,
            carType: carType,
            carTypeLabel: carTypeLabel,
            carBrandLabel: carBrandLabel,
            fuelType: fuelType,
            consumptionPer100: consumptionPer100,
            estimatedTime: estimatedTimeMinutes
        });
        
        hideError();
        setTripActionFeedback('Calcolo completato. Puoi salvare o copiare il riepilogo.');
    } finally {
        if (mapStatus && mapStatus.textContent === 'Calcolo percorso in corso...') {
            mapStatus.textContent = '';
        }
        setCalculateBusy(false);
    }
}

// Mostra i risultati
function displayResults(data) {
    // Aggiorna valori
    document.getElementById('distanceResult').textContent = data.totalDistance;
    document.getElementById('fuelResult').textContent = data.fuelTotal;
    document.getElementById('fuelUnit').textContent = data.fuelUnit;
    document.getElementById('fuelCostResult').textContent = data.fuelCost;
    document.getElementById('tollCostResult').textContent = (parseFloat(data.tollCost) + parseFloat(data.tollBoothsCost)).toFixed(2);
    document.getElementById('totalCostResult').textContent = data.totalCost;
    document.getElementById('costPerKmResult').textContent = data.costPerKm;
    
    const fuelLabel = fuelTypeSelect.querySelector(`option[value="${data.fuelType}"]`)?.textContent || data.fuelType;
    const roundedConsumption = Number.isFinite(data.consumptionPer100)
        ? (data.consumptionPer100 % 1 === 0 ? data.consumptionPer100.toFixed(0) : data.consumptionPer100.toFixed(1))
        : '-';
    document.getElementById('carDetail').textContent = `${data.carBrandLabel} • ${data.carTypeLabel} • ${fuelLabel} (${roundedConsumption} ${data.fuelUnit}/100 km)`;

    // Dettagli
    document.getElementById('routeDetail').textContent = 
        `${data.departure} → ${data.arrival} (${data.totalDistance} km: ${data.highwayDistance} km autostrada, ${data.expresswayDistance} km superstrada, ${data.extraDistance} km extraurbane, ${data.urbanDistance} km urbano)`;
    
    const totalToll = (parseFloat(data.tollCost) + parseFloat(data.tollBoothsCost)).toFixed(2);
    document.getElementById('tollDetail').textContent = data.hasOfficialToll
        ? `Pedaggi ufficiali: €${data.tollCost} (caselli inclusi)`
        : (data.isTollEligible
            ? `Pedaggi stimati: €${data.tollCost} + Caselli (${data.tollBooths} caselli × €${TOLL_BOOTH_COST} = €${data.tollBoothsCost}) = €${totalToll} totali`
            : 'Pedaggi: non previsti (tratta urbana/locale)');
    
    document.getElementById('timeDetail').textContent = 
        `${Math.floor(data.estimatedTime / 60)}h ${data.estimatedTime % 60}min (velocità usate: autostrada ${SPEEDS.highway} km/h, superstrada ${SPEEDS.expressway} km/h, extraurbane ${SPEEDS.extra} km/h, urbano ${SPEEDS.urban} km/h)`;
    
    // Mostra risultati
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostra errore
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    resultsSection.style.display = 'none';
    setTripActionFeedback('');
}

// Nascondi errore
function hideError() {
    errorDiv.style.display = 'none';
}

// Gestione preferiti (storage locale + sync API)
const FAVORITES_KEY = 'drivecalc_favorites_v1';
const COMPANIONS_KEY = 'drivecalc_companions_v1';
const COMPLETED_KEY = 'drivecalc_completed_v1';
const MYCAR_PHOTOS_KEY = 'drivecalc_mycar_photos_v1';
const LOCAL_API_BASE = 'http://localhost:3001/api';
const CLOUD_API_BASES = ['https://drivercalc.onrender.com/api', 'https://drivecalc.onrender.com/api'];

function normalizeApiBase(value = '') {
    return String(value || '').trim().replace(/\/+$/, '');
}

function isLocalPageContext() {
    if (typeof window === 'undefined') return false;
    const host = String(window.location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
}

function buildApiBaseCandidates() {
    if (typeof window === 'undefined') {
        return [...CLOUD_API_BASES];
    }

    const configuredBase = normalizeApiBase(window.DRIVECALC_API_BASE);
    const isLocalPage = isLocalPageContext();
    const sameOriginApi = normalizeApiBase(`${window.location.origin}/api`);
    const candidates = [];
    const pushCandidate = (value) => {
        const normalized = normalizeApiBase(value);
        if (!normalized) return;
        if (candidates.includes(normalized)) return;
        candidates.push(normalized);
    };

    pushCandidate(configuredBase);

    if (isLocalPage) {
        pushCandidate(LOCAL_API_BASE);
    } else {
        pushCandidate(sameOriginApi);
    }

    CLOUD_API_BASES.forEach(pushCandidate);
    return candidates.length ? candidates : [LOCAL_API_BASE];
}

const API_BASES = buildApiBaseCandidates();
let apiBaseRuntime = API_BASES[0];

let favorites = [];
let lastCalculatedTrip = null;
let companionTrips = [];
let currentCompanions = [];
let completedTrips = [];
let myCarPhotos = {};
let authToken = null;
let currentUser = null;
let accountProfile = null;
let accountStats = null;
let authFeedbackTimer = null;
let isCalculatingTrip = false;
let tripActionFeedbackTimer = null;
let friendSearchTimer = null;
let friendSearchAbortController = null;
let friendSearchRequestId = 0;
let friends = [];
let incomingFriendRequests = [];
let outgoingFriendRequests = [];
let selectedFriendId = '';
let imagePreviewOverlay = null;
let imagePreviewImage = null;
let shareSettings = {
    shareFavorites: true,
    shareMyCar: true,
    shareCompanionTrips: true
};

function isAuthenticated() {
    return !!authToken;
}

function buildAuthHeaders() {
    if (authToken && authToken !== 'cookie-session') {
        return { Authorization: `Bearer ${authToken}` };
    }
    return {};
}

function getApiBase() {
    return apiBaseRuntime || API_BASES[0] || LOCAL_API_BASE;
}

async function apiRequest(path, method = 'GET', body) {
    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeaders()
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined
    };

    const currentBase = getApiBase();
    const endpoints = [currentBase, ...API_BASES.filter((base) => base !== currentBase)];

    let lastError = null;
    for (let i = 0; i < endpoints.length; i += 1) {
        const base = endpoints[i];
        let res;
        try {
            res = await fetch(`${base}${path}`, requestOptions);
        } catch (e) {
            lastError = new Error('Server API non raggiungibile');
            continue;
        }

        if (!res.ok) {
            const rawText = await res.text().catch(() => '');
            let err = {};
            try {
                err = rawText ? JSON.parse(rawText) : {};
            } catch (e) {
                err = {};
            }

            const shouldTryLocalFallback =
                i < endpoints.length - 1 &&
                (res.status >= 500 || (res.status === 404 && path.startsWith('/auth/')));
            if (shouldTryLocalFallback) {
                lastError = new Error(err.error || `Errore API (${res.status})`);
                continue;
            }

            if (res.status === 401) {
                throw new Error(err.error || 'Sessione scaduta, rifai login');
            }
            if (res.status === 404 && path.startsWith('/friends') && !err.error) {
                throw new Error('Funzione amici non disponibile sul server (deploy non aggiornato)');
            }
            if (res.status === 404 && path.startsWith('/share-settings') && !err.error) {
                throw new Error('Impostazioni condivisione non disponibili sul server');
            }
            if (res.status === 404 && path.startsWith('/auth/') && !err.error) {
                throw new Error('Funzione account non disponibile sul server (deploy non aggiornato)');
            }

            throw new Error(err.error || `Errore API (${res.status})`);
        }

        if (apiBaseRuntime !== base) {
            apiBaseRuntime = base;
        }
        return res.json().catch(() => ({}));
    }

    throw lastError || new Error('Server API non raggiungibile');
}

function setAuthFeedback(message = '', type = 'info') {
    if (!authFeedback) return;
    if (authFeedbackTimer) {
        clearTimeout(authFeedbackTimer);
        authFeedbackTimer = null;
    }
    if (!message) {
        authFeedback.style.display = 'none';
        authFeedback.textContent = '';
        authFeedback.dataset.type = '';
        return;
    }
    authFeedback.textContent = message;
    authFeedback.dataset.type = type;
    authFeedback.style.display = 'block';
    if (type !== 'error') {
        authFeedbackTimer = setTimeout(() => {
            if (!authFeedback) return;
            authFeedback.style.display = 'none';
            authFeedback.textContent = '';
            authFeedback.dataset.type = '';
        }, 4200);
    }
}

function formatAccountDate(value, includeTime = false) {
    const ts = Number(value);
    if (!Number.isFinite(ts) || ts <= 0) return '-';
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) return '-';
    const opts = includeTime
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', opts).format(date);
}

function escapeSvgText(value = '') {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildDefaultAccountAvatar(name = '') {
    const cleanName = String(name || '').trim();
    const initials = cleanName
        ? cleanName.split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('')
        : 'DC';
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="30" fill="#0b162d"/>
  <circle cx="80" cy="80" r="66" fill="url(#g)" opacity="0.95"/>
  <text x="80" y="96" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-size="54" font-weight="700" fill="#041127">${escapeSvgText(initials || 'DC')}</text>
</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getFallbackAccountStats() {
    const completedCount = completedTrips.length;
    const km = completedTrips.reduce((sum, trip) => {
        const value = Number.parseFloat(trip?.distance || 0);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
    return {
        favoritesCount: favorites.length,
        completedTripsCount: completedCount,
        friendsCount: friends.length,
        totalCompletedKm: Number(km.toFixed(2))
    };
}

function renderAccountProfile() {
    const profile = accountProfile || currentUser || {};
    const username = (profile.username || profile.email || 'Utente').trim();
    const email = (profile.email || currentUser?.email || '').trim();
    const avatarSrc = profile.avatarUrl || buildDefaultAccountAvatar(username);
    const stats = accountStats || getFallbackAccountStats();

    if (accountAvatarPreview) accountAvatarPreview.src = avatarSrc;
    if (accountDisplayName) accountDisplayName.textContent = username;
    if (accountDisplayEmail) accountDisplayEmail.textContent = email || '-';
    if (accountMemberSince) accountMemberSince.textContent = `Iscritto: ${formatAccountDate(profile.createdAt)}`;
    if (accountLastLogin) accountLastLogin.textContent = `Ultimo accesso: ${formatAccountDate(profile.lastLoginAt, true)}`;

    if (accountProfileUsername) accountProfileUsername.value = profile.username || '';
    if (accountProfileEmail) accountProfileEmail.value = email || '';
    if (accountProfileLocation) accountProfileLocation.value = profile.location || '';
    if (accountProfileBio) accountProfileBio.value = profile.bio || '';

    if (accountStatFavorites) accountStatFavorites.textContent = String(stats.favoritesCount || 0);
    if (accountStatCompleted) accountStatCompleted.textContent = String(stats.completedTripsCount || 0);
    if (accountStatFriends) accountStatFriends.textContent = String(stats.friendsCount || 0);
    if (accountStatKm) accountStatKm.textContent = Number(stats.totalCompletedKm || 0).toFixed(0);
}

function updateAuthUI(message = '') {
    if (authStatus) authStatus.textContent = message;
    if (accountStatus) accountStatus.textContent = message;
    if (logoutBtn) logoutBtn.style.display = authToken ? 'inline-block' : 'none';
    if (loginBtn) loginBtn.style.display = authToken ? 'none' : 'inline-block';
    if (registerBtn) registerBtn.style.display = authToken ? 'none' : 'inline-block';
    if (accountGuestPanel) accountGuestPanel.style.display = authToken ? 'none' : 'block';
    if (accountConnectedPanel) accountConnectedPanel.style.display = authToken ? 'block' : 'none';
    if (authToken) {
        renderAccountProfile();
    }
}

function setCalculateBusy(isBusy) {
    isCalculatingTrip = !!isBusy;
    if (!calculateBtn) return;
    if (isBusy) {
        if (!calculateBtn.dataset.originalLabel) {
            calculateBtn.dataset.originalLabel = calculateBtn.textContent || '📊 Calcola Costo Viaggio';
        }
        calculateBtn.disabled = true;
        calculateBtn.textContent = '⏳ Calcolo in corso...';
        calculateBtn.setAttribute('aria-busy', 'true');
    } else {
        calculateBtn.disabled = false;
        calculateBtn.textContent = calculateBtn.dataset.originalLabel || '📊 Calcola Costo Viaggio';
        calculateBtn.removeAttribute('aria-busy');
    }
}

function setTripActionFeedback(message = '') {
    if (!tripActionFeedback) return;
    if (tripActionFeedbackTimer) {
        clearTimeout(tripActionFeedbackTimer);
        tripActionFeedbackTimer = null;
    }
    tripActionFeedback.textContent = message;
    if (!message) return;
    tripActionFeedbackTimer = setTimeout(() => {
        if (!tripActionFeedback) return;
        tripActionFeedback.textContent = '';
    }, 4500);
}

function setFriendRequestBusy(isBusy) {
    if (!sendFriendRequestBtn) return;
    if (!sendFriendRequestBtn.dataset.originalLabel) {
        sendFriendRequestBtn.dataset.originalLabel = sendFriendRequestBtn.textContent || 'Invia richiesta';
    }
    sendFriendRequestBtn.disabled = !!isBusy;
    sendFriendRequestBtn.textContent = isBusy
        ? 'Invio...'
        : (sendFriendRequestBtn.dataset.originalLabel || 'Invia richiesta');
}

function clearFriendSearchResults() {
    if (friendSearchAbortController) {
        try { friendSearchAbortController.abort(); } catch (e) {}
        friendSearchAbortController = null;
    }
    clearResultsContainer(friendSearchResults);
}

async function fetchFriendSearchSuggestions(query = '') {
    if (!isAuthenticated() || !friendSearchResults) return;
    const q = String(query || '').trim();
    if (q.length < 2) {
        clearFriendSearchResults();
        return;
    }

    const requestId = ++friendSearchRequestId;
    if (friendSearchAbortController) {
        try { friendSearchAbortController.abort(); } catch (e) {}
    }
    friendSearchAbortController = new AbortController();

    try {
        const res = await fetch(`${getApiBase()}/friends/search?q=${encodeURIComponent(q)}`, {
            headers: {
                Accept: 'application/json',
                ...buildAuthHeaders()
            },
            credentials: 'include',
            signal: friendSearchAbortController.signal
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || 'Ricerca utenti non disponibile');
        if (requestId !== friendSearchRequestId) return;

        const items = Array.isArray(payload.items)
            ? payload.items.map((u) => ({
                id: u.id,
                value: u.email,
                label: u.email
            }))
            : [];
        if (!items.length) {
            clearResultsContainer(friendSearchResults);
            return;
        }
        renderResults(friendSearchResults, items, q, (item) => {
            if (friendSearchInput) friendSearchInput.value = item.value || '';
            clearResultsContainer(friendSearchResults);
            setFriendsStatus('');
        });
    } catch (e) {
        if (e?.name === 'AbortError') return;
        if (requestId !== friendSearchRequestId) return;
        clearResultsContainer(friendSearchResults);
    } finally {
        if (requestId === friendSearchRequestId) {
            friendSearchAbortController = null;
        }
    }
}

function setFriendsStatus(message = '') {
    if (friendsStatus) friendsStatus.textContent = message;
    if (friendsStatusMirror) friendsStatusMirror.textContent = message;
}

function formatFriendTripDate(value) {
    if (!value) return '-';
    const parsed = Number(value);
    const dt = Number.isFinite(parsed) ? new Date(parsed) : new Date(value);
    if (Number.isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('it-IT');
}

function formatFriendCurrency(value) {
    const amount = Number.parseFloat(value);
    if (!Number.isFinite(amount)) return '-';
    return `€${amount.toFixed(2)}`;
}

function normalizeFriendPhotoLabel(key) {
    if (!key || key === 'default') return 'Foto auto principale';
    return `Foto ${String(key).replace(/[-_]+/g, ' ')}`;
}

function getFriendDisplayName(friend = {}) {
    return (friend.username || friend.email || 'Amico').trim();
}

function ensureImagePreviewOverlay() {
    if (imagePreviewOverlay) return;
    const overlay = document.createElement('div');
    overlay.className = 'image-preview-overlay';
    overlay.style.display = 'none';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-preview-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Chiudi anteprima immagine');
    closeBtn.textContent = '✖';

    const image = document.createElement('img');
    image.className = 'image-preview-image';
    image.alt = 'Anteprima immagine';

    overlay.append(closeBtn, image);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay || event.target === closeBtn) {
            closeImagePreview();
        }
    });

    imagePreviewOverlay = overlay;
    imagePreviewImage = image;
}

function openImagePreview(src = '', alt = 'Anteprima immagine') {
    if (!src) return;
    ensureImagePreviewOverlay();
    if (!imagePreviewOverlay || !imagePreviewImage) return;
    imagePreviewImage.src = src;
    imagePreviewImage.alt = alt || 'Anteprima immagine';
    imagePreviewOverlay.style.display = 'flex';
    document.body.classList.add('no-scroll');
}

function closeImagePreview() {
    if (!imagePreviewOverlay || !imagePreviewImage) return;
    imagePreviewOverlay.style.display = 'none';
    imagePreviewImage.src = '';
    document.body.classList.remove('no-scroll');
}

function appendFriendSharedItem(title, subtitle = '', meta = '', imageSrc = '') {
    if (!friendSharedList) return;
    const li = document.createElement('li');
    li.className = 'favorite-item';
    const metaWrap = document.createElement('div');
    metaWrap.className = 'favorite-meta';
    const heading = document.createElement('strong');
    heading.textContent = title;
    metaWrap.append(heading);

    if (subtitle) {
        const sub = document.createElement('span');
        sub.textContent = subtitle;
        metaWrap.append(sub);
    }

    if (meta) {
        const detail = document.createElement('span');
        detail.textContent = meta;
        metaWrap.append(detail);
    }

    li.append(metaWrap);

    if (imageSrc) {
        const image = document.createElement('img');
        image.className = 'friend-shared-photo';
        image.src = imageSrc;
        image.alt = title;
        image.loading = 'lazy';
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `Apri immagine grande: ${title}`);
        image.title = 'Clicca per ingrandire';
        image.addEventListener('click', () => openImagePreview(imageSrc, title));
        image.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openImagePreview(imageSrc, title);
        });
        li.append(image);
    }

    friendSharedList.appendChild(li);
}

function renderFriendSharedData(shared) {
    if (!friendSharedList || !friendSharedEmpty) return;
    friendSharedList.innerHTML = '';
    if (!shared) {
        friendSharedEmpty.style.display = 'block';
        return;
    }
    friendSharedEmpty.style.display = 'none';

    const favoritesItems = Array.isArray(shared.favorites) ? shared.favorites : [];
    const companionsItems = Array.isArray(shared.companions) ? shared.companions : [];
    const photoEntries = Object.entries(shared.mycarPhotos || {}).filter(([, value]) => typeof value === 'string' && value.startsWith('data:image'));
    const settings = shared.settings || {};
    const friend = shared.friend || {};
    const friendName = getFriendDisplayName(friend);
    const friendAvatar = friend.avatarUrl || buildDefaultAccountAvatar(friendName);
    const friendLocation = (friend.location || '').trim();
    const friendBio = (friend.bio || '').trim();

    const profileCard = document.createElement('li');
    profileCard.className = 'favorite-item friend-profile-card';

    const avatar = document.createElement('img');
    avatar.className = 'friend-profile-avatar';
    avatar.src = friendAvatar;
    avatar.alt = `Profilo di ${friendName}`;
    avatar.tabIndex = 0;
    avatar.setAttribute('role', 'button');
    avatar.setAttribute('aria-label', `Apri foto profilo di ${friendName}`);
    avatar.title = 'Clicca per ingrandire';
    avatar.addEventListener('click', () => openImagePreview(friendAvatar, `Profilo di ${friendName}`));
    avatar.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openImagePreview(friendAvatar, `Profilo di ${friendName}`);
    });

    const profileMeta = document.createElement('div');
    profileMeta.className = 'friend-profile-meta';

    const title = document.createElement('strong');
    title.textContent = friendName;
    const emailLine = document.createElement('span');
    emailLine.textContent = friend.email || '-';
    profileMeta.append(title, emailLine);

    if (friendLocation) {
        const location = document.createElement('span');
        location.className = 'friend-profile-pill';
        location.textContent = `Localita: ${friendLocation}`;
        profileMeta.append(location);
    }

    const statsLine = document.createElement('span');
    statsLine.textContent = `Preferiti: ${favoritesItems.length} • Tratte in compagnia: ${companionsItems.length} • Foto auto: ${photoEntries.length}`;
    profileMeta.append(statsLine);

    if (friendBio) {
        const bio = document.createElement('span');
        bio.className = 'friend-profile-bio';
        bio.textContent = friendBio;
        profileMeta.append(bio);
    }

    profileCard.append(avatar, profileMeta);
    friendSharedList.appendChild(profileCard);

    if (!settings.shareFavorites) {
        appendFriendSharedItem('Preferiti non condivisi', 'Questo amico ha disattivato la condivisione dei preferiti.');
    } else if (!favoritesItems.length) {
        appendFriendSharedItem('Nessun preferito condiviso', "L'amico non ha ancora salvato tratte preferite da mostrare.");
    } else {
        favoritesItems.forEach((trip) => {
            const route = `${trip.departure || '-'} -> ${trip.arrival || '-'}`;
            const subtitle = `${trip.carLabel || 'Auto non specificata'} • ${trip.fuelLabel || 'Carburante non specificato'}`;
            const meta = `Distanza: ${trip.distance || '-'} km • Totale: ${formatFriendCurrency(trip.totalCost)} • Data: ${formatFriendTripDate(trip.timestamp)}`;
            appendFriendSharedItem(`Preferito: ${route}`, subtitle, meta);
        });
    }

    if (!settings.shareMyCar) {
        appendFriendSharedItem('Foto auto non condivise', 'Questo amico ha disattivato la condivisione della sezione La mia auto.');
    } else if (!photoEntries.length) {
        appendFriendSharedItem('Nessuna foto auto condivisa', "L'amico non ha ancora caricato foto nella sezione La mia auto.");
    } else {
        photoEntries.forEach(([key, dataUrl]) => {
            appendFriendSharedItem(normalizeFriendPhotoLabel(key), '', '', dataUrl);
        });
    }

    if (!settings.shareCompanionTrips) {
        appendFriendSharedItem('Tratte in compagnia non condivise', 'Questo amico ha disattivato la condivisione delle tratte in compagnia.');
    } else if (!companionsItems.length) {
        appendFriendSharedItem('Nessuna tratta in compagnia condivisa', "L'amico non ha ancora tratte in compagnia da mostrare.");
    } else {
        companionsItems.forEach((trip) => {
            const route = `${trip.departure || '-'} -> ${trip.arrival || '-'}`;
            const people = Array.isArray(trip.participants) && trip.participants.length
                ? trip.participants.join(', ')
                : 'Partecipanti non indicati';
            const subtitle = `Partecipanti: ${people}`;
            const meta = `Totale: ${formatFriendCurrency(trip.totalCost)} • Quota: ${formatFriendCurrency(trip.perPerson)} • Data: ${formatFriendTripDate(trip.timestamp)}`;
            appendFriendSharedItem(`Tratta in compagnia: ${route}`, subtitle, meta);
        });
    }
}

async function selectFriend(friendId) {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend || !friendId) return;
    selectedFriendId = friendId;
    renderFriends();
    setFriendsStatus(`Caricamento dati condivisi di ${getFriendDisplayName(friend)}...`);
    try {
        const res = await apiRequest(`/friends/${friend.id}/shared`);
        renderFriendSharedData(res.item || null);
        setFriendsStatus('');
    } catch (e) {
        setFriendsStatus(e.message);
    }
}

function renderFriends() {
    if (!friendsList || !friendsEmpty) return;
    friendsList.innerHTML = '';
    if (!friends.length) {
        friendsEmpty.style.display = 'block';
        selectedFriendId = '';
        renderFriendSharedData(null);
        return;
    }
    friendsEmpty.style.display = 'none';

    if (selectedFriendId && !friends.some((friend) => friend.id === selectedFriendId)) {
        selectedFriendId = '';
        renderFriendSharedData(null);
    }

    friends.forEach(friend => {
        const li = document.createElement('li');
        li.className = `favorite-item friend-item${selectedFriendId === friend.id ? ' is-active' : ''}`;
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `Apri dati condivisi di ${getFriendDisplayName(friend)}`);

        const meta = document.createElement('div');
        meta.className = 'favorite-meta friend-card-meta';

        const top = document.createElement('div');
        top.className = 'friend-card-top';

        const avatar = document.createElement('img');
        avatar.className = 'friend-card-avatar';
        avatar.src = friend.avatarUrl || buildDefaultAccountAvatar(getFriendDisplayName(friend));
        avatar.alt = `Avatar ${getFriendDisplayName(friend)}`;

        const identity = document.createElement('div');
        identity.className = 'friend-card-identity';
        const title = document.createElement('strong');
        title.textContent = getFriendDisplayName(friend);
        const subtitle = document.createElement('span');
        subtitle.textContent = friend.email || '-';
        identity.append(title, subtitle);
        top.append(avatar, identity);
        meta.append(top);

        if (friend.location) {
            const location = document.createElement('span');
            location.className = 'friend-card-location';
            location.textContent = `Localita: ${friend.location}`;
            meta.append(location);
        }

        if (friend.bio) {
            const bio = document.createElement('span');
            bio.className = 'friend-card-bio';
            bio.textContent = friend.bio;
            meta.append(bio);
        }

        li.append(meta);
        li.addEventListener('click', () => {
            selectFriend(friend.id);
        });
        li.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectFriend(friend.id);
        });
        friendsList.appendChild(li);
    });
}

function renderFriendRequests() {
    if (friendRequestsList && friendRequestsEmpty) {
        friendRequestsList.innerHTML = '';
        if (!incomingFriendRequests.length) {
            friendRequestsEmpty.style.display = 'block';
        } else {
            friendRequestsEmpty.style.display = 'none';
            incomingFriendRequests.forEach(item => {
                const li = document.createElement('li');
                li.className = 'favorite-item';

                const meta = document.createElement('div');
                meta.className = 'favorite-meta';
                const title = document.createElement('strong');
                title.textContent = item.fromEmail;
                meta.append(title);

                const actions = document.createElement('div');
                actions.className = 'favorite-actions';
                const acceptBtn = document.createElement('button');
                acceptBtn.className = 'pill-btn primary';
                acceptBtn.textContent = 'Accetta';
                acceptBtn.addEventListener('click', async () => {
                    try {
                        await apiRequest(`/friends/requests/${item.id}/accept`, 'POST');
                        await loadFriendsData();
                        setFriendsStatus('Richiesta accettata');
                    } catch (e) {
                        setFriendsStatus(e.message);
                    }
                });
                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'pill-btn danger';
                rejectBtn.textContent = 'Rifiuta';
                rejectBtn.addEventListener('click', async () => {
                    try {
                        await apiRequest(`/friends/requests/${item.id}/reject`, 'POST');
                        await loadFriendsData();
                        setFriendsStatus('Richiesta rifiutata');
                    } catch (e) {
                        setFriendsStatus(e.message);
                    }
                });
                actions.append(acceptBtn, rejectBtn);
                li.append(meta, actions);
                friendRequestsList.appendChild(li);
            });
        }
    }

    if (friendOutgoingList && friendOutgoingEmpty) {
        friendOutgoingList.innerHTML = '';
        if (!outgoingFriendRequests.length) {
            friendOutgoingEmpty.style.display = 'block';
        } else {
            friendOutgoingEmpty.style.display = 'none';
            outgoingFriendRequests.forEach(item => {
                const li = document.createElement('li');
                li.className = 'favorite-item';
                const meta = document.createElement('div');
                meta.className = 'favorite-meta';
                const title = document.createElement('strong');
                title.textContent = `In attesa: ${item.toEmail}`;
                meta.append(title);
                li.append(meta);
                friendOutgoingList.appendChild(li);
            });
        }
    }
}

function applyShareSettingsToUI() {
    if (shareFavoritesToggle) shareFavoritesToggle.checked = !!shareSettings.shareFavorites;
    if (shareMyCarToggle) shareMyCarToggle.checked = !!shareSettings.shareMyCar;
    if (shareCompanionsToggle) shareCompanionsToggle.checked = !!shareSettings.shareCompanionTrips;
}

async function loadFriendsData() {
    if (!authToken) return;
    const [friendsRes, requestsRes, shareRes] = await Promise.all([
        apiRequest('/friends').catch(() => ({ items: [] })),
        apiRequest('/friends/requests').catch(() => ({ incoming: [], outgoing: [] })),
        apiRequest('/share-settings').catch(() => ({ settings: shareSettings }))
    ]);
    friends = friendsRes.items || [];
    incomingFriendRequests = requestsRes.incoming || [];
    outgoingFriendRequests = requestsRes.outgoing || [];
    shareSettings = shareRes.settings || shareSettings;
    renderFriends();
    renderFriendRequests();
    applyShareSettingsToUI();
}

async function saveShareSettings() {
    if (!authToken) return;
    const payload = {
        shareFavorites: !!shareFavoritesToggle?.checked,
        shareMyCar: !!shareMyCarToggle?.checked,
        shareCompanionTrips: !!shareCompanionsToggle?.checked
    };
    try {
        const res = await apiRequest('/share-settings', 'PUT', payload);
        shareSettings = res.settings || payload;
        applyShareSettingsToUI();
        setFriendsStatus('Impostazioni privacy salvate');
    } catch (e) {
        setFriendsStatus(e.message);
    }
}

async function sendFriendRequest() {
    const email = (friendSearchInput?.value || '').trim();
    if (!email) {
        setFriendsStatus('Inserisci una email valida');
        return;
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
        setFriendsStatus('Formato email non valido');
        return;
    }
    setFriendRequestBusy(true);
    try {
        await apiRequest('/friends/request', 'POST', { email });
        friendSearchInput.value = '';
        clearFriendSearchResults();
        await loadFriendsData();
        setFriendsStatus('Richiesta inviata');
    } catch (e) {
        if ((e.message || '').toLowerCase().includes('sessione scaduta')) {
            await clearAuth();
            openAuth();
        }
        setFriendsStatus(e.message);
    } finally {
        setFriendRequestBusy(false);
    }
}

function setAuth(token, user) {
    authToken = token || 'cookie-session';
    currentUser = user || null;
    updateAuthUI();
    if (isAuthenticated()) {
        loadAllRemoteData().catch(() => {});
    }
}

async function clearAuth({ remote = true } = {}) {
    const headers = buildAuthHeaders();
    authToken = null;
    currentUser = null;
    accountProfile = null;
    accountStats = null;
    friends = [];
    incomingFriendRequests = [];
    outgoingFriendRequests = [];
    selectedFriendId = '';
    updateAuthUI();
    renderAccountProfile();
    renderFriends();
    renderFriendRequests();
    renderFriendSharedData(null);
    setFriendsStatus('');
    if (accountCurrentPassword) accountCurrentPassword.value = '';
    if (accountNewPassword) accountNewPassword.value = '';
    if (friendRequestsOverlay) friendRequestsOverlay.style.display = 'none';
    if (friendsOverlay) friendsOverlay.style.display = 'none';

    if (remote) {
        try {
            await fetch(`${getApiBase()}/auth/logout`, {
                method: 'POST',
                headers,
                credentials: 'include'
            });
        } catch (e) {
            // Ignore logout network failures; local session is already cleared.
        }
    }
}

async function loadAccountProfile() {
    if (!isAuthenticated()) {
        accountProfile = null;
        accountStats = null;
        renderAccountProfile();
        return;
    }
    const res = await apiRequest('/auth/me');
    accountProfile = res.user || accountProfile || currentUser || null;
    accountStats = res.stats || accountStats;
    if (accountProfile) {
        currentUser = { ...(currentUser || {}), ...accountProfile };
    }
    renderAccountProfile();
}

async function restoreAuthSession() {
    try {
        const payload = await apiRequest('/auth/me');
        if (!payload?.user) return false;
        authToken = 'cookie-session';
        currentUser = payload.user;
        accountProfile = payload.user;
        accountStats = payload.stats || accountStats;
        updateAuthUI('Sessione ripristinata');
        return true;
    } catch (e) {
        return false;
    }
}

async function handleAuth(isRegister) {
    const email = (authEmailInput?.value || '').trim();
    const password = authPasswordInput?.value || '';
    const username = (authUsernameInput?.value || '').trim();
    if (!email || !password) {
        updateAuthUI('Inserisci email e password');
        setAuthFeedback('Inserisci email e password', 'error');
        return;
    }
    try {
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        const json = await apiRequest(
            endpoint,
            'POST',
            isRegister ? { email, password, username } : { email, password }
        );
        setAuth(json.token || 'cookie-session', json.user);
        accountProfile = json.user || accountProfile;
        accountStats = json.stats || accountStats;
        updateAuthUI(isRegister ? 'Registrazione completata' : 'Accesso riuscito');
        renderAccountProfile();
        setAuthFeedback(
            isRegister
                ? `Benvenuto ${accountProfile?.username || ''}! Account creato con successo.`
                : `Accesso eseguito: bentornato ${accountProfile?.username || accountProfile?.email || ''}.`,
            'success'
        );
        if (authPasswordInput) authPasswordInput.value = '';
        if (accountCurrentPassword) accountCurrentPassword.value = '';
        if (accountNewPassword) accountNewPassword.value = '';
    } catch (err) {
        updateAuthUI(err.message);
        setAuthFeedback(err.message, 'error');
    }
}

async function saveAccountProfile() {
    if (!authToken) {
        openAuth();
        updateAuthUI('Accedi per modificare il profilo');
        return;
    }
    const payload = {
        username: (accountProfileUsername?.value || '').trim(),
        location: (accountProfileLocation?.value || '').trim(),
        bio: (accountProfileBio?.value || '').trim()
    };
    try {
        const res = await apiRequest('/auth/profile', 'PUT', payload);
        accountProfile = res.user || accountProfile;
        accountStats = res.stats || accountStats;
        if (accountProfile) {
            currentUser = { ...(currentUser || {}), ...accountProfile };
        }
        renderAccountProfile();
        updateAuthUI('Profilo aggiornato');
        setAuthFeedback('Profilo salvato correttamente', 'success');
    } catch (e) {
        updateAuthUI(e.message);
        setAuthFeedback(e.message, 'error');
    }
}

async function handleAccountAvatarSelected(file) {
    if (!file || !authToken) return;
    if (file.size > 8 * 1024 * 1024) {
        updateAuthUI('Immagine troppo grande (max 8MB)');
        setAuthFeedback('Immagine troppo grande (max 8MB)', 'error');
        return;
    }
    updateAuthUI('Elaborazione immagine profilo...');
    const dataUrl = await processMyCarPhotoFile(file);
    if (!dataUrl) {
        updateAuthUI('Formato immagine non supportato');
        setAuthFeedback('Formato immagine non supportato', 'error');
        return;
    }
    try {
        const res = await apiRequest('/auth/profile', 'PUT', { avatarUrl: dataUrl });
        accountProfile = res.user || accountProfile;
        accountStats = res.stats || accountStats;
        renderAccountProfile();
        updateAuthUI('Immagine profilo aggiornata');
        setAuthFeedback('Immagine profilo aggiornata', 'success');
    } catch (e) {
        updateAuthUI(e.message);
        setAuthFeedback(e.message, 'error');
    }
}

async function removeAccountAvatar() {
    if (!authToken) return;
    try {
        const res = await apiRequest('/auth/profile', 'PUT', { avatarUrl: '' });
        accountProfile = res.user || accountProfile;
        accountStats = res.stats || accountStats;
        renderAccountProfile();
        updateAuthUI('Immagine profilo rimossa');
        setAuthFeedback('Immagine profilo rimossa', 'success');
    } catch (e) {
        updateAuthUI(e.message);
        setAuthFeedback(e.message, 'error');
    }
}

async function changeAccountPassword() {
    if (!authToken) return;
    const currentPassword = accountCurrentPassword?.value || '';
    const newPassword = accountNewPassword?.value || '';
    if (!currentPassword || !newPassword) {
        updateAuthUI('Inserisci password attuale e nuova password');
        setAuthFeedback('Inserisci password attuale e nuova password', 'error');
        return;
    }
    try {
        await apiRequest('/auth/password', 'PUT', { currentPassword, newPassword });
        if (accountCurrentPassword) accountCurrentPassword.value = '';
        if (accountNewPassword) accountNewPassword.value = '';
        updateAuthUI('Password aggiornata');
        setAuthFeedback('Password aggiornata con successo', 'success');
    } catch (e) {
        updateAuthUI(e.message);
        setAuthFeedback(e.message, 'error');
    }
}

async function loadAllRemoteData() {
    await Promise.all([
        loadFavorites(),
        loadCompanionTrips(),
        loadCompletedTrips(),
        loadMyCarPhotos(),
        loadFriendsData().catch(() => {}),
        loadAccountProfile().catch(() => {})
    ]);
    renderFavorites();
    renderCompanionHistory();
    renderBudget();
    renderAccountProfile();
}

function upsertCompletedTrip(entry) {
    if (!entry || !entry.tripId) return;
    const normalized = { ...entry, completed: true };
    const idx = completedTrips.findIndex(t => t.tripId === entry.tripId);
    if (idx >= 0) {
        completedTrips[idx] = normalized;
    } else {
        completedTrips.unshift(normalized);
    }
    persistCompletedTrips();
}

function removeCompletedTrip(tripId) {
    if (!tripId) return;
    const idx = completedTrips.findIndex(t => t.tripId === tripId);
    if (idx >= 0) {
        if (authToken) {
            apiRequest(`/completed/${tripId}`, 'DELETE').catch(() => {});
        }
        completedTrips.splice(idx, 1);
        persistCompletedTrips();
    }
}

function syncCompletedFlag() {
    if (!completedTripCheckbox || !lastCalculatedTrip) return;
    lastCalculatedTrip.completed = completedTripCheckbox.checked;
    if (completedTripCheckbox.checked) {
        upsertCompletedTrip(lastCalculatedTrip);
    } else {
        removeCompletedTrip(lastCalculatedTrip.tripId);
    }
}

async function loadFavorites() {
    try {
        if (authToken) {
            const res = await apiRequest('/favorites');
            favorites = res.items || [];
        } else {
            const raw = localStorage.getItem(FAVORITES_KEY);
            favorites = raw ? JSON.parse(raw) : [];
        }
    } catch (e) {
        favorites = [];
    }
}

async function loadCompletedTrips() {
    try {
        if (authToken) {
            const res = await apiRequest('/completed');
            completedTrips = res.items || [];
        } else {
            const raw = localStorage.getItem(COMPLETED_KEY);
            completedTrips = raw ? JSON.parse(raw) : [];
        }
    } catch (e) {
        completedTrips = [];
    }
    updateMyCarPreview();
}

async function loadMyCarPhotos() {
    try {
        if (authToken) {
            const res = await apiRequest('/mycar-photo');
            myCarPhotos = res.items || {};
        } else {
            const raw = localStorage.getItem(MYCAR_PHOTOS_KEY);
            myCarPhotos = raw ? JSON.parse(raw) : {};
        }
    } catch (e) {
        myCarPhotos = {};
    }
    updateMyCarPreview();
}

async function persistFavorites() {
    if (authToken) {
        favorites.forEach(f => {
            apiRequest('/favorites', 'POST', f).catch(() => {});
        });
    } else {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

async function persistCompletedTrips() {
    if (authToken) {
        completedTrips.forEach(t => {
            apiRequest('/completed', 'POST', t).catch(() => {});
        });
    } else {
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTrips));
    }
}

function renderFavorites() {
    if (!favoritesList || !favoritesEmpty) return;
    favoritesList.innerHTML = '';
    if (!favorites.length) {
        favoritesEmpty.style.display = 'block';
        return;
    }
    favoritesEmpty.style.display = 'none';

    favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';

        const meta = document.createElement('div');
        meta.className = 'favorite-meta';
        const title = document.createElement('strong');
        title.textContent = `${fav.departure} → ${fav.arrival}`;
        const subtitle = document.createElement('span');
        subtitle.textContent = `${fav.carLabel} • ${fav.fuelLabel} • ${fav.distance} km`;
        const cost = document.createElement('span');
        cost.textContent = `Costo totale stimato: €${fav.totalCost}`;
        meta.append(title, subtitle, cost);

        const actions = document.createElement('div');
        actions.className = 'favorite-actions';

        const loadBtn = document.createElement('button');
        loadBtn.className = 'pill-btn primary';
        loadBtn.textContent = 'Carica';
        loadBtn.addEventListener('click', () => loadFavorite(fav));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'pill-btn danger';
        deleteBtn.textContent = 'Rimuovi';
        deleteBtn.addEventListener('click', async () => {
            if (authToken) {
                try {
                    await apiRequest(`/favorites/${fav.tripId}`, 'DELETE');
                } catch (e) {
                    // fallback to local update
                }
            }
            favorites.splice(index, 1);
            persistFavorites();
            renderFavorites();
        });

        actions.append(loadBtn, deleteBtn);
        li.append(meta, actions);
        favoritesList.appendChild(li);
    });
}

async function openFavorites() {
    if (favoritesOverlay) {
        if (authToken) await loadFavorites();
        favoritesOverlay.style.display = 'flex';
        setActiveMenu(favoritesBtn);
        renderFavorites();
    }
}

function closeFavorites() {
    if (favoritesOverlay) favoritesOverlay.style.display = 'none';
    setActiveMenu(homeBtn);
}

function openAuth() {
    if (authOverlay) {
        authOverlay.style.display = 'flex';
        setActiveMenu(accountBtn);
        updateAuthUI(authToken ? 'Account connesso' : 'Accedi o registrati');
        setAuthFeedback('');
        if (authToken) {
            loadAccountProfile().catch((e) => {
                updateAuthUI(e.message || 'Impossibile caricare il profilo');
            });
        }
    }
}

async function openFriendRequestsView() {
    if (!authToken) {
        openAuth();
        updateAuthUI('Accedi per inviare o gestire richieste amicizia');
        return;
    }
    if (!friendRequestsOverlay) return;
    if (authOverlay) authOverlay.style.display = 'none';
    if (friendsOverlay) friendsOverlay.style.display = 'none';
    friendRequestsOverlay.style.display = 'flex';
    setActiveMenu(friendRequestsBtn);
    setFriendsStatus('Gestisci richieste amicizia');
    try {
        await loadFriendsData();
        clearFriendSearchResults();
        if (friendSearchInput) friendSearchInput.focus();
    } catch (e) {
        setFriendsStatus('Impossibile caricare richieste amicizia');
    }
}

async function openFriendsView() {
    if (!authToken) {
        openAuth();
        updateAuthUI('Accedi per visualizzare I miei amici');
        return;
    }
    if (!friendsOverlay) return;
    if (authOverlay) authOverlay.style.display = 'none';
    if (friendRequestsOverlay) friendRequestsOverlay.style.display = 'none';
    friendsOverlay.style.display = 'flex';
    setActiveMenu(friendsBtn);
    setFriendsStatus('Clicca un amico per vedere profilo e condivisioni');
    try {
        await loadFriendsData();
    } catch (e) {
        setFriendsStatus('Impossibile caricare amici');
    }
}

function closeAuth() {
    if (authOverlay) authOverlay.style.display = 'none';
    setAuthFeedback('');
    setActiveMenu(homeBtn);
}

function closeFriendRequestsView() {
    if (friendRequestsOverlay) friendRequestsOverlay.style.display = 'none';
    clearFriendSearchResults();
    setActiveMenu(homeBtn);
}

function closeFriendsView() {
    if (friendsOverlay) friendsOverlay.style.display = 'none';
    setActiveMenu(homeBtn);
}

async function copyTripSummary() {
    if (!lastCalculatedTrip) {
        setTripActionFeedback('Calcola prima una tratta da copiare.');
        return;
    }

    const distance = `${lastCalculatedTrip.distance || '-'} km`;
    const totalCost = `€${lastCalculatedTrip.totalCost || '-'}`;
    const fuelCost = `€${lastCalculatedTrip.fuelCost || '-'}`;
    const tollCost = `€${lastCalculatedTrip.tollCost || '-'}`;
    const lines = [
        'Riepilogo viaggio DriveCalc',
        `${lastCalculatedTrip.departure} -> ${lastCalculatedTrip.arrival}`,
        `Auto: ${lastCalculatedTrip.carLabel || '-'}`,
        `Alimentazione: ${lastCalculatedTrip.fuelLabel || lastCalculatedTrip.fuelType || '-'}`,
        `Distanza: ${distance}`,
        `Carburante: ${fuelCost}`,
        `Pedaggi: ${tollCost}`,
        `Totale: ${totalCost}`
    ];
    const text = lines.join('\n');

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const helper = document.createElement('textarea');
            helper.value = text;
            helper.style.position = 'fixed';
            helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.select();
            document.execCommand('copy');
            document.body.removeChild(helper);
        }
        setTripActionFeedback('Riepilogo copiato negli appunti.');
    } catch (e) {
        setTripActionFeedback('Impossibile copiare automaticamente. Riprova.');
    }
}

async function saveCurrentToFavorites() {
    if (!lastCalculatedTrip) {
        alert('Calcola prima un viaggio per salvarlo nei preferiti.');
        return;
    }
    syncCompletedFlag();
    const duplicate = favorites.some(f =>
        f.departure === lastCalculatedTrip.departure &&
        f.arrival === lastCalculatedTrip.arrival &&
        f.carType === lastCalculatedTrip.carType &&
        f.carBrand === lastCalculatedTrip.carBrand &&
        f.fuelType === lastCalculatedTrip.fuelType
    );
    if (duplicate) {
        alert('Questa tratta è già nei preferiti.');
        return;
    }
    if (authToken) {
        try {
            const res = await apiRequest('/favorites', 'POST', lastCalculatedTrip);
            const saved = res.item || lastCalculatedTrip;
            favorites = [saved, ...favorites.filter(f => f.tripId !== saved.tripId)];
        } catch (e) {
            alert('Errore nel salvataggio su cloud');
        }
    } else {
        favorites.unshift(lastCalculatedTrip);
        persistFavorites();
    }
    renderFavorites();
    closeFavorites();
}

async function loadFavorite(fav) {
    applyLocationToForm(fav);
    carBrandSelect.value = fav.carBrand;
    syncBrandInputFromSelect();
    await filterModelsByBrand();
    carTypeSelect.value = fav.carType;
    syncModelInputFromSelect();
    fuelTypeSelect.value = fav.fuelType;
    updateFuelPriceUI();
    closeFavorites();
    showCalculatorView();
}

// Gestione tratte in compagnia (storage locale + split costi)
async function loadCompanionTrips() {
    try {
        if (authToken) {
            const res = await apiRequest('/companions');
            companionTrips = res.items || [];
        } else {
            const raw = localStorage.getItem(COMPANIONS_KEY);
            companionTrips = raw ? JSON.parse(raw) : [];
        }
    } catch (e) {
        companionTrips = [];
    }
}

async function persistCompanionTrips() {
    if (authToken) {
        companionTrips.forEach(t => {
            apiRequest('/companions', 'POST', t).catch(() => {});
        });
    } else {
        localStorage.setItem(COMPANIONS_KEY, JSON.stringify(companionTrips));
    }
}

function renderCompanionsList() {
    if (!companionsList || !companionsEmpty) return;
    companionsList.innerHTML = '';
    const hasPeople = currentCompanions.length > 0;
    companionsEmpty.style.display = hasPeople ? 'none' : 'block';

    currentCompanions.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';

        const meta = document.createElement('div');
        meta.className = 'favorite-meta';
        const title = document.createElement('strong');
        title.textContent = name;
        meta.append(title);

        const actions = document.createElement('div');
        actions.className = 'favorite-actions';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'pill-btn danger';
        removeBtn.textContent = 'Rimuovi';
        removeBtn.addEventListener('click', () => {
            currentCompanions.splice(index, 1);
            renderCompanionsList();
            updateSplitSummary();
        });
        actions.append(removeBtn);

        li.append(meta, actions);
        companionsList.appendChild(li);
    });
}

function updateSplitSummary() {
    if (!participantsCount || !splitValue) return;
    const count = currentCompanions.length;
    participantsCount.textContent = count;
    const total = lastCalculatedTrip ? parseFloat(lastCalculatedTrip.totalCost) : 0;
    const perPerson = count > 0 ? (total / count) : 0;
    splitValue.textContent = `€${perPerson.toFixed(2)}`;
}

function renderCompanionHistory() {
    if (!companionsHistoryList || !companionsHistoryEmpty) return;
    companionsHistoryList.innerHTML = '';
    if (!companionTrips.length) {
        companionsHistoryEmpty.style.display = 'block';
        return;
    }
    companionsHistoryEmpty.style.display = 'none';

    companionTrips.forEach((trip, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';

        const meta = document.createElement('div');
        meta.className = 'favorite-meta';
        const title = document.createElement('strong');
        title.textContent = `${trip.departure} → ${trip.arrival}`;
        const subtitle = document.createElement('span');
        subtitle.textContent = `${trip.carLabel} • ${trip.fuelLabel} • ${trip.participants.length} persone`;
        const cost = document.createElement('span');
        cost.textContent = `Totale: €${trip.totalCost} • Quota: €${trip.perPerson}`;
        meta.append(title, subtitle, cost);

        const actions = document.createElement('div');
        actions.className = 'favorite-actions';
        const loadBtn = document.createElement('button');
        loadBtn.className = 'pill-btn primary';
        loadBtn.textContent = 'Carica';
        loadBtn.addEventListener('click', () => loadCompanionTrip(trip));
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'pill-btn danger';
        deleteBtn.textContent = 'Rimuovi';
        deleteBtn.addEventListener('click', async () => {
            if (authToken) {
                apiRequest(`/companions/${trip.tripId}`, 'DELETE').catch(() => {});
            }
            companionTrips.splice(index, 1);
            persistCompanionTrips();
            renderCompanionHistory();
        });
        actions.append(loadBtn, deleteBtn);

        li.append(meta, actions);
        companionsHistoryList.appendChild(li);
    });
}

async function openCompanions() {
    if (authToken) await loadCompanionTrips();
    setActiveMenu(companionsBtn);
    if (companionsOverlay) companionsOverlay.style.display = 'flex';
    currentCompanions = [];
    if (companionsTripInfo) {
        companionsTripInfo.textContent = lastCalculatedTrip
            ? `${lastCalculatedTrip.departure} → ${lastCalculatedTrip.arrival} • ${lastCalculatedTrip.carLabel} • ${lastCalculatedTrip.fuelLabel} • Totale €${lastCalculatedTrip.totalCost}`
            : 'Calcola una tratta per attivare la divisione dei costi.';
    }
    if (companionNameInput) companionNameInput.value = '';
    renderCompanionsList();
    updateSplitSummary();
    renderCompanionHistory();
}

function closeCompanions() {
    if (companionsOverlay) companionsOverlay.style.display = 'none';
    setActiveMenu(homeBtn);
}

function addCompanion() {
    const name = (companionNameInput?.value || '').trim();
    if (!name) return;
    currentCompanions.push(name);
    companionNameInput.value = '';
    renderCompanionsList();
    updateSplitSummary();
}

function saveCompanionTrip() {
    if (!lastCalculatedTrip) {
        alert('Calcola prima una tratta da salvare.');
        return;
    }
    if (!currentCompanions.length) {
        alert('Aggiungi almeno una persona.');
        return;
    }
    syncCompletedFlag();
    const perPerson = currentCompanions.length > 0
        ? (parseFloat(lastCalculatedTrip.totalCost) / currentCompanions.length).toFixed(2)
        : '0.00';
    const entry = {
        ...lastCalculatedTrip,
        participants: [...currentCompanions],
        perPerson,
        type: 'shared'
    };
    companionTrips.unshift(entry);
    if (authToken) {
        apiRequest('/companions', 'POST', entry).catch(() => {});
    }
    persistCompanionTrips();
    if (entry.completed) {
        upsertCompletedTrip(entry);
    }
    renderCompanionHistory();
    alert('Tratta salvata in compagnia.');
}

async function loadCompanionTrip(trip) {
    applyLocationToForm(trip);
    carBrandSelect.value = trip.carBrand;
    syncBrandInputFromSelect();
    await filterModelsByBrand();
    carTypeSelect.value = trip.carType;
    syncModelInputFromSelect();
    fuelTypeSelect.value = trip.fuelType;
    updateFuelPriceUI();
    closeCompanions();
    showCalculatorView();
}

// Bilancio mensile
function getCurrentMonthLabel(dateObj) {
    const formatter = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });
    return formatter.format(dateObj);
}

function filterTripsCurrentMonth() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const trips = completedTrips.filter(trip => {
        const d = trip.timestamp ? new Date(trip.timestamp) : null;
        return trip.completed && d && d.getMonth() === month && d.getFullYear() === year;
    });

    return trips;
}

function renderBudget() {
    if (!budgetTripsList || !budgetEmpty) return;
    const now = new Date();
    if (budgetMonthLabel) budgetMonthLabel.textContent = getCurrentMonthLabel(now);

    const trips = filterTripsCurrentMonth();
    budgetTripsList.innerHTML = '';
    if (!trips.length) {
        budgetEmpty.style.display = 'block';
        if (budgetTotalTrips) budgetTotalTrips.textContent = '0';
        if (budgetTotalCost) budgetTotalCost.textContent = '€0.00';
        if (budgetAvgCost) budgetAvgCost.textContent = '€0.00';
        if (budgetFuelCost) budgetFuelCost.textContent = '€0.00';
        if (budgetTollCost) budgetTollCost.textContent = '€0.00';
        return;
    }
    budgetEmpty.style.display = 'none';

    let totalTrips = trips.length;
    let totalCost = 0;
    let totalFuel = 0;
    let totalToll = 0;

    trips.forEach(trip => {
        totalCost += parseFloat(trip.totalCost || 0);
        totalFuel += parseFloat(trip.fuelCost || 0);
        totalToll += parseFloat(trip.tollCost || 0);

        const li = document.createElement('li');
        li.className = 'favorite-item';

        const meta = document.createElement('div');
        meta.className = 'favorite-meta';
        const title = document.createElement('strong');
        title.textContent = `${trip.departure} → ${trip.arrival}`;
        const subtitle = document.createElement('span');
        const dateStr = trip.timestamp ? new Date(trip.timestamp).toLocaleDateString('it-IT') : '-';
        const who = trip.type === 'shared' ? `${trip.participants?.length || 0} persone` : 'Solo';
        subtitle.textContent = `${trip.carLabel} • ${trip.fuelLabel} • ${who} • ${dateStr}`;
        const cost = document.createElement('span');
        cost.textContent = `Totale: €${parseFloat(trip.totalCost || 0).toFixed(2)} • Carburante €${parseFloat(trip.fuelCost || 0).toFixed(2)} • Pedaggi €${parseFloat(trip.tollCost || 0).toFixed(2)}`;
        meta.append(title, subtitle, cost);

        const actions = document.createElement('div');
        actions.className = 'favorite-actions';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'pill-btn danger';
        removeBtn.textContent = 'Rimuovi dal bilancio';
        removeBtn.addEventListener('click', () => {
            removeCompletedTrip(trip.tripId);
            renderBudget();
        });
        actions.append(removeBtn);

        li.append(meta, actions);
        budgetTripsList.appendChild(li);
    });

    if (budgetTotalTrips) budgetTotalTrips.textContent = totalTrips.toString();
    if (budgetTotalCost) budgetTotalCost.textContent = `€${totalCost.toFixed(2)}`;
    if (budgetAvgCost) budgetAvgCost.textContent = `€${(totalCost / totalTrips).toFixed(2)}`;
    if (budgetFuelCost) budgetFuelCost.textContent = `€${totalFuel.toFixed(2)}`;
    if (budgetTollCost) budgetTollCost.textContent = `€${totalToll.toFixed(2)}`;
}

async function openBudget() {
    if (authToken) await loadCompletedTrips();
    setActiveMenu(budgetBtn);
    if (budgetOverlay) budgetOverlay.style.display = 'flex';
    renderBudget();
}

function closeBudget() {
    if (budgetOverlay) budgetOverlay.style.display = 'none';
    setActiveMenu(homeBtn);
}

async function openMyCar() {
    setActiveMenu(myCarBtn);
    if (myCarOverlay) myCarOverlay.style.display = 'flex';
    populateMyCarBrandOptions();

    if (!Object.keys(myCarPhotos || {}).length) {
        await loadMyCarPhotos();
    }

    if (myCarBrandSelect && !myCarBrandSelect.value) {
        myCarBrandSelect.value = carBrandSelect?.value || '';
    }
    const brandKey = (myCarBrandSelect?.value || '').replace(/^brand-/, '').trim().toLowerCase();
    await populateMyCarModelOptions(brandKey);

    if (myCarModelSelect && !myCarModelSelect.value) {
        myCarModelSelect.value = carTypeSelect?.value || '';
    }

    updateMyCarPreview();
}

function closeMyCar() {
    if (myCarOverlay) myCarOverlay.style.display = 'none';
    setActiveMenu(homeBtn);
}

// Gestione viste (calcolatore vs pagina info)
function setActiveMenu(button) {
    settingsMenuButtons.forEach(btn => btn.classList.remove('active'));
    if (button) {
        button.classList.add('active');
    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        closeSettingsMenu();
    }
}

function openSettingsMenu() {
    if (!settingsMenu) return;
    document.body.classList.add('mobile-menu-open');
    if (mobileMenuBackdrop) mobileMenuBackdrop.style.display = 'block';
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
}

function closeSettingsMenu() {
    document.body.classList.remove('mobile-menu-open');
    if (mobileMenuBackdrop) mobileMenuBackdrop.style.display = 'none';
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
}

function toggleSettingsMenu() {
    const isOpen = document.body.classList.contains('mobile-menu-open');
    if (isOpen) {
        closeSettingsMenu();
    } else {
        openSettingsMenu();
    }
}

function syncSettingsMenuCloseVisibility() {
    if (!closeSettingsMenuBtn) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    closeSettingsMenuBtn.style.display = isMobile ? 'inline-flex' : 'none';
}

function showCalculatorView() {
    if (mainPanel) mainPanel.style.display = 'block';
    if (infoPage) infoPage.style.display = 'none';
    setActiveMenu(homeBtn);
}

function showInfoView() {
    if (mainPanel) mainPanel.style.display = 'none';
    if (infoPage) infoPage.style.display = 'block';
    setActiveMenu(infoBtn);
    if (infoPage) {
        infoPage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Reset
function resetCalculator() {
    departureSelect.value = '';
    arrivalSelect.value = '';
    carTypeSelect.value = '';
    carBrandSelect.value = '';
    if (departureAddressInput) {
        departureAddressInput.value = '';
        departureAddressInput.dataset.kind = '';
        departureAddressInput.dataset.city = '';
        departureAddressInput.dataset.lat = '';
        departureAddressInput.dataset.lng = '';
    }
    if (arrivalAddressInput) {
        arrivalAddressInput.value = '';
        arrivalAddressInput.dataset.kind = '';
        arrivalAddressInput.dataset.city = '';
        arrivalAddressInput.dataset.lat = '';
        arrivalAddressInput.dataset.lng = '';
    }
    if (carBrandSearchInput) carBrandSearchInput.value = '';
    if (carTypeSearchInput) carTypeSearchInput.value = '';
    clearResultsContainer(carBrandResults);
    clearResultsContainer(carTypeResults);
    clearResultsContainer(departureAddressResults);
    clearResultsContainer(arrivalAddressResults);
    fuelTypeSelect.value = 'benzina';
    fuelPriceInput.value = '1.65';
    arrivalSelect.disabled = false;
    resultsSection.style.display = 'none';
    if (completedTripCheckbox) completedTripCheckbox.checked = false;
    filterModelsByBrand();
    updateFuelPriceUI();
    hideError();
    setTripActionFeedback('');
    updateMyCarPreview();
}

function handleBrandChange() {
    syncBrandInputFromSelect();
    filterModelsByBrand().then(() => {
        syncModelInputFromSelect();
        updateModelResults(carTypeSearchInput?.value || '');
        updateMyCarPreview();
    });
}

// Event listeners
calculateBtn.addEventListener('click', () => {
    calculateTrip().catch(err => {
        console.error(err);
        showError('❌ Si è verificato un errore durante il calcolo. Riprova.');
    });
});
resetBtn.addEventListener('click', resetCalculator);
fuelTypeSelect.addEventListener('change', updateFuelPriceUI);
carTypeSelect.addEventListener('change', () => {
    syncModelInputFromSelect();
    syncFuelWithCarType();
    updateMyCarPreview();
});
carBrandSelect.addEventListener('change', handleBrandChange);
carBrandSearchInput?.addEventListener('input', (e) => {
    const query = (e.target.value || '').trim();
    if (!query) {
        carBrandSelect.value = '';
        if (carTypeSelect) carTypeSelect.value = '';
        if (carTypeSearchInput) carTypeSearchInput.value = '';
        clearResultsContainer(carBrandResults);
        clearResultsContainer(carTypeResults);
        return;
    }
    carBrandSelect.value = '';
    if (carTypeSelect) carTypeSelect.value = '';
    if (carTypeSearchInput) carTypeSearchInput.value = '';
    clearResultsContainer(carTypeResults);
    updateBrandResults(query);
});
carTypeSearchInput?.addEventListener('input', (e) => {
    const query = (e.target.value || '').trim();
    carTypeSelect.value = '';
    if (!query) {
        clearResultsContainer(carTypeResults);
        return;
    }
    updateModelResults(query);
});
infoBtn?.addEventListener('click', showInfoView);
homeBtn?.addEventListener('click', showCalculatorView);
backToCalculatorBtn?.addEventListener('click', showCalculatorView);
closeInfoViewBtn?.addEventListener('click', showCalculatorView);
mobileMenuToggle?.addEventListener('click', toggleSettingsMenu);
closeSettingsMenuBtn?.addEventListener('click', closeSettingsMenu);
mobileMenuBackdrop?.addEventListener('click', closeSettingsMenu);
favoritesBtn?.addEventListener('click', openFavorites);
closeFavoritesBtn?.addEventListener('click', closeFavorites);
saveFavoriteBtn?.addEventListener('click', saveCurrentToFavorites);
copySummaryBtn?.addEventListener('click', copyTripSummary);
companionsBtn?.addEventListener('click', openCompanions);
friendRequestsBtn?.addEventListener('click', openFriendRequestsView);
friendsBtn?.addEventListener('click', openFriendsView);
closeFriendRequestsBtn?.addEventListener('click', closeFriendRequestsView);
closeFriendsBtn?.addEventListener('click', closeFriendsView);
closeCompanionsBtn?.addEventListener('click', closeCompanions);
addCompanionBtn?.addEventListener('click', addCompanion);
saveCompanionTripBtn?.addEventListener('click', saveCompanionTrip);
completedTripCheckbox?.addEventListener('change', syncCompletedFlag);
companionNameInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addCompanion();
    }
});
budgetBtn?.addEventListener('click', openBudget);
closeBudgetBtn?.addEventListener('click', closeBudget);
myCarBtn?.addEventListener('click', openMyCar);
closeMyCarBtn?.addEventListener('click', closeMyCar);
myCarBrandSelect?.addEventListener('change', async () => {
    const brandKey = (myCarBrandSelect.value || '').replace(/^brand-/, '').trim().toLowerCase();
    await populateMyCarModelOptions(brandKey);
    updateMyCarPreview();
});
myCarModelSelect?.addEventListener('change', updateMyCarPreview);
myCarUploadBtn?.addEventListener('click', () => {
    openMyCarConsent();
});
acceptMyCarConsentBtn?.addEventListener('click', () => {
    closeMyCarConsent();
    myCarUploadInput?.click();
});
cancelMyCarConsentBtn?.addEventListener('click', closeMyCarConsent);
closeMyCarConsentBtn?.addEventListener('click', closeMyCarConsent);
myCarUploadInput?.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    await handleMyCarPhotoSelected(file);
    e.target.value = '';
});
myCarRemoveBtn?.addEventListener('click', removeMyCarPhoto);
useLocationBtn?.addEventListener('click', async () => {
    if (!navigator.geolocation) {
        if (myCarUploadStatus) myCarUploadStatus.textContent = '';
        showError('❌ Geolocalizzazione non supportata dal browser.');
        return;
    }
    hideError();
    useLocationBtn.disabled = true;
    useLocationBtn.textContent = '📡 Posizione in corso...';
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        lastUserLocation = { lat, lng };
        await renderUserLocationOnMap();
        const details = await reverseGeocodeNominatimDetailed(lat, lng).catch(() => null);
        const city = details?.city || await resolveCityFromCoordinates(lat, lng);
        const fullAddress = details?.fullAddress || city || 'Posizione attuale';

        if (departureAddressInput) {
            departureAddressInput.value = fullAddress;
            departureAddressInput.dataset.kind = 'address';
            departureAddressInput.dataset.city = city || '';
            departureAddressInput.dataset.lat = String(lat);
            departureAddressInput.dataset.lng = String(lng);
        }
        if (departureSelect && city) {
            const match = findCityOptionByName(city);
            departureSelect.value = match ? match.value : '';
        }
        if (!details?.fullAddress) {
            showError('⚠️ Posizione rilevata. Via non disponibile: uso città/coordinate.');
        }
        useLocationBtn.disabled = false;
        useLocationBtn.textContent = '📡 Usa la mia posizione';
    }, (err) => {
        if (err && err.code === 1) {
            showError('❌ Permesso geolocalizzazione negato.');
        } else if (err && err.code === 2) {
            showError('❌ Posizione non disponibile. Attiva GPS o rete.');
        } else if (err && err.code === 3) {
            showError('❌ Timeout nel recupero posizione. Riprova.');
        } else {
            showError('❌ Errore geolocalizzazione.');
        }
        useLocationBtn.disabled = false;
        useLocationBtn.textContent = '📡 Usa la mia posizione';
    }, { enableHighAccuracy: true, timeout: 10000 });
});
accountBtn?.addEventListener('click', openAuth);
closeAuthBtn?.addEventListener('click', closeAuth);
loginBtn?.addEventListener('click', () => handleAuth(false));
registerBtn?.addEventListener('click', () => handleAuth(true));
logoutBtn?.addEventListener('click', () => {
    clearAuth().then(() => {
        updateAuthUI('Disconnesso');
        setAuthFeedback('Disconnessione completata', 'info');
    });
});
accountSaveProfileBtn?.addEventListener('click', saveAccountProfile);
accountAvatarUploadBtn?.addEventListener('click', () => accountAvatarInput?.click());
accountAvatarInput?.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    await handleAccountAvatarSelected(file);
    e.target.value = '';
});
accountAvatarRemoveBtn?.addEventListener('click', removeAccountAvatar);
accountChangePasswordBtn?.addEventListener('click', changeAccountPassword);
sendFriendRequestBtn?.addEventListener('click', sendFriendRequest);
friendSearchInput?.addEventListener('input', (e) => {
    if (friendSearchTimer) {
        clearTimeout(friendSearchTimer);
        friendSearchTimer = null;
    }
    const value = (e.target.value || '').trim();
    if (!authToken || value.length < 2) {
        clearFriendSearchResults();
        return;
    }
    friendSearchTimer = setTimeout(() => {
        fetchFriendSearchSuggestions(value);
    }, 220);
});
friendSearchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendFriendRequest();
    }
});
shareFavoritesToggle?.addEventListener('change', saveShareSettings);
shareMyCarToggle?.addEventListener('change', saveShareSettings);
shareCompanionsToggle?.addEventListener('change', saveShareSettings);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.body.classList.contains('mobile-menu-open')) {
            closeSettingsMenu();
        }
        if (infoPage && infoPage.style.display === 'block') {
            showCalculatorView();
        }
        if (imagePreviewOverlay && imagePreviewOverlay.style.display === 'flex') {
            closeImagePreview();
        }
        if (favoritesOverlay && favoritesOverlay.style.display === 'flex') {
            closeFavorites();
        }
        if (companionsOverlay && companionsOverlay.style.display === 'flex') {
            closeCompanions();
        }
        if (budgetOverlay && budgetOverlay.style.display === 'flex') {
            closeBudget();
        }
        if (myCarOverlay && myCarOverlay.style.display === 'flex') {
            closeMyCar();
        }
        if (myCarConsentOverlay && myCarConsentOverlay.style.display === 'flex') {
            closeMyCarConsent();
        }
        if (authOverlay && authOverlay.style.display === 'flex') {
            closeAuth();
        }
        if (friendRequestsOverlay && friendRequestsOverlay.style.display === 'flex') {
            closeFriendRequestsView();
        }
        if (friendsOverlay && friendsOverlay.style.display === 'flex') {
            closeFriendsView();
        }
    }
});

document.addEventListener('click', (e) => {
    if (carBrandResults && carBrandSearchInput && !carBrandResults.contains(e.target) && e.target !== carBrandSearchInput) {
        clearResultsContainer(carBrandResults);
    }
    if (carTypeResults && carTypeSearchInput && !carTypeResults.contains(e.target) && e.target !== carTypeSearchInput) {
        clearResultsContainer(carTypeResults);
    }
    if (departureAddressResults && departureAddressInput && !departureAddressResults.contains(e.target) && e.target !== departureAddressInput) {
        clearResultsContainer(departureAddressResults);
    }
    if (arrivalAddressResults && arrivalAddressInput && !arrivalAddressResults.contains(e.target) && e.target !== arrivalAddressInput) {
        clearResultsContainer(arrivalAddressResults);
    }
    if (friendSearchResults && friendSearchInput && !friendSearchResults.contains(e.target) && e.target !== friendSearchInput) {
        clearResultsContainer(friendSearchResults);
    }
});

// Enter per calcolare
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const tagName = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || e.target?.isContentEditable) {
            return;
        }
        calculateTrip().catch(err => {
            console.error(err);
            showError('❌ Si è verificato un errore durante il calcolo. Riprova.');
        });
    }
});

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', async () => {
    closeSettingsMenu();
    syncSettingsMenuCloseVisibility();
    window.addEventListener('resize', () => {
        syncSettingsMenuCloseVisibility();
        if (!window.matchMedia('(max-width: 768px)').matches) {
            closeSettingsMenu();
        }
    });
    initializeCities();
    const mapSection = document.getElementById('mapSection');
    if (mapSection) mapSection.style.display = 'none';
    setupAddressAutocomplete(departureAddressInput, departureAddressResults, departureSelect);
    setupAddressAutocomplete(arrivalAddressInput, arrivalAddressResults, arrivalSelect);
    await loadCarModelsFromJson();
    tagModelOptionsByBrand();
    snapshotCarOptionsStructure();
    snapshotBrandOptions();
    await filterModelsByBrand();
    updateMyCarPreview();
    updateAuthUI();
    const hasSession = await restoreAuthSession();
    if (hasSession || isAuthenticated()) {
        try {
            await loadAllRemoteData();
        } catch (e) {
            updateAuthUI('Token non valido, rifai login');
            await clearAuth({ remote: false });
            await loadFavorites();
            await loadCompanionTrips();
            await loadCompletedTrips();
        }
    } else {
        await loadFavorites();
        await loadCompanionTrips();
        await loadCompletedTrips();
    }
    showCalculatorView();
});
