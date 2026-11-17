import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { LineChart, DonutChart, BarChart } from '../../components/charts/Charts';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const { navigate, claims, companies, policies, insuredMembers, setActiveModal, setViewingItem, showToast } =
    useApp();
  const [addNewOpen, setAddNewOpen] = useState(false);

  const kpis = [
    { label: 'Total Companies', value: '248', trend: '+12.5%', icon: 'company', page: 'All Companies' },
    { label: 'Active Policies', value: '12,840', trend: '+8.2%', icon: 'policies', page: 'Policies' },
    { label: 'Insured Members', value: '48,520', trend: '+14.8%', icon: 'users', page: 'Insured Members' },
    { label: 'Total Claims', value: '3,284', trend: '+6.4%', icon: 'claims', page: 'Claims Management' },
    { label: 'Premium Collected', value: 'PKR 84.6M', trend: '+11.2%', icon: 'finance', page: 'Financial Overview' },
    {
      label: 'Pending Settlements',
      value: 'PKR 12.8M',
      trend: '-4.3%',
      trendDirection: 'down' as const,
      icon: 'settlements',
      page: 'Settlements',
    },
  ];

  const recentClaims = claims.slice(0, 8);

  const recentActivities = [
    {
      title: 'New corporate client registered',
      desc: 'Acme Corporation joined Nexora Health with 2,840 covered employees',
      time: '8 min ago',
      icon: 'corporate',
    },
    {
      title: 'Major cardiac claim approved',
      desc: 'CLM-2025001 (Metropolitan Medical Center) approved for PKR 450,000',
      time: '32 min ago',
      icon: 'claims',
    },
    {
      title: 'Settlement disbursed',
      desc: 'SET-2025001 paid PKR 450,000 to Metropolitan Medical Center via Chase Fedwire',
      time: '1 hr ago',
      icon: 'settlements',
    },
    {
      title: 'New policy activated',
      desc: 'POL-2025015 for Audrey Morris under Standard Care Plus',
      time: '3 hr ago',
      icon: 'policies',
    },
    {
      title: 'Member profile updated',
      desc: 'Dependent coverage verified for Alexander Wright family pool',
      time: '5 hr ago',
      icon: 'user',
    },
  ];

  const quickActions = [
    { label: 'Add Company', icon: 'company', action: () => setActiveModal('addCompany') },
    { label: 'Add Hospital', icon: 'hospital', action: () => setActiveModal('addHospital') },
    { label: 'Register Member', icon: 'users', action: () => setActiveModal('addMember') },
    { label: 'Create Plan', icon: 'plans', action: () => setActiveModal('addPlan') },
    { label: 'Create Policy', icon: 'policies', action: () => setActiveModal('addPolicy') },
    { label: 'Review Claims', icon: 'claims', action: () => navigate('Claims Management') },
    { label: 'Generate Report', icon: 'reports', action: () => navigate('Financial Reports') },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="relative">
        <PageHeader
          title="Dashboard"
          description="Monitor your healthcare insurance operations, financial performance, and organizational activity."
          breadcrumbs={['Overview', 'Dashboard']}
          secondaryActions={[
            {
              label: 'Add New Record ▾',
              icon: 'plus',
              onClick: () => setAddNewOpen(!addNewOpen),
            },
          ]}
          primaryAction={{
            label: 'Review Claims',
            icon: 'claims',
            onClick: () => navigate('Claims Management'),
          }}
        />

        {/* Add New Dropdown Menu */}
        {addNewOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setAddNewOpen(false)} />
            <div className="absolute right-0 top-16 w-56 bg-white rounded-xl shadow-xl border border-[#E5EAF1] py-1.5 z-30 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addCompany');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="company" size={14} />
                Add Company
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addCorporateClient');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="corporate" size={14} />
                Add Corporate Client
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addInsuranceCompany');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="insurance" size={14} />
                Add Insurance Carrier
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addHospital');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="hospital" size={14} />
                Add Hospital / Clinic
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addMember');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="member" size={14} />
                Register Member
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addCustomer');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="customer" size={14} />
                Add Customer Account
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addPolicy');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="policies" size={14} />
                Create Policy
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('addPlan');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="plans" size={14} />
                Create Insurance Plan
              </button>
              <button
                onClick={() => {
                  setAddNewOpen(false);
                  setActiveModal('createSettlement');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Icon name="settlements" size={14} />
                Generate Settlement Batch
              </button>
            </div>
          </>
        )}
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <StatsCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
            icon={kpi.icon}
            onClick={() => navigate(kpi.page as any)}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Premium Collection Line/Area Chart */}
        <div className="lg:col-span-7 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Premium Collection Overview</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Monthly premium collections across all corporate & individual plans</p>
            </div>
            <button
              onClick={() => showToast('Filter Applied', 'Viewing monthly FY25 premium inflow comparison.', 'info')}
              className="text-xs text-[#2776EA] font-semibold hover:underline"
            >
              FY 2025
            </button>
          </div>
          <LineChart
            data={[42, 48, 44, 57, 54, 66, 63, 72, 69, 78, 76, 86]}
            secondaryData={[36, 40, 39, 45, 48, 52, 54, 58, 61, 65, 68, 71]}
            primaryLabel="FY 2025 (Current)"
            secondaryLabel="FY 2024 (Previous)"
          />
        </div>

        {/* Right: Claims Status Donut Chart */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Claims Adjudication Overview</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Distribution across 3,284 claims processed</p>
            </div>
            <button
              onClick={() => navigate('Claims Management')}
              className="text-xs text-[#2776EA] font-semibold hover:underline"
            >
              Details →
            </button>
          </div>
          <DonutChart
            segments={[
              { label: 'Approved', value: 1842, color: '#2776EA', countStr: '1,842' },
              { label: 'Pending', value: 684, color: '#D69B32', countStr: '684' },
              { label: 'Under Review', value: 492, color: '#66758A', countStr: '492' },
              { label: 'Rejected', value: 266, color: '#D64545', countStr: '266' },
            ]}
            centerValue="3,284"
            centerLabel="Total Claims"
          />
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Policy Distribution */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Active Policy Distribution</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Enrolled policyholders categorized by coverage plan type</p>
            </div>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-2 py-0.5 rounded">
              12,840 Total
            </span>
          </div>
          <BarChart
            items={[
              { label: 'Corporate Group Health', count: 5162, formattedCount: '5,162 policies (78%)', percentage: 78, color: '#2776EA' },
              { label: 'Individual Health Plans', count: 3984, formattedCount: '3,984 policies (62%)', percentage: 62, color: '#16865B' },
              { label: 'Family Floater Cover', count: 2448, formattedCount: '2,448 policies (49%)', percentage: 49, color: '#D69B32' },
              { label: 'Group & Mutual Health Pools', count: 1246, formattedCount: '1,246 policies (32%)', percentage: 32, color: '#5664D2' },
            ]}
          />
        </div>

        {/* Member Registration Growth */}
        <div className="lg:col-span-7 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Member Registration Growth</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Monthly trajectory of newly enrolled covered lives</p>
            </div>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-2 py-0.5 rounded">
              +14.8% Monthly Growth
            </span>
          </div>
          <LineChart
            data={[2200, 2600, 3100, 3400, 3900, 4200, 4500, 4800, 5200, 5600, 6100, 6800]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            currencyPrefix=""
            unitSuffix=" Members"
            primaryLabel="New Registrations"
          />
        </div>
      </div>

      {/* Quick Operational Actions Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Quick Actions</h2>
          <span className="text-xs text-[#8A97A8]">Click any action to open workflow</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              onClick={qa.action}
              className="bg-white border border-[#E5EAF1] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-[#2776EA]/50 hover:bg-[#F8FAFC] hover:shadow-xs transition-all text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center group-hover:bg-[#2776EA] group-hover:text-white transition-colors">
                <Icon name={qa.icon} size={16} />
              </div>
              <span className="text-xs font-medium text-[#172B4D] group-hover:text-[#2776EA] transition-colors">
                {qa.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lower Dashboard Section: Recent Claims & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Claims Table */}
        <div className="lg:col-span-8 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Recent Healthcare Claims</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Latest claims requiring medical adjudication or settlement</p>
            </div>
            <button
              onClick={() => navigate('Claims Management')}
              className="text-xs font-semibold text-[#2776EA] hover:underline flex items-center gap-1"
            >
              View all claims →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#66758A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Claim ID</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Hospital</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF1]">
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#2776EA]">{claim.claimNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-[#102A43]">{claim.memberName}</td>
                    <td className="py-2.5 px-3 text-[#66758A] max-w-[150px] truncate">{claim.hospitalName}</td>
                    <td className="py-2.5 px-3 text-[#66758A]">{claim.claimType}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#102A43]">
                      PKR {claim.submittedAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-[#8A97A8]">{claim.submissionDate}</td>
                    <td className="py-2.5 px-3">
                      <Badge value={claim.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          navigate('Claims Management');
                          setViewingItem({ type: 'Claim', item: claim });
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-[#2776EA] hover:bg-[#EAF2FF] rounded transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Operational Activity Timeline */}
        <div className="lg:col-span-4 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#102A43]">Recent Platform Events</h3>
                <p className="text-xs text-[#66758A] mt-0.5">Live operational audit log</p>
              </div>
              <button
                onClick={() => navigate('Audit Logs')}
                className="text-xs font-semibold text-[#2776EA] hover:underline"
              >
                Audit →
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {i < recentActivities.length - 1 && (
                    <span className="absolute left-3.5 top-7 bottom-0 w-[1px] bg-[#E5EAF1]" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0 z-10 shadow-xs border border-white">
                    <Icon name={act.icon} size={13} />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <h5 className="text-xs font-semibold text-[#102A43] leading-snug">{act.title}</h5>
                    <p className="text-[11px] text-[#66758A] leading-tight mt-0.5">{act.desc}</p>
                    <span className="text-[10px] text-[#8A97A8] mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5EAF1] mt-4">
            <button
              onClick={() => navigate('Audit Logs')}
              className="w-full py-2 text-xs font-semibold text-[#40516A] bg-[#F8FAFC] border border-[#E5EAF1] hover:bg-[#EAF2FF] hover:text-[#2776EA] rounded-lg transition-colors text-center"
            >
              View complete activity audit trail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
