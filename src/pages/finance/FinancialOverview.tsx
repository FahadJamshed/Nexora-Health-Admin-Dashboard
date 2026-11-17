import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { LineChart, DonutChart } from '../../components/charts/Charts';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';

export const FinancialOverview: React.FC = () => {
  const { transactions, bankAccounts, invoices, settlements, addTransaction, navigate, showToast } = useApp();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeRecordTab, setActiveRecordTab] = useState<'details' | 'banking'>('details');

  // New Transaction Form State
  const [newTxType, setNewTxType] = useState<Transaction['type']>('Premium Collection');
  const [newRelatedEntity, setNewRelatedEntity] = useState('');
  const [newAmount, setNewAmount] = useState(250000);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Transaction['paymentMethod']>('Bank Transfer');
  const [newAccount, setNewAccount] = useState(bankAccounts[0]?.accountName || 'JPMorgan Chase - Operating Account');
  const [newReference, setNewReference] = useState(`TX-REF-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleOpenDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsDetailOpen(true);
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelatedEntity.trim()) {
      showToast('Validation Error', 'Counterparty / entity name is required.', 'error');
      return;
    }

    addTransaction({
      type: newTxType,
      relatedEntity: newRelatedEntity,
      amount: newAmount,
      paymentMethod: newPaymentMethod,
      account: newAccount,
      reference: newReference,
      status: 'Completed',
    });

    setIsRecordModalOpen(false);
    setNewRelatedEntity('');
    setActiveRecordTab('details');
  };

  const totalCollected = transactions
    .filter((t) => t.type === 'Premium Collection' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0) + 84600000;

  const totalClaimsDisbursed = transactions
    .filter((t) => (t.type === 'Claim Settlement' || t.type === 'Provider Payment') && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0) + 42100000;

  const pendingPayables = settlements
    .filter((s) => s.status === 'Pending')
    .reduce((sum, s) => sum + s.settlementAmount, 0) + 12800000;

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0) + 118400000;

  const monthlyFinancialData = [
    { label: 'Jan', value: 52 },
    { label: 'Feb', value: 58 },
    { label: 'Mar', value: 64 },
    { label: 'Apr', value: 69 },
    { label: 'May', value: 78 },
    { label: 'Jun', value: 74 },
    { label: 'Jul', value: 81 },
    { label: 'Aug', value: 85 },
  ];

  const expenditureBreakdown = [
    { label: 'Claims Disbursed', value: 65, color: '#2776EA' },
    { label: 'Provider Retainers', value: 18, color: '#16865B' },
    { label: 'IT & Cloud Ops', value: 10, color: '#D69B32' },
    { label: 'Admin & Compliance', value: 7, color: '#66758A' },
  ];

  const columns: Column<Transaction>[] = [
    {
      key: 'txNumber',
      header: 'Transaction ID',
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-[#2776EA]">{t.txNumber}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (t) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            t.type === 'Premium Collection'
              ? 'bg-[#E8F6EF] text-[#16865B]'
              : t.type === 'Claim Settlement'
              ? 'bg-[#EAF2FF] text-[#2776EA]'
              : 'bg-[#F6F8FC] text-[#66758A]'
          }`}
        >
          {t.type}
        </span>
      ),
    },
    {
      key: 'relatedEntity',
      header: 'Party / Entity',
      sortable: true,
      render: (t) => <span className="font-semibold text-[#102A43]">{t.relatedEntity}</span>,
    },
    {
      key: 'amount',
      header: 'Amount (PKR)',
      sortable: true,
      render: (t) => (
        <span
          className={`font-bold ${
            t.type === 'Premium Collection' ? 'text-[#16865B]' : 'text-[#102A43]'
          }`}
        >
          {t.type === 'Premium Collection' ? '+' : '-'} PKR {t.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (t) => <span className="text-xs text-[#66758A]">{t.paymentMethod}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (t) => <span className="text-xs text-[#8A97A8]">{t.date}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => <Badge value={t.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Financial Overview"
        description="Comprehensive healthcare treasury dashboard, premium receivables, claim settlements, liquidity position, and operating reserves."
        breadcrumbs={['Financial Management', 'Financial Overview']}
        primaryAction={{
          label: 'Record Transaction',
          icon: 'plus',
          onClick: () => {
            setNewReference(`TX-REF-${Math.floor(100000 + Math.random() * 900000)}`);
            setIsRecordModalOpen(true);
          },
        }}
        secondaryActions={[
          {
            label: 'General Ledger',
            icon: 'accounting',
            onClick: () => navigate('Accounting'),
          },
          {
            label: 'Bank Reconciliation',
            icon: 'bank',
            onClick: () => navigate('Bank Reconciliation'),
          },
        ]}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Premium Collected"
          value={`PKR ${(totalCollected / 1000000).toFixed(1)}M`}
          change="+11.2%"
          changeType="increase"
          period="vs prior quarter"
          icon="finance"
          sparklineData={[45, 52, 58, 62, 70, 78, 85]}
        />
        <StatsCard
          title="Claims Settled"
          value={`PKR ${(totalClaimsDisbursed / 1000000).toFixed(1)}M`}
          change="+6.8%"
          changeType="neutral"
          period="Loss Ratio: 49.7%"
          icon="claim"
          sparklineData={[28, 30, 35, 34, 38, 41, 42]}
        />
        <StatsCard
          title="Outstanding Payables"
          value={`PKR ${(pendingPayables / 1000000).toFixed(1)}M`}
          change="-4.3%"
          changeType="decrease"
          period="Hospital remittances"
          icon="invoices"
          sparklineData={[18, 16, 17, 15, 14, 13, 12]}
        />
        <StatsCard
          title="Treasury Liquidity"
          value={`PKR ${(totalBankBalance / 1000000).toFixed(1)}M`}
          change="+14.5%"
          changeType="increase"
          period="Across 5 scheduled banks"
          icon="bank"
          sparklineData={[95, 98, 104, 108, 112, 116, 118]}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#102A43] text-sm">Monthly Premium Collection Trend</h3>
              <p className="text-xs text-[#8A97A8]">PKR Millions collected across corporate & retail underwriting</p>
            </div>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-2.5 py-1 rounded-full">
              Target Achieved: 104%
            </span>
          </div>
          <div className="h-64 flex items-end justify-center">
            <LineChart data={monthlyFinancialData} color="#2776EA" fillArea height={230} />
          </div>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-[#102A43] text-sm mb-1">Expenditure Breakdown</h3>
          <p className="text-xs text-[#8A97A8] mb-4">Capital allocation by operational category</p>
          <div className="h-44 flex items-center justify-center">
            <DonutChart data={expenditureBreakdown} size={150} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#E5EAF1] text-xs">
            {expenditureBreakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#66758A]">{item.label}:</span>
                <span className="font-bold text-[#102A43]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bank Account Reserves Strip */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#102A43] text-sm">Treasury Bank Accounts & Liquidity</h3>
            <p className="text-xs text-[#8A97A8]">Active corporate bank balances with ACH Network & RTGS clearance</p>
          </div>
          <button
            onClick={() => navigate('Bank Reconciliation')}
            className="text-xs font-semibold text-[#2776EA] hover:underline flex items-center gap-1"
          >
            Reconcile Accounts
            <Icon name="chevron-right" size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bankAccounts.slice(0, 3).map((acc) => (
            <div key={acc.id} className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#102A43] text-xs block">{acc.bankName}</span>
                  <span className="text-[11px] text-[#8A97A8]">{acc.accountTitle}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F6EF] text-[#16865B]">
                  Active
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8A97A8]">Available Balance:</span>
                <span className="font-bold text-[#102A43] text-base block mt-0.5">
                  PKR {(acc.balance || 42500000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#8A97A8] pt-1 border-t border-[#E5EAF1]">
                <span>IBAN: {acc.iban.slice(0, 8)}...</span>
                <span>Last reconciled: {acc.lastReconciled || '10 May 2025'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#102A43] text-sm">Recent Ledger Transactions</h3>
            <p className="text-xs text-[#8A97A8]">Real-time audit log of inflows, hospital remittances, and refunds</p>
          </div>
          <button
            onClick={() => navigate('Transactions')}
            className="text-xs font-semibold text-[#2776EA] hover:underline"
          >
            View All Transactions ({transactions.length})
          </button>
        </div>

        <DataTable
          data={transactions.slice(0, 8)}
          columns={columns}
          searchPlaceholder="Search transactions..."
          searchKey="txNumber"
          onRowClick={handleOpenDetail}
          actions={[
            {
              label: 'View Remittance Advice',
              icon: 'eye',
              onClick: handleOpenDetail,
            },
            {
              label: 'Download Advice Voucher',
              icon: 'download',
              onClick: (t) => showToast('Downloaded', `Remittance slip for ${t.txNumber} downloaded.`),
            },
            {
              label: 'Open Full Ledger',
              icon: 'accounting',
              onClick: () => navigate('Transactions'),
            },
          ]}
        />
      </div>

      {/* Detail Slide-Over Drawer */}
      {selectedTx && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Remittance Advice #${selectedTx.txNumber}`}
          subtitle={`Counterparty: ${selectedTx.relatedEntity} · ${selectedTx.date}`}
          badge={<Badge value={selectedTx.status} />}
          tabs={['Remittance Details', 'Treasury & Bank Feed', 'Accounting GL Postings']}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Close Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Advice Printed', `Print job sent for remittance advice ${selectedTx.txNumber}.`);
                  setIsDetailOpen(false);
                }}
                className="px-4 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1E65CF]"
              >
                Print Official Slip
              </button>
            </div>
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Remittance Details' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Transaction Type</span>
                      <span className="font-semibold text-[#102A43]">{selectedTx.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Counterparty</span>
                      <span className="font-semibold text-[#102A43]">{selectedTx.relatedEntity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Value Date</span>
                      <span className="font-semibold text-[#102A43]">{selectedTx.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Gross Amount</span>
                      <span
                        className={`text-base font-bold ${
                          selectedTx.type === 'Premium Collection' ? 'text-[#16865B]' : 'text-[#102A43]'
                        }`}
                      >
                        {selectedTx.type === 'Premium Collection' ? '+' : '-'} PKR{' '}
                        {selectedTx.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Disbursement Specifications</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#8A97A8] block">Payment Gateway</span>
                        <span className="font-medium text-[#102A43]">{selectedTx.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block">Electronic Trace Ref</span>
                        <span className="font-mono text-[#2776EA] font-semibold">{selectedTx.reference}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Treasury & Bank Feed' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] space-y-2">
                    <span className="text-[#8A97A8] block">Linked Bank Account</span>
                    <span className="font-bold text-[#102A43] text-sm block">{selectedTx.account}</span>
                    <span className="text-[11px] text-[#66758A]">RTGS / Automated Clearing House (ACH) Realtime Feed</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E5EAF1] space-y-2">
                    <span className="text-[#8A97A8] block">Reconciliation Status</span>
                    <span className="text-[#16865B] font-semibold flex items-center gap-1.5">
                      <Icon name="check" size={14} /> Automatically matched to General Ledger
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'Accounting GL Postings' && (
                <div className="space-y-3 text-xs">
                  <div className="border border-[#E5EAF1] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F6F8FC] text-[#66758A] border-b border-[#E5EAF1]">
                        <tr>
                          <th className="py-2.5 px-3">GL Account</th>
                          <th className="py-2.5 px-3 text-right">Debit (PKR)</th>
                          <th className="py-2.5 px-3 text-right">Credit (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5EAF1]">
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-[#102A43]">
                            {selectedTx.type === 'Premium Collection' ? '1010 - Chase Operating Account' : '5010 - Claims Incurred & Settled'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#102A43]">
                            PKR {selectedTx.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#8A97A8]">—</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-[#102A43]">
                            {selectedTx.type === 'Premium Collection' ? '4010 - Gross Written Premiums' : '1020 - BofA Claims Escrow'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#8A97A8]">—</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#102A43]">
                            PKR {selectedTx.amount.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Record Treasury Transaction Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Treasury Transaction"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveRecordTab('details')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeRecordTab === 'details' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Transaction Details
              </button>
              <button
                type="button"
                onClick={() => setActiveRecordTab('banking')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeRecordTab === 'banking' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Banking & Counterparty
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordTransaction}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Commit to Ledger
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleRecordTransaction} className="space-y-4 text-xs">
          {activeRecordTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Transaction Classification *</label>
                <select
                  value={newTxType}
                  onChange={(e) => setNewTxType(e.target.value as any)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Premium Collection">Premium Collection (Inflow)</option>
                  <option value="Claim Settlement">Claim Settlement (Outflow)</option>
                  <option value="Provider Payment">Provider Payment (Outflow)</option>
                  <option value="Vendor Invoice">Vendor Invoice (Outflow)</option>
                  <option value="Refund">Refund / Reversal (Outflow)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Counterparty / Related Entity *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corporation or Metropolitan Medical Center"
                  value={newRelatedEntity}
                  onChange={(e) => setNewRelatedEntity(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Amount (PKR) *</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>
            </div>
          )}

          {activeRecordTab === 'banking' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    <option value="Bank Transfer">Bank Transfer (IBFT)</option>
                    <option value="EFT">Fedwire Transfer</option>
                    <option value="Cheque">Payee Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Direct Debit">Direct Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Electronic Trace Reference</label>
                  <input
                    type="text"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Designated Bank Account</label>
                <select
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={`${b.bankName} - ${b.accountName}`}>
                      {b.bankName} ({b.accountName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1] text-[11px] text-[#66758A]">
                Note: Transaction will be immediately committed to the general ledger and available in the bank reconciliation feed.
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default FinancialOverview;
