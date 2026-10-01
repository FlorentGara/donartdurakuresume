import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Services() {
  const { services, copy } = usePortfolio();

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="section-pad py-24 md:py-32 lg:py-40 relative">
      <div className="container-max">
        <SectionHeader label={copy.servicesLabel} title={copy.servicesTitle} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border hairline">
          {services.map((service, i) => (
            <Reveal key={service.id || service.number} variant="scale" delay={(i % 3) * 120}>
              <div className="group relative h-full p-8 md:p-10 bg-ink-900 hover:bg-ink-850 transition-colors duration-500 overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/8 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full flex flex-col">
                  <div className="font-mono text-sm text-accent/60 mb-6">{service.number}</div>
                  <h3 className="text-display text-xl md:text-2xl text-bone-50 mb-3">{service.title}</h3>
                  <p className="text-bone-400 text-sm leading-relaxed flex-grow whitespace-pre-wrap">{service.description}</p>
                  <div className="mt-6 h-px w-0 bg-accent group-hover:w-12 transition-all duration-500" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
