import React from 'react';
import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';

export interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: string[];
  primaryAction?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
  secondaryActions?: {
    label: string;
    icon?: string;
    onClick: () => void;
  }[];
  dateRangeText?: string;
  onExport?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  dateRangeText = 'May 1 – May 31, 2025',
  onExport,
}) => {
  const { showToast } = useApp();

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      showToast('Export Started', `${title} data exported to CSV spreadsheet format.`, 'success');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-[#8A97A8] mb-1.5" aria-label="Breadcrumb">
            <span>Portal</span>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                <span className="text-[#8A97A8]/50">/</span>
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-[#102A43]' : ''}>{crumb}</span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#102A43] leading-tight">{title}</h1>
        <p className="text-xs sm:text-[13px] text-[#66758A] mt-1 leading-relaxed max-w-2xl">{description}</p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5 flex-shrink-0">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E5EAF1] bg-white text-[#40516A] hover:bg-[#F8FAFC] hover:border-[#D0D9E4] transition-all shadow-xs"
        >
          <Icon name="export" size={14} />
          Export
        </button>

        <button
          onClick={() => showToast('Date Range', `Filtered to ${dateRangeText}.`, 'info')}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E5EAF1] bg-white text-[#40516A] hover:bg-[#F8FAFC] hover:border-[#D0D9E4] transition-all shadow-xs"
        >
          <Icon name="calendar" size={14} />
          <span>{dateRangeText}</span>
        </button>

        {secondaryActions?.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E5EAF1] bg-white text-[#40516A] hover:bg-[#F8FAFC] transition-all shadow-xs"
          >
            {action.icon && <Icon name={action.icon} size={14} />}
            {action.label}
          </button>
        ))}

        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] transition-all shadow-sm"
          >
            <Icon name={primaryAction.icon || 'plus'} size={14} />
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
