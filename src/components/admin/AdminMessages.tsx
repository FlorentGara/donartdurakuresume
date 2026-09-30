import { useEffect, useState } from 'react';
import { Mail, MailOpen, Archive, Trash2, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Button, LoadingSpinner, EmptyState, ConfirmDialog } from './ui';

export default function AdminMessages() {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const q = query(collection(db, 'contact_messages'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages((data as ContactMessage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      if (msg.id) {
        await updateDoc(doc(db, 'contact_messages', msg.id), { is_read: true, status: 'read' });
        load();
      }
    }
  };

  const archive = async (id: string) => {
    await updateDoc(doc(db, 'contact_messages', id), { status: 'archived' });
    toast('Message archived');
    setSelected(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, 'contact_messages', deleteId));
    setDeleteId(null);
    setSelected(null);
    toast('Message deleted');
    load();
  };

  const filtered = messages.filter((m) => filter === 'all' || m.status === filter);

  if (loading) return <LoadingSpinner />;

  if (selected) {
    return (
      <div>
        <PageHeader title="Message" actions={<Button variant="ghost" onClick={() => setSelected(null)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>} />
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-bone-100 text-lg font-medium">{selected.name}</h2>
              <a href={`mailto:${selected.email}`} className="text-accent text-sm link-underline">{selected.email}</a>
            </div>
            <span className="text-bone-500 text-xs">{new Date(selected.created_at).toLocaleString()}</span>
          </div>
          <div className="space-y-4 text-sm">
            <div><span className="text-label">Project Type</span><p className="text-bone-200 mt-1">{selected.project_type}</p></div>
            <div><span className="text-label">Message</span><p className="text-bone-200 mt-1 whitespace-pre-wrap leading-relaxed">{selected.message}</p></div>
          </div>
          <div className="flex gap-3 mt-8 pt-6 border-t hairline">
            <Button variant="ghost" onClick={() => { if (selected.id) archive(selected.id); }}><Archive className="w-4 h-4 mr-2" />Archive</Button>
            <Button variant="danger" onClick={() => setDeleteId(selected.id || null)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
          </div>
        </Card>
        <ConfirmDialog open={!!deleteId} title="Delete this message?" message="This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions from your website." />
      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read', 'archived'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm capitalize transition-colors ${filter === f ? 'bg-accent text-ink-950' : 'bg-ink-900 text-bone-400 border hairline'}`}>{f}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState message="No messages found." />
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <Card key={msg.id}>
              <button onClick={() => openMessage(msg)} className="flex items-center gap-4 w-full text-left">
                {msg.is_read ? <MailOpen className="w-5 h-5 text-bone-500 shrink-0" /> : <Mail className="w-5 h-5 text-accent shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm ${msg.is_read ? 'text-bone-300' : 'text-bone-100 font-medium'}`}>{msg.name}</h3>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-bone-500 text-xs line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-bone-500 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                  <p className="text-bone-600 text-[10px] mt-0.5">{msg.project_type}</p>
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
