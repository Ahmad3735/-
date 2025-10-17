
import React from 'react';
import Card from '../components/ui/Card';
import { PRAYER_NAMES } from '../components/ui/constants/islamicData';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';

const PrayerTimesPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card title={ARABIC_UI.prayerTimesTitle}>
        <p className="mb-6 text-lg text-gray-700 text-center">
          {ARABIC_UI.prayerTimesInfo}
        </p>
        <div className="space-y-4">
          {PRAYER_NAMES.map((prayer, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-green-50 rounded-lg shadow"
            >
              <span className="text-xl font-semibold text-primary">{prayer.name}</span>
              <span className="text-xl font-mono text-gray-600">{prayer.time}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          {ARABIC_UI.prayerTimesNote}
        </p>
      </Card>
    </div>
  );
};

export default PrayerTimesPage;