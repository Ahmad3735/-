
export interface PrayerTime {
  name: string;
  time: string;
}

export interface Verse {
  id: number;
  arabic_text: string;
  tafsir: string;
  english_tafsir: string;
}

export interface Surah {
  id: number;
  name: string;
  translationName: string;
  englishName: string;
  verses: Verse[];
}

// Updated for api.quran.com V4
export interface QuranApiSurah {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface CombinedVerse {
  number: number;
  arabic: string;
  translation: string;
  tafsirText: string; // Generic field for the currently selected tafsir
  verse_key: string;
}

export type NarratorStatus = 'ثقة' | 'صدوق' | 'ضعيف' | 'صحابي' | 'ثقة ثبت' | 'ثقة فقيه' | 'ثقة حافظ';

export interface Narrator {
  name: string;
  status: NarratorStatus;
}

export interface Hadith {
  id: number;
  arabic: string;
  source: string;
  isnad?: Narrator[]; 
  explanation: string;
}

export interface DailyQuranVerse {
    arabic: string;
    surah: string;
}

export interface DailyHadith {
    arabic: string;
    source: string;
}

export interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface AladhanApiResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanTimings;
  };
}

// Adhkar Types
export type AdhkarCategory = 'morning' | 'evening' | 'sleep' | 'postPrayer' | 'masbaha';

export interface Dhikr {
  id: number;
  text: string;
  count: number;
  virtue?: string;
  source?: string;
}

export interface AdhkarSection {
  id: AdhkarCategory;
  titleAr: string;
  titleEn: string;
  items: Dhikr[];
}

// Names of Allah
export interface NameOfAllah {
  id: number;
  arabic: string;
  english: string;
  meaning: string;
}

// Fasting & Calendar Types
export type FastingType = 'white_days' | 'ashura' | 'arafah' | 'monday_thursday' | 'none';

export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
  monthNameAr: string;
  monthNameEn: string;
}

// Quiz Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface Translation {
  appName: string;
  navHome: string;
  navPrayerTimes: string;
  navPrayerTimesMap: string;
  navQibla: string;
  navQuran: string;
  navHadith: string;
  navAdhkar: string;
  navNamesOfAllah: string;
  navFasting: string;
  navZakat: string;
  navQuiz: string; // New
  // Removed Verification keys
  navAskAI: string;
  footerQuote: string;
  allRightsReserved: string;
  welcomeTo: string;
  homeSubtitle: string;
  exploreFeatures: string;
  dailyVerseTitle: string;
  dailyHadithTitle: string;
  quickAccess: string;
  fetchingLocation: string;
  fetchingPrayerTimes: string;
  cityNotFound: string;
  prayerTimesFallback: string;
  errorApiGeneral: string;
  locationPermissionDenied: string;
  geolocationNotSupported: string;
  prayerTimesTitle: string;
  prayerTimesInfo: string;
  viewOnMap: string;
  prayerTimesNote: string;
  quranPageTitle: string;
  tafsirGenerationPrompt: (verseText: string, verseId: number) => string;
  pauseRecitation: string;
  playRecitation: string;
  tafsirForVerseTitle: string;
  loading: string;
  errorEnterHadith: string;
  
  // Ask AI Keys
  errorEnterQuestion: string;
  geminiSystemInstruction: (lang: string) => string;
  askAITitle: string;
  askAIDescription: string;
  askAIPlaceholder: string;
  askAIButton: string;
  aiAnswerTitle: string;

  prayerTimesMapTitle: string;
  prayerTimesMapDescription: string;
  errorApiPrayer: string;
  clickMapInstruction: string;
  prayerTimesFor: string;
  qiblaRequestingPermissions: string;
  qiblaCalibrating: string;
  qiblaErrorCompass: string;
  qiblaErrorLocation: string;
  qiblaGrantPermission: string;
  qiblaDirectionLabel: string;
  compassHeadingLabel: string;
  qiblaPageTitle: string;
  qiblaDescription: string;
  qiblaInstructions: string;
  hadithPageTitle: string;
  hadithPageDescription: string;
  isnadChainTitle: string;
  verifyOnYourOwn: string;
  sourceTafsirName: string;
  enterCityName: string;
  search: string;
  useMyLocation: string;
  errorCityNotFound: string;
  selectSurah: string;
  explanationTitle: string;
  showExplanation: string;
  hideExplanation: string;
  viewModeReading: string;
  viewModeTafsir: string;
  nextPage: string;
  prevPage: string;
  page: string;
  surah: string;
  ayah: string;
  fontSize: string;
  // Reciters
  reciterLabel: string;
  reciterHussary: string;
  reciterMinshawi: string;
  // Tafsir Sources
  tafsirSourceLabel: string;
  tafsirMuyassar: string;
  tafsirMukhtasar: string;
  // Adhkar
  adhkarPageTitle: string;
  adhkarMorning: string;
  adhkarEvening: string;
  adhkarSleep: string;
  adhkarPostPrayer: string;
  adhkarReset: string;
  adhkarCompleted: string;
  adhkarProgress: string;
  // Names of Allah
  namesOfAllahPageTitle: string;
  namesOfAllahDescription: string;
  // Fasting
  fastingPageTitle: string;
  fastingPageDescription: string;
  fastingTypeWhiteDays: string;
  fastingTypeAshura: string;
  fastingTypeArafah: string;
  fastingTypeMondayThursday: string;
  reminderTomorrowIs: string;
  reminderDidYouIntend: string;
  reminderDismiss: string;
  // Masbaha
  masbahaTitle: string;
  masbahaTapInstruction: string;
  masbahaTotal: string;
  masbahaVirtue100: string;
  masbahaVirtue33: string;
  masbahaVirtue1000: string;

  // Zakat
  zakatPageTitle: string;
  zakatDescription: string;
  zakatMoneyTitle: string;
  zakatGoldTitle: string;
  zakatEnterAmount: string;
  zakatEnterGoldPrice: string;
  zakatEnterGoldWeight: string;
  zakatCalculate: string;
  zakatResultDue: string;
  zakatNotDue: string;
  zakatGoldNisabNote: string;
  currency: string;
  gram: string;

  // Quiz
  quizTitle: string;
  quizDescription: string;
  quizStart: string;
  quizQuestion: string;
  quizNext: string;
  quizFinish: string;
  quizScore: string;
  quizRestart: string;
  quizCorrect: string;
  quizWrong: string;
}
