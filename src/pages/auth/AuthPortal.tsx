import React from 'react';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import LoginView from './LoginView';
import ForgotPasswordView from './ForgotPasswordView';
import OtpVerificationView from './OtpVerificationView';
import ResetPasswordView from './ResetPasswordView';

export const AuthPortal: React.FC = () => {
  const { authScreen, setIsAuthenticated, showToast } = useApp();

  return (
    <div className="min-h-screen w-full bg-[#F6F8FC] flex flex-col lg:flex-row antialiased">
      {/* Left Branding / Compliance Hero Column (lg: 5 cols / 42% width) */}
      <div className="lg:w-5/12 bg-[#102A43] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden flex-shrink-0">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2776EA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#16865B]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <img src="/logo-icon.png" alt="Nexora Health" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">Nexora Health</span>
              <span className="text-[11px] text-[#8A97A8] uppercase tracking-wider font-semibold">
                Enterprise Admin Portal
              </span>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Unified Healthcare Administration & Risk Treasury
            </h1>
            <p className="text-xs sm:text-sm text-[#8A97A8] leading-relaxed max-w-md">
              Centralized platform for health insurance underwriters, provider networks, corporate group sponsors, and operational claims auditors.
            </p>
          </div>
        </div>

        {/* Middle Feature Highlights / Live Metrics */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-[#8A97A8] tracking-wider block">Insured Lives</span>
              <span className="text-xl font-bold text-white mt-0.5 block">48,520+</span>
              <span className="text-[10px] text-[#16865B] font-medium mt-1 block">Active across groups</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-[#8A97A8] tracking-wider block">Claims Settled</span>
              <span className="text-xl font-bold text-white mt-0.5 block">PKR 84.6M</span>
              <span className="text-[10px] text-[#2776EA] font-medium mt-1 block">YTD Gross Portfolio</span>
            </div>
          </div>

          {/* Security & Regulatory Strip */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-[#8A97A8] tracking-wider block">
              Cryptographic Safeguards & Standards
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A5B3C6]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#16865B]">✓</span>
                <span>HIPAA Security Rule</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#16865B]">✓</span>
                <span>SOC-2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#16865B]">✓</span>
                <span>256-Bit TLS End-to-End</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#16865B]">✓</span>
                <span>FIDO2 / TOTP Two-Factor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#66758A]">
          <span>© 2025 Nexora Health Systems Inc.</span>
          <span>v3.5 Enterprise</span>
        </div>
      </div>

      {/* Right Interactive Form Area (lg: 7 cols / 58% width) */}
      <div className="lg:w-7/12 flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Top Direct Shortcut Bar */}
        <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-8">
          <div className="flex items-center gap-2 text-xs text-[#66758A]">
            <span className="w-2 h-2 rounded-full bg-[#16865B] animate-pulse" />
            <span>Identity Gateway Online</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(true);
              showToast('Direct Access Granted', 'Entered administrator dashboard directly in reviewer mode.', 'info');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#E5EAF1] text-[#2776EA] hover:bg-[#EAF2FF] shadow-2xs transition-all cursor-pointer"
          >
            <span>Skip to Dashboard</span>
            <Icon name="chevron-right" size={13} />
          </button>
        </div>

        {/* Center Container: Dynamic Screen Renderer */}
        <div className="w-full max-w-md mx-auto my-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E5EAF1] shadow-xs">
          {authScreen === 'forgot_password' && <ForgotPasswordView />}
          {authScreen === 'otp_verify' && <OtpVerificationView />}
          {authScreen === 'reset_password' && <ResetPasswordView />}
          {authScreen === 'login' && <LoginView />}
        </div>

        {/* Bottom Auxiliary Links */}
        <div className="w-full max-w-md mx-auto mt-8 pt-4 text-center text-xs text-[#8A97A8] flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => showToast('Help Desk', 'Contact system IT support at support@nexorahealth.com', 'info')}
            className="hover:text-[#102A43] hover:underline"
          >
            IT Security Support
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => showToast('Privacy Policy', 'HIPAA Privacy Safeguards notice v3.5.', 'info')}
            className="hover:text-[#102A43] hover:underline"
          >
            Privacy Notice
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => showToast('Terms', 'Authorized Administrative Use Terms.', 'info')}
            className="hover:text-[#102A43] hover:underline"
          >
            Security Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;