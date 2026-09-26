import { useEffect, useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video as VideoIcon, ArrowUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
      const { data: cats } = await supabase.from('project_categories').select('*').order('sort_order', { ascending: true });
      setCategories((cats as ProjectCategory[]) ?? []);

      if (projectId) {
        const { data: proj } = await supabase.from('projects').select('*').eq('id', projectId).maybeSingle();
        const { data: med } = await supabase.from('project_media').select('*').eq('project_id', projectId).order('sort_order', { ascending: true });
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
    const payload = {
      ...project,
      tools: project.tools ?? [],
      credits: project.credits ?? [],
    };
    if (projectId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', projectId);
      if (error) toast('Failed to save', 'error');
      else toast('Project saved');
    } else {
      const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
      if (error) toast('Failed to create', 'error');
      else { toast('Project created'); navigate(`/admin/projects/${data.id}`); }
    }
    setSaving(false);
  };

  const openPicker = (target: 'thumbnail' | 'video' | 'gallery') => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const onPick = (url: string) => {
    if (!project) return;
    if (pickerTarget === 'thumbnail') setProject({ ...project, thumbnail_url: url });
    else if (pickerTarget === 'video') setProject({ ...project, main_video_url: url });
    else if (pickerTarget === 'gallery' && projectId) {
      supabase.from('project_media').insert({ project_id: projectId, media_type: 'image', media_url: url, sort_order: media.length })
        .then(() => {
          supabase.from('project_media').select('*').eq('project_id', projectId).order('sort_order', { ascending: true })
            .then(({ data }) => setMedia((data as ProjectMedia[]) ?? []));
        });
    }
  };

  const removeMedia = async (mid: string) => {
    await supabase.from('project_media').delete().eq('id', mid);
    setMedia(media.filter((m) => m.id !== mid));
    toast('Media removed');
  };

  const moveMedia = async (mid: string, dir: -1 | 1) => {
    const idx = media.findIndex((m) => m.id === mid);
    const swap = media[idx + dir];
    if (!swap) return;
    await supabase.from('project_media').update({ sort_order: swap.sort_order }).eq('id', mid);
    await supabase.from('project_media').update({ sort_order: media[idx].sort_order }).eq('id', swap.id);
    const { data } = await supabase.from('project_media').select('*').eq('project_id', projectId).order('sort_order', { ascending: true });
    setMedia((data as ProjectMedia[]) ?? []);
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
            value={project.category_id ?? ''}
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
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <MediaPicker open={pickerOpen} onSelect={onPick} onClose={() => setPickerOpen(false)} filter={pickerTarget === 'video' ? 'video' : 'all'} />
    </div>
  );
}
