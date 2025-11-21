
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// This page is deprecated and AI functionality has been removed.
const HadithVerificationPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-gray-500">{t.homeSubtitle}</p>
    </div>
  );
};

export default HadithVerificationPage;
