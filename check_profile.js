import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data } = await supabase.from('profiles').select('*').single();
  console.log('Profile:', data);
}

run();
