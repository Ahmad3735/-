
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ADHKAR_DATA } from '../components/ui/constants/adhkarData';
import { useLanguage } from '../contexts/LanguageContext';
import type { AdhkarCategory } from '../types';

const AdhkarPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdhkarCategory>('morning');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  
  // Masbaha State
  const [masbahaCount, setMasbahaCount] = useState<number>(0);
  const [masbahaTotal, setMasbahaTotal] = useState<number>(0);
  const [activeVirtue, setActiveVirtue] = useState<string | null>(null);
  const virtueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSection = ADHKAR_DATA.find(s => s.id === activeTab) || ADHKAR_DATA[0];

  // Load saved progress from local storage
  useEffect(() => {
    const savedCounts = localStorage.getItem('adhkar_counts');
    const savedCompleted = localStorage.getItem('adhkar_completed');
    const savedMasbaha = localStorage.getItem('masbaha_total');
    
    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted));
    if (savedMasbaha) setMasbahaTotal(parseInt(savedMasbaha, 10));
  }, []);

  // Save progress to local storage
  useEffect(() => {
    localStorage.setItem('adhkar_counts', JSON.stringify(counts));
    localStorage.setItem('adhkar_completed', JSON.stringify(completed));
  }, [counts, completed]);

  useEffect(() => {
      localStorage.setItem('masbaha_total', masbahaTotal.toString());
  }, [masbahaTotal]);

  const handleIncrement = (id: number, target: number) => {
    const key = `${activeTab}-${id}`;
    const current = counts[key] || 0;
    
    if (current < target) {
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
      
      const newCount = current + 1;
      setCounts(prev => ({ ...prev, [key]: newCount }));
      
      if (newCount === target) {
        setCompleted(prev => ({ ...prev, [key]: true }));
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }
    }
  };

  // Masbaha Logic
  const handleMasbahaClick = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    
    const newCount = masbahaCount + 1;
    setMasbahaCount(newCount);
    setMasbahaTotal(prev => prev + 1);

    // Virtue Logic
    let virtue = null;
    if (newCount === 33 || newCount === 66 || newCount === 99) {
        if (navigator.vibrate) navigator.vibrate(30);
        virtue = t.masbahaVirtue33;
    } else if (newCount === 100) {
        if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
        virtue = t.masbahaVirtue100;
    } else if (newCount % 1000 === 0) {
        if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100]);
        virtue = t.masbahaVirtue1000;
    }

    if (virtue) {
        setActiveVirtue(virtue);
        // Clear previous timeout if user taps fast
        if (virtueTimeoutRef.current) clearTimeout(virtueTimeoutRef.current);
        // Auto hide after 5 seconds
        virtueTimeoutRef.current = setTimeout(() => {
            setActiveVirtue(null);
        }, 8000);
    }
  };

  const resetMasbaha = () => {
      setMasbahaCount(0);
      setActiveVirtue(null);
  };

  const handleReset = () => {
     if (window.confirm(t.adhkarReset + '?')) {
        setCounts({});
        setCompleted({});
     }
  };

  const tabs: { id: AdhkarCategory; label: string }[] = [
    { id: 'morning', label: t.adhkarMorning },
    { id: 'evening', label: t.adhkarEvening },
    { id: 'sleep', label: t.adhkarSleep },
    { id: 'postPrayer', label: t.adhkarPostPrayer },
    { id: 'masbaha', label: t.masbahaTitle },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mb-4 text-emerald-600 dark:text-emerald-400 shadow-lg">
            <span className="text-3xl">📿</span>
        </div>
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2 font-amiri">{t.adhkarPageTitle}</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'masbaha' ? (
          <div className="animate-fade-in flex flex-col items-center">
              {/* Masbaha UI */}
              <Card className="w-full max-w-md p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Virtue Popup */}
                    <div className={`absolute inset-0 bg-primary/95 z-20 flex items-center justify-center p-6 text-center transition-opacity duration-500 ${activeVirtue ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div>
                            <p className="text-white text-lg sm:text-xl font-amiri leading-loose mb-6">
                                {activeVirtue}
                            </p>
                            <Button onClick={() => setActiveVirtue(null)} variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100">
                                {t.reminderDismiss}
                            </Button>
                        </div>
                    </div>

                   <div className="absolute top-4 right-4">
                       <button onClick={resetMasbaha} className="text-gray-400 hover:text-red-500 transition-colors text-sm" title={t.adhkarReset}>
                           ↺
                       </button>
                   </div>

                   <div className="mb-8 text-center">
                       <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">{t.masbahaTotal}</p>
                       <p className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-200">{masbahaTotal}</p>
                   </div>

                   {/* Big Button */}
                   <button
                       onClick={handleMasbahaClick}
                       className="
                           w-56 h-56 sm:w-64 sm:h-64 rounded-full 
                           bg-gradient-to-br from-emerald-400 to-emerald-600 
                           dark:from-emerald-600 dark:to-emerald-800
                           shadow-[0_10px_40px_rgba(16,185,129,0.4)]
                           active:shadow-inner active:scale-95 
                           transition-all duration-150 ease-out
                           flex flex-col items-center justify-center
                           group
                           relative
                           border-8 border-white/20
                       "
                   >
                       <span className="text-7xl sm:text-8xl font-bold text-white font-mono drop-shadow-md select-none">
                           {masbahaCount}
                       </span>
                       <span className="text-white/70 text-sm mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                           {t.masbahaTapInstruction}
                       </span>
                       
                       {/* Ripple effect container */}
                       <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                           <div className="w-full h-full bg-white/10 rounded-full scale-0 active:scale-100 transition-transform duration-300"></div>
                       </div>
                   </button>
              </Card>
              <div className="mt-6 text-center max-w-md px-4 text-gray-500 dark:text-gray-400 text-sm">
                  <p>{t.masbahaVirtue100}</p>
              </div>
          </div>
      ) : (
          /* Standard Adhkar List */
          <>
            <div className="space-y-6">
                {activeSection.items.map((dhikr, index) => {
                const key = `${activeTab}-${dhikr.id}`;
                const currentCount = counts[key] || 0;
                const isDone = completed[key];
                const progress = (currentCount / dhikr.count) * 100;

                return (
                    <div key={dhikr.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <Card 
                        className={`relative overflow-hidden transition-all duration-300 ${isDone ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : ''}`}
                        >
                        {/* Progress Bar Background */}
                        <div 
                            className="absolute bottom-0 right-0 left-0 h-1.5 bg-gray-100 dark:bg-slate-700"
                        >
                            <div 
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="relative p-2">
                            <div className="mb-6">
                                <p className="text-xl sm:text-2xl font-amiri leading-loose text-center text-gray-800 dark:text-gray-100">
                                    {dhikr.text}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
                                    {dhikr.virtue && <p className="mb-1"><span className="font-bold text-secondary">الفضل:</span> {dhikr.virtue}</p>}
                                    {dhikr.source && <p><span className="font-bold text-gray-400">المصدر:</span> {dhikr.source}</p>}
                                </div>

                                <button
                                    onClick={() => handleIncrement(dhikr.id, dhikr.count)}
                                    disabled={isDone}
                                    className={`
                                        relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95 shadow-inner
                                        ${isDone 
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 cursor-default' 
                                            : 'bg-gray-100 text-primary hover:bg-gray-200 dark:bg-slate-700 dark:text-primary-light dark:hover:bg-slate-600 cursor-pointer'
                                        }
                                    `}
                                >
                                    {isDone ? (
                                        <span className="text-2xl">✓</span>
                                    ) : (
                                        <>
                                            <span className="text-2xl sm:text-3xl font-bold font-mono">{currentCount}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">/ {dhikr.count}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        </Card>
                    </div>
                );
                })}
            </div>

            <div className="mt-10 flex justify-center">
                <Button variant="outline" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20">
                    {t.adhkarReset}
                </Button>
            </div>
        </>
      )}
    </div>
  );
};

export default AdhkarPage;
