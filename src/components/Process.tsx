import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Process() {
  const { processSteps, copy } = usePortfolio();

  if (!processSteps || processSteps.length === 0) return null;

  return (
    <section id="process" className="section-pad py-24 md:py-32 lg:py-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.processLabel} title={copy.processTitle} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.id || step.number} variant="scale" delay={i * 120}>
              <div className="group relative h-full">
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-px bg-white/10" />
                )}
                <div className="relative p-8 rounded-2xl border hairline bg-ink-900 hover:border-accent/30 transition-all duration-500 h-full flex flex-col">
                  <div className="text-display text-5xl text-accent/20 group-hover:text-accent/40 transition-colors duration-500">
                    {step.number}
                  </div>
                  <h3 className="text-display text-xl text-bone-50 mt-6">{step.title}</h3>
                  <p className="text-bone-400 text-sm mt-3 leading-relaxed flex-grow whitespace-pre-wrap">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
