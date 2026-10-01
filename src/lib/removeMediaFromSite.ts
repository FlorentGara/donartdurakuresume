import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const mediaFields: Record<string, string[]> = {
  projects: ['thumbnail_url', 'main_video_url'],
  project_media: ['media_url', 'poster_url'],
  profiles: ['profile_image_url', 'cv_url'],
  hero_settings: ['background_media_url', 'background_poster_url'],
  site_settings: ['favicon_url', 'logo_url', 'default_og_image_url'],
  seo_settings: ['og_image_url', 'twitter_image_url'],
};

export async function removeMediaFromSite(assetId: string, url: string): Promise<void> {
  const batch = writeBatch(db);
  let writes = 1;

  for (const [name, fields] of Object.entries(mediaFields)) {
    const snapshot = await getDocs(collection(db, name));
    for (const item of snapshot.docs) {
      const data = item.data();
      if (name === 'project_media' && data.media_url === url) {
        batch.delete(item.ref);
        writes++;
        continue;
      }
      const changes: Record<string, null> = {};
      for (const field of fields) {
        if (data[field] === url) changes[field] = null;
      }
      if (Object.keys(changes).length) {
        batch.update(item.ref, changes);
        writes++;
      }
    }
  }

  if (writes > 500) throw new Error('This file is used in too many places to remove at once.');
  batch.delete(doc(db, 'media_assets', assetId));
  await batch.commit();
}
