import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Star, GripVertical, FolderPlus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Project, ProjectCategory } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Button, LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge } from './ui';
import { useHashRoute } from '@/hooks/useHashRoute';

export default function AdminProjects() {
  const toast = useToast();
  const { navigate } = useHashRoute();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCats, setShowCats] = useState(false);
  const [newCat, setNewCat] = useState('');

  const load = async () => {
    const [pSnap, cSnap] = await Promise.all([
      getDocs(query(collection(db, 'projects'), orderBy('sort_order', 'asc'))),
      getDocs(query(collection(db, 'project_categories'), orderBy('sort_order', 'asc'))),
    ]);
    setProjects(pSnap.docs.map(d => ({ ...d.data(), id: d.id })) as Project[]);
    setCategories(cSnap.docs.map(d => ({ ...d.data(), id: d.id })) as ProjectCategory[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async () => {
    if (!deleteId) return;
    const mediaSnap = await getDocs(query(collection(db, 'project_media'), where('project_id', '==', deleteId)));
    for (const mDoc of mediaSnap.docs) {
      await deleteDoc(doc(db, 'project_media', mDoc.id));
    }
    await deleteDoc(doc(db, 'projects', deleteId));
    setDeleteId(null);
    toast('Project deleted');
    load();
  };

  const duplicate = async (p: Project) => {
    const rest = Object.fromEntries(Object.entries(p).filter(([key]) =>
      !['id', 'created_at', 'updated_at'].includes(key)));
    await addDoc(collection(db, 'projects'), {
      ...rest,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      sort_order: projects.length,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    toast('Project duplicated');
    load();
  };

  const togglePublished = async (p: Project) => {
    await updateDoc(doc(db, 'projects', p.id), { published: !p.published });
    toast(p.published ? 'Project unpublished' : 'Project published');
    load();
  };

  const toggleFeatured = async (p: Project) => {
    await updateDoc(doc(db, 'projects', p.id), { featured: !p.featured });
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex((i) => i.id === id);
    const swap = projects[idx + dir];
    if (!swap) return;
    await updateDoc(doc(db, 'projects', id), { sort_order: swap.sort_order });
    await updateDoc(doc(db, 'projects', swap.id), { sort_order: projects[idx].sort_order });
    load();
  };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const slug = newCat.toLowerCase().replace(/\s+/g, '-');
    try {
      await addDoc(collection(db, 'project_categories'), { name: newCat, slug, sort_order: categories.length });
      setNewCat('');
      toast('Category added');
      load();
    } catch {
      toast('Failed to add category', 'error');
    }
  };

  const deleteCategory = async (id: string) => {
    const projSnap = await getDocs(query(collection(db, 'projects'), where('category_id', '==', id)));
    for (const pDoc of projSnap.docs) {
      await updateDoc(doc(db, 'projects', pDoc.id), { category_id: null, category_name: 'Other' });
    }
    await deleteDoc(doc(db, 'project_categories', id));
    toast('Category deleted');
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects."
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowCats(!showCats)}><FolderPlus className="w-4 h-4 mr-2" />Categories</Button>
            <Button onClick={() => navigate('/admin/projects/new')}><Plus className="w-4 h-4 mr-2" />Add Project</Button>
          </>
        }
      />

      {showCats && (
        <Card className="mb-6">
          <h3 className="text-bone-200 text-sm font-medium mb-4">Project Categories</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-850 border hairline text-sm text-bone-200">
                {cat.name}
                <button onClick={() => deleteCategory(cat.id)} className="text-bone-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="New category name..."
              className="flex-1 bg-ink-850 border hairline rounded-xl px-4 py-2.5 text-bone-100 text-sm focus:border-accent/50 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button onClick={addCategory}>Add</Button>
          </div>
        </Card>
      )}

      {projects.length === 0 ? (
        <EmptyState message="No projects yet." action={<Button onClick={() => navigate('/admin/projects/new')}><Plus className="w-4 h-4 mr-2" />Add Project</Button>} />
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <Card key={p.id}>
              <div className="flex items-start gap-4">
                <button onClick={() => move(p.id, -1)} disabled={i === 0} className="text-bone-600 hover:text-bone-100 disabled:opacity-30 pt-1"><GripVertical className="w-4 h-4" /></button>
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-ink-850 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-bone-100 font-medium">{p.title}</h3>
                    <StatusBadge published={p.published} />
                    {p.featured && <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/10 text-accent">Featured</span>}
                  </div>
                  <p className="text-bone-400 text-sm">{p.category_name} · {p.year} · {p.client}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleFeatured(p)} className={`p-2 rounded-lg hover:bg-ink-850 ${p.featured ? 'text-accent' : 'text-bone-500'}`} title="Toggle featured"><Star className="w-4 h-4" /></button>
                  <button onClick={() => togglePublished(p)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-bone-100" title="Toggle published">
                    <span className={`w-2 h-2 rounded-full block ${p.published ? 'bg-emerald-400' : 'bg-bone-500'}`} />
                  </button>
                  <button onClick={() => duplicate(p)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-bone-100" title="Duplicate"><Copy className="w-4 h-4" /></button>
                  <button onClick={() => navigate(`/admin/projects/${p.id}`)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-bone-100"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Delete this project?" message="This will also delete all media associated with this project. This action cannot be undone." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
