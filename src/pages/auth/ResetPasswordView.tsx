import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

export const ResetPasswordView: React.FC = () => {
  const { setAuthScreen, resetPasswordWithOtp, showToast } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Criteria checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const validScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel =
    validScore <= 1 ? 'Weak' : validScore <= 3 ? 'Moderate' : 'Strong Enterprise Grade';
  const strengthColor =
    validScore <= 1 ? 'bg-[#D64545]' : validScore <= 3 ? 'bg-[#D69B32]' : 'bg-[#16865B]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength) {
      showToast('Validation Error', 'Password must be at least 8 characters long.', 'error');
      return;
    }
    if (!passwordsMatch) {
      showToast('Mismatch Error', 'The confirmed password does not match.', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      resetPasswordWithOtp(newPassword);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Back to Login link */}
      <div>
        <button
          type="button"
          onClick={() => setAuthScreen('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2776EA] hover:text-[#1f5ec2] transition-colors"
        >
          <Icon name="arrow-left" size={14} />
          <span>Back to Sign In</span>
        </button>
      </div>

      {/* View Header */}
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#E8F6EF] text-[#16865B] flex items-center justify-center font-bold mb-4 shadow-xs">
          <Icon name="key" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">Create New Password</h2>
        <p className="text-xs text-[#66758A] mt-1.5 leading-relaxed">
          Your identity has been verified via OTP. Establish a high-entropy password adhering to Nexora corporate security standards.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            New Security Password <span className="text-[#D64545]">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A97A8]">
              <Icon name="lock" size={15} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter at least 8 characters"
              required
              className="w-full pl-9 pr-10 py-2.5 border border-[#E5EAF1] rounded-lg text-xs text-[#102A43] placeholder-[#8A97A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A97A8] hover:text-[#102A43]"
            >
              <Icon name="eye" size={15} />
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        {newPassword && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8A97A8]">Password Complexity:</span>
              <span className="font-semibold text-[#102A43]">{strengthLabel}</span>
            </div>
            <div className="w-full h-1.5 bg-[#E5EAF1] rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColor} transition-all duration-300`}
                style={{ width: `${(validScore / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Security Checklist */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl space-y-1.5 text-[11px]">
          <span className="font-bold text-[#102A43] block text-[10px] uppercase tracking-wider mb-1">
            Corporate Password Policy Requirements:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#16865B] font-semibold' : 'text-[#8A97A8]'}`}>
              <Icon name={hasMinLength ? 'check' : 'x'} size={12} />
              <span>Min. 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-[#16865B] font-semibold' : 'text-[#8A97A8]'}`}>
              <Icon name={hasUppercase ? 'check' : 'x'} size={12} />
              <span>Uppercase letter (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-[#16865B] font-semibold' : 'text-[#8A97A8]'}`}>
              <Icon name={hasNumber ? 'check' : 'x'} size={12} />
              <span>Numeric digit (0-9)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-[#16865B] font-semibold' : 'text-[#8A97A8]'}`}>
              <Icon name={hasSpecial ? 'check' : 'x'} size={12} />
              <span>Special symbol (!@#$)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Confirm New Password <span className="text-[#D64545]">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A97A8]">
              <Icon name="lock" size={15} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your new password"
              required
              className="w-full pl-9 pr-3.5 py-2.5 border border-[#E5EAF1] rounded-lg text-xs text-[#102A43] placeholder-[#8A97A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] transition-all"
            />
          </div>
          {confirmPassword && !passwordsMatch && (
            <span className="text-[11px] text-[#D64545] mt-1 block">Passwords do not match</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !hasMinLength || !passwordsMatch}
          className="w-full py-2.5 px-4 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Credentials...</span>
            </>
          ) : (
            <>
              <Icon name="check" size={15} />
              <span>Save Password & Sign In</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordView;