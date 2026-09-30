import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Toggle, Button, LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge } from './ui';

export default function AdminServices() {
  const toast = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const snapshot = await getDocs(query(collection(db, 'services'), orderBy('sort_order', 'asc')));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Service[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    try {
      if (id) {
        await updateDoc(doc(db, 'services', id), payload);
        toast('Service saved');
      } else {
        await addDoc(collection(db, 'services'), { ...payload, sort_order: items.length });
        toast('Service created');
      }
    } catch (e) {
      toast('Failed to save service', 'error');
    }
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, 'services', deleteId));
    setDeleteId(null);
    toast('Service deleted');
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await updateDoc(doc(db, 'services', id), { sort_order: swap.sort_order });
    await updateDoc(doc(db, 'services', swap.id), { sort_order: items[idx].sort_order });
    load();
  };

  if (loading) return <LoadingSpinner />;

  if (editing) {
    return (
      <div>
        <PageHeader title={editing.id ? 'Edit Service' : 'Add Service'} actions={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><Input label="Number" value={editing.number} onChange={(v) => setEditing({ ...editing, number: v })} placeholder="01" /></Card>
          <Card><Input label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} /></Card>
          <Card className="lg:col-span-2"><Textarea label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} rows={3} /></Card>
          <Card><Toggle label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} /></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Services" description="Manage the services displayed on your website." actions={<Button onClick={() => setEditing({ id: '', number: String(items.length + 1).padStart(2, '0'), title: '', description: '', icon: null, published: true, sort_order: items.length })}><Plus className="w-4 h-4 mr-2" />Add Service</Button>} />
      {items.length === 0 ? <EmptyState message="No services yet." /> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <button onClick={() => move(item.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30 pt-1"><GripVertical className="w-4 h-4" /></button>
                <div className="font-mono text-accent/40 text-lg w-10 shrink-0">{item.number}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1"><h3 className="text-bone-100 font-medium">{item.title}</h3><StatusBadge published={item.published} /></div>
                  <p className="text-bone-400 text-sm line-clamp-1">{item.description}</p>
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
      <ConfirmDialog open={!!deleteId} title="Delete this service?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
