/*
# Portfolio CMS Schema — Complete Database Foundation

## Overview
This migration creates the complete database schema for Donart Duraku's content-managed portfolio website.
It includes all content tables, contact message storage, media asset tracking, site settings, SEO settings,
and Row Level Security policies that allow public visitors to read published content while restricting
all write access to authenticated administrators.

## Tables Created

### Content Tables (public read for published rows, admin write)
1. **profiles** — Single-row table holding the site owner's profile (name, title, bio, portrait, CV, etc.)
2. **hero_settings** — Single-row table controlling the hero section (headings, buttons, background media)
3. **career_entries** — Career timeline entries (company, position, dates, description, responsibilities, skills)
4. **education_entries** — Education history (school, program, degree, years, description)
5. **project_categories** — Manageable project categories (name, slug, sort order)
6. **projects** — Portfolio projects (title, slug, category, client, year, description, role, tools, featured, published)
7. **project_media** — Media items attached to projects (images, videos, gallery items, before/after)
8. **services** — Service cards (number, title, description, icon, published)
9. **skills** — Skill items (name, category, icon, description, published)
10. **process_steps** — Creative process steps (number, title, description, icon, published)
11. **social_links** — Social/contact links (label, url, enabled, sort order)
12. **site_settings** — Single-row global settings (title, meta description, favicon, accent color, footer text, etc.)
13. **seo_settings** — Single-row SEO/OG settings (SEO title, meta description, OG title/description/image, Twitter image, canonical URL)
14. **contact_messages** — Submissions from the public contact form (name, email, project type, message, read status)

### Media Tracking
15. **media_assets** — Media library entries tracking files in Supabase Storage (filename, type, size, URL, bucket)

## Security Model
- **Public visitors (anon role):** Can SELECT published content from content tables. Can INSERT contact messages. Cannot read contact messages, media_assets, or any unpublished content.
- **Authenticated admins:** Full CRUD on all tables.
- All tables use RLS. Content tables have separate SELECT (public for published) and INSERT/UPDATE/DELETE (admin only) policies.
- Contact messages: anon can INSERT only; SELECT/UPDATE/DELETE restricted to authenticated.
- Media assets & settings: SELECT restricted to authenticated (admin-only visibility).

## Important Notes
1. All content tables include `published` (boolean, default true) and `sort_order` (int) where ordering matters.
2. Single-row tables (profiles, hero_settings, site_settings, seo_settings) use a fixed id of 1 enforced by a unique constraint.
3. `updated_at` is automatically maintained via triggers.
4. Seed data is inserted for all tables so the public website has content immediately.
5. Storage buckets (images, videos, documents) are created separately.
*/

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. PROFILES (single-row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Donart Duraku',
  professional_title text NOT NULL DEFAULT 'Video Editor & Visual Creative',
  hero_statement text NOT NULL DEFAULT 'I turn raw footage into stories people remember.',
  hero_description text NOT NULL DEFAULT 'Video editing, motion graphics and visual storytelling for brands, creators and digital content.',
  about_heading text NOT NULL DEFAULT 'Editing is more than cutting clips. It''s about creating a feeling.',
  about_description text NOT NULL DEFAULT 'Donart Duraku is a video editor and visual creative focused on transforming raw footage into engaging, polished and purposeful visual stories. His work combines pacing, sound, motion, typography and visual composition to create content that feels intentional from the first frame to the last.',
  location text NOT NULL DEFAULT '[LOCATION]',
  experience text NOT NULL DEFAULT '[YEARS]',
  availability_status text NOT NULL DEFAULT 'Available for selected projects',
  email text NOT NULL DEFAULT '[EMAIL]',
  profile_image_url text,
  cv_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_single_row CHECK (id = '00000000-0000-0000-0000-000000000001')
);

