import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { Project } from '@/lib/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import ProjectModal from './ProjectModal';

export default function Work() {
  const { projects, categories, projectMedia, copy } = usePortfolio();
  const [active, setActive] = useState<string>('All');
  const [selected, setSelected] = useState<Project | null>(null);

  if (!projects || projects.length === 0) return null;

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.category_name === active);

  const catNames = ['All', ...(categories?.map(c => c.name) || [])];

  // Masonry sizing pattern — alternate spans for visual rhythm
  const sizeMap = [
    'lg:col-span-7 lg:row-span-2 aspect-[16/10]',
    'lg:col-span-5 aspect-[4/3]',
    'lg:col-span-5 aspect-[4/3]',
    'lg:col-span-7 aspect-[16/10]',
    'lg:col-span-4 aspect-square',
    'lg:col-span-4 aspect-square',
    'lg:col-span-4 aspect-square',
    'lg:col-span-12 aspect-[21/9]',
  ];

  return (
    <section id="work" className="section-pad py-24 md:py-32 lg:py-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.workLabel} title={copy.workTitle} />

        {/* Category filter */}
        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap gap-2 md:gap-3">
            {catNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-mono tracking-wide transition-all duration-300 border ${
                  active === cat
                    ? 'bg-accent text-ink-950 border-accent'
                    : 'text-bone-300 border-white/10 hover:border-accent/40 hover:text-bone-100'
                }`}
              >
                {(cat === 'All' ? copy.workAll : cat).toUpperCase()}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-auto">
          {filtered.map((project, i) => (
            <Reveal
              key={project.id}
              delay={(i % 4) * 100}
              variant="scale"
              className={sizeMap[i % sizeMap.length]}
            >
              <button
                onClick={() => setSelected(project)}
                data-cursor="view"
                className="group relative w-full h-full rounded-2xl overflow-hidden block text-left bg-ink-900/50"
              >
                <div className="scroll-parallax-media absolute -inset-6">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : project.main_video_url ? (
                    <video
                      src={project.main_video_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-ink-900 via-ink-950 to-accent/20" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Top meta */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full glass text-[10px] font-mono tracking-wide text-bone-200 uppercase">
                    {project.category_name}
                  </span>
                  <span className="text-[10px] font-mono text-bone-300">{project.year}</span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-display text-xl md:text-2xl text-bone-50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {project.title}
                      </h3>
                      <p className="text-bone-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                        {project.client} · {project.role}
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full border hairline flex items-center justify-center text-bone-200 group-hover:bg-accent group-hover:text-ink-950 group-hover:border-accent transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          media={projectMedia?.[selected.id] || []}
          onClose={() => setSelected(null)}
          onNext={() => {
            const idx = projects.findIndex((p) => p.id === selected.id);
            setSelected(projects[(idx + 1) % projects.length]);
          }}
        />
      )}
    </section>
  );
}
