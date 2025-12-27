import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const USE_LIVE = process.env.USE_LIVE_WISE === 'true';

type WiseApiRate = {
  source: string;
  target: string;
  rate: number;
  fee?: number;
};

export async function fetchWiseRates() {
  if (!USE_LIVE) {
    console.log('🧪 Using mock Wise rates');

    const mockPath = path.resolve(__dirname, 'mocks/wise.json');
    const raw = fs.readFileSync(mockPath, 'utf-8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Mock Wise data is not an array');
    }

    return parsed.map((r: WiseApiRate) => ({
      provider_id: 'wise',
      from_currency: r.source,
      to_currency: r.target,
      rate: r.rate,
      fee: r.fee ?? 0,
      fetched_at: new Date().toISOString(),
      source: 'wise',
    }));
  }

  console.log('🌍 Calling Wise API...');

  const apiKey = process.env.WISE_API_KEY;
  if (!apiKey) throw new Error('Missing WISE_API_KEY in environment');

  const res = await fetch('https://api.wise.com/v1/rates?source=GBP', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Wise API failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as unknown;

  if (!Array.isArray(json)) {
    throw new Error('Wise API response is not an array');
  }

  const data = json as WiseApiRate[];

  console.log(`📥 Wise returned ${data.length} items`);

  return data.map((r) => ({
    provider_id: 'wise',
    from_currency: r.source,
    to_currency: r.target,
    rate: r.rate,
    fee: r.fee ?? 0,
    fetched_at: new Date().toISOString(),
    source: 'wise',
  }));
}
