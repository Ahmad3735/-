
import React from 'react';
import { ARABIC_UI } from './constants/arabicUI';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-lightText py-8 text-center">
      <div className="container mx-auto">
        <p className="text-lg">{ARABIC_UI.footerQuote}</p>
        <p className="mt-2 text-sm">
          &copy; {currentYear} {ARABIC_UI.appName}. {ARABIC_UI.allRightsReserved}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;