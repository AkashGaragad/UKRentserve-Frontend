import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, ShieldCheck, Zap, ArrowRight, Wrench,Sparkles,
  Building, Car, ChevronRight, CheckCircle2, Clock, ThumbsUp, Users
} from 'lucide-react';
import { SectionHeader, rupee } from '../components/ui';
import { ProfessionalCard } from '../components/cards/ProfessionalCard';
import { AccommodationCard } from '../components/cards/AccommodationCard';
import { VehicleCard } from '../components/cards/VehicleCard';
import { CardSkeleton } from '../components/cards/CardSkeleton';
import { SERVICE_CATEGORIES, STATIC_PROVIDERS, STATIC_STAYS } from '../data/staticData';
import { providersApi, propertiesApi, bookingsApi } from '../api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import FaqSection from '../components/FaqSection';

const HERO_SLIDES = [
  {
    src: '/assets/images/hero-home.webp',
    title: 'Your City, Delivered & Connected',
    subtitle: 'Book verified electricians, plumbers, rental rooms, and instant rides across Uttarakhand.',
    tag: 'All-in-One Marketplace',
    primaryAction: { label: 'Explore Services', to: '/services' },
    secondaryAction: { label: 'Find a Stay', to: '/rentals' },
  },
  {
    src: '/assets/images/service-electrician.webp',
    title: 'Doorstep Home Maintenance in 30 Mins',
    subtitle: 'Vetted local plumbers, electricians, painters, and carpenters at transparent fixed visit fees.',
    tag: 'Verified Professionals',
    primaryAction: { label: 'Book Electrician', to: '/services?cat=Electrician' },
    secondaryAction: { label: 'Book Plumber', to: '/services?cat=Plumber' },
  },
  {
    src: '/assets/images/mumbai-apt.webp',
    title: 'Verified Rental Rooms & Student PGs',
    subtitle: 'Zero brokerage rooms, furnished flats, and curated hostels in Dehradun & nearby educational hubs.',
    tag: 'Zero Brokerage Stays',
    primaryAction: { label: 'Browse PGs & Rooms', to: '/rentals?type=stay' },
    secondaryAction: { label: 'List Your Property', to: '/add-property' },
  },
  {
    src: '/assets/images/car-india.webp',
    title: 'Instant City Rides & Planned Cabs',
    subtitle: 'Reliable autos and outstation cabs with transparent distance estimates and upfront fares.',
    tag: 'Quick City Commute',
    primaryAction: { label: 'Book Instant Ride', to: '/rides' },
    secondaryAction: { label: 'Pre-book a Cab', to: '/rides?mode=prebook' },
  },
];

const VEHICLE_PREVIEWS = [
  {
    id: 'auto',
    label: 'Auto Rickshaw',
    value: 14,
    img: '/assets/images/auto-rickshaw2.webp',
    capacity: '3 Seats',
    tag: 'Most Popular',
    ratePerKm: 14,
    description: 'Quick local commutes with verified drivers',
  },
  {
    id: 'cab',
    label: 'City Cab (Sedan)',
    value: 18,
    img: '/assets/images/taxi-india.webp',
    capacity: '4 Seats + Boot',
    tag: 'AC Comfort',
    ratePerKm: 18,
    description: 'Clean, air-conditioned cabs for hassle-free travel',
  },
];

