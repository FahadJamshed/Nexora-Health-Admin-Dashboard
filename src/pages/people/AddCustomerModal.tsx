import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Customer | null;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, initialData }) => {
  const { corporateClients, insuranceCompanies, addCustomer, updateCustomer } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [ssn, setSsn] = useState('');
  const [dob, setDob] = useState('1990-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCorporateId, setSelectedCorporateId] = useState(corporateClients[0]?.id || '');
  const [selectedInsurerId, setSelectedInsurerId] = useState(insuranceCompanies[0]?.id || 'ins-001');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New York');
  const [status, setStatus] = useState<'Active' | 'Pending'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSsn(initialData.ssn || '');
      setDob(initialData.dob || '1990-05-15');
      setGender((initialData.gender as any) || 'Male');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setSelectedCorporateId(initialData.corporateClientId || '');
      setSelectedInsurerId(initialData.insuranceCompanyId || insuranceCompanies[0]?.id || 'ins-001');
      setAddress(initialData.address || '');
      setCity(initialData.city || 'New York');
      setStatus(initialData.status === 'Active' ? 'Active' : 'Pending');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const corporateClient = corporateClients.find((c) => c.id === selectedCorporateId);
    const insurer = insuranceCompanies.find((i) => i.id === selectedInsurerId);

    if (initialData) {
      updateCustomer(initialData.id, {
        name: name.trim(),
        ssn: ssn.trim() || initialData.ssn,
        dob,
        gender: gender as any,
        email: email.trim() || initialData.email,
        phone: phone.trim() || initialData.phone,
        corporateClientId: selectedCorporateId || undefined,
        corporateClientName: corporateClient?.name || (selectedCorporateId ? initialData.corporateClientName : 'Direct Individual'),
        insuranceCompanyId: selectedInsurerId,
        insuranceCompanyName: insurer?.name || initialData.insuranceCompanyName,
        address: address.trim() || initialData.address,
        city,
        status,
      });
    } else {
      addCustomer({
        name: name.trim(),
        ssn:
          ssn.trim() ||
          `SSN-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`,
        dob,
        gender: gender as any,
        email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        phone: phone.trim() || '+1 (555) 714-3829',
        corporateClientId: selectedCorporateId || undefined,
        corporateClientName: corporateClient?.name || 'Direct Individual',
        insuranceCompanyId: selectedInsurerId,
        insuranceCompanyName: insurer?.name || 'Apex Health Insurance',
        address: address.trim() || `742 Evergreen Terrace, ${city}`,
        city,
        status,
      });
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setSsn('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('New York');
    setStatus('Active');
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Customer Account: ${initialData.name}` : "Register Healthcare Customer Account"}
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
              form="add-customer-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Registering...' : 'Register Customer'}
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
            1. Identity & KYC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Contact & Sponsor
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="customer" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Subscriber & Policyholder Onboarding</p>
          <p className="text-[#66758A] mt-0.5">
            Enroll direct individual subscribers or corporate enterprise policyholders with verified KYC credentials and underwriting ties.
          </p>
        </div>
      </div>

      <form id="add-customer-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Identity & KYC */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Full Legal Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. David Harrison"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Social Security / National ID Number <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SSN-984-21-7782"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Date of Birth <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Non-binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Active">Active (Verified KYC)</option>
                <option value="Pending">Pending KYC / Documentation</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Sponsor */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Primary Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. david.harrison@horizon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Mobile Phone <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +1 (555) 714-3829"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Corporate Employer Sponsor
              </label>
              <select
                value={selectedCorporateId}
                onChange={(e) => setSelectedCorporateId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="">Direct Individual (Retail)</option>
                {corporateClients.map((corp) => (
                  <option key={corp.id} value={corp.id}>
                    {corp.name} ({corp.totalEmployees} staff)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Underwriting Partner Carrier
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
              <label className="block text-xs font-semibold text-[#102A43] mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Residential / Billing Address
              </label>
              <input
                type="text"
                placeholder="e.g. 742 Evergreen Terrace, Springfield, OR"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
