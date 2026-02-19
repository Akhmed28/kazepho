import { useState } from 'react';
import { Eye, Code2 } from 'lucide-react';
import LatexRenderer from '../ui/LatexRenderer';
import styles from './LatexEditor.module.css';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function LatexEditor({ label, value, onChange, placeholder, rows = 6 }: Props) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'edit' ? styles.tabActive : ''}`}
            onClick={() => setMode('edit')}
          >
            <Code2 size={13} />
            Edit
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'preview' ? styles.tabActive : ''}`}
            onClick={() => setMode('preview')}
          >
            <Eye size={13} />
            Preview
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Enter LaTeX-formatted text. Use $...$ for inline math and $$...$$ for display equations.'}
          rows={rows}
        />
      ) : (
        <div className={styles.preview}>
          {value ? (
            <LatexRenderer>{value}</LatexRenderer>
          ) : (
            <span className={styles.previewEmpty}>Nothing to preview yet…</span>
          )}
        </div>
      )}

      <div className={styles.hint}>
        Tip: Use <code>$F = ma$</code> for inline math, <code>$$E = mc^2$$</code> for display equations
      </div>
    </div>
  );
}
