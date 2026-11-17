import React from 'react';
import { useApp } from '../../context/AppContext';
import Icon from './Icon';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const borderStyle =
          toast.type === 'success'
            ? 'border-[#16865B]/30'
            : toast.type === 'error'
            ? 'border-[#D64545]/30'
            : toast.type === 'warning'
            ? 'border-[#D69B32]/30'
            : 'border-[#2776EA]/30';

        const iconBg =
          toast.type === 'success'
            ? 'bg-[#E8F6EF] text-[#16865B]'
            : toast.type === 'error'
            ? 'bg-[#FDECEC] text-[#D64545]'
            : toast.type === 'warning'
            ? 'bg-[#FFF5DF] text-[#D69B32]'
            : 'bg-[#EAF2FF] text-[#2776EA]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white rounded-xl shadow-xl border ${borderStyle} p-3.5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-bottom-5`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${iconBg}`}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '!'}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-semibold text-[#102A43] leading-tight">{toast.title}</h4>
              <p className="text-[12px] text-[#66758A] mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#8A97A8] hover:text-[#172B4D] p-1 rounded-md transition-colors"
              aria-label="Dismiss"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
