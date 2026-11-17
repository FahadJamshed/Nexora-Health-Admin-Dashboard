import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { LineChart, BarChart } from '../../components/charts/Charts';
import { useApp } from '../../context/AppContext';

export const Analytics: React.FC = () => {
  const { showToast, insuranceCompanies, corporateClients } = useApp();
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');

  const handleApplyFilters = () => {
    showToast('Analytics Refreshed', `Filters applied: Provider (${selectedProvider}), Client (${selectedClient})`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Analytics & Reports"
        description="Comprehensive healthcare insurance analytics, provider network performance, and claims adjudication metrics."
        breadcrumbs={['Overview', 'Analytics & Reports']}
      />

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div>
            <span className="text-[10px] font-bold text-[#8A97A8] uppercase tracking-wider block">Reporting Period</span>
            <span className="text-xs font-semibold text-[#102A43]">01 Jan 2025 – 31 May 2025 (YTD)</span>
          </div>

          <div className="h-6 w-[1px] bg-[#E5EAF1] hidden sm:block" />

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#66758A] font-medium whitespace-nowrap">Insurance Provider:</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="py-1 px-2.5 text-xs border border-[#E5EAF1] rounded-lg bg-white text-[#40516A] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20"
            >
              <option value="All">All Insurance Providers (6)</option>
              {insuranceCompanies.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#66758A] font-medium whitespace-nowrap">Corporate Client:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="py-1 px-2.5 text-xs border border-[#E5EAF1] rounded-lg bg-white text-[#40516A] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20"
            >
              <option value="All">All Corporate Clients (8)</option>
              {corporateClients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] transition-colors shadow-xs"
        >
          Apply Filters
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Gross Written Premium" value="PKR 84.6M" trend="+11.2%" icon="finance" />
        <StatsCard label="Total Incurred Claims" value="PKR 51.2M" trend="+4.8%" icon="claims" />
        <StatsCard label="Average Adjudication SLA" value="3.8 Days" trend="-1.2 Days" icon="clock" />
        <StatsCard label="Claims Approval Rate" value="84.2%" trend="+3.8%" icon="shield" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Organization Growth */}
        <div className="lg:col-span-7 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Organizational Expansion Trajectory</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Growth of partner hospital networks and corporate employers</p>
            </div>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-2 py-0.5 rounded">
              +18 Organizations
            </span>
          </div>
          <LineChart
            data={[120, 135, 148, 162, 178, 195, 208, 218, 226, 235, 241, 248]}
            labels={['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']}
            currencyPrefix=""
            unitSuffix=" Cos"
            primaryLabel="Total Registered Entities"
          />
        </div>

        {/* Right: Circular Approval Rate */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#102A43]">Claims Adjudication Efficiency</h3>
            <p className="text-xs text-[#66758A] mt-0.5">Average across all 6 licensed underwriting partners</p>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative w-36 h-36 rounded-full border-[14px] border-[#EAF2FF] border-t-[#2776EA] border-r-[#2776EA] flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl font-bold text-[#102A43]">84.2%</span>
              <span className="text-[10px] text-[#8A97A8] uppercase tracking-wider font-semibold mt-0.5">Approval Rate</span>
            </div>
            <p className="text-xs text-[#66758A] mt-4 font-medium">
              <span className="text-[#16865B] font-bold">+3.8%</span> improvement from previous quarter
            </p>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EAF1] text-xs text-[#66758A] flex justify-between">
            <span>Average turnaround time:</span>
            <span className="font-semibold text-[#102A43]">4.2 Business Days</span>
          </div>
        </div>
      </div>

      {/* Provider Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Insurance Provider Performance Score</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Composite score based on speed, approval ratio, and cashless network</p>
            </div>
          </div>
          <BarChart
            items={[
              { label: 'Apex Health Insurance', count: 94, formattedCount: '94% SLA score', percentage: 94, color: '#2776EA' },
              { label: 'Guardian Mutual Healthcare', count: 88, formattedCount: '88% SLA score', percentage: 88, color: '#16865B' },
              { label: 'Beacon Life & Health', count: 82, formattedCount: '82% SLA score', percentage: 82, color: '#5664D2' },
              { label: 'Vanguard Health Assurance', count: 76, formattedCount: '76% SLA score', percentage: 76, color: '#D69B32' },
            ]}
          />
        </div>

        <div className="lg:col-span-6 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">Financial Performance Overview</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Monthly premium collections vs. claims payout expenditure</p>
            </div>
            <span className="text-xs text-[#2776EA] font-semibold bg-[#EAF2FF] px-2 py-0.5 rounded">
              Loss Ratio: 60.5%
            </span>
          </div>
          <LineChart
            data={[42, 48, 44, 57, 54, 66, 63, 72, 69, 78, 76, 86]}
            secondaryData={[25, 29, 28, 34, 32, 38, 37, 42, 40, 46, 45, 51]}
            labels={['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']}
            primaryLabel="Premium Collected"
            secondaryLabel="Claims Paid"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
