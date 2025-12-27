export async function fetchRevolutRates() {
  console.log('🧪 Using mock Revolut rates');

  return [
    {
      provider_id: 'revolut',
      from_currency: 'GBP',
      to_currency: 'EUR',
      rate: 1.105,
      fee: 1.0,
      fetched_at: new Date().toISOString(),
      source: 'revolut',
    },
    {
      provider_id: 'revolut',
      from_currency: 'GBP',
      to_currency: 'USD',
      rate: 1.255,
      fee: 1.2,
      fetched_at: new Date().toISOString(),
      source: 'revolut',
    },
  ];
}