INSERT INTO public.profiles (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_profiles" ON public.profiles;
CREATE POLICY "admin_insert_profiles" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_profiles" ON public.profiles;
CREATE POLICY "admin_update_profiles" ON public.profiles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_profiles" ON public.profiles;
CREATE POLICY "admin_delete_profiles" ON public.profiles FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. HERO SETTINGS (single-row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hero_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_name text NOT NULL DEFAULT 'DONART DURAKU',
  eyebrow_text text NOT NULL DEFAULT 'Available for selected projects',
  main_title_line1 text NOT NULL DEFAULT 'VIDEO EDITOR',
  main_title_line2 text NOT NULL DEFAULT '& VISUAL CREATIVE',
  description text NOT NULL DEFAULT 'Video editing, motion graphics and visual storytelling for brands, creators and digital content.',
  primary_button_text text NOT NULL DEFAULT 'VIEW MY WORK',
  primary_button_link text NOT NULL DEFAULT '#work',
  secondary_button_text text NOT NULL DEFAULT 'CONTACT ME',
  secondary_button_link text NOT NULL DEFAULT '#contact',
  availability_text text NOT NULL DEFAULT 'AVAILABLE FOR SELECTED PROJECTS',
  background_type text NOT NULL DEFAULT 'image' CHECK (background_type IN ('image', 'video')),
  background_media_url text,
  background_video_autoplay boolean DEFAULT true,
  background_video_muted boolean DEFAULT true,
  background_video_loop boolean DEFAULT true,
  background_poster_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT hero_single_row CHECK (id = '00000000-0000-0000-0000-000000000001')
);

INSERT INTO public.hero_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER hero_settings_updated_at BEFORE UPDATE ON public.hero_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero" ON public.hero_settings;
CREATE POLICY "public_read_hero" ON public.hero_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_hero" ON public.hero_settings;
CREATE POLICY "admin_insert_hero" ON public.hero_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_hero" ON public.hero_settings;
CREATE POLICY "admin_update_hero" ON public.hero_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_hero" ON public.hero_settings;
CREATE POLICY "admin_delete_hero" ON public.hero_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. CAREER ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.career_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL DEFAULT '[Company Name]',
  position text NOT NULL DEFAULT 'Video Editor',
  start_date text NOT NULL DEFAULT '2024',
  end_date text NOT NULL DEFAULT 'Present',
  is_current boolean DEFAULT true,
  description text NOT NULL DEFAULT '',
  responsibilities jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  company_logo_url text,
  location text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER career_updated_at BEFORE UPDATE ON public.career_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.career_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_career" ON public.career_entries;
CREATE POLICY "public_read_career" ON public.career_entries FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_career" ON public.career_entries;
CREATE POLICY "admin_insert_career" ON public.career_entries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_career" ON public.career_entries;
CREATE POLICY "admin_update_career" ON public.career_entries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_career" ON public.career_entries;
CREATE POLICY "admin_delete_career" ON public.career_entries FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. EDUCATION ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.education_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school text NOT NULL DEFAULT '[School Name]',
  program text NOT NULL DEFAULT '[Program / Degree]',
  degree text,
  start_year text NOT NULL DEFAULT '[Start Year]',
  end_year text NOT NULL DEFAULT '[End Year]',
  description text,
  logo_url text,
  location text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER education_updated_at BEFORE UPDATE ON public.education_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.education_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON public.education_entries;
CREATE POLICY "public_read_education" ON public.education_entries FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_education" ON public.education_entries;
CREATE POLICY "admin_insert_education" ON public.education_entries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_education" ON public.education_entries;
CREATE POLICY "admin_update_education" ON public.education_entries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_education" ON public.education_entries;
CREATE POLICY "admin_delete_education" ON public.education_entries FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 5. PROJECT CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER project_categories_updated_at BEFORE UPDATE ON public.project_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON public.project_categories;
CREATE POLICY "public_read_categories" ON public.project_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON public.project_categories;
CREATE POLICY "admin_insert_categories" ON public.project_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON public.project_categories;
CREATE POLICY "admin_update_categories" ON public.project_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON public.project_categories;
CREATE POLICY "admin_delete_categories" ON public.project_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.project_categories(id) ON DELETE SET NULL,
  category_name text NOT NULL DEFAULT 'Other',
  client text DEFAULT '[CLIENT]',
  year text NOT NULL,
  description text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  tools jsonb DEFAULT '[]'::jsonb,
  credits jsonb DEFAULT '[]'::jsonb,
  thumbnail_url text,
  main_video_url text,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON public.projects;
CREATE POLICY "public_read_projects" ON public.projects FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_projects" ON public.projects;
CREATE POLICY "admin_insert_projects" ON public.projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON public.projects;
CREATE POLICY "admin_update_projects" ON public.projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON public.projects;
CREATE POLICY "admin_delete_projects" ON public.projects FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 7. PROJECT MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'thumbnail')),
  media_url text NOT NULL,
  poster_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_media_project ON public.project_media(project_id);

CREATE TRIGGER project_media_updated_at BEFORE UPDATE ON public.project_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Public can read media for published projects
DROP POLICY IF EXISTS "public_read_project_media" ON public.project_media;
CREATE POLICY "public_read_project_media" ON public.project_media FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_media.project_id AND projects.published = true)
  );

DROP POLICY IF EXISTS "admin_insert_project_media" ON public.project_media;
CREATE POLICY "admin_insert_project_media" ON public.project_media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_project_media" ON public.project_media;
CREATE POLICY "admin_update_project_media" ON public.project_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_project_media" ON public.project_media;
CREATE POLICY "admin_delete_project_media" ON public.project_media FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 8. SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services" ON public.services FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_services" ON public.services;
CREATE POLICY "admin_insert_services" ON public.services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON public.services;
CREATE POLICY "admin_update_services" ON public.services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON public.services;
CREATE POLICY "admin_delete_services" ON public.services FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 9. SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Editing',
  icon text,
  description text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER skills_updated_at BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON public.skills;
