import type { SiteCopy } from './site-copy';

export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  hero_statement: string;
  hero_description: string;
  about_heading: string;
  about_description: string;
  location: string;
  experience: string;
  availability_status: string;
  email: string;
  profile_image_url: string | null;
  cv_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroSettings {
  id: string;
  hero_name: string;
  eyebrow_text: string;
  main_title_line1: string;
  main_title_line2: string;
  description: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  availability_text: string;
  background_type: 'image' | 'video';
  background_media_url: string | null;
  background_video_autoplay: boolean;
  background_video_muted: boolean;
  background_video_loop: boolean;
  background_poster_url: string | null;
}

export interface CareerEntry {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
  company_logo_url: string | null;
  location: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  program: string;
  degree: string | null;
  start_year: string;
  end_year: string;
  description: string | null;
  logo_url: string | null;
  location: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category_name: string;
  client: string;
  year: string;
  description: string;
  role: string;
  tools: string[];
  credits: string[];
  thumbnail_url: string | null;
  main_video_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  media_type: 'image' | 'video' | 'thumbnail';
  media_url: string;
  poster_url: string | null;
  sort_order: number;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string | null;
  published: boolean;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  published: boolean;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string | null;
  published: boolean;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  enabled: boolean;
  sort_order: number;
}

export interface SiteSettings {
  id: string;
  website_title: string;
  meta_description: string;
  favicon_url: string | null;
  logo_url: string | null;
  footer_text: string;
  copyright_text: string;
  default_og_image_url: string | null;
  google_analytics_id: string | null;
  accent_color: string;
  contact_email: string;
  availability_status: string;
  copy?: Partial<SiteCopy>;
}

export interface SeoSettings {
  id: string;
  seo_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  twitter_image_url: string | null;
  canonical_url: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  file_type: 'image' | 'video' | 'document';
  file_size: number;
  mime_type: string | null;
  storage_path: string;
  public_url: string;
  cloudinary_public_id?: string;
  cloudinary_resource_type?: string;
  bucket: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}
