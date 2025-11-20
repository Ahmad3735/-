
import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';

const GlobalPlayer: React.FC = () => {
    const { isPlaying, currentSurahId, surahNameAr, surahNameEn, reciter, togglePlay, setReciter, progress, duration, seek } = useAudio();
    const { t, lang } = useLanguage();

    if (!currentSurahId) return null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 pb-[env(safe-area-inset-bottom)] animate-slide-up">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 cursor-pointer group" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seek(percent * duration);
            }}>
                <div 
                    className="h-full bg-primary relative transition-all duration-100" 
                    style={{ width: `${(progress / duration) * 100}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                
                {/* Info Area */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <span className="text-lg animate-pulse-slow">🎵</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-gray-900 dark:text-white truncate text-sm sm:text-base font-amiri">
                            {lang === 'ar' ? surahNameAr : surahNameEn}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-2">
                             {reciter === 'hussary' ? t.reciterHussary : t.reciterMinshawi}
                             <span className="hidden sm:inline text-gray-300">|</span>
                             <span className="hidden sm:inline font-mono">{formatTime(progress)} / {formatTime(duration)}</span>
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    {/* Reciter Select (Desktop) */}
                    <select
                        value={reciter}
                        onChange={(e) => setReciter(e.target.value as any)}
                        className="hidden sm:block bg-gray-100 dark:bg-slate-800 text-xs rounded-lg p-2 border-none focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="hussary">{t.reciterHussary}</option>
                        <option value="minshawi">{t.reciterMinshawi}</option>
                    </select>

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all shadow-lg active:scale-95 ${
                            isPlaying 
                            ? 'bg-white border-2 border-primary text-primary' 
                            : 'bg-primary text-white'
                        }`}
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        ) : (
                            <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalPlayer;
