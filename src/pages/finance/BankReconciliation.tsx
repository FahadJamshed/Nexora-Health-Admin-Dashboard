import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { BankStatementRecord } from '../../types';

export const BankReconciliation: React.FC = () => {
  const {
    bankAccounts,
    bankStatements,
    toggleMatchBankRecord,
    addBankAdjustment,
    completeReconciliation,
    showToast,
  } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    bankAccounts[0]?.id || 'BNK-001'
  );
  const [filterType, setFilterType] = useState<'All' | 'Matched' | 'Unmatched'>('All');
  const [selectedRecord, setSelectedRecord] = useState<BankStatementRecord | null>(null);
  const [isRecordDrawerOpen, setIsRecordDrawerOpen] = useState(false);
  const [activeAdjustTab, setActiveAdjustTab] = useState<'voucher' | 'audit'>('voucher');

  // Adjustment Modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<'Debit' | 'Credit'>('Debit');
  const [adjustAmount, setAdjustAmount] = useState<number>(2500);
  const [adjustDesc, setAdjustDesc] = useState('Bank service & Fedwire / ACH charges');
  const [adjustRef, setAdjustRef] = useState('ADJ-REC-2025-019');

  const selectedAccount =
    bankAccounts.find((b) => b.id === selectedAccountId) || bankAccounts[0];

  // In mock data, bankStatements can be filtered or partitioned by active account
  const filteredRecords = bankStatements.filter((stmt) => {
    if (filterType === 'Matched' && !stmt.matched) return false;
    if (filterType === 'Unmatched' && stmt.matched) return false;
    return true;
  });

  const matchedCount = bankStatements.filter((s) => s.matched).length;
  const unmatchedCount = bankStatements.filter((s) => !s.matched).length;

  // Calculate live variance
  const statementBalance = selectedAccount?.balance || 42500000;
  const ledgerBalance = selectedAccount?.ledgerBalance || 42485000;
  const variance = Math.abs(statementBalance - ledgerBalance);

  const handleToggleMatch = (record: BankStatementRecord) => {
    toggleMatchBankRecord(record.id);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustDesc.trim()) {
      showToast('Description Required', 'Please provide a justification for this bank adjustment.', 'error');
      return;
    }

    addBankAdjustment(selectedAccountId, adjustAmount, adjustDesc, adjustType);
    setIsAdjustmentModalOpen(false);
    setAdjustDesc('');
  };

  const handleFinalSignOff = () => {
    completeReconciliation(selectedAccountId);
  };

  const columns: Column<BankStatementRecord>[] = [
    {
      key: 'matched',
      header: 'Reconcile',
      sortable: false,
      render: (r) => (
        <input
          type="checkbox"
          checked={r.matched}
          onChange={() => handleToggleMatch(r)}
          className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
          title="Toggle matching status"
        />
      ),
    },
    {
      key: 'date',
      header: 'Value Date',
      sortable: true,
      render: (r) => <span className="text-xs text-[#8A97A8] font-mono">{r.date}</span>,
    },
    {
      key: 'description',
      header: 'Bank Statement Narration',
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-[#102A43] text-xs block leading-tight">{r.description}</span>
          <span className="text-[11px] text-[#8A97A8] font-mono">Ref: {r.reference}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Entry Type',
      sortable: true,
      render: (r) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            r.type === 'Credit' ? 'bg-[#E8F6EF] text-[#16865B]' : 'bg-[#FDECEC] text-[#D64545]'
          }`}
        >
          {r.type}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount (PKR)',
      sortable: true,
      render: (r) => (
        <span
          className={`font-mono text-xs font-bold ${
            r.type === 'Credit' ? 'text-[#16865B]' : 'text-[#102A43]'
          }`}
        >
          {r.type === 'Credit' ? '+' : '-'} PKR {r.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'matched',
      header: 'Status',
      sortable: true,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            r.matched ? 'bg-[#E8F6EF] text-[#16865B]' : 'bg-[#FFF5DF] text-[#D69B32]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${r.matched ? 'bg-[#16865B]' : 'bg-[#D69B32]'}`} />
          {r.matched ? 'Matched to GL' : 'Unmatched'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Bank Reconciliation"
        description="Verify and balance electronic bank statement feeds against the general ledger, identify unpresented cheques, and record bank charges."
        breadcrumbs={['Financial Management', 'Bank Reconciliation']}
        primaryAction={{
          label: 'Complete Sign-Off',
          icon: 'check',
          onClick: handleFinalSignOff,
        }}
        secondaryActions={[
          {
            label: 'Post Bank Adjustment',
            icon: 'plus',
            onClick: () => setIsAdjustmentModalOpen(true),
          },
        ]}
      />

      {/* Account Selector Bar */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#102A43]">Select Bank Account:</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="border border-[#E5EAF1] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bankName} - {b.accountName} ({b.accountNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#66758A] flex items-center gap-3">
          <span>
            IBAN: <strong className="font-mono text-[#102A43]">{selectedAccount?.iban}</strong>
          </span>
          <span>•</span>
          <span>
            Last Reconciled:{' '}
            <strong className="text-[#102A43]">{selectedAccount?.lastReconciled || '10 May 2025'}</strong>
          </span>
        </div>
      </div>

      {/* Reconciliation Balance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">
            Statement Ending Balance
          </span>
          <span className="text-xl font-bold text-[#102A43] block mt-1">
            PKR {statementBalance.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#66758A]">Direct bank feed</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">
            General Ledger Balance
          </span>
          <span className="text-xl font-bold text-[#102A43] block mt-1">
            PKR {ledgerBalance.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#66758A]">Internal books</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">
            Variance / Discrepancy
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-xl font-bold ${
                variance === 0 ? 'text-[#16865B]' : 'text-[#D69B32]'
              }`}
            >
              PKR {variance.toLocaleString()}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                variance === 0 ? 'bg-[#E8F6EF] text-[#16865B]' : 'bg-[#FFF5DF] text-[#D69B32]'
              }`}
            >
              {variance === 0 ? 'Balanced' : 'Action Required'}
            </span>
          </div>
          <span className="text-[11px] text-[#66758A]">Pending adjustments</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">
            Matching Ratio
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">
              {matchedCount} / {bankStatements.length}
            </span>
            <span className="text-xs font-semibold text-[#16865B]">
              {Math.round((matchedCount / (bankStatements.length || 1)) * 100)}%
            </span>
          </div>
          <span className="text-[11px] text-[#66758A]">{unmatchedCount} unmatched items remaining</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(['All', 'Unmatched', 'Matched'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === filter
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {filter === 'All' ? 'All Transactions' : filter}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8A97A8]">
          Click checkbox to match or unmatch statement items against the GL.
        </span>
      </div>

      {/* Interactive Statement Table */}
      <DataTable
        data={filteredRecords}
        columns={columns}
        searchPlaceholder="Search statement feed by description or reference..."
        searchKey="description"
        onRowClick={(rec) => {
          setSelectedRecord(rec);
          setIsRecordDrawerOpen(true);
        }}
        actions={[
          {
            label: 'View Clearance Slip',
            icon: 'eye',
            onClick: (rec) => {
              setSelectedRecord(rec);
              setIsRecordDrawerOpen(true);
            },
          },
          {
            label: 'Toggle Match Status',
            icon: 'check',
            onClick: (rec) => toggleMatchBankRecord(rec.id),
          },
          {
            label: 'Post Offsetting Charge',
            icon: 'plus',
            onClick: (rec) => {
              setAdjustDesc(`Offset discrepancy for ${rec.reference}: ${rec.description}`);
              setAdjustAmount(rec.amount);
              setIsAdjustmentModalOpen(true);
            },
          },
        ]}
      />

      {/* Statement Record Detail Drawer */}
      {selectedRecord && (
        <DetailDrawer
          isOpen={isRecordDrawerOpen}
          onClose={() => setIsRecordDrawerOpen(false)}
          title={`Electronic Bank Feed #${selectedRecord.reference}`}
          subtitle={`${selectedRecord.description} · ${selectedRecord.date}`}
          badge={
            <Badge
              value={selectedRecord.matched ? 'Matched to GL' : 'Unmatched'}
              variant={selectedRecord.matched ? 'success' : 'warning'}
            />
          }
          tabs={['Clearance Details', 'GL Matching Analysis', 'Electronic Audit Trace']}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsRecordDrawerOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Close Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleMatchBankRecord(selectedRecord.id);
                  showToast(
                    'Match Toggled',
                    selectedRecord.matched
                      ? `Unmarked ${selectedRecord.reference} from reconciled books.`
                      : `Successfully matched ${selectedRecord.reference} to general ledger.`
                  );
                }}
                className={`px-4 py-1.5 text-white rounded-lg text-xs font-semibold ${
                  selectedRecord.matched
                    ? 'bg-[#D64545] hover:bg-[#b83333]'
                    : 'bg-[#16865B] hover:bg-[#13724c]'
                }`}
              >
                {selectedRecord.matched ? 'Revoke GL Match' : 'Approve Match to GL'}
              </button>
            </div>
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Clearance Details' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Statement Narration</span>
                      <span className="font-semibold text-[#102A43]">{selectedRecord.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Transaction Reference</span>
                      <span className="font-mono text-[#2776EA] font-semibold">{selectedRecord.reference}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Value Date</span>
                      <span className="font-semibold text-[#102A43]">{selectedRecord.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Entry Classification</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          selectedRecord.type === 'Credit'
                            ? 'bg-[#E8F6EF] text-[#16865B]'
                            : 'bg-[#FDECEC] text-[#D64545]'
                        }`}
                      >
                        {selectedRecord.type === 'Credit' ? 'Inflow (Credit)' : 'Outflow (Debit)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E5EAF1]">
                      <span className="text-[#8A97A8]">Cleared Net Amount</span>
                      <span
                        className={`text-base font-bold ${
                          selectedRecord.type === 'Credit' ? 'text-[#16865B]' : 'text-[#102A43]'
                        }`}
                      >
                        {selectedRecord.type === 'Credit' ? '+' : '-'} PKR{' '}
                        {selectedRecord.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Account Custody</h4>
                    <p className="text-xs text-[#40516A]">
                      Deposited at <strong>{selectedAccount?.bankName}</strong> ({selectedAccount?.accountName}) under IBAN <strong className="font-mono">{selectedAccount?.iban}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'GL Matching Analysis' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8A97A8]">Matching Confidence Score</span>
                      <span className="font-bold text-[#16865B] text-sm">99.8% Match</span>
                    </div>
                    <div className="w-full bg-[#E5EAF1] rounded-full h-2">
                      <div className="bg-[#16865B] h-2 rounded-full" style={{ width: '99.8%' }} />
                    </div>
                    <p className="text-[11px] text-[#66758A] mt-1">
                      Matched by IBFT routing number, value date window, and exact currency amounts.
                    </p>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Associated Internal Voucher</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#8A97A8] block">GL Account</span>
                        <span className="font-medium text-[#102A43]">1010 - Cash & Equivalents</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block">Contra Account</span>
                        <span className="font-medium text-[#102A43]">4010 - Written Premiums</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Electronic Audit Trace' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-3">
                  <div>
                    <span className="text-[#8A97A8] block">Gateway Transmission ID:</span>
                    <span className="font-mono text-[#2776EA]">ACH-CLEAR-PK-884920</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Central Bank Settlement Time:</span>
                    <span className="font-mono text-[#102A43]">14:22:09 PKT (Batch Window #4)</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Anti-Money Laundering / Sanctions Status:</span>
                    <span className="text-[#16865B] font-semibold">Cleared (Zero Adverse Hits)</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Post Bank Adjustment Modal with Multi-tab & Sticky Footer */}
      <Modal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        title="Post Bank Adjustment / Charge"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveAdjustTab('voucher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeAdjustTab === 'voucher' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Adjustment Voucher
              </button>
              <button
                type="button"
                onClick={() => setActiveAdjustTab('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeAdjustTab === 'audit' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Bank Justification & Audit
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdjustmentModalOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAdjustment}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
          {activeAdjustTab === 'voucher' && (
            <div className="space-y-4">
              <p className="text-[#66758A]">
                Book a ledger adjustment for bank service fees, withholding tax on cash withdrawals, or credit interest to balance the account.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Adjustment Type *</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    <option value="Debit">Debit (Bank Charge / Fee Outflow)</option>
                    <option value="Credit">Credit (Interest Earned / Inflow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Narration / Reason *</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly maintenance fee or National Clearing clearing commission"
                  value={adjustDesc}
                  onChange={(e) => setAdjustDesc(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>
            </div>
          )}

          {activeAdjustTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Audit Authorization Docket ID</label>
                <input
                  type="text"
                  value={adjustRef}
                  onChange={(e) => setAdjustRef(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-mono text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1] space-y-1">
                <span className="font-bold text-[#102A43] block">Target Account</span>
                <span className="text-[#40516A] text-xs">
                  {selectedAccount?.bankName} ({selectedAccount?.accountName}) - IBAN: {selectedAccount?.iban}
                </span>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default BankReconciliation;
