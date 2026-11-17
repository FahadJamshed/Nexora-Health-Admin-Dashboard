import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';

export interface NewUserFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'Admin' | 'Customer' | 'Member' | 'Provider';
  department: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  twoFactorEnabled: boolean;
  registrationDate: string;
  lastActivity: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser?: (user: NewUserFormData) => void;
  onUpdateUser?: (user: NewUserFormData) => void;
  initialData?: NewUserFormData | any | null;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser, onUpdateUser, initialData }) => {
  const { roles, addAdminUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<'Admin' | 'Customer' | 'Member' | 'Provider'>('Admin');
  const [department, setDepartment] = useState('Claims Adjudication');
  const [selectedRole, setSelectedRole] = useState(roles[0]?.name || 'Claims Reviewer');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [status, setStatus] = useState<'Active' | 'Pending'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      phone && setPhone(initialData.phone || '');
      setUserType(initialData.userType || 'Admin');
      setDepartment(initialData.department || 'Claims Adjudication');
      setSelectedRole(initialData.role || roles[0]?.name || 'Claims Reviewer');
      setTwoFactorEnabled(initialData.twoFactorEnabled !== false);
      setStatus(initialData.status === 'Inactive' ? 'Pending' : (initialData.status || 'Active'));
      setActiveTab(1);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const newUser: NewUserFormData = {
      id: initialData?.id || `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 012-3456',
      userType,
      department: department.trim() || 'Operations',
      role: selectedRole,
      status,
      twoFactorEnabled,
      registrationDate: initialData?.registrationDate || 'Today',
      lastActivity: 'Just now',
    };

    if (initialData && onUpdateUser) {
      onUpdateUser(newUser);
      showToast('User Updated', `${newUser.name} details have been saved.`);
    } else if (onAddUser) {
      onAddUser(newUser);
      if (userType === 'Admin') {
        addAdminUser({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          department: newUser.department,
          role: newUser.role,
          status: newUser.status,
        });
      } else {
        showToast('User Provisioned', `${newUser.name} created as ${newUser.userType}.`);
      }
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setUserType('Admin');
    setDepartment('Claims Adjudication');
    setStatus('Active');
    setTwoFactorEnabled(true);
    setActiveTab(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit User: ${initialData.name}` : "Provision User Account"}
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
              form="add-user-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save User' : 'Provision User Account'}
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
            1. User Identity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`font-semibold pb-1 border-b-2 cursor-pointer ${
              activeTab === 2 ? 'border-[#2776EA] text-[#2776EA]' : 'border-transparent text-[#66758A]'
            }`}
          >
            2. Role & Security
          </button>
        </div>
        <span className="text-[11px] text-[#8A97A8]">Tab {activeTab} of 2</span>
      </div>

      <div className="bg-[#F6F8FC] border border-[#E5EAF1] rounded-xl p-3.5 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center flex-shrink-0">
          <Icon name="users" size={16} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-[#102A43]">Unified IAM Access Provisioning</p>
          <p className="text-[#66758A] mt-0.5">
            Issue secure platform credentials, bind role-based access control (RBAC), and enforce MFA authentication policies.
          </p>
        </div>
      </div>

      <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tab 1: User Identity */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Full Legal Name <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Christopher Cole"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Corporate / System Email <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. c.cole@nexorahealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 321-9087"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Initial Account State
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Active">Active & Enabled</option>
                <option value="Pending">Pending Email Activation</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Role & Security */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  User Domain Classification <span className="text-[#D64545]">*</span>
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Admin">Admin (Internal Operations)</option>
                  <option value="Provider">Provider (Hospital / Clinic Desk)</option>
                  <option value="Customer">Customer (Corporate HR / Subscriber)</option>
                  <option value="Member">Member (Insured Individual)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Department / Functional Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Claims Review / Medical Audit"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  RBAC Security Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5EAF1] text-xs text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security Preferences */}
            <div className="bg-[#F6F8FC] p-3.5 rounded-xl border border-[#E5EAF1]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#102A43]">Enforce Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-[#66758A]">
                    Requires mandatory 6-digit TOTP / SMS verification on every sign-in attempt.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5EAF1] text-[#2776EA] focus:ring-0"
                />
              </label>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddUserModal;
