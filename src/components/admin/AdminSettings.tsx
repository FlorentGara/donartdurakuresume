import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Button, LoadingSpinner } from './ui';
import MediaUrlField from './MediaUrlField';

export default function AdminSettings() {
  const toast = useToast();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const snapshot = await getDocs(collection(db, 'site_settings'));
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setData({ id: docSnap.id, ...docSnap.data() } as SiteSettings);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'site_settings', data.id), {
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
      });
      toast('Settings saved successfully');
    } catch {
      toast('Failed to save settings', 'error');
    }
    setSaving(false);
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
        <Card><MediaUrlField label="Favicon" value={data.favicon_url} onChange={(v) => setData({ ...data, favicon_url: v })} filter="image" /></Card>
        <Card><MediaUrlField label="Logo" value={data.logo_url} onChange={(v) => setData({ ...data, logo_url: v })} filter="image" /></Card>
        <Card><MediaUrlField label="Default social image" value={data.default_og_image_url} onChange={(v) => setData({ ...data, default_og_image_url: v })} filter="image" /></Card>
        <Card><Input label="Google Analytics ID" value={data.google_analytics_id ?? ''} onChange={(v) => setData({ ...data, google_analytics_id: v })} placeholder="G-XXXXXXX" /></Card>
        <Card><Input label="Accent Color" value={data.accent_color} onChange={(v) => setData({ ...data, accent_color: v })} placeholder="#d4a574" /></Card>
        <Card><Input label="Availability Status" value={data.availability_status} onChange={(v) => setData({ ...data, availability_status: v })} /></Card>
      </div>
    </div>
  );
}
