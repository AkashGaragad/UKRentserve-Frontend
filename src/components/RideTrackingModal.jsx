import { useState, useEffect, useRef } from 'react';
import { transportApi } from '../api';
import { PrimaryBtn, OutlineBtn, rupee } from './ui';
import { useToast } from '../context/ToastContext';
import { X, Navigation, PhoneCall, Send, CheckCircle2, Clock, Car, Shield } from 'lucide-react';

export default function RideTrackingModal({ ride, onClose, onUpdateStatus }) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    { _id: 'm1', senderRole: 'driver', message: 'Hello! I am on my way to your pickup location.', createdAt: new Date(Date.now() - 180000).toISOString() },
    { _id: 'm2', senderRole: 'customer', message: 'Great, I am waiting near the main gate.', createdAt: new Date(Date.now() - 120000).toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [eta, setEta] = useState(4);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'chat'
  const messagesEndRef = useRef(null);

  // Poll or fetch messages
  useEffect(() => {
    if (ride?._id) {
      transportApi.getMessages(ride._id)
        .then(({ data }) => {
          const list = data?.data || data;
          if (Array.isArray(list) && list.length > 0) setMessages(list);
        })
        .catch(() => {});
    }
  }, [ride?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // Simulate ETA decrement
  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    const tempMsg = {
      _id: 'temp_' + Date.now(),
      senderRole: 'customer',
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await transportApi.sendMessage(ride._id, text);
    } catch {
      // Local display preserved
    }
  };

  const handleCall = () => {
    showToast(`Calling driver at ${ride.driver?.phone || '+91 9876543212'}...`);
  };

  const handleStatusChange = (newStatus) => {
    transportApi.updateStatus(ride._id, newStatus).catch(() => {});
    if (onUpdateStatus) onUpdateStatus(ride._id, newStatus);
    showToast(`Ride status updated to: ${newStatus}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131b38] border-2 border-blue-600 dark:border-blue-400 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-blue-50 dark:border-[#2a3768] flex items-center justify-between bg-blue-50/50 dark:bg-[#1b2754]/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-base font-black text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Live Trip &amp; Driver Tracking
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-blue-50 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] p-1">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'tracking'
                ? 'bg-white dark:bg-[#131b38] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-500'
            }`}
          >
            🗺️ Live GPS &amp; Status
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-[#131b38] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-500'
            }`}
          >
            💬 Driver Chat ({messages.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'tracking' ? (
            <div className="space-y-4">
              {/* Animated Map Route Simulation */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-4 text-white overflow-hidden flex flex-col justify-between border border-blue-800/50">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      GPS Dispatch Active
                    </span>
                    <div className="text-xl font-black mt-1">Driver Arriving in ~{eta} mins</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300">{rupee(ride.fare || 140)}</span>
                    <span className="block text-[10px] text-gray-300">Estimated Fare</span>
                  </div>
                </div>

                {/* Road Line Simulation */}
                <div className="relative py-4 z-10">
                  <div className="h-1.5 w-full bg-blue-500/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-300 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      📍 {ride.pickup}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-red-400">
                      🏁 {ride.destination}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 z-10 pt-1 border-t border-white/10">
                  <span>Speed: 32 km/h</span>
                  <span>Accuracy: High (GPS ±4m)</span>
                </div>
              </div>

              {/* Driver & Vehicle Card */}
              <div className="bg-gray-50 dark:bg-[#0b1126] border border-blue-100 dark:border-[#2a3768] rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
                    👨‍✈️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <b className="text-sm font-bold text-gray-800 dark:text-gray-100">{ride.driver?.name || 'Rajesh Negi'}</b>
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded">
                        ⭐ 4.9
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {ride.driver?.vehicleNumber || 'UK 07 TA 1234'} • {ride.vehicleType?.toUpperCase() || 'AUTO'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-colors shadow-sm"
                  aria-label="Call Driver"
                >
                  <PhoneCall size={18} />
                </button>
              </div>

              {/* Driver Trip Actions (Allows driver/customer state testing) */}
              <div className="p-3 bg-blue-50 dark:bg-[#1b2754] rounded-2xl border border-blue-100 dark:border-[#2a3768]">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Trip Status Controls:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                  >
                    Start Ride
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                  >
                    Complete Ride
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="border border-red-300 text-red-600 hover:bg-red-50 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Live Chat Thread */
            <div className="flex flex-col h-72">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {messages.map(m => {
                  const isMe = m.senderRole === 'customer';
                  return (
                    <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-gray-100 dark:bg-[#0b1126] text-gray-800 dark:text-gray-200 border border-blue-50 dark:border-[#2a3768] rounded-bl-xs'
                        }`}
                      >
                        <div>{m.message || m.text}</div>
                        <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-blue-50 dark:border-[#2a3768] mt-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Message driver..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-blue-100 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
