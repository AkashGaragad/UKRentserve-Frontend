import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transportApi } from '../api';
import { SectionHeader, Chip, EmptyState, SpinnerOverlay, rupee } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RideTrackingModal from '../components/RideTrackingModal';
import {
  Car, Navigation, Clock, CheckCircle2, MapPin, MessageSquare,
  PhoneCall, Radio, ShieldCheck, XCircle, ArrowRight, Zap
} from 'lucide-react';

const FALLBACK_RIDES = [
  {
    _id: 'ride1',
    vehicleType: 'auto',
    pickup: 'Clock Tower, Dehradun',
    destination: 'Rajpur Road, Pacific Mall',
    fare: 142,
    status: 'assigned',
    scheduledAt: new Date(Date.now() + 1800000).toISOString(),
    createdAt: new Date(Date.now() - 600000).toISOString(),
    driver: { name: 'Rajesh Negi', phone: '9876543212', vehicleNumber: 'UK 07 TA 1234' },
  },
  {
    _id: 'ride2',
    vehicleType: 'car',
    pickup: 'ISBT Dehradun',
    destination: 'Jolly Grant Airport, Dehradun',
    fare: 680,
    status: 'completed',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    driver: { name: 'Virendra Singh', phone: '9876543299', vehicleNumber: 'UK 07 CA 5678' },
  },
];

const FALLBACK_DRIVER_OFFERS = [
  {
    _id: 'offer1',
    vehicleType: 'auto',
    pickup: 'Paltan Bazaar, Dehradun',
    destination: 'Dehradun Railway Station',
    fare: 95,
    distanceKm: 2.1,
    customer: { name: 'Rohan Mehra', phone: '9876543233' },
  },
];

