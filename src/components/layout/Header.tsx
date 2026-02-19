import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FlaskConical, Menu, X, LogIn, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <FlaskConical size={22} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>KazEPhO</span>
            <span className={styles.brandSub}>Experimental Physics Olympiad</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            end
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/problems"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Problems
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/add"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Plus size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Add Problem
            </NavLink>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <button
              className={styles.authBtn}
              onClick={() => { logout(); navigate('/'); }}
              title="Sign out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link to="/login" className={styles.authBtn}>
              <LogIn size={16} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
