import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: '', show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 2600);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-blue-50 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-[90vw] text-center"
        >
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
