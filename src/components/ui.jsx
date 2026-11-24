// Shared District-inspired UI primitives
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Inbox } from 'lucide-react';

export function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`my-6 ${className}`}>
      <h2
        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2.5"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        <span className="w-1.5 h-6 rounded-full bg-blue-600 dark:bg-blue-400 inline-block shrink-0" />
        {children}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium pl-4">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function SectionHeader({ title, subtitle, actionText, actionTo, onAction, className = '' }) {
  return (
    <div className={`flex items-end justify-between gap-4 mb-5 ${className}`}>
      <div>
        <h2
          className="text-2xl sm:text-[28px] font-black tracking-tight text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {(actionTo || onAction) && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0 group py-1"
          >
            <span>{actionText || 'See All'}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0 group py-1"
          >
            <span>{actionText || 'See All'}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )
      )}
    </div>
  );
}

export function Card({ children, className = '', onClick, href, as: TagElement }) {
  const base =
    'bg-white dark:bg-[#131b38] border border-gray-200/90 dark:border-[#2a3768] rounded-2xl p-5 text-left block w-full transition-all duration-300 hover:border-blue-500/80 dark:hover:border-blue-400 hover:shadow-md';
  if (TagElement) return <TagElement className={`${base} ${className}`} onClick={onClick}>{children}</TagElement>;
  if (href) return <a href={href} className={`${base} ${className}`}>{children}</a>;
  if (onClick) return <button type="button" className={`${base} ${className}`} onClick={onClick}>{children}</button>;
  return <div className={`${base} ${className}`}>{children}</div>;
}

export function CardActive({ children, active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 text-left block w-full transition-all duration-300 border-2 ${
        active
          ? 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-[#1b2754] shadow-sm'
          : 'border-gray-200/90 dark:border-[#2a3768] bg-white dark:bg-[#131b38] hover:border-blue-400 dark:hover:border-blue-500'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function PrimaryBtn({ children, onClick, type = 'button', className = '', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl px-5 py-2.5 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-98 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineBtn({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-transparent text-blue-600 dark:text-blue-400 font-bold rounded-xl border-2 border-blue-600 dark:border-blue-400 px-5 py-2 hover:bg-blue-50 dark:hover:bg-[#1b2754] active:scale-98 transition-all flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function Tag({ children, color = 'blue' }) {
  const styles = {
    blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
    green: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  };

  return (
    <span className={`text-xs rounded-lg px-2.5 py-1 font-bold border ${styles[color] || styles.blue} inline-flex items-center gap-1`}>
      {children}
    </span>
  );
}

export function Chip({ children, active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border rounded-full px-4 py-2 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
        active
          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm'
          : 'bg-white dark:bg-[#131b38] border-gray-200 dark:border-[#2a3768] text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title = 'No results found', description, onReset, actionText = 'Reset filters' }) {
  return (
    <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-[#2a3768] bg-gray-50/50 dark:bg-[#0b1126]/40 my-6">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#131b38] text-gray-400 flex items-center justify-center mx-auto mb-3">
        <Inbox size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
          {description}
        </p>
      )}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function FormInput({ label, id, ...props }) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="block font-bold text-xs uppercase tracking-wider mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        id={id}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
        {...props}
      />
    </div>
  );
}

export function FormSelect({ label, id, children, ...props }) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="block font-bold text-xs uppercase tracking-wider mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>}
      <select
        id={id}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#2a3768] bg-white dark:bg-[#0b1126] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function RatingBadge({ rating }) {
  return <Tag color="amber">⭐ {rating}</Tag>;
}

export function EmojiPlaceholder({ emoji, gradient }) {
  return (
    <div
      className="h-36 rounded-2xl flex items-center justify-center text-5xl mb-3 select-none"
      style={{ background: gradient || 'linear-gradient(135deg,#c9d6ff,#7d9bff)' }}
    >
      {emoji}
    </div>
  );
}

export function Muted({ children, className = '' }) {
  return <span className={`text-gray-500 dark:text-gray-400 ${className}`}>{children}</span>;
}

export function SpinnerOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 rounded-full border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Loading marketplace data…</span>
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl p-4 my-4 text-sm font-medium flex items-center gap-2">
      <AlertTriangle size={18} className="shrink-0 text-red-600" />
      <span>{message}</span>
    </div>
  );
}

export const rupee = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
