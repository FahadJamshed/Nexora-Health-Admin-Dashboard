import React from 'react';
import Icon from '../ui/Icon';

export interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  trendLabel?: string;
  icon?: string;
  sparklineData?: number[];
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  trend,
  trendDirection = 'up',
  trendLabel = 'vs previous period',
  icon,
  sparklineData = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14],
  onClick,
}) => {
  const isDown = trendDirection === 'down' || (trend && trend.startsWith('-'));

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5EAF1] rounded-xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#D0D9E4] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#66758A] tracking-tight">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
            <Icon name={icon} size={16} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#102A43] leading-none">
          {value}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-2.5 text-[11px]">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isDown ? 'text-[#D64545]' : 'text-[#16865B]'
            }`}
          >
            <Icon name={isDown ? 'trendDown' : 'trendUp'} size={12} />
            {trend}
          </span>
          <span className="text-[#8A97A8] text-[11px] truncate">{trendLabel}</span>
        </div>
      )}

      {/* Subtle sparkline bars in bottom corner */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="absolute bottom-2.5 right-3 flex items-end gap-0.5 h-6 opacity-40 pointer-events-none">
          {sparklineData.map((val, idx) => (
            <div
              key={idx}
              className="w-1 bg-[#2776EA] rounded-t-xs transition-all"
              style={{ height: `${Math.max(4, Math.min(22, val * 1.8))}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
