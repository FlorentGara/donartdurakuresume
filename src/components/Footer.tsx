import { navLinks } from '@/data/portfolio';
import { usePortfolio } from '@/lib/portfolio-context';

export default function Footer() {
  const { profile, socialLinks, siteSettings } = usePortfolio();

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="section-pad pt-20 pb-10 border-t hairline relative overflow-hidden">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-display text-2xl text-bone-50">{profile?.full_name?.toUpperCase()}</h3>
            <p className="text-bone-400 text-sm mt-2">{profile?.professional_title}</p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-label mb-4">Navigation</div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="link-underline text-bone-300 hover:text-bone-50 transition-colors text-sm w-fit"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="text-label mb-4">Connect</div>
            <div className="flex flex-col gap-2">
              {socialLinks?.map((link) => (
                <a
                  key={link.id || link.label}
                  href={link.url.startsWith('http') ? link.url : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-bone-300 hover:text-bone-50 transition-colors text-sm w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Animated tagline */}
        {siteSettings?.footer_text && (
          <div className="relative py-8 border-t hairline overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="text-display text-3xl md:text-5xl text-bone-500/30 mx-8"
                >
                  {siteSettings.footer_text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="font-mono text-xs text-bone-500">
            {siteSettings?.copyright_text || `© ${new Date().getFullYear()} ${profile?.full_name}. All rights reserved.`}
          </p>
          <p className="font-mono text-xs text-bone-500">
            {siteSettings?.footer_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
