import { usePortfolio } from '@/lib/portfolio-context';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function About() {
  const { profile, copy } = usePortfolio();

  if (!profile) return null;

  const facts = [
    { label: copy.aboutBasedIn, value: profile.location },
    { label: copy.aboutSpecialization, value: profile.professional_title },
    { label: copy.aboutExperience, value: profile.experience },
    { label: copy.aboutAvailability, value: profile.availability_status },
  ];

  return (
    <section id="about" className="section-pad pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 relative">
      <div className="container-max">
        <SectionHeader label={copy.aboutLabel} title={profile.about_heading || copy.navAbout} />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Portrait */}
          {profile.profile_image_url && (
            <Reveal variant="clip" className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden hairline border">
                <div className="scroll-parallax-media absolute -inset-6">
                  <img
                    src={profile.profile_image_url}
                    alt={`Portrait of ${profile.full_name}`}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
              </div>
            </Reveal>
          )}

          {/* Bio + facts */}
          <div className={profile.profile_image_url ? "lg:col-span-7 flex flex-col justify-center" : "lg:col-span-12 flex flex-col justify-center max-w-4xl mx-auto"}>
            <Reveal>
              <p className="text-lg md:text-xl text-bone-200 leading-relaxed font-light whitespace-pre-wrap">
                {profile.about_description}
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
              {facts.map((fact, i) => (
                <Reveal key={fact.label} variant="scale" delay={i * 100}>
                  <div className="bg-ink-900 p-6 md:p-8 h-full">
                    <div className="text-label mb-2">{fact.label}</div>
                    <div className="text-bone-100 text-sm md:text-base font-medium">{fact.value}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
