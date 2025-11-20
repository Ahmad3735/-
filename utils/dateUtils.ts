
import { HijriDate, FastingType } from '../types';

const HIJRI_MONTHS_AR = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
  "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

const HIJRI_MONTHS_EN = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Ula", "Jumada al-Akhirah",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

/**
 * Converts a Gregorian Date to a Hijri Date object using Intl API.
 */
export const getHijriDate = (date: Date): HijriDate => {
  // Use Islamic Umm al-Qura calendar
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  const parts = formatter.formatToParts(date);
  const dayPart = parts.find(p => p.type === 'day')?.value;
  const monthPart = parts.find(p => p.type === 'month')?.value;
  const yearPart = parts.find(p => p.type === 'year')?.value;

  const day = parseInt(dayPart || '1', 10);
  const month = parseInt(monthPart || '1', 10);
  const year = parseInt(yearPart || '1445', 10);

  return {
    day,
    month, // 1-based
    year,
    monthNameAr: HIJRI_MONTHS_AR[month - 1] || '',
    monthNameEn: HIJRI_MONTHS_EN[month - 1] || ''
  };
};

/**
 * Determines if a specific date corresponds to a recommended fasting day.
 */
export const getFastingType = (date: Date, hijri: HijriDate): FastingType => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday

  // Arafah: 9th of Dhu al-Hijjah (Month 12)
  if (hijri.month === 12 && hijri.day === 9) {
    return 'arafah';
  }

  // Ashura: 10th of Muharram (Month 1)
  if (hijri.month === 1 && hijri.day === 10) {
    return 'ashura';
  }

  // White Days: 13, 14, 15 of any month (Except 13th of Dhu al-Hijjah which is Tashreeq)
  // Note: Fasting 13th Dhu al-Hijjah is generally prohibited/disliked for pilgrims, 
  // but general rule is 13,14,15. We will keep simple logic or exclude 12/13.
  // Let's exclude 13th of Dhul-Hijjah as it is part of Days of Tashreeq where fasting is restricted.
  if ((hijri.day === 13 || hijri.day === 14 || hijri.day === 15)) {
    if (hijri.month === 12 && hijri.day === 13) return 'none'; 
    return 'white_days';
  }

  // Monday (1) and Thursday (4)
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    return 'monday_thursday';
  }

  return 'none';
};

/**
 * Get days in a Gregorian month for grid rendering
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};
