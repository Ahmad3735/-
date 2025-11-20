import React, { useState, useCallback } from 'react';
import Card from '../components/ui/Card';
import PrayerTimesMap from '../components/PrayerTimesMap';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { PrayerTime, AladhanApiResponse, AladhanTimings } from '../types';

const PRAYER_ORDER: { key: keyof AladhanTimings; name: string; ar: string }[] = [
    { key: 'Fajr', name: 'Fajr', ar: 'الفجر' },
    { key: 'Dhuhr', name: 'Dhuhr', ar: 'الظهر' },
    { key: 'Asr', name: 'Asr', ar: 'العصر' },
    { key: 'Maghrib', name: 'Maghrib', ar: 'المغرب' },
    { key: 'Isha', name: 'Isha', ar: 'العشاء' },
];

const formatTime12Hour = (time24: string, lang: 'ar' | 'en'): string => {
  if (!time24) return '';
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = lang === 'ar' ? (hourNum >= 12 ? 'م' : 'ص') : (hourNum >= 12 ? 'PM' : 'AM');
  const hour12 = hourNum % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};


const PrayerTimesMapPage: React.FC = () => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[] | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
    const { t, lang } = useLanguage();

    const handleMapClick = useCallback(async (lat: number, lng: number) => {
        setIsLoading(true);
        setError('');
        setPrayerTimes(null);
        setLocationName('');
        setSelectedPosition([lat, lng]);

        const prayerApiUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`;
        const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${lang}`;

        try {
            const [prayerResponse, locationResponse] = await Promise.all([
                fetch(prayerApiUrl),
                fetch(locationApiUrl)
            ]);

            if (!prayerResponse.ok) throw new Error(t.errorApiPrayer);
            if (!locationResponse.ok) throw new Error('Failed to fetch location data');

            const prayerData: AladhanApiResponse = await prayerResponse.json();
            const locationData = await locationResponse.json();

            const locationStr = locationData.city || locationData.locality || locationData.principalSubdivision || t.cityNotFound;
            setLocationName(`${locationStr}, ${locationData.countryName}`);

            const timings = prayerData.data.timings;
            const formattedTimes = PRAYER_ORDER.map(prayer => ({
                name: lang === 'ar' ? prayer.ar : prayer.name,
                time: formatTime12Hour(timings[prayer.key], lang),
            }));
            setPrayerTimes(formattedTimes);

        } catch (e: any) {
            console.error("Error fetching prayer times or location:", e);
            setError(e.message || t.errorApiGeneral);
        } finally {
            setIsLoading(false);
        }
    }, [lang, t]);

    return (
        <Card title={t.prayerTimesMapTitle}>
            <p className="mb-4 text-lg text-center text-gray-700 dark:text-gray-300">
                {t.prayerTimesMapDescription}
            </p>
            <div className="h-96 md:h-[500px] w-full mb-6 shadow-lg">
                <PrayerTimesMap onMapClick={handleMapClick} position={selectedPosition} />
            </div>
            
            <div className="mt-4 text-center">
                {isLoading && (
                    <>
                        <LoadingSpinner size="md" color="text-primary dark:text-secondary" />
                        <p className="text-primary dark:text-secondary font-semibold">{t.fetchingPrayerTimes}</p>
                    </>
                )}
                {error && (
                    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-lg dark:bg-red-900/50 dark:border-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}
                {!isLoading && !error && !prayerTimes && (
                     <p className="text-xl text-gray-500 dark:text-gray-400">{t.clickMapInstruction}</p>
                )}
                {prayerTimes && locationName && (
                    <div className="max-w-md mx-auto" aria-live="polite">
                        <h3 className="text-2xl font-bold text-primary dark:text-secondary mb-4">
                            {t.prayerTimesFor} {locationName}
                        </h3>
                        <div className="space-y-3">
                        {prayerTimes.map((prayer, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-green-50 rounded-lg shadow-sm dark:bg-gray-700"
                            >
                                <span className="text-lg font-semibold text-primary dark:text-secondary">{prayer.name}</span>
                                <span className="text-lg font-mono text-gray-800 tracking-wider dark:text-gray-200">{prayer.time}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PrayerTimesMapPage;