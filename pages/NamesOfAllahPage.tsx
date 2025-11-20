
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { NAMES_OF_ALLAH } from '../components/ui/constants/namesOfAllahData';
import { useLanguage } from '../contexts/LanguageContext';

const NamesOfAllahPage: React.FC = () => {
  const { t } = useLanguage();
  const [expandedNameId, setExpandedNameId] = useState<number | null>(null);

  const toggleExplanation = (id: number) => {
    setExpandedNameId(expandedNameId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4 text-purple-600 dark:text-purple-400 shadow-lg">
            <span className="text-3xl">✨</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-light mb-3 font-amiri">{t.namesOfAllahPageTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.namesOfAllahDescription}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {NAMES_OF_ALLAH.map((item, index) => (
            <button 
                key={item.id} 
                onClick={() => toggleExplanation(item.id)}
                className="animate-slide-up text-left w-full h-full" 
                style={{ animationDelay: `${Math.min(index * 30, 1000)}ms` }}
            >
                <Card className={`h-full transition-all duration-300 border-2 flex flex-col justify-center items-center text-center relative overflow-visible group ${expandedNameId === item.id ? 'border-primary shadow-glow scale-105 z-10' : 'border-transparent hover:border-primary/30'}`}>
                     {/* Number Badge */}
                     <span className="absolute top-2 right-2 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-slate-700 dark:text-gray-500 px-2 py-0.5 rounded-full">
                         {item.id}
                     </span>

                     <h2 className="text-2xl sm:text-3xl font-amiri font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                         {item.arabic}
                     </h2>
                     <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                         {item.english}
                     </p>

                     {/* Inline Expansion for simple grid */}
                     {expandedNameId === item.id && (
                         <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl z-20 flex flex-col items-center justify-center p-4 shadow-xl border-2 border-primary animate-fade-in">
                             <h3 className="text-2xl font-amiri font-bold text-primary mb-2">{item.arabic}</h3>
                             <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                                 {item.meaning}
                             </p>
                         </div>
                     )}
                </Card>
            </button>
        ))}
      </div>
    </div>
  );
};

export default NamesOfAllahPage;
