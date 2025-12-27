// rate-fetcher/fetchAllRates.ts
import { fetchRevolutRates } from './fetchRevolut';
import { fetchWiseRates } from './fetchWise';
import { supabase } from './supabase';

async function runFetcher() {
  console.log("=== Starting Forex Rate Fetcher ===");

  try {
    // Fetch rates from Wise
    console.log("Fetching rates from Wise...");
    const wiseRates = await fetchWiseRates();
    console.log(`Fetched ${wiseRates.length} rates from Wise.`);

    // Fetch rates from Revolut
    console.log("Fetching rates from Revolut...");
    const revolutRates = await fetchRevolutRates();
    console.log(`Fetched ${revolutRates.length} rates from Revolut.`);

    // Combine all rates
    const allRates = [...wiseRates, ...revolutRates];

    // Insert into Supabase
    console.log(`Inserting ${allRates.length} rates into Supabase...`);
    const { data, error } = await supabase
      .from('rates')
      .insert(allRates)
      .select();

    if (error) {
      console.error("Error inserting rates into Supabase:", error);
    } else {
      console.log(`Successfully inserted ${data.length} rates into Supabase.`);
    }

    console.log("=== Forex Rate Fetcher Completed Successfully ===");
  } catch (err) {
    console.error("Unexpected error in rate fetcher:", err);
    process.exit(1); // exit with error for GitHub Actions
  }
}

runFetcher();
