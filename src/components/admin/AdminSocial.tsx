import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SocialLink } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Toggle, Button, LoadingSpinner, EmptyState, ConfirmDialog } from './ui';

export default function AdminSocial() {
  const toast = useToast();
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
    setItems((data as SocialLink[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (item: SocialLink) => {
    await supabase.from('social_links').update({ label: item.label, url: item.url, enabled: item.enabled }).eq('id', item.id);
    toast('Social link saved');
  };

  const add = async () => {
    await supabase.from('social_links').insert({ label: 'New Link', url: '', enabled: true, sort_order: items.length });
    toast('Social link added');
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await supabase.from('social_links').delete().eq('id', deleteId);
    setDeleteId(null);
    toast('Social link deleted');
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('social_links').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('social_links').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Social Links" description="Manage your social and contact links." actions={<Button onClick={add}><Plus className="w-4 h-4 mr-2" />Add Link</Button>} />
      {items.length === 0 ? <EmptyState message="No social links yet." /> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={item.id}>
              <div className="flex items-center gap-4">
                <button onClick={() => move(item.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30"><GripVertical className="w-4 h-4" /></button>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Label" value={item.label} onChange={(v) => { const updated = { ...item, label: v }; setItems(items.map((x) => x.id === item.id ? updated : x)); save(updated); }} />
                  <Input label="URL" value={item.url} onChange={(v) => { const updated = { ...item, url: v }; setItems(items.map((x) => x.id === item.id ? updated : x)); save(updated); }} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Toggle label="" checked={item.enabled} onChange={(v) => { const updated = { ...item, enabled: v }; setItems(items.map((x) => x.id === item.id ? updated : x)); save(updated); }} />
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Delete this link?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
