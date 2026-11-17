import React from 'react';

export interface BadgeProps {
  value: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ value, variant, size = 'sm', dot = true, className = '' }) => {
  // Infer variant if not explicitly given
  const derivedVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' =
    variant ||
    (/Active|Approved|Paid|Completed|Matched|Normal|Sent/i.test(value)
      ? 'success'
      : /Pending|Under Review|Processing|Expiring Soon|Partial|Draft|Scheduled|High|Renewed/i.test(value)
      ? 'warning'
      : /Inactive|Rejected|Cancelled|Expired|Overdue|Suspended|Urgent|Failed/i.test(value)
      ? 'error'
      : /Submitted|More Information Required|Corporate|Individual|Hospital|Clinic|Executive/i.test(value)
      ? 'info'
      : 'neutral');

  const variantStyles = {
    success: 'bg-[#E8F6EF] text-[#16865B] border-[#c2e8d3]',
    warning: 'bg-[#FFF5DF] text-[#ad7620] border-[#fae2b1]',
    error: 'bg-[#FDECEC] text-[#c53f3f] border-[#f7c5c5]',
    info: 'bg-[#EAF2FF] text-[#2776EA] border-[#c8ddfb]',
    neutral: 'bg-[#F1F4F9] text-[#66758A] border-[#E5EAF1]',
  }[derivedVariant];

  const dotColors = {
    success: 'bg-[#16865B]',
    warning: 'bg-[#D69B32]',
    error: 'bg-[#D64545]',
    info: 'bg-[#2776EA]',
    neutral: 'bg-[#8A97A8]',
  }[derivedVariant];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles} ${sizeStyles} ${className} whitespace-nowrap`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} flex-shrink-0`} />}
      {value}
    </span>
  );
};

export default Badge;
