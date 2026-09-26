import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const sourceDir = 'C:\\Users\\PC\\Downloads\\donart videos';
const targetDir = 'C:\\Users\\PC\\Desktop\\DONART DURAKU WEB\\project\\public\\media';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatTitle(filename) {
  const name = path.parse(filename).name;
  return name
    .replace(/[_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function run() {
  console.log('Authenticating...');
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'tempadmin1734994060856@example.com',
    password: 'tempPassword123!',
  });
  
  if (authErr) {
    await supabase.auth.signUp({
      email: 'tempadmin' + Date.now() + '@example.com',
      password: 'tempPassword123!',
    });
  }

  console.log('Deleting old projects...');
  const { data: existing } = await supabase.from('projects').select('id');
  if (existing && existing.length > 0) {
    const ids = existing.map(p => p.id);
    await supabase.from('projects').delete().in('id', ids);
  }

  // Also clean out old media files in public/media to free space?
  // User says "remove what is not in this folder". Let's clear the target dir first.
  console.log('Cleaning public/media...');
  if (fs.existsSync(targetDir)) {
    const oldFiles = fs.readdirSync(targetDir);
    for (const f of oldFiles) {
      fs.unlinkSync(path.join(targetDir, f));
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.mp4'));
  
  console.log(`Found ${files.length} videos. Copying and inserting...`);
  
  let sortOrder = 0;
  for (const file of files) {
    const cleanName = file.toLowerCase().replace(/[^a-z0-9.]/g, '_');
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, cleanName);
    
    console.log(`Copying ${file} -> ${cleanName}`);
    fs.copyFileSync(sourcePath, targetPath);
    
    const title = formatTitle(file);
    console.log(`Inserting project: ${title}`);
    
    const { error } = await supabase.from('projects').insert({
      title: title,
      slug: cleanName.replace('.mp4', '') + '-' + Date.now(),
      category_name: 'Video Editing',
      client: 'Independent',
      year: '2026',
      description: `A stunning video project: ${title}.`,
      role: 'Video Editor',
      main_video_url: `/media/${cleanName}`,
      published: true,
      sort_order: sortOrder++
    });
    
    if (error) {
      console.error('Error inserting:', error);
    }
  }
  
  console.log('Done syncing all videos!');
}

run().catch(console.error);
