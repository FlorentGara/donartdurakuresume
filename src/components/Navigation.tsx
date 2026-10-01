import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/portfolio';
import { usePortfolio } from '@/lib/portfolio-context';

export default function Navigation() {
  const { copy, profile, siteSettings } = usePortfolio();
  const labels: Record<string, string> = {
    '#work': copy.navWork, '#about': copy.navAbout, '#career': copy.navCareer,
    '#skills': copy.navSkills, '#contact': copy.navContact,
  };
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const marker = window.innerHeight * 0.35;
      let closest: { href: string; top: number } | null = null;
      for (const { href } of navLinks) {
        const top = document.querySelector(href)?.getBoundingClientRect().top;
        if (top !== undefined && top <= marker && (!closest || top > closest.top)) {
          closest = { href, top };
        }
      }
      setActiveHref(closest?.href ?? '');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="section-pad">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-semibold tracking-tightest text-bone-50 hover:text-accent transition-colors duration-300"
            >
              {siteSettings?.logo_url ? (
                <img src={siteSettings.logo_url} alt={profile?.full_name ?? 'Home'} className="h-9 w-auto max-w-40 object-contain" />
              ) : (profile?.full_name?.toUpperCase() ?? 'DONART DURAKU')}
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`link-underline text-sm transition-colors duration-300 ${activeHref === link.href ? 'text-accent' : 'text-bone-200 hover:text-bone-50'}`}
                  aria-current={activeHref === link.href ? 'location' : undefined}
                >
                  {labels[link.href] ?? link.label}
                </button>
              ))}
              <div className="flex items-center gap-2 pl-2 ml-2 border-l hairline">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-bone-400">
                  {copy.navAvailability}
                </span>
              </div>
            </div>

            <button
              className="lg:hidden text-bone-100 p-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-950 lg:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="text-sm font-semibold tracking-tightest text-bone-50">
            {siteSettings?.logo_url ? (
              <img src={siteSettings.logo_url} alt={profile?.full_name ?? 'Home'} className="h-9 w-auto max-w-40 object-contain" />
            ) : (profile?.full_name?.toUpperCase() ?? 'DONART DURAKU')}
          </span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-bone-100 p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col px-6 pt-12 gap-2">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`text-left text-4xl text-display hover:text-accent transition-all duration-500 py-3 border-b hairline ${activeHref === link.href ? 'text-accent' : 'text-bone-100'}`}
              aria-current={activeHref === link.href ? 'location' : undefined}
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ${i * 80 + 200}ms, transform 0.5s ${i * 80 + 200}ms`,
              }}
            >
                {labels[link.href] ?? link.label}
            </button>
          ))}
          <div className="flex items-center gap-2 mt-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-bone-400">
              {profile?.availability_status ?? copy.navAvailability}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
