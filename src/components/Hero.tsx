import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import ArrowButton from './ArrowButton';

export default function Hero() {
  const { profile, hero, copy } = usePortfolio();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToSection = (hash: string) => {
    if (hash.startsWith('#')) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = hash;
    }
  };

  if (!profile || !hero) return null;

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background media */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-out"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.08)',
        }}
      >
        {hero.background_type === 'video' && hero.background_media_url ? (
          <video
            src={hero.background_media_url}
            poster={hero.background_poster_url || ''}
            autoPlay={hero.background_video_autoplay}
            muted={hero.background_video_muted}
            loop={hero.background_video_loop}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={hero.background_media_url || ''}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        {/* Dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="absolute inset-0 bg-ink-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center section-pad pt-32 pb-20">
        <div className="container-max w-full">
          {/* Availability badge */}
          <div
            className="flex items-center gap-2 mb-8 transition-all duration-700"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '200ms',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone-300">
              {hero.availability_text}
            </span>
          </div>

          {/* Name */}
          <h1
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-bone-50 transition-all duration-800 ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '400ms',
            }}
          >
            {hero.hero_name?.toUpperCase()}
          </h1>

          {/* Title lines */}
          <div className="mt-4 overflow-hidden">
            <div
              className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-accent transition-all duration-800 ease-out"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                transitionDelay: '600ms',
              }}
            >
              {hero.main_title_line1}
            </div>
          </div>
          {hero.main_title_line2 && (
            <div className="overflow-hidden">
              <div
                className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone-200 transition-all duration-800 ease-out"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                  transitionDelay: '700ms',
                }}
              >
                {hero.main_title_line2}
              </div>
            </div>
          )}

          {/* Main statement */}
          <p
            className="mt-10 text-xl md:text-2xl text-bone-100 max-w-2xl font-light leading-snug transition-all duration-800 ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '900ms',
            }}
          >
            "{profile.hero_statement}"
          </p>

          {/* Supporting text */}
          <p
            className="mt-4 text-base text-bone-400 max-w-xl leading-relaxed transition-all duration-800 ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '1000ms',
            }}
          >
            {profile.hero_description}
          </p>

          {/* Buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-800 ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '1150ms',
            }}
          >
            {hero.primary_button_text && (
              <div className="group">
                <ArrowButton variant="primary" onClick={() => scrollToSection(hero.primary_button_link)}>
                  {hero.primary_button_text}
                </ArrowButton>
              </div>
            )}
            {hero.secondary_button_text && (
              <div className="group">
                <ArrowButton variant="ghost" onClick={() => scrollToSection(hero.secondary_button_link)}>
                  {hero.secondary_button_text}
                </ArrowButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-800"
        style={{
          opacity: loaded ? 1 : 0,
          transitionDelay: '1400ms',
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone-500">{copy.heroScroll}</span>
        <ArrowDown className="w-3 h-3 text-bone-500 animate-bounce" />
      </div>
    </section>
  );
}
