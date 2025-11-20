
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { getHijriDate, getFastingType, getDaysInMonth } from '../utils/dateUtils';

const WEEKDAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FastingCalendarPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helpers for navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDayOfWeek = daysInMonth[0].getDay();
  // Create empty slots for the grid start
  const emptySlots = Array(startDayOfWeek).fill(null);

  // Format header
  const monthName = currentDate.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  
  // Get first day Hijri month name for title
  const firstDayHijri = getHijriDate(daysInMonth[0]);
  const hijriTitle = lang === 'ar' ? firstDayHijri.monthNameAr : firstDayHijri.monthNameEn;
  const hijriYear = firstDayHijri.year;

  const renderLegend = () => (
      <div className="flex flex-wrap gap-3 justify-center mt-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300"></span>
              <span>{t.fastingTypeMondayThursday}</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></span>
              <span>{t.fastingTypeWhiteDays}</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"></span>
              <span>{t.fastingTypeAshura}/{t.fastingTypeArafah}</span>
          </div>
      </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4 text-blue-600 dark:text-blue-400 shadow-lg">
            <span className="text-3xl">📅</span>
        </div>
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2 font-amiri">{t.fastingPageTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.fastingPageDescription}</p>
      </div>

      <Card>
         {/* Calendar Header */}
         <div className="flex items-center justify-between mb-8 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
             <Button variant="ghost" onClick={prevMonth}>◀</Button>
             <div className="text-center">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{monthName}</h2>
                 <p className="text-primary font-amiri text-lg">{hijriTitle} {hijriYear}</p>
             </div>
             <Button variant="ghost" onClick={nextMonth}>▶</Button>
         </div>

         {/* Calendar Grid */}
         <div className="grid grid-cols-7 gap-2 sm:gap-4">
             {/* Weekday Headers */}
             {(lang === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN).map(day => (
                 <div key={day} className="text-center font-bold text-gray-500 text-sm py-2">
                     {day}
                 </div>
             ))}

             {/* Empty Slots */}
             {emptySlots.map((_, i) => <div key={`empty-${i}`}></div>)}

             {/* Days */}
             {daysInMonth.map((date, i) => {
                 const hijri = getHijriDate(date);
                 const type = getFastingType(date, hijri);
                 const isToday = date.toDateString() === new Date().toDateString();
                 
                 let cellClass = "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-primary/50";
                 let badgeClass = "";
                 let label = "";

                 if (type === 'white_days') {
                     cellClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-inner";
                     badgeClass = "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200";
                     label = "⚪";
                 } else if (type === 'monday_thursday') {
                     cellClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
                     badgeClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200";
                 } else if (type === 'ashura' || type === 'arafah') {
                     cellClass = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 ring-2 ring-amber-400";
                     badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
                     label = "⭐";
                 }

                 if (isToday) {
                     cellClass += " ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900";
                 }

                 return (
                     <div 
                        key={i} 
                        className={`
                            relative aspect-square rounded-xl border p-1 sm:p-2 flex flex-col justify-between transition-all duration-200
                            ${cellClass}
                        `}
                     >
                         <span className={`text-xs sm:text-sm font-bold ${isToday ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                             {date.getDate()}
                         </span>
                         
                         <div className="flex flex-col items-center justify-center h-full">
                             <span className={`text-xl sm:text-3xl font-amiri font-bold text-gray-800 dark:text-white`}>
                                 {hijri.day}
                             </span>
                             {label && <span className="text-xs absolute top-1 right-1">{label}</span>}
                         </div>
                     </div>
                 );
             })}
         </div>
         
         {renderLegend()}
      </Card>
    </div>
  );
};

export default FastingCalendarPage;
