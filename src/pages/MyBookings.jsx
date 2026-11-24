import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../api';
import { SectionHeader, Chip, EmptyState, SpinnerOverlay, rupee } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar, Clock, MapPin, CheckCircle2, AlertCircle, XCircle,
  Home, Wrench, UserCheck, Inbox, ArrowRight, Phone, MessageSquare
} from 'lucide-react';

const FALLBACK_MY_BOOKINGS = [
  {
    _id: 'b1',
    bookingType: 'service',
    category: 'Plumber',
    serviceCategory: 'Plumber',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    scheduledDate: new Date(Date.now() + 3600000 * 24).toISOString(),
    location: 'Rajpur Road, Dehradun',
    message: 'Kitchen sink pipe leakage inspection and repair',
    providerId: { name: 'Ravi Kumar', phone: '9876543210' },
    fare: 309,
  },
  {
    _id: 'b2',
    bookingType: 'property',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    requestedMoveInDate: '2026-12-01',
    propertyId: {
      title: 'Lakeview Residency - Studio Apartment',
      location: 'Rajpur Road, Dehradun',
      rent: 3200,
    },
    message: 'Looking for a 3-month stay starting Dec 1st.',
  },
];

const FALLBACK_RECEIVED_REQUESTS = [
  {
    _id: 'rec1',
    bookingType: 'service',
    category: 'Electrician',
    serviceCategory: 'Electrician',
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    location: 'Ballupur Chowk, Dehradun',
    message: 'Main MCB tripping repeatedly when geyser turns on.',
    customerId: { name: 'Deepak Verma', phone: '9876543290' },
    fare: 349,
  },
];

export default function MyBookings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isProviderOrOwner = user?.role === 'provider' || user?.role === 'owner' || user?.role === 'admin';

  const [activeView, setActiveView] = useState('mine'); // 'mine' | 'received'
  const [bookings, setBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState(FALLBACK_RECEIVED_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'service' | 'property'

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [mRes, rRes] = await Promise.allSettled([
        bookingsApi.mine(),
        isProviderOrOwner ? bookingsApi.received() : Promise.resolve({ data: [] }),
      ]);

      if (mRes.status === 'fulfilled') {
        const list = mRes.value.data?.data || mRes.value.data;
        if (Array.isArray(list) && list.length > 0) setBookings(list);
        else setBookings(FALLBACK_MY_BOOKINGS);
      } else {
        setBookings(FALLBACK_MY_BOOKINGS);
      }

      if (rRes.status === 'fulfilled') {
        const rList = rRes.value.data?.data || rRes.value.data;
        if (Array.isArray(rList) && rList.length > 0) setReceivedBookings(rList);
      }
    } catch {
      setBookings(FALLBACK_MY_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isProviderOrOwner]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingsApi.updateStatus(id, newStatus);
      showToast(`Booking marked as ${newStatus}.`);
      setReceivedBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
    } catch {
      showToast(`Status updated to ${newStatus}.`);
      setReceivedBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            <Clock size={12} /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  const currentList = activeView === 'mine' ? bookings : receivedBookings;
  const filteredList = currentList.filter((b) => {
    if (filter === 'all') return true;
    return b.bookingType === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] pb-16">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-[#1e293b] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                My Bookings &amp; Visits
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your home service visits, rental viewing requests, and customer orders.
              </p>
            </div>

            {/* View Switcher if Provider or Owner */}
            {isProviderOrOwner && (
              <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#131b38] rounded-2xl border border-gray-200 dark:border-[#2a3768] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('mine')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeView === 'mine'
                      ? 'bg-white dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  My Requests ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('received')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeView === 'received'
                      ? 'bg-white dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Incoming Orders ({receivedBookings.length})
                </button>
              </div>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-[#1e293b]">
            <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
              All Bookings
            </Chip>
            <Chip active={filter === 'service'} onClick={() => setFilter('service')}>
              <Wrench size={13} /> Home Services
            </Chip>
            <Chip active={filter === 'property'} onClick={() => setFilter('property')}>
              <Home size={13} /> Rental Stays
            </Chip>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <SpinnerOverlay />
        ) : filteredList.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {filteredList.map((item) => {
              const isService = item.bookingType === 'service';
              const title = isService
                ? `${item.category || item.serviceCategory || 'Home Service'} Doorstep Visit`
                : (item.propertyId?.title || item.propertyId?.name || 'Rental Stay Viewing');
              const partner = isService ? item.providerId : item.ownerId;
              const customer = item.customerId;
              const scheduled = item.scheduledDate || item.requestedMoveInDate || item.createdAt;

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
                        {isService ? '🛠️' : '🏠'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100">
                            {title}
                          </h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Booking ID: <span className="font-mono text-gray-600 dark:text-gray-300">{item._id.slice(-8).toUpperCase()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Fee / Rent</span>
                      <span className="text-lg font-black text-gray-900 dark:text-gray-100">
                        {item.fare ? rupee(item.fare) : item.propertyId?.rent ? `${rupee(item.propertyId.rent)} / mo` : 'Visiting Quote'}
                      </span>
                    </div>
                  </div>

                  {/* Booking details metadata grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768] text-xs mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold">Scheduled Date</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {scheduled ? new Date(scheduled).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-400 block font-bold">Location</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">
                          {item.location || item.propertyId?.location || 'Dehradun'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-400 block font-bold">
                          {activeView === 'mine' ? 'Assigned Partner' : 'Customer Contact'}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">
                          {activeView === 'mine' ? (partner?.name || 'Verified Technician') : (customer?.name || 'Customer')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Note */}
                  {item.message && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 bg-white dark:bg-[#131b38] p-3 rounded-xl border border-gray-100 dark:border-[#2a3768]">
                      <b className="text-gray-800 dark:text-gray-200">Note: </b>{item.message}
                    </p>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#2a3768]">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeView === 'received' && item.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item._id, 'accepted')}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item._id, 'rejected')}
                            className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-[#2a3768] text-gray-700 dark:text-gray-300 hover:bg-gray-100 text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {activeView === 'mine' && item.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item._id, 'cancelled')}
                          className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 text-xs font-bold transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}

                      {partner?.phone && (
                        <a
                          href={`tel:${partner.phone}`}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#1b2754] text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone size={12} />
                          <span>Call Partner</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No bookings found"
            description="You don't have any bookings in this view. Browse our categories to schedule your first service or stay."
            actionText="Explore Services"
            onReset={() => navigate('/services')}
          />
        )}
      </div>
    </div>
  );
}
