import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Cloud, X } from 'lucide-react';
import clsx from 'clsx';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title?: string;
  message: string;
}

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast">
      <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/10 max-w-sm">
        <div
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            toast.type === 'success'
              ? "bg-emerald-50 text-emerald-600"
              : toast.type === 'error'
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-[#0071e3]"
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Cloud className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <h5 className="text-xs font-bold text-[#1d1d1f] tracking-tight truncate">
              {toast.title}
            </h5>
          )}
          <p className="text-xs text-slate-600 leading-snug">{toast.message}</p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
