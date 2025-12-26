// utils/fxApi.ts
export async function fetchLiveRates(base: string) {
  try {
    // Using a free FX API endpoint (for testing)
    // Replace with your preferred API or a paid API key if needed
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
    const data = await res.json();

    // Returns rates as { USD: 1.2, EUR: 1.1, ... }
    return data.rates;
  } catch (error) {
    console.error('Error fetching FX rates:', error);
    return {};
  }
}
