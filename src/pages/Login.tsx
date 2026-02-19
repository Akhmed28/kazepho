import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const ok = login(password);
      if (ok) {
        navigate('/');
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <FlaskConical size={28} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>
            Enter the admin password to manage problems.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPw ? 'text' : 'password'}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.hint}>
          <span>Demo password: </span>
          <code>kazepho2024</code>
        </div>

        <Link to="/" className={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
}
