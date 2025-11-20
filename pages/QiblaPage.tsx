import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import QiblaCompass from '../components/QiblaCompass';
import { calculateQiblaDirection } from '../utils/qibla';
import { useLanguage } from '../contexts/LanguageContext';

const QiblaPage: React.FC = () => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [heading, setHeading] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setStatus(t.qiblaRequestingPermissions)
    }, [t]);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        const compassHeading = (event as any).webkitCompassHeading || event.alpha;
        if (compassHeading !== null) {
            setHeading(compassHeading);
            setStatus('');
        } else if (!status) {
            setStatus(t.qiblaCalibrating);
        }
    };

    const requestPermissions = useCallback(async () => {
        setStatus(t.qiblaRequestingPermissions);
        setError('');

        if (!navigator.geolocation) {
            setError(t.geolocationNotSupported);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const qibla = calculateQiblaDirection(latitude, longitude);
                setQiblaDirection(qibla);

                if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                    (DeviceOrientationEvent as any).requestPermission()
                        .then((permissionState: 'granted' | 'denied' | 'prompt') => {
                            if (permissionState === 'granted') {
                                window.addEventListener('deviceorientation', handleOrientation);
                                setPermissionsGranted(true);
                                setStatus(t.qiblaCalibrating);
                            } else {
                                setError(t.qiblaErrorCompass);
                            }
                        })
                        .catch((e: any) => {
                            setError(t.qiblaErrorCompass);
                        });
                } else {
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                    setPermissionsGranted(true);
                    setStatus(t.qiblaCalibrating);
                }
            },
            () => {
                setError(t.qiblaErrorLocation);
            }
        );
    }, [t]);

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
        };
    }, []);

    const renderContent = () => {
        if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;

        if (!permissionsGranted) {
            return (
                <div className="text-center space-y-6 my-12">
                     <div className="text-6xl mb-4">🧭</div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">{t.qiblaGrantPermission}</p>
                    <Button onClick={requestPermissions} size="lg" className="shadow-lg">
                        Start Compass
                    </Button>
                </div>
            );
        }

        if (qiblaDirection === null || (heading === null && status)) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" color="text-secondary" />
                    <p className="mt-4 font-medium text-gray-600 dark:text-gray-300 animate-pulse">{status}</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center py-6 animate-fade-in">
                <div className="relative drop-shadow-2xl">
                    <QiblaCompass heading={heading} qiblaDirection={qiblaDirection} />
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6 w-full max-w-sm text-center">
                     <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Qibla</span>
                        <p className="text-2xl font-bold text-primary">{Math.round(qiblaDirection || 0)}°</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Heading</span>
                         <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(heading || 0)}°</p>
                     </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2">{t.qiblaPageTitle}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t.qiblaDescription}</p>
            </div>
            <Card>
                {renderContent()}
                {permissionsGranted && !error && (
                    <p className="mt-8 text-center text-sm text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                        {t.qiblaInstructions}
                    </p>
                )}
            </Card>
        </div>
    );
};

export default QiblaPage;