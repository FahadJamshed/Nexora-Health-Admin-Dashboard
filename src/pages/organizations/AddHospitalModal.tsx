import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Hospital | null;
}

export const AddHospitalModal: React.FC<AddHospitalModalProps> = ({ isOpen, onClose, initialData }) => {
  const { insuranceCompanies, addHospital, updateHospital } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [providerType, setProviderType] = useState<'Hospital' | 'Clinic' | 'Diagnostic Center'>('Hospital');
  const [city, setCity] = useState('New York');
  const [location, setLocation] = useState('Central Healthcare District');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([
    insuranceCompanies[0]?.name || 'Apex Health Insurance',
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    'Emergency & Trauma',
    'Intensive Care Unit (ICU)',
    'General Surgery',
    'Advanced Diagnostics',
  ]);
  const [networkStatus, setNetworkStatus] = useState<'Active' | 'Pending'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setProviderType(initialData.providerType || 'Hospital');
      setCity(initialData.city || 'New York');
      setLocation(initialData.location || 'Central Healthcare District');
      setAddress(initialData.address || '');
      setContactPerson(initialData.contactPerson || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      if (initialData.insuranceNetworks && initialData.insuranceNetworks.length > 0) {
        setSelectedNetworks(initialData.insuranceNetworks);
      }
      if (initialData.departments && initialData.departments.length > 0) {
        setSelectedDepartments(initialData.departments);
      }
      setNetworkStatus(initialData.networkStatus === 'Active' ? 'Active' : 'Pending');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const availableDepartments = [
    'Emergency & Trauma',
    'Intensive Care Unit (ICU)',
    'Cardiology & Cath Lab',
    'Orthopedics & Joint Replacement',
    'Pediatrics & Neonatal Care',
    'Oncology & Chemotherapy',
    'General Surgery',
    'Advanced Diagnostics & MRI',
  ];

  const handleToggleDept = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleToggleNetwork = (insurerName: string) => {
    setSelectedNetworks((prev) =>
      prev.includes(insurerName) ? prev.filter((n) => n !== insurerName) : [...prev, insurerName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    if (initialData) {
      updateHospital(initialData.id, {
        name: name.trim(),
        providerType,
        city,
        location: location.trim() || `${city} Medical Zone`,
        address: address.trim() || `450 Healthcare Boulevard, ${city}`,
        contactPerson: contactPerson.trim() || 'Chief Medical Administrator',
        email: email.trim() || `admissions@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
        phone: phone.trim() || '+1 (555) 789-2300',
        insuranceNetworks: selectedNetworks.length > 0 ? selectedNetworks : ['Apex Health Insurance'],
        departments: selectedDepartments,
        networkStatus,
      });
    } else {
      addHospital({
        name: name.trim(),
        providerType,
        city,
        location: location.trim() || `${city} Medical Zone`,
        address: address.trim() || `450 Healthcare Boulevard, ${city}`,
        contactPerson: contactPerson.trim() || 'Chief Medical Administrator',
        email: email.trim() || `admissions@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
        phone: phone.trim() || '+1 (555) 789-2300',
        insuranceNetworks: selectedNetworks.length > 0 ? selectedNetworks : ['Apex Health Insurance'],
        departments: selectedDepartments,
        specialties: ['Cardiology', 'Surgery', 'Pediatrics'],
        networkStatus,
      });
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setProviderType('Hospital');
    setCity('New York');
    setNetworkStatus('Active');
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Healthcare Provider: ${initialData.name}` : "Enroll Healthcare Provider Facility"}
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
              form="add-hospital-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Enrolling...' : 'Enroll Healthcare Provider'}
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
            1. Facility & Location
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. TPA & Networks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 3 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            3. Departments ({selectedDepartments.length})
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 3</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="hospital" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Cashless Medical Panel Credentialing</p>
          <p className="text-[#66758A] mt-0.5">
            Enroll hospitals, specialized clinics, or diagnostic centers with automated electronic pre-authorization and direct claims settlement.
          </p>
        </div>
      </div>

      <form id="add-hospital-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: Facility & Location */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Provider / Facility Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. St. Jude Memorial Hospital & Heart Institute"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Facility Classification <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Hospital">Tertiary Care Hospital</option>
                <option value="Clinic">Specialty Outpatient Clinic</option>
                <option value="Diagnostic Center">Diagnostic & Pathology Imaging Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Panel Network Status
              </label>
              <select
                value={networkStatus}
                onChange={(e) => setNetworkStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Active">Active Panel (Direct Cashless)</option>
                <option value="Pending">Pending Audit & Credentialing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                City / Metro Region <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Boston"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                District / Location Zone
              </label>
              <input
                type="text"
                placeholder="e.g. Longwood Medical Area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Physical Facility Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. 75 Francis St, Boston, MA 02115"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: TPA & Networks */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Medical Administrator / TPA Liaison <span className="text-[#D64545]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Marcus Vance"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  TPA Desk Email <span className="text-[#D64545]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admissions@stjudememorial.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Emergency & Pre-Auth Hot Desk Phone <span className="text-[#D64545]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 789-2300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>
            </div>

            {/* Panel Insurance Networks */}
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-2">
                Accredited Insurance Underwriting Networks
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#F6F8FC] p-3 rounded-xl border border-[#E5EAF1]">
                {insuranceCompanies.map((ins) => (
                  <label
                    key={ins.id}
                    className="flex items-center gap-2 text-xs text-[#102A43] cursor-pointer hover:text-[#2776EA] select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedNetworks.includes(ins.name)}
                      onChange={() => handleToggleNetwork(ins.name)}
                      className="rounded border-[#E5EAF1] text-[#2776EA] focus:ring-0"
                    />
                    <span>{ins.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Clinical Departments */}
        {activeTab === 3 && (
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-2">
              Operational Clinical Departments & Centers of Excellence
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1]">
              {availableDepartments.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] cursor-pointer hover:border-[#2776EA] select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept)}
                    onChange={() => handleToggleDept(dept)}
                    className="rounded border-[#E5EAF1] text-[#2776EA] focus:ring-0"
                  />
                  <span className="font-medium">{dept}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddHospitalModal;
