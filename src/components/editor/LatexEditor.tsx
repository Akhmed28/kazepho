import { useState, useRef } from 'react';
import { Eye, Code2, ImagePlus, X } from 'lucide-react';
import LatexRenderer from '../ui/LatexRenderer';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LatexEditor.module.css';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

interface UploadedImage {
  name: string;
  dataUrl: string;
  tag: string;
}

export default function LatexEditor({ label, value, onChange, placeholder, rows = 6 }: Props) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    const readers = files.map(file => new Promise<UploadedImage>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const tag = `![${file.name}](${dataUrl})`;
        resolve({ name: file.name, dataUrl, tag });
      };
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
      const ta = textareaRef.current;
      const insertText = newImages.map(img => img.tag).join('\n');
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = value.slice(0, start);
        const after = value.slice(end);
        const newVal = before + (before && !before.endsWith('\n') ? '\n' : '') + insertText + (after && !after.startsWith('\n') ? '\n' : '') + after;
        onChange(newVal);
        setTimeout(() => {
          const pos = before.length + insertText.length + (before && !before.endsWith('\n') ? 1 : 0);
          ta.setSelectionRange(pos, pos);
          ta.focus();
        }, 0);
      } else {
        onChange(value + '\n' + insertText);
      }
      setUploading(false);
    });
    e.target.value = '';
  };

  const removeImage = (img: UploadedImage) => {
    setImages(prev => prev.filter(i => i.tag !== img.tag));
    onChange(value.replace(img.tag, '').replace(/\n\n+/g, '\n\n').trim());
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title={t('editor_upload_image')}
          >
            <ImagePlus size={13} />
            {uploading ? t('editor_uploading') : t('editor_upload_image')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'edit' ? styles.tabActive : ''}`}
              onClick={() => setMode('edit')}
            >
              <Code2 size={13} /> Edit
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'preview' ? styles.tabActive : ''}`}
              onClick={() => setMode('preview')}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          ref={textareaRef}
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

      {images.length > 0 && (
        <div className={styles.imageStrip}>
          {images.map(img => (
            <div key={img.tag} className={styles.imageThumbnailWrap}>
              <img src={img.dataUrl} alt={img.name} className={styles.imageThumbnail} />
              <button type="button" className={styles.imageThumbnailRemove} onClick={() => removeImage(img)} title="Remove image">
                <X size={10} />
              </button>
              <span className={styles.imageThumbnailName}>{img.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.hint}>
        {t('editor_tip')} <code>$F = ma$</code> {t('editor_tip2')} <code>$$E = mc^2$$</code> {t('editor_tip3')}
      </div>
    </div>
  );
}
