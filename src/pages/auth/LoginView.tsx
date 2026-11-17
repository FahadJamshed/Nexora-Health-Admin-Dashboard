import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const {
    login,
    setAuthScreen,
    setIsAuthenticated,
    setPendingAuthEmail,
    adminUsers,
    setCurrentUser,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('sarah.jenkins@nexora.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState('adm-001');

  const demoAccounts = [
    {
      id: 'adm-001',
      name: 'Sarah Jenkins',
      role: 'Super Administrator',
      email: 'sarah.jenkins@nexora.com',
      avatar: 'SJ',
      color: 'bg-[#102A43] text-white',
    },
    {
      id: 'adm-002',
      name: 'Dr. Evelyn Vance',
      role: 'Claims Manager',
      email: 'evelyn.vance@nexora.com',
      avatar: 'EV',
      color: 'bg-[#EAF2FF] text-[#2776EA]',
    },
    {
      id: 'adm-003',
      name: 'Samuel Foster, CPA',
      role: 'Finance Admin',
      email: 'samuel.foster@nexora.com',
      avatar: 'SF',
      color: 'bg-[#E8F6EF] text-[#16865B]',
    },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setSelectedDemoUser(acc.id);
    setEmail(acc.email);
    setPassword('NexoraSecure@2025');
    const fullUser = adminUsers.find((u) => u.id === acc.id);
    if (fullUser) {
      setCurrentUser(fullUser);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Validation Error', 'Corporate work email is required.', 'error');
      return;
    }

    setIsLoading(true);
    setPendingAuthEmail(email);

    // Simulate authenticating against cryptographic enterprise gateway
    setTimeout(() => {
      setIsLoading(false);
      const res = login(email, password, require2FA);
      if (res.requires2FA) {
        showToast('2FA Code Dispatched', 'A 6-digit OTP code has been sent to your registered device.', 'info');
      } else {
        showToast('Authentication Successful', `Welcome back, ${email}!`, 'success');
      }
    }, 550);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF2FF] border border-[#c8ddfb] text-[#2776EA] text-[11px] font-semibold mb-3">
          <Icon name="shield" size={13} />
          <span>Enterprise Administrative Gateway</span>
        </div>
        <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">Administrator Sign In</h2>
        <p className="text-xs text-[#66758A] mt-1.5 leading-relaxed">
          Provide your enterprise credentials to access Nexora Health's core insurance administration and risk management suite.
        </p>
      </div>

      {/* Demo Credentials Fast-Switcher */}
      <div className="bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[#102A43] uppercase tracking-wider text-[10px]">
            ⚡ One-Click Demo Role Accounts:
          </span>
          <span className="text-[#8A97A8]">Auto-fills credentials</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {demoAccounts.map((acc) => {
            const isSelected = selectedDemoUser === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[#2776EA] bg-white shadow-xs ring-1 ring-[#2776EA]/20'
                    : 'border-[#E5EAF1] bg-white/70 hover:bg-white text-[#40516A]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md ${acc.color} font-bold text-[10px] flex items-center justify-center flex-shrink-0`}>
                    {acc.avatar}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-[#102A43] block truncate leading-tight">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-[#8A97A8] block truncate">{acc.role}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Corporate Work Email <span className="text-[#D64545]">*</span>
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#102A43]">
              Security Password <span className="text-[#D64545]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setAuthScreen('forgot_password')}
              className="text-xs font-semibold text-[#2776EA] hover:text-[#1f5ec2] hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A97A8]">
              <Icon name="lock" size={15} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your corporate password"
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

        {/* Security Options */}
        <div className="pt-1 space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA]"
            />
            <span className="text-xs text-[#40516A]">Remember this trusted device for 30 days</span>
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={require2FA}
                onChange={(e) => setRequire2FA(e.target.checked)}
                className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA]"
              />
              <span className="text-xs font-semibold text-[#102A43]">
                Require Two-Factor (2FA OTP) Step
              </span>
            </div>
            <Badge value={require2FA ? 'MFA Enforced' : 'Direct Login'} variant={require2FA ? 'success' : 'neutral'} size="sm" />
          </label>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <Icon name="lock" size={14} />
              <span>Sign In to Admin Portal</span>
            </>
          )}
        </button>

        {/* Bypass / Direct Dashboard Preview */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(true);
              showToast('Direct Access Granted', 'Entered administrator dashboard directly in reviewer mode.', 'info');
            }}
            className="text-xs text-[#66758A] hover:text-[#102A43] font-medium transition-colors"
          >
            🚀 Skip Sign In & Go Directly to Dashboard
          </button>
        </div>
      </form>

      {/* Compliance Footer Banner */}
      <div className="p-3 bg-[#EAF2FF]/40 border border-[#c8ddfb]/60 rounded-xl text-[11px] text-[#40516A] space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
          <Icon name="shield" size={13} className="text-[#2776EA]" />
          <span>Security & HIPAA Compliance Protocol</span>
        </div>
        <p className="text-[11px] text-[#66758A] leading-relaxed">
          Access is strictly restricted to authorized healthcare administrators. All login sessions, IP addresses, and data access transactions are subject to immutable cryptographic audit logging under 45 CFR Part 164.
        </p>
      </div>
    </div>
  );
};

export default LoginView;