import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Profile } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Button, LoadingSpinner } from './ui';

export default function AdminProfile() {
  const toast = useToast();
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDocs(collection(db, 'profiles')).then((snapshot) => {
      if (!snapshot.empty) {
        setData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Profile);
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', data.id), {
        full_name: data.full_name,
        professional_title: data.professional_title,
        hero_statement: data.hero_statement,
        hero_description: data.hero_description,
        about_heading: data.about_heading,
        about_description: data.about_description,
        location: data.location,
        experience: data.experience,
        availability_status: data.availability_status,
        email: data.email,
        profile_image_url: data.profile_image_url,
        cv_url: data.cv_url,
      });
      toast('Profile saved successfully');
    } catch (error) {
      toast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Edit your personal information shown on the About section."
        actions={<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Input label="Full Name" value={data.full_name} onChange={(v) => setData({ ...data, full_name: v })} /></Card>
        <Card><Input label="Professional Title" value={data.professional_title} onChange={(v) => setData({ ...data, professional_title: v })} /></Card>
        <Card><Input label="Hero Statement" value={data.hero_statement} onChange={(v) => setData({ ...data, hero_statement: v })} /></Card>
        <Card><Input label="Hero Description" value={data.hero_description} onChange={(v) => setData({ ...data, hero_description: v })} /></Card>
        <Card className="lg:col-span-2"><Textarea label="About Heading" value={data.about_heading} onChange={(v) => setData({ ...data, about_heading: v })} rows={2} /></Card>
        <Card className="lg:col-span-2"><Textarea label="About Description" value={data.about_description} onChange={(v) => setData({ ...data, about_description: v })} rows={5} /></Card>
        <Card><Input label="Location" value={data.location} onChange={(v) => setData({ ...data, location: v })} /></Card>
        <Card><Input label="Experience" value={data.experience} onChange={(v) => setData({ ...data, experience: v })} /></Card>
        <Card><Input label="Availability Status" value={data.availability_status} onChange={(v) => setData({ ...data, availability_status: v })} /></Card>
        <Card><Input label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} /></Card>
        <Card><Input label="Profile Image URL" value={data.profile_image_url ?? ''} onChange={(v) => setData({ ...data, profile_image_url: v })} placeholder="https://..." /></Card>
        <Card><Input label="CV/Resume URL" value={data.cv_url ?? ''} onChange={(v) => setData({ ...data, cv_url: v })} placeholder="https://..." /></Card>
      </div>
      {data.profile_image_url && (
        <div className="mt-6">
          <p className="text-label mb-3">Profile Image Preview</p>
          <img src={data.profile_image_url} alt="Profile" className="w-40 h-52 object-cover rounded-2xl border hairline" />
        </div>
      )}
    </div>
  );
}