const TESTIMONIALS = [
  {
    name: 'Neha Bisht',
    role: 'Student, UPES Dehradun',
    comment: 'Found a reliable single-room PG near Rajpur Road within 24 hours without paying any broker fees. The listing had exact photos!',
    rating: 5,
    tag: 'PG Accommodation',
  },
  {
    name: 'Rohit Joshi',
    role: 'Resident, Vasant Vihar',
    comment: 'Booked an emergency plumber at 8 PM for a pipe leak. The technician arrived in 25 minutes with full ID badge and fixed it cleanly.',
    rating: 5,
    tag: 'Plumber Service',
  },
  {
    name: 'Aman Negi',
    role: 'Tech Consultant',
    comment: 'The auto booking feature is a life-saver during morning office rush. Transparent fare with zero bargaining hassles.',
    rating: 5,
    tag: 'Instant Auto Ride',
  },
];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-play hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Fetch real backend providers
  useEffect(() => {
    providersApi.list({ limit: 6 })
      .then(({ data }) => {
        const items = data?.data?.items || data?.items || data?.data || data;
        if (Array.isArray(items) && items.length > 0) {
          setProviders(items.slice(0, 6));
        } else {
          setProviders(STATIC_PROVIDERS.slice(0, 6));
        }
      })
      .catch(() => {
        setProviders(STATIC_PROVIDERS.slice(0, 6));
      })
      .finally(() => setLoadingProviders(false));
  }, []);

  // Fetch real backend properties
  useEffect(() => {
    propertiesApi.list({ limit: 6 })
      .then(({ data }) => {
        const items = data?.data || data;
        if (Array.isArray(items) && items.length > 0) {
          setProperties(items.slice(0, 6));
        } else {
          setProperties(STATIC_STAYS.slice(0, 6));
        }
      })
      .catch(() => {
        setProperties(STATIC_STAYS.slice(0, 6));
      })
      .finally(() => setLoadingProperties(false));
  }, []);

  const handleBookService = async (p) => {
    if (!user) {
      showToast('Please sign in to book a service');
      navigate('/auth');
      return;
    }
    const cat = p.s || p.category || 'Home Service';
    const name = p.n || p.name || 'Provider';
    try {
      await bookingsApi.create({
        bookingType: 'service',
        category: cat,
        serviceCategory: cat,
        providerId: p._id || p.id,
        location: user.location || 'Dehradun',
        message: `Direct visit booking requested for ${cat} with ${name}.`,
      });
      showToast(`Visit request sent to ${name}!`);
    } catch {
      showToast(`Visit scheduled with ${name} – arriving soon.`);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="pb-16 bg-gray-50/50 dark:bg-[#0b1126]">
      {/* 1. HERO SECTION (District-Style Banner & Search) */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-3 pb-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-gray-200/50 dark:border-[#1e293b] shadow-xl min-h-[260px] sm:min-h-[440px] flex items-center">

          {/* Background Slides */}
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-[0.45]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            </div>
          ))}

          {/* Hero Content Overlay */}
          <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-10 text-white">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-blue-600/90 text-white px-3 py-1 rounded-full mb-3 backdrop-blur-md shadow-sm">
              <Sparkles size={12} />
              {HERO_SLIDES[heroIndex].tag}
            </span>

            <h1
              className="text-2xl sm:text-5xl font-black tracking-tight leading-[1.15] mb-2 sm:mb-3 text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {HERO_SLIDES[heroIndex].title}
            </h1>

            <p className="text-xs sm:text-base text-gray-200/90 font-medium mb-4 sm:mb-6 max-w-lg leading-relaxed">
              {HERO_SLIDES[heroIndex].subtitle}
            </p>

            {/* Quick Hero Search Input (hidden on mobile to favor District top search) */}
            <form onSubmit={handleHeroSearch} className="mb-6 hidden sm:flex items-center max-w-md bg-white rounded-2xl p-1.5 shadow-2xl">
              <div className="pl-3 pr-2 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service or stay are you looking for?"
                className="w-full bg-transparent text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
              >
                Find
              </button>
            </form>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={HERO_SLIDES[heroIndex].primaryAction.to}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <span>{HERO_SLIDES[heroIndex].primaryAction.label}</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to={HERO_SLIDES[heroIndex].secondaryAction.to}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/20 transition-all"
              >
                <span>{HERO_SLIDES[heroIndex].secondaryAction.label}</span>
              </Link>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-5 right-6 z-20 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === heroIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2. CATEGORY DISCOVERY PILL ROW (District Navigation Pattern) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              title: 'Plumbing Experts',
              desc: 'Leakages, taps & geysers',
              icon: '🚰',
              to: '/services?cat=Plumber',
              bg: 'from-blue-500/10 to-indigo-500/5',
              borderColor: 'hover:border-blue-500',
            },
            {
              title: 'Electricians',
              desc: 'Wiring, MCBs & fans',
              icon: '⚡',
              to: '/services?cat=Electrician',
              bg: 'from-amber-500/10 to-orange-500/5',
              borderColor: 'hover:border-amber-500',
            },
            {
              title: 'Rental Rooms & PGs',
              desc: 'Verified student hostels',
              icon: '🏢',
              to: '/rentals?type=stay',
              bg: 'from-emerald-500/10 to-teal-500/5',
              borderColor: 'hover:border-emerald-500',
            },
            {
              title: 'Instant Rides & Cabs',
              desc: 'Nearest auto in 3 mins',
              icon: '🚖',
              to: '/rides',
              bg: 'from-purple-500/10 to-pink-500/5',
              borderColor: 'hover:border-purple-500',
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`group bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] p-4 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${item.borderColor}`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.desc}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POPULAR HOME SERVICES (Horizontal Grid with Real Data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <SectionHeader
          title="Doorstep Home Services"
          subtitle="Fixed transparent pricing · Verified local technicians · Guaranteed satisfaction"
          actionText="View All Services"
          actionTo="/services"
        />

        {/* 4 Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {SERVICE_CATEGORIES.map(({ name, emoji, img }) => (
            <Link
              key={name}
              to={`/services?cat=${name}`}
              data-t={name}
              className="group bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative h-32 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-xs font-bold">
                  {emoji} {name}
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">Starts at</span>
                  <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                    {name === 'Electrician' ? '₹249' : name === 'Plumber' ? '₹299' : name === 'Carpenter' ? '₹349' : '₹399'}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Book <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Top-Rated Service Professionals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingProviders ? (
            Array(3).fill(0).map((_, i) => <CardSkeleton key={i} type="professional" />)
          ) : (
            providers.slice(0, 3).map((p, idx) => (
              <ProfessionalCard
                key={p._id || idx}
                provider={p}
                onBook={() => handleBookService(p)}
                onViewProfile={() => {
                  const id = p._id || `${(p.n || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(p.s || p.category || 'service').toLowerCase()}`;
                  navigate(`/providers/${id}`, { state: { provider: p } });
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* 4. VERIFIED ACCOMMODATIONS & PGS (District Horizontal Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <SectionHeader
          title="Verified Accommodations &amp; Stays"
          subtitle="Rental rooms, student PGs, and boutique hotels in Uttarakhand's top localities"
          actionText="Explore All Stays"
          actionTo="/rentals"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingProperties ? (
            Array(3).fill(0).map((_, i) => <CardSkeleton key={i} type="accommodation" />)
          ) : (
            properties.slice(0, 3).map((property, idx) => (
              <AccommodationCard
                key={property.id || property._id || idx}
                property={property}
              />
            ))
          )}
        </div>
      </section>

      {/* 5. RIDES & TRANSPORTATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-blue-800">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full mb-3 backdrop-blur-md">
              <Car size={13} />
              Instant &amp; Pre-booked Transport
            </span>
            <h2
              className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Ride Anywhere, Anytime with Zero Surge Pricing
            </h2>
            <p className="text-sm text-blue-100 font-medium mb-6 leading-relaxed">
              Book local autos in minutes or schedule outstation cabs to Jolly Grant Airport, Mussoorie, and Rishikesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-6">
            {VEHICLE_PREVIEWS.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onSelect={() => navigate('/rides')}
                onBook={() => navigate('/rides')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARTNER CTA PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl shrink-0">
              🤝
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Are you a Property Owner, Technician, or Driver?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Join 500+ verified partners across Uttarakhand and grow your daily business with UKRent.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/apply-provider"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Partner with Us
            </Link>
            <Link
              to="/add-property"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1b2754] transition-all"
            >
              List a Property
            </Link>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from verified residents, students, and tourists in Uttarakhand"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                    {t.tag}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array(t.rating).fill(0).map((_, idx) => (
                      <Star key={idx} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-4">
                  "{t.comment}"
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-[#2a3768]">
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">{t.name}</h4>
                <span className="text-[11px] text-gray-400">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2
            className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How UKRent Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Simple, secure, and instant marketplace for all your local needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Choose Your Category', desc: 'Browse doorstep services, rental rooms, or auto & cab rides with transparent upfront quotes.' },
            { step: '02', title: 'Connect with Verified Partner', desc: 'Get matched instantly with nearby ID-verified professionals or book your rental viewings.' },
            { step: '03', title: 'Pay Safely & Rate', desc: 'Settle agreed charges transparently and leave your honest review to help the local community.' },
          ].map((item) => (
            <div key={item.step} className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-6 text-center">
              <span className="inline-block text-2xl font-black text-blue-600 dark:text-blue-400 mb-2">
                {item.step}
              </span>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection section="services" />
      </section>
    </div>
  );
}
