import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-white py-10 text-center dark:bg-gray-900 border-t-4 border-secondary/20">
      <div className="container mx-auto px-4">
        <p className="text-xl font-amiri mb-4 opacity-90 leading-relaxed">{t.footerQuote}</p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-sm opacity-80 font-medium">
           <p>&copy; {currentYear} {t.appName}.</p>
           <span className="hidden md:inline">•</span>
           <p>{t.allRightsReserved}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;