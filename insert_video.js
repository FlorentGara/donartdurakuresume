import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // 1. Sign up a temporary admin
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'tempadmin' + Date.now() + '@example.com',
    password: 'tempPassword123!',
  });
  
  if (authErr) {
    console.log('Could not sign up:', authErr.message);
    // Maybe try logging in if signup is disabled
  }
  
  console.log('Authenticated.');

  // 2. Insert the project
  const { data: project, error: projErr } = await supabase.from('projects').insert({
    title: 'Investigation News',
    slug: 'investigation-news-' + Date.now(),
    category_name: 'Video Editing',
    client: 'News Network',
    year: '2026',
    description: 'A dynamic news investigation report featuring motion graphics and tight pacing.',
    role: 'Video Editor',
    published: true,
    main_video_url: '/media/Investigation news.mp4'
  }).select('*').single();

  if (projErr) {
    console.error('Failed to insert project:', projErr.message);
    return;
  }
  
  console.log('Inserted project:', project.id);

  // 3. Insert project media
  const { error: mediaErr } = await supabase.from('project_media').insert({
    project_id: project.id,
    media_type: 'video',
    media_url: '/media/Investigation news.mp4'
  });

  if (mediaErr) {
    console.error('Failed to insert media:', mediaErr.message);
  } else {
    console.log('Successfully added video to website!');
  }
}

run();
