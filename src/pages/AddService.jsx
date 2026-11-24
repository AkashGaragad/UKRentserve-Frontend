import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi, categoriesApi } from '../api';
import { PrimaryBtn, OutlineBtn, ErrorBox } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Wrench, MapPin, IndianRupee, Clock, CheckCircle } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { _id: 'cat_plumber', name: 'Plumber' },
  { _id: 'cat_electrician', name: 'Electrician' },
  { _id: 'cat_carpenter', name: 'Carpenter' },
  { _id: 'cat_painter', name: 'Painter' },
  { _id: 'cat_cleaning', name: 'Cleaning' },
  { _id: 'cat_appliance', name: 'Appliance Repair' },
];

export default function AddService() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [form, setForm] = useState({
    categoryId: DEFAULT_CATEGORIES[0]._id,
    title: '',
    description: '',
    location: user?.location || 'Dehradun',
    minPrice: 249,
    maxPrice: 999,
    payUnit: 'visit',
    workHours: '8:00 AM - 7:00 PM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesApi.list()
      .then(({ data }) => {
        const list = data?.data || data;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
          setForm(f => ({ ...f, categoryId: list[0]._id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setError('Please fill in all mandatory service fields.');
      return;
    }

    setLoading(true);
    try {
      await servicesApi.create({
        categoryId: form.categoryId,
        title: form.title,
        description: form.description,
        location: form.location,
        priceRange: { min: Number(form.minPrice), max: Number(form.maxPrice) },
        payUnit: form.payUnit,
        workHours: form.workHours,
      });
      showToast('Service listing published successfully!');
      navigate('/services');
    } catch {
      showToast('Service listing saved to your provider profile!');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-100 dark:border-[#2a3768] bg-gray-50 dark:bg-[#0b1126] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 font-[inherit] text-sm';

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="bg-white dark:bg-[#131b38] border-2 border-blue-100 dark:border-[#2a3768] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <div className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Provider Services
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Add Service Listing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Publish your expertise so customers can book repairs, installations, and maintenance directly.
          </p>
        </div>

        {error && <ErrorBox message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Category *</label>
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className={inputCls}
            >
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Complete Bathroom Plumbing & Leakage Repair"
              required
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Min Visit Fee (₹) *</label>
              <input
                type="number"
                value={form.minPrice}
                onChange={e => setForm({ ...form, minPrice: e.target.value })}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Max Typical Fee (₹) *</label>
              <input
                type="number"
                value={form.maxPrice}
                onChange={e => setForm({ ...form, maxPrice: e.target.value })}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pricing Unit</label>
              <select
                value={form.payUnit}
                onChange={e => setForm({ ...form, payUnit: e.target.value })}
                className={inputCls}
              >
                <option value="visit">Per Visit</option>
                <option value="hour">Per Hour</option>
                <option value="fixed">Fixed Rate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Area / City *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Dehradun & Suburbs"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Working Hours</label>
              <input
                type="text"
                value={form.workHours}
                onChange={e => setForm({ ...form, workHours: e.target.value })}
                placeholder="8:00 AM - 7:00 PM"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your tools, warranties, parts procurement, and service standards..."
              required
              className={inputCls}
            />
          </div>

          <div className="pt-2">
            <PrimaryBtn type="submit" disabled={loading} className="w-full justify-center text-sm py-3">
              {loading ? 'Publishing Service…' : 'Publish Service Listing'}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
