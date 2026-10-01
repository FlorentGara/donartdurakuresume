import { useEffect, useState } from 'react';
import { Upload, Search, Trash2, Copy, Check, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/types';
import { removeMediaFromSite } from '@/lib/removeMediaFromSite';
import { useToast } from './Toast';
import { PageHeader, Card, LoadingSpinner, EmptyState, ConfirmDialog } from './ui';

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

const ACCEPTED: Record<string, { type: string; label: string }> = {
  'image/': { type: 'image', label: 'Image' },
  'video/': { type: 'video', label: 'Video' },
  'application/pdf': { type: 'document', label: 'Document' },
};

export default function AdminMedia() {
  const toast = useToast();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const load = async () => {
    const q = query(collection(db, 'media_assets'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAssets((data as MediaAsset[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    let uploaded = 0;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast('Cloudinary configuration is missing in .env', 'error');
      setUploading(false);
      return;
    }

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        toast(`${file.name} exceeds 100MB limit`, 'error');
        continue;
      }

      const match = Object.entries(ACCEPTED).find(([prefix]) => file.type.startsWith(prefix));
      if (!match) {
        toast(`${file.name}: unsupported file type`, 'error');
        continue;
      }

      const { type } = match[1];

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Upload to Cloudinary
        const resourceType = type === 'video' ? 'video' : (type === 'document' ? 'raw' : 'image');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }

        const data = await res.json();

        // Save metadata to Firestore
        await addDoc(collection(db, 'media_assets'), {
          filename: file.name,
          file_type: type,
          file_size: file.size,
          mime_type: file.type,
          public_url: data.secure_url,
          cloudinary_public_id: data.public_id,
          cloudinary_resource_type: data.resource_type,
          created_at: new Date().toISOString()
        });
        uploaded++;
      } catch {
        toast(`Failed to upload ${file.name}`, 'error');
        continue;
      }
    }

    setUploading(false);
    if (uploaded) toast(`${uploaded} file${uploaded === 1 ? '' : 's'} uploaded`);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    const asset = assets.find((item) => item.id === deleteId);
    if (!asset) return;
    try {
      await removeMediaFromSite(deleteId, asset.public_url);
      setDeleteId(null);
      toast('Media removed from the website and library');
      load();
    } catch {
      toast('Could not remove media', 'error');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = assets.filter((a) => {
    if (filter !== 'all' && a.file_type !== filter) return false;
    if (search && !a.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Media Library" description="Upload and manage images, videos and documents." />

      {/* Upload zone */}
      <Card className="mb-6">
        <label className="flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-ink-850 transition-colors rounded-xl">
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-bone-400 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <p className="text-bone-200 text-sm">Click to upload or drag files here</p>
              <p className="text-bone-500 text-xs mt-1">Images, videos and PDFs up to 100MB</p>
            </>
          )}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            accept="image/*,video/*,.pdf"
          />
        </label>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-ink-900 border hairline rounded-xl pl-12 pr-4 py-3 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'image', 'video', 'document'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-sm capitalize transition-colors ${filter === f ? 'bg-accent text-ink-950' : 'bg-ink-900 text-bone-400 border hairline'}`}
            >
              {f}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="No media found." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <Card key={asset.id} className="p-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-850 mb-3">
                {asset.file_type === 'image' && <img src={asset.public_url} alt={asset.filename} className="w-full h-full object-cover" loading="lazy" />}
                {asset.file_type === 'video' && <video src={asset.public_url} className="w-full h-full object-cover" muted />}
                {asset.file_type === 'document' && (
                  <div className="flex items-center justify-center h-full"><FileText className="w-8 h-8 text-bone-500" /></div>
                )}
              </div>
              <p className="text-bone-200 text-xs truncate mb-1">{asset.filename}</p>
              <div className="flex items-center justify-between">
                <span className="text-bone-500 text-[10px]">{formatSize(asset.file_size)}</span>
                <div className="flex gap-1">
                  <button onClick={() => copyUrl(asset.public_url)} className="p-1.5 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-bone-100">
                    {copiedUrl === asset.public_url ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button onClick={() => setDeleteId(asset.id!)} className="p-1.5 rounded-lg hover:bg-ink-850 text-bone-400 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Remove this media?" message="This removes the file from the website and library. The stored file remains in Cloudinary until you delete it there." onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
