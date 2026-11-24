// FAQ data matching the HTML exactly
export const FAQ_DATA = {
  services: [
    ['How do I book a service?', 'Pick a service, choose a verified provider, then select Book instantly or request a time slot.'],
    ['Can I reschedule my booking?', 'Yes. Reschedule free of charge up to 2 hours before the visit from your bookings page.'],
    ['What are the charges?', 'You see the visit fee before you book. Material costs are agreed with the provider on site.'],
  ],
  rentals: [
    ['What is Rentals & Stays?', 'A single place to find monthly rentals, hotels and PG accommodation near you.'],
    ['How do I book a rental or stay?', 'Open a listing, pick your date and guests, then select Book now.'],
    ['What is the cancellation policy?', 'Free cancellation up to 24 hours before check-in. After that, the first night is charged.'],
  ],
  rides: [
    ['How does an instant ride work?', 'Enter pickup and drop, confirm the fare, and the nearest driver is assigned in minutes.'],
    ['Can I pre-book a cab?', 'Yes. Choose a date and time up to 30 days ahead; the driver details arrive 1 hour before pickup.'],
    ['How is the fare calculated?', 'Fare depends on distance and vehicle type. You see the estimate before confirming.'],
  ],
};

export const AMENITIES = [
  ['📶', 'Free Wi-Fi'],
  ['🅿️', 'Parking'],
  ['🍽️', 'Restaurant'],
  ['🏊', 'Swimming pool'],
  ['🏋️', 'Gym'],
  ['❄️', 'AC rooms'],
];

export const STATIC_STAYS = [
  { id: 1, t: 'stay',   n: 'Grand City Center Hotel', c: 'City Center, Mumbai',       r: 4.5, rv: 2348, p: 4500,  d: 1.2, e: '🏨', g: 'linear-gradient(135deg,#c9d6ff,#7d9bff)', img: '/assets/images/mumbai-apt.webp' },
  { id: 2, t: 'stay',   n: 'Lakeview Residency',      c: 'Rajpur Road, Dehradun',     r: 4.3, rv: 812,  p: 3200,  d: 0.8, e: '🛏️', g: 'linear-gradient(135deg,#ffe6b8,#ffb020)', img: '/assets/images/apartment-interior2.webp' },
  { id: 3, t: 'stay',   n: 'Hill Comfort PG',         c: 'Clock Tower, Dehradun',     r: 4.1, rv: 240,  p: 7500,  d: 2.4, e: '🏢', g: 'linear-gradient(135deg,#d3f5e6,#4cd6a1)', img: '/assets/images/apt-bangalore.webp' },
  { id: 4, t: 'rental', n: '2BHK Family Apartment',   c: 'Ballupur, Dehradun',        r: 4.6, rv: 156,  p: 14000, d: 3.1, e: '🏠', g: 'linear-gradient(135deg,#e3d4ff,#a78bfa)', img: '/assets/images/apartment-interior2.webp' },
  { id: 5, t: 'rental', n: 'Pool Villa Rental',       c: 'Mussoorie Road',            r: 4.8, rv: 97,   p: 22000, d: 9.5, e: '🏡', g: 'linear-gradient(135deg,#c6f0ff,#4cc3e8)', img: '/assets/images/hampi-karnataka.webp' },
  { id: 6, t: 'rental', n: 'Single Room near ISBT',   c: 'ISBT, Dehradun',            r: 4.0, rv: 310,  p: 5500,  d: 1.9, e: '🚪', g: 'linear-gradient(135deg,#ffd6d6,#ff8a7a)', img: '/assets/images/mumbai-apt.webp' },
];

export const SERVICE_CATEGORIES = [
  { name: 'Plumber',      emoji: '🚰', img: '/assets/images/service-electrician.webp' },
  { name: 'Electrician',  emoji: '⚡', img: '/assets/images/service-electrician.webp' },
  { name: 'Carpenter',    emoji: '🪚', img: '/assets/images/service-painter.webp' },
  { name: 'Painter',      emoji: '🖌️',  img: '/assets/images/service-painter.webp' },
];

export const STATIC_PROVIDERS = (() => {
  const sv = [['Plumber','🚰'],['Electrician','⚡'],['Carpenter','🪚'],['Painter','🖌️']];
  const nm = ['Ravi Kumar','Anil Negi','Sunita Rawat','Deepak Joshi','Mohan Bisht','Priya Thapa'];
  return sv.flatMap(([s], i) =>
    [0, 1, 2].map(k => ({
      s, n: nm[(i + k * 2) % 6],
      r: +((4.2 + ((i + k * 3) % 8) / 10).toFixed(1)),
      d: +((0.6 + k * 1.3 + i * 0.4).toFixed(1)),
      p: 249 + i * 50 + k * 60,
      instant: k !== 1,
      verified: k !== 2,
    }))
  );
})();
