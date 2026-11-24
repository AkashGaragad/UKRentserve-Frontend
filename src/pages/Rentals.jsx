import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Star, Filter, ArrowUpDown, ChevronRight, Wifi, Utensils, Wind
} from 'lucide-react';
import { Chip, EmptyState, ErrorBox } from '../components/ui';
import { AccommodationCard } from '../components/cards/AccommodationCard';
import { CardSkeleton } from '../components/cards/CardSkeleton';
import { STATIC_STAYS } from '../data/staticData';
import { propertiesApi } from '../api';
import FaqSection from '../components/FaqSection';

const ACCOMMODATION_TABS = [
  { id: 'all', label: 'All Stays', icon: '✨' },
  { id: 'room', label: 'Rental Rooms', icon: '🏠' },
  { id: 'pg', label: 'PG Accommodation', icon: '🏢' },
  { id: 'stay', label: 'Hotels & Homestays', icon: '🏨' },
];

export default function Rentals() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialType = searchParams.get('type') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchCity, setSearchCity] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'rating' | 'priceAsc' | 'priceDesc' | 'distance'

  // Filter chips
  const [filters, setFilters] = useState({
    rating4: false,
    wifi: false,
    ac: false,
    foodIncluded: false,
  });

  const [liveProps, setLiveProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync params with URL
  useEffect(() => {
    const t = searchParams.get('type');
    if (t && t !== activeTab) setActiveTab(t);
    const q = searchParams.get('q');
    if (q != null) setSearchCity(q);
  }, [searchParams]);

  // Fetch properties from backend
  useEffect(() => {
    setLoading(true);
    setError('');

    const backendType = activeTab === 'all' ? undefined : activeTab;
    propertiesApi.list({ type: backendType, limit: 30 })
      .then(({ data }) => {
        const items = data?.data || data;
        setLiveProps(Array.isArray(items) ? items : []);
      })
      .catch(() => setLiveProps([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tabId === 'all') next.delete('type');
      else next.set('type', tabId);
      return next;
    });
  };

  const toggleFilter = (key) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  // Combine live properties with static fallback
  const displayProperties = useMemo(() => {
    if (liveProps.length > 0) {
      return liveProps.map((p) => ({
        id: p._id || p.id,
        t: p.type || 'rental',
        n: p.title || p.name,
        c: p.location || p.city || 'Dehradun',
        r: p.rating ?? 4.5,
        rv: p.reviewCount ?? 84,
        p: p.rent || p.price || 4500,
        d: p.distance ?? 1.5,
        e: p.type === 'PG' ? '🏢' : p.type === 'room' ? '🚪' : '🏨',
        facilities: p.facilities || ['Free Wi-Fi', 'Parking', 'Water Supply'],
        img: p.images?.[0]?.url || null,
        rentPeriod: p.rentPeriod || 'month',
      }));
    }

    // Static fallback filtered by active tab
    return STATIC_STAYS.filter((x) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'stay') return x.t === 'stay';
      if (activeTab === 'pg') return x.n.toLowerCase().includes('pg') || x.e === '🏢';
      if (activeTab === 'room') return x.t === 'rental' || x.n.toLowerCase().includes('room');
      return true;
    });
  }, [liveProps, activeTab]);

  // Filter and sort items
  const filteredAndSorted = useMemo(() => {
    let result = displayProperties.filter((item) => {
      const title = (item.n || '').toLowerCase();
      const city = (item.c || '').toLowerCase();
      const q = searchCity.toLowerCase().trim();

      if (q && !title.includes(q) && !city.includes(q)) return false;
      if (filters.rating4 && (item.r || 0) < 4.2) return false;

      const facs = (item.facilities || []).map((f) => f.toLowerCase());
      if (filters.wifi && !facs.some((f) => f.includes('wi-fi') || f.includes('wifi'))) return false;
      if (filters.ac && !facs.some((f) => f.includes('ac'))) return false;
      if (filters.foodIncluded && !facs.some((f) => f.includes('food') || f.includes('mess') || f.includes('restaurant'))) return false;

      return true;
    });

    if (sortBy === 'rating') result.sort((a, b) => (b.r || 0) - (a.r || 0));
    else if (sortBy === 'priceAsc') result.sort((a, b) => (a.p || 0) - (b.p || 0));
    else if (sortBy === 'priceDesc') result.sort((a, b) => (b.p || 0) - (a.p || 0));
    else if (sortBy === 'distance') result.sort((a, b) => (a.d || 0) - (b.d || 0));

    return result;
  }, [displayProperties, searchCity, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Header Banner & Breadcrumbs */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-400">Accommodations</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">
              {ACCOMMODATION_TABS.find((t) => t.id === activeTab)?.label || 'All Stays'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Rentals, PGs &amp; Stays in Uttarakhand
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Explore zero-brokerage rental rooms, verified student hostels, and curated hotels in Dehradun, Rishikesh, and Mussoorie.
              </p>
            </div>

            {/* Destination Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search area (e.g., Rajpur Rd)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#131b38] text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Subcategory Navigation Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar mt-6 pt-4 border-t border-gray-100 dark:border-[#1e293b]">
            {ACCOMMODATION_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-[#131b38] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1b2754]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Listing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Filter and Sort Toolbar (District Standard) */}
        <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={13} /> Filters:
            </span>
            <Chip active={filters.rating4} onClick={() => toggleFilter('rating4')}>
              <Star size={13} className="fill-current text-amber-500" />
              <span>Rating 4.2+</span>
            </Chip>
            <Chip active={filters.wifi} onClick={() => toggleFilter('wifi')}>
              <Wifi size={13} />
              <span>Free Wi-Fi</span>
            </Chip>
            <Chip active={filters.ac} onClick={() => toggleFilter('ac')}>
              <Wind size={13} />
              <span>AC Available</span>
            </Chip>
            <Chip active={filters.foodIncluded} onClick={() => toggleFilter('foodIncluded')}>
              <Utensils size={13} />
              <span>Food / Mess</span>
            </Chip>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 dark:bg-[#0b1126] border border-gray-200 dark:border-[#2a3768] text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="priceAsc">Sort: Price (Low to High)</option>
              <option value="priceDesc">Sort: Price (High to Low)</option>
              <option value="distance">Sort: Nearest Distance</option>
            </select>
          </div>
        </div>

        {error && <ErrorBox message={error} />}

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => <CardSkeleton key={i} type="accommodation" />)
          ) : filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((prop, idx) => (
              <AccommodationCard
                key={prop.id || prop._id || idx}
                property={prop}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No properties match your active criteria"
                description="Try loosening your filters or searching another area in Uttarakhand."
                onReset={() => {
                  setFilters({ rating4: false, wifi: false, ac: false, foodIncluded: false });
                  setSearchCity('');
                }}
              />
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <FaqSection section="rentals" />
        </div>

      </div>
    </div>
  );
}
