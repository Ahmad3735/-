import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-lightText py-8 text-center dark:bg-gray-900 border-t-2 border-primary">
      <div className="container mx-auto">
        <p className="text-lg">{t.footerQuote}</p>
        <p className="mt-2 text-sm">
          &copy; {currentYear} {t.appName}. {t.allRightsReserved}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;