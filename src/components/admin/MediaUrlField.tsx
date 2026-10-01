import { useState } from 'react';
import { Button, Input } from './ui';
import MediaPicker from './MediaPicker';

interface MediaUrlFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  filter?: 'image' | 'video' | 'all';
}

export default function MediaUrlField({ label, value, onChange, filter = 'all' }: MediaUrlFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Input label={label} value={value ?? ''} onChange={(next) => onChange(next || null)} placeholder="https://..." />
      <div className="flex gap-2 mt-2">
        <Button variant="ghost" onClick={() => setOpen(true)}>Choose from library</Button>
        {value && <Button variant="ghost" onClick={() => onChange(null)}>Remove</Button>}
      </div>
      <MediaPicker open={open} onSelect={(url) => onChange(url)} onClose={() => setOpen(false)} filter={filter} />
    </div>
  );
}
