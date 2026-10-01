import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import publishedPortfolio from '@/data/publishedPortfolio.json';

const singleCollections = ['profiles', 'hero_settings', 'site_settings'] as const;
const listCollections = [
  'career_entries', 'education_entries', 'projects', 'project_categories',
  'project_media', 'services', 'skills', 'process_steps', 'social_links',
] as const;

export async function hasEditablePortfolio(): Promise<boolean> {
  const snapshots = await Promise.all(
    [...singleCollections, ...listCollections].map((name) => getDocs(collection(db, name))),
  );
  return snapshots.some((snapshot) => !snapshot.empty);
}

export async function importPublishedPortfolio(): Promise<void> {
  // Never overwrite work already entered through the dashboard.
  if (await hasEditablePortfolio()) {
    throw new Error('Firebase already contains portfolio content. Import stopped to protect your edits.');
  }

  const batch = writeBatch(db);
  for (const name of singleCollections) {
    const record = publishedPortfolio[name];
    if (!record) continue;
    batch.set(doc(db, name, record.id), record);
  }

  for (const name of listCollections) {
    for (const record of publishedPortfolio[name]) {
      const data: Record<string, unknown> = { ...record };
      if (name === 'projects' && 'main_video_url' in data &&
          typeof data.main_video_url === 'string' && data.main_video_url.startsWith('/media/')) {
        data.main_video_url = null;
      }
      batch.set(doc(db, name, record.id), data);
    }
  }

  const profile = publishedPortfolio.profiles;
  const settings = publishedPortfolio.site_settings;
  batch.set(doc(db, 'seo_settings', 'default'), {
    seo_title: settings.website_title,
    meta_description: settings.meta_description,
    og_title: settings.website_title,
    og_description: settings.meta_description,
    og_image_url: settings.default_og_image_url,
    twitter_image_url: settings.default_og_image_url,
    canonical_url: 'https://donartduraku.netlify.app/',
    author: profile.full_name,
  });

  await batch.commit();
}
