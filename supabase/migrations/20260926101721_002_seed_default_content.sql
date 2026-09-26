/*
# Seed Default Content Data

## Overview
Populates all content tables with the default portfolio data that was previously hardcoded in the frontend.
This ensures the public website has content immediately after setup, and gives Donart a starting point
to edit from the admin dashboard.

## Data Inserted
1. Project categories (6 default categories)
2. Projects (8 placeholder projects with thumbnails)
3. Project media (gallery items for each project)
4. Career entries (3 placeholder entries)
5. Education entries (2 placeholder entries)
6. Services (7 services)
7. Skills (12 skills)
8. Process steps (4 steps)
9. Social links (4 default links)
10. Profile image and hero background defaults

## Notes
- All inserts use ON CONFLICT DO NOTHING to be idempotent
- Placeholder content uses [BRACKETS] where real info is needed
- Image URLs use Pexels stock photos as placeholders
*/

-- ============================================================
-- PROJECT CATEGORIES
-- ============================================================
INSERT INTO public.project_categories (name, slug, sort_order) VALUES
('Video Editing', 'video-editing', 1),
('Reels', 'reels', 2),
('Motion Graphics', 'motion-graphics', 3),
('Graphic Design', 'graphic-design', 4),
('Social Media', 'social-media', 5),
('Other', 'other', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PROJECTS
-- ============================================================
INSERT INTO public.projects (title, slug, category_name, client, year, description, role, tools, thumbnail_url, featured, published, sort_order) VALUES
('Brand Story Film', 'brand-story-film', 'Video Editing', '[CLIENT]', '2025', 'A cinematic brand film blending documentary-style interviews with product b-roll, color graded for a warm, premium feel.', 'Lead Editor, Colorist', '["Premiere Pro","DaVinci Resolve","After Effects"]', 'https://images.pexels.com/photos/3379940/pexels-photo-3379940.jpeg?auto=compress&cs=tinysrgb&w=1200', true, true, 0),
('Short-Form Reel Series', 'short-form-reel-series', 'Reels', '[CLIENT]', '2025', 'A series of high-energy vertical reels designed for maximum retention, featuring snappy cuts, motion text and sound design.', 'Editor, Motion Designer', '["Premiere Pro","After Effects","CapCut"]', 'https://images.pexels.com/photos/6954104/pexels-photo-6954104.jpeg?auto=compress&cs=tinysrgb&w=1200', true, true, 1),
('Motion Graphics Package', 'motion-graphics-package', 'Motion Graphics', '[CLIENT]', '2024', 'A complete animated graphics package including lower thirds, transitions, intros and social templates.', 'Motion Designer', '["After Effects","Illustrator"]', 'https://images.pexels.com/photos/6679202/pexels-photo-6679202.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 2),
('Color Grading Showcase', 'color-grading-showcase', 'Video Editing', '[CLIENT]', '2024', 'Before-and-after color grading demonstration across multiple genres — from commercial to documentary.', 'Colorist', '["DaVinci Resolve"]', 'https://images.pexels.com/photos/30229850/pexels-photo-30229850.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 3),
('Social Media Campaign', 'social-media-campaign', 'Social Media', '[CLIENT]', '2025', 'A multi-platform social campaign with platform-native edits, motion captions and branded templates.', 'Editor, Social Strategist', '["Premiere Pro","After Effects","Photoshop"]', 'https://images.pexels.com/photos/8357239/pexels-photo-8357239.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 4),
('Poster & Key Art', 'poster-key-art', 'Graphic Design', '[CLIENT]', '2024', 'Poster and key art design for a short film, combining photography, typography and texture.', 'Graphic Designer', '["Photoshop","Illustrator"]', 'https://images.pexels.com/photos/14506024/pexels-photo-14506024.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 5),
('YouTube Long-Form Edit', 'youtube-long-form-edit', 'Video Editing', '[CLIENT]', '2025', 'A 20-minute documentary-style YouTube video with multi-cam editing, archival footage and motion graphics.', 'Editor', '["Premiere Pro","After Effects"]', 'https://images.pexels.com/photos/8774464/pexels-photo-8774464.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 6),
('Abstract Title Sequence', 'abstract-title-sequence', 'Motion Graphics', '[CLIENT]', '2023', 'An abstract, light-driven title sequence with particle systems and custom sound design.', 'Motion Designer, Sound Designer', '["After Effects","DaVinci Resolve"]', 'https://images.pexels.com/photos/21243683/pexels-photo-21243683.jpeg?auto=compress&cs=tinysrgb&w=1200', false, true, 7)
ON CONFLICT (slug) DO NOTHING;

-- Link projects to categories
UPDATE public.projects SET category_id = (SELECT id FROM public.project_categories WHERE slug = 'video-editing') WHERE slug IN ('brand-story-film', 'color-grading-showcase', 'youtube-long-form-edit');
UPDATE public.projects SET category_id = (SELECT id FROM public.project_categories WHERE slug = 'reels') WHERE slug = 'short-form-reel-series';
UPDATE public.projects SET category_id = (SELECT id FROM public.project_categories WHERE slug = 'motion-graphics') WHERE slug IN ('motion-graphics-package', 'abstract-title-sequence');
UPDATE public.projects SET category_id = (SELECT id FROM public.project_categories WHERE slug = 'graphic-design') WHERE slug = 'poster-key-art';
UPDATE public.projects SET category_id = (SELECT id FROM public.project_categories WHERE slug = 'social-media') WHERE slug = 'social-media-campaign';

-- ============================================================
-- PROJECT MEDIA (galleries)
-- ============================================================
INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/3379932/pexels-photo-3379932.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'brand-story-film';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/33899243/pexels-photo-33899243.jpeg?auto=compress&cs=tinysrgb&w=1200', 1
FROM public.projects p WHERE p.slug = 'brand-story-film';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/6953836/pexels-photo-6953836.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'short-form-reel-series';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/6419629/pexels-photo-6419629.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'motion-graphics-package';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/6741013/pexels-photo-6741013.jpeg?auto=compress&cs=tinysrgb&w=1200', 1
FROM public.projects p WHERE p.slug = 'motion-graphics-package';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/39694504/pexels-photo-39694504.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'color-grading-showcase';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/6347621/pexels-photo-6347621.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'social-media-campaign';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/13845237/pexels-photo-13845237.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'poster-key-art';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/11063289/pexels-photo-11063289.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'youtube-long-form-edit';

INSERT INTO public.project_media (project_id, media_type, media_url, sort_order)
SELECT p.id, 'image', 'https://images.pexels.com/photos/11774154/pexels-photo-11774154.jpeg?auto=compress&cs=tinysrgb&w=1200', 0
FROM public.projects p WHERE p.slug = 'abstract-title-sequence';

-- ============================================================
-- CAREER ENTRIES
-- ============================================================
INSERT INTO public.career_entries (company, position, start_date, end_date, is_current, description, responsibilities, skills, published, sort_order) VALUES
('[Company Name]', 'Video Editor', '2025', 'Present', true, 'Editing short-form and long-form content, creating social media assets and developing visual concepts for digital campaigns.', '["Edit and deliver video content across multiple platforms","Develop visual concepts and motion graphics templates","Collaborate with creative teams on campaign direction"]', '["Premiere Pro","After Effects","DaVinci Resolve"]', true, 0),
('[Company Name]', 'Freelance Video Editor', '2023', '2025', false, 'Worked with brands and creators to produce polished video content, from concept to final delivery.', '["Manage end-to-end editing workflow for multiple clients","Create motion graphics and visual assets","Deliver platform-native content on schedule"]', '["Premiere Pro","After Effects","Photoshop"]', true, 1),
('[Company Name]', 'Junior Video Editor', '2021', '2023', false, 'Supported senior editors on commercial and social projects while developing editing and motion graphics skills.', '["Assist with assembly edits and rough cuts","Create social media cut-downs and variations","Organize and manage media assets"]', '["Premiere Pro","CapCut"]', true, 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- EDUCATION ENTRIES
-- ============================================================
INSERT INTO public.education_entries (school, program, start_year, end_year, description, published, sort_order) VALUES
('[School Name]', '[Program / Degree]', '[Start Year]', '[End Year]', 'Foundation in visual media, editing principles and digital content production.', true, 0),
('[School Name]', '[Course / Certification]', '[Year]', '[Year]', 'Specialized training in motion graphics and post-production.', true, 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SERVICES
-- ============================================================
INSERT INTO public.services (number, title, description, published, sort_order) VALUES
('01', 'Video Editing', 'Full-service editing from assembly to final cut, with pacing and storytelling at the core.', true, 0),
('02', 'Short-Form / Reels', 'High-retention vertical content designed for Instagram, TikTok and YouTube Shorts.', true, 1),
('03', 'Motion Graphics', 'Animated lower thirds, titles, transitions and custom motion design packages.', true, 2),
('04', 'Graphic Design', 'Posters, thumbnails, key art and visual identity for digital and print.', true, 3),
('05', 'Social Media Content', 'Platform-native edits, motion captions and branded content templates.', true, 4),
('06', 'Color Grading', 'Cinematic color correction and grading to give footage a polished, consistent look.', true, 5),
('07', 'YouTube / Long-Form Editing', 'Documentary-style and long-form edits with multi-cam, archival footage and motion graphics.', true, 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SKILLS
-- ============================================================
INSERT INTO public.skills (name, category, published, sort_order) VALUES
('Adobe Premiere Pro', 'Editing', true, 0),
('Adobe After Effects', 'Motion', true, 1),
('Adobe Photoshop', 'Design', true, 2),
('Adobe Illustrator', 'Design', true, 3),
('DaVinci Resolve', 'Color', true, 4),
('CapCut', 'Editing', true, 5),
('Motion Graphics', 'Motion', true, 6),
('Color Grading', 'Color', true, 7),
('Sound Design', 'Audio', true, 8),
('Typography', 'Design', true, 9),
('Visual Storytelling', 'Craft', true, 10),
('Social Media Editing', 'Editing', true, 11)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PROCESS STEPS
-- ============================================================
INSERT INTO public.process_steps (number, title, description, published, sort_order) VALUES
('01', 'Understand', 'Understand the project, audience and desired result.', true, 0),
('02', 'Build', 'Structure the story, pacing and visual rhythm.', true, 1),
('03', 'Refine', 'Add sound design, motion graphics, typography, color and detail.', true, 2),
('04', 'Deliver', 'Export and deliver a polished final piece ready for its platform.', true, 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
INSERT INTO public.social_links (label, url, enabled, sort_order) VALUES
('Email', '[EMAIL]', true, 0),
('Instagram', '[INSTAGRAM]', true, 1),
('LinkedIn', '[LINKEDIN]', true, 2),
('Behance', '[BEHANCE]', true, 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATE PROFILE WITH DEFAULT IMAGES
-- ============================================================
UPDATE public.profiles SET
  profile_image_url = 'https://images.pexels.com/photos/5811096/pexels-photo-5811096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
WHERE profile_image_url IS NULL;

-- ============================================================
-- UPDATE HERO WITH DEFAULT BACKGROUND
-- ============================================================
UPDATE public.hero_settings SET
  background_media_url = 'https://images.pexels.com/photos/3379932/pexels-photo-3379932.jpeg?auto=compress&cs=tinysrgb&w=1920'
WHERE background_media_url IS NULL;
