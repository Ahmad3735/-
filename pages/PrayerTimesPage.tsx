import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { PrayerTime, AladhanApiResponse, AladhanTimings } from '../types';

// Define the order and names of prayers
const PRAYER_ORDER: { key: keyof AladhanTimings; name: string; ar: string; icon: string }[] = [
    { key: 'Fajr', name: 'Fajr', ar: 'الفجر', icon: '🌅' },
    { key: 'Dhuhr', name: 'Dhuhr', ar: 'الظهر', icon: '☀️' },
    { key: 'Asr', name: 'Asr', ar: 'العصر', icon: '🌤️' },
    { key: 'Maghrib', name: 'Maghrib', ar: 'المغرب', icon: '🌇' },
    { key: 'Isha', name: 'Isha', ar: 'العشاء', icon: '🌌' },
];

const formatTime12Hour = (time24: string, lang: 'ar' | 'en'): string => {
  if (!time24) return '';
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = lang === 'ar' ? (hourNum >= 12 ? 'م' : 'ص') : (hourNum >= 12 ? 'PM' : 'AM');
  const hour12 = hourNum % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};

const DEFAULT_LAT = 21.4225;
const DEFAULT_LNG = 39.8262;

const PrayerTimesPage: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[] | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t, lang } = useLanguage();

  const fetchPrayerData = useCallback(async (latitude: number, longitude: number) => {
      setIsLoading(true);
      setPrayerTimes(null);
      setLocationName('');
      setError('');
      setInfoMessage('');
      
      try {
        const countryCodeLang = lang === 'ar' ? 'ar' : 'en';
        const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${countryCodeLang}`;
        const locationResponse = await fetch(locationApiUrl);
        if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            const locationStr = locationData.city || locationData.locality || t.cityNotFound;
            setLocationName(`${locationStr}, ${locationData.countryName}`);
        }
      } catch (locError) {
        console.warn("Could not fetch location name:", locError);
      }

      try {
        const prayerApiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`;
        const prayerResponse = await fetch(prayerApiUrl);
        if (!prayerResponse.ok) throw new Error('API response not OK');
        
        const prayerData: AladhanApiResponse = await prayerResponse.json();
        if (prayerData.code !== 200) throw new Error(prayerData.status || 'Invalid API data');
        
        const timings = prayerData.data.timings;
        const formattedTimes = PRAYER_ORDER.map(prayer => ({
            name: lang === 'ar' ? prayer.ar : prayer.name,
            time: formatTime12Hour(timings[prayer.key], lang),
        }));
        setPrayerTimes(formattedTimes);

      } catch (e: any) {
        console.error("API failed, falling back to local:", e);
        setInfoMessage(t.prayerTimesFallback);
        try {
            const { Coordinates, CalculationMethod, PrayerTimes } = await import('adhan');
            const coordinates = new Coordinates(latitude, longitude);
            const params = CalculationMethod.UmmAlQura();
            const date = new Date();
            const prayerTimesLocal = new PrayerTimes(coordinates, date, params);

            const formatTimeFromDate = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const timings = {
                Fajr: formatTimeFromDate(prayerTimesLocal.fajr),
                Dhuhr: formatTimeFromDate(prayerTimesLocal.dhuhr),
                Asr: formatTimeFromDate(prayerTimesLocal.asr),
                Maghrib: formatTimeFromDate(prayerTimesLocal.maghrib),
                Isha: formatTimeFromDate(prayerTimesLocal.isha),
            };
            const formattedTimes = PRAYER_ORDER.map(prayer => ({
                name: lang === 'ar' ? prayer.ar : prayer.name,
                time: formatTime12Hour(timings[prayer.key as keyof typeof timings], lang),
            }));
            setPrayerTimes(formattedTimes);
        } catch (localError: any) {
            setError(t.errorApiGeneral);
        }
      } finally {
        setIsLoading(false);
      }
    }, [lang, t]);

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setInfoMessage(t.locationPermissionDenied);
          fetchPrayerData(DEFAULT_LAT, DEFAULT_LNG);
        }
      );
    } else {
      setInfoMessage(t.geolocationNotSupported);
      fetchPrayerData(DEFAULT_LAT, DEFAULT_LNG);
    }
  }, [fetchPrayerData, t]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError('');
    setInfoMessage('');
    setPrayerTimes(null);
    
    try {
      const geoApiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&accept-language=${lang}`;
      const response = await fetch(geoApiUrl);
      if (!response.ok) throw new Error('Failed to fetch city coordinates.');
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        await fetchPrayerData(parseFloat(lat), parseFloat(lon));
      } else {
        setError(t.errorCityNotFound);
        setIsLoading(false);
      }
    } catch (e: any) {
      setError(t.errorApiGeneral);
      setIsLoading(false);
    }
  };

  // Determine next prayer logic could go here for highlighting

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2">{t.prayerTimesTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.prayerTimesInfo}</p>
      </div>

      <Card className="relative overflow-visible">
         {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-grow">
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.enterCityName}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 dark:border-gray-600 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                 <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()} className="sm:w-auto w-full">
              {t.search}
            </Button>
             <Button onClick={() => { setSearchQuery(''); getLocation(); }} variant="ghost" disabled={isLoading} className="sm:w-auto w-full" title={t.useMyLocation}>
              📍
            </Button>
        </div>

        {/* Status & Errors */}
        {isLoading ? (
             <div className="flex flex-col items-center py-12">
                <LoadingSpinner size="lg" color="text-primary" />
                <p className="mt-4 text-gray-500">{t.fetchingPrayerTimes}</p>
            </div>
        ) : error ? (
           <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center mb-6">
                {error}
            </div>
        ) : (
            <div className="animate-fade-in">
                {locationName && (
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                             📍 {locationName}
                        </h2>
                    </div>
                )}

                {infoMessage && (
                   <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-center mb-6 text-sm">
                       {infoMessage}
                   </div>
                )}

                <div className="space-y-3">
                    {prayerTimes?.map((prayer, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/30 hover:bg-green-50/30"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{PRAYER_ORDER[index].icon}</span>
                                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{prayer.name}</span>
                            </div>
                            <span className="text-xl font-bold font-mono text-primary dark:text-primary-light tracking-wide">{prayer.time}</span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                     <Link to="/prayer-times-map">
                        <Button variant="outline" className="w-full justify-between group">
                          <span>{t.viewOnMap}</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                    </Link>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default PrayerTimesPage;