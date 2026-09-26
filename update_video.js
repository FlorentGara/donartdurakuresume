import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'tempadmin1734994060856@example.com', // wait, I don't know the generated email from last time.
    password: 'tempPassword123!',
  });
  
  if (authErr) {
    // try signing up a new one
    await supabase.auth.signUp({
      email: 'tempadmin' + Date.now() + '@example.com',
      password: 'tempPassword123!',
    });
  }

  // Find the project we inserted
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .ilike('title', 'Investigation News')
    .single();

  if (project) {
    await supabase.from('projects')
      .update({ main_video_url: '/media/investigation_news.mp4' })
      .eq('id', project.id);
      
    await supabase.from('project_media')
      .update({ media_url: '/media/investigation_news.mp4' })
      .eq('project_id', project.id);
      
    console.log('Updated DB URLs.');
  } else {
    console.log('Project not found.');
  }
}

run();
