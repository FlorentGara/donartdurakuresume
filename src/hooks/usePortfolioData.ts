import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Profile, HeroSettings, CareerEntry, EducationEntry,
  Project, ProjectMedia, Service, Skill, ProcessStep,
  SocialLink, SiteSettings, ProjectCategory,
} from '@/lib/types';

async function fetchSingle<T>(table: string): Promise<T | null> {
  const { data, error } = await supabase.from(table).select('*').maybeSingle();
  if (error) return null;
  return data as T;
}

async function fetchMany<T>(table: string, orderBy = 'sort_order'): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .order(orderBy, { ascending: true });
  if (error || !data) return [];
  return data as T[];
}

export function usePortfolioData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [career, setCareer] = useState<CareerEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMedia, setProjectMedia] = useState<Record<string, ProjectMedia[]>>({});
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const [p, h, c, e, pr, cats, sv, sk, ps, sl, ss] = await Promise.all([
          fetchSingle<Profile>('profiles'),
          fetchSingle<HeroSettings>('hero_settings'),
          fetchMany<CareerEntry>('career_entries'),
          fetchMany<EducationEntry>('education_entries'),
          supabase.from('projects').select('*').eq('published', true).order('sort_order', { ascending: true }).then(({ data }) => data as Project[] ?? []),
          supabase.from('project_categories').select('*').order('sort_order', { ascending: true }).then(({ data }) => data as ProjectCategory[] ?? []),
          fetchMany<Service>('services'),
          fetchMany<Skill>('skills'),
          fetchMany<ProcessStep>('process_steps'),
          supabase.from('social_links').select('*').eq('enabled', true).order('sort_order', { ascending: true }).then(({ data }) => data as SocialLink[] ?? []),
          fetchSingle<SiteSettings>('site_settings'),
        ]);

        if (cancelled) return;

        setProfile(p);
        setHero(h);
        setCareer(c);
        setEducation(e);
        setProjects(pr ?? []);
        setCategories(cats ?? []);
        setServices(sv);
        setSkills(sk);
        setProcessSteps(ps);
        setSocialLinks(sl);
        setSiteSettings(ss);

        // Fetch media for all projects
        if (pr && pr.length > 0) {
          const projectIds = pr.map((p) => p.id);
          const { data: mediaData } = await supabase
            .from('project_media')
            .select('*')
            .in('project_id', projectIds)
            .order('sort_order', { ascending: true });

          if (!cancelled && mediaData) {
            const mediaMap: Record<string, ProjectMedia[]> = {};
            for (const m of mediaData as ProjectMedia[]) {
              if (!mediaMap[m.project_id]) mediaMap[m.project_id] = [];
              mediaMap[m.project_id].push(m);
            }
            setProjectMedia(mediaMap);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return {
    loading,
    error,
    profile,
    hero,
    career,
    education,
    projects,
    projectMedia,
    categories,
    services,
    skills,
    processSteps,
    socialLinks,
    siteSettings,
  };
}
