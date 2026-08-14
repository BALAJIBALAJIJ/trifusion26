import { useEffect, useRef, useMemo } from 'react';

const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px' }) => {
  const ref = useRef(null);
  const { threshold, rootMargin } = options;
  const memoizedOptions = useMemo(() => ({ threshold, rootMargin }), [threshold, rootMargin]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Optional: observer.unobserve(entry.target) to only reveal once
        } else {
          // entry.target.classList.remove('reveal-active');
        }
      });
    }, memoizedOptions);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      // add initial styles
      currentRef.classList.add('reveal-hidden', 'transition-all', 'duration-700', 'ease-out');
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [memoizedOptions]);

  return ref;
};

export default useScrollReveal;

