
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FEELINGS_DATA } from '../components/ui/constants/feelingsData';
import { useLanguage } from '../contexts/LanguageContext';
import type { FeelingRemedy } from '../types';

const FeelingsPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingRemedy | null>(null);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-block p-4 bg-pink-100 dark:bg-pink-900/20 rounded-full mb-4 text-pink-600 dark:text-pink-400 shadow-lg">
            <span className="text-3xl">❤️</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-light mb-3 font-amiri">{t.feelingsTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.feelingsDescription}</p>
      </div>

      {!selectedFeeling ? (
        <div className="animate-slide-up">
            <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300 mb-6">{t.feelingsHowAreYou}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {FEELINGS_DATA.map((feeling, index) => (
                    <button
                        key={feeling.id}
                        onClick={() => setSelectedFeeling(feeling)}
                        className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 hover:border-primary/30 transition-all duration-200 flex flex-col items-center gap-3 text-center hover:-translate-y-1"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{feeling.emoji}</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary">
                            {lang === 'ar' ? feeling.emotionAr : feeling.emotionEn}
                        </span>
                    </button>
                ))}
            </div>
        </div>
      ) : (
        <div className="animate-fade-in max-w-3xl mx-auto">
             <Button onClick={() => setSelectedFeeling(null)} variant="ghost" className="mb-4">
                ← {t.search}
             </Button>
             
             <div className="space-y-6">
                 {/* Header */}
                 <div className="text-center mb-6">
                     <span className="text-6xl mb-2 block">{selectedFeeling.emoji}</span>
                     <h2 className="text-2xl font-bold text-primary dark:text-white">
                         {lang === 'ar' ? selectedFeeling.emotionAr : selectedFeeling.emotionEn}
                     </h2>
                 </div>

                 {/* 1. Quranic Prescription */}
                 <Card className="border-t-4 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10">
                     <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                         📖 {t.feelingsQuranicPrescription}
                     </h3>
                     <div className="space-y-6">
                         {selectedFeeling.verses.map((verse, idx) => (
                             <div key={idx} className="text-center">
                                 <p className="text-2xl font-amiri leading-loose text-gray-800 dark:text-gray-100 mb-3">
                                     {verse.arabic}
                                 </p>
                                 <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                     — {verse.surah}
                                 </p>
                                 {verse.tafsir && (
                                     <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-white/50 dark:bg-black/20 p-3 rounded-lg inline-block">
                                         💡 {verse.tafsir}
                                     </p>
                                 )}
                             </div>
                         ))}
                     </div>
                 </Card>

                 {/* 2. Prophetic Dua */}
                 <Card className="border-t-4 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10">
                     <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                         🤲 {t.feelingsPropheticDua}
                     </h3>
                     <p className="text-xl text-center font-amiri leading-loose text-gray-800 dark:text-gray-100">
                         {selectedFeeling.dua}
                     </p>
                 </Card>

                 {/* 3. Practical Step */}
                 <Card className="border-t-4 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10">
                     <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                         🛠️ {t.feelingsPracticalStep}
                     </h3>
                     <p className="text-lg text-center text-gray-700 dark:text-gray-200">
                         {selectedFeeling.actionStep}
                     </p>
                 </Card>
             </div>
        </div>
      )}
    </div>
  );
};

export default FeelingsPage;
