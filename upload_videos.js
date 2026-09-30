import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const sourceDir = 'C:\\Users\\PC\\Downloads\\donart videos';

const supabaseUrl = 'https://eawamfswxtojvudaiiin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhd2FtZnN3eHRvanZ1ZGFpaWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTMzOTIsImV4cCI6MjEwNTk4OTM5Mn0.sJpgvmMybdqXvgBlWb1lfN3MUVFDzS5eoT_JHgjS-Cw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.mp4'));
  console.log(`Found ${files.length} videos to upload to Supabase Storage...`);
  
  for (const file of files) {
    const cleanName = file.toLowerCase().replace(/[^a-z0-9.]/g, '_');
    const sourcePath = path.join(sourceDir, file);
    
    console.log(`Reading ${file} (${(fs.statSync(sourcePath).size / 1024 / 1024).toFixed(2)} MB)...`);
    const fileBuffer = fs.readFileSync(sourcePath);
    
    console.log(`Uploading ${cleanName} to Supabase...`);
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(cleanName, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });
      
    if (uploadError) {
      console.error(`Failed to upload ${cleanName}:`, uploadError.message);
      continue;
    }
    
    console.log(`Successfully uploaded! Updating database...`);
    
    const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(cleanName);
    const publicUrl = publicUrlData.publicUrl;
    
    // Update the corresponding project in the database to use the new public URL instead of the local one
    const { error: updateError } = await supabase
      .from('projects')
      .update({ main_video_url: publicUrl })
      .like('main_video_url', `%${cleanName}%`);
      
    if (updateError) {
      console.error(`Failed to update DB for ${cleanName}:`, updateError.message);
    }
  }
  
  console.log('Done uploading all videos and updating database!');
}

run().catch(console.error);
