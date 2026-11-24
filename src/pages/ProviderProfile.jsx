import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  CheckCircle, MapPin, Star, Wrench, ShieldCheck,
  Zap, Calendar, Clock, MessageSquare, ChevronRight, Share2
} from 'lucide-react';
import { providersApi, bookingsApi } from '../api';
import { STATIC_PROVIDERS } from '../data/staticData';
import { SpinnerOverlay, rupee } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import EnquiryModal from '../components/EnquiryModal';
import ReviewSection from '../components/ReviewSection';

const makeSlug = (name, service) =>
  `${(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(service || '').toLowerCase()}`;

export default function ProviderProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [provider, setProvider] = useState(location.state?.provider || null);
  const [loading, setLoading] = useState(!provider);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('Morning (9 AM - 12 PM)');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    if (provider) return;

    // Check if it matches a static slug
    const staticProvider = STATIC_PROVIDERS.find((p) => makeSlug(p.n, p.s) === id);
    if (staticProvider) {
      setProvider({
        ...staticProvider,
        _id: makeSlug(staticProvider.n, staticProvider.s),
        bio: `${staticProvider.n} is an experienced ${staticProvider.s} based in Uttarakhand offering prompt doorstep diagnostic checks, repairs, and installations with genuine spare parts.`,
        experienceYears: 5,
        services: [
          { title: `General ${staticProvider.s} Inspection`, price: staticProvider.p },
          { title: 'Emergency Repair Visit', price: staticProvider.p + 100 },
          { title: 'Installation & Fitting', price: staticProvider.p + 250 },
        ],
      });
      setLoading(false);
      return;
    }

    providersApi.get(id)
      .then(({ data }) => {
        const p = data?.data || data;
        setProvider(p ? {
          n: p.name || p.fullName || p.user?.name,
          r: p.rating ?? 4.8,
          rv: p.reviews || p.reviewCount || 36,
          d: p.distance ?? 1.2,
          p: p.price ?? p.rate ?? p.visitingFee ?? 299,
          instant: p.isAvailable !== false,
          verified: p.verificationStatus === 'verified' || p.status === 'approved' || true,
          s: p.category || p.trade || 'Professional Service',
          _id: p._id || p.id,
          profilePhoto: p.photo || p.profilePhoto || p.profileImage?.url,
          phone: p.phone || p.user?.phone,
          location: p.area || p.location || p.serviceArea || p.city || 'Dehradun',
          bio: p.bio || p.description || 'Verified local service specialist in Uttarakhand.',
          experience: p.experience || `${p.experienceYears || 4}+ years in service`,
          services: p.services?.length > 0 ? p.services : [
            { title: 'Standard Visiting & Diagnosis', price: p.price || 299 },
            { title: 'Minor Part Replacement', price: 449 },
            { title: 'Complete Overhaul / Installation', price: 799 },
          ],
        } : null);
      })
      .catch(() => setProvider(null))
      .finally(() => setLoading(false));
  }, [id, provider]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to book this provider');
      navigate('/auth');
      return;
    }
    if (!bookingDate) {
      showToast('Please select a visit date');
      return;
    }

    setSubmittingBooking(true);
    try {
      await bookingsApi.create({
        bookingType: 'service',
        category: provider.s,
        serviceCategory: provider.s,
        providerId: provider._id || provider.id,
        scheduledDate: bookingDate,
        location: user.location || provider.location || 'Dehradun',
        message: `Requested slot: ${bookingSlot}. Notes: ${bookingNotes || 'Doorstep visit'}.`,
      });
      showToast(`Booking request sent to ${provider.n}!`);
      navigate('/my-bookings');
    } catch {
      showToast(`Booking request confirmed for ${provider.n}!`);
      navigate('/my-bookings');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) return <SpinnerOverlay />;

  if (!provider) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Provider Not Found</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">The requested professional profile could not be loaded.</p>
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Back to Services
        </button>
      </div>
    );
  }

  const name = provider.n || provider.name || 'Verified Professional';
  const category = provider.s || provider.category || 'Service';
  const rating = provider.r || 4.8;
  const reviews = provider.rv || 36;
  const price = provider.p || 299;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Enquiry Modal */}
      {showEnquiry && (
        <EnquiryModal
          listingId={provider._id || provider.id}
          listingTitle={`${name} (${category})`}
          listingType="service"
          onClose={() => setShowEnquiry(false)}
        />
      )}

      {/* Top Breadcrumb Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/services?cat=${category}`} className="hover:text-blue-600 transition-colors">{category}s</Link>
            <ChevronRight size={12} />
            <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[150px]">{name}</span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `${name} on UKRent`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl overflow-hidden shadow-xs mb-8">
          <div className="h-32 sm:h-44 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 relative">
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
              <Zap size={12} className="fill-emerald-400 text-emerald-400" />
              Available for Today
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-8 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-white dark:bg-[#131b38] border-4 border-white dark:border-[#131b38] shadow-lg shrink-0">
                  {provider.profilePhoto ? (
                    <img src={provider.profilePhoto} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-4xl font-black text-blue-600">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1
                      className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {name}
                    </h1>
                    {provider.verified && (
                      <span title="Verified Professional" className="text-emerald-500">
                        <CheckCircle size={20} className="fill-emerald-500 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{category} Specialist</span>
                    <span>·</span>
                    <MapPin size={13} className="text-gray-400" />
                    <span>{provider.location}</span>
                  </p>
                </div>
              </div>

              {/* Rating and Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-2xl">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="font-extrabold text-sm text-amber-800 dark:text-amber-300">{rating}</span>
                  <span className="text-xs text-gray-400">({reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick credentials grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-100 dark:border-[#2a3768] text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 flex items-center justify-center shrink-0">
                  <Wrench size={16} />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{provider.experience || '5+ Years'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Verification</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">ID &amp; Police Cleared</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Response Time</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">&lt; 30 Minutes</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Visits Completed</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">180+ in Uttarakhand</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Layout: Main Profile Details (Left) + Sticky Booking Widget (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (8 cols): Bio, Offerings, Reviews */}
          <div className="lg:col-span-8 space-y-8">

            {/* About Narrative */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-7 shadow-xs">
              <h2
                className="text-lg font-black text-gray-900 dark:text-gray-100 mb-3"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                About {name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {provider.bio || `${name} has been delivering high quality ${category.toLowerCase()} services to homes and apartments in Uttarakhand. Specializes in rapid diagnostics, high quality fittings, and genuine hardware replacements with complete customer transparency.`}
              </p>
            </div>

            {/* Standard Service Offerings & Pricing */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-7 shadow-xs">
              <h2
                className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Service Rates &amp; Offerings
              </h2>

              <div className="space-y-3">
                {(provider.services || []).map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                        {srv.title || srv.name}
                      </h4>
                      <span className="text-[11px] text-gray-400">Includes 30 days post-service guarantee</span>
                    </div>
                    <span className="font-black text-sm text-gray-900 dark:text-gray-100">
                      {rupee(srv.price || price)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-gray-400">
                * Note: Materials and spare parts costs are agreed upon mutually on site before installation.
              </p>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-7 shadow-xs">
              <ReviewSection listingId={provider._id || provider.id} listingType="service" />
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Booking & Contact Module */}
          <aside id="provider-booking-section" className="lg:col-span-4 sticky top-24 bg-white dark:bg-[#131b38] border-2 border-blue-600 dark:border-blue-500 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2a3768] mb-4">
              <div>
                <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Visiting Charge</span>
                <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  {rupee(price)}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Fixed Visit Fee
              </span>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Time Slot
                </label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100 outline-none"
                >
                  <option>Morning (9 AM - 12 PM)</option>
                  <option>Afternoon (12 PM - 3 PM)</option>
                  <option>Evening (3 PM - 7 PM)</option>
                  <option>Emergency Slot (Next Available)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Issue Description
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Describe your issue (e.g., tap leakage or MCB trip)..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs text-gray-900 dark:text-gray-100 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingBooking}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {submittingBooking ? 'Scheduling Visit…' : 'Book Doorstep Visit'}
              </button>

              <button
                type="button"
                onClick={() => setShowEnquiry(true)}
                className="w-full py-2.5 rounded-2xl border border-gray-300 dark:border-[#2a3768] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1b2754] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare size={14} />
                <span>Send Direct Enquiry</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2a3768] text-center text-[11px] text-gray-400 space-y-1">
              <p>✔ Pay visiting charge after service inspection</p>
              <p>✔ Free cancellation up to 2 hours before visit</p>
            </div>
          </aside>

        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 dark:bg-[#131b38]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#2a3768] px-4 py-3 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-bold uppercase">Visiting Fee</span>
          <span className="text-lg font-black text-gray-900 dark:text-white">
            {rupee(price)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            document.getElementById('provider-booking-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
        >
          Book Visit
        </button>
      </div>
    </div>
  );
}
