import { NavLink } from 'react-router-dom';
import { Home, Wrench, Building, Car, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

export function MobileBottomNav() {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/services', label: 'Services', icon: Wrench },
    { to: '/rentals', label: 'Rentals', icon: Building },
    { to: '/rides', label: 'Rides', icon: Car },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#1e293b] shadow-lg py-1 px-2">
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105'
                  : 'text-gray-500 dark:text-gray-400 font-medium'
              }`
            }
          >
            <Icon size={19} strokeWidth={2.2} />
            <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
          </NavLink>
        ))}

        {/* Profile / Sign In tab */}
        {user ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105'
                  : 'text-gray-500 dark:text-gray-400 font-medium'
              }`
            }
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.[0] || 'U'
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Account</span>
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 dark:text-gray-400 font-medium"
          >
            <User size={19} strokeWidth={2.2} />
            <span className="text-[10px] mt-0.5 tracking-tight">Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
}
