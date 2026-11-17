import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';

export const Transactions: React.FC = () => {
  const { transactions, bankAccounts, navigate, showToast, addTransaction, deleteTransaction } = useApp();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  // Record Transaction Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeRecordTab, setActiveRecordTab] = useState<'details' | 'banking'>('details');
  const [txType, setTxType] = useState<Transaction['type']>('Premium Collection');
  const [relatedEntity, setRelatedEntity] = useState('');
  const [txAmount, setTxAmount] = useState(250000);
  const [txMethod, setTxMethod] = useState<Transaction['paymentMethod']>('Bank Transfer');
  const [txAccount, setTxAccount] = useState('JPMorgan Chase Bank - Operating Account');
  const [txReference, setTxReference] = useState('FT-2025-99120');

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (methodFilter !== 'All' && t.paymentMethod !== methodFilter) return false;
    return true;
  });

  const totalCount = transactions.length;
  const totalInflows = transactions
    .filter((t) => t.type === 'Premium Collection' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutflows = transactions
    .filter((t) => t.type !== 'Premium Collection' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === 'Pending').length;

  const handleOpenDetail = (t: Transaction) => {
    setSelectedTx(t);
    setIsDetailOpen(true);
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relatedEntity.trim()) {
      showToast('Validation Error', 'Entity name or reference party is required.', 'error');
      return;
    }

    addTransaction({
      reference: txReference,
      type: txType,
      relatedEntity: relatedEntity,
      amount: Number(txAmount),
      paymentMethod: txMethod,
      account: txAccount,
    });

    setIsRecordModalOpen(false);
    setRelatedEntity('');
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'txNumber',
      header: 'Transaction ID',
      sortable: true,
      render: (t) => (
        <button
          onClick={() => handleOpenDetail(t)}
          className="font-mono font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {t.txNumber}
        </button>
      ),
    },
    {
      key: 'type',
      header: 'Transaction Type',
      sortable: true,
      render: (t) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            t.type === 'Premium Collection'
              ? 'bg-[#E8F6EF] text-[#16865B]'
              : t.type === 'Claim Settlement'
              ? 'bg-[#EAF2FF] text-[#2776EA]'
              : t.type === 'Refund'
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : 'bg-[#F6F8FC] text-[#66758A]'
          }`}
        >
          {t.type}
        </span>
      ),
    },
    {
      key: 'relatedEntity',
      header: 'Related Entity / Counterparty',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{t.relatedEntity}</span>
          <span className="text-[11px] text-[#8A97A8]">Ref: {t.reference}</span>
        </div>
      ),
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
      key: 'account',
      header: 'Bank Account',
      sortable: true,
      render: (t) => <span className="text-xs text-[#40516A]">{t.account}</span>,
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
        title="Transactions"
        description="Comprehensive treasury audit trail of inflows, hospital claim settlements, provider remittances, and operational vendor disbursements."
        breadcrumbs={['Financial Management', 'Transactions']}
        primaryAction={{
          label: 'Record Transaction',
          icon: 'plus',
          onClick: () => {
            setTxReference(`FT-${Math.floor(100000 + Math.random() * 900000)}`);
            setIsRecordModalOpen(true);
          },
        }}
        secondaryActions={[
          {
            label: 'Export CSV',
            icon: 'export',
            onClick: () => showToast('Export Started', 'Exporting transaction audit records.', 'info'),
          },
        ]}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Transactions</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalCount}</span>
            <span className="text-xs text-[#16865B] font-semibold bg-[#E8F6EF] px-1.5 py-0.5 rounded">
              Audited
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">YTD recorded entries</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Total Inflows (PKR)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#16865B]">
              +PKR {(totalInflows / 1000000).toFixed(2)}M
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Premiums & fees received</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Total Outflows (PKR)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#D64545]">
              -PKR {(totalOutflows / 1000000).toFixed(2)}M
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Claims & provider payments</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Pending Clearance</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D69B32]">{pendingCount}</span>
            <span className="text-xs text-[#8A97A8]">ACH Network queue</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Clearing via National Clearing / Fedwire</span>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Premium Collection', 'Claim Settlement', 'Provider Payment', 'Vendor Invoice', 'Refund'].map(
            (type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  typeFilter === type
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
                }`}
              >
                {type === 'All' ? 'All Types' : type}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Methods</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="EFT">Fedwire / EFT</option>
            <option value="Cheque">Payee Cheque</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Direct Debit">Direct Debit</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredTransactions}
        columns={columns}
        searchPlaceholder="Search transactions by ID, reference, or counterparty..."
        searchKey="txNumber"
        onRowClick={handleOpenDetail}
        onView={handleOpenDetail}
        onDelete={(t) => deleteTransaction(t.id)}
        actions={[
          {
            label: 'View Remittance Receipt',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'View Source Settlement',
            icon: 'settlements',
            onClick: () => navigate('Settlements'),
            show: (t) => t.type === 'Claim Settlement' || t.type === 'Provider Payment',
          },
          {
            label: 'View Source Vendor Invoice',
            icon: 'invoices',
            onClick: () => navigate('Invoices & Payables'),
            show: (t) => t.type === 'Vendor Invoice',
          },
          {
            label: 'Reconcile in Bank Feed',
            icon: 'bank',
            onClick: () => navigate('Bank Reconciliation'),
          },
          {
            label: 'Download Advice',
            icon: 'download',
            onClick: (t) => showToast('Downloaded', `Remittance slip for ${t.txNumber} downloaded.`, 'info'),
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedTx && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Transaction Receipt #${selectedTx.txNumber}`}
          subtitle={`Reference: ${selectedTx.reference} • ${selectedTx.date}`}
          badge={<Badge value={selectedTx.status} />}
          tabs={['Receipt Details', 'Audit Record']}
          actions={[
            {
              label: 'Delete Transaction',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deleteTransaction(selectedTx.id);
                setIsDetailOpen(false);
                setSelectedTx(null);
              },
            },
          ]}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                {selectedTx.type === 'Claim Settlement' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      navigate('Settlements');
                    }}
                    className="px-3 py-1.5 bg-[#EAF2FF] border border-[#2776EA]/30 text-[#2776EA] rounded-lg text-xs font-semibold hover:bg-[#d8e7fe]"
                  >
                    View in Settlements →
                  </button>
                )}
                {selectedTx.type === 'Vendor Invoice' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      navigate('Invoices & Payables');
                    }}
                    className="px-3 py-1.5 bg-[#EAF2FF] border border-[#2776EA]/30 text-[#2776EA] rounded-lg text-xs font-semibold hover:bg-[#d8e7fe]"
                  >
                    View in Invoices →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('Bank Reconciliation');
                  }}
                  className="px-3.5 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1E65CF]"
                >
                  Bank Reconciliation →
                </button>
              </div>
            </div>
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Receipt Details' && (
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
                      <span className="text-[#8A97A8]">Amount</span>
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
                    <h4 className="font-bold text-[#102A43] text-sm">Banking Information</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[#8A97A8]">Account:</span>
                        <p className="font-medium text-[#102A43]">{selectedTx.account}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">Payment Channel:</span>
                        <p className="font-medium text-[#102A43]">{selectedTx.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">National Clearing / ACH Network Reference:</span>
                        <p className="font-mono text-[#2776EA] font-semibold">{selectedTx.reference}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">Value Date:</span>
                        <p className="text-[#102A43]">{selectedTx.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Audit Record' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">System Batch ID:</span>
                    <span className="font-mono text-[#102A43]">BATCH-2025-05-881</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Cryptographic Hash:</span>
                    <span className="font-mono text-[11px] text-[#66758A]">sha256:8f4c2...1b9e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Operator Signature:</span>
                    <span className="text-[#102A43] font-medium">Auto-Settlement Daemon</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Record Transaction Modal with Multi-tab & Sticky Footer */}
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
                2. Banking & Method
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
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Transaction Type *</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as any)}
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
                  placeholder="e.g. Nexus Technologies or Metropolitan Medical Center"
                  value={relatedEntity}
                  onChange={(e) => setRelatedEntity(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Amount (PKR) *</label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
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
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value as any)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    <option value="Bank Transfer">Bank Transfer (IBFT)</option>
                    <option value="EFT">Fedwire Transfer</option>
                    <option value="Cheque">Crossed Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Direct Debit">Direct Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Electronic Trace Ref / FT No</label>
                  <input
                    type="text"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Debited / Credited Bank Account</label>
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value)}
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
                Note: Will be audited and posted under IFRS 17 standard cash flow journal rules.
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default Transactions;
