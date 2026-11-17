import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { InsuranceCompany } from '../../types';

interface AddInsuranceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InsuranceCompany | null;
}

export const AddInsuranceProviderModal: React.FC<AddInsuranceProviderModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addInsuranceCompany, updateInsuranceCompany } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [settlementTurnaroundDays, setSettlementTurnaroundDays] = useState(5);
  const [rating, setRating] = useState('A+ (Superior)');
  const [status, setStatus] = useState<'Active' | 'Under Review'>('Active');
  const [supportedPlans, setSupportedPlans] = useState<string[]>([
    'Comprehensive Inpatient Hospitalization',
    'Outpatient Diagnostic & OPD',
    'Executive Preventive Health Plus',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactPerson(initialData.contactPerson || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setSettlementTurnaroundDays(initialData.settlementTurnaroundDays || 5);
      setStatus(initialData.status === 'Active' ? 'Active' : 'Under Review');
      if (initialData.supportedPlans && initialData.supportedPlans.length > 0) {
        setSupportedPlans(initialData.supportedPlans);
      }
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const planOptions = [
    'Comprehensive Inpatient Hospitalization',
    'Outpatient Diagnostic & OPD',
    'Executive Preventive Health Plus',
    'Maternity & Newborn Care',
    'Critical Illness & Oncology Care',
    'Emergency Evacuation & Cashless Trauma',
  ];

  const handleTogglePlan = (plan: string) => {
    setSupportedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    if (initialData) {
      updateInsuranceCompany(initialData.id, {
        name: name.trim(),
        contactPerson: contactPerson.trim() || 'Chief Underwriting Officer',
        email: email.trim() || `underwriting@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone.trim() || '+1 (555) 890-4122',
        settlementTurnaroundDays: Number(settlementTurnaroundDays) || 5,
        status: status === 'Under Review' ? 'Pending' : status,
        supportedPlans: supportedPlans.length > 0 ? supportedPlans : ['Comprehensive Inpatient Care'],
      });
    } else {
      addInsuranceCompany({
        name: name.trim(),
        contactPerson: contactPerson.trim() || 'Chief Underwriting Officer',
        email: email.trim() || `underwriting@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone.trim() || '+1 (555) 890-4122',
        settlementTurnaroundDays: Number(settlementTurnaroundDays) || 5,
        activePlans: supportedPlans.length,
        status: status === 'Under Review' ? 'Pending' : status,
        supportedPlans: supportedPlans.length > 0 ? supportedPlans : ['Comprehensive Inpatient Care'],
      });
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setLicenseNumber('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setSettlementTurnaroundDays(5);
    setRating('A+ (Superior)');
    setStatus('Active');
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Insurance Carrier: ${initialData.name}` : "Register Insurance Carrier Partner"}
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
              form="add-carrier-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Registering...' : 'Register Carrier Partner'}
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
            1. Carrier Profile & License
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Underwriting & Plan Lines
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="insurance" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Underwriting Risk & Claims Adjudication Partner</p>
          <p className="text-[#66758A] mt-0.5">
            Onboard a licensed insurance underwriting carrier into Nexora Health's enterprise adjudication and policy management network.
          </p>
        </div>
      </div>

      <form id="add-carrier-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Carrier Profile & License */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Insurance Carrier Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Beacon Mutual Assurance Co."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                NAIC / Regulatory License Number <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NAIC-884210"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                AM Best Financial Strength Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="A++ (Superior)">A++ (Superior)</option>
                <option value="A+ (Superior)">A+ (Superior)</option>
                <option value="A (Excellent)">A (Excellent)</option>
                <option value="A- (Very Good)">A- (Very Good)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Chief Underwriter / Focal Liaison <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kenneth Montgomery"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Official Underwriting Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. k.montgomery@beaconmutual.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Direct Phone / Hot Desk
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 392-1084"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Underwriting & Plan Lines */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Claims Settlement SLA (Turnaround Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settlementTurnaroundDays}
                  onChange={(e) => setSettlementTurnaroundDays(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Underwriting Network Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Active">Active Carrier (Full Authority)</option>
                  <option value="Under Review">Under Compliance Audit</option>
                </select>
              </div>
            </div>

            {/* Supported Health Plan Classes */}
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-2">
                Authorized Plan Classes & Coverage Lines
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#F6F8FC] p-3 rounded-xl border border-[#E5EAF1]">
                {planOptions.map((plan) => (
                  <label
                    key={plan}
                    className="flex items-center gap-2 text-xs text-[#102A43] cursor-pointer hover:text-[#2776EA] select-none"
                  >
                    <input
                      type="checkbox"
                      checked={supportedPlans.includes(plan)}
                      onChange={() => handleTogglePlan(plan)}
                      className="rounded border-[#E5EAF1] text-[#2776EA] focus:ring-0"
                    />
                    <span>{plan}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddInsuranceProviderModal;
