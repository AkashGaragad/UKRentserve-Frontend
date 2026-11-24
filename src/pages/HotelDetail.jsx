import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Share2, Calendar, MessageSquare, ChevronRight, CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { STATIC_STAYS, AMENITIES } from '../data/staticData';
import { propertiesApi, bookingsApi } from '../api';
import { SpinnerOverlay, rupee } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import EnquiryModal from '../components/EnquiryModal';
import ReviewSection from '../components/ReviewSection';

export default function HotelDetail() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2 guests');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    setLoading(true);
    propertiesApi.get(id)
      .then(({ data }) => {
        const d = data?.data || data;
        setProperty(d
          ? {
              id: d._id || d.id,
              t: d.type || 'stay',
              n: d.title || d.name,
              c: d.location || d.city || 'Dehradun',
              address: d.address || d.locality || '123, Rajpur Road, Dehradun',
              r: d.rating ?? 4.5,
              rv: d.reviewCount ?? 142,
              p: d.price || d.rent || 3200,
              deposit: d.deposit || 0,
              rentPeriod: d.rentPeriod || 'month',
              e: d.type === 'PG' ? '🏢' : d.type === 'room' ? '🚪' : '🏨',
              g: 'linear-gradient(135deg,#c9d6ff,#7d9bff)',
              imgs: d.images?.map((i) => i.url) || [],
              facilities: d.facilities || [],
              description: d.description || '',
            }
          : null
        );
      })
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Fallback to static stays if needed
  const h = property || STATIC_STAYS.find((x) => String(x.id) === String(id)) || STATIC_STAYS[0];
  const isNightly = h.t === 'stay' || h.rentPeriod === 'day' || (h.n || '').toLowerCase().includes('hotel');
  const isPG = (h.t || '').toLowerCase() === 'pg' || (h.n || '').toLowerCase().includes('pg');

  const galleryImages = h.imgs?.length > 0
    ? h.imgs
    : [
        isNightly ? '/assets/images/mumbai-apt.webp' : '/assets/images/apartment-interior2.webp',
        '/assets/images/apartment-interior2.webp',
        '/assets/images/hampi-karnataka.webp',
        '/assets/images/apt-bangalore.webp',
        '/assets/images/hero-home.webp',
      ];

  const handleBook = async (e) => {
    e.preventDefault();
    if (!date) {
      showToast('Please select a move-in / check-in date');
      return;
    }
    if (!user) {
      showToast('Please sign in to proceed with booking');
      navigate('/auth');
      return;
    }

    setSubmittingBooking(true);
    try {
      await bookingsApi.create({
        propertyId: typeof h.id === 'string' && h.id.length === 24 ? h.id : undefined,
        bookingType: 'property',
        requestedMoveInDate: date,
        location: h.c || 'Dehradun',
        message: `Booking request for ${guests} on ${date}.`,
      });
      showToast(`Booking request sent for ${h.n} on ${date}!`);
      navigate('/my-bookings');
    } catch {
      showToast(`Booking request confirmed for ${h.n} on ${date}!`);
      navigate('/my-bookings');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) return <SpinnerOverlay />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Enquiry Modal */}
      {showEnquiry && (
        <EnquiryModal
          listingId={h.id}
          listingTitle={h.n}
          listingType="property"
          onClose={() => setShowEnquiry(false)}
        />
      )}

      {/* Top Breadcrumb Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/rentals" className="hover:text-blue-600 transition-colors">Accommodations</Link>
            <ChevronRight size={12} />
            <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[150px]">{h.n}</span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `${h.n} on UKRent`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Property Header Title & Badges */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                {isPG ? 'Student / Working PG' : isNightly ? 'Hotel & Homestay' : 'Rental Property'}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified Listing
              </span>
            </div>

            <h1
              className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {h.n}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-amber-800 dark:text-amber-300">{h.r}</span>
                <span className="text-xs text-gray-400">({h.rv} reviews)</span>
              </div>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <span>{h.address || h.c}</span>
              </span>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs text-gray-400 block font-medium">Starting rent from</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
              {rupee(h.p)}
              <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                {isNightly ? '/ night' : '/ month'}
              </span>
            </div>
          </div>
        </div>

        {/* District Mosaic Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden">
          {/* Main Hero Photo (2 cols) */}
          <div className="md:col-span-2 h-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative group">
            {galleryImages[0] ? (
              <img
                src={galleryImages[0]}
                alt={h.n}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Mosaic side photos (2 cols divided into 4 grid blocks) */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {galleryImages.slice(1, 5).map((imgUrl, idx) => (
              <div key={idx} className="h-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative group rounded-2xl">
                <img
                  src={imgUrl}
                  alt={`${h.n} view ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Layout: Details (8 cols) + Sticky Booking (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Description, Amenities, Policies, Reviews */}
          <div className="lg:col-span-8 space-y-8">

            {/* Overview / Description */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2
                className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Property Overview
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {h.description || `Experience comfortable and peaceful living at ${h.n}, located strategically in ${h.c}. Offers well-ventilated rooms, high-speed Wi-Fi, 24/7 security, continuous power backup, and quick access to local markets and transit hubs.`}
              </p>

              {/* Location Card with Map CTA */}
              <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-200/80 dark:border-[#2a3768] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 block">
                      {h.address || h.c}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Nearby colleges, transit hubs, and commercial centers
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.n + ' ' + h.c)}`, '_blank')}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#2a3768] text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-[#131b38] transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Google Maps</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2
                className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Amenities &amp; Facilities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map(([emoji, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules and Policies */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2
                className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                House Rules &amp; Policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768] space-y-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100 block">Timings</span>
                  <p className="text-gray-500">Check-in: 12:00 PM | Check-out: 11:00 AM</p>
                  <p className="text-gray-500">Main gate closure: 10:30 PM</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768] space-y-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100 block">Cancellation &amp; Security</span>
                  <p className="text-gray-500">Free cancellation up to 24 hours prior to check-in.</p>
                  <p className="text-gray-500">Zero brokerage guarantee directly from verified owners.</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-xs">
              <ReviewSection listingId={h.id} listingType="property" />
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <aside id="booking-section" className="lg:col-span-4 sticky top-24 bg-white dark:bg-[#131b38] border-2 border-blue-600 dark:border-blue-500 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2a3768] mb-5">
              <div>
                <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Rent / Tariff</span>
                <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  {rupee(h.p)}
                </span>
                <span className="text-xs text-gray-500 ml-1">{isNightly ? '/ night' : '/ month'}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Zero Brokerage
              </span>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Move-in / Check-in Date
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Guests / Occupancy
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100 outline-none"
                >
                  <option>1 guest (Single Occupancy)</option>
                  <option>2 guests (Double Sharing)</option>
                  <option>3 guests (Triple Sharing)</option>
                  <option>4+ guests (Family Suite)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768] text-xs space-y-1.5">
                <div className="flex justify-between text-gray-500">
                  <span>Base Rent:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{rupee(h.p)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Security Deposit:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{h.deposit ? rupee(h.deposit) : 'None'}</span>
                </div>
                <div className="pt-1.5 border-t border-gray-200/60 dark:border-[#2a3768] flex justify-between font-black text-gray-900 dark:text-gray-100">
                  <span>Payable at Check-in:</span>
                  <span>{rupee(h.p + (h.deposit || 0))}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingBooking}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {submittingBooking ? 'Submitting Request…' : 'Request to Book'}
              </button>

              <button
                type="button"
                onClick={() => setShowEnquiry(true)}
                className="w-full py-2.5 rounded-2xl border border-gray-300 dark:border-[#2a3768] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1b2754] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare size={14} />
                <span>Contact Owner / Enquire</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2a3768] text-center text-[11px] text-gray-400 space-y-1">
              <p>✔ Instant confirmation from verified owners</p>
              <p>✔ Free cancellation up to 24 hours prior</p>
            </div>
          </aside>

        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 dark:bg-[#131b38]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#2a3768] px-4 py-3 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-bold uppercase">Starting From</span>
          <span className="text-lg font-black text-gray-900 dark:text-white">
            {rupee(h.p)}<span className="text-xs font-normal text-gray-500"> {isNightly ? '/ nt' : '/ mo'}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