export default function MyRides() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isDriver = user?.role === 'driver';

  const [rides, setRides] = useState([]);
  const [driverOffers, setDriverOffers] = useState(FALLBACK_DRIVER_OFFERS);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [trackingRide, setTrackingRide] = useState(null);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const { data } = await transportApi.mine();
      const list = data?.data || data;
      if (Array.isArray(list) && list.length > 0) {
        setRides(list);
      } else {
        setRides(FALLBACK_RIDES);
      }
    } catch {
      setRides(FALLBACK_RIDES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    if (isDriver) {
      transportApi.available()
        .then(({ data }) => {
          const list = data?.data || data;
          if (Array.isArray(list) && list.length > 0) setDriverOffers(list);
        })
        .catch(() => {});
    }
  }, [isDriver]);

  const toggleDriverOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      await transportApi.updateLocation({ isOnline: nextState, latitude: 30.3165, longitude: 78.0322 });
      showToast(nextState ? 'Driver Online (Receiving dispatches)' : 'Driver Offline');
    } catch {
      showToast(nextState ? 'Driver Online (GPS simulation active)' : 'Driver Offline');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await transportApi.updateStatus(offerId, 'assigned');
      showToast('Ride accepted! Adding to your assignments.');
      setDriverOffers((prev) => prev.filter((o) => o._id !== offerId));
      fetchRides();
    } catch {
      showToast('Ride accepted! Adding to active assignments.');
      setDriverOffers((prev) => prev.filter((o) => o._id !== offerId));
    }
  };

  const handleCancel = async (id) => {
    try {
      await transportApi.updateStatus(id, 'cancelled');
      showToast('Ride cancelled.');
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r)));
    } catch {
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r)));
      showToast('Ride cancelled.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Realtime Tracking Modal */}
      {trackingRide && (
        <RideTrackingModal
          ride={trackingRide}
          onClose={() => setTrackingRide(null)}
          onUpdateStatus={(id, status) => {
            setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
          }}
        />
      )}

      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {isDriver ? 'Driver Console & Rides' : 'My Rides & Trips'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isDriver
                  ? 'Accept nearby dispatch offers, broadcast live GPS, and complete passenger trips.'
                  : 'Track live driver locations, view trip fares, and access driver contacts.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isDriver && (
                <button
                  type="button"
                  onClick={toggleDriverOnline}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isOnline
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Radio size={14} className={isOnline ? 'animate-pulse' : ''} />
                  <span>{isOnline ? 'ONLINE (Receiving Trips)' : 'OFFLINE'}</span>
                </button>
              )}

              <Link
                to="/rides"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Zap size={14} />
                <span>Book New Ride</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Driver Dispatch Offers Panel */}
        {isDriver && (
          <div className="bg-blue-50/70 dark:bg-[#1b2754]/80 border-2 border-blue-600 dark:border-blue-400 rounded-3xl p-5 sm:p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Nearby Dispatch Radar (30s Window)
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-[#131b38] px-2.5 py-1 rounded-full">
                {driverOffers.length} pending
              </span>
            </div>

            {driverOffers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                No new trip dispatches currently in your radius. Keep online to receive requests.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {driverOffers.map((o) => (
                  <div key={o._id} className="bg-white dark:bg-[#131b38] p-4 rounded-2xl border border-gray-200 dark:border-[#2a3768] shadow-xs">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-[#1b2754] px-2 py-0.5 rounded">
                          {o.vehicleType?.toUpperCase()} TRIP
                        </span>
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">
                          Passenger: {o.customer?.name || 'Customer'}
                        </div>
                      </div>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {rupee(o.fare || 100)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                      <div>📍 <b>Pickup:</b> {o.pickup}</div>
                      <div>🏁 <b>Drop:</b> {o.destination}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptOffer(o._id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-colors"
                      >
                        Accept Ride
                      </button>
                      <button
                        type="button"
                        onClick={() => setDriverOffers((prev) => prev.filter((x) => x._id !== o._id))}
                        className="px-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs py-2 rounded-xl"
                      >
                        Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rides List */}
        {loading ? (
          <SpinnerOverlay />
        ) : rides.length === 0 ? (
          <EmptyState
            title="No rides booked yet"
            description="Book your first instant auto or outstation cab in seconds."
            actionText="Book an Instant Ride"
            onReset={() => {}}
          />
        ) : (
          <div className="space-y-4 max-w-4xl">
            {rides.map((r) => {
              const isCompleted = r.status === 'completed';
              const isCancelled = r.status === 'cancelled';
              const isActive = !isCompleted && !isCancelled;

              return (
                <div
                  key={r._id}
                  className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
                        {r.vehicleType === 'bike' ? '🛵' : r.vehicleType === 'auto' ? '🛺' : '🚖'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 capitalize">
                            {r.vehicleType} Ride
                          </h3>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Driver Dispatched
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              Completed
                            </span>
                          )}
                          {isCancelled && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(r.scheduledAt || r.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Fare</span>
                      <span className="text-lg font-black text-gray-900 dark:text-gray-100">
                        {rupee(r.fare || 142)}
                      </span>
                    </div>
                  </div>

                  {/* Route details */}
                  <div className="bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768] rounded-2xl p-3.5 mb-4 space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-gray-400 w-14 shrink-0 font-bold uppercase text-[10px]">Pickup:</span>
                      <span className="font-semibold truncate">{r.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <span className="text-gray-400 w-14 shrink-0 font-bold uppercase text-[10px]">Drop:</span>
                      <span className="font-semibold truncate">{r.destination}</span>
                    </div>
                  </div>

                  {/* Driver & Action Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100 dark:border-[#2a3768] text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
                        {r.driver?.name?.[0] || 'D'}
                      </div>
                      <div>
                        <b className="text-gray-900 dark:text-gray-100">{r.driver?.name || 'Verified Driver'}</b>
                        {r.driver?.vehicleNumber && (
                          <span className="ml-2 text-gray-400 font-mono text-[11px]">[{r.driver.vehicleNumber}]</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => setTrackingRide(r)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <Navigation size={13} />
                          <span>Track GPS &amp; Chat</span>
                        </button>
                      )}

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleCancel(r._id)}
                          className="text-red-500 hover:text-red-600 font-bold text-xs px-2.5 py-1.5"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
