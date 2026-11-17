import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { showToast, resetToDefaults } = useApp();

  const [activeTab, setActiveTab] = useState<
    'Organization' | 'General' | 'Localization' | 'Financial' | 'Notifications' | 'Security' | 'Profile'
  >('Organization');

  // Form states
  const [orgName, setOrgName] = useState('Nexora Health Corporation');
  const [orgTaxId, setOrgTaxId] = useState('EIN-12-3456789');
  const [orgLicense, setOrgLicense] = useState('NHA-LIC-2021-0098');
  const [orgEmail, setOrgEmail] = useState('admin@nexorahealth.com');
  const [orgPhone, setOrgPhone] = useState('+1 (212) 555-0156');
  const [orgAddress, setOrgAddress] = useState('100 Wall Street, 14th Floor, New York, NY 10005');

  const [claimApprovalLimit, setClaimApprovalLimit] = useState(100000);
  const [claimSLAHours, setClaimSLAHours] = useState(24);
  const [preAuthSLAHours, setPreAuthSLAHours] = useState(2);

  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(true);

  const handleSave = (tabName: string) => {
    showToast('Settings Saved', `${tabName} configuration updated successfully.`, 'success');
  };

  const tabs = [
    { id: 'Organization', label: 'Organization Profile', icon: 'company' },
    { id: 'General', label: 'Operations & SLAs', icon: 'settings' },
    { id: 'Localization', label: 'Regional & Timezone', icon: 'pin' },
    { id: 'Financial', label: 'Currency & Tax', icon: 'finance' },
    { id: 'Notifications', label: 'Notification Channels', icon: 'bell' },
    { id: 'Security', label: 'Security & 2FA', icon: 'lock' },
    { id: 'Profile', label: 'My Admin Profile', icon: 'user' },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Settings & System Configuration"
        description="Configure institutional parameters, SLA policies, banking gateways, statutory tax rates, and security enforcement."
        breadcrumbs={['System', 'Settings']}
        secondaryActions={[
          {
            label: 'Restore Factory Defaults',
            icon: 'refresh',
            onClick: () => {
              resetToDefaults();
              showToast('System Reset', 'Restored platform configuration to initial state.', 'info');
            },
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-3 shadow-xs space-y-1 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                activeTab === t.id
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              <Icon name={t.icon} size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="lg:col-span-3 bg-white border border-[#E5EAF1] rounded-xl p-6 shadow-xs">
          {activeTab === 'Organization' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Organization Profile</h3>
                <p className="text-xs text-[#8A97A8]">
                  Official registered corporate details, regulatory insurance licenses, and contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Company Registered Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Employer Tax ID (EIN)</label>
                  <input
                    type="text"
                    value={orgTaxId}
                    onChange={(e) => setOrgTaxId(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Federal Health License ID</label>
                  <input
                    type="text"
                    value={orgLicense}
                    onChange={(e) => setOrgLicense(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-[#102A43] mb-1">Principal Head Office Address</label>
                  <input
                    type="text"
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Organization Profile')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'General' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Operational SLAs & Automation Thresholds</h3>
                <p className="text-xs text-[#8A97A8]">
                  Define maximum processing time limits and straight-through processing (STP) parameters.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">
                    Auto-Approval Claim Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={claimApprovalLimit}
                    onChange={(e) => setClaimApprovalLimit(Number(e.target.value))}
                    className="w-full max-w-sm border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                  <p className="text-[11px] text-[#8A97A8] mt-1">
                    Claims with verified digital billing under this threshold bypass manual medical scrutiny if no pre-existing conditions are flagged.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Claims Adjudication SLA (Hours)</label>
                  <input
                    type="number"
                    value={claimSLAHours}
                    onChange={(e) => setClaimSLAHours(Number(e.target.value))}
                    className="w-full max-w-sm border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                  <p className="text-[11px] text-[#8A97A8] mt-1">
                    Standard target turnaround time before an open claim is flagged as SLA Breached.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">
                    Pre-Authorization Urgent SLA (Hours)
                  </label>
                  <input
                    type="number"
                    value={preAuthSLAHours}
                    onChange={(e) => setPreAuthSLAHours(Number(e.target.value))}
                    className="w-full max-w-sm border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Operational SLAs')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Save SLA Policies
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Localization' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Regional & Timezone Settings</h3>
                <p className="text-xs text-[#8A97A8]">
                  Formatting conventions, working hours, and United States regional parameters.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Timezone</label>
                  <input
                    type="text"
                    disabled
                    value="Asia/New York (EST UTC-5)"
                    className="w-full bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#66758A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Date Format</label>
                  <select className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]">
                    <option>DD MMM YYYY (e.g. 14 May 2025)</option>
                    <option>YYYY-MM-DD (ISO 8601)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Working Days</label>
                  <select className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]">
                    <option>Monday through Friday (9:00 AM - 6:00 PM PKT)</option>
                    <option>Monday through Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Platform Language</label>
                  <select className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]">
                    <option>English (United States / UK)</option>
                    <option>Spanish (Español)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Localization')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Update Localization
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Financial' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Currency & Taxation Parameters</h3>
                <p className="text-xs text-[#8A97A8]">
                  Currency notation, statutory sales tax rates (State Tax, Regional Tax, Federal Revenue), and withholding taxes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Base Currency</label>
                  <input
                    type="text"
                    disabled
                    value="US Rupee (PKR)"
                    className="w-full bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#66758A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">State Healthcare Surcharge (8.5%)</label>
                  <input
                    type="text"
                    defaultValue="13.0%"
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Regional Medical Excise (6.0%)</label>
                  <input
                    type="text"
                    defaultValue="16.0%"
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Federal Withholding Tax (10.0%)</label>
                  <input
                    type="text"
                    defaultValue="20.0%"
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Financial Parameters')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Save Financial Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Notification Delivery Gateways</h3>
                <p className="text-xs text-[#8A97A8]">
                  Configure telecom SMS bulk gateways and transactional email delivery servers.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#102A43] block">Twilio Enterprise Gateway</span>
                    <span className="text-[11px] text-[#8A97A8]">Shortcode: 8820 • HTTP REST API</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F6EF] text-[#16865B]">
                    Connected
                  </span>
                </div>

                <div className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#102A43] block">Amazon SNS Messaging</span>
                    <span className="text-[11px] text-[#8A97A8]">Backup failover routing</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F6EF] text-[#16865B]">
                    Standby
                  </span>
                </div>

                <div className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#102A43] block">SendGrid Transactional Email</span>
                    <span className="text-[11px] text-[#8A97A8]">DKIM & SPF verified for @nexorahealth.com</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F6EF] text-[#16865B]">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Notification Gateways')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Test & Save Gateways
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">Security & Authentication Standards</h3>
                <p className="text-xs text-[#8A97A8]">
                  Two-factor authentication, inactivity session timeouts, and IP whitelisting.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 border border-[#E5EAF1] rounded-lg">
                  <div>
                    <span className="font-bold text-[#102A43] block">Mandatory Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-[#8A97A8]">
                      Require TOTP authenticator app code for all administrators upon sign-in.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enforceTwoFactor}
                    onChange={(e) => setEnforceTwoFactor(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">
                    Session Inactivity Timeout (Minutes)
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full max-w-sm border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes (Recommended)</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Security Policies')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Enforce Security Rules
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#102A43] text-base">My Administrator Account</h3>
                <p className="text-xs text-[#8A97A8]">
                  Manage personal credentials and active security tokens.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#102A43] text-white flex items-center justify-center font-bold text-base">SJ</div>
                <div>
                  <h4 className="font-bold text-[#102A43] text-sm">Michael Carter</h4>
                  <p className="text-xs text-[#66758A]">Super Administrator • Information Security & Ops</p>
                  <span className="text-[11px] text-[#16865B] font-semibold">ali.hassan@nexorahealth.com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Current Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter at least 12 characters..."
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EAF1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Administrator Profile')}
                  className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white text-xs font-semibold rounded-lg"
                >
                  Update Credentials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SettingsView;
