import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, MessageCircle, ShieldCheck, User, Sparkles } from 'lucide-react';
import { useAuth, DEMO_PRESETS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Auth({ isOpen = true, onClose }) {
  const { quickDemoLogin, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpChannel, setOtpChannel] = useState('sms'); // 'sms' | 'whatsapp'
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setError('');
    setOtpSent(false);
    setOtp('');
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanDigits = phone.replace(/\D/g, '');
  const canContinue = cleanDigits.length >= 10 && !loading;

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    showToast(`Verification code sent via ${otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    if (otp.trim().length < 4) {
      setError('Please enter the verification code.');
      return;
    }
    const res = quickDemoLogin('customer');
    if (res?.success) {
      showToast(`Welcome back, ${res.user.name}!`);
      handleClose();
    }
  };

  const handlePersonaLogin = (role) => {
    const res = quickDemoLogin(role);
    if (res?.success) {
      showToast(`Signed in as ${res.user.name} (${role})`);
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative w-full max-w-[460px] rounded-3xl bg-white dark:bg-[#131b38] border border-gray-100 dark:border-[#2a3768] p-6 sm:p-8 text-gray-900 dark:text-gray-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
            UK
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Secure Authentication
          </span>
        </div>

        <h2
          id="auth-modal-title"
          className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Log in or sign up
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Join UKRent to book doorstep services, stays, and rides
        </p>

        {!otpSent ? (
          <form onSubmit={handleContinue} className="mt-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-12 shrink-0 items-center rounded-xl border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] px-3">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="cursor-pointer bg-transparent pr-1 text-xs font-bold text-gray-900 dark:text-gray-100 outline-none"
                >
                  <option value="+91" className="bg-white dark:bg-[#131b38]">🇮🇳 +91</option>
                  <option value="+1" className="bg-white dark:bg-[#131b38]">🇺🇸 +1</option>
                  <option value="+44" className="bg-white dark:bg-[#131b38]">🇬🇧 +44</option>
                </select>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] px-3.5 text-sm font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 placeholder:font-normal focus:border-blue-600 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400">Send code via</p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOtpChannel('sms')}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                    otpChannel === 'sms'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-gray-200 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <MessageSquare size={14} />
                  SMS
                </button>

                <button
                  type="button"
                  onClick={() => setOtpChannel('whatsapp')}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                    otpChannel === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-gray-200 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </button>
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!canContinue}
              className={`h-12 w-full rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                canContinue
                  ? 'cursor-pointer bg-blue-600 hover:bg-blue-700 text-white active:scale-98'
                  : 'cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400'
              }`}
            >
              Continue with OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Enter verification code sent to{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {countryCode} {cleanDigits}
              </span>{' '}
              via <span className="font-bold uppercase text-blue-600">{otpChannel}</span>.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="h-12 w-full rounded-2xl border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] px-3.5 text-center text-lg font-black tracking-widest text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none"
              autoFocus
            />
            {error && <p className="text-xs font-bold text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="h-12 rounded-2xl border border-gray-300 dark:border-[#2a3768] px-4 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1b2754]"
              >
                Change number
              </button>
              <button
                type="submit"
                className="h-12 flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-black uppercase tracking-wider text-white shadow-sm"
              >
                Verify &amp; Continue
              </button>
            </div>
          </form>
        )}

        {/* 1-Tap Demo Logins for Instant Testing */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2a3768]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
            Or test instantly as:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handlePersonaLogin(p.role)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 bg-gray-50/70 dark:bg-[#0b1126] text-left text-xs font-bold text-gray-800 dark:text-gray-200 transition-all flex items-center justify-between"
              >
                <span className="capitalize">{p.role}</span>
                <span className="text-[10px] text-gray-400 font-normal">Demo</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] text-gray-400">
          By signing up, you agree to UKRent's{' '}
          <a href="/support" className="underline hover:text-gray-600">Terms of Service</a> &amp;{' '}
          <a href="/support" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
