import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-display text-2xl text-bone-50">{title}</h1>
        {description && <p className="text-bone-400 text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border hairline bg-ink-900 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Input({
  label, value, onChange, type = 'text', placeholder, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-label block mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-ink-850 border hairline rounded-xl px-4 py-3 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors"
      />
    </div>
  );
}

export function Textarea({
  label, value, onChange, rows = 4, placeholder, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-label block mb-2">{label}</label>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-ink-850 border hairline rounded-xl px-4 py-3 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

export function Select({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-label block mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink-850 border hairline rounded-xl px-4 py-3 text-bone-100 focus:border-accent/50 focus:outline-none transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Toggle({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bone-200 text-sm">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          checked ? 'bg-accent' : 'bg-ink-600'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-bone-50 transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function Button({
  children, onClick, variant = 'primary', type = 'button', disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const cls =
    variant === 'primary' ? 'btn-primary' :
    variant === 'danger' ? 'px-6 py-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium transition-all' :
    'btn-ghost';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${cls} disabled:opacity-50`}>
      {children}
    </button>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-accent animate-spin" />
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-bone-400 mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ConfirmDialog({
  open, title, message, onConfirm, onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-ink-950/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-md rounded-2xl border hairline bg-ink-900 p-8">
        <h3 className="text-display text-xl text-bone-50 mb-3">{title}</h3>
        <p className="text-bone-400 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${
      published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-bone-500/10 text-bone-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-emerald-400' : 'bg-bone-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
