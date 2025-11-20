
import React, { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-40 pointer-events-none">
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          pointer-events-auto
          p-3 rounded-full shadow-lg 
          bg-white dark:bg-slate-700 text-primary dark:text-primary-light
          border border-gray-100 dark:border-gray-600
          transition-all duration-300 transform
          hover:bg-gray-50 dark:hover:bg-slate-600 hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-primary
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        aria-label="Scroll to top"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTop;
