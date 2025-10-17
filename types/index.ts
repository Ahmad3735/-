export interface PrayerTime {
  name: string;
  time: string;
}

export interface Verse {
  id: number;
  arabic_text: string;
}

export interface Surah {
  id: number;
  name: string;
  translationName: string;
  verses: Verse[];
}

export interface Hadith {
  arabic: string;
  source: string;
}

export interface DailyQuranVerse {
    arabic: string;
    surah: string;
}

export interface DailyHadith {
    arabic: string;
    source: string;
}
