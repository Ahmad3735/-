
import React from 'react';
import Card from '../components/ui/Card';
import { HADITHS } from '../components/ui/constants/islamicData';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';

const HadithPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">{ARABIC_UI.hadithPageTitle}</h1>
      {HADITHS.map((hadith, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
          <div dir="rtl" className="text-right">
            <p className="text-xl md:text-2xl font-kufi leading-relaxed text-darkText mb-3">
              {hadith.arabic}
            </p>
            <p className="text-md text-gray-500 text-left">
              {ARABIC_UI.source}: {hadith.source}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HadithPage;