export async function fetchRates(base: string) {
  const API_KEY = 'YOUR_FIXER_API_KEY';
  const url = `https://data.fixer.io/api/latest?access_key=${API_KEY}&base=${base}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || 'Failed to fetch rates');
    }

    return data.rates; // { USD: 1.12, GBP: 0.85, ... }
  } catch (error) {
    console.error('Fetch rates error:', error);
    return null;
  }
}
