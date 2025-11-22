
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { DAILY_HADITH, QURAN_VERSES_FOR_HOME } from '../components/ui/constants/islamicData';
import type { DailyQuranVerse } from '../types';

const HomePage: React.FC = () => {
  const { t, lang } = useLanguage();

  // Initialize synchronously to prevent layout shift
  const [dailyVerse] = useState<DailyQuranVerse>(() => {
    const getDayOfYear = (date: Date) => {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    };

    const dayOfYear = getDayOfYear(new Date());
    const verseIndex = dayOfYear % QURAN_VERSES_FOR_HOME.length;
    return QURAN_VERSES_FOR_HOME[verseIndex];
  });

  // Updated text colors to 700 scale for better contrast ratio (Accessibility)
  const quickLinks = [
    { to: "/prayer-times", label: t.navPrayerTimes, icon: "🕒", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { to: "/quran", label: t.navQuran, icon: "📖", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
    { to: "/feelings", label: t.navFeelings, icon: "❤️", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
    { to: "/hadith", label: t.navHadith, icon: "📜", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    { to: "/adhkar", label: t.navAdhkar, icon: "📿", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
    { to: "/names-of-allah", label: t.navNamesOfAllah, icon: "✨", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
    { to: "/fasting", label: t.navFasting, icon: "📅", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
    { to: "/zakat", label: t.navZakat, icon: "💰", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { to: "/quiz", label: t.navQuiz, icon: "🧠", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in transform transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="relative z-10 px-6 py-16 sm:py-24 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 font-amiri leading-tight drop-shadow-lg">
            {t.welcomeTo} <span className="text-secondary-light">{t.appName}</span>
          </h1>
          <p className="text-lg sm:text-2xl mb-10 text-white/95 max-w-2xl mx-auto font-light leading-relaxed">
            {t.homeSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/prayer-times" aria-label={t.navPrayerTimes}>
                <Button variant="secondary" size="lg" className="shadow-xl min-w-[160px]">{t.navPrayerTimes}</Button>
            </Link>
            <Link to="/quran" aria-label={t.navQuran}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-dark dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary-dark min-w-[160px]">{t.navQuran}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Content Grid */}
      <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <Card className="border-t-4 border-primary h-full transform hover:-translate-y-1 transition-transform duration-300" title={t.dailyVerseTitle}>
           {dailyVerse ? (
            <div className="flex flex-col justify-between h-full">
              <div className="text-center mb-6">
                 <span className="text-6xl opacity-10 text-primary select-none">❝</span>
                 <p className="text-2xl sm:text-3xl leading-[2.5] font-amiri text-gray-800 dark:text-gray-200 relative z-10 -mt-8 px-2">
                    {dailyVerse.arabic}
                 </p>
                 <span className="text-6xl opacity-10 text-primary block text-left -mt-4 select-none">❞</span>
              </div>
              <p className="text-sm font-bold text-primary-dark text-center mt-4 bg-primary/10 py-3 px-6 rounded-full self-center">
                {dailyVerse.surah}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}
        </Card>

        <Card className="border-t-4 border-secondary h-full transform hover:-translate-y-1 transition-transform duration-300" title={t.dailyHadithTitle}>
          <div className="flex flex-col justify-between h-full">
             <div className="text-center mb-6">
                 <p className="text-xl sm:text-2xl leading-[2.5] font-amiri text-gray-800 dark:text-gray-200 px-2">
                    {DAILY_HADITH.arabic}
                 </p>
             </div>
             <p className="text-sm font-bold text-secondary-dark text-center mt-4 bg-secondary/10 py-3 px-6 rounded-full self-center">
                {DAILY_HADITH.source}
             </p>
          </div>
        </Card>
      </section>

      {/* Quick Access Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 inline-block">
            {t.quickAccess}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="group block h-full">
              <div className="bg-white dark:bg-darkSurface p-6 rounded-3xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center min-h-[160px] text-center h-full relative overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${item.color.split(' ')[0]}`}></div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                    {item.icon}
                </div>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                    {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
