import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { InsuredMember, Dependent } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InsuredMember | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addMember, updateMember, corporateClients, insuranceCompanies, insurancePlans } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    memberType: 'Primary' as 'Primary' | 'Spouse' | 'Child' | 'Parent',
    ssn: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '',
    email: '',
    corporateClientId: 'corp-001',
    insuranceCompanyId: 'ins-001',
    planId: 'pln-001',
    coverageStart: '2025-01-01',
    coverageEnd: '2025-12-31',
  });

  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [newDepName, setNewDepName] = useState('');
  const [newDepRelation, setNewDepRelation] = useState<'Spouse' | 'Child' | 'Parent'>('Spouse');
  const [newDepCnic, setNewDepCnic] = useState('');
  const [newDepDob, setNewDepDob] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDependent = () => {
    if (!newDepName.trim()) return;
    const dep: Dependent = {
      id: `dep-${Date.now()}`,
      name: newDepName,
      relationship: newDepRelation,
      ssn: newDepCnic || 'SSN-42101-0',
      dob: newDepDob || '2015-01-01',
      status: 'Active',
    };
    setDependents([...dependents, dep]);
    setNewDepName('');
    setNewDepCnic('');
    setNewDepDob('');
  };

  const handleRemoveDependent = (id: string) => {
    setDependents(dependents.filter((d) => d.id !== id));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Member name is required.';
    if (!formData.ssn.trim()) errs.ssn = 'SSN / ID number is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedCorp = corporateClients.find((c) => c.id === formData.corporateClientId);
      const selectedIns = insuranceCompanies.find((i) => i.id === formData.insuranceCompanyId);
      const selectedPlan = insurancePlans.find((p) => p.id === formData.planId);

      const payload: Partial<InsuredMember> = {
        name: formData.name,
        memberType: formData.memberType,
        ssn: formData.ssn,
        dob: formData.dob || '1990-01-01',
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        corporateClientId: formData.corporateClientId,
        corporateClientName: selectedCorp?.name || 'Acme Corporation',
        insuranceCompanyId: formData.insuranceCompanyId,
        insuranceCompanyName: selectedIns?.name || 'Apex Health Insurance',
        planId: formData.planId,
        insurancePlanName: selectedPlan?.name || 'Executive Health Plus',
        coverageStart: formData.coverageStart,
        coverageEnd: formData.coverageEnd,
        coverageLimit: selectedPlan?.coverageLimit || 'PKR 5,000,000',
        dependents,
      };

      if (initialData) {
        updateMember(initialData.id, payload);
      } else {
        addMember(payload);
      }

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Member: ${initialData.name}` : 'Register Insured Member'}
      description="Enroll primary policyholder and configure coverage limits and covered family dependents."
      maxWidth="max-w-2xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
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

            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#2776EA] text-[#2776EA] hover:bg-[#EAF2FF] cursor-pointer"
              >
                Next Step →
              </button>
            )}

            <button
              type="submit"
              form="add-member-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Save Member'}
            </button>
          </div>
        </div>
      }
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-5 border-b border-[#E5EAF1] pb-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              step === 1 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            1. Personal Details
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              step === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Corporate & Coverage
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              step === 3 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            3. Dependents ({dependents.length})
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Step {step} of 3</span>
      </div>

      <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Full Legal Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alexander Wright"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.name ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.name && <p className="text-[11px] text-[#D64545] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                National ID / SSN <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                placeholder="SSN-42101-1"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.ssn ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.ssn && <p className="text-[11px] text-[#D64545] mt-1">{errors.ssn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Member Category</label>
              <select
                value={formData.memberType}
                onChange={(e) => setFormData({ ...formData, memberType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              >
                <option value="Primary">Primary Policyholder</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Official Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.email ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.email && <p className="text-[11px] text-[#D64545] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Mobile Phone <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.phone ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.phone && <p className="text-[11px] text-[#D64545] mt-1">{errors.phone}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Corporate & Coverage */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Corporate Client (Employer)</label>
              <select
                value={formData.corporateClientId}
                onChange={(e) => setFormData({ ...formData, corporateClientId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              >
                {corporateClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Underwriting Insurance Company</label>
              <select
                value={formData.insuranceCompanyId}
                onChange={(e) => setFormData({ ...formData, insuranceCompanyId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              >
                {insuranceCompanies.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Healthcare Plan Tier</label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              >
                {insurancePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.planType}) — Limit: {p.coverageLimit} (Premium: {p.monthlyPremium})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Coverage Start Date</label>
              <input
                type="date"
                value={formData.coverageStart}
                onChange={(e) => setFormData({ ...formData, coverageStart: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Coverage Expiry Date</label>
              <input
                type="date"
                value={formData.coverageEnd}
                onChange={(e) => setFormData({ ...formData, coverageEnd: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Dependents */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl space-y-3">
              <h5 className="text-xs font-semibold text-[#102A43]">Add Family Dependent</h5>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Dependent Name"
                  value={newDepName}
                  onChange={(e) => setNewDepName(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#E5EAF1] rounded-lg bg-white"
                />
                <select
                  value={newDepRelation}
                  onChange={(e) => setNewDepRelation(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-[#E5EAF1] rounded-lg bg-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                </select>
                <input
                  type="text"
                  placeholder="SSN / ID"
                  value={newDepCnic}
                  onChange={(e) => setNewDepCnic(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#E5EAF1] rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddDependent}
                  className="px-3 py-1.5 bg-[#2776EA] text-white rounded-lg font-semibold hover:bg-[#1E65CF] transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>

            {dependents.length > 0 ? (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-[#8A97A8] uppercase tracking-wider">
                  Configured Dependents ({dependents.length})
                </h5>
                {dependents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-[#E5EAF1] rounded-lg text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#102A43]">{d.name}</span>
                      <span className="text-[#8A97A8] ml-2">
                        ({d.relationship} · {d.ssn})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDependent(d.id)}
                      className="text-[#D64545] hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A97A8] text-center py-4">No dependents added yet for this primary member.</p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddMemberModal;
