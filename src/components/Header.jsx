import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, User, Moon, Sun, X, Calendar, Car,
  PlusCircle, LogOut, Shield, HelpCircle, Briefcase, Wrench,
  ChevronDown, Home, Building, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAuthModal } from '../context/AuthModalContext';
import { LocationSelectorModal } from './LocationSelectorModal';

export default function Header({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  const [city, setCity] = useState(() => localStorage.getItem('userCity') || 'Dehradun');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [listMenuOpen, setListMenuOpen] = useState(false);

  const categoryDropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const listMenuRef = useRef(null);

  const SEARCH_CATEGORIES = [
    { label: 'All', route: '/services', placeholder: 'Search for services, rooms, cabs...' },
    { label: 'Services', route: '/services', placeholder: 'Search for plumbers, electricians...' },
    { label: 'Rentals', route: '/rentals', placeholder: 'Search for rooms, PGs, stays...' },
    { label: 'Rides', route: '/rides', placeholder: 'Search for auto, cabs, airport transfers...' },
  ];

  const handleSelectCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('userCity', newCity);
    showToast(`Location set to ${newCity}`);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    // Live search DOM card filtering
    const v = val.toLowerCase().trim();
    document.querySelectorAll('[data-t]').forEach((el) => {
      el.style.display = (!v || el.dataset.t?.toLowerCase().includes(v)) ? '' : 'none';
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const activeObj = SEARCH_CATEGORIES.find((c) => c.label === searchCategory) || SEARCH_CATEGORIES[0];
      navigate(`${activeObj.route}?q=${encodeURIComponent(search.trim())}`);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
      if (listMenuRef.current && !listMenuRef.current.contains(e.target)) {
        setListMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/services', label: 'Services', icon: Wrench },
    { to: '/rentals', label: 'Rentals', icon: Building },
    { to: '/rides', label: 'Rides', icon: Car },
  ];

  const currentPlaceholder = SEARCH_CATEGORIES.find((c) => c.label === searchCategory)?.placeholder || 'Search for services, rooms, cabs...';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0f172a] border-b border-gray-200/90 dark:border-[#1e293b] shadow-xs">

        {/* ============================================================== */}
        {/* MOBILE VIEW (< md): EXACT DISTRICT MOBILE LAYOUT FROM USER IMG */}
        {/* ============================================================== */}
        <div className="block md:hidden px-4 pt-3 pb-0 bg-white dark:bg-[#0f172a]">

          {/* Row 1: Location on Left, User Profile / Sign In on Right */}
          <div className="flex items-center justify-between gap-3">
            {/* Location Selector Trigger */}
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-2.5 text-left group min-w-0 flex-1 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <MapPin size={18} className="fill-blue-600/20 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-base text-gray-900 dark:text-white truncate">
                    {city}
                  </span>
                  <ChevronDown size={15} className="text-gray-500 shrink-0" />
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                  Uttarakhand, India
                </div>
              </div>
            </button>

            {/* Right: Theme Toggle & District Circular Profile Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={() => setUserMenu(!userMenu)}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#131b38] flex items-center justify-center overflow-hidden shadow-xs"
                  aria-label="Open profile menu"
                >
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
                      {user.name?.[0] || 'U'}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#131b38] flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-xs active:scale-95 transition-transform"
                  aria-label="Sign in"
                >
                  <User size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Full-width District Pill Search Bar */}
          <div className="mt-3">
            <div className="relative flex items-center h-12 w-full rounded-full border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#131b38] px-4 shadow-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/10">
              <Search size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for services, rooms, cabs..."
                className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 font-medium outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    document.querySelectorAll('[data-t]').forEach((el) => { el.style.display = ''; });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Row 3: Horizontal Tab Navigation with Underline Bar (District Mobile Pattern) */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mt-3 border-b border-gray-200 dark:border-[#1e293b]">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 pb-2.5 text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 border-b-[3px] border-blue-600 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 border-b-[3px] border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? 'text-blue-600 dark:text-blue-400 fill-blue-600/20' : 'text-gray-500'} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW (>= md): DISTRICT DESKTOP EXPANDED MARKETPLACE   */}
        {/* ============================================================== */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 gap-6">

              {/* Brand Logo & Location Pill */}
              <div className="flex items-center gap-6 shrink-0">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src="/assets/images/Logo.jpeg"
                      alt="UKRent"
                      className="w-full h-full object-cover rounded-[10px]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="hidden text-white font-black text-xs">UK</span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      UK<span className="text-blue-600 dark:text-blue-400">Rent</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none mt-0.5">
                      Marketplace
                    </span>
                  </div>
                </Link>

                {/* District Location Selector Pill */}
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-[#2a3768] bg-gray-50/80 dark:bg-[#131b38] hover:bg-gray-100 dark:hover:bg-[#1b2754] transition-all text-left group"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin size={13} className="fill-blue-600/20" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                      {city}
                    </span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500">
                      Uttarakhand, IN
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors ml-1" />
                </button>
              </div>

              {/* Desktop Search Bar */}
              <div className="flex-1 max-w-2xl min-w-0">
                <div className="relative flex items-center h-11 w-full rounded-full border border-gray-300 dark:border-[#2a3768] bg-gray-50/80 dark:bg-[#131b38] focus-within:border-blue-600 dark:focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-[#0b1126] focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-inner">

                  {/* Category Dropdown Prefix */}
                  <div ref={categoryDropdownRef} className="relative shrink-0 h-full">
                    <button
                      type="button"
                      onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                      className="h-full flex items-center gap-1.5 px-3.5 border-r border-gray-200 dark:border-[#2a3768] text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors rounded-l-full"
                    >
                      <span>{searchCategory}</span>
                      <ChevronDown size={13} className={`text-gray-400 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {categoryMenuOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-48 rounded-2xl border border-gray-200 dark:border-[#2a3768] bg-white dark:bg-[#131b38] py-2 shadow-xl animate-in fade-in">
                        {SEARCH_CATEGORIES.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              setSearchCategory(item.label);
                              setCategoryMenuOpen(false);
                              if (search.trim()) {
                                navigate(`${item.route}?q=${encodeURIComponent(search.trim())}`);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs font-semibold transition-colors ${
                              searchCategory === item.label
                                ? 'bg-blue-50 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1b2754]'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input field */}
                  <div className="flex-1 flex items-center gap-2.5 px-3.5 h-full">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder={currentPlaceholder}
                      className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none font-medium"
                      aria-label="Search"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          document.querySelectorAll('[data-t]').forEach((el) => { el.style.display = ''; });
                        }}
                        className="text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label="Toggle theme"
                  className="w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1b2754] flex items-center justify-center transition-colors"
                >
                  {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                </button>

                {/* List Dropdown */}
                <div ref={listMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setListMenuOpen(!listMenuOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-[#2a3768] text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <PlusCircle size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Post Listing</span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform ${listMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {listMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-gray-200 dark:border-[#2a3768] bg-white dark:bg-[#131b38] p-2 shadow-xl animate-in fade-in">
                      <Link
                        to="/add-property"
                        onClick={() => setListMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#1b2754] transition-colors"
                      >
                        <Building size={15} className="text-blue-600 dark:text-blue-400" />
                        <span>Post Rental or Room</span>
                      </Link>
                      <Link
                        to="/add-service"
                        onClick={() => setListMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#1b2754] transition-colors"
                      >
                        <Wrench size={15} className="text-emerald-600 dark:text-emerald-400" />
                        <span>List Home Service</span>
                      </Link>
                      <Link
                        to="/apply-provider"
                        onClick={() => setListMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#1b2754] transition-colors"
                      >
                        <Briefcase size={15} className="text-purple-600 dark:text-purple-400" />
                        <span>Partner Application</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <div ref={userMenuRef} className="relative">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => setUserMenu(!userMenu)}
                      className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-gray-200 dark:border-[#2a3768] hover:border-blue-500 bg-white dark:bg-[#131b38] transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.[0] || 'U'
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100 max-w-[90px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                      <ChevronDown size={13} className="text-gray-400" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openAuthModal}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <User size={14} />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Desktop Secondary Tabs Row */}
          <div className="border-t border-gray-100 dark:border-[#1e293b]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between h-12">
                <nav className="flex items-center gap-6">
                  {navLinks.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2 h-12 text-xs font-bold transition-colors ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent'
                        }`
                      }
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <Link to="/apply-provider" className="hover:text-blue-600 transition-colors">Become a Partner</Link>
                  <span>·</span>
                  <Link to="/support" className="hover:text-blue-600 transition-colors">24x7 Help Center</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global User Dropdown Menu (for both mobile & desktop) */}
        {userMenu && user && (
          <div className="absolute right-4 top-16 z-50 w-64 rounded-3xl border border-gray-200 dark:border-[#2a3768] bg-white dark:bg-[#131b38] p-2 shadow-2xl animate-in fade-in">
            <div className="px-3.5 py-3 mb-1 border-b border-gray-100 dark:border-[#2a3768]">
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email || user.phone}</div>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
                {user.role || 'Customer'}
              </span>
            </div>

            {[
              { icon: User, label: 'My Profile', to: '/profile' },
              { icon: Calendar, label: 'My Bookings', to: '/my-bookings' },
              { icon: Car, label: 'My Rides', to: '/my-rides' },
              { icon: HelpCircle, label: 'Help & Support', to: '/support' },
            ].map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setUserMenu(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-[#1b2754] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>{label}</span>
                </div>
                <ChevronRight size={13} className="text-gray-400" />
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                logout();
                setUserMenu(false);
                showToast('Signed out');
                navigate('/');
              }}
              className="mt-1 w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-gray-100 dark:border-[#2a3768]"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

      </header>

      {/* Location Modal */}
      <LocationSelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={city}
        onSelectCity={handleSelectCity}
      />
    </>
  );
}
