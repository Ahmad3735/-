
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';
import { DAILY_HADITH, DAILY_QURAN_VERSE } from '../components/ui/constants/islamicData';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section 
        className="bg-cover bg-center rounded-xl p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/islamicart/1200/400')" }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-secondary">
            {ARABIC_UI.welcomeTo} {ARABIC_UI.appName}
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-accent">
            {ARABIC_UI.homeSubtitle}
          </p>
          <Button variant="secondary" className="text-xl px-8 py-4">
            <Link to="/ask-ai">{ARABIC_UI.exploreFeatures}</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card title={ARABIC_UI.dailyVerseTitle} className="hover:shadow-2xl transition-shadow duration-300">
          <p className="text-xl leading-relaxed mb-2 text-right font-kufi">
            {DAILY_QURAN_VERSE.arabic}
          </p>
          <p className="text-sm text-gray-500 text-left">{DAILY_QURAN_VERSE.surah}</p>
        </Card>
        <Card title={ARABIC_UI.dailyHadithTitle} className="hover:shadow-2xl transition-shadow duration-300">
          <p className="text-lg leading-relaxed mb-2 text-right font-kufi">
            {DAILY_HADITH.arabic}
          </p>
          <p className="text-sm text-gray-500 text-left">{DAILY_HADITH.source}</p>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold text-primary mb-6">{ARABIC_UI.quickAccess}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid for 5 items if needed, or make it 2x3 */}
          {[
            { to: "/prayer-times", label: ARABIC_UI.navPrayerTimes },
            { to: "/quran", label: ARABIC_UI.navQuran },
            { to: "/hadith", label: ARABIC_UI.navHadith },
            { to: "/hadith-verification", label: ARABIC_UI.navHadithVerification }, // New
            { to: "/ask-ai", label: ARABIC_UI.navAskAI },
          ].map(item => (
            <Link key={item.to} to={item.to} className="block">
              <Button variant="outline" className="w-full text-xl py-4">
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;