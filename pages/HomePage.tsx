
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { DAILY_HADITH, QURAN_VERSES_FOR_HOME } from '../components/ui/constants/islamicData';
import type { DailyQuranVerse } from '../types';

const HomePage: React.FC = () => {
  const [dailyVerse, setDailyVerse] = useState<DailyQuranVerse | null>(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const getDayOfYear = (date: Date) => {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    };

    const dayOfYear = getDayOfYear(new Date());
    const verseIndex = dayOfYear % QURAN_VERSES_FOR_HOME.length;
    setDailyVerse(QURAN_VERSES_FOR_HOME[verseIndex]);
  }, []);

  const quickLinks = [
    { to: "/prayer-times", label: t.navPrayerTimes, icon: "🕒", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" },
    { to: "/quran", label: t.navQuran, icon: "📖", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300" },
    { to: "/feelings", label: t.navFeelings, icon: "❤️", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300" }, // NEW
    { to: "/hadith", label: t.navHadith, icon: "📜", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" },
    { to: "/adhkar", label: t.navAdhkar, icon: "📿", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300" },
    { to: "/names-of-allah", label: t.navNamesOfAllah, icon: "✨", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" },
    { to: "/fasting", label: t.navFasting, icon: "📅", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300" },
    { to: "/zakat", label: t.navZakat, icon: "💰", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { to: "/quiz", label: t.navQuiz, icon: "🧠", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="relative z-10 px-6 py-16 sm:py-24 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-amiri leading-tight">
            {t.welcomeTo} <span className="text-secondary-light">{t.appName}</span>
          </h1>
          <p className="text-lg sm:text-2xl mb-10 text-white/90 max-w-2xl mx-auto font-light">
            {t.homeSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/prayer-times">
                <Button variant="secondary" size="lg" className="shadow-xl">{t.navPrayerTimes}</Button>
            </Link>
            <Link to="/quran">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-dark dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary-dark">{t.navQuran}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Content Grid */}
      <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <Card className="border-t-4 border-primary h-full" title={t.dailyVerseTitle}>
           {dailyVerse ? (
            <div className="flex flex-col justify-between h-full">
              <div className="text-center mb-4">
                 <span className="text-6xl opacity-10 text-primary">❝</span>
                 <p className="text-2xl sm:text-3xl leading-loose font-amiri text-gray-800 dark:text-gray-200 relative z-10 -mt-8">
                    {dailyVerse.arabic}
                 </p>
                 <span className="text-6xl opacity-10 text-primary block text-left -mt-4">❞</span>
              </div>
              <p className="text-sm font-medium text-primary text-center mt-4 bg-primary/10 py-2 px-4 rounded-full self-center">
                {dailyVerse.surah}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </Card>

        <Card className="border-t-4 border-secondary h-full" title={t.dailyHadithTitle}>
          <div className="flex flex-col justify-between h-full">
             <div className="text-center mb-4">
                 <p className="text-xl sm:text-2xl leading-loose font-amiri text-gray-800 dark:text-gray-200">
                    {DAILY_HADITH.arabic}
                 </p>
             </div>
             <p className="text-sm font-medium text-secondary text-center mt-4 bg-secondary/10 py-2 px-4 rounded-full self-center">
                {DAILY_HADITH.source}
             </p>
          </div>
        </Card>
      </section>

      {/* Quick Access Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 inline-block">
            {t.quickAccess}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="group">
              <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center h-full text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 ${item.color}`}>
                    {item.icon}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
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
