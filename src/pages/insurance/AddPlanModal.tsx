import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { InsurancePlan } from '../../types';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InsurancePlan | null;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addPlan, updatePlan, insuranceCompanies } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    insuranceCompanyId: 'ins-001',
    planType: 'Corporate' as 'Corporate' | 'Individual' | 'Family' | 'Executive' | 'Group',
    monthlyPremium: 'PKR 12,000',
    annualPremium: 'PKR 144,000',
    coverageLimit: 'PKR 3,000,000',
    inpatientLimit: 'PKR 2,500,000',
    opdLimit: 'PKR 350,000',
    description: '',
    eligibilityRules: '',
    status: 'Active' as 'Active' | 'Draft' | 'Under Review',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        insuranceCompanyId: initialData.insuranceCompanyId || 'ins-001',
        planType: initialData.planType || 'Corporate',
        monthlyPremium: initialData.monthlyPremium || 'PKR 12,000',
        annualPremium: initialData.annualPremium || 'PKR 144,000',
        coverageLimit: initialData.coverageLimit || 'PKR 3,000,000',
        inpatientLimit: 'PKR 2,500,000',
        opdLimit: 'PKR 350,000',
        description: initialData.description || '',
        eligibilityRules: '',
        status: initialData.status as any || 'Active',
      });
      setActiveTab(1);
    } else {
      setFormData({
        name: '',
        insuranceCompanyId: 'ins-001',
        planType: 'Corporate',
        monthlyPremium: 'PKR 12,000',
        annualPremium: 'PKR 144,000',
        coverageLimit: 'PKR 3,000,000',
        inpatientLimit: 'PKR 2,500,000',
        opdLimit: 'PKR 350,000',
        description: '',
        eligibilityRules: '',
        status: 'Active',
      });
      setActiveTab(1);
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Plan Name is required.';
    if (!formData.monthlyPremium.trim()) errs.monthlyPremium = 'Monthly Premium is required.';
    if (!formData.coverageLimit.trim()) errs.coverageLimit = 'Coverage Limit is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ins = insuranceCompanies.find((c) => c.id === formData.insuranceCompanyId);
      const payload: Partial<InsurancePlan> = {
        name: formData.name,
        insuranceCompanyId: formData.insuranceCompanyId,
        insuranceCompanyName: ins?.name || 'Apex Health Insurance',
        planType: formData.planType,
        monthlyPremium: formData.monthlyPremium,
        annualPremium: formData.annualPremium,
        coverageLimit: formData.coverageLimit,
        description: formData.description || 'Enterprise healthcare coverage plan with comprehensive inpatient and outpatient entitlements.',
        status: formData.status,
      };

      if (initialData) {
        updatePlan(initialData.id, payload);
      } else {
        addPlan(payload);
      }

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Plan: ${initialData.name}` : 'Create Healthcare Insurance Plan'}
      description="Configure underwriting structure, actuarial premiums, and benefit coverage schedules."
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
              form="add-plan-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Plan' : 'Publish Plan'}
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
            1. Plan Classification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Benefits & Entitlements
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <form id="add-plan-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Plan Classification */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Plan Product Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Platinum Comprehensive Corporate Plan"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.name ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.name && <p className="text-[11px] text-[#D64545] mt-1">{errors.name}</p>}
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
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Plan Classification</label>
              <select
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="Corporate">Corporate Group Plan</option>
                <option value="Individual">Individual Direct</option>
                <option value="Family">Family Floater</option>
                <option value="Executive">Executive C-Suite Care</option>
                <option value="Group">SME Commercial Group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Monthly Premium (PKR) <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.monthlyPremium}
                onChange={(e) => setFormData({ ...formData, monthlyPremium: e.target.value })}
                placeholder="PKR 14,500"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Annual Coverage Cap (PKR) <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.coverageLimit}
                onChange={(e) => setFormData({ ...formData, coverageLimit: e.target.value })}
                placeholder="PKR 5,000,000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Plan Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="Active">Active (Available for Enrollment)</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Benefits & Entitlements */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Inpatient Hospitalization Sub-limit
              </label>
              <input
                type="text"
                value={formData.inpatientLimit}
                onChange={(e) => setFormData({ ...formData, inpatientLimit: e.target.value })}
                placeholder="PKR 2,500,000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Outpatient OPD Allowance Cap
              </label>
              <input
                type="text"
                value={formData.opdLimit}
                onChange={(e) => setFormData({ ...formData, opdLimit: e.target.value })}
                placeholder="PKR 350,000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Plan Description & Entitlements</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of inpatient hospitalization, day-care surgeries, maternity, and OPD allowance..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddPlanModal;