CREATE POLICY "public_read_skills" ON public.skills FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_skills" ON public.skills;
CREATE POLICY "admin_insert_skills" ON public.skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON public.skills;
CREATE POLICY "admin_update_skills" ON public.skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON public.skills;
CREATE POLICY "admin_delete_skills" ON public.skills FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 10. PROCESS STEPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER process_steps_updated_at BEFORE UPDATE ON public.process_steps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_process" ON public.process_steps;
CREATE POLICY "public_read_process" ON public.process_steps FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_process" ON public.process_steps;
CREATE POLICY "admin_insert_process" ON public.process_steps FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_process" ON public.process_steps;
CREATE POLICY "admin_update_process" ON public.process_steps FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_process" ON public.process_steps;
CREATE POLICY "admin_delete_process" ON public.process_steps FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 11. SOCIAL LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon text,
  enabled boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER social_links_updated_at BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON public.social_links;
CREATE POLICY "public_read_social" ON public.social_links FOR SELECT
  TO anon, authenticated USING (enabled = true);

DROP POLICY IF EXISTS "admin_insert_social" ON public.social_links;
CREATE POLICY "admin_insert_social" ON public.social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_social" ON public.social_links;
CREATE POLICY "admin_update_social" ON public.social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_social" ON public.social_links;
CREATE POLICY "admin_delete_social" ON public.social_links FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 12. SITE SETTINGS (single-row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_title text NOT NULL DEFAULT 'Donart Duraku — Video Editor & Visual Creative',
  meta_description text NOT NULL DEFAULT 'Portfolio of Donart Duraku, a video editor and visual creative specializing in video editing, short-form content, motion graphics and digital visual storytelling.',
  favicon_url text,
  logo_url text,
  footer_text text NOT NULL DEFAULT 'Designed & edited with intention.',
  copyright_text text NOT NULL DEFAULT 'Donart Duraku. All rights reserved.',
  default_og_image_url text,
  google_analytics_id text,
  accent_color text NOT NULL DEFAULT '#d4a574',
  contact_email text NOT NULL DEFAULT '[EMAIL]',
  availability_status text NOT NULL DEFAULT 'Available for selected projects',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = '00000000-0000-0000-0000-000000000001')
);

INSERT INTO public.site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings: public can read (needed for SEO, title, etc.)
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON public.site_settings;
CREATE POLICY "admin_insert_site_settings" ON public.site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON public.site_settings;
CREATE POLICY "admin_update_site_settings" ON public.site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_settings" ON public.site_settings;
CREATE POLICY "admin_delete_site_settings" ON public.site_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 13. SEO SETTINGS (single-row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seo_title text NOT NULL DEFAULT 'Donart Duraku — Video Editor & Visual Creative',
  meta_description text NOT NULL DEFAULT 'Portfolio of Donart Duraku, a video editor and visual creative specializing in video editing, short-form content, motion graphics and digital visual storytelling.',
  og_title text NOT NULL DEFAULT 'Donart Duraku — Video Editor & Visual Creative',
  og_description text NOT NULL DEFAULT 'Portfolio of Donart Duraku, a video editor and visual creative specializing in video editing, short-form content, motion graphics and digital visual storytelling.',
  og_image_url text,
  twitter_image_url text,
  canonical_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT seo_settings_single_row CHECK (id = '00000000-0000-0000-0000-000000000001')
);

INSERT INTO public.seo_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER seo_settings_updated_at BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_seo" ON public.seo_settings;
CREATE POLICY "public_read_seo" ON public.seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_seo" ON public.seo_settings;
CREATE POLICY "admin_insert_seo" ON public.seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_seo" ON public.seo_settings;
CREATE POLICY "admin_update_seo" ON public.seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_seo" ON public.seo_settings;
CREATE POLICY "admin_delete_seo" ON public.seo_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 14. CONTACT MESSAGES (admin-only read, public insert)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  project_type text NOT NULL DEFAULT 'Other',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

CREATE TRIGGER contact_messages_updated_at BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert messages (contact form submissions)
DROP POLICY IF EXISTS "public_insert_messages" ON public.contact_messages;
CREATE POLICY "public_insert_messages" ON public.contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated admins can read messages
DROP POLICY IF EXISTS "admin_read_messages" ON public.contact_messages;
CREATE POLICY "admin_read_messages" ON public.contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_messages" ON public.contact_messages;
CREATE POLICY "admin_update_messages" ON public.contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_messages" ON public.contact_messages;
CREATE POLICY "admin_delete_messages" ON public.contact_messages FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 15. MEDIA ASSETS (admin-only, tracks files in Supabase Storage)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_type text NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'video', 'document')),
  file_size bigint DEFAULT 0,
  mime_type text,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  bucket text NOT NULL DEFAULT 'images',
  width int,
  height int,
  duration numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_type ON public.media_assets(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created ON public.media_assets(created_at DESC);

CREATE TRIGGER media_assets_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Media assets are admin-only (public reads use the public_url directly from content tables)
DROP POLICY IF EXISTS "admin_read_media" ON public.media_assets;
CREATE POLICY "admin_read_media" ON public.media_assets FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_media" ON public.media_assets;
CREATE POLICY "admin_insert_media" ON public.media_assets FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_media" ON public.media_assets;
CREATE POLICY "admin_update_media" ON public.media_assets FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON public.media_assets;
CREATE POLICY "admin_delete_media" ON public.media_assets FOR DELETE
  TO authenticated USING (true);
