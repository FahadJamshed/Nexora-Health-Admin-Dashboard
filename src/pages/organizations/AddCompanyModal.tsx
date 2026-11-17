import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Company | null;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addCompany, updateCompany, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Corporate' as 'Insurance' | 'Corporate' | 'Hospital' | 'Clinic',
    registrationNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'New York',
    country: 'United States',
    address: '',
    website: '',
    status: 'Active' as 'Active' | 'Pending' | 'Inactive',
    totalMembers: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        registrationNumber: initialData.registrationNumber,
        contactPerson: initialData.contactPerson,
        email: initialData.email,
        phone: initialData.phone,
        city: initialData.city,
        country: initialData.country,
        address: initialData.address,
        website: initialData.website || '',
        status: initialData.status as any,
        totalMembers: initialData.totalMembers || 0,
      });
    } else {
      setFormData({
        name: '',
        type: 'Corporate',
        registrationNumber: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        contactPerson: '',
        email: '',
        phone: '',
        city: 'New York',
        country: 'United States',
        address: '',
        website: '',
        status: 'Active',
        totalMembers: 0,
      });
    }
    setActiveTab(1);
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Company Name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact Person is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!formData.registrationNumber.trim()) errs.registrationNumber = 'Registration Number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (initialData) {
        updateCompany(initialData.id, formData);
      } else {
        addCompany(formData);
      }
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Company: ${initialData.name}` : 'Register New Company'}
      description="Enter the legal registration, authorized contact, and organizational details."
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

            {activeTab < 3 && (
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
              form="add-company-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Register Organization'}
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
            1. Organization Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Contact & Liaison
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 3 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            3. Address & Location
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 3</span>
      </div>

      <form id="add-company-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Organization Profile */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Company / Organization Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme Corporation or Metropolitan Medical Center"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.name ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.name && <p className="text-[11px] text-[#D64545] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Organization Type <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="Corporate">Corporate Client</option>
                <option value="Insurance">Insurance Provider</option>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic / Diagnostic Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Registration Number <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="e.g. REG-CORP-2025-014"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.registrationNumber ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.registrationNumber && (
                <p className="text-[11px] text-[#D64545] mt-1">{errors.registrationNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Official Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Operating Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] bg-white"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Liaison */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Authorized Contact Person <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Rachel Foster (Director HR)"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.contactPerson ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.contactPerson && (
                <p className="text-[11px] text-[#D64545] mt-1">{errors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Official Corporate Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.email ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.email && <p className="text-[11px] text-[#D64545] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Direct Phone Number <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.phone ? 'border-[#D64545]' : 'border-[#E5EAF1]'
                } focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]`}
              />
              {errors.phone && <p className="text-[11px] text-[#D64545] mt-1">{errors.phone}</p>}
            </div>
          </div>
        )}

        {/* Tab 3: Address & Location */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="United States"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Physical Street Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter building number, street, commercial zone..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddCompanyModal;
