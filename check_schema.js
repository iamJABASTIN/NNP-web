const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zfweuakxeakppgvjmpxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd2V1YWt4ZWFrcHBndmptcHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDc1NjksImV4cCI6MjA5MDE4MzU2OX0.zt24NZZJ5qfi_qcodEEPTz15Jqe4UiREU2eYhsJx6gU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Checking table_sessions schema...');
  const { data, error } = await supabase.from('table_sessions').select('*').limit(1);
  if (error) console.error('Error:', error);
  else console.log('Sample table_session:', JSON.stringify(data?.[0], null, 2));

  console.log('Checking orders schema...');
  const { data: orderData, error: orderError } = await supabase.from('orders').select('*').limit(1);
  if (orderError) console.error('Error:', orderError);
  else console.log('Sample order:', JSON.stringify(orderData?.[0], null, 2));

  process.exit();
}

main();
