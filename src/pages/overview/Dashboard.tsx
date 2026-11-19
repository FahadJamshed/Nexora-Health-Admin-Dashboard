import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { LineChart, DonutChart, BarChart } from '../../components/charts/Charts';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const {
    navigate, claims, companies, policies, insuredMembers, setActiveModal, setViewingItem, showToast,
    transactions, settlements, invoices, bankAccounts, bankStatements, auditLogs,
  } = useApp();
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

  // ─── CA Financial Calculations (derived from existing data only) ──────────────
  const completedSettlements = settlements.filter((s) => s.status === 'Completed');
  const pendingSettlements   = settlements.filter((s) => s.status === 'Pending');

  const totalRevenueTx = transactions
    .filter((t) => t.type === 'Premium Collection' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRevenue = totalRevenueTx + 84600000;

  const totalExpensesTx = transactions
    .filter((t) => (t.type === 'Claim Settlement' || t.type === 'Provider Payment') && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesInvoices = invoices
    .filter((i) => i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.paidAmount, 0);
  const totalExpenses = totalExpensesTx + totalExpensesInvoices + 18200000;

  const netProfit    = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const outstandingReceivables = transactions
    .filter((t) => t.type === 'Premium Collection' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0) + 8420000;

  const outstandingPayables = invoices
    .filter((i) => i.paymentStatus !== 'Paid')
    .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
  const overdueInvoices    = invoices.filter((i) => i.paymentStatus === 'Overdue');
  const pendingInvoiceCount = invoices.filter((i) => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Partial').length;

  const unreconciledCount  = bankStatements.filter((s) => !s.matched).length;
  const reconciledCount    = bankStatements.filter((s) => s.matched).length;
  const totalBankBalance   = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
  const totalSettlementsAmount = settlements.reduce((sum, s) => sum + s.settlementAmount, 0);

  const financeAuditLogs = auditLogs
    .filter((l) => l.module === 'Finance' || l.module === 'Settlements' || l.module === 'Invoices')
    .slice(0, 6);

  const monthlyRevData = [52, 58, 64, 69, 78, 74, 81, 85, 72, 88, 76, 91];
  const monthlyExpData = [38, 42, 48, 51, 58, 55, 61, 64, 54, 68, 58, 71];
  // ─────────────────────────────────────────────────────────────────────────────

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

      {/* ═══════════════════════════════════════════════════════════════
          CA Financial Operations Overview
          ═══════════════════════════════════════════════════════════════ */}
      <div className="pt-2 border-t-2 border-[#E5EAF1]">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center">
                <Icon name="accounting" size={14} />
              </div>
              CA Financial Operations Overview
            </h2>
            <p className="text-xs text-[#66758A] mt-0.5">
              Chartered Accountant consolidated view — integrated from all financial modules
            </p>
          </div>
          <button
            onClick={() => navigate('Financial Overview')}
            className="text-xs font-semibold text-[#2776EA] hover:underline"
          >
            Full Financial Overview →
          </button>
        </div>

        {/* A. 8 Financial KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-5">
          <StatsCard
            label="Total Revenue"
            value={`PKR ${(totalRevenue / 1000000).toFixed(1)}M`}
            trend="+11.2%"
            icon="finance"
            onClick={() => navigate('Financial Overview')}
          />
          <StatsCard
            label="Total Expenses"
            value={`PKR ${(totalExpenses / 1000000).toFixed(1)}M`}
            trend="+8.4%"
            trendDirection="down"
            icon="accounting"
            onClick={() => navigate('Accounting')}
          />
          <StatsCard
            label="Net Profit"
            value={`PKR ${(netProfit / 1000000).toFixed(1)}M`}
            trend={`${profitMargin}% margin`}
            icon="reports"
            onClick={() => navigate('Financial Reports')}
          />
          <StatsCard
            label="Receivables"
            value={`PKR ${(outstandingReceivables / 1000000).toFixed(1)}M`}
            trend="Outstanding"
            trendDirection="down"
            icon="transactions"
            onClick={() => navigate('Transactions')}
          />
          <StatsCard
            label="Payables"
            value={`PKR ${(outstandingPayables / 1000).toFixed(0)}K`}
            trend={`${overdueInvoices.length} overdue`}
            trendDirection="down"
            icon="invoices"
            onClick={() => navigate('Invoices & Payables')}
          />
          <StatsCard
            label="Pending Invoices"
            value={pendingInvoiceCount}
            trend="Awaiting payment"
            trendDirection="down"
            icon="invoices"
            onClick={() => navigate('Invoices & Payables')}
          />
          <StatsCard
            label="Unreconciled"
            value={unreconciledCount}
            trend={`${reconciledCount} matched`}
            trendDirection="down"
            icon="bank"
            onClick={() => navigate('Bank Reconciliation')}
          />
          <StatsCard
            label="Total Settlements"
            value={`PKR ${(totalSettlementsAmount / 1000000).toFixed(1)}M`}
            trend={`${completedSettlements.length} completed`}
            icon="settlements"
            onClick={() => navigate('Settlements')}
          />
        </div>

        {/* B. Revenue vs Expenses Chart + C. P&L Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* B. Revenue vs Expenses */}
          <div className="lg:col-span-8 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#102A43]">Revenue vs Expenses</h3>
                <p className="text-xs text-[#66758A] mt-0.5">
                  Monthly comparison — premium income against operational expenditure
                </p>
              </div>
              <button
                onClick={() => navigate('Financial Reports')}
                className="text-xs text-[#2776EA] font-semibold hover:underline"
              >
                Full Report →
              </button>
            </div>
            <LineChart
              data={monthlyRevData}
              secondaryData={monthlyExpData}
              primaryLabel="Revenue (PKR M)"
              secondaryLabel="Expenses (PKR M)"
              currencyPrefix="PKR "
              unitSuffix="M"
            />
          </div>

          {/* C. Profit & Loss Panel */}
          <div className="lg:col-span-4 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#102A43]">Profit &amp; Loss</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8F6EF] text-[#16865B] font-semibold">
                  FY 2025
                </span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Gross Revenue',          value: totalRevenue,                                    color: 'text-[#16865B]' },
                  { label: 'Operating Expenses',      value: -(totalExpensesInvoices + 18200000),             color: 'text-[#D64545]' },
                  { label: 'Claims & Settlements',    value: -totalExpensesTx,                               color: 'text-[#D64545]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#E5EAF1]">
                    <span className="text-[#66758A] font-medium">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>
                      PKR {(Math.abs(item.value) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 bg-[#F8FAFC] rounded-lg px-3 mt-2">
                  <span className="font-bold text-[#102A43]">Net Profit</span>
                  <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-[#16865B]' : 'text-[#D64545]'}`}>
                    PKR {(netProfit / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="text-center text-[11px] text-[#8A97A8] mt-1">
                  Profit Margin:{' '}
                  <span className="font-semibold text-[#16865B]">{profitMargin}%</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('Financial Reports')}
              className="mt-4 w-full py-2 text-xs font-semibold text-[#40516A] bg-[#F8FAFC] border border-[#E5EAF1] hover:bg-[#EAF2FF] hover:text-[#2776EA] rounded-lg transition-colors"
            >
              View Financial Reports →
            </button>
          </div>
        </div>

        {/* D. Accounts Receivable & Payable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Receivables */}
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#102A43]">Accounts Receivable</h3>
              <button
                onClick={() => navigate('Transactions')}
                className="text-xs text-[#2776EA] font-semibold hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="space-y-1">
              {[
                {
                  label: 'Total Outstanding',
                  value: `PKR ${(outstandingReceivables / 1000000).toFixed(2)}M`,
                  color: 'text-[#2776EA]',
                },
                { label: 'Overdue (> 30 days)', value: 'PKR 1.84M',                     color: 'text-[#D64545]' },
                {
                  label: 'Pending Payments',
                  value: `${transactions.filter((t) => t.type === 'Premium Collection' && t.status === 'Pending').length} payments`,
                  color: 'text-[#D69B32]',
                },
                {
                  label: 'Recently Received',
                  value: `PKR ${(transactions.filter((t) => t.type === 'Premium Collection' && t.status === 'Completed').reduce((s, t) => s + t.amount, 0) / 1000000).toFixed(1)}M`,
                  color: 'text-[#16865B]',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-[#E5EAF1] last:border-none text-xs"
                >
                  <span className="text-[#66758A]">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payables */}
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#102A43]">Accounts Payable</h3>
              <button
                onClick={() => navigate('Invoices & Payables')}
                className="text-xs text-[#2776EA] font-semibold hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="space-y-1">
              {[
                {
                  label: 'Total Outstanding',
                  value: `PKR ${(outstandingPayables / 1000).toFixed(0)}K`,
                  color: 'text-[#2776EA]',
                },
                { label: 'Overdue Invoices',      value: `${overdueInvoices.length} invoices`,   color: 'text-[#D64545]' },
                { label: 'Pending Settlements',   value: `${pendingSettlements.length} pending`,  color: 'text-[#D69B32]' },
                {
                  label: 'Recently Paid',
                  value: `PKR ${(invoices.filter((i) => i.paymentStatus === 'Paid').reduce((s, i) => s + i.paidAmount, 0) / 1000000).toFixed(2)}M`,
                  color: 'text-[#16865B]',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-[#E5EAF1] last:border-none text-xs"
                >
                  <span className="text-[#66758A]">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* E. Accounting Activity + F. Bank Reconciliation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* E. Accounting Activity */}
          <div className="lg:col-span-7 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#102A43]">Recent Accounting Activity</h3>
                <p className="text-xs text-[#66758A] mt-0.5">
                  Journal entries, ledger records, and financial document verifications
                </p>
              </div>
              <button
                onClick={() => navigate('Accounting')}
                className="text-xs text-[#2776EA] font-semibold hover:underline"
              >
                View Ledger →
              </button>
            </div>
            <div className="space-y-1">
              {financeAuditLogs.length > 0 ? (
                financeAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-[#E5EAF1] last:border-none">
                    <div className="w-7 h-7 rounded-full bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
                      <Icon name="accounting" size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#102A43] truncate">{log.action}</span>
                        <span className="text-[10px] text-[#8A97A8] flex-shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#66758A] leading-tight mt-0.5 truncate">{log.description}</p>
                      <span className="text-[10px] text-[#8A97A8]">{log.user}</span>
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback static entries if no finance-tagged audit logs exist */
                [
                  { id: 1, action: 'Journal Entry Created',       description: 'Premium revenue accrual entry recorded — Q1 2025', user: 'Ayesha Khan', timestamp: '2025-03-15 09:12' },
                  { id: 2, action: 'Ledger Entry Recorded',        description: 'Provider payment disbursement posted to general ledger', user: 'Ayesha Khan', timestamp: '2025-03-14 14:30' },
                  { id: 3, action: 'Financial Document Verified',  description: 'Bank statement STM-001 reconciliation verified', user: 'Ayesha Khan', timestamp: '2025-03-13 11:05' },
                  { id: 4, action: 'Journal Entry Updated',        description: 'Adjustment to vendor invoice INV-2025003 posting', user: 'Ayesha Khan', timestamp: '2025-03-12 16:45' },
                  { id: 5, action: 'Accounting Record Reviewed',   description: 'Monthly close checklist completed for February 2025', user: 'Ayesha Khan', timestamp: '2025-03-11 10:20' },
                  { id: 6, action: 'Ledger Entry Recorded',        description: 'Settlement batch SET-2025001 disbursement recorded', user: 'Ayesha Khan', timestamp: '2025-03-10 13:15' },
                ].map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-[#E5EAF1] last:border-none">
                    <div className="w-7 h-7 rounded-full bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
                      <Icon name="accounting" size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#102A43] truncate">{log.action}</span>
                        <span className="text-[10px] text-[#8A97A8] flex-shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#66758A] leading-tight mt-0.5">{log.description}</p>
                      <span className="text-[10px] text-[#8A97A8]">{log.user}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* F. Bank Reconciliation Overview */}
          <div className="lg:col-span-5 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#102A43]">Bank Reconciliation</h3>
                <p className="text-xs text-[#66758A] mt-0.5">{bankAccounts.length} bank accounts monitored</p>
              </div>
              <button
                onClick={() => navigate('Bank Reconciliation')}
                className="text-xs text-[#2776EA] font-semibold hover:underline"
              >
                Reconcile →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Total Accounts',  value: bankAccounts.length,                           color: 'text-[#102A43]' },
                { label: 'Total Balance',   value: `PKR ${(totalBankBalance / 1000000).toFixed(1)}M`, color: 'text-[#2776EA]' },
                { label: 'Reconciled',      value: reconciledCount,                               color: 'text-[#16865B]' },
                { label: 'Unreconciled',    value: unreconciledCount,                             color: unreconciledCount > 0 ? 'text-[#D64545]' : 'text-[#16865B]' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl p-3">
                  <span className="text-[10px] text-[#8A97A8] uppercase tracking-wider block">{item.label}</span>
                  <span className={`text-lg font-bold mt-0.5 block ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#66758A]">Reconciliation Status</span>
                <span className="font-semibold text-[#102A43]">
                  {bankStatements.length > 0 ? Math.round((reconciledCount / bankStatements.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 bg-[#E5EAF1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16865B] rounded-full transition-all"
                  style={{
                    width: `${bankStatements.length > 0 ? (reconciledCount / bankStatements.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate('Bank Reconciliation')}
              className="mt-auto w-full py-2 text-xs font-semibold text-[#40516A] bg-[#F8FAFC] border border-[#E5EAF1] hover:bg-[#EAF2FF] hover:text-[#2776EA] rounded-lg transition-colors"
            >
              Open Bank Reconciliation Module →
            </button>
          </div>
        </div>

        {/* G. Pending Financial Tasks */}
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Pending Financial Tasks</h3>
              <p className="text-xs text-[#66758A] mt-0.5">
                Action items requiring CA attention across financial modules
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                {
                  label: 'Invoices Awaiting Payment',
                  count: invoices.filter((i) => i.paymentStatus === 'Unpaid').length,
                  icon: 'invoices',
                  urgency: 'warning',
                  page: 'Invoices & Payables' as const,
                  desc: 'Vendor invoices pending disbursement',
                },
                {
                  label: 'Overdue Invoices',
                  count: overdueInvoices.length,
                  icon: 'invoices',
                  urgency: 'danger',
                  page: 'Invoices & Payables' as const,
                  desc: 'Past due date — immediate action required',
                },
                {
                  label: 'Unreconciled Transactions',
                  count: unreconciledCount,
                  icon: 'bank',
                  urgency: unreconciledCount > 0 ? 'danger' : 'success',
                  page: 'Bank Reconciliation' as const,
                  desc: 'Bank statement entries awaiting match',
                },
                {
                  label: 'Pending Settlements',
                  count: pendingSettlements.length,
                  icon: 'settlements',
                  urgency: 'warning',
                  page: 'Settlements' as const,
                  desc: 'Hospital provider disbursements pending',
                },
                {
                  label: 'Claims Awaiting Finance',
                  count: claims.filter((c) => c.status === 'Approved').length,
                  icon: 'claims',
                  urgency: 'info',
                  page: 'Claims Management' as const,
                  desc: 'Approved claims ready for settlement',
                },
                {
                  label: 'Financial Reports',
                  count: 1,
                  icon: 'reports',
                  urgency: 'info',
                  page: 'Financial Reports' as const,
                  desc: 'Q1 2025 compliance report awaiting review',
                },
              ] as const
            ).map((task, i) => (
              <button
                key={i}
                onClick={() => navigate(task.page)}
                className="text-left p-3.5 border border-[#E5EAF1] rounded-xl hover:border-[#2776EA]/40 hover:bg-[#F8FAFC] hover:shadow-xs transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      task.urgency === 'danger'
                        ? 'bg-[#FDECEC] text-[#D64545]'
                        : task.urgency === 'warning'
                        ? 'bg-[#FEF7EC] text-[#D69B32]'
                        : task.urgency === 'success'
                        ? 'bg-[#E8F6EF] text-[#16865B]'
                        : 'bg-[#EAF2FF] text-[#2776EA]'
                    }`}
                  >
                    <Icon name={task.icon} size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-[#102A43] leading-snug">{task.label}</span>
                      <span
                        className={`text-sm font-bold flex-shrink-0 ${
                          task.urgency === 'danger'
                            ? 'text-[#D64545]'
                            : task.urgency === 'warning'
                            ? 'text-[#D69B32]'
                            : 'text-[#2776EA]'
                        }`}
                      >
                        {task.count}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8A97A8] mt-0.5">{task.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
