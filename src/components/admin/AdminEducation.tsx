import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { EducationEntry } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Toggle, Button, LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge } from './ui';

export default function AdminEducation() {
  const toast = useToast();
  const [items, setItems] = useState<EducationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EducationEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const q = query(collection(db, 'education_entries'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems((data as EducationEntry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    if (id) {
      await updateDoc(doc(db, 'education_entries', id), payload);
      toast('Education entry saved');
    } else {
      await addDoc(collection(db, 'education_entries'), { ...payload, sort_order: items.length });
      toast('Education entry created');
    }
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, 'education_entries', deleteId));
    setDeleteId(null);
    toast('Education entry deleted');
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await updateDoc(doc(db, 'education_entries', id), { sort_order: swap.sort_order });
    await updateDoc(doc(db, 'education_entries', swap.id), { sort_order: items[idx].sort_order });
    load();
  };

  if (loading) return <LoadingSpinner />;

  if (editing) {
    return (
      <div>
        <PageHeader
          title={editing.id ? 'Edit Education Entry' : 'Add Education Entry'}
          actions={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><Input label="School" value={editing.school} onChange={(v) => setEditing({ ...editing, school: v })} /></Card>
          <Card><Input label="Program" value={editing.program} onChange={(v) => setEditing({ ...editing, program: v })} /></Card>
          <Card><Input label="Degree" value={editing.degree ?? ''} onChange={(v) => setEditing({ ...editing, degree: v })} /></Card>
          <Card><Input label="Location" value={editing.location ?? ''} onChange={(v) => setEditing({ ...editing, location: v })} /></Card>
          <Card><Input label="Start Year" value={editing.start_year} onChange={(v) => setEditing({ ...editing, start_year: v })} /></Card>
          <Card><Input label="End Year" value={editing.end_year} onChange={(v) => setEditing({ ...editing, end_year: v })} /></Card>
          <Card className="lg:col-span-2"><Textarea label="Description" value={editing.description ?? ''} onChange={(v) => setEditing({ ...editing, description: v })} rows={3} /></Card>
          <Card><Input label="Logo URL" value={editing.logo_url ?? ''} onChange={(v) => setEditing({ ...editing, logo_url: v })} /></Card>
          <Card><Toggle label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} /></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Education"
        description="Manage your education history."
        actions={<Button onClick={() => setEditing({ id: '', school: '', program: '', degree: null, start_year: '', end_year: '', description: null, logo_url: null, location: null, published: true, sort_order: items.length, created_at: '', updated_at: '' })}><Plus className="w-4 h-4 mr-2" />Add Entry</Button>}
      />
      {items.length === 0 ? (
        <EmptyState message="No education entries yet." />
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <button onClick={() => move(item.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30 pt-1"><GripVertical className="w-4 h-4" /></button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-bone-100 font-medium">{item.school}</h3>
                    <StatusBadge published={item.published} />
                  </div>
                  <p className="text-bone-400 text-sm">{item.program} · {item.start_year} — {item.end_year}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(item)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-bone-100"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Delete this education entry?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
