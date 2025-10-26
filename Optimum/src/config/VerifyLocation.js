

// utils/checkLocation.js
export const isWithinOffice = (userLat, userLng, officeLat, officeLng, radius = 0.5) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in km
  const dLat = toRad(officeLat - userLat);
  const dLng = toRad(officeLng - userLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLat)) *
    Math.cos(toRad(officeLat)) *
    Math.sin(dLng / 2) ** 2;

  const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


  return distance <= radius; // true if within radius
};


