
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getHijriDate, getFastingType } from '../utils/dateUtils';
import { FastingType } from '../types';
import Button from './ui/Button';

const FastingReminder: React.FC = () => {
  const { t, lang } = useLanguage();
  const [reminder, setReminder] = useState<{ type: FastingType; date: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Logic: Check if TOMORROW is a fasting day
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowHijri = getHijriDate(tomorrow);
    const fastingType = getFastingType(tomorrow, tomorrowHijri);

    if (fastingType !== 'none') {
        // Store the last seen date to prevent showing it multiple times per session if dismissed, 
        // or implement more complex local storage logic. For now, session based.
        setReminder({
            type: fastingType,
            date: tomorrow.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')
        });
        // Simple delay for nice entrance
        setTimeout(() => setIsVisible(true), 2000);
    }
  }, [lang]);

  if (!reminder || !isVisible) return null;

  const getLabel = (type: FastingType) => {
      switch(type) {
          case 'white_days': return t.fastingTypeWhiteDays;
          case 'ashura': return t.fastingTypeAshura;
          case 'arafah': return t.fastingTypeArafah;
          case 'monday_thursday': return t.fastingTypeMondayThursday;
          default: return '';
      }
  }

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-up">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-primary p-4 flex items-start gap-4 relative overflow-hidden">
             {/* Decorative bg */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4"></div>

             <div className="bg-primary/10 text-primary p-3 rounded-full">
                <span className="text-2xl">🌙</span>
             </div>
             
             <div className="flex-1 z-10">
                 <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                     {t.reminderTomorrowIs} <span className="text-primary">{getLabel(reminder.type)}</span>
                 </h4>
                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                     {t.reminderDidYouIntend}
                 </p>
                 <div className="flex justify-end">
                     <Button size="sm" onClick={() => setIsVisible(false)}>
                         {t.reminderDismiss}
                     </Button>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default FastingReminder;
