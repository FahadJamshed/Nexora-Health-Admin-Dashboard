import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

export const OtpVerificationView: React.FC = () => {
  const {
    setAuthScreen,
    verifyOtp,
    pendingAuthEmail,
    authMode,
    showToast,
  } = useApp();

  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric digit
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFillDemoCode = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    showToast('Code Populated', 'Pre-filled demo verification code 123456.', 'info');
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
    showToast('Code Re-Dispatched', 'A new 6-digit verification code was transmitted.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      showToast('Incomplete Code', 'Please enter all 6 digits of your verification code.', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      verifyOtp(fullCode);
    }, 550);
  };

  const maskedEmail = pendingAuthEmail
    ? pendingAuthEmail.replace(/(.{2})(.*)(?=@)/, (_gp, a, b) => a + '*'.repeat(Math.max(b.length, 3)))
    : 's***@nexora.com';

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
          <Icon name="shield" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">
          {authMode === 'password_reset_otp' ? 'Verify Password Reset Code' : 'Two-Factor Authentication'}
        </h2>
        <p className="text-xs text-[#66758A] mt-1.5 leading-relaxed">
          Enter the 6-digit time-based security code dispatched to your registered identity:{' '}
          <strong className="text-[#102A43] font-semibold">{maskedEmail}</strong>
        </p>
      </div>

      {/* Demo Code Quick-Fill Helper */}
      <div className="p-3 bg-[#EAF2FF]/60 border border-[#c8ddfb] rounded-xl flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-[#102A43] block">Demo Testing PIN</span>
          <span className="text-[11px] text-[#66758A]">Use system test code 123456</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemoCode}
          className="px-2.5 py-1 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-md text-[11px] font-semibold shadow-2xs"
        >
          Auto Fill
        </button>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-3 text-center">
            Security Verification Code (6-Digits)
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 text-center text-xl font-bold font-mono text-[#102A43] border border-[#E5EAF1] rounded-xl bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2776EA]/30 focus:border-[#2776EA] transition-all"
              />
            ))}
          </div>
        </div>

        {/* Resend Timer */}
        <div className="text-center text-xs">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#2776EA] font-semibold hover:underline"
            >
              Didn't receive the code? Resend Code
            </button>
          ) : (
            <span className="text-[#8A97A8]">
              Resend verification code in{' '}
              <strong className="text-[#102A43] font-mono">
                00:{countdown < 10 ? `0${countdown}` : countdown}s
              </strong>
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Validating OTP Token...</span>
            </>
          ) : (
            <>
              <Icon name="check" size={15} />
              <span>
                {authMode === 'password_reset_otp' ? 'Verify Code & Set New Password' : 'Verify & Access Console'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Security Tip */}
      <div className="text-center text-[11px] text-[#8A97A8] space-y-1">
        <p>Never share this security code with anyone. Nexora staff will never request your OTP.</p>
      </div>
    </div>
  );
};

export default OtpVerificationView;