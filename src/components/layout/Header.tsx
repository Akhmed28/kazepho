import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FlaskConical, Menu, X, LogIn, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/problems" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>Problems</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>About</NavLink>

          {isAuthenticated && (
            <NavLink to="/add" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={() => setMenuOpen(false)}>
              <Plus size={14} /> Add Problem
            </NavLink>
          )}

          <div className={styles.actions}>
            {isAuthenticated ? (
              <button className={styles.authBtn} onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </button>
            ) : (
              <Link to="/login" className={styles.authBtn} onClick={() => setMenuOpen(false)}>
                <LogIn size={14} /> Admin
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
