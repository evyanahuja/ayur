/* Location derived from the existing repository Maps short link. Its Google
 * Maps place redirect resolves to this pin (not the old Indore city centroid).
 * Keep the address, marker, directions and structured geo together. */
export const CLINIC_LOCATION = {
  address: "Sanchar Nagar Extension, Kanadia Road, Indore, Madhya Pradesh 452016",
  street: "Sanchar Nagar Extension, Kanadia Road",
  city: "Indore",
  region: "Madhya Pradesh",
  postalCode: "452016",
  country: "IN",
  coordinates: { lat: 22.7256959, lng: 75.9192861 },
  sourceMapsUrl: "https://maps.app.goo.gl/vhRYqg63chcGXLrr6",
} as const;

const destination = `${CLINIC_LOCATION.coordinates.lat},${CLINIC_LOCATION.coordinates.lng}`;
export const CLINIC_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(destination)}&z=17&output=embed`;
export const CLINIC_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
