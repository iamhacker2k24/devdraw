import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheck, FiInfo, FiAlertCircle } from "react-icons/fi";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 2400) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast container floating at bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/90 text-white text-xs font-medium shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-popover pointer-events-auto"
          >
            {toast.type === "success" && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <FiCheck size={12} />
              </span>
            )}
            {toast.type === "info" && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <FiInfo size={12} />
              </span>
            )}
            {toast.type === "error" && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                <FiAlertCircle size={12} />
              </span>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: (msg) => console.log(msg) };
  }
  return ctx;
};
