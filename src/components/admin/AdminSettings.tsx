import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Button, LoadingSpinner } from './ui';

export default function AdminSettings() {
  const toast = useToast();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => {
      setData(data as SiteSettings);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase.from('site_settings').update({
      website_title: data.website_title,
      meta_description: data.meta_description,
      favicon_url: data.favicon_url,
      logo_url: data.logo_url,
      footer_text: data.footer_text,
      copyright_text: data.copyright_text,
      default_og_image_url: data.default_og_image_url,
      google_analytics_id: data.google_analytics_id,
      accent_color: data.accent_color,
      contact_email: data.contact_email,
      availability_status: data.availability_status,
    }).eq('id', data.id);
    setSaving(false);
    if (error) toast('Failed to save settings', 'error');
    else toast('Settings saved successfully');
  };

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Site Settings" description="Global website configuration." actions={<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Input label="Website Title" value={data.website_title} onChange={(v) => setData({ ...data, website_title: v })} /></Card>
        <Card><Input label="Contact Email" value={data.contact_email} onChange={(v) => setData({ ...data, contact_email: v })} /></Card>
        <Card className="lg:col-span-2"><Textarea label="Meta Description" value={data.meta_description} onChange={(v) => setData({ ...data, meta_description: v })} rows={2} /></Card>
        <Card><Input label="Footer Text" value={data.footer_text} onChange={(v) => setData({ ...data, footer_text: v })} /></Card>
        <Card><Input label="Copyright Text" value={data.copyright_text} onChange={(v) => setData({ ...data, copyright_text: v })} /></Card>
        <Card><Input label="Favicon URL" value={data.favicon_url ?? ''} onChange={(v) => setData({ ...data, favicon_url: v })} /></Card>
        <Card><Input label="Logo URL" value={data.logo_url ?? ''} onChange={(v) => setData({ ...data, logo_url: v })} /></Card>
        <Card><Input label="Default OG Image URL" value={data.default_og_image_url ?? ''} onChange={(v) => setData({ ...data, default_og_image_url: v })} /></Card>
        <Card><Input label="Google Analytics ID" value={data.google_analytics_id ?? ''} onChange={(v) => setData({ ...data, google_analytics_id: v })} placeholder="G-XXXXXXX" /></Card>
        <Card><Input label="Accent Color" value={data.accent_color} onChange={(v) => setData({ ...data, accent_color: v })} placeholder="#d4a574" /></Card>
        <Card><Input label="Availability Status" value={data.availability_status} onChange={(v) => setData({ ...data, availability_status: v })} /></Card>
      </div>
    </div>
  );
}
