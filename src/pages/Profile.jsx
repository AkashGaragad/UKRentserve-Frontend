import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PRESETS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Clock, Building, Car,
  Wrench, LogOut, Edit3, Save, Calendar, PlusCircle, CheckCircle2
} from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile, quickDemoLogin, backendOnline } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || 'Dehradun',
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 text-3xl">
          👤
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Sign In Required</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Please sign in to view your profile, manage active bookings, and listed properties.
        </p>
        <Link
          to="/auth"
          className="inline-flex px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
    showToast('Profile updated successfully.');
  };

  const getRoleIcon = (role) => {
    if (role === 'owner') return <Building size={14} />;
    if (role === 'provider') return <Wrench size={14} />;
    if (role === 'driver') return <Car size={14} />;
    return <User size={14} />;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1126] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-[#2a3768]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-sm overflow-hidden shrink-0">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0] || 'U'
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1
                    className="text-2xl font-black text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 capitalize border border-blue-200 dark:border-blue-800">
                    {getRoleIcon(user.role)}
                    {user.role || 'Customer'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} /> Verified User
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 dark:border-[#2a3768] text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1b2754] transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  showToast('Signed out');
                  navigate('/');
                }}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Details / Edit Form */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Account Information
            </h3>

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-1">
                    <User size={13} /> Full Name
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.name}</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-1">
                    <Mail size={13} /> Registered Email
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.email}</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-1">
                    <Phone size={13} /> Mobile Phone
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.phone || '+91 9876543210'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1126] border border-gray-100 dark:border-[#2a3768]">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-1">
                    <MapPin size={13} /> City Location
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.location || 'Dehradun'}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">City Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-xs font-bold text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/my-bookings"
            className="p-5 rounded-3xl bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] hover:border-blue-500 shadow-xs transition-all flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-[#1b2754] text-blue-600 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">My Bookings</h4>
              <p className="text-xs text-gray-400">View orders &amp; visits</p>
            </div>
          </Link>

          <Link
            to="/my-rides"
            className="p-5 rounded-3xl bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] hover:border-blue-500 shadow-xs transition-all flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
              <Car size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">My Rides</h4>
              <p className="text-xs text-gray-400">Track trips &amp; autos</p>
            </div>
          </Link>

          <Link
            to="/add-property"
            className="p-5 rounded-3xl bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] hover:border-blue-500 shadow-xs transition-all flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
              <PlusCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">List Property</h4>
              <p className="text-xs text-gray-400">Post rooms &amp; PGs free</p>
            </div>
          </Link>
        </div>

        {/* Demo Switcher for fast test audit */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Quick Persona Switcher (Testing &amp; Review)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => {
                  quickDemoLogin(p.role);
                  showToast(`Switched persona to ${p.label}`);
                }}
                className={`p-3 rounded-2xl text-left border text-xs transition-all ${
                  user.role === p.role
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-[#1b2754] font-bold text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold capitalize">{p.role}</div>
                <div className="text-[11px] text-gray-400 truncate">{p.name}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
