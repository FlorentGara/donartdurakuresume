import { useState, type FormEvent } from 'react';
import { Check, Copy, Mail, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Contact() {
  const { socialLinks, siteSettings, categories, profile, copy } = usePortfolio();
  const contactEmail = [
    socialLinks?.find((s) => s.label === 'Email')?.url,
    siteSettings?.contact_email,
    profile?.email,
  ].find((value) => value && value.includes('@') && !value.startsWith('['));
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' });

  const projectTypes = categories?.length 
    ? [...new Set([...categories.map(c => c.name), copy.contactOtherType])]
    : ['Video Editing', 'Motion Graphics', copy.contactOtherType];

  const copyEmail = () => {
    if (!contactEmail) return;
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: form.name,
        email: form.email,
        project_type: form.type,
        message: form.message,
        is_read: false,
        status: 'unread',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', type: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert(copy.contactSendError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative">
        <SectionHeader label={copy.contactLabel} title={copy.contactTitle} align="center" />

        <Reveal delay={200}>
          <p className="mt-8 text-center text-bone-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {copy.contactIntro}
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {/* Form */}
          <Reveal variant="left">
            {submitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center rounded-2xl border hairline bg-ink-900 p-10">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-display text-2xl text-bone-50">{copy.contactSentTitle}</h3>
                <p className="text-bone-400 mt-3">{copy.contactSentBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-label block mb-2">{copy.contactName}</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300"
                    placeholder={copy.contactNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="text-label block mb-2">{copy.contactEmail}</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300"
                    placeholder={copy.contactEmailPlaceholder}
                  />
                </div>
                <div>
                  <label className="text-label block mb-2">{copy.contactProjectType}</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 focus:border-accent/50 focus:outline-none transition-colors duration-300 appearance-none"
                  >
                    <option value="" disabled>{copy.contactProjectTypePlaceholder}</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label block mb-2">{copy.contactMessage}</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder={copy.contactMessagePlaceholder}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : copy.contactButton}
                </button>
              </form>
            )}
          </Reveal>

          {/* Contact info */}
          <Reveal variant="right" delay={150}>
            <div className="space-y-8">
              <div>
                <h3 className="text-label mb-4">{copy.contactDirect}</h3>
                <button
                  onClick={copyEmail}
                  disabled={!contactEmail}
                  className="group flex items-center gap-3 text-bone-100 hover:text-accent transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span className="link-underline">
                    {contactEmail ?? copy.contactEmailUnavailable}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-bone-500 group-hover:text-accent transition-colors" />
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-label mb-4">{copy.contactSocial}</h3>
                <div className="space-y-3">
                  {socialLinks
                    ?.filter((s) => s.label !== 'Email' && s.url.startsWith('http'))
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
