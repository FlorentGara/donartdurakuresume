import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Career() {
  const { career, copy } = usePortfolio();

  if (!career || career.length === 0) return null;

  return (
    <section id="career" className="section-pad pt-12 pb-12 md:pt-16 md:pb-16 relative">
      <div className="container-max">
        <SectionHeader label={copy.careerLabel} title={copy.careerTitle} />

        <div className="mt-10 md:mt-14 max-w-5xl border-l border-accent/30">
          {career.map((item, i) => {
            const period = `${item.start_date} — ${item.is_current ? 'Present' : item.end_date}`;
            const responsibilities = Array.isArray(item.responsibilities) ? item.responsibilities : [];
            const skills = Array.isArray(item.skills) ? item.skills : [];

            return (
              <Reveal key={item.id || i} className="relative pl-7 md:pl-10 pb-10 last:pb-0">
                <span className="absolute -left-[6px] top-2 w-[11px] h-[11px] rounded-full bg-accent ring-4 ring-ink-950" />
                <div className="grid gap-3 md:grid-cols-[170px_minmax(0,1fr)] md:gap-8">
                  <div className="text-label text-accent pt-1">{period}</div>
                  <div className="max-w-3xl">
                    <h3 className="text-display text-2xl md:text-3xl text-bone-50">{item.position}</h3>
                    <p className="text-bone-400 text-sm mt-2">{item.company}</p>
                    {item.description && (
                      <p className="text-bone-200 mt-4 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                    )}

                    {responsibilities.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {responsibilities.map((responsibility, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-bone-300">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            <span>{String(responsibility)}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {skills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span key={String(skill)} className="px-3 py-1 rounded-full text-xs font-mono text-bone-300 border hairline">
                            {String(skill)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
