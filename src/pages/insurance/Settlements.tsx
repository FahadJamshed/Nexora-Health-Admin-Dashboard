import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Settlement } from '../../types';
import CreateSettlementBatchModal from './CreateSettlementBatchModal';

export const Settlements: React.FC = () => {
  const {
    settlements,
    claims,
    bankAccounts,
    processSettlement,
    deleteSettlement,
    navigate,
    showToast,
  } = useApp();

  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewSettlementOpen, setIsNewSettlementOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Process Settlement Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [targetSettlement, setTargetSettlement] = useState<Settlement | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>(
    bankAccounts[0]?.accountName || 'JPMorgan Chase Bank - Operating Account'
  );
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'EFT' | 'Cheque'>('Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('FT-2025-00984');

  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    return true;
  });

  const totalSettlementsCount = settlements.length;
  const pendingCount = settlements.filter((s) => s.status === 'Pending').length;
  const completedCount = settlements.filter((s) => s.status === 'Completed').length;
  const totalSettledAmount = settlements
    .filter((s) => s.status === 'Completed')
    .reduce((sum, s) => sum + s.settlementAmount, 0);
  const pendingDisbursementAmount = settlements
    .filter((s) => s.status === 'Pending' || s.status === 'Processing')
    .reduce((sum, s) => sum + s.settlementAmount, 0);

  const handleOpenDetail = (s: Settlement) => {
    setSelectedSettlement(s);
    setIsDetailOpen(true);
  };

  const handleOpenProcessModal = (s: Settlement) => {
    setTargetSettlement(s);
    setPaymentReference(`FT-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsProcessModalOpen(true);
  };

  const handleConfirmDisbursement = () => {
    if (!targetSettlement) return;
    if (!paymentReference.trim()) {
      showToast('Reference Required', 'Please enter a valid bank transaction reference or cheque number.', 'error');
      return;
    }

    processSettlement(
      targetSettlement.id,
      paymentMethod,
      selectedBank,
      paymentReference
    );

    setIsProcessModalOpen(false);
    setTargetSettlement(null);
  };

  const columns: Column<Settlement>[] = [
    {
      key: 'settlementNumber',
      header: 'Settlement ID',
      sortable: true,
      render: (s) => (
        <button
          onClick={() => handleOpenDetail(s)}
          className="font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {s.settlementNumber}
        </button>
      ),
    },
    {
      key: 'claimNumber',
      header: 'Claim Reference',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{s.claimNumber}</span>
          <span className="text-[11px] text-[#8A97A8]">Adjudicated Claim</span>
        </div>
      ),
    },
    {
      key: 'hospitalName',
      header: 'Provider / Hospital',
      sortable: true,
      render: (s) => (
        <div>
          <span className="text-sm font-medium text-[#102A43] block leading-tight">{s.hospitalName}</span>
          <span className="text-[11px] text-[#66758A]">{s.insuranceCompanyName}</span>
        </div>
      ),
    },
    {
      key: 'settlementAmount',
      header: 'Disbursement Amount',
      sortable: true,
      render: (s) => (
        <span className="font-bold text-[#102A43]">
          PKR {s.settlementAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (s) => <span className="text-xs text-[#66758A]">{s.dueDate}</span>,
    },
    {
      key: 'paymentMethod',
      header: 'Method & Reference',
      render: (s) => (
        <div>
          <span className="text-xs font-semibold text-[#102A43] block">{s.paymentMethod}</span>
          <span className="text-[11px] text-[#8A97A8]">
            {s.paymentReference || 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (s) => <Badge value={s.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Settlements"
        description="Track approved healthcare claim disbursements, manage provider bank transfers, and reconcile remittance batches."
        breadcrumbs={['Insurance Operations', 'Settlements']}
        primaryAction={{
          label: 'Generate Batch',
          icon: 'plus',
          onClick: () => setIsNewSettlementOpen(true),
        }}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Settlements</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalSettlementsCount}</span>
            <span className="text-xs text-[#16865B] font-semibold bg-[#E8F6EF] px-1.5 py-0.5 rounded">
              {completedCount} Completed
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Batched & single disbursements</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Total Settled (PKR)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#16865B]">
              PKR {(totalSettledAmount / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs font-semibold text-[#16865B]">100% EFT</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Successfully credited</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Pending Disbursement</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#D69B32]">
              PKR {(pendingDisbursementAmount / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-[#8A97A8]">{pendingCount} batches</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Due this settlement cycle</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Average SLA</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">2.4 Days</span>
            <span className="text-xs font-semibold text-[#16865B]">-0.6d</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Approval-to-credit time</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Pending', 'Processing', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {status === 'All' ? 'All Settlements' : status}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#8A97A8]">
          Showing <strong>{filteredSettlements.length}</strong> of <strong>{settlements.length}</strong> settlements
        </div>
      </div>

      {/* Settlements Table */}
      <DataTable
        data={filteredSettlements}
        columns={columns}
        searchPlaceholder="Search settlements by ID, claim, hospital, or reference..."
        searchKey="settlementNumber"
        onRowClick={handleOpenDetail}
        onView={handleOpenDetail}
        onDelete={(s) => deleteSettlement(s.id)}
        actions={[
          {
            label: 'View Settlement Slip',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'Process Payment / Disburse',
            icon: 'check',
            onClick: handleOpenProcessModal,
            show: (s) => s.status === 'Pending' || s.status === 'Processing',
          },
          {
            label: 'View in General Ledger',
            icon: 'accounting',
            onClick: () => navigate('Transactions'),
            show: (s) => s.status === 'Completed',
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedSettlement && (() => {
        const linkedClaim = claims.find(
          (c) =>
            c.claimNumber === selectedSettlement.claimNumber ||
            c.id === selectedSettlement.claimId
        );

        return (
          <DetailDrawer
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            title={`Settlement Slip #${selectedSettlement.settlementNumber}`}
            subtitle={`Payable to ${selectedSettlement.hospitalName}`}
            badge={<Badge value={selectedSettlement.status} />}
            tabs={['Settlement Summary', 'Associated Claim & Treatment', 'Bank Details']}
            actions={[
              {
                label: 'Delete Settlement',
                icon: 'trash',
                variant: 'danger',
                onClick: () => {
                  deleteSettlement(selectedSettlement.id);
                  setIsDetailOpen(false);
                  setSelectedSettlement(null);
                },
              },
            ]}
            footer={
              selectedSettlement.status === 'Completed' ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] text-[#16865B] font-semibold flex items-center gap-1">
                    <Icon name="check" size={14} /> Disbursed & Recorded in General Ledger
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      navigate('Transactions');
                    }}
                    className="px-3.5 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1f5ec2]"
                  >
                    View Ledger Entry →
                  </button>
                </div>
              ) : (selectedSettlement.status === 'Pending' || selectedSettlement.status === 'Processing') ? (
                <div className="flex items-center justify-end gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setIsDetailOpen(false)}
                    className="px-3 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenProcessModal(selectedSettlement);
                    }}
                    className="px-4 py-1.5 bg-[#16865B] text-white rounded-lg text-xs font-semibold hover:bg-[#13724c]"
                  >
                    Disburse Payment
                  </button>
                </div>
              ) : null
            }
          >
            {(activeTab) => (
              <div className="space-y-4">
                {activeTab === 'Settlement Summary' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Beneficiary Hospital</span>
                        <span className="font-semibold text-[#102A43] text-sm">{selectedSettlement.hospitalName}</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Underwriting Carrier</span>
                        <span className="font-semibold text-[#102A43] text-sm">{selectedSettlement.insuranceCompanyName}</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Associated Claim</span>
                        <span className="font-bold text-[#2776EA] text-sm">{selectedSettlement.claimNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Net Payable Amount</span>
                        <span className="font-bold text-[#16865B] text-base">
                          PKR {selectedSettlement.settlementAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                      <h4 className="font-bold text-[#102A43] text-sm">Disbursement Schedule</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#8A97A8]">Batch Generation:</span>
                          <p className="text-[#102A43] font-medium">{selectedSettlement.createdAt}</p>
                        </div>
                        <div>
                          <span className="text-[#8A97A8]">Payment Due Date:</span>
                          <p className="text-[#102A43] font-medium">{selectedSettlement.dueDate}</p>
                        </div>
                        <div>
                          <span className="text-[#8A97A8]">Disbursed Date:</span>
                          <p className="text-[#102A43] font-medium">{selectedSettlement.paymentDate || 'Pending Execution'}</p>
                        </div>
                        <div>
                          <span className="text-[#8A97A8]">Payment Status:</span>
                          <p className="font-semibold text-[#102A43]">{selectedSettlement.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Associated Claim & Treatment' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[#8A97A8] block text-[11px]">Admitted Patient</span>
                          <span className="font-bold text-[#102A43] text-sm">
                            {linkedClaim?.memberName || 'Sarah Jenkins'}
                          </span>
                        </div>
                        <Badge value={linkedClaim?.status || 'Approved'} size="sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5EAF1]">
                        <div>
                          <span className="text-[#8A97A8] block">Policy Number</span>
                          <span className="font-semibold text-[#2776EA] font-mono">
                            {linkedClaim?.policyNumber || 'POL-2025001'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Treating Department</span>
                          <span className="font-semibold text-[#102A43]">
                            {linkedClaim?.department || 'Emergency & Inpatient Surgery'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-3">
                      <h4 className="font-bold text-[#102A43] text-sm">Clinical Event & Diagnosis</h4>
                      <p className="text-[#40516A] leading-relaxed">
                        {linkedClaim?.diagnosis || 'Acute appendicitis with laparoscopic surgical intervention and 3-day post-op stay.'}
                      </p>
                    </div>

                    <div className="border border-[#E5EAF1] rounded-xl overflow-hidden">
                      <div className="bg-[#F6F8FC] p-3 border-b border-[#E5EAF1] font-bold text-[#102A43]">
                        Itemized Hospital Adjudication Voucher
                      </div>
                      <div className="p-3.5 space-y-2 text-xs divide-y divide-[#E5EAF1]/70">
                        <div className="flex justify-between py-1">
                          <span className="text-[#66758A]">Hospital Invoiced Gross Amount:</span>
                          <span className="font-medium text-[#102A43]">
                            PKR {(linkedClaim?.submittedAmount || selectedSettlement.settlementAmount * 1.08).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#66758A]">Panel Tariff Agreement Discount (10%):</span>
                          <span className="font-medium text-[#16865B]">- PKR {(selectedSettlement.settlementAmount * 0.08).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#66758A]">Patient Co-Payment / Deductible:</span>
                          <span className="font-medium text-[#40516A]">PKR 0 (100% Cashless Treaty)</span>
                        </div>
                        <div className="flex justify-between pt-2 font-bold text-sm text-[#102A43]">
                          <span>Net Approved Settlement Amount:</span>
                          <span className="text-[#16865B]">PKR {selectedSettlement.settlementAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Bank Details' && (
                  <div className="space-y-4 text-xs">
                    <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-3">
                      <h4 className="font-bold text-[#102A43] text-sm">Remittance Information</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[#8A97A8]">Disbursement Account:</span>
                          <p className="font-medium text-[#102A43]">{selectedSettlement.bankAccountUsed || 'JPMorgan Chase Bank - Operating Account'}</p>
                        </div>
                        <div>
                          <span className="text-[#8A97A8]">Transfer Mode:</span>
                          <p className="font-medium text-[#102A43]">{selectedSettlement.paymentMethod}</p>
                        </div>
                        <div>
                          <span className="text-[#8A97A8]">Remittance Reference / FT No:</span>
                          <p className="font-mono text-[#2776EA] font-semibold">{selectedSettlement.paymentReference || 'FT-2025-99841'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DetailDrawer>
        );
      })()}

      {/* Process Settlement Modal */}
      <Modal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        title="Execute Provider Settlement Disbursement"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsProcessModalOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDisbursement}
              className="px-4 py-2 bg-[#16865B] hover:bg-[#13724c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Icon name="check" size={14} />
              Confirm & Post to Ledger
            </button>
          </div>
        }
      >
        {targetSettlement && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Settlement Slip:</span>
                <span className="font-bold text-[#102A43]">{targetSettlement.settlementNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Hospital Beneficiary:</span>
                <span className="font-medium text-[#102A43]">{targetSettlement.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Net Payable:</span>
                <span className="font-bold text-[#16865B] text-sm">
                  PKR {targetSettlement.settlementAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Debiting Bank Account *</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={`${b.bankName} - ${b.accountName}`}>
                    {b.bankName} - {b.accountName} ({b.accountNumber}) • Avail: PKR {(b.availableBalance / 1000000).toFixed(1)}M
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Bank Transfer">Bank Transfer (Fedwire / ACH Transfer)</option>
                  <option value="EFT">Fedwire Wire Transfer</option>
                  <option value="Cheque">Crossed Payee Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Payment Reference / FT No *</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] font-mono font-semibold focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>
            </div>

            <p className="text-[11px] text-[#8A97A8] bg-[#EAF2FF] p-2.5 rounded-lg border border-[#2776EA]/20">
              Completing disbursement will update claim <strong>{targetSettlement.claimNumber}</strong> to <strong>Paid</strong>, record an outgoing Claim Settlement in the general ledger, and debit the selected account.
            </p>
          </div>
        )}
      </Modal>

      {/* Generate Settlement Batch Modal */}
      <CreateSettlementBatchModal
        isOpen={isNewSettlementOpen}
        onClose={() => setIsNewSettlementOpen(false)}
      />
    </div>
  );
};
export default Settlements;
