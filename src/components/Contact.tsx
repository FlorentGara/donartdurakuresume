import { useState, type FormEvent } from 'react';
import { Check, Copy, Mail, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { supabase } from '@/lib/supabase';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Contact() {
  const { socialLinks, siteSettings, categories } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' });

  const projectTypes = categories?.length 
    ? [...categories.map(c => c.name), 'Other'] 
    : ['Video Editing', 'Motion Graphics', 'Other'];

  const copyEmail = () => {
    const email = socialLinks?.find((s) => s.label === 'Email')?.url ?? siteSettings?.contact_email ?? '';
    if (email && email !== '[EMAIL]') {
      navigator.clipboard.writeText(email);
    } else {
      navigator.clipboard.writeText('donart.duraku@example.com');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        project_type: form.type,
        message: form.message,
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', type: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative">
        <SectionHeader label="08 — LET'S WORK" title="Have a story worth telling?" align="center" />

        <Reveal delay={200}>
          <p className="mt-8 text-center text-bone-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Let's turn your footage, ideas or next project into something people want to watch.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {/* Form */}
          <Reveal>
            {submitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center rounded-2xl border hairline bg-ink-900 p-10">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-display text-2xl text-bone-50">Message sent.</h3>
                <p className="text-bone-400 mt-3">Thanks for reaching out — I'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-label block mb-2">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-label block mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-label block mb-2">Project Type</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 focus:border-accent/50 focus:outline-none transition-colors duration-300 appearance-none"
                  >
                    <option value="" disabled>Select a project type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label block mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'START A CONVERSATION'}
                </button>
              </form>
            )}
          </Reveal>

          {/* Contact info */}
          <Reveal delay={150}>
            <div className="space-y-8">
              <div>
                <h3 className="text-label mb-4">Direct</h3>
                <button
                  onClick={copyEmail}
                  className="group flex items-center gap-3 text-bone-100 hover:text-accent transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span className="link-underline">
                    {socialLinks?.find((s) => s.label === 'Email')?.url ?? siteSettings?.contact_email ?? 'donart.duraku@example.com'}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-bone-500 group-hover:text-accent transition-colors" />
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-label mb-4">Social</h3>
                <div className="space-y-3">
                  {socialLinks
                    ?.filter((s) => s.label !== 'Email')
                    .map((link) => (
                      <a
                        key={link.id || link.label}
                        href={link.url.startsWith('http') ? link.url : undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between py-3 border-b hairline hover:border-accent/30 transition-colors duration-300"
                      >
                        <span className="text-bone-200 group-hover:text-accent transition-colors duration-300">
                          {link.label}
                        </span>
                        <span className="font-mono text-xs text-bone-500 group-hover:text-accent transition-colors">
                          {link.url}
                        </span>
                      </a>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-bone-400">
                  {siteSettings?.availability_status}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
