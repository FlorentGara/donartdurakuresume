import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { CareerEntry } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Toggle, Button, LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge } from './ui';

export default function AdminCareer() {
  const toast = useToast();
  const [items, setItems] = useState<CareerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CareerEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('career_entries').select('*').order('sort_order', { ascending: true });
    setItems((data as CareerEntry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    if (id) {
      const { error } = await supabase.from('career_entries').update(payload).eq('id', id);
      if (error) { toast('Failed to save', 'error'); return; }
      toast('Career entry saved');
    } else {
      const { error } = await supabase.from('career_entries').insert({ ...payload, sort_order: items.length });
      if (error) { toast('Failed to create', 'error'); return; }
      toast('Career entry created');
    }
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('career_entries').delete().eq('id', deleteId);
    setDeleteId(null);
    if (error) toast('Failed to delete', 'error');
    else toast('Career entry deleted');
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('career_entries').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('career_entries').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  if (editing) {
    return (
      <div>
        <PageHeader
          title={editing.id ? 'Edit Career Entry' : 'Add Career Entry'}
          actions={
            <>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><Input label="Company" value={editing.company} onChange={(v) => setEditing({ ...editing, company: v })} /></Card>
          <Card><Input label="Position" value={editing.position} onChange={(v) => setEditing({ ...editing, position: v })} /></Card>
          <Card><Input label="Start Date" value={editing.start_date} onChange={(v) => setEditing({ ...editing, start_date: v })} placeholder="2024" /></Card>
          <Card><Input label="End Date" value={editing.end_date} onChange={(v) => setEditing({ ...editing, end_date: v })} placeholder="Present" /></Card>
          <Card className="lg:col-span-2"><Textarea label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} rows={3} /></Card>
          <Card className="lg:col-span-2">
            <Textarea
              label="Responsibilities (one per line)"
              value={editing.responsibilities.join('\n')}
              onChange={(v) => setEditing({ ...editing, responsibilities: v.split('\n').filter(Boolean) })}
              rows={4}
            />
          </Card>
          <Card className="lg:col-span-2">
            <Input
              label="Skills (comma-separated)"
              value={editing.skills.join(', ')}
              onChange={(v) => setEditing({ ...editing, skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </Card>
          <Card><Input label="Company Logo URL" value={editing.company_logo_url ?? ''} onChange={(v) => setEditing({ ...editing, company_logo_url: v })} /></Card>
          <Card><Input label="Location" value={editing.location ?? ''} onChange={(v) => setEditing({ ...editing, location: v })} /></Card>
          <Card><Toggle label="Current Position" checked={editing.is_current} onChange={(v) => setEditing({ ...editing, is_current: v })} /></Card>
          <Card><Toggle label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} /></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Career"
        description="Manage your work experience timeline."
        actions={<Button onClick={() => setEditing({ id: '', company: '[Company Name]', position: '', start_date: '', end_date: 'Present', is_current: true, description: '', responsibilities: [], skills: [], company_logo_url: null, location: null, published: true, sort_order: items.length, created_at: '', updated_at: '' })}><Plus className="w-4 h-4 mr-2" />Add Entry</Button>}
      />
      {items.length === 0 ? (
        <EmptyState message="No career entries yet." action={<Button onClick={() => setEditing({ id: '', company: '', position: '', start_date: '', end_date: 'Present', is_current: true, description: '', responsibilities: [], skills: [], company_logo_url: null, location: null, published: true, sort_order: 0, created_at: '', updated_at: '' })}>Add First Entry</Button>} />
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => move(item.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30"><GripVertical className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-bone-100 font-medium">{item.position}</h3>
                    <StatusBadge published={item.published} />
                  </div>
                  <p className="text-bone-400 text-sm">{item.company} · {item.start_date} — {item.end_date}</p>
                  <p className="text-bone-500 text-xs mt-1 line-clamp-1">{item.description}</p>
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
      <ConfirmDialog open={!!deleteId} title="Delete this career entry?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
