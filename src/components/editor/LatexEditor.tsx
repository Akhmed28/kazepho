import { useState, useRef, useEffect, useCallback } from 'react';
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
}

// Regex to match markdown image tags (including base64 data URLs)
const IMAGE_TAG_REGEX = /!\[([^\]]*)\]\((data:image\/[^)]+|https?:\/\/[^)]+)\)/g;

// Split a value string into plain text + images
function parseValue(value: string): { text: string; images: UploadedImage[] } {
  const images: UploadedImage[] = [];
  const text = value.replace(IMAGE_TAG_REGEX, (_match, name, dataUrl) => {
    images.push({ name, dataUrl });
    return '';
  }).replace(/\n{3,}/g, '\n\n').trim();
  return { text, images };
}

// Combine plain text + images back into a single value string
function buildValue(text: string, images: UploadedImage[]): string {
  const imageTags = images.map(img => `![${img.name}](${img.dataUrl})`).join('\n');
  if (!imageTags) return text;
  if (!text) return imageTags;
  return text + '\n' + imageTags;
}

export default function LatexEditor({ label, value, onChange, placeholder, rows = 6 }: Props) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse initial value into text + images
  const [textContent, setTextContent] = useState(() => parseValue(value).text);
  const [images, setImages] = useState<UploadedImage[]>(() => parseValue(value).images);

  // When the parent value changes (e.g. loading an existing problem),
  // re-parse it — but only if it differs from what we'd build ourselves
  const lastBuiltValue = useRef(buildValue(textContent, images));
  useEffect(() => {
    if (value !== lastBuiltValue.current) {
      const parsed = parseValue(value);
      setTextContent(parsed.text);
      setImages(parsed.images);
      lastBuiltValue.current = value;
    }
  }, [value]);

  // Whenever text or images change, push the combined value up to the parent
  const pushChange = useCallback((newText: string, newImages: UploadedImage[]) => {
    const combined = buildValue(newText, newImages);
    lastBuiltValue.current = combined;
    onChange(combined);
  }, [onChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextContent(newText);
    pushChange(newText, images);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    const readers = files.map(file => new Promise<UploadedImage>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        resolve({ name: file.name, dataUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(newImages => {
      const updated = [...images, ...newImages];
      setImages(updated);
      pushChange(textContent, updated);
      setUploading(false);
    });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    pushChange(textContent, updated);
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
        <>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={textContent}
            onChange={handleTextChange}
            placeholder={placeholder || 'Enter LaTeX-formatted text. Use $...$ for inline math and $$...$$ for display equations.'}
            rows={rows}
          />
          {images.length > 0 && (
            <div className={styles.imageStrip}>
              {images.map((img, i) => (
                <div key={i} className={styles.imageThumbnailWrap}>
                  <img src={img.dataUrl} alt={img.name} className={styles.imageThumbnail} />
                  <button
                    type="button"
                    className={styles.imageThumbnailRemove}
                    onClick={() => removeImage(i)}
                    title="Remove image"
                  >
                    <X size={10} />
                  </button>
                  <span className={styles.imageThumbnailName}>{img.name}</span>
                </div>
              ))}
            </div>
          )}
        </>
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
        {t('editor_tip')} <code>$F = ma$</code> {t('editor_tip2')} <code>$$E = mc^2$$</code> {t('editor_tip3')}
      </div>
    </div>
  );
}
