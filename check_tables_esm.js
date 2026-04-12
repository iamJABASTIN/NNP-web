import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfweuakxeakppgvjmpxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd2V1YWt4ZWFrcHBndmptcHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDc1NjksImV4cCI6MjA5MDE4MzU2OX0.zt24NZZJ5qfi_qcodEEPTz15Jqe4UiREU2eYhsJx6gU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data, error } = await supabase
    .from('tables')
    .select('*');
  
  if (error) {
    console.error('Error fetching tables:', error);
  } else {
    console.log('Tables in DB:', JSON.stringify(data, null, 2));
  }
}

checkTables();
