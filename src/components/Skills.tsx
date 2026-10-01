import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Skills() {
  const { skills, copy } = usePortfolio();

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="section-pad py-24 md:py-32 lg:py-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.skillsLabel} title={copy.skillsTitle} />

        <div className="mt-16 flex flex-wrap gap-3 md:gap-4">
          {skills.map((skill, i) => (
            <Reveal key={skill.id || skill.name} variant="scale" delay={(i % 6) * 70}>
              <div
                data-cursor="link"
                className="group relative px-6 py-4 rounded-2xl border hairline bg-ink-900 hover:bg-ink-850 hover:border-accent/30 transition-all duration-500 cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors duration-500" />
                  <span className="text-bone-200 group-hover:text-bone-50 text-sm md:text-base font-medium transition-colors duration-300">
                    {skill.name}
                  </span>
                </div>
                <span className="absolute top-2 right-3 font-mono text-[8px] text-bone-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {skill.category}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
