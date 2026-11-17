import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

interface CreateSettlementBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSettlementBatchModal: React.FC<CreateSettlementBatchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { hospitals, insuranceCompanies, bankAccounts, addSettlement } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [settlementNumber, setSettlementNumber] = useState(
    `SET-20250${Math.floor(10 + Math.random() * 90)}`
  );
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || 'HSP-001');
  const [selectedInsurerId, setSelectedInsurerId] = useState(
    insuranceCompanies[0]?.id || 'ins-001'
  );
  const [claimsCount, setClaimsCount] = useState(12);
  const [settlementAmount, setSettlementAmount] = useState('2450000');
  const [dueDate, setDueDate] = useState('28 May 2025');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'EFT' | 'Cheque'>('Bank Transfer');
  const [selectedBank, setSelectedBank] = useState(
    bankAccounts[0]?.accountName || 'JPMorgan Chase Bank - Operating Account'
  );
  const [remittanceMemo, setRemittanceMemo] = useState(
    'Batch settlement for verified inpatient and emergency medical admissions'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const chosenHospital = hospitals.find((h) => h.id === selectedHospitalId);
    const chosenInsurer = insuranceCompanies.find((i) => i.id === selectedInsurerId);

    addSettlement({
      settlementNumber,
      claimId: `clm-batch-${Math.floor(100 + Math.random() * 900)}`,
      claimNumber: `${claimsCount} Adjudicated Claims`,
      hospitalId: selectedHospitalId,
      hospitalName: chosenHospital?.name || 'General Hospital',
      insuranceCompanyId: selectedInsurerId,
      insuranceCompanyName: chosenInsurer?.name || 'Apex Health Insurance',
      settlementAmount: Number(settlementAmount) || 1500000,
      dueDate,
      paymentMethod,
      bankAccountUsed: selectedBank,
      status: 'Pending',
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSettlementNumber(`SET-20250${Math.floor(10 + Math.random() * 90)}`);
    setClaimsCount(12);
    setSettlementAmount('2450000');
    setDueDate('28 May 2025');
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Provider Settlement Batch"
      size="lg"
      footer={
        <div className="w-full flex items-center justify-between">
          <div>
            {activeTab > 1 && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC] cursor-pointer"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>

            {activeTab < 2 && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#2776EA] text-[#2776EA] hover:bg-[#EAF2FF] cursor-pointer"
              >
                Next Step →
              </button>
            )}

            <button
              type="submit"
              form="create-settlement-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Generating...' : 'Generate Settlement Batch'}
            </button>
          </div>
        </div>
      }
    >
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-5 border-b border-[#E5EAF1] pb-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 1 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            1. Batch Specification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Disbursement & Banking
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="settlements" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Healthcare Provider Remittance Processing</p>
          <p className="text-[#66758A] mt-0.5">
            Aggregate approved cashless hospital claims into an institutional remittance batch for treasury disbursement and bank clearance.
          </p>
        </div>
      </div>

      <form id="create-settlement-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Batch Specification */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Settlement Batch Reference <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                value={settlementNumber}
                onChange={(e) => setSettlementNumber(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs font-mono font-semibold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Beneficiary Healthcare Facility <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Debiting Underwriting Partner <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={selectedInsurerId}
                onChange={(e) => setSelectedInsurerId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                {insuranceCompanies.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Adjudicated Claims in Batch <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={claimsCount}
                onChange={(e) => setClaimsCount(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Total Disbursement Amount (PKR) <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="number"
                min="1000"
                required
                value={settlementAmount}
                onChange={(e) => setSettlementAmount(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs font-semibold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Disbursement & Banking */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Disbursement Scheduled Due Date <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Payment Method Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Bank Transfer">Bank Transfer (RTGS / Raast)</option>
                <option value="EFT">Electronic Funds Transfer (EFT)</option>
                <option value="Cheque">Corporate Pay Order / Crossed Cheque</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Funding Treasury Bank Account
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.accountName}>
                    {b.bankName} - {b.accountName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Remittance Memo / Audit Notes
              </label>
              <input
                type="text"
                value={remittanceMemo}
                onChange={(e) => setRemittanceMemo(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default CreateSettlementBatchModal;
