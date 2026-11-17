import React from 'react';
import Icon from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-xs px-4 py-2 gap-2 h-9',
    lg: 'text-sm px-5 py-2.5 gap-2.5 h-10',
  };

  const variantStyles = {
    primary:
      'bg-[#2776EA] text-white hover:bg-[#1E65CF] active:bg-[#1554B3] shadow-xs border border-transparent',
    secondary:
      'bg-white text-[#40516A] border border-[#E5EAF1] hover:bg-[#F8FAFC] active:bg-[#EDF2F7] shadow-xs',
    danger:
      'bg-[#D64545] text-white hover:bg-[#BE3434] active:bg-[#A32323] shadow-xs border border-transparent',
    ghost:
      'bg-transparent text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43] border border-transparent',
    outline:
      'bg-transparent text-[#2776EA] border border-[#2776EA] hover:bg-[#EAF2FF] active:bg-[#D4E5FF]',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 17,
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <Icon name={icon} size={iconSizes[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={iconSizes[size]} />
      )}
    </button>
  );
};

export default Button;
