import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Policy | null;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addPolicy, updatePolicy, insuranceCompanies, insurancePlans, corporateClients } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    policyNumber: `POL-2025-${Math.floor(100 + Math.random() * 900)}`,
    planId: 'pln-001',
    insuranceCompanyId: 'ins-001',
    corporateClientId: 'corp-001',
    policyholderName: 'Acme Corporation',
    coverageAmount: 'PKR 5,000,000',
    monthlyPremium: 'PKR 14,500',
    startDate: '2025-01-01',
    expiryDate: '2025-12-31',
    status: 'Active' as 'Active' | 'Under Review' | 'Expired',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.policyNumber.trim()) errs.policyNumber = 'Policy Number is required.';
    if (!formData.policyholderName.trim()) errs.policyholderName = 'Policyholder Name is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ins = insuranceCompanies.find((c) => c.id === formData.insuranceCompanyId);
      const plan = insurancePlans.find((p) => p.id === formData.planId);
      const corp = corporateClients.find((c) => c.id === formData.corporateClientId);

      const payload: Partial<Policy> = {
        policyNumber: formData.policyNumber,
        planId: formData.planId,
        planName: plan?.name || 'Executive Health Plus',
        insuranceCompanyId: formData.insuranceCompanyId,
        insuranceCompanyName: ins?.name || 'Apex Health Insurance',
        corporateClientId: formData.corporateClientId,
        corporateClientName: corp?.name || 'Acme Corporation',
        policyholderName: formData.policyholderName,
        coverageAmount: formData.coverageAmount,
        monthlyPremium: formData.monthlyPremium,
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        status: formData.status,
      };

      if (initialData) {
        updatePolicy(initialData.id, payload);
      } else {
        addPolicy(payload);
      }

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Policy: ${initialData.policyNumber}` : 'Issue Healthcare Insurance Policy'}
      description="Bind policy agreement, link underwriting terms, and establish coverage term dates."
      maxWidth="max-w-2xl"
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
              form="add-policy-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Issuing...' : initialData ? 'Save Changes' : 'Issue Policy Agreement'}
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
            1. Policy Agreement
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Policyholder & Term
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <form id="add-policy-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Policy Agreement */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Policy Agreement Number <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                placeholder="POL-2025-001"
                className={`w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border ${
                  errors.policyNumber ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.policyNumber && (
                <p className="text-[11px] text-[#D64545] mt-1">{errors.policyNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Underwritten Health Plan</label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                {insurancePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Underwriting Carrier</label>
              <select
                value={formData.insuranceCompanyId}
                onChange={(e) => setFormData({ ...formData, insuranceCompanyId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                {insuranceCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Policy Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="Active">Active (In Force)</option>
                <option value="Under Review">Under Review</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Policyholder & Term */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Policyholder / Corporate Sponsor <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.policyholderName}
                onChange={(e) => setFormData({ ...formData, policyholderName: e.target.value })}
                placeholder="e.g. Acme Corporation or Alexander Wright"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.policyholderName ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.policyholderName && (
                <p className="text-[11px] text-[#D64545] mt-1">{errors.policyholderName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Associated Corporate Group</label>
              <select
                value={formData.corporateClientId}
                onChange={(e) => setFormData({ ...formData, corporateClientId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="">None (Individual Subscriber)</option>
                {corporateClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Coverage Limit (PKR)</label>
              <input
                type="text"
                value={formData.coverageAmount}
                onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Monthly Premium (PKR)</label>
              <input
                type="text"
                value={formData.monthlyPremium}
                onChange={(e) => setFormData({ ...formData, monthlyPremium: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Effective Inception Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Policy Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddPolicyModal;
