-- Run after 001, 002 and 003. Only users listed in private.admin_users
-- may use the CMS or write to its storage buckets.
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM private.admin_users
    WHERE user_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Replace the original CMS policies, which allowed every signed-in user.
DO $$
DECLARE policy record;
DECLARE condition text;
BEGIN
  FOR policy IN
    SELECT tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'hero_settings', 'career_entries', 'education_entries',
        'project_categories', 'projects', 'project_media', 'services',
        'skills', 'process_steps', 'social_links', 'site_settings',
        'seo_settings', 'contact_messages', 'media_assets'
      )
      AND policyname LIKE 'admin_%'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', policy.policyname, policy.tablename);
    condition := CASE policy.cmd
      WHEN 'INSERT' THEN 'WITH CHECK ((SELECT public.is_admin()))'
      WHEN 'UPDATE' THEN 'USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))'
      ELSE 'USING ((SELECT public.is_admin()))'
    END;
    EXECUTE format('CREATE POLICY %I ON public.%I FOR %s TO authenticated %s',
      policy.policyname, policy.tablename, policy.cmd, condition);
  END LOOP;
END;
$$;

-- Admins must also be able to see draft and disabled content in the CMS.
DO $$
DECLARE content_table text;
BEGIN
  FOREACH content_table IN ARRAY ARRAY[
    'career_entries', 'education_entries', 'projects', 'project_media',
    'services', 'skills', 'process_steps', 'social_links'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I',
      'admin_read_' || content_table, content_table);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING ((SELECT public.is_admin()))',
      'admin_read_' || content_table, content_table);
  END LOOP;
END;
$$;

-- Replace the storage write policies. Public reads remain available.
DROP POLICY IF EXISTS "Auth upload images" ON storage.objects;
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth update images" ON storage.objects;
CREATE POLICY "Auth update images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'images' AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id = 'images' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth delete images" ON storage.objects;
CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Auth upload videos" ON storage.objects;
CREATE POLICY "Auth upload videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth update videos" ON storage.objects;
CREATE POLICY "Auth update videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'videos' AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id = 'videos' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth delete videos" ON storage.objects;
CREATE POLICY "Auth delete videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Auth upload documents" ON storage.objects;
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth update documents" ON storage.objects;
CREATE POLICY "Auth update documents" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'documents' AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id = 'documents' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Auth delete documents" ON storage.objects;
CREATE POLICY "Auth delete documents" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents' AND (SELECT public.is_admin()));
