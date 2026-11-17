import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

export const ForgotPasswordView: React.FC = () => {
  const {
    setAuthScreen,
    requestPasswordReset,
    pendingAuthEmail,
    setPendingAuthEmail,
    showToast,
  } = useApp();

  const [email, setEmail] = useState(pendingAuthEmail || 'sarah.jenkins@nexora.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Validation Error', 'Corporate work email is required.', 'error');
      return;
    }

    setIsLoading(true);
    setPendingAuthEmail(email);

    setTimeout(() => {
      setIsLoading(false);
      requestPasswordReset(email);
    }, 500);
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
        <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold mb-4 shadow-xs">
          <Icon name="key" size={22} />
        </div>
        <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">Reset Corporate Password</h2>
        <p className="text-xs text-[#66758A] mt-1.5 leading-relaxed">
          Enter your authorized enterprise email address. A temporary 6-digit cryptographic recovery OTP will be transmitted to verify your identity.
        </p>
      </div>

      {/* Password Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Registered Work Email <span className="text-[#D64545]">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A97A8]">
              <Icon name="mail" size={15} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah.jenkins@nexora.com"
              required
              className="w-full pl-9 pr-3.5 py-2.5 border border-[#E5EAF1] rounded-lg text-xs text-[#102A43] placeholder-[#8A97A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Dispatching OTP...</span>
            </>
          ) : (
            <>
              <Icon name="lock" size={14} />
              <span>Send Recovery Code</span>
            </>
          )}
        </button>
      </form>

      {/* Security Expiry Alert */}
      <div className="p-3.5 bg-[#FFF5DF] border border-[#f5dfad] rounded-xl text-[11px] text-[#805b18] space-y-1">
        <span className="font-bold block">Security Notice:</span>
        <p className="leading-relaxed text-[11px]">
          Password reset tokens expire automatically within 15 minutes in compliance with Section 164.312 of HIPAA technical safeguards. Contact your system security officer if you do not have device access.
        </p>
      </div>

      {/* Bottom helper */}
      <div className="pt-2 text-center text-xs text-[#66758A]">
        Remember your password?{' '}
        <button
          type="button"
          onClick={() => setAuthScreen('login')}
          className="text-[#2776EA] font-semibold hover:underline"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordView;