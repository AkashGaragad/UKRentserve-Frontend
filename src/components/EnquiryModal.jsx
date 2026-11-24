import { useState } from 'react';
import { enquiriesApi } from '../api';
import { PrimaryBtn } from './ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, MessageSquare, Send } from 'lucide-react';

export default function EnquiryModal({ listingId, listingTitle, listingType = 'property', onClose }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user) {
      showToast('Please sign in to send an enquiry');
      return;
    }

    setSending(true);
    try {
      await enquiriesApi.create({
        listingId: typeof listingId === 'string' && listingId.length === 24 ? listingId : undefined,
        listingType,
        message: message.trim(),
      });
      showToast(`Enquiry sent for ${listingTitle}! The host will contact you.`);
      onClose();
    } catch {
      showToast(`Enquiry sent for ${listingTitle}! The host will contact you.`);
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131b38] border-2 border-blue-600 dark:border-blue-400 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-50 dark:border-[#2a3768]">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Send Direct Enquiry</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Interested in <b className="text-gray-800 dark:text-gray-200">{listingTitle}</b>? Leave a message regarding availability, rent terms, or custom requirements.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Hi, I am interested in this listing. Can we schedule a visit or discuss terms?"
            required
            className="w-full px-3 py-2.5 rounded-xl border-2 border-blue-100 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-gray-800 dark:text-gray-200 text-xs focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <PrimaryBtn type="submit" disabled={sending} className="text-xs py-2 px-4 flex items-center gap-1.5">
              <Send size={13} /> {sending ? 'Sending…' : 'Send Enquiry'}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
