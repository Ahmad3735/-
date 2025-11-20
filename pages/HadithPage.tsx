
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { HADITHS } from '../components/ui/constants/islamicData';
import { useLanguage } from '../contexts/LanguageContext';

const HadithPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [expandedHadithId, setExpandedHadithId] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<number>(24);

  const toggleExplanation = (id: number) => {
    setExpandedHadithId(expandedHadithId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center animate-fade-in">
        <div className="inline-block p-3 bg-amber-100 dark:bg-amber-900/20 rounded-2xl mb-4 text-amber-600 dark:text-amber-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-amiri">{t.hadithPageTitle}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-light mb-6">{t.hadithPageDescription}</p>

        {/* Font Control */}
        <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.fontSize}</span>
            <span className="text-sm">A-</span>
            <input 
                type="range" 
                min="18" 
                max="40" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-32 accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-xl">A+</span>
        </div>
      </div>
      
      <div className="grid gap-8">
        {HADITHS.map((hadith, index) => (
          <Card key={hadith.id} className="group animate-slide-up hover:border-primary/30" style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
            <div className="relative">
              <div className="absolute -left-2 -top-2 text-8xl text-gray-100 dark:text-slate-800 -z-10 font-serif opacity-50 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                ❝
              </div>
              
              {/* Arabic Text */}
              <p 
                className="leading-[2.2] font-amiri text-center text-gray-800 dark:text-gray-100 mb-8 px-4"
                style={{ fontSize: `${fontSize}px` }}
              >
                {hadith.arabic}
              </p>
              
              {/* Source & Info & Actions */}
              <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-5 flex flex-col items-center text-center gap-4 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-secondary">المصدر</span>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {hadith.source}
                      </p>
                  </div>

                  <div className="w-full pt-2 border-t border-dashed border-gray-200 dark:border-gray-700/50 mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExplanation(hadith.id)}
                        className="text-xs w-full sm:w-auto min-w-[150px]"
                      >
                        {expandedHadithId === hadith.id ? t.hideExplanation : t.showExplanation}
                      </Button>
                  </div>
              </div>

              {/* Explanation Section */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedHadithId === hadith.id ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/10">
                      <h4 className="font-bold text-secondary-dark dark:text-secondary mb-2 flex items-center gap-2">
                          📚 {t.explanationTitle}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-loose font-kufi text-justify">
                          {hadith.explanation}
                      </p>
                  </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HadithPage;
