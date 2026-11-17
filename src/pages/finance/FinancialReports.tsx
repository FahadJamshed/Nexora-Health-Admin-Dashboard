import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { LineChart } from '../../components/charts/Charts';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

interface ReportRow {
  entity: string;
  category: string;
  premium: number;
  claimsPaid: number;
  lossRatio: number;
  margin: number;
}

export const FinancialReports: React.FC = () => {
  const { showToast } = useApp();
  const [activeReport, setActiveReport] = useState<'Premiums' | 'Claims' | 'P&L' | 'Corporate'>('Premiums');
  const [dateRange, setDateRange] = useState('YTD 2025');
  const [selectedReportRow, setSelectedReportRow] = useState<ReportRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'params' | 'dimensions'>('params');

  // Custom report form state
  const [reportTitle, setReportTitle] = useState('Statutory Underwriting & Claims Solvency Statement');
  const [reportFormat, setReportFormat] = useState('PDF + CSV (Executive Board Pack)');
  const [includeProjections, setIncludeProjections] = useState(true);
  const [accountingStandard, setAccountingStandard] = useState('IFRS 17 / National Healthcare Framework');

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Actuarial Report Generated',
      `Compiled "${reportTitle}" covering period ${dateRange} in ${reportFormat}.`,
      'success'
    );
    setIsReportModalOpen(false);
  };

  const reportData: ReportRow[] = [
    { entity: 'Acme Corporation', category: 'Corporate Group Health', premium: 18500000, claimsPaid: 7200000, lossRatio: 38.9, margin: 61.1 },
    { entity: 'Nexus Technologies', category: 'Corporate Group Health', premium: 24200000, claimsPaid: 11400000, lossRatio: 47.1, margin: 52.9 },
    { entity: 'Global Logistics Partners', category: 'Corporate Group Health', premium: 16800000, claimsPaid: 9100000, lossRatio: 54.1, margin: 45.9 },
    { entity: 'Summit Financial Group', category: 'Corporate Group Health', premium: 14500000, claimsPaid: 6800000, lossRatio: 46.8, margin: 53.2 },
    { entity: 'Retail Family Health Plans', category: 'Individual / Retail', premium: 10600000, claimsPaid: 5200000, lossRatio: 49.0, margin: 51.0 },
    { entity: 'Senior Citizen Comprehensive', category: 'Specialized Coverage', premium: 5800000, claimsPaid: 3900000, lossRatio: 67.2, margin: 32.8 },
  ];

  const chartTrend = [
    { label: 'Jan', value: 48 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 62 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 79 },
    { label: 'Jun', value: 84 },
  ];

  const columns: Column<ReportRow>[] = [
    {
      key: 'entity',
      header: 'Client / Portfolio Segment',
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{r.entity}</span>
          <span className="text-[11px] text-[#8A97A8]">{r.category}</span>
        </div>
      ),
    },
    {
      key: 'premium',
      header: 'Gross Premium (PKR)',
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-[#102A43]">
          PKR {r.premium.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'claimsPaid',
      header: 'Claims Incurred (PKR)',
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-[#D64545]">
          PKR {r.claimsPaid.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'lossRatio',
      header: 'Loss Ratio %',
      sortable: true,
      render: (r) => (
        <span
          className={`font-bold px-2 py-0.5 rounded text-xs ${
            r.lossRatio < 50
              ? 'bg-[#E8F6EF] text-[#16865B]'
              : r.lossRatio < 65
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : 'bg-[#FDECEC] text-[#D64545]'
          }`}
        >
          {r.lossRatio.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'margin',
      header: 'Gross Margin %',
      sortable: true,
      render: (r) => (
        <span className="font-bold text-[#102A43]">
          {r.margin.toFixed(1)}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Financial Reports"
        description="Statutory actuarial reporting, loss ratio distributions, underwriter remittances, and profitability analytics."
        breadcrumbs={['Financial Management', 'Financial Reports']}
        primaryAction={{
          label: 'Generate Actuarial Report',
          icon: 'plus',
          onClick: () => setIsReportModalOpen(true),
        }}
        secondaryActions={[
          {
            label: 'Export Statement (PDF)',
            icon: 'export',
            onClick: () => showToast('Exporting Report', 'Generating national statutory financial statement.', 'info'),
          },
          {
            label: 'Schedule Automated Email',
            icon: 'calendar',
            onClick: () => showToast('Schedule Set', 'Report scheduled for 1st of every month.', 'success'),
          },
        ]}
      />

      {/* Report Category Selector & Date Range */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['Premiums', 'Claims', 'P&L', 'Corporate'] as const).map((rep) => (
            <button
              key={rep}
              onClick={() => setActiveReport(rep)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeReport === rep
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {rep === 'Premiums'
                ? 'Premium Collections'
                : rep === 'Claims'
                ? 'Claims & Loss Ratio'
                : rep === 'P&L'
                ? 'Income Statement (P&L)'
                : 'Corporate Client Accounts'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="YTD 2025">YTD 2025 (Jan - May)</option>
            <option value="Q1 2025">Q1 2025</option>
            <option value="FY 2024">FY 2024</option>
          </select>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-[#102A43] text-sm">
              {activeReport === 'Premiums'
                ? 'Gross Written Premium Growth (PKR Millions)'
                : activeReport === 'Claims'
                ? 'Claims Incurred vs Approved Budget'
                : 'Net Operating Surplus Progression'}
            </h3>
            <p className="text-xs text-[#8A97A8]">Monthly audited progression for selected period</p>
          </div>
          <span className="text-xs font-semibold text-[#2776EA] bg-[#EAF2FF] px-2.5 py-1 rounded-full">
            PKR 90.4M Aggregate
          </span>
        </div>
        <div className="h-60 flex items-end justify-center">
          <LineChart data={chartTrend} color="#2776EA" fillArea height={220} />
        </div>
      </div>

      {/* Breakdown Data Table */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#102A43] text-sm">Account Portfolio Breakdown</h3>
            <p className="text-xs text-[#8A97A8]">Individual underwriting performance & loss ratio tolerance</p>
          </div>
        </div>

        <DataTable
          data={reportData}
          columns={columns}
          searchPlaceholder="Search portfolio segments..."
          searchKey="entity"
          onRowClick={(row) => {
            setSelectedReportRow(row);
            setIsDrawerOpen(true);
          }}
          actions={[
            {
              label: 'View Actuarial Breakdown',
              icon: 'eye',
              onClick: (row) => {
                setSelectedReportRow(row);
                setIsDrawerOpen(true);
              },
            },
            {
              label: 'Export Segment Ledger',
              icon: 'download',
              onClick: (row) => {
                showToast('Exported', `Underwriting ledger for ${row.entity} exported in CSV.`);
              },
            },
            {
              label: 'Recalculate Loss Ratio',
              icon: 'refresh',
              onClick: (row) => {
                showToast('Recalculated', `Actuarial loss ratio for ${row.entity} updated to ${row.lossRatio}%`);
              },
            },
          ]}
        />
      </div>

      {/* Report Row Detail Drawer */}
      {selectedReportRow && (
        <DetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedReportRow.entity}
          subtitle={`${selectedReportRow.category} · Loss Ratio: ${selectedReportRow.lossRatio}%`}
          badge={
            <Badge
              value={selectedReportRow.lossRatio < 50 ? 'Profitable' : 'Loss Alert'}
              variant={selectedReportRow.lossRatio < 50 ? 'success' : 'warning'}
            />
          }
          tabs={['Actuarial Analysis', 'Claims & Loss Margin', 'Reinsurance Treaty Allocation']}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Close Drawer
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Export Started', `Downloading actuarial report for ${selectedReportRow.entity}.`);
                  setIsDrawerOpen(false);
                }}
                className="px-4 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1E65CF]"
              >
                Download Actuarial PDF
              </button>
            </div>
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Actuarial Analysis' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Portfolio Client</span>
                      <span className="font-semibold text-[#102A43] text-sm">{selectedReportRow.entity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Coverage Line</span>
                      <span className="font-medium text-[#2776EA]">{selectedReportRow.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Gross Written Premium</span>
                      <span className="font-bold text-[#16865B] text-sm">
                        PKR {selectedReportRow.premium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Incurred Claims (Paid)</span>
                      <span className="font-bold text-[#D64545] text-sm">
                        PKR {selectedReportRow.claimsPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Actuarial Loss Ratio Distribution</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 border border-[#E5EAF1] rounded-lg">
                        <span className="text-[#8A97A8] block">Combined Loss Ratio</span>
                        <span
                          className={`text-base font-bold mt-0.5 block ${
                            selectedReportRow.lossRatio < 50 ? 'text-[#16865B]' : 'text-[#D69B32]'
                          }`}
                        >
                          {selectedReportRow.lossRatio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-white p-3 border border-[#E5EAF1] rounded-lg">
                        <span className="text-[#8A97A8] block">Underwriting Margin</span>
                        <span className="text-base font-bold text-[#102A43] mt-0.5 block">
                          {selectedReportRow.margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Claims & Loss Margin' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] space-y-2">
                    <span className="font-bold text-[#102A43] block">Adjudication Variance</span>
                    <p className="text-[#66758A] leading-relaxed">
                      Actual incurred loss ratio of {selectedReportRow.lossRatio}% is within the actuarial corridor
                      of 35.0% - 65.0% defined under regulatory underwriting rules.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Reinsurance Treaty Allocation' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-3">
                  <div>
                    <span className="text-[#8A97A8] block">Primary Reinsurer:</span>
                    <span className="text-[#102A43] font-semibold">Swiss Reinsurance Company (Zurich)</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Treaty Type:</span>
                    <span className="font-mono text-[#2776EA]">Quota Share (80/20) + Excess of Loss</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Recoverables Protection:</span>
                    <span className="text-[#16865B] font-semibold">100% Backed by Escrow Reserve</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Generate Custom Actuarial Report Modal with Tabs & Sticky Footer */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Generate Actuarial & Solvency Report"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveModalTab('params')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeModalTab === 'params' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Parameters & Scope
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('dimensions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeModalTab === 'dimensions' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Dimensions & Output
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Generate Report Pack
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
          {activeModalTab === 'params' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Report Formal Title *</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Target Period</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    <option value="YTD 2025">YTD 2025 (Jan - May)</option>
                    <option value="Q1 2025">Q1 2025</option>
                    <option value="FY 2024">FY 2024 (Audited Full Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Accounting Standard</label>
                  <input
                    type="text"
                    value={accountingStandard}
                    onChange={(e) => setAccountingStandard(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeModalTab === 'dimensions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Distribution Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="PDF + CSV (Executive Board Pack)">PDF + CSV (Executive Board Pack)</option>
                  <option value="Statutory XBRL Format">Statutory XBRL Regulatory Submission</option>
                  <option value="Raw CSV Data Export">Raw Financial Ledger CSV</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1]">
                <input
                  type="checkbox"
                  id="includeProjections"
                  checked={includeProjections}
                  onChange={(e) => setIncludeProjections(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA]"
                />
                <label htmlFor="includeProjections" className="text-xs text-[#102A43] font-medium cursor-pointer">
                  Include 12-Month Actuarial Loss Projections & Monte Carlo Simulation
                </label>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default FinancialReports;
