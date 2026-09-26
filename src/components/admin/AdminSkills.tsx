import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Toggle, Button, LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge } from './ui';

export default function AdminSkills() {
  const toast = useToast();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    setItems((data as Skill[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    if (id) {
      await supabase.from('skills').update(payload).eq('id', id);
      toast('Skill saved');
    } else {
      await supabase.from('skills').insert({ ...payload, sort_order: items.length });
      toast('Skill created');
    }
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await supabase.from('skills').delete().eq('id', deleteId);
    setDeleteId(null);
    toast('Skill deleted');
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('skills').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('skills').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  if (editing) {
    return (
      <div>
        <PageHeader title={editing.id ? 'Edit Skill' : 'Add Skill'} actions={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><Input label="Skill Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} /></Card>
          <Card><Input label="Category" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} /></Card>
          <Card className="lg:col-span-2"><Textarea label="Description" value={editing.description ?? ''} onChange={(v) => setEditing({ ...editing, description: v })} rows={2} /></Card>
          <Card><Toggle label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} /></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Skills" description="Manage your skills cloud." actions={<Button onClick={() => setEditing({ id: '', name: '', category: 'Editing', icon: null, description: null, published: true, sort_order: items.length })}><Plus className="w-4 h-4 mr-2" />Add Skill</Button>} />
      {items.length === 0 ? <EmptyState message="No skills yet." /> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={item.id}>
              <div className="flex items-center gap-4">
                <button onClick={() => move(item.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30"><GripVertical className="w-4 h-4" /></button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3"><h3 className="text-bone-100 font-medium">{item.name}</h3><StatusBadge published={item.published} /></div>
                  <p className="text-bone-500 text-xs mt-0.5">{item.category}</p>
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
      <ConfirmDialog open={!!deleteId} title="Delete this skill?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
