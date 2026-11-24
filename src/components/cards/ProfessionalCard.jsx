import { Star, ShieldCheck, MapPin, Zap, ArrowRight, Wrench } from 'lucide-react';
import { rupee } from '../ui';

export function ProfessionalCard({
  provider,
  onBook,
  onViewProfile,
  onEnquire,
  compact = false,
}) {
  const name = provider.n || provider.name || provider.fullName || 'Verified Professional';
  const category = provider.s || provider.category || provider.trade || 'Home Service';
  const rating = provider.r ?? provider.rating ?? 4.8;
  const reviews = provider.reviews || provider.reviewCount || 24;
  const experience = provider.experience || (provider.experienceYears ? `${provider.experienceYears}+ yrs exp` : '3+ yrs exp');
  const distance = provider.d != null ? `${provider.d} km away` : (provider.location || provider.area || 'Dehradun');
  const price = provider.p ?? provider.price ?? provider.visitingFee ?? 299;
  const isInstant = provider.instant ?? provider.instantBook ?? true;
  const isVerified = provider.verified ?? (provider.verificationStatus === 'verified' || provider.status === 'approved' || true);
  const photo = provider.profilePhoto || provider.photo || provider.profileImage?.url;

  return (
    <div
      data-t={`${category} ${name}`}
      className="group bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-5 hover:border-blue-500/80 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Avatar + Meta */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative shrink-0">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-[#2a3768]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/30 border border-blue-100 dark:border-[#2a3768] flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 select-none ${photo ? 'hidden' : ''}`}
            >
              {name.charAt(0)}
            </div>
            {isVerified && (
              <span
                title="Verified Professional"
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-[#131b38]"
              >
                <ShieldCheck size={12} strokeWidth={3} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 px-2 py-0.5 rounded-full shrink-0">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{rating}</span>
                {reviews > 0 && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">({reviews})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#1b2754] px-2 py-0.5 rounded-md">
                <Wrench size={11} className="text-blue-600 dark:text-blue-400" />
                {category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {experience}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Badges */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 px-0.5">
          <span className="inline-flex items-center gap-1 truncate max-w-[190px]">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{distance}</span>
          </span>
          {isInstant && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full shrink-0">
              <Zap size={11} className="fill-emerald-500" />
              Instant Visit
            </span>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-[#2a3768] flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 block leading-tight">Visit &amp; diagnosis</span>
          <div className="text-base font-extrabold text-gray-900 dark:text-gray-100">
            {typeof price === 'number' ? rupee(price) : price}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onViewProfile && (
            <button
              type="button"
              onClick={onViewProfile}
              className="text-xs font-semibold px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1b2754] transition-colors"
            >
              Details
            </button>
          )}

          {onBook ? (
            <button
              type="button"
              onClick={onBook}
              className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all active:scale-95"
            >
              Book Now
              <ArrowRight size={13} />
            </button>
          ) : onViewProfile ? (
            <button
              type="button"
              onClick={onViewProfile}
              className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all"
            >
              View Profile
              <ArrowRight size={13} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
