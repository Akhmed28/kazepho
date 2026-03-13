import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) { navigate('/'); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    setTimeout(() => {
      const ok = login(password);
      if (ok) { navigate('/'); }
      else { setError(t('login_error')); setLoading(false); }
    }, 600);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}><FlaskConical size={28} /></div>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('login_title')}</h1>
          <p className={styles.subtitle}>{t('login_subtitle')}</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t('login_password')}</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPw ? 'text' : 'password'}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)} tabIndex={-1}
                aria-label={showPw ? t('login_hide') : t('login_show')}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <button type="submit" className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ''}`} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : t('login_submit')}
          </button>
        </form>
        <div className={styles.hint}>
          <span>Demo password: </span><code>kazepho2024</code>
        </div>
        <Link to="/" className={styles.backLink}>{t('login_back')}</Link>
      </div>
    </div>
  );
}
