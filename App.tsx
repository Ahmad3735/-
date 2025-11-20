
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import QuranPage from './pages/QuranPage';
import HadithPage from './pages/HadithPage';
import PrayerTimesMapPage from './pages/PrayerTimesMapPage';
import QiblaPage from './pages/QiblaPage';
import AdhkarPage from './pages/AdhkarPage';
import NamesOfAllahPage from './pages/NamesOfAllahPage';
import FastingCalendarPage from './pages/FastingCalendarPage';
import ZakatPage from './pages/ZakatPage';
import QuizPage from './pages/QuizPage';
import FastingReminder from './components/FastingReminder';
import Navbar from './components/Navbar';
import Footer from './components/ui/Footer';
import SEO from './components/SEO';
import GlobalPlayer from './components/GlobalPlayer';
import ScrollToTop from './components/ScrollToTop';
import { LanguageContext } from './contexts/LanguageContext';
import { AudioProvider } from './contexts/AudioContext';
import { translations } from './i18n';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const storedLang = localStorage.getItem('lang');
    return (storedLang === 'ar' || storedLang === 'en') ? storedLang : 'ar';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.remove('font-kufi', 'font-sans');
    document.body.classList.add(lang === 'ar' ? 'font-kufi' : 'font-sans');
  }, [lang]);
  
  const languageContextValue = useMemo(() => ({
    lang,
    toggleLanguage,
    t: translations[lang],
  }), [lang, toggleLanguage]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <AudioProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 relative">
            <Navbar 
              theme={theme}
              onThemeToggle={toggleTheme}
            />
            <FastingReminder />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
              <Routes>
                <Route path="/" element={<><SEO title={t.navHome} /><HomePage /></>} />
                <Route path="/prayer-times" element={<><SEO title={t.navPrayerTimes} /><PrayerTimesPage /></>} />
                <Route path="/prayer-times-map" element={<><SEO title={t.navPrayerTimesMap} /><PrayerTimesMapPage /></>} />
                <Route path="/quran" element={<><SEO title={t.navQuran} /><QuranPage /></>} />
                <Route path="/hadith" element={<><SEO title={t.navHadith} /><HadithPage /></>} />
                <Route path="/adhkar" element={<><SEO title={t.navAdhkar} /><AdhkarPage /></>} />
                <Route path="/names-of-allah" element={<><SEO title={t.navNamesOfAllah} /><NamesOfAllahPage /></>} />
                <Route path="/fasting" element={<><SEO title={t.navFasting} /><FastingCalendarPage /></>} />
                <Route path="/zakat" element={<><SEO title={t.navZakat} /><ZakatPage /></>} />
                <Route path="/quiz" element={<><SEO title={t.navQuiz} /><QuizPage /></>} />
                <Route path="/qibla" element={<><SEO title={t.navQibla} /><QiblaPage /></>} />
              </Routes>
            </main>
            <Footer />
            <GlobalPlayer />
            <ScrollToTop />
          </div>
        </HashRouter>
      </AudioProvider>
    </LanguageContext.Provider>
  );
};

export default App;
