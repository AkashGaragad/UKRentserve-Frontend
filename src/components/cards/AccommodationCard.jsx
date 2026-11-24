import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Utensils, Wind, ShieldCheck, ArrowRight, Building } from 'lucide-react';
import { rupee } from '../ui';

export function AccommodationCard({ property, href }) {
  const id = property.id || property._id;
  const title = property.n || property.title || property.name || 'Rental Property';
  const type = (property.t || property.type || 'rental').toLowerCase();
  const location = property.c || property.location || property.city || 'Dehradun';
  const distance = property.d != null ? `${property.d} km` : null;
  const rating = property.r ?? property.rating ?? 4.4;
  const reviews = property.rv ?? property.reviewCount ?? 128;
  const rent = property.p ?? property.rent ?? property.price ?? 4500;
  const img = property.img || property.images?.[0]?.url;
  const fallbackEmoji = property.e || (type === 'stay' || type === 'hotel' ? '🏨' : type === 'pg' ? '🏢' : '🏠');
  const gradient = property.g || 'linear-gradient(135deg,#c9d6ff,#7d9bff)';

  // Determine classification badge
  const badgeLabel = (() => {
    if (type === 'pg' || title.toLowerCase().includes('pg')) return 'PG Accommodation';
    if (type === 'stay' || type === 'hotel' || title.toLowerCase().includes('hotel')) return 'Hotel / Stay';
    if (type === 'room' || title.toLowerCase().includes('room')) return 'Rental Room';
    return 'Rental Flat';
  })();

  const isNightly = type === 'stay' || type === 'hotel' || property.rentPeriod === 'day' || title.toLowerCase().includes('hotel');

  const facilities = Array.isArray(property.facilities) && property.facilities.length > 0
    ? property.facilities
    : ['Free Wi-Fi', 'Parking', isNightly ? 'AC Room' : 'Water Supply'];

  const cardContent = (
    <div
      data-t={`${title} ${location} ${type}`}
      className="group bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl overflow-hidden hover:border-blue-500/80 dark:hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback Display if image missing */}
        <div
          className={`w-full h-full flex items-center justify-center text-6xl select-none ${img ? 'hidden' : 'flex'}`}
          style={{ background: gradient }}
        >
          {fallbackEmoji}
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full shadow-sm">
            {badgeLabel}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{rating}</span>
            {reviews > 0 && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">({reviews})</span>
            )}
          </div>
        </div>

        {/* Bottom subtle gradient shadow on image */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Location */}
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{location}</span>
            {distance && (
              <>
                <span>·</span>
                <span className="shrink-0 font-medium">{distance}</span>
              </>
            )}
          </div>

          {/* Quick Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {facilities.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#1b2754] px-2 py-0.5 rounded-md"
              >
                {f.toLowerCase().includes('wi-fi') ? <Wifi size={10} /> :
                 f.toLowerCase().includes('food') || f.toLowerCase().includes('mess') ? <Utensils size={10} /> :
                 f.toLowerCase().includes('ac') ? <Wind size={10} /> : null}
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-3 border-t border-gray-100 dark:border-[#2a3768] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 block leading-tight">Price starting from</span>
            <div className="text-base font-black text-gray-900 dark:text-gray-100">
              {typeof rent === 'number' ? rupee(rent) : rent}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                {isNightly ? '/ night' : '/ month'}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#1b2754] text-gray-800 dark:text-gray-200 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors">
            View
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );

  const destination = href || `/rentals/${id}`;
  return (
    <Link to={destination} className="block h-full no-underline">
      {cardContent}
    </Link>
  );
}
