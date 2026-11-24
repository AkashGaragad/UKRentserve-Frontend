import { useState } from 'react';
import { MapPin, X, Check, Search, Navigation } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'Dehradun', state: 'Uttarakhand', tag: 'Capital' },
  { name: 'Haridwar', state: 'Uttarakhand', tag: 'Holy City' },
  { name: 'Rishikesh', state: 'Uttarakhand', tag: 'Yoga Hub' },
  { name: 'Roorkee', state: 'Uttarakhand', tag: 'Education' },
  { name: 'Haldwani', state: 'Uttarakhand', tag: 'Gateway' },
  { name: 'Mussoorie', state: 'Uttarakhand', tag: 'Hill Station' },
  { name: 'Nainital', state: 'Uttarakhand', tag: 'Lake City' },
  { name: 'Kashipur', state: 'Uttarakhand', tag: 'Industrial' },
];

export function LocationSelectorModal({ isOpen, onClose, currentCity, onSelectCity }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#131b38] border border-gray-100 dark:border-[#2a3768] p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg">
                Select your city
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Personalizes services, rental stays, and rides for you
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city in Uttarakhand..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            autoFocus
          />
        </div>

        {/* Current GPS detection button */}
        <button
          type="button"
          onClick={() => {
            onSelectCity('Dehradun');
            onClose();
          }}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100/70 transition-colors"
        >
          <Navigation size={14} />
          Detect Current Location (Dehradun)
        </button>

        {/* Popular Cities Grid */}
        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
          {filtered.map((city) => {
            const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  onSelectCity(city.name);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1b2754] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className={isSelected ? 'text-white' : 'text-gray-400'} />
                  <span>{city.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    {city.tag}
                  </span>
                </div>
                {isSelected && <Check size={16} strokeWidth={3} />}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500 mb-2">No predefined city found.</p>
              <button
                type="button"
                onClick={() => {
                  if (search.trim()) {
                    onSelectCity(search.trim());
                    onClose();
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Use "{search.trim()}" as location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
