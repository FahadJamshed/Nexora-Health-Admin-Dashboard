import React, { useEffect } from 'react';
import Icon from './Icon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth,
  size,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    full: 'max-w-6xl',
  };

  const effectiveMaxWidth = size ? sizeMap[size] || 'max-w-2xl' : maxWidth || 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102A43]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-[#E5EAF1] w-full ${effectiveMaxWidth} max-h-[92vh] flex flex-col my-auto overflow-hidden z-10 transition-all transform animate-in zoom-in-95`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky at top) */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#E5EAF1] flex-shrink-0 bg-white">
          <div className="pr-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#102A43] tracking-tight">{title}</h3>
            {description && <p className="text-xs text-[#66758A] mt-0.5 leading-normal">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A97A8] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Content Body (Scrollable in middle) */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer (Sticky at bottom, always visible) */}
        {footer && (
          <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E5EAF1] flex items-center justify-end gap-2.5 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
