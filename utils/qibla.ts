// Kaaba coordinates
const KAABA_LAT = 21.422521;
const KAABA_LNG = 39.826168;

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
const toRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
};

/**
 * Converts radians to degrees.
 * @param {number} radians - The angle in radians.
 * @returns {number} The angle in degrees.
 */
const toDegrees = (radians: number): number => {
    return radians * 180 / Math.PI;
};

/**
 * Calculates the Qibla direction (bearing) from a given point (latitude, longitude).
 * @param {number} lat - The latitude of the user's location.
 * @param {number} lng - The longitude of the user's location.
 * @returns {number} The Qibla direction in degrees from North (0° to 360°).
 */
export const calculateQiblaDirection = (lat: number, lng: number): number => {
    const userLatRad = toRadians(lat);
    const userLngRad = toRadians(lng);
    const kaabaLatRad = toRadians(KAABA_LAT);
    const kaabaLngRad = toRadians(KAABA_LNG);

    const deltaLng = kaabaLngRad - userLngRad;

    const y = Math.sin(deltaLng) * Math.cos(kaabaLatRad);
    const x = Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
              Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(deltaLng);
    
    let bearingRad = Math.atan2(y, x);
    let bearingDeg = toDegrees(bearingRad);

    // Normalize the bearing to be within the range 0 to 360
    return (bearingDeg + 360) % 360;
};