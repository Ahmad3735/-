
import React from 'react';
import Card from '../components/ui/Card';
import { SURAH_AL_FATIHA } from '../components/ui/constants/islamicData';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';

const QuranPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card title={`${ARABIC_UI.quranPageTitle} - ${SURAH_AL_FATIHA.name}`}>
        <div className="mb-6 p-4 bg-primary-dark text-lightText rounded-lg shadow text-center">
           <h2 className="text-3xl font-bold">{SURAH_AL_FATIHA.name}</h2>
           <p className="text-lg">{`(${SURAH_AL_FATIHA.translationName})`}</p>
        </div>
        <div dir="rtl" className="space-y-6 text-right">
          {SURAH_AL_FATIHA.verses.map((verse) => (
            <div key={verse.id} className="pb-4 border-b border-gray-200 last:border-b-0">
              <p className="text-3xl font-kufi leading-loose text-darkText mb-2">
                {verse.arabic_text} 
                <span className="inline-block mx-2 text-lg text-secondary border border-secondary rounded-full w-8 h-8 leading-8 text-center">
                  {verse.id}
                </span>
              </p>
              {/* Placeholder for translation if added later 
              <p className="text-md text-gray-600 mt-1">{verse.translation}</p> 
              */}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuranPage;