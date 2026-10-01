import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Education() {
  const { education, copy } = usePortfolio();

  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section-pad py-24 md:py-32 lg:py-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.educationLabel} title={copy.educationTitle} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {education.map((item, i) => (
            <Reveal key={item.id || i} delay={i * 150}>
              <div className="group relative h-full p-8 md:p-10 rounded-2xl border hairline bg-ink-900 hover:border-accent/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="text-label text-accent mb-4">{`${item.start_year} — ${item.end_year}`}</div>
                  <h3 className="text-display text-2xl md:text-3xl text-bone-50">{item.school}</h3>
                  <p className="text-bone-300 mt-2">{item.program}</p>
                  {item.description && (
                    <p className="text-bone-400 mt-4 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
