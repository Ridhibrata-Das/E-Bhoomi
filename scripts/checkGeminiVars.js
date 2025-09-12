// Simple node script to verify the data that GeminiWebSocket's system prompt expects
// Run: node scripts/checkGeminiVars.js

const THINGSPEAK_CHANNEL_ID = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || process.env.THINGSPEAK_CHANNEL_ID || '2647422';
const THINGSPEAK_API_KEY = process.env.NEXT_PUBLIC_THINGSPEAK_READ_API_KEY || process.env.THINGSPEAK_API_KEY || '1IND2YTTTRS3WCNY';

const DEFAULT_LAT = 22.5626;
const DEFAULT_LON = 88.363;
const RANGE = '24h';

function getResultCount(range) {
  const counts = { '1h': 60, '24h': 144, '7d': 168, '30d': 720, '1y': 8760 };
  return counts[range] || 144;
}

function parseNum(v, fb = 0) {
  if (v == null) return fb;
  const s = String(v).trim();
  if (s === '') return fb;
  const n = parseFloat(s);
  return Number.isNaN(n) ? fb : n;
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = await res.json();
  return {
    temperature: data.current?.temperature_2m ?? 0,
    humidity: data.current?.relative_humidity_2m ?? 0,
    time: data.current?.time ?? new Date().toISOString()
  };
}

async function fetchThingSpeak(range) {
  const results = getResultCount(range);
  const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=${results}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`thingspeak ${res.status}`);
  const data = await res.json();
  return data.feeds || [];
}

async function main() {
  try {
    const [weather, feeds] = await Promise.all([
      fetchWeather(DEFAULT_LAT, DEFAULT_LON),
      fetchThingSpeak(RANGE)
    ]);

    const latest = feeds[feeds.length - 1] || {};
    const soilMoisture = parseNum(latest.field1);
    const nitrogen = parseNum(latest.field4);
    const phosphorus = parseNum(latest.field5);
    const potassium = parseNum(latest.field6);
    const npkAverage = (nitrogen + phosphorus + potassium) / 3;

    const output = {
      locationName: `Coordinates: ${DEFAULT_LAT.toFixed(6)}°, ${DEFAULT_LON.toFixed(6)}°`,
      temperature: weather.temperature,
      humidity: weather.humidity,
      soilMoisture,
      npkNitrogen: nitrogen,
      npkPhosphorus: phosphorus,
      npkPotassium: potassium,
      npkAverage
    };

    console.log('Balaram AI variables snapshot:\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('checkBalaramAIVars failed:', err?.message || err);
    process.exit(1);
  }
}

main();


