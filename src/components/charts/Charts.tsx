import React, { useState } from 'react';

// ─── 1. Line / Area Chart ──────────────────────────────────────────────────
export interface LineChartProps {
  data?: number[];
  secondaryData?: number[];
  labels?: string[];
  height?: number;
  currencyPrefix?: string;
  unitSuffix?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data = [42, 48, 44, 57, 54, 66, 63, 72, 69, 78, 76, 86],
  secondaryData = [36, 40, 39, 45, 48, 52, 54, 58, 61, 65, 68, 71],
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  currencyPrefix = 'PKR ',
  unitSuffix = 'M',
  primaryLabel = 'Current Period',
  secondaryLabel = 'Previous Period',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = Math.max(...data, ...(secondaryData || [])) * 1.15 || 100;
  const width = 640;
  const height = 180;
  const paddingX = 20;
  const paddingY = 20;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
    return { x, y, val };
  });

  const secondaryPoints = secondaryData?.map((val, idx) => {
    const x = paddingX + (idx / (secondaryData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const secondaryPathD = secondaryPoints?.reduce(
    (acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`,
    ''
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-[#66758A] mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2776EA]" />
            <span>{primaryLabel}</span>
          </div>
          {secondaryData && (
            <div className="flex items-center gap-1.5 font-medium text-[#8A97A8]">
              <span className="w-2.5 h-0.5 bg-[#8A97A8] rounded-full" />
              <span>{secondaryLabel}</span>
            </div>
          )}
        </div>

        {hoveredIndex !== null && (
          <div className="bg-[#102A43] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md animate-in fade-in">
            <span className="font-medium text-[#c8ddfb]">{labels[hoveredIndex]}: </span>
            <span className="font-bold">
              {currencyPrefix}
              {data[hoveredIndex]}
              {unitSuffix}
            </span>
            {secondaryData && (
              <span className="text-[#8A97A8] ml-2">
                (Prev: {currencyPrefix}
                {secondaryData[hoveredIndex]}
                {unitSuffix})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2776EA" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2776EA" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + pct * (height - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E5EAF1"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#primaryAreaGrad)" />

          {/* Secondary comparison line */}
          {secondaryPathD && (
            <path
              d={secondaryPathD}
              fill="none"
              stroke="#8A97A8"
              strokeWidth="1.8"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Primary line */}
          <path d={pathD} fill="none" stroke="#2776EA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data interactive dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill="#FFFFFF"
                  stroke="#2776EA"
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                />
                <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" className="cursor-pointer" />
              </g>
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="flex justify-between items-center px-4 mt-1 text-[10px] text-[#8A97A8] font-medium">
          {labels.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 2. Donut Chart ────────────────────────────────────────────────────────
export interface DonutChartProps {
  segments?: { label: string; value: number; color: string; countStr: string }[];
  centerValue?: string;
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments = [
    { label: 'Approved', value: 1842, color: '#2776EA', countStr: '1,842' },
    { label: 'Pending', value: 684, color: '#D69B32', countStr: '684' },
    { label: 'Under Review', value: 492, color: '#66758A', countStr: '492' },
    { label: 'Rejected', value: 266, color: '#D64545', countStr: '266' },
  ],
  centerValue = '3,284',
  centerLabel = 'Total Claims',
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let accumulatedAngle = 0;

  // Calculate SVG stroke dashes for circle circumference
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      {/* Visual Ring */}
      <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {segments.map((seg, idx) => {
            const strokeDash = (seg.value / total) * circumference;
            const strokeOffset = -(accumulatedAngle / total) * circumference;
            accumulatedAngle += seg.value;

            return (
              <circle
                key={idx}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-bold text-[#102A43] leading-none">{centerValue}</span>
          <span className="text-[10px] text-[#8A97A8] font-medium mt-1 uppercase tracking-wider">{centerLabel}</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2.5 min-w-[150px] w-full sm:w-auto">
        {segments.map((seg, idx) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#F1F4F9] last:border-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-[#66758A] font-medium">{seg.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#102A43]">{seg.countStr}</span>
                <span className="text-[11px] text-[#8A97A8]">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── 3. Horizontal Bar Chart ───────────────────────────────────────────────
export interface BarItem {
  label: string;
  count: number;
  formattedCount: string;
  percentage: number;
  color?: string;
}

export interface BarChartProps {
  items?: BarItem[];
}

export const BarChart: React.FC<BarChartProps> = ({
  items = [
    { label: 'Corporate Plans', count: 5162, formattedCount: '5,162 policies', percentage: 78, color: '#2776EA' },
    { label: 'Individual Cover', count: 3984, formattedCount: '3,984 policies', percentage: 62, color: '#16865B' },
    { label: 'Family Floater', count: 2448, formattedCount: '2,448 policies', percentage: 49, color: '#D69B32' },
    { label: 'Group & Mutual Health', count: 1246, formattedCount: '1,246 policies', percentage: 32, color: '#5664D2' },
  ],
}) => {
  return (
    <div className="flex flex-col gap-4 py-2">
      {items.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#172B4D]">{item.label}</span>
            <span className="font-semibold text-[#40516A]">{item.formattedCount}</span>
          </div>
          <div className="h-2 w-full bg-[#E5EAF1] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color || '#2776EA',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  LineChart,
  DonutChart,
  BarChart,
};
