
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import type { QuranApiSurah } from '../types';

const VERSES_PER_UI_PAGE = 20;

interface VerseData {
    verse_key: string;
    verse_number: number;
    text_uthmani: string;
}

const QuranPage: React.FC = () => {
  const [surahList, setSurahList] = useState<QuranApiSurah[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [versesData, setVersesData] = useState<VerseData[]>([]);
  const [tafsirData, setTafsirData] = useState<Record<string, string>>({});
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'mushaf' | 'tafsir'>('tafsir');
  const [selectedTafsir, setSelectedTafsir] = useState<'muyassar' | 'mukhtasar'>('muyassar');
  const [fontSize, setFontSize] = useState<number>(28);
  
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingVerses, setIsLoadingVerses] = useState<boolean>(false);
  const [isLoadingTafsir, setIsLoadingTafsir] = useState<boolean>(false);
  const [tafsirError, setTafsirError] = useState<boolean>(false);
  
  const tafsirCache = useRef<Record<string, Record<string, string>>>({});
  const versesCache = useRef<Record<number, VerseData[]>>({});
  
  const { t, lang } = useLanguage();
  const { playSurah, currentSurahId, isPlaying } = useAudio();

  // 1. Fetch Surah List
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=' + (lang === 'ar' ? 'ar' : 'en'))
      .then(res => res.json())
      .then(data => {
        if (data.chapters) setSurahList(data.chapters);
        setIsLoadingList(false);
      })
      .catch(err => {
        console.error("Failed to fetch surah list", err);
        setIsLoadingList(false);
      });
  }, [lang]);

  // Filter Surahs
  const filteredSurahs = useMemo(() => {
      return surahList.filter(s => 
          s.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name_arabic.includes(searchQuery) ||
          s.id.toString() === searchQuery
      );
  }, [surahList, searchQuery]);


  // 2. Fetch Verses (Parallel Fetching for Speed)
  useEffect(() => {
    const fetchVerses = async () => {
        if (versesCache.current[selectedSurahId]) {
            setVersesData(versesCache.current[selectedSurahId]);
            return;
        }

        setIsLoadingVerses(true);
        setCurrentPage(1);
        setTafsirData({});
        setVersesData([]);

        try {
            // Initial fetch to get total pages
            const perPage = 50;
            const initialRes = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${selectedSurahId}&per_page=${perPage}&page=1`);
            if (!initialRes.ok) throw new Error("Failed to fetch verses");
            const initialData = await initialRes.json();
            
            let allVerses = initialData.verses || [];
            const totalPages = initialData.meta?.total_pages || 1;

            if (totalPages > 1) {
                const promises = [];
                for (let p = 2; p <= totalPages; p++) {
                    promises.push(
                        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${selectedSurahId}&per_page=${perPage}&page=${p}`)
                        .then(r => r.json())
                    );
                }
                
                const results = await Promise.all(promises);
                results.forEach(data => {
                    if (data.verses) {
                        allVerses = [...allVerses, ...data.verses];
                    }
                });
            }

            const formattedVerses: VerseData[] = allVerses.map((v: any) => ({
                verse_key: v.verse_key,
                verse_number: parseInt(v.verse_key.split(':')[1]),
                text_uthmani: v.text_uthmani
            }));

            versesCache.current[selectedSurahId] = formattedVerses;
            setVersesData(formattedVerses);

        } catch (error) {
            console.error("Error fetching verses:", error);
        } finally {
            setIsLoadingVerses(false);
        }
    };

    fetchVerses();
  }, [selectedSurahId]);

  // 3. Fetch Tafsir (Hybrid: QuranEnc Primary)
  useEffect(() => {
      if (viewMode !== 'tafsir') return;
      if (versesData.length === 0) return;

      const fetchTafsir = async () => {
          let translationKey = 'arabic_moyassar';
          if (lang === 'en') translationKey = 'english_saheeh';
          else if (selectedTafsir === 'mukhtasar') translationKey = 'arabic_mokhtasar';

          const cacheKey = `${selectedSurahId}-${translationKey}`;
          
          if (tafsirCache.current[cacheKey]) {
              setTafsirData(tafsirCache.current[cacheKey]);
              setTafsirError(false);
              return;
          }

          setIsLoadingTafsir(true);
          setTafsirError(false);

          try {
              const url = `https://quranenc.com/api/v1/translation/sura/${translationKey}/${selectedSurahId}`;
              const res = await fetch(url);
              
              if (!res.ok) throw new Error("Failed to fetch Tafsir from QuranEnc");
              
              const data = await res.json();
              
              if (data.result) {
                  const newTafsirMap: Record<string, string> = {};
                  data.result.forEach((item: any) => {
                      const key = `${selectedSurahId}:${item.aya}`;
                      newTafsirMap[key] = item.translation;
                  });

                  tafsirCache.current[cacheKey] = newTafsirMap;
                  setTafsirData(newTafsirMap);
              } else {
                  throw new Error("Invalid format");
              }

          } catch (error) {
              console.error("Tafsir fetch failed:", error);
              setTafsirError(true);
              
              // Try Fallback to api.quran.com for Mukhtasar if QuranEnc fails
              if (selectedTafsir === 'mukhtasar' && lang === 'ar') {
                  try {
                      const fallbackRes = await fetch(`https://api.quran.com/api/v4/quran/tafsirs/171?chapter_number=${selectedSurahId}&per_page=300`); // 171 = Mukhtasar
                      const fallbackData = await fallbackRes.json();
                      if(fallbackData.tafsirs) {
                          const newTafsirMap: Record<string, string> = {};
                          fallbackData.tafsirs.forEach((item: any) => {
                              newTafsirMap[item.verse_key] = item.text;
                          });
                          tafsirCache.current[cacheKey] = newTafsirMap;
                          setTafsirData(newTafsirMap);
                          setTafsirError(false);
                      }
                  } catch (e) { console.error("Fallback failed too"); }
              }
          } finally {
              setIsLoadingTafsir(false);
          }
      };

      fetchTafsir();
  }, [selectedSurahId, selectedTafsir, viewMode, versesData.length, lang]);


  const handlePlay = () => {
      const surah = surahList.find(s => s.id === selectedSurahId);
      if (surah) {
          playSurah(selectedSurahId, surah.name_arabic, surah.name_simple);
      }
  };

  // Pagination
  const totalPages = Math.ceil(versesData.length / VERSES_PER_UI_PAGE);
  const currentVersesSlice = useMemo(() => {
      const start = (currentPage - 1) * VERSES_PER_UI_PAGE;
      return versesData.slice(start, start + VERSES_PER_UI_PAGE);
  }, [versesData, currentPage]);

  const currentSurahInfo = surahList.find(s => s.id === selectedSurahId);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto relative min-h-screen pb-32">
      <SEO 
        title={currentSurahInfo ? (lang === 'ar' ? currentSurahInfo.name_arabic : currentSurahInfo.name_simple) : t.quranPageTitle}
        description="القرآن الكريم"
      />

      {/* Control Bar */}
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 sticky top-20 z-30">
          <div className="flex flex-col gap-4">
              {/* Search & Select */}
              <div className="flex flex-col md:flex-row gap-4">
                 {/* Surah Selection with Search */}
                 <div className="relative w-full md:w-1/3">
                     <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchSurahPlaceholder}
                        className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                     />
                     <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                     
                     {searchQuery && (
                         <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                             {filteredSurahs.map(s => (
                                 <button 
                                    key={s.id} 
                                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    onClick={() => {
                                        setSelectedSurahId(s.id);
                                        setSearchQuery('');
                                    }}
                                 >
                                     <span className="font-bold">{s.id}. {lang === 'ar' ? s.name_arabic : s.name_simple}</span>
                                 </button>
                             ))}
                         </div>
                     )}
                 </div>

                 <select
                    value={selectedSurahId}
                    onChange={(e) => setSelectedSurahId(parseInt(e.target.value))}
                    className="w-full md:w-1/3 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl font-amiri text-lg"
                >
                    {isLoadingList ? <option>{t.loading}</option> : surahList.map(s => (
                        <option key={s.id} value={s.id}>{s.id}. {lang === 'ar' ? s.name_arabic : s.name_simple}</option>
                    ))}
                </select>
                
                <div className="w-full md:w-1/3 flex items-center justify-end">
                    <Button 
                        onClick={handlePlay} 
                        className={`w-full gap-2 ${currentSurahId === selectedSurahId && isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                        <span>{currentSurahId === selectedSurahId && isPlaying ? t.pauseRecitation : t.playRecitation}</span>
                        <span>{currentSurahId === selectedSurahId && isPlaying ? '⏸' : '▶'}</span>
                    </Button>
                </div>
              </div>

              {/* View Options */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button onClick={() => setViewMode('tafsir')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'tafsir' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500'}`}>{t.viewModeTafsir}</button>
                      <button onClick={() => setViewMode('mushaf')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500'}`}>{t.viewModeReading}</button>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                      <span className="text-xs">A-</span>
                      <input type="range" min="20" max="50" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-20 accent-primary h-1.5 bg-gray-300 rounded-lg" />
                      <span className="text-sm">A+</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Content */}
      <div className="min-h-[60vh]">
          {isLoadingVerses ? (
              <div className="flex flex-col items-center justify-center py-20">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-500 mt-4">{t.loading}</p>
              </div>
          ) : (
              <>
                  {viewMode === 'tafsir' && (
                       <div className="mb-6 flex justify-end">
                           <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                               <span className="text-sm text-gray-500">{t.tafsirSourceLabel}:</span>
                               <select value={selectedTafsir} onChange={(e) => setSelectedTafsir(e.target.value as any)} className="bg-transparent font-bold text-primary focus:outline-none text-sm">
                                   <option value="muyassar">{t.tafsirMuyassar}</option>
                                   <option value="mukhtasar">{t.tafsirMukhtasar}</option>
                               </select>
                           </div>
                       </div>
                  )}

                  {viewMode === 'mushaf' && (
                      <Card className="p-6 sm:p-10 bg-[#fffdf5] dark:bg-[#1a1a1a]">
                          <div className="text-justify leading-[3.5] font-amiri text-gray-800 dark:text-gray-200" style={{ fontSize: `${fontSize}px`, direction: 'rtl' }}>
                              {currentVersesSlice.map((v) => (
                                  <React.Fragment key={v.verse_key}>
                                      <span>{v.text_uthmani}</span>
                                      <span className="inline-flex items-center justify-center w-8 h-8 mx-1 text-xs border border-primary/30 rounded-full text-primary font-sans align-middle bg-primary/5">{v.verse_number}</span>
                                  </React.Fragment>
                              ))}
                          </div>
                      </Card>
                  )}

                  {viewMode === 'tafsir' && (
                      <div className="space-y-6">
                          {currentVersesSlice.map((verse) => {
                              const tafsirText = tafsirData[`${selectedSurahId}:${verse.verse_number}`] || tafsirData[verse.verse_key];
                              return (
                                <Card key={verse.verse_key}>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-3">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold font-mono">{verse.verse_key}</span>
                                        </div>
                                        <p className="text-right font-amiri leading-[2.8] text-gray-800 dark:text-gray-100" style={{ fontSize: `${fontSize}px` }}>{verse.text_uthmani}</p>
                                        <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-xl border-r-4 border-secondary text-right">
                                            {isLoadingTafsir ? <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 animate-pulse rounded"></div> : 
                                             tafsirError ? <p className="text-red-500 text-sm">تعذر تحميل التفسير</p> :
                                             <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-kufi text-lg">{tafsirText || "..."}</p>
                                            }
                                        </div>
                                    </div>
                                </Card>
                              );
                          })}
                      </div>
                  )}

                  {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-12 mb-8 font-sans">
                          <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary" size="sm">{t.prevPage}</Button>
                          <span className="font-bold text-gray-600 dark:text-gray-300">{currentPage} / {totalPages}</span>
                          <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary" size="sm">{t.nextPage}</Button>
                      </div>
                  )}
              </>
          )}
      </div>
    </div>
  );
};

export default QuranPage;
