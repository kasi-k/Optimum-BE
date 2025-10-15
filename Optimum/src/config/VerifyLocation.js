

// utils/checkLocation.js
export const isWithinOffice = (userLat, userLng, officeLat, officeLng, radius = 0.1) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in km
  const dLat = toRad(officeLat - userLat);
  const dLng = toRad(officeLng - userLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLat)) *
    Math.cos(toRad(officeLat)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // distance in km

  return distance <= radius; // true if within radius
};


