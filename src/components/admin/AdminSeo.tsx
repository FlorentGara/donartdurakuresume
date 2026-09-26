import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SeoSettings } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Button, LoadingSpinner } from './ui';

export default function AdminSeo() {
  const toast = useToast();
  const [data, setData] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('seo_settings').select('*').maybeSingle().then(({ data }) => {
      setData(data as SeoSettings);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase.from('seo_settings').update({
      seo_title: data.seo_title,
      meta_description: data.meta_description,
      og_title: data.og_title,
      og_description: data.og_description,
      og_image_url: data.og_image_url,
      twitter_image_url: data.twitter_image_url,
      canonical_url: data.canonical_url,
    }).eq('id', data.id);
    setSaving(false);
    if (error) toast('Failed to save SEO settings', 'error');
    else toast('SEO settings saved successfully');
  };

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="SEO Settings" description="Control how your site appears in search results and social shares." actions={<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Input label="SEO Title" value={data.seo_title} onChange={(v) => setData({ ...data, seo_title: v })} /></Card>
        <Card><Input label="Canonical URL" value={data.canonical_url ?? ''} onChange={(v) => setData({ ...data, canonical_url: v })} placeholder="https://..." /></Card>
        <Card className="lg:col-span-2"><Textarea label="Meta Description" value={data.meta_description} onChange={(v) => setData({ ...data, meta_description: v })} rows={2} /></Card>
        <Card><Input label="OG Title" value={data.og_title} onChange={(v) => setData({ ...data, og_title: v })} /></Card>
        <Card className="lg:col-span-2"><Textarea label="OG Description" value={data.og_description} onChange={(v) => setData({ ...data, og_description: v })} rows={2} /></Card>
        <Card><Input label="OG Image URL" value={data.og_image_url ?? ''} onChange={(v) => setData({ ...data, og_image_url: v })} /></Card>
        <Card><Input label="Twitter/X Image URL" value={data.twitter_image_url ?? ''} onChange={(v) => setData({ ...data, twitter_image_url: v })} /></Card>
      </div>
    </div>
  );
}
