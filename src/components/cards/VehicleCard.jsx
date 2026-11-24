import { Users, Clock, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';
import { rupee } from '../ui';

export function VehicleCard({
  vehicle,
  selected = false,
  onSelect,
  onBook,
  estimatedFare = null,
  estimatedKm = null,
}) {
  const {
    id,
    label,
    value,
    img,
    capacity = '3-4 Seats',
    tag = 'Fastest Nearby',
    ratePerKm = 14,
    description = 'Doorstep pickup with verified driver'
  } = vehicle;

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        selected
          ? 'bg-blue-50/70 dark:bg-[#1b2754]/80 border-blue-600 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20'
          : 'bg-white dark:bg-[#131b38] border-gray-200/90 dark:border-[#2a3768] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
      }`}
    >
      {/* Selection Pill indicator */}
      {selected && (
        <span className="absolute -top-2.5 right-4 bg-blue-600 text-white rounded-full p-1 shadow-sm text-xs">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      {/* Left: Image & Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700 p-1 flex items-center justify-center">
          {img ? (
            <img
              src={img}
              alt={label}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className="text-3xl">🚖</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {label}
            </h4>
            {tag && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
            {description}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1 font-medium">
              <Users size={12} className="text-gray-400" />
              {capacity}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Zap size={11} className="fill-emerald-500" />
              Arrives in ~3 mins
            </span>
          </div>
        </div>
      </div>

      {/* Right: Price & CTA */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-[#2a3768]">
        <div className="text-left sm:text-right">
          {estimatedFare ? (
            <>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 block leading-tight">Est. Fare ({estimatedKm} km)</span>
              <div className="text-lg font-black text-gray-900 dark:text-gray-100">
                {rupee(estimatedFare)}
              </div>
            </>
          ) : (
            <>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 block leading-tight">Starting from</span>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                {rupee(ratePerKm)}<span className="text-xs font-normal text-gray-500"> / km</span>
              </div>
            </>
          )}
        </div>

        {onBook && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook(vehicle);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shrink-0"
          >
            Select
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
