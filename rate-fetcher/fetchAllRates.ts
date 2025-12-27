import { fetchRevolutRates } from './fetchRevolut';
import { fetchWiseRates } from './fetchWise';
import { supabase } from './supabase';

export interface Rate {
  provider_id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  fetched_at: string;
  fetched_date: string;
}

type RawRate = {
  provider_id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  fetched_at: string;
  fee?: number;
  source?: string;
};

function normalizeRate(r: RawRate): Rate {
  return {
    provider_id: r.provider_id,
    from_currency: r.from_currency,
    to_currency: r.to_currency,
    rate: r.rate,
    fetched_at: r.fetched_at,
    fetched_date: r.fetched_at.slice(0, 10), // YYYY-MM-DD
  };
}

export async function fetchAllRates() {
  console.log('📡 fetchAllRates() started');

  const allRates: Rate[] = [];

  try {
    console.log('Fetching Wise rates...');
    const wiseRaw = await fetchWiseRates();
    console.log(`Received ${wiseRaw.length} Wise rates`);
    allRates.push(...wiseRaw.map(normalizeRate));
  } catch (err) {
    console.error('❌ Wise fetch failed:', err);
  }

  try {
    console.log('Fetching Revolut rates...');
    const revolutRaw = await fetchRevolutRates();
    console.log(`Received ${revolutRaw.length} Revolut rates`);
    allRates.push(...revolutRaw.map(normalizeRate));
  } catch (err) {
    console.error('❌ Revolut fetch failed:', err);
  }

  if (allRates.length === 0) {
    console.warn('⚠️ No rates fetched, aborting insert');
    return;
  }

  console.log(`💾 Writing ${allRates.length} rates to Supabase...`);

  const { error } = await supabase
    .from('rates')
    .upsert(allRates, {
      onConflict: 'provider_id,from_currency,to_currency,fetched_date',
    });

  if (error) {
    console.error('❌ Supabase upsert error:', error.message);
  } else {
    console.log(`✅ Upserted ${allRates.length} rates into Supabase`);
  }

  console.log('📡 fetchAllRates() finished');
}
