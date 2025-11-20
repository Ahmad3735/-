
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onThemeToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: t.navHome },
    { to: "/prayer-times", label: t.navPrayerTimes },
    { to: "/quran", label: t.navQuran },
    { to: "/hadith", label: t.navHadith },
    { to: "/adhkar", label: t.navAdhkar },
    { to: "/names-of-allah", label: t.navNamesOfAllah },
    { to: "/fasting", label: t.navFasting },
    { to: "/zakat", label: t.navZakat },
    { to: "/quiz", label: t.navQuiz },
    { to: "/qibla", label: t.navQibla },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-darkBg/80 backdrop-blur-xl shadow-glass border-b border-gray-200/50 dark:border-gray-800/50' 
          : 'bg-transparent pt-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20 bg-white/90 dark:bg-darkSurface/90 backdrop-blur-md rounded-2xl shadow-lg dark:shadow-black/20 px-4 sm:px-6'}`}>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2 text-primary-dark dark:text-primary">
              <span className="text-3xl">☪</span>
              <span className="font-amiri hidden sm:inline">{t.appName}</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden xl:block">
            <div className={`flex items-center ${lang === 'ar' ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary-dark dark:text-primary font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Controls (Theme, Lang, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
             {/* Theme Toggle */}
             <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl transition-all bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl font-bold text-xs transition-all bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 active:scale-95"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile Menu Button */}
            <div className="xl:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className={`xl:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'} bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg absolute w-full top-full left-0 border-t border-gray-100 dark:border-gray-800`}>
        <div className="px-4 pt-4 pb-8 space-y-2 overflow-y-auto max-h-[70vh]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-5 py-4 rounded-2xl text-base font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
