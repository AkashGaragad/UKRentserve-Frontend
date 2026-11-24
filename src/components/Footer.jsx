import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Heart, Sparkles, Building, Wrench, Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Top Marketplace Highlights Banner */}
      <div className="border-b border-gray-800/80 bg-gray-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Verified Partners</h4>
                <p className="text-xs text-gray-400">Government ID &amp; police verified professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Transparent Pricing</h4>
                <p className="text-xs text-gray-400">Zero hidden fees, upfront visits &amp; fare estimates</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Uttarakhand Wide</h4>
                <p className="text-xs text-gray-400">Serving Dehradun, Haridwar, Rishikesh &amp; beyond</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">

          {/* Column 1: Brand & Bio */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                UK
              </div>
              <span
                className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                UK<span className="text-blue-400">Rent</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6">
              Uttarakhand's integrated local marketplace for doorstep home services, rental accommodations, student PGs, and instant cab &amp; auto rides.
            </p>
            <div className="text-xs text-gray-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-blue-400 shrink-0" />
                <span>Rajpur Road, Dehradun, Uttarakhand 248001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-400 shrink-0" />
                <span>+91 98765 43210 (24x7 Customer Desk)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Home Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Wrench size={13} className="text-blue-400" />
              <span>Services</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/services?cat=Plumber" className="hover:text-white transition-colors">Plumbers in Dehradun</Link>
              </li>
              <li>
                <Link to="/services?cat=Electrician" className="hover:text-white transition-colors">Electricians &amp; Repairs</Link>
              </li>
              <li>
                <Link to="/services?cat=Carpenter" className="hover:text-white transition-colors">Carpenters &amp; Woodwork</Link>
              </li>
              <li>
                <Link to="/services?cat=Painter" className="hover:text-white transition-colors">House Painting &amp; Decor</Link>
              </li>
              <li>
                <Link to="/services" className="text-blue-400 hover:text-blue-300 font-semibold">View All Services →</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Accommodations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building size={13} className="text-blue-400" />
              <span>Stays &amp; PGs</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/rentals?type=rental" className="hover:text-white transition-colors">Rental Rooms &amp; 1BHKs</Link>
              </li>
              <li>
                <Link to="/rentals?type=stay" className="hover:text-white transition-colors">Student &amp; Working PGs</Link>
              </li>
              <li>
                <Link to="/rentals?type=stay" className="hover:text-white transition-colors">Hotels &amp; Homestays</Link>
              </li>
              <li>
                <Link to="/add-property" className="hover:text-white transition-colors">Post Your Property Free</Link>
              </li>
              <li>
                <Link to="/rentals" className="text-blue-400 hover:text-blue-300 font-semibold">Explore Properties →</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Rides & Partners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Car size={13} className="text-blue-400" />
              <span>Rides &amp; Partners</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/rides" className="hover:text-white transition-colors">Instant Auto Booking</Link>
              </li>
              <li>
                <Link to="/rides?mode=prebook" className="hover:text-white transition-colors">Pre-book City Cab</Link>
              </li>
              <li>
                <Link to="/apply-provider" className="hover:text-white transition-colors">Join as Driver / Cab</Link>
              </li>
              <li>
                <Link to="/apply-provider" className="hover:text-white transition-colors">Become Service Partner</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">Help &amp; Support Tickets</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="pt-10 mt-10 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} UKRent Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/support" className="hover:text-gray-400">Privacy Policy</Link>
            <span>·</span>
            <Link to="/support" className="hover:text-gray-400">Terms of Service</Link>
            <span>·</span>
            <Link to="/support" className="hover:text-gray-400">Safety Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
