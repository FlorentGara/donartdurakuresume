import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { defaultSiteCopy, siteCopyGroups, type SiteCopy } from '@/lib/site-copy';
import { useToast } from './Toast';
import { Button, Card, Input, LoadingSpinner, PageHeader, Textarea } from './ui';

export default function AdminSiteCopy() {
  const toast = useToast();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [copy, setCopy] = useState<SiteCopy>({ ...defaultSiteCopy });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDocs(collection(db, 'site_settings')).then((snapshot) => {
      if (!snapshot.empty) {
        const settings = snapshot.docs[0];
        setSettingsId(settings.id);
        setCopy({ ...defaultSiteCopy, ...(settings.data().copy ?? {}) });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!settingsId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'site_settings', settingsId), { copy });
      toast('Website text saved');
    } catch {
      toast('Could not save website text', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!settingsId) return <Card>Import the published portfolio on the dashboard first.</Card>;

  return (
    <div>
      <PageHeader title="Website Text" description="Edit labels and headings throughout the public website. Profile, hero, and project text are on their own pages." actions={<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save text'}</Button>} />
      <div className="space-y-6">
        {siteCopyGroups.map((group) => (
          <Card key={group.title}>
            <h2 className="text-bone-50 text-lg mb-5">{group.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {group.fields.map(({ key, label }) => (
                <div key={key} className={copy[key].length > 75 ? 'lg:col-span-2' : ''}>
                  {copy[key].length > 75 ? (
                    <Textarea label={label} value={copy[key]} onChange={(value) => setCopy({ ...copy, [key]: value })} rows={3} />
                  ) : (
                    <Input label={label} value={copy[key]} onChange={(value) => setCopy({ ...copy, [key]: value })} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
