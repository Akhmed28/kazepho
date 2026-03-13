import { useState, useEffect } from 'react';

export function useScrollTop(threshold = 400) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return { visible, scrollToTop };
}
