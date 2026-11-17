import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { CorporateClient } from '../../types';

interface AddCorporateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CorporateClient | null;
}

export const AddCorporateClientModal: React.FC<AddCorporateClientModalProps> = ({ isOpen, onClose, initialData }) => {
  const { insuranceCompanies, addCorporateClient, updateCorporateClient } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [selectedInsurerId, setSelectedInsurerId] = useState(insuranceCompanies[0]?.id || 'ins-001');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [totalEmployees, setTotalEmployees] = useState(350);
  const [annualPremium, setAnnualPremium] = useState('PKR 18,500,000');
  const [contractStart, setContractStart] = useState('01 Jan 2025');
  const [contractEnd, setContractEnd] = useState('31 Dec 2025');
  const [status, setStatus] = useState<'Active' | 'Pending' | 'Under Review'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSelectedInsurerId(initialData.insuranceCompanyId || insuranceCompanies[0]?.id || 'ins-001');
      setContactPerson(initialData.contactPerson || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setTotalEmployees(initialData.totalEmployees || 350);
      setAnnualPremium(initialData.annualPremium || 'PKR 18,500,000');
      setContractStart(initialData.contractStart || '01 Jan 2025');
      setContractEnd(initialData.contractEnd || '31 Dec 2025');
      setStatus(initialData.status === 'Active' ? 'Active' : 'Pending');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const chosenInsurer = insuranceCompanies.find((ins) => ins.id === selectedInsurerId);

    if (initialData) {
      updateCorporateClient(initialData.id, {
        name: name.trim(),
        insuranceCompanyId: selectedInsurerId,
        insuranceCompanyName: chosenInsurer?.name || initialData.insuranceCompanyName,
        contactPerson: contactPerson.trim() || 'HR Benefits Director',
        email: email.trim() || `benefits@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone.trim() || '+1 (555) 420-1980',
        totalEmployees: Number(totalEmployees) || 100,
        annualPremium: annualPremium.trim() || 'PKR 12,000,000',
        contractStart,
        contractEnd,
        status: status === 'Under Review' ? 'Pending' : status,
      });
    } else {
      addCorporateClient({
        name: name.trim(),
        insuranceCompanyId: selectedInsurerId,
        insuranceCompanyName: chosenInsurer?.name || 'Apex Health Insurance',
        contactPerson: contactPerson.trim() || 'HR Benefits Director',
        email: email.trim() || `benefits@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone.trim() || '+1 (555) 420-1980',
        totalEmployees: Number(totalEmployees) || 100,
        annualPremium: annualPremium.trim() || 'PKR 12,000,000',
        contractStart,
        contractEnd,
        status: status === 'Under Review' ? 'Pending' : status,
      });
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setTotalEmployees(350);
    setAnnualPremium('PKR 18,500,000');
    setStatus('Active');
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Corporate Client: ${initialData.name}` : "Register Corporate Client"}
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
              form="add-corp-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Registering...' : 'Register Corporate Client'}
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
            1. Corporate Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Contract & Census
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="corporate" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Enterprise Corporate Group Coverage</p>
          <p className="text-[#66758A] mt-0.5">
            Enroll corporate client accounts, assign underwriting carrier partners, and establish group policy terms for covered employee censuses.
          </p>
        </div>
      </div>

      <form id="add-corp-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Corporate Profile */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Corporate Employer Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Dynamics Global Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Underwriting Partner Carrier <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={selectedInsurerId}
                onChange={(e) => setSelectedInsurerId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                {insuranceCompanies.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name} ({ins.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                HR / Benefits Focal Person <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Foster"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Corporate HR Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rachel.foster@nexusdynamics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 782-9901"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Contract & Census */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Covered Employee Census <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                placeholder="e.g. 850"
                value={totalEmployees}
                onChange={(e) => setTotalEmployees(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Annual Contract Value / Premium <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PKR 32,500,000"
                value={annualPremium}
                onChange={(e) => setAnnualPremium(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Contract Start Date
              </label>
              <input
                type="text"
                placeholder="e.g. 01 Jan 2025"
                value={contractStart}
                onChange={(e) => setContractStart(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Contract Expiry Date
              </label>
              <input
                type="text"
                placeholder="e.g. 31 Dec 2025"
                value={contractEnd}
                onChange={(e) => setContractEnd(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Contract Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Active">Active (In Force)</option>
                <option value="Pending">Pending Underwriting</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddCorporateClientModal;
