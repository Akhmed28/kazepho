import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FlaskConical, Menu, X, LogIn, LogOut, Plus, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import styles from './Header.module.css';

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
];

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <div className={styles.brandIcon}>
            <FlaskConical size={18} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>KazEPhO</span>
            <span className={styles.brandSub}>Experimental Physics Olympiad</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>{t('nav_home')}</NavLink>
          <NavLink to="/problems" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>{t('nav_problems')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>{t('nav_about')}</NavLink>

          {isAuthenticated && (
            <NavLink to="/add" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>
              <Plus size={14} /> {t('nav_add')}
            </NavLink>
          )}

          <div className={styles.actions}>
            {/* Language Switcher */}
            <div className={styles.langWrap}>
              <button
                className={styles.langBtn}
                onClick={() => setLangOpen(v => !v)}
                aria-label="Change language"
              >
                <Globe size={13} />
                <span>{lang.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className={styles.langDropdown}>
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      <span className={styles.langCode}>{l.label}</span>
                      <span className={styles.langName}>{t(`lang_${l.code}` as any)}</span>
                    </button>
                  ))}
                </div>
              )}
              {langOpen && <div className={styles.langOverlay} onClick={() => setLangOpen(false)} />}
            </div>

            {isAuthenticated ? (
              <button className={styles.authBtn} onClick={handleLogout}>
                <LogOut size={14} /> {t('nav_signout')}
              </button>
            ) : (
              <Link to="/login" className={styles.authBtn} onClick={() => setMenuOpen(false)}>
                <LogIn size={14} /> {t('nav_admin')}
              </Link>
            )}
          </div>
        </nav>

        <button className={styles.menuToggle} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
