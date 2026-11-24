import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import Home from './pages/Home';
import Services from './pages/Services';
import Rentals from './pages/Rentals';
import HotelDetail from './pages/HotelDetail';
import Rides from './pages/Rides';
import Auth from './pages/Auth';
import MyBookings from './pages/MyBookings';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import ApplyProvider from './pages/ApplyProvider';
import SupportCenter from './pages/SupportCenter';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AddService from './pages/AddService';
import ProviderProfile from './pages/ProviderProfile';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';

function AppContent({ darkMode, setDarkMode }) {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();
  return (
    <div className="bg-gray-50 dark:bg-[#0b1126] transition-colors duration-200">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/providers/:id" element={<ProviderProfile />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/rentals/:id" element={<HotelDetail />} />
                <Route path="/rides" element={<Rides />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/my-rides" element={<MyRides />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/add-service" element={<AddService />} />
                <Route path="/apply-provider" element={<ApplyProvider />} />
                <Route path="/support" element={<SupportCenter />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                {/* Catch-all */}
                <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <Auth isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
 export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    if (localStorage.getItem('theme') === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AuthModalProvider>
            <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
          </AuthModalProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
