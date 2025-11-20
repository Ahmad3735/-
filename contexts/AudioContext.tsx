
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { AudioContextType, AudioState, ReciterId } from '../types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentSurahId: null,
    reciter: 'hussary',
    progress: 0,
    duration: 0,
    surahNameAr: '',
    surahNameEn: '',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = 'none';
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, progress: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
    };

    const handleError = (e: Event) => {
        console.error("Audio Error", e);
        setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Media Session API Support (Lock Screen Controls)
  useEffect(() => {
      if ('mediaSession' in navigator && state.currentSurahId) {
          navigator.mediaSession.metadata = new MediaMetadata({
              title: state.surahNameAr || `Surah ${state.currentSurahId}`,
              artist: state.reciter === 'hussary' ? 'محمود خليل الحصري' : 'محمد صديق المنشاوي',
              album: 'نور الإسلام',
              artwork: [
                  { src: 'https://cdn-icons-png.flaticon.com/512/2232/2232856.png', sizes: '512x512', type: 'image/png' }
              ]
          });

          navigator.mediaSession.setActionHandler('play', togglePlay);
          navigator.mediaSession.setActionHandler('pause', togglePlay);
      }
  }, [state.currentSurahId, state.surahNameAr, state.reciter]);


  const getAudioUrl = (surahId: number, reciter: ReciterId) => {
    const formattedId = surahId.toString().padStart(3, '0');
    const baseUrl = reciter === 'minshawi' 
        ? 'https://server10.mp3quran.net/minsh' 
        : 'https://server13.mp3quran.net/husr';
    return `${baseUrl}/${formattedId}.mp3`;
 };

  const playSurah = (surahId: number, nameAr: string, nameEn: string) => {
    if (!audioRef.current) return;

    // If same surah, just toggle
    if (state.currentSurahId === surahId && state.reciter === state.reciter) {
        togglePlay();
        return;
    }

    // New Surah
    const url = getAudioUrl(surahId, state.reciter);
    audioRef.current.src = url;
    audioRef.current.play().then(() => {
        setState(prev => ({
            ...prev,
            currentSurahId: surahId,
            surahNameAr: nameAr,
            surahNameEn: nameEn,
            isPlaying: true
        }));
    }).catch(e => console.error("Playback failed", e));
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
        audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
    } else {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const setReciter = (reciter: ReciterId) => {
      setState(prev => ({ ...prev, reciter }));
      // If playing, we need to reload with new reciter if we wanted to be strict, 
      // but for simplicity, let's just update state. Next play will use new reciter.
      // Or if currently playing, switch immediately:
      if (state.currentSurahId && audioRef.current) {
          const wasPlaying = !audioRef.current.paused;
          const url = getAudioUrl(state.currentSurahId, reciter);
          const currentTime = audioRef.current.currentTime;
          audioRef.current.src = url;
          audioRef.current.currentTime = currentTime;
          if (wasPlaying) audioRef.current.play();
      }
  };

  const seek = (time: number) => {
      if (audioRef.current) {
          audioRef.current.currentTime = time;
          setState(prev => ({ ...prev, progress: time }));
      }
  };

  return (
    <AudioContext.Provider value={{ ...state, playSurah, togglePlay, setReciter, seek }}>
      {children}
    </AudioContext.Provider>
  );
};
