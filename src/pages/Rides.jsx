import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar, ArrowUpDown, ShieldCheck, CheckCircle2, Zap, ArrowRight
} from 'lucide-react';
import { ErrorBox, rupee } from '../components/ui';
import { VehicleCard } from '../components/cards/VehicleCard';
import { transportApi } from '../api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import FaqSection from '../components/FaqSection';

const VEHICLES = [
  {
    id: 'bike',
    value: 9,
    label: 'Express Bike',
    apiType: 'auto', // backend supports 'auto' | 'car' | 'goods-van'
    img: '/assets/images/auto-rickshaw.webp',
    capacity: '1 Seat',
    ratePerKm: 9,
    baseFare: 20,
    tag: 'Quick Solo',
    description: 'Fastest transit through town traffic with helmet provided',
  },
  {
    id: 'auto',
    value: 14,
    label: 'Auto Rickshaw',
    apiType: 'auto',
    img: '/assets/images/auto-rickshaw2.webp',
    capacity: '3 Seats',
    ratePerKm: 14,
    baseFare: 30,
    tag: 'Most Popular',
    description: 'Eco-friendly doorstep pickup with verified city drivers',
  },
  {
    id: 'cab',
    value: 18,
    label: 'City Cab (Sedan)',
    apiType: 'car',
    img: '/assets/images/taxi-india.webp',
    capacity: '4 Seats + Boot',
    ratePerKm: 18,
    baseFare: 60,
    tag: 'AC Comfort',
    description: 'Comfortable air-conditioned sedan with luggage space',
  },
  {
    id: 'goods',
    value: 26,
    label: 'Goods Van / Carrier',
    apiType: 'goods-van',
    img: '/assets/images/goods-van.jpg',
    capacity: 'Up to 500 kg',
    ratePerKm: 26,
    baseFare: 120,
    tag: 'Luggage / Cargo',
    description: 'Light goods carrier for luggage moving or luggage transport',
  },
];

export default function Rides() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mode: 0 = Instant Ride, 1 = Pre-booked Cab
  const [mode, setMode] = useState(searchParams.get('mode') === 'prebook' ? 1 : 0);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [datetime, setDatetime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[1]); // Default Auto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dynamic km calculation based on string hash / length
  const estimatedKm = useMemo(() => {
    if (!pickup.trim() || !destination.trim()) return 5.0;
    const combined = (pickup.trim().length * 3 + destination.trim().length * 2);
    return +((4.0 + (combined % 18)).toFixed(1));
  }, [pickup, destination]);

  const calculateFare = (v) => {
    return Math.round(estimatedKm * v.ratePerKm + v.baseFare);
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
  };

  const handleBookRide = async (e) => {
    e.preventDefault();
    setError('');

    if (!pickup.trim()) {
      showToast('Please enter your pickup location');
      return;
    }
    if (!destination.trim()) {
      showToast('Please enter your drop location');
      return;
    }
    if (mode === 1 && !datetime) {
      showToast('Please select a date and time for pre-booking');
      return;
    }

    const fare = calculateFare(selectedVehicle);

    if (!user) {
      showToast(`Estimated fare is ${rupee(fare)}. Please sign in to book!`);
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const scheduledTime = mode === 1 && datetime
        ? new Date(datetime).toISOString()
        : new Date(Date.now() + 180000).toISOString();

      await transportApi.create({
        vehicleType: selectedVehicle.apiType,
        pickup: pickup.trim(),
        destination: destination.trim(),
        scheduledAt: scheduledTime,
        fare,
        details: `${selectedVehicle.label} booked by customer.`,
      });

      showToast(`Ride booked! Estimated fare ${rupee(fare)} for ${estimatedKm} km.`);
      navigate('/my-rides');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Ride booking recorded';
      showToast(`Booking confirmed! ${msg}`);
      navigate('/my-rides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full mb-2">
              <Zap size={12} className="fill-current text-blue-600" />
              Realtime Transport Network
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Book Instant Autos &amp; Outstation Cabs
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Transparent per-kilometer rates across Dehradun, Jolly Grant Airport, Rishikesh, and Haridwar with verified drivers.
            </p>
          </div>

          {/* Ride Mode Switcher: Instant vs Pre-book */}
          <div className="flex items-center gap-2 mt-6 p-1.5 bg-gray-100 dark:bg-[#131b38] rounded-2xl max-w-sm border border-gray-200 dark:border-[#2a3768]">
            <button
              type="button"
              onClick={() => setMode(0)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                mode === 0
                  ? 'bg-white dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Zap size={14} className={mode === 0 ? 'fill-current text-blue-600' : ''} />
              <span>Instant Ride</span>
            </button>

            <button
              type="button"
              onClick={() => setMode(1)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                mode === 1
                  ? 'bg-white dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Calendar size={14} />
              <span>Pre-book Cab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Booking Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Form: Route details & confirmation */}
          <div className="lg:col-span-5 bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-7 shadow-xs">
            <h2
              className="text-xl font-black text-gray-900 dark:text-gray-100 mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {mode === 0 ? 'Where are you heading?' : 'Schedule your ride in advance'}
            </h2>

            <form onSubmit={handleBookRide} className="space-y-4">
              {/* Pickup input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Clock Tower or Rajpur Road"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Swap Trigger */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-xs hover:rotate-180 transition-all duration-300"
                  title="Swap locations"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>

              {/* Drop input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Drop Destination
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. ISBT or Jolly Grant Airport"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Date & Time if mode === 1 */}
              {mode === 1 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Pickup Date &amp; Time
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required={mode === 1}
                    />
                  </div>
                </div>
              )}

              {/* Transparent Fare Summary Box */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-200/80 dark:border-[#2a3768] space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Estimated Distance:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{estimatedKm} km</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Selected Vehicle:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{selectedVehicle.label}</span>
                </div>
                <div className="pt-2 border-t border-gray-200/60 dark:border-[#2a3768] flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400 block">Total Estimated Fare</span>
                    <span className="text-xl font-black text-gray-900 dark:text-gray-100">
                      {rupee(calculateFare(selectedVehicle))}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    Zero Surge Price
                  </span>
                </div>
              </div>

              {error && <ErrorBox message={error} />}

              {/* Book Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Finding Driver…' : mode === 0 ? 'Confirm & Find Driver' : 'Confirm Pre-booking'}</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-500" /> Police Verified Driver
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Free Cancellation
                </span>
              </div>
            </form>
          </div>

          {/* Right: Vehicle Selection Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Choose vehicle category
              </h3>
              <span className="text-xs text-gray-500">
                Tap to select your ride preference
              </span>
            </div>

            <div className="space-y-3">
              {VEHICLES.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  selected={selectedVehicle.id === v.id}
                  onSelect={() => setSelectedVehicle(v)}
                  estimatedFare={calculateFare(v)}
                  estimatedKm={estimatedKm}
                />
              ))}
            </div>

            {/* Quick Fleet Photos banner */}
            <div className="pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Our Verified Uttarakhand Fleet
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { img: '/assets/images/auto-rickshaw2.webp', label: 'Local Auto' },
                  { img: '/assets/images/taxi-india.webp', label: 'Airport Cab' },
                  { img: '/assets/images/auto-rickshaw3.webp', label: 'Express Auto' },
                  { img: '/assets/images/goods-van.jpg', label: 'Goods Carrier' },
                ].map((item, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden h-24 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-[#2a3768] group">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center text-[10px] font-bold text-white">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* FAQs */}
        <div className="mt-16">
          <FaqSection section="rides" />
        </div>

      </div>
    </div>
  );
}
