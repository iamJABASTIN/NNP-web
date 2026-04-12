import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfweuakxeakppgvjmpxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd2V1YWt4ZWFrcHBndmptcHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDc1NjksImV4cCI6MjA5MDE4MzU2OX0.zt24NZZJ5qfi_qcodEEPTz15Jqe4UiREU2eYhsJx6gU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Checking orders columns...');
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in orders:', Object.keys(data[0]));
  } else {
    console.log('Orders table is empty, trying to get columns from RPC if possible...');
    // Fallback: search for any mention of order statuses in the codebase
  }
  process.exit();
}

main();
