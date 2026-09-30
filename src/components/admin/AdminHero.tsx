import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, limit, query } from 'firebase/firestore';
import type { HeroSettings } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Toggle, Button, LoadingSpinner } from './ui';

export default function AdminHero() {
  const toast = useToast();
  const [data, setData] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'hero_settings'), limit(1));
    getDocs(q).then((snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setData({ id: docSnap.id, ...docSnap.data() } as HeroSettings);
      } else {
        setData(null);
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'hero_settings', data.id), {
        hero_name: data.hero_name,
        eyebrow_text: data.eyebrow_text,
        main_title_line1: data.main_title_line1,
        main_title_line2: data.main_title_line2,
        description: data.description,
        primary_button_text: data.primary_button_text,
        primary_button_link: data.primary_button_link,
        secondary_button_text: data.secondary_button_text,
        secondary_button_link: data.secondary_button_link,
        availability_text: data.availability_text,
        background_type: data.background_type,
        background_media_url: data.background_media_url,
        background_video_autoplay: data.background_video_autoplay,
        background_video_muted: data.background_video_muted,
        background_video_loop: data.background_video_loop,
        background_poster_url: data.background_poster_url,
      });
      setSaving(false);
      toast('Hero settings saved successfully');
    } catch (error) {
      setSaving(false);
      toast('Failed to save hero settings', 'error');
    }
  };

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Control the main landing area of your website."
        actions={<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Input label="Hero Name" value={data.hero_name} onChange={(v) => setData({ ...data, hero_name: v })} /></Card>
        <Card><Input label="Eyebrow Text" value={data.eyebrow_text} onChange={(v) => setData({ ...data, eyebrow_text: v })} /></Card>
        <Card><Input label="Main Title Line 1" value={data.main_title_line1} onChange={(v) => setData({ ...data, main_title_line1: v })} /></Card>
        <Card><Input label="Main Title Line 2" value={data.main_title_line2} onChange={(v) => setData({ ...data, main_title_line2: v })} /></Card>
        <Card className="lg:col-span-2"><Textarea label="Description" value={data.description} onChange={(v) => setData({ ...data, description: v })} rows={2} /></Card>
        <Card><Input label="Primary Button Text" value={data.primary_button_text} onChange={(v) => setData({ ...data, primary_button_text: v })} /></Card>
        <Card><Input label="Primary Button Link" value={data.primary_button_link} onChange={(v) => setData({ ...data, primary_button_link: v })} /></Card>
        <Card><Input label="Secondary Button Text" value={data.secondary_button_text} onChange={(v) => setData({ ...data, secondary_button_text: v })} /></Card>
        <Card><Input label="Secondary Button Link" value={data.secondary_button_link} onChange={(v) => setData({ ...data, secondary_button_link: v })} /></Card>
        <Card><Input label="Availability Text" value={data.availability_text} onChange={(v) => setData({ ...data, availability_text: v })} /></Card>
      </div>

      <div className="mt-6">
        <h2 className="text-bone-300 text-sm font-medium mb-4">Background Media</h2>
        <Card>
          <div className="space-y-5">
            <div className="flex gap-3">
              <button
                onClick={() => setData({ ...data, background_type: 'image' })}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${data.background_type === 'image' ? 'bg-accent text-ink-950' : 'bg-ink-850 text-bone-300'}`}
              >Image</button>
              <button
                onClick={() => setData({ ...data, background_type: 'video' })}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${data.background_type === 'video' ? 'bg-accent text-ink-950' : 'bg-ink-850 text-bone-300'}`}
              >Video</button>
            </div>
            <Input label="Background Media URL" value={data.background_media_url ?? ''} onChange={(v) => setData({ ...data, background_media_url: v })} placeholder="https://..." />
            {data.background_type === 'video' && (
              <>
                <Input label="Poster Image URL" value={data.background_poster_url ?? ''} onChange={(v) => setData({ ...data, background_poster_url: v })} placeholder="https://..." />
                <Toggle label="Autoplay" checked={data.background_video_autoplay} onChange={(v) => setData({ ...data, background_video_autoplay: v })} />
                <Toggle label="Muted" checked={data.background_video_muted} onChange={(v) => setData({ ...data, background_video_muted: v })} />
                <Toggle label="Loop" checked={data.background_video_loop} onChange={(v) => setData({ ...data, background_video_loop: v })} />
              </>
            )}
          </div>
        </Card>
      </div>

      {data.background_media_url && (
        <div className="mt-6">
          <p className="text-label mb-3">Preview</p>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border hairline">
            {data.background_type === 'video' ? (
              <video src={data.background_media_url} poster={data.background_poster_url ?? undefined} muted={data.background_video_muted} loop={data.background_video_loop} className="w-full h-full object-cover" />
            ) : (
              <img src={data.background_media_url} alt="Hero background" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
