const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zfweuakxeakppgvjmpxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd2V1YWt4ZWFrcHBndmptcHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDc1NjksImV4cCI6MjA5MDE4MzU2OX0.zt24NZZJ5qfi_qcodEEPTz15Jqe4UiREU2eYhsJx6gU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Querying tables...');
  try {
    const { data: tablesRaw, error: tablesError } = await supabase.from('tables').select('*');
    if (tablesError) {
      console.error('Tables Error:', tablesError);
    } else {
      console.log('Tables Data:', JSON.stringify(tablesRaw, null, 2));
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
  process.exit();
}

main();
