import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportApi } from '../api';
import { ErrorBox, PrimaryBtn, SpinnerOverlay } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  Mail,
  MessageSquare,
  PhoneCall,
  PlusCircle,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'booking', label: 'Booking & Visits' },
  { id: 'payment', label: 'Payment & Charges' },
  { id: 'application', label: 'Partner Application' },
  { id: 'account', label: 'Account & Login' },
  { id: 'technical', label: 'App Technical Issue' },
  { id: 'other', label: 'General Enquiry' },
];

const EMPTY_FORM = {
  subject: '',
  category: 'booking',
  message: '',
};

export default function SupportCenter() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setLoadError('');
    try {
      const { data } = await supportApi.mine();
      const list = data?.data || data;
      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      setTickets([]);
      setLoadError(
        err.response?.data?.message ||
        'We could not load your support tickets. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const closeForm = () => {
    setShowNew(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const subject = form.subject.trim();
    const message = form.message.trim();

    if (subject.length < 3) {
      setError('Subject must be at least 3 characters.');
      return;
    }
    if (subject.length > 160) {
      setError('Subject must be 160 characters or fewer.');
      return;
    }
    if (message.length < 10) {
      setError('Please add at least 10 characters to your message.');
      return;
    }
    if (message.length > 3000) {
      setError('Message must be 3000 characters or fewer.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await supportApi.create({ subject, category: form.category, message });
      const created = data?.data || data;
      if (created?._id) {
        setTickets((current) => [created, ...current]);
      } else {
        await fetchTickets();
      }
      showToast('Support ticket created successfully.');
      closeForm();
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'We could not submit your ticket. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'resolved' || status === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle size={11} /> Resolved
        </span>
      );
    }
    if (status === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
          <Clock size={11} /> In progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
        <AlertCircle size={11} /> Open
      </span>
    );
  };

  const inputCls =
    'w-full rounded-xl border-2 border-blue-100 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-[#2a3768] dark:bg-[#0b1126] dark:text-gray-200';

  const canCreateTicket =
    user && ['customer', 'owner', 'provider'].includes(user.role);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Help &amp; Support Center
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get help with bookings, rentals, rides, payments, or your account.
          </p>
        </div>

        {user && canCreateTicket && (
          <button
            type="button"
            onClick={() => {
              setError('');
              setShowNew((current) => !current);
            }}
            aria-expanded={showNew}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-300"
          >
            <PlusCircle size={14} /> {showNew ? 'Close Form' : 'New Ticket'}
          </button>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a
          href="mailto:support@ukrentserver.com"
          className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 transition-colors hover:border-blue-400 dark:border-[#2a3768] dark:bg-[#131b38]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#1b2754] dark:text-blue-400">
            <Mail size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-gray-400">Direct Email</div>
            <div className="truncate text-xs font-bold text-gray-800 dark:text-gray-200">
              support@ukrentserver.com
            </div>
          </div>
        </a>

        <a
          href="tel:+91180073687873"
          className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 transition-colors hover:border-blue-400 dark:border-[#2a3768] dark:bg-[#131b38]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#1b2754] dark:text-blue-400">
            <PhoneCall size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-400">Help Desk</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
              +91 1800-RENT-SERVE
            </div>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 dark:border-[#2a3768] dark:bg-[#131b38]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#1b2754] dark:text-blue-400">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-xs text-gray-400">Working Hours</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
              24/7 Helpline Available
            </div>
          </div>
        </div>
      </div>

      {!user ? (
        <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 text-center dark:border-[#2a3768] dark:bg-[#131b38]">
          <HelpCircle size={28} className="mx-auto mb-2 text-blue-500" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Sign in to contact support
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            You need an account to create and track support tickets.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <>
          {showNew && canCreateTicket && (
            <section
              id="new-support-ticket"
              className="mb-8 rounded-3xl border-2 border-blue-600 bg-white p-5 shadow-md sm:p-6 dark:border-blue-400 dark:bg-[#131b38]"
              aria-labelledby="new-ticket-heading"
            >
              <h2
                id="new-ticket-heading"
                className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100"
              >
                Create a Support Ticket
              </h2>
              {error && <ErrorBox message={error} />}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                <div>
                  <label
                    htmlFor="support-subject"
                    className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <input
                    id="support-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of your query"
                    maxLength={160}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label
                    htmlFor="support-category"
                    className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <select
                    id="support-category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="support-message"
                    className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Detailed Message
                  </label>
                  <textarea
                    id="support-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Include booking ID, provider name, or other relevant details"
                    maxLength={3000}
                    required
                    className={inputCls}
                  />
                  <div className="mt-1 text-right text-[10px] text-gray-400">
                    {form.message.length}/3000
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <PrimaryBtn type="submit" disabled={submitting} className="px-5 py-2 text-xs">
                    {submitting ? 'Submitting…' : 'Submit Ticket'}
                  </PrimaryBtn>
                </div>
              </form>
            </section>
          )}

          {user.role === 'driver' && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              Driver accounts are supported through ride-related booking support. Contact the help desk if you need account assistance.
            </div>
          )}
        </>
      )}

      {user && (
        <section aria-labelledby="ticket-history-heading">
          <h2
            id="ticket-history-heading"
            className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800 dark:text-gray-200"
          >
            <MessageSquare size={16} className="text-blue-500" />
            My Support History
          </h2>

          {loading ? (
            <SpinnerOverlay />
          ) : loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm text-red-700 dark:text-red-400">{loadError}</p>
              <button
                type="button"
                onClick={fetchTickets}
                className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-xs font-bold text-red-700 dark:border-red-800 dark:text-red-400"
              >
                Try again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center dark:border-[#2a3768] dark:bg-[#131b38]">
              <MessageSquare size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                No support tickets yet
              </p>
              {canCreateTicket && (
                <p className="mt-1 text-xs text-gray-400">
                  Create a ticket and our team will help you resolve it.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tickets.map((ticket) => {
                const category = CATEGORIES.find((item) => item.id === ticket.category);
                const createdAt = ticket.createdAt ? new Date(ticket.createdAt) : null;

                return (
                  <article
                    key={ticket._id}
                    className="rounded-2xl border border-blue-100 bg-white p-4 shadow-xs transition-colors hover:border-blue-400 dark:border-[#2a3768] dark:bg-[#131b38]"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-[#1b2754] dark:text-blue-400">
                            {category?.label || ticket.category || 'General'}
                          </span>
                          {createdAt && !Number.isNaN(createdAt.getTime()) && (
                            <time
                              dateTime={createdAt.toISOString()}
                              className="text-xs text-gray-400"
                            >
                              {createdAt.toLocaleDateString()}
                            </time>
                          )}
                        </div>
                        <h3 className="break-words text-sm font-bold text-gray-900 dark:text-gray-100">
                          {ticket.subject}
                        </h3>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    <p className="mb-3 whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                      {ticket.message}
                    </p>

                    {ticket.adminNote && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900 dark:border-[#2a3768] dark:bg-[#1b2754] dark:text-blue-200">
                        <b className="mb-0.5 block text-[11px] uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          UKRentserver Support Response
                        </b>
                        {ticket.adminNote}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
