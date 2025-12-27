import { fetchAllRates } from './fetchAllRates';

console.log('🔥 ENTRY FILE LOADED');

async function run() {
  console.log('🚀 Rate fetcher started');

  try {
    await fetchAllRates();
    console.log('✅ Rate fetcher finished');
  } catch (err) {
    console.error('❌ Rate fetcher error:', err);
  }
}

run();
