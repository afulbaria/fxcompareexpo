import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env immediately when this module is imported
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey);
  throw new Error('Missing Supabase env variables');
}

export const supabase = createClient(supabaseUrl, serviceRoleKey);
