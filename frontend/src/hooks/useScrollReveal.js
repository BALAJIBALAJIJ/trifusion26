import { useEffect, useRef } from 'react';

const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px' }) => {
  const ref = useRef(null);

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
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      // add initial styles
      currentRef.classList.add('reveal-hidden', 'transition-all', 'duration-700', 'ease-out');
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.rootMargin]);

  return ref;
};

export default useScrollReveal;
