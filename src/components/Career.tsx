import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Career() {
  const { career, copy } = usePortfolio();

  if (!career || career.length === 0) return null;

  return (
    <section id="career" className="section-pad pt-12 pb-24 md:pt-16 md:pb-32 lg:pt-20 lg:pb-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.careerLabel} title={copy.careerTitle} />

        <div className="mt-16 md:mt-20 relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2" />
          {/* Animated fill line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 w-px bg-accent/60 md:-translate-x-1/2 origin-top"
            style={{ height: '100%', transform: 'scaleY(0)', animation: 'lineGrow 1.5s ease-out forwards' }}
            ref={(el) => {
              if (!el) return;
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    el.style.transform = 'scaleY(1)';
                    observer.disconnect();
                  }
                },
                { threshold: 0.05 }
              );
              observer.observe(el);
            }}
          />

          <div className="space-y-12 md:space-y-20">
            {career.map((item, i) => {
              const isLeft = i % 2 === 0;
              const period = `${item.start_date} — ${item.is_current ? 'Present' : item.end_date}`;
              const responsibilities = Array.isArray(item.responsibilities) ? item.responsibilities : [];
              const skills = Array.isArray(item.skills) ? item.skills : [];

              return (
                <div
                  key={item.id || i}
                  className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${
                    isLeft ? '' : 'md:[direction:rtl]'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10">
                    <span className="block w-3 h-3 rounded-full bg-accent ring-4 ring-ink-950" />
                  </div>

                  <div className={`md:[direction:ltr] ${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                    <Reveal>
                      <div className="text-label text-accent mb-3">{period}</div>
                      <h3 className="text-display text-2xl md:text-3xl text-bone-50">{item.position}</h3>
                      <p className="text-bone-400 text-sm mt-1">{item.company}</p>
                      <p className="text-bone-200 mt-4 leading-relaxed whitespace-pre-wrap">{item.description}</p>

                      {responsibilities.length > 0 && (
                        <ul className={`mt-6 space-y-2 ${isLeft ? 'md:justify-end' : ''}`}>
                          {responsibilities.map((r, j) => (
                            <li
                              key={j}
                              className={`flex items-start gap-2 text-sm text-bone-300 ${
                                isLeft ? 'md:flex-row-reverse md:text-right' : ''
                              }`}
                            >
                              <span className="text-accent mt-1.5 text-[6px]">●</span>
                              <span>{String(r)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {skills.length > 0 && (
                        <div className={`mt-6 flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                          {skills.map((s) => (
                            <span
                              key={String(s)}
                              className="px-3 py-1 rounded-full text-xs font-mono text-bone-300 border hairline"
                            >
                              {String(s)}
                            </span>
                          ))}
                        </div>
                      )}
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
