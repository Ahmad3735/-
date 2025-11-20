import React from 'react';

interface QiblaCompassProps {
  heading: number | null; // The device's heading from North
  qiblaDirection: number | null; // The calculated Qibla direction from North
}

const QiblaCompass: React.FC<QiblaCompassProps> = ({ heading, qiblaDirection }) => {
  if (heading === null || qiblaDirection === null) {
    return null;
  }

  // The compass rose rotates opposite to the device's heading to simulate a real compass
  const compassRotation = `rotate(${-heading}deg)`;

  // The pointer's rotation is the Qibla direction relative to the device's current heading
  const pointerRotation = `rotate(${qiblaDirection - heading}deg)`;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto" aria-hidden="true">
      {/* Compass Background */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Compass_rose_browns_style.svg"
        alt="Compass Rose"
        className="w-full h-full transition-transform duration-200 ease-linear"
        style={{ transform: compassRotation }}
      />
      
      {/* Qibla Pointer (Arrow pointing towards the Kaaba) */}
      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center transition-transform duration-200 ease-linear"
        style={{ transform: pointerRotation }}
      >
        <div className="relative w-full h-full">
            {/* The actual pointer graphic, positioned to point 'up' from the center */}
            <svg
                viewBox="0 0 100 100"
                className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-1/2 w-16 text-secondary"
                fill="currentColor"
            >
                <path d="M50 0 L100 100 L50 75 L0 100 Z" />
            </svg>
        </div>
      </div>

       {/* Central dot */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-700 dark:bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
    </div>
  );
};

export default QiblaCompass;