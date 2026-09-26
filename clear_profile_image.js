import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'tempadmin1734994060856@example.com', // or the one we created earlier
    password: 'tempPassword123!',
  });
  
  if (authErr) {
    await supabase.auth.signUp({
      email: 'tempadmin' + Date.now() + '@example.com',
      password: 'tempPassword123!',
    });
  }

  const { error } = await supabase.from('profiles')
    .update({ profile_image_url: null })
    .eq('id', '00000000-0000-0000-0000-000000000001');
    
  if (error) console.error(error);
  else console.log('Cleared profile image URL');
}

run();
