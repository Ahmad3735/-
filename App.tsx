
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import QuranPage from './pages/QuranPage';
import HadithPage from './pages/HadithPage';
import AskAIPage from './pages/AskAIPage';
import HadithVerificationPage from './pages/HadithVerificationPage'; // New
import Navbar from './components/Navbar';
import Footer from './components/ui/Footer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-accent text-darkText">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prayer-times" element={<PrayerTimesPage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/hadith" element={<HadithPage />} />
            <Route path="/ask-ai" element={<AskAIPage />} />
            <Route path="/hadith-verification" element={<HadithVerificationPage />} /> {/* New */}
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;