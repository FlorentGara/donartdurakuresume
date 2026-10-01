import { useEffect, useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video as VideoIcon, ArrowUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Project, ProjectCategory, ProjectMedia } from '@/lib/types';
import { useToast } from './Toast';
import { PageHeader, Card, Input, Textarea, Select, Toggle, Button, LoadingSpinner } from './ui';
import { useHashRoute } from '@/hooks/useHashRoute';
import MediaPicker from './MediaPicker';

interface AdminProjectEditorProps {
  projectId?: string;
}

export default function AdminProjectEditor({ projectId }: AdminProjectEditorProps) {
  const toast = useToast();
  const { navigate } = useHashRoute();
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'thumbnail' | 'video' | 'gallery'>('thumbnail');

  useEffect(() => {
    async function load() {
      const catsSnapshot = await getDocs(query(collection(db, 'project_categories'), orderBy('sort_order', 'asc')));
      const cats = catsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategories((cats as ProjectCategory[]) ?? []);

      if (projectId) {
        const projDoc = await getDoc(doc(db, 'projects', projectId));
        const proj = projDoc.exists() ? { ...projDoc.data(), id: projDoc.id } : null;
        
        const medSnapshot = await getDocs(query(collection(db, 'project_media'), where('project_id', '==', projectId)));
        const med = (medSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProjectMedia[])
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
        
        setProject(proj as Project);
        setMedia((med as ProjectMedia[]) ?? []);
      } else {
        setProject({
          title: '', slug: '', category_name: 'Other', client: '[CLIENT]', year: String(new Date().getFullYear()),
          description: '', role: '', tools: [], credits: [], thumbnail_url: null, main_video_url: null,
          featured: false, published: true, sort_order: 0,
        });
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  const save = async () => {
    if (!project) return;
    setSaving(true);
    const now = new Date().toISOString();
    const payload = {
      ...Object.fromEntries(Object.entries(project).filter(([key]) => key !== 'id')),
      tools: project.tools ?? [],
      credits: project.credits ?? [],
      updated_at: now,
      ...(!projectId ? { created_at: now } : {}),
    };
    try {
      if (projectId) {
        await updateDoc(doc(db, 'projects', projectId), payload);
        toast('Project saved');
      } else {
        const docRef = await addDoc(collection(db, 'projects'), payload);
        toast('Project created');
        navigate(`/admin/projects/${docRef.id}`);
      }
    } catch {
      toast('Failed to save', 'error');
    }
    setSaving(false);
  };

  const openPicker = (target: 'thumbnail' | 'video' | 'gallery') => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const onPick = (url: string, type: 'image' | 'video' | 'document') => {
    if (!project) return;
    if (pickerTarget === 'thumbnail') setProject({ ...project, thumbnail_url: url });
    else if (pickerTarget === 'video') setProject({ ...project, main_video_url: url });
    else if (pickerTarget === 'gallery' && projectId) {
      addDoc(collection(db, 'project_media'), { project_id: projectId, media_type: type === 'video' ? 'video' : 'image', media_url: url, sort_order: media.length })
        .then(() => {
          getDocs(query(collection(db, 'project_media'), where('project_id', '==', projectId)))
            .then((snapshot) => setMedia((snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProjectMedia[])
              .sort((a, b) => a.sort_order - b.sort_order)));
        });
    }
  };

  const removeMedia = async (mid: string) => {
    await deleteDoc(doc(db, 'project_media', mid));
    setMedia(media.filter((m) => m.id !== mid));
    toast('Media removed');
  };

  const moveMedia = async (mid: string, dir: -1 | 1) => {
    const idx = media.findIndex((m) => m.id === mid);
    const swap = media[idx + dir];
    if (!swap) return;
    await updateDoc(doc(db, 'project_media', mid), { sort_order: swap.sort_order });
    await updateDoc(doc(db, 'project_media', swap.id), { sort_order: media[idx].sort_order });
    const snapshot = await getDocs(query(collection(db, 'project_media'), where('project_id', '==', projectId)));
    setMedia((snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ProjectMedia[])
      .sort((a, b) => a.sort_order - b.sort_order));
  };

  if (loading || !project) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title={projectId ? 'Edit Project' : 'New Project'}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/admin/projects')}>Back</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Input label="Title" value={project.title ?? ''} onChange={(v) => setProject({ ...project, title: v })} /></Card>
        <Card><Input label="Slug" value={project.slug ?? ''} onChange={(v) => setProject({ ...project, slug: v })} placeholder="my-project" /></Card>
        <Card>
          <Select
            label="Category"
            value={project.category_id ?? categories.find((category) => category.name === project.category_name)?.id ?? ''}
            onChange={(v) => {
              const cat = categories.find((c) => c.id === v);
              setProject({ ...project, category_id: v || null, category_name: cat?.name ?? 'Other' });
            }}
            options={[{ value: '', label: 'Other' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        </Card>
        <Card><Input label="Client" value={project.client ?? ''} onChange={(v) => setProject({ ...project, client: v })} /></Card>
        <Card><Input label="Year" value={project.year ?? ''} onChange={(v) => setProject({ ...project, year: v })} /></Card>
        <Card><Input label="Role" value={project.role ?? ''} onChange={(v) => setProject({ ...project, role: v })} /></Card>
        <Card className="lg:col-span-2"><Textarea label="Description" value={project.description ?? ''} onChange={(v) => setProject({ ...project, description: v })} rows={4} /></Card>
        <Card>
          <Input label="Tools (comma-separated)" value={(project.tools ?? []).join(', ')} onChange={(v) => setProject({ ...project, tools: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
        </Card>
        <Card>
          <Input label="Credits (comma-separated)" value={(project.credits ?? []).join(', ')} onChange={(v) => setProject({ ...project, credits: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
        </Card>
        <Card><Toggle label="Featured" checked={project.featured ?? false} onChange={(v) => setProject({ ...project, featured: v })} /></Card>
        <Card><Toggle label="Published" checked={project.published ?? false} onChange={(v) => setProject({ ...project, published: v })} /></Card>
      </div>

      {/* Thumbnail */}
      <div className="mt-6">
        <h2 className="text-bone-300 text-sm font-medium mb-4">Thumbnail</h2>
        <Card>
          {project.thumbnail_url ? (
            <div className="relative group">
              <img src={project.thumbnail_url} alt="" className="w-full aspect-video object-cover rounded-xl" />
              <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openPicker('thumbnail')} className="p-2 rounded-lg glass text-bone-100"><ImageIcon className="w-4 h-4" /></button>
                <button onClick={() => setProject({ ...project, thumbnail_url: null })} className="p-2 rounded-lg glass text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ) : (
            <button onClick={() => openPicker('thumbnail')} className="w-full aspect-video rounded-xl border-2 border-dashed hairline flex items-center justify-center text-bone-500 hover:text-accent hover:border-accent/30 transition-colors">
              <ImageIcon className="w-6 h-6 mb-2" />
              <span className="text-sm">Set thumbnail</span>
            </button>
          )}
        </Card>
      </div>

      {/* Main video */}
      <div className="mt-6">
        <h2 className="text-bone-300 text-sm font-medium mb-4">Main Video</h2>
        <Card>
          {project.main_video_url ? (
            <div className="relative group">
              <video src={project.main_video_url} controls className="w-full aspect-video object-cover rounded-xl" />
              <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openPicker('video')} className="p-2 rounded-lg glass text-bone-100"><VideoIcon className="w-4 h-4" /></button>
                <button onClick={() => setProject({ ...project, main_video_url: null })} className="p-2 rounded-lg glass text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ) : (
            <button onClick={() => openPicker('video')} className="w-full aspect-video rounded-xl border-2 border-dashed hairline flex items-center justify-center text-bone-500 hover:text-accent hover:border-accent/30 transition-colors">
              <VideoIcon className="w-6 h-6 mb-2" />
              <span className="text-sm">Set video</span>
            </button>
          )}
        </Card>
      </div>

      {/* Gallery */}
      {projectId && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-bone-300 text-sm font-medium">Gallery</h2>
            <Button variant="ghost" onClick={() => openPicker('gallery')}><Plus className="w-4 h-4 mr-2" />Add to Gallery</Button>
          </div>
          {media.length === 0 ? (
            <Card><p className="text-bone-500 text-sm text-center py-6">No gallery items yet.</p></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((m, i) => (
                <Card key={m.id} className="p-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-850 mb-2">
                    {m.media_type === 'video' ? <video src={m.media_url} className="w-full h-full object-cover" muted /> : <img src={m.media_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button onClick={() => moveMedia(m.id, -1)} disabled={i === 0} className="p-1 text-bone-500 hover:text-bone-100 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                      <button onClick={() => moveMedia(m.id, 1)} disabled={i === media.length - 1} className="p-1 text-bone-500 hover:text-bone-100 disabled:opacity-30 rotate-180"><ArrowUp className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeMedia(m.id)} className="p-1 text-bone-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <MediaPicker open={pickerOpen} onSelect={onPick} onClose={() => setPickerOpen(false)} filter={pickerTarget === 'video' ? 'video' : pickerTarget === 'thumbnail' ? 'image' : 'visual'} />
    </div>
  );
}
