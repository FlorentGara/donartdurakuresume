import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { Project, ProjectMedia } from '@/lib/types';

interface ProjectModalProps {
  project: Project;
  media?: ProjectMedia[];
  onClose: () => void;
  onNext: () => void;
}

export default function ProjectModal({ project, media = [], onClose, onNext }: ProjectModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const gallery = media.filter(m => m.media_type !== 'thumbnail');
  const tools = Array.isArray(project.tools) ? project.tools : [];

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-ink-950/95 backdrop-blur-md">
      {/* Close bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 glass">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-bone-400">
          {project.category_name} — {project.year}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-bone-300 hover:text-accent transition-colors text-sm"
        >
          Close <X className="w-4 h-4" />
        </button>
      </div>

      <div className="section-pad py-12 md:py-16">
        <div className="container-max max-w-6xl">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-bone-50">{project.title}</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Category', value: project.category_name },
                { label: 'Year', value: project.year },
                { label: 'Client', value: project.client },
                { label: 'Role', value: project.role },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-label mb-1">{item.label}</div>
                  <div className="text-bone-100 text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main video / image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border hairline">
            {project.main_video_url ? (
              <video
                src={project.main_video_url}
                poster={project.thumbnail_url || ''}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={project.thumbnail_url || ''}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Description */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 className="text-label text-accent mb-4">About the project</h3>
              <p className="text-bone-200 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
            <div>
              <h3 className="text-label text-accent mb-4">My Role</h3>
              <p className="text-bone-200">{project.role}</p>
              
              {tools.length > 0 && (
                <>
                  <h3 className="text-label text-accent mb-4 mt-8">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((t) => (
                      <span
                        key={String(t)}
                        className="px-3 py-1 rounded-full text-xs font-mono text-bone-300 border hairline"
                      >
                        {String(t)}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {gallery.map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-video rounded-xl overflow-hidden border hairline"
                >
                  {m.media_type === 'video' ? (
                    <video
                      src={m.media_url}
                      poster={m.poster_url || ''}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={m.media_url}
                      alt={`${project.title} media`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Next project */}
          <div className="mt-16 pt-8 border-t hairline">
            <button
              onClick={onNext}
              className="group flex items-center justify-between w-full"
            >
              <div>
                <div className="text-label mb-2">Next Project</div>
                <span className="text-display text-2xl md:text-3xl text-bone-100 group-hover:text-accent transition-colors duration-300">
                  View next work
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border hairline flex items-center justify-center text-bone-200 group-hover:bg-accent group-hover:text-ink-950 group-hover:border-accent transition-all duration-500">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
