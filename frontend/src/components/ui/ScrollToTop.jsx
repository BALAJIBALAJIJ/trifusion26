import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // useLayoutEffect runs before the browser paints
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Also use useEffect as a fallback for lazy-loaded pages
  useEffect(() => {
    window.scrollTo(0, 0);
    // Extra fallback with small delay for lazy-loaded components
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
