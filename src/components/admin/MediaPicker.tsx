import { useEffect, useState } from 'react';
import { X, Link2, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/types';

interface MediaPickerProps {
  open: boolean;
  onSelect: (url: string, type: 'image' | 'video' | 'document') => void;
  onClose: () => void;
  filter?: 'image' | 'video' | 'visual' | 'all';
}

export default function MediaPicker({ open, onSelect, onClose, filter = 'all' }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    async function fetchAssets() {
      try {
        const snapshot = await getDocs(collection(db, 'media_assets'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MediaAsset[];
        setAssets(data.filter((asset) => filter === 'all' || asset.file_type === filter ||
          (filter === 'visual' && asset.file_type !== 'document'))
          .sort((a, b) => b.created_at.localeCompare(a.created_at)));
      } catch {
        setError('Could not load media. Check your Firebase access.');
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, [open, filter]);

  if (!open) return null;

  const filtered = assets.filter((a) => !search || a.filename.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-ink-950/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-3xl max-h-[80vh] rounded-2xl border hairline bg-ink-900 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b hairline">
          <h3 className="text-bone-100 font-medium">Select Media</h3>
          <button onClick={onClose} className="text-bone-400 hover:text-bone-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-2 p-4 border-b hairline">
          <button
            onClick={() => setUrlMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs ${!urlMode ? 'bg-accent text-ink-950' : 'bg-ink-850 text-bone-400'}`}
          >Library</button>
          <button
            onClick={() => setUrlMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs ${urlMode ? 'bg-accent text-ink-950' : 'bg-ink-850 text-bone-400'}`}
          >External URL</button>
        </div>

        {urlMode ? (
          <div className="p-6 flex-1">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" />
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-ink-850 border hairline rounded-xl pl-12 pr-4 py-3 text-bone-100 text-sm focus:border-accent/50 focus:outline-none"
                />
              </div>
              <button
                onClick={() => { if (urlInput) { onSelect(urlInput, filter === 'video' || /\.(mp4|mov|webm)(\?|$)/i.test(urlInput) ? 'video' : 'image'); setUrlInput(''); onClose(); } }}
                className="px-5 py-3 rounded-xl bg-accent text-ink-950 text-sm font-medium"
              >Use URL</button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b hairline">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-ink-850 border hairline rounded-xl pl-12 pr-4 py-2.5 text-bone-100 text-sm focus:border-accent/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-bone-500 text-sm text-center py-10">Loading...</p>
              ) : error ? (
                <p className="text-red-400 text-sm text-center py-10">{error}</p>
              ) : filtered.length === 0 ? (
                <p className="text-bone-500 text-sm text-center py-10">No media found. Upload files in the Media Library first.</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => { onSelect(asset.public_url, asset.file_type); onClose(); }}
                      className="group relative aspect-square rounded-xl overflow-hidden border hairline hover:border-accent/40 transition-colors"
                    >
                      {asset.file_type === 'image' && <img src={asset.public_url} alt={asset.filename} className="w-full h-full object-cover" loading="lazy" />}
                      {asset.file_type === 'video' && <video src={asset.public_url} className="w-full h-full object-cover" muted />}
                      {asset.file_type === 'document' && <div className="flex items-center justify-center h-full text-bone-500 text-xs">{asset.filename}</div>}
                      <div className="absolute inset-0 bg-ink-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-accent text-xs">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
