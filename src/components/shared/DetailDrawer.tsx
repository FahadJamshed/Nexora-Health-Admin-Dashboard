import React, { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import Badge from '../ui/Badge';

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  status?: string;
  badge?: React.ReactNode;
  avatarInitials?: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  actions?: {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    onClick: () => void;
    icon?: string;
  }[];
  footer?: React.ReactNode;
  children: React.ReactNode | ((activeTab: string) => React.ReactNode);
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  status = 'Active',
  badge,
  avatarInitials,
  tabs,
  activeTab,
  onTabChange,
  actions,
  footer,
  children,
}) => {
  const [internalTab, setInternalTab] = useState(tabs?.[0] || 'Overview');
  const currentTab = activeTab || internalTab;

  // Sync internal tab if tabs prop changes
  useEffect(() => {
    if (tabs && tabs.length > 0 && !tabs.includes(internalTab)) {
      setInternalTab(tabs[0]);
    }
  }, [tabs]);

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

  const initials =
    avatarInitials ||
    title
      .split(' ')
      .filter((w) => w && w[0])
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    'NX';

  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102A43]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl sm:max-w-3xl bg-[#F6F8FC] shadow-2xl flex flex-col border-l border-[#E5EAF1] animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="bg-white px-6 py-5 border-b border-[#E5EAF1] flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#2776EA] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs border border-[#c8ddfb]">
                  {initials}
                </div>
                <div className="min-w-0">
                  {subtitle && (
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A97A8]">
                      {subtitle}
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 flex-wrap mt-0.5">
                    <h2 className="text-lg font-semibold text-[#102A43] truncate">{title}</h2>
                    {badge ? badge : status ? <Badge value={status} size="sm" /> : null}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A97A8] hover:text-[#172B4D] hover:bg-[#F1F4F9] transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Close drawer"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Action Bar */}
            {actions && actions.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E5EAF1] overflow-x-auto pb-1">
                {actions.map((act, i) => {
                  const style =
                    act.variant === 'primary'
                      ? 'bg-[#2776EA] text-white hover:bg-[#1E65CF] shadow-xs'
                      : act.variant === 'danger'
                      ? 'bg-[#FDECEC] text-[#D64545] border border-[#f7c5c5] hover:bg-[#fad8d8]'
                      : 'bg-white border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC]';

                  return (
                    <button
                      key={i}
                      onClick={act.onClick}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${style}`}
                    >
                      {act.icon && <Icon name={act.icon} size={13} />}
                      {act.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tabs Row */}
            {tabs && tabs.length > 0 && (
              <div className="flex items-center gap-4 mt-4 -mb-5 border-t border-[#E5EAF1] pt-3 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const isActive = tab === currentTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`pb-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#2776EA] text-[#2776EA] font-semibold'
                          : 'border-transparent text-[#66758A] hover:text-[#172B4D]'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scrollable Body - Supports both standard elements AND function children: (activeTab) => ReactNode */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {typeof children === 'function' ? (children as any)(currentTab) : children}
          </div>

          {/* Sticky Drawer Footer */}
          {footer && (
            <div className="px-6 py-4 bg-white border-t border-[#E5EAF1] flex items-center justify-end gap-2.5 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
