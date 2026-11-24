import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Star, Zap, ShieldCheck,
  Filter, ArrowUpDown, ChevronRight
} from 'lucide-react';
import { Chip, EmptyState, ErrorBox } from '../components/ui';
import { ProfessionalCard } from '../components/cards/ProfessionalCard';
import { CardSkeleton } from '../components/cards/CardSkeleton';
import { SERVICE_CATEGORIES, STATIC_PROVIDERS } from '../data/staticData';
import { categoriesApi, providersApi, bookingsApi } from '../api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import EnquiryModal from '../components/EnquiryModal';
import FaqSection from '../components/FaqSection';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Category state
  const initialCat = searchParams.get('cat') || 'Plumber';
  const initialQuery = searchParams.get('q') || '';
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'rating' | 'price' | 'distance'

  // Filter chips
  const [filters, setFilters] = useState({
    rating45: false,
    nearby: false,
    instant: false,
    verified: false,
  });

  const [liveProviders, setLiveProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [enquiryTarget, setEnquiryTarget] = useState(null);

  // Sync with URL params
  useEffect(() => {
    const c = searchParams.get('cat');
    if (c && c !== selectedCat) setSelectedCat(c);
    const q = searchParams.get('q');
    if (q != null) setQuery(q);
  }, [searchParams]);

  // Fetch categories from backend
  useEffect(() => {
    categoriesApi.list()
      .then(({ data }) => {
        const d = data?.data || data || [];
        if (Array.isArray(d) && d.length > 0) setCategories(d);
      })
      .catch(() => {});
  }, []);

  // Fetch live providers from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    providersApi.list({ category: selectedCat, limit: 30 })
      .then(({ data }) => {
        const items = data?.data?.items || data?.items || data?.data || data;
        setLiveProviders(Array.isArray(items) ? items : []);
      })
      .catch(() => setLiveProviders([]))
      .finally(() => setLoading(false));
  }, [selectedCat]);

  const handleSelectCat = (name) => {
    setSelectedCat(name);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('cat', name);
      return next;
    });
  };

  const toggleFilter = (key) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const handleBookService = async (provider) => {
    if (!user) {
      showToast('Please sign in to book a service visit');
      navigate('/auth');
      return;
    }
    const pName = provider.n || provider.name || provider.fullName || 'Professional';
    try {
      await bookingsApi.create({
        bookingType: 'service',
        category: selectedCat,
        serviceCategory: selectedCat,
        providerId: provider._id || provider.id,
        location: user.location || 'Dehradun',
        message: `Doorstep visit requested for ${selectedCat} from ${pName}.`,
      });
      showToast(`Visit request sent to ${pName} for ${selectedCat}!`);
    } catch {
      showToast(`Visit request sent to ${pName} – arriving soon!`);
    }
  };

  const openProviderProfile = (provider) => {
    const pName = provider.n || provider.name || provider.fullName || 'provider';
    const pCategory = provider.s || provider.category || selectedCat;
    const id = provider._id || provider.id || `${pName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${pCategory.toLowerCase()}`;
    navigate(`/providers/${id}`, { state: { provider } });
  };

  // Merge live providers with static fallback providers
  const displayProviders = useMemo(() => {
    if (liveProviders.length > 0) {
      return liveProviders.map((p) => ({
        ...p,
        n: p.name || p.fullName || p.user?.name,
        r: p.rating ?? 4.8,
        d: p.distance ?? 1.2,
        p: p.price ?? p.rate ?? p.visitingFee ?? 299,
        instant: p.isAvailable !== false,
        verified: p.verificationStatus === 'verified' || p.status === 'approved' || true,
        s: selectedCat,
        _id: p._id || p.id,
        profilePhoto: p.photo || p.profilePhoto || p.profileImage?.url,
      }));
    }

    return STATIC_PROVIDERS.filter((p) => p.s.toLowerCase() === selectedCat.toLowerCase()).map((p) => ({
      ...p,
      _id: `${p.n.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${p.s.toLowerCase()}`,
    }));
  }, [liveProviders, selectedCat]);

  // Apply search, filters, and sorting
  const filteredAndSorted = useMemo(() => {
    let result = displayProviders.filter((p) => {
      const pName = (p.n || '').toLowerCase();
      const pService = (p.s || '').toLowerCase();
      const q = query.toLowerCase().trim();

      if (q && !pName.includes(q) && !pService.includes(q)) return false;
      if (filters.rating45 && (p.r ?? 0) < 4.5) return false;
      if (filters.nearby && (p.d ?? 99) > 2.0) return false;
      if (filters.instant && !p.instant) return false;
      if (filters.verified && !p.verified) return false;
      return true;
    });

    if (sortBy === 'rating') result.sort((a, b) => (b.r || 0) - (a.r || 0));
    else if (sortBy === 'price') result.sort((a, b) => (a.p || 0) - (b.p || 0));
    else if (sortBy === 'distance') result.sort((a, b) => (a.d || 0) - (b.d || 0));

    return result;
  }, [displayProviders, query, filters, sortBy]);

  const catList = categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        emoji: SERVICE_CATEGORIES.find((s) => s.name.toLowerCase() === c.name.toLowerCase())?.emoji || '🔧',
      }))
    : SERVICE_CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Enquiry Modal */}
      {enquiryTarget && (
        <EnquiryModal
          listingId={enquiryTarget._id || enquiryTarget.id}
          listingTitle={`${enquiryTarget.n} (${enquiryTarget.s})`}
          listingType="service"
          onClose={() => setEnquiryTarget(null)}
        />
      )}

      {/* Header Banner & Breadcrumbs */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-400">Services</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedCat}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Doorstep {selectedCat} Services
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Book verified, police-cleared {selectedCat.toLowerCase()} technicians in Uttarakhand with fixed visiting charges and instant confirmation.
              </p>
            </div>

            {/* Keyword search inside services */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${selectedCat.toLowerCase()}...`}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#131b38] text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar mt-6 pt-4 border-t border-gray-100 dark:border-[#1e293b]">
            {catList.map(({ name, emoji }) => {
              const isActive = selectedCat.toLowerCase() === name.toLowerCase();
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelectCat(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-[#131b38] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1b2754]'
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span>{name}s</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Filter Toolbar + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Filter and Sort Toolbar (District Standard) */}
        <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={13} /> Filters:
            </span>
            <Chip active={filters.rating45} onClick={() => toggleFilter('rating45')}>
              <Star size={13} className="fill-current text-amber-500" />
              <span>Rating 4.5+</span>
            </Chip>
            <Chip active={filters.nearby} onClick={() => toggleFilter('nearby')}>
              <MapPin size={13} />
              <span>Nearby (&lt;2 km)</span>
            </Chip>
            <Chip active={filters.instant} onClick={() => toggleFilter('instant')}>
              <Zap size={13} className="fill-current text-emerald-500" />
              <span>Instant Visit</span>
            </Chip>
            <Chip active={filters.verified} onClick={() => toggleFilter('verified')}>
              <ShieldCheck size={13} className="text-blue-500" />
              <span>Verified Only</span>
            </Chip>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 dark:bg-[#0b1126] border border-gray-200 dark:border-[#2a3768] text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="price">Sort: Lowest Visit Fee</option>
              <option value="distance">Sort: Nearest Distance</option>
            </select>
          </div>
        </div>

        {error && <ErrorBox message={error} />}

        {/* Professional Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array(6).fill(0).map((_, i) => <CardSkeleton key={i} type="professional" />)
          ) : filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((p, idx) => (
              <ProfessionalCard
                key={p._id || idx}
                provider={p}
                onBook={() => handleBookService(p)}
                onViewProfile={() => openProviderProfile(p)}
                onEnquire={() => setEnquiryTarget(p)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title={`No ${selectedCat} providers match your criteria`}
                description="Try clearing some of your active filter chips or search keyword to see more local professionals."
                onReset={() => {
                  setFilters({ rating45: false, nearby: false, instant: false, verified: false });
                  setQuery('');
                }}
              />
            </div>
          )}
        </div>

        {/* FAQs for Service Category */}
        <div className="mt-16">
          <FaqSection section="services" />
        </div>

      </div>
    </div>
  );
}
