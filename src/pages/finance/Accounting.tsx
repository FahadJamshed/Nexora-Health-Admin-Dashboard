import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

interface AccountEntry {
  code: string;
  name: string;
  category: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';
  subType: string;
  debit: number;
  credit: number;
  balance: number;
  status: 'Active' | 'Locked';
}

export const Accounting: React.FC = () => {
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fiscalPeriod, setFiscalPeriod] = useState<string>('FY-2025');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountEntry | null>(null);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [activeJournalTab, setActiveJournalTab] = useState<'voucher' | 'allocation'>('voucher');

  // Journal Entry Form State
  const [journalDesc, setJournalDesc] = useState('');
  const [debitAccount, setDebitAccount] = useState('1010 - JPMorgan Chase Bank - Operating Account');
  const [creditAccount, setCreditAccount] = useState('4010 - Gross Written Premiums - Corporate Group Health');
  const [journalAmount, setJournalAmount] = useState(150000);
  const [costCenter, setCostCenter] = useState('Corporate Health (Underwriting)');
  const [supportingRef, setSupportingRef] = useState('JV-AUDIT-2025-091');

  const initialChartOfAccounts: AccountEntry[] = [
    { code: '1010', name: 'JPMorgan Chase Bank - Operating Account', category: 'Assets', subType: 'Cash & Cash Equivalents', debit: 42500000, credit: 0, balance: 42500000, status: 'Active' },
    { code: '1020', name: 'Bank of America - Claims Escrow Account', category: 'Assets', subType: 'Cash & Cash Equivalents', debit: 28400000, credit: 0, balance: 28400000, status: 'Active' },
    { code: '1030', name: 'Citibank - Healthcare Reserve Account', category: 'Assets', subType: 'Cash & Cash Equivalents', debit: 18200000, credit: 0, balance: 18200000, status: 'Active' },
    { code: '1200', name: 'Premiums Receivable - Corporate Clients', category: 'Assets', subType: 'Accounts Receivable', debit: 14600000, credit: 0, balance: 14600000, status: 'Active' },
    { code: '1300', name: 'Reinsurance Recoverables on Paid Claims', category: 'Assets', subType: 'Other Assets', debit: 6200000, credit: 0, balance: 6200000, status: 'Active' },
    { code: '2010', name: 'Outstanding Claims Reserve (IBNR)', category: 'Liabilities', subType: 'Technical Provisions', debit: 0, credit: 24800000, balance: 24800000, status: 'Active' },
    { code: '2020', name: 'Unearned Premium Reserves (UPR)', category: 'Liabilities', subType: 'Technical Provisions', debit: 0, credit: 38500000, balance: 38500000, status: 'Active' },
    { code: '2100', name: 'Panel Hospital Accounts Payable', category: 'Liabilities', subType: 'Current Liabilities', debit: 0, credit: 12800000, balance: 12800000, status: 'Active' },
    { code: '2200', name: 'Sales Tax & Withholding Tax Payable (Federal Revenue/State Tax)', category: 'Liabilities', subType: 'Statutory Liabilities', debit: 0, credit: 3400000, balance: 3400000, status: 'Active' },
    { code: '3010', name: 'Paid-Up Share Capital', category: 'Equity', subType: 'Shareholders Equity', debit: 0, credit: 50000000, balance: 50000000, status: 'Locked' },
    { code: '3020', name: 'Retained Operating Surplus', category: 'Equity', subType: 'Reserves', debit: 0, credit: 28500000, balance: 28500000, status: 'Active' },
    { code: '4010', name: 'Gross Written Premiums - Corporate Group Health', category: 'Revenue', subType: 'Operating Revenue', debit: 0, credit: 68400000, balance: 68400000, status: 'Active' },
    { code: '4020', name: 'Gross Written Premiums - Retail & Family Health', category: 'Revenue', subType: 'Operating Revenue', debit: 0, credit: 16200000, balance: 16200000, status: 'Active' },
    { code: '4030', name: 'TPA Administration & Facilitation Fees', category: 'Revenue', subType: 'Fee Income', debit: 0, credit: 5400000, balance: 5400000, status: 'Active' },
    { code: '5010', name: 'Healthcare Claims Incurred & Settled', category: 'Expenses', subType: 'Direct Technical Costs', debit: 42100000, credit: 0, balance: 42100000, status: 'Active' },
    { code: '5020', name: 'Hospital Panel Retainer Fees', category: 'Expenses', subType: 'Provider Network Fees', debit: 4800000, credit: 0, balance: 4800000, status: 'Active' },
    { code: '5030', name: 'IT Infrastructure & Telemedicine Server Costs', category: 'Expenses', subType: 'Administrative Expenses', debit: 2600000, credit: 0, balance: 2600000, status: 'Active' },
    { code: '5040', name: 'Audit, Regulatory Compliance & Legal Expenses', category: 'Expenses', subType: 'Professional Fees', debit: 1850000, credit: 0, balance: 1850000, status: 'Active' },
  ];

  const [accounts, setAccounts] = useState<AccountEntry[]>(initialChartOfAccounts);

  const filteredAccounts = accounts.filter((a) => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    return true;
  });

  const totalAssets = accounts.filter((a) => a.category === 'Assets').reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter((a) => a.category === 'Liabilities').reduce((s, a) => s + a.balance, 0);
  const totalRevenue = accounts.filter((a) => a.category === 'Revenue').reduce((s, a) => s + a.balance, 0);
  const totalExpenses = accounts.filter((a) => a.category === 'Expenses').reduce((s, a) => s + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalDesc) {
      showToast('Validation Error', 'Journal entry narrative description is required.', 'error');
      return;
    }

    showToast(
      'Journal Entry Posted',
      `Posted PKR ${journalAmount.toLocaleString()} debiting ${debitAccount} and crediting ${creditAccount}.`,
      'success'
    );
    setIsJournalModalOpen(false);
    setJournalDesc('');
  };

  const columns: Column<AccountEntry>[] = [
    {
      key: 'code',
      header: 'GL Code',
      sortable: true,
      render: (a) => <span className="font-mono font-bold text-[#2776EA]">{a.code}</span>,
    },
    {
      key: 'name',
      header: 'Account Title',
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{a.name}</span>
          <span className="text-[11px] text-[#8A97A8]">{a.subType}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (a) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            a.category === 'Assets'
              ? 'bg-[#EAF2FF] text-[#2776EA]'
              : a.category === 'Liabilities'
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : a.category === 'Revenue'
              ? 'bg-[#E8F6EF] text-[#16865B]'
              : a.category === 'Expenses'
              ? 'bg-[#FDECEC] text-[#D64545]'
              : 'bg-[#F6F8FC] text-[#66758A]'
          }`}
        >
          {a.category}
        </span>
      ),
    },
    {
      key: 'debit',
      header: 'Debit (PKR)',
      sortable: true,
      render: (a) => (
        <span className="font-mono text-xs text-[#102A43]">
          {a.debit > 0 ? `PKR ${a.debit.toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      key: 'credit',
      header: 'Credit (PKR)',
      sortable: true,
      render: (a) => (
        <span className="font-mono text-xs text-[#102A43]">
          {a.credit > 0 ? `PKR ${a.credit.toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Net Balance (PKR)',
      sortable: true,
      render: (a) => (
        <span className="font-bold text-[#102A43]">
          PKR {a.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            a.status === 'Active' ? 'bg-[#E8F6EF] text-[#16865B]' : 'bg-[#F6F8FC] text-[#8A97A8]'
          }`}
        >
          {a.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Accounting & General Ledger"
        description="Statutory Chart of Accounts conforming to Federal Healthcare Administration Standards and IFRS 17 Insurance Contracts standard."
        breadcrumbs={['Financial Management', 'Accounting']}
        primaryAction={{
          label: 'Post Journal Entry',
          icon: 'plus',
          onClick: () => setIsJournalModalOpen(true),
        }}
        secondaryActions={[
          {
            label: 'Export Ledger',
            icon: 'export',
            onClick: () => showToast('Exporting', 'Downloading trial balance in CSV format.', 'info'),
          },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Total Assets</span>
          <span className="text-xl font-bold text-[#102A43] block mt-1">
            PKR {(totalAssets / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-[#66758A]">Cash & receivables</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Liabilities & Reserves</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-1">
            PKR {(totalLiabilities / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-[#66758A]">IBNR & unearned prem.</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Total Revenue</span>
          <span className="text-xl font-bold text-[#16865B] block mt-1">
            PKR {(totalRevenue / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-[#66758A]">GWP + TPA fees</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Claims & Expenses</span>
          <span className="text-xl font-bold text-[#D64545] block mt-1">
            PKR {(totalExpenses / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-[#66758A]">Claims incurred & ops</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#102A43]">Net Surplus / Income</span>
          <span className="text-xl font-bold text-[#16865B] block mt-1">
            PKR {(netIncome / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-[#16865B] font-semibold">Underwriting Profit</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {cat === 'All' ? 'Complete Chart of Accounts' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Period:</span>
          <select
            value={fiscalPeriod}
            onChange={(e) => setFiscalPeriod(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="FY-2025">FY-2025 (Year to Date)</option>
            <option value="Q2-2025">Q2 2025 (Apr - Jun)</option>
            <option value="Q1-2025">Q1 2025 (Jan - Mar)</option>
          </select>
        </div>
      </div>

      {/* GL Accounts Table */}
      <DataTable
        data={filteredAccounts}
        columns={columns}
        searchPlaceholder="Search accounts by code, title, or category..."
        searchKey="name"
        onRowClick={(acc) => {
          setSelectedAccount(acc);
          setIsAccountDrawerOpen(true);
        }}
        onView={(acc) => {
          setSelectedAccount(acc);
          setIsAccountDrawerOpen(true);
        }}
        onDelete={(acc) => {
          setAccounts((prev) => prev.filter((a) => a.code !== acc.code));
          showToast('Account Removed', `GL Account ${acc.code} removed from chart of accounts.`, 'info');
        }}
        actions={[
          {
            label: 'View Account Ledger Card',
            icon: 'eye',
            onClick: (acc) => {
              setSelectedAccount(acc);
              setIsAccountDrawerOpen(true);
            },
          },
          {
            label: 'Post Journal to Account',
            icon: 'plus',
            onClick: (acc) => {
              setDebitAccount(`${acc.code} - ${acc.name}`);
              setIsJournalModalOpen(true);
            },
          },
          {
            label: 'Export Account Statement',
            icon: 'download',
            onClick: (acc) => {
              showToast('Statement Downloaded', `General ledger statement for ${acc.code} - ${acc.name} downloaded in CSV.`);
            },
          },
        ]}
      />

      {/* Account Detail Slide-Over Drawer */}
      {selectedAccount && (
        <DetailDrawer
          isOpen={isAccountDrawerOpen}
          onClose={() => setIsAccountDrawerOpen(false)}
          title={`GL Code ${selectedAccount.code}`}
          subtitle={selectedAccount.name}
          badge={<Badge value={selectedAccount.status} />}
          tabs={['Account Ledger & Activity', 'Double-Entry Postings', 'IFRS 17 Technical Notes']}
          actions={[
            {
              label: 'Delete Account',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                setAccounts((prev) => prev.filter((a) => a.code !== selectedAccount.code));
                setIsAccountDrawerOpen(false);
                showToast('Account Removed', `GL Account ${selectedAccount.code} removed.`, 'info');
                setSelectedAccount(null);
              },
            },
          ]}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsAccountDrawerOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Close Drawer
              </button>
              <button
                type="button"
                onClick={() => {
                  setDebitAccount(`${selectedAccount.code} - ${selectedAccount.name}`);
                  setIsAccountDrawerOpen(false);
                  setIsJournalModalOpen(true);
                }}
                className="px-4 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1E65CF]"
              >
                Post Journal to this Account
              </button>
            </div>
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Account Ledger & Activity' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">GL Account Code</span>
                      <span className="font-mono font-bold text-[#2776EA] text-sm">{selectedAccount.code}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Financial Statement Category</span>
                      <span className="font-semibold text-[#102A43]">{selectedAccount.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Sub-Classification</span>
                      <span className="font-medium text-[#40516A]">{selectedAccount.subType}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E5EAF1]">
                      <span className="text-[#8A97A8]">Net Carrying Balance</span>
                      <span className="text-base font-bold text-[#102A43]">
                        PKR {selectedAccount.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">YTD Debit / Credit Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 border border-[#E5EAF1] rounded-lg">
                        <span className="text-[#8A97A8] block">Total Debits Incurred</span>
                        <span className="text-sm font-bold text-[#102A43] mt-0.5 block">
                          PKR {selectedAccount.debit.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 border border-[#E5EAF1] rounded-lg">
                        <span className="text-[#8A97A8] block">Total Credits Recorded</span>
                        <span className="text-sm font-bold text-[#102A43] mt-0.5 block">
                          PKR {selectedAccount.credit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Double-Entry Postings' && (
                <div className="space-y-3 text-xs">
                  <div className="border border-[#E5EAF1] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F6F8FC] text-[#66758A] border-b border-[#E5EAF1]">
                        <tr>
                          <th className="py-2.5 px-3">Voucher Ref</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-right">Debit (PKR)</th>
                          <th className="py-2.5 px-3 text-right">Credit (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5EAF1]">
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2776EA]">JV-2025-088</td>
                          <td className="py-2.5 px-3 text-[#102A43]">Monthly Corporate Health Premium Accrual</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#102A43]">
                            {selectedAccount.debit > 0 ? `PKR ${(selectedAccount.debit * 0.3).toFixed(0)}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#102A43]">
                            {selectedAccount.credit > 0 ? `PKR ${(selectedAccount.credit * 0.3).toFixed(0)}` : '—'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2776EA]">JV-2025-081</td>
                          <td className="py-2.5 px-3 text-[#102A43]">Hospital Panel Claim Remittances Disbursed</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#102A43]">
                            {selectedAccount.debit > 0 ? `PKR ${(selectedAccount.debit * 0.7).toFixed(0)}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#102A43]">
                            {selectedAccount.credit > 0 ? `PKR ${(selectedAccount.credit * 0.7).toFixed(0)}` : '—'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'IFRS 17 Technical Notes' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-3">
                  <div>
                    <span className="text-[#8A97A8] block">Insurance Contracts Measurement Model:</span>
                    <span className="text-[#102A43] font-semibold">General Measurement Model (GMM) / PAA</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Statutory Audit Group:</span>
                    <span className="font-mono text-[#2776EA]">Healthcare Underwriting Operating Reserves</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Solvency Capital Requirement (SCR):</span>
                    <span className="text-[#16865B] font-semibold">Compliant - Risk margin accounted at 6%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Post Journal Entry Modal with Multi-tab & Sticky Footer */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        title="Post General Ledger Journal Entry"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveJournalTab('voucher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeJournalTab === 'voucher' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Voucher Details
              </button>
              <button
                type="button"
                onClick={() => setActiveJournalTab('allocation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeJournalTab === 'allocation' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Allocation & Cost Center
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsJournalModalOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePostJournal}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Post & Commit to Trial Balance
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handlePostJournal} className="space-y-4 text-xs">
          {activeJournalTab === 'voucher' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Narrative / Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Accrual of monthly corporate health premium from Acme Corp"
                  value={journalDesc}
                  onChange={(e) => setJournalDesc(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Debit Account (Dr.) *</label>
                  <select
                    value={debitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    {initialChartOfAccounts.map((a) => (
                      <option key={a.code} value={`${a.code} - ${a.name}`}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Credit Account (Cr.) *</label>
                  <select
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    {initialChartOfAccounts.map((a) => (
                      <option key={a.code} value={`${a.code} - ${a.name}`}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Amount (PKR) *</label>
                <input
                  type="number"
                  value={journalAmount}
                  onChange={(e) => setJournalAmount(Number(e.target.value))}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1] text-[11px] text-[#66758A]">
                Double entry rule verified: Dr. <strong>PKR {journalAmount.toLocaleString()}</strong> = Cr.{' '}
                <strong>PKR {journalAmount.toLocaleString()}</strong>.
              </div>
            </div>
          )}

          {activeJournalTab === 'allocation' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Department / Cost Center *</label>
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Corporate Health (Underwriting)">Corporate Health (Underwriting)</option>
                  <option value="Retail & Family Health Plans">Retail & Family Health Plans</option>
                  <option value="Hospital Panel Operations">Hospital Panel Operations</option>
                  <option value="IT Infrastructure & Telemedicine">IT Infrastructure & Telemedicine</option>
                  <option value="Statutory & Executive Reserves">Statutory & Executive Reserves</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Supporting Reference / Docket ID</label>
                <input
                  type="text"
                  value={supportingRef}
                  onChange={(e) => setSupportingRef(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="p-3 bg-[#E8F6EF] rounded-lg border border-[#c3e8d6] text-[11px] text-[#16865B]">
                Voucher will be audited and stamped with immutable SHA-256 cryptographic sequence on confirmation.
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default Accounting;
