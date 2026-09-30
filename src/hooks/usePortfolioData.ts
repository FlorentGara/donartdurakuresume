import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy as firestoreOrderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  Profile, HeroSettings, CareerEntry, EducationEntry,
  Project, ProjectMedia, Service, Skill, ProcessStep,
  SocialLink, SiteSettings, ProjectCategory,
} from '@/lib/types';

async function fetchSingle<T>(tableName: string): Promise<T | null> {
  const q = query(collection(db, tableName), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as T;
}

async function fetchMany<T>(tableName: string, orderByField = 'sort_order'): Promise<T[]> {
  const q = query(
    collection(db, tableName),
    where('published', '==', true),
    firestoreOrderBy(orderByField, 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
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
          getDocs(query(collection(db, 'projects'), where('published', '==', true), firestoreOrderBy('sort_order', 'asc'))).then(snap => snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project)),
          getDocs(query(collection(db, 'project_categories'), firestoreOrderBy('sort_order', 'asc'))).then(snap => snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProjectCategory)),
          fetchMany<Service>('services'),
          fetchMany<Skill>('skills'),
          fetchMany<ProcessStep>('process_steps'),
          getDocs(query(collection(db, 'social_links'), where('enabled', '==', true), firestoreOrderBy('sort_order', 'asc'))).then(snap => snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SocialLink)),
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
          // Firestore doesn't support 'in' queries with more than 10 elements easily, but for simplicity here:
          // In a real app we'd chunk it. We'll just fetch all media or use multiple queries.
          const { docs: mediaDocs } = await getDocs(collection(db, 'project_media'));
          const mediaData = mediaDocs.map(d => ({ id: d.id, ...d.data() }) as ProjectMedia).filter(m => projectIds.includes(m.project_id));
          // sorting by sort_order
          mediaData.sort((a, b) => a.sort_order - b.sort_order);

          if (!cancelled && mediaData) {
            const mediaMap: Record<string, ProjectMedia[]> = {};
            for (const m of mediaData) {
              if (!mediaMap[m.project_id]) mediaMap[m.project_id] = [];
              mediaMap[m.project_id].push(m);
            }
            setProjectMedia(mediaMap);
          }
        }
      } catch (err) {
        console.error(err);
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
