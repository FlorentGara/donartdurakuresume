/*
# Storage Buckets for Media Library

## Overview
Creates three Supabase Storage buckets for the portfolio CMS media library:
1. **images** — Profile images, project thumbnails, gallery images, posters
2. **videos** — Project videos, hero background videos
3. **documents** — CV/Resume PDFs and other documents

## Security
- Public read access for all buckets (visitors need to see images/videos on the website)
- Only authenticated users can upload, update, or delete files
- File size limits enforced at the application level

## Notes
- Buckets are created as public so website visitors can view media
- Upload/delete is restricted to authenticated admins via RLS storage policies
*/

INSERT INTO storage.buckets (id, name, public) VALUES
('images', 'images', true),
('videos', 'videos', true),
('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
-- Images bucket
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
CREATE POLICY "Public read images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Auth upload images" ON storage.objects;
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Auth update images" ON storage.objects;
CREATE POLICY "Auth update images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Auth delete images" ON storage.objects;
CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images');

-- Videos bucket
DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
CREATE POLICY "Public read videos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Auth upload videos" ON storage.objects;
CREATE POLICY "Auth upload videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Auth update videos" ON storage.objects;
CREATE POLICY "Auth update videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Auth delete videos" ON storage.objects;
CREATE POLICY "Auth delete videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos');

-- Documents bucket
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Auth upload documents" ON storage.objects;
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Auth update documents" ON storage.objects;
CREATE POLICY "Auth update documents" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Auth delete documents" ON storage.objects;
CREATE POLICY "Auth delete documents" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents');
