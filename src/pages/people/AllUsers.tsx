import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import AddUserModal, { NewUserFormData } from './AddUserModal';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'Admin' | 'Customer' | 'Member' | 'Provider';
  registrationDate: string;
  lastActivity: string;
  status: 'Active' | 'Inactive' | 'Pending';
  department?: string;
  twoFactorEnabled?: boolean;
}

export const AllUsers: React.FC = () => {
  const { showToast, auditLogs, roles, navigate } = useApp();

  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'usr-001', name: 'Sarah Jenkins', email: 'sarah.jenkins@acmecorp.com', phone: '+1 (555) 845-2291', userType: 'Admin', registrationDate: '15 Jan 2024', lastActivity: 'Today, 10:42 AM', status: 'Active', department: 'Executive Management', twoFactorEnabled: true },
    { id: 'usr-002', name: 'Alexander Wright', email: 'alexander.w@apexhealth.com', phone: '+1 (555) 456-7890', userType: 'Member', registrationDate: '20 Jan 2024', lastActivity: 'Yesterday, 3:15 PM', status: 'Active', department: 'Enterprise Subscriber', twoFactorEnabled: true },
    { id: 'usr-003', name: 'Emily Davis', email: 'emily.d@guardianmutual.com', phone: '+1 (555) 212-4567', userType: 'Customer', registrationDate: '03 Feb 2024', lastActivity: '12 May 2025', status: 'Active', department: 'Retail Policyholder', twoFactorEnabled: false },
    { id: 'usr-004', name: 'Michael Carter', email: 'michael.carter@nexustech.com', phone: '+1 (555) 678-9012', userType: 'Member', registrationDate: '10 Feb 2024', lastActivity: '14 May 2025', status: 'Active', department: 'Corporate Group Health', twoFactorEnabled: true },
    { id: 'usr-005', name: 'Jessica Taylor', email: 'jessica.taylor@globallogistics.com', phone: '+1 (555) 345-6789', userType: 'Customer', registrationDate: '18 Feb 2024', lastActivity: '10 May 2025', status: 'Active', department: 'Corporate Plan Sponsor', twoFactorEnabled: true },
    { id: 'usr-006', name: 'Dr. David Miller', email: 'david.m@stjudememorial.org', phone: '+1 (555) 234-5678', userType: 'Provider', registrationDate: '25 Feb 2024', lastActivity: '08 May 2025', status: 'Active', department: 'Medical Review Desk', twoFactorEnabled: true },
    { id: 'usr-007', name: 'Olivia Martinez', email: 'olivia.martinez@summitenergy.com', phone: '+1 (555) 876-5432', userType: 'Member', registrationDate: '05 Mar 2024', lastActivity: '05 May 2025', status: 'Active', department: 'Operations Group', twoFactorEnabled: false },
    { id: 'usr-008', name: 'James Wilson', email: 'james.w@acmecorp.com', phone: '+1 (555) 456-7891', userType: 'Member', registrationDate: '12 Mar 2024', lastActivity: '02 May 2025', status: 'Inactive', department: 'Logistics Team', twoFactorEnabled: false },
    { id: 'usr-009', name: 'Fiona Nelson', email: 'fiona.n@chase.com', phone: '+1 (555) 234-5679', userType: 'Customer', registrationDate: '20 Mar 2024', lastActivity: '30 Apr 2025', status: 'Active', department: 'Financial Risk Group', twoFactorEnabled: true },
    { id: 'usr-010', name: 'Oliver Quinn', email: 'oliver.quinn@cascadetelecom.com', phone: '+1 (555) 987-6543', userType: 'Member', registrationDate: '28 Mar 2024', lastActivity: '25 Apr 2025', status: 'Pending', department: 'Engineering Staff', twoFactorEnabled: false },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    if (typeFilter !== 'All' && u.userType !== typeFilter) return false;
    return true;
  });

  const columns: Column<UserRecord>[] = [
    {
      key: 'name',
      header: 'User / Account',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{u.name}</div>
            <span className="text-[11px] text-[#8A97A8]">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      render: (u) => <span className="text-[#40516A]">{u.phone}</span>,
    },
    {
      key: 'userType',
      header: 'User Category',
      sortable: true,
      render: (u) => (
        <Badge
          value={u.userType}
          variant={u.userType === 'Admin' ? 'error' : u.userType === 'Provider' ? 'warning' : 'info'}
          size="sm"
        />
      ),
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      sortable: true,
      render: (u) => <span className="text-[#8A97A8]">{u.registrationDate}</span>,
    },
    {
      key: 'lastActivity',
      header: 'Last Active',
      sortable: true,
      render: (u) => <span className="text-[#102A43] font-medium">{u.lastActivity}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (u) => <Badge value={u.status} size="sm" />,
    },
  ];

  const handleView = (u: UserRecord) => {
    setSelectedUser(u);
    setActiveTab('Overview');
    setIsDetailOpen(true);
  };

  // Find user audit logs or generate relatable entries
  const userAuditEntries = selectedUser
    ? auditLogs.filter(
        (log) =>
          log.user.toLowerCase() === selectedUser.name.toLowerCase() ||
          log.user.toLowerCase().includes(selectedUser.name.split(' ')[0].toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="All Users"
        description="Global authentication registry across administrators, corporate subscribers, insured members, and hospital desk operators."
        breadcrumbs={['People', 'All Users']}
        primaryAction={{
          label: 'Add User',
          icon: 'plus',
          onClick: () => setIsAddUserOpen(true),
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Platform Users</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">48,520</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Accounts</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">44,280</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Pending Invites</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">1,400</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Inactive / Suspended</span>
          <span className="text-xl font-bold text-[#66758A] block mt-0.5">2,840</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchPlaceholder="Search by user name, email, or category..."
        statusKey="status"
        extraFilters={
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8A97A8] font-medium hidden sm:inline">Role:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-[#E5EAF1] rounded-lg bg-white text-[#40516A] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20"
            >
              <option value="All">All Categories</option>
              <option value="Admin">Administrator</option>
              <option value="Customer">Customer</option>
              <option value="Member">Insured Member</option>
              <option value="Provider">Hospital Provider</option>
            </select>
          </div>
        }
        onView={handleView}
        onEdit={(u) => {
          setEditingUser(u);
          setIsAddUserOpen(true);
        }}
        onDelete={(u) => {
          setUsers((prev) => prev.filter((x) => x.id !== u.id));
          showToast('User Deleted', `${u.name} was removed from the directory.`, 'info');
        }}
        actions={[
          {
            label: 'View User Profile',
            icon: 'eye',
            onClick: handleView,
          },
          {
            label: 'Open Sub-Module',
            icon: 'chevron-right',
            onClick: (u) => {
              if (u.userType === 'Admin') navigate('Admin Users & Roles');
              else if (u.userType === 'Customer') navigate('Customers');
              else if (u.userType === 'Member') navigate('Insured Members');
              else navigate('Hospitals & Clinics');
            },
          },
        ]}
      />

      {/* User Detail Drawer */}
      {selectedUser && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser.name}
          subtitle={`Platform User (${selectedUser.userType}) • ${selectedUser.id}`}
          status={selectedUser.status}
          avatarInitials={selectedUser.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Security & Access', 'Activity Log']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit User',
              variant: 'primary',
              icon: 'edit',
              onClick: () => {
                setIsDetailOpen(false);
                setEditingUser(selectedUser);
                setIsAddUserOpen(true);
              },
            },
            {
              label: 'Reset Password',
              variant: 'secondary',
              onClick: () => showToast('Password Reset', `Password reset token sent to ${selectedUser.email}.`),
            },
            {
              label: selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account',
              variant: selectedUser.status === 'Active' ? 'secondary' : 'primary',
              onClick: () => {
                const updated = users.map((u) =>
                  u.id === selectedUser.id ? { ...u, status: (u.status === 'Active' ? 'Inactive' : 'Active') as any } : u
                );
                setUsers(updated);
                setSelectedUser({
                  ...selectedUser,
                  status: selectedUser.status === 'Active' ? 'Inactive' : 'Active',
                });
                showToast(
                  'Account Updated',
                  `User ${selectedUser.name} is now ${selectedUser.status === 'Active' ? 'Inactive' : 'Active'}.`,
                  'success'
                );
              },
            },
            {
              label: 'Delete User',
              variant: 'danger',
              onClick: () => {
                setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
                setIsDetailOpen(false);
                showToast('User Deleted', `${selectedUser.name} was removed.`, 'info');
                setSelectedUser(null);
              },
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Account Category</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">{selectedUser.userType}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Account Status</span>
                  <span className="text-base font-bold text-[#16865B] mt-0.5 block">{selectedUser.status}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">MFA Protected</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">
                    {selectedUser.twoFactorEnabled ? 'Enforced' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">User Profile Details</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Corporate Email</span>
                    <span className="font-semibold text-[#102A43]">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Phone Number</span>
                    <span className="font-semibold text-[#102A43]">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Assigned Department</span>
                    <span className="font-semibold text-[#102A43]">{selectedUser.department || 'Operations'}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Account Identifier</span>
                    <span className="font-mono font-semibold text-[#2776EA]">{selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Enrollment Date</span>
                    <span className="font-semibold text-[#102A43]">{selectedUser.registrationDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Last Platform Activity</span>
                    <span className="font-semibold text-[#102A43]">{selectedUser.lastActivity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Role Permissions Summary</h4>
                <p className="text-xs text-[#40516A] leading-relaxed mb-3">
                  {selectedUser.userType === 'Admin'
                    ? 'Granted elevated platform privileges: claims adjudication, member provisioning, organizational oversight, and ledger auditing.'
                    : selectedUser.userType === 'Provider'
                    ? 'Hospital desk operator access: submit cashless pre-authorizations, upload discharge summaries, and track batch settlement disbursements.'
                    : selectedUser.userType === 'Customer'
                    ? 'Policy sponsor access: manage corporate subscriber roster, view monthly invoices, and monitor group claim utilization ratios.'
                    : 'Insured member portal: download digital insurance card, view policy benefits, and submit outpatient reimbursement claims.'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedUser.userType === 'Admin'
                    ? ['Claims Review', 'Policy Issue', 'Reconciliation', 'Audit Access', 'User Provisioning']
                    : selectedUser.userType === 'Provider'
                    ? ['Cashless Pre-Auth', 'Document Upload', 'Billing Ledger', 'Treatment History']
                    : selectedUser.userType === 'Customer'
                    ? ['Roster Management', 'Billing Statements', 'Coverage Limits', 'Plan Schedule']
                    : ['Digital Card', 'Benefit Schedule', 'File Claim', 'Dependents List']
                  ).map((perm, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6F8FC] border border-[#E5EAF1] text-[#40516A]">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security & Access' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Authentication & Identity Safeguards</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#102A43]">Two-Factor Authentication</span>
                      <Badge value={selectedUser.twoFactorEnabled ? 'Enforced' : 'Not Configured'} variant={selectedUser.twoFactorEnabled ? 'success' : 'warning'} size="sm" />
                    </div>
                    <p className="text-[#66758A] text-[11px]">
                      {selectedUser.twoFactorEnabled
                        ? 'Hardware token (FIDO2 / YubiKey) and TOTP Authenticator application registered.'
                        : 'SMS OTP backup only. Multi-factor authentication is recommended for enterprise accounts.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#102A43]">Password Expiry Cycle</span>
                      <Badge value="Valid (48 Days Left)" variant="info" size="sm" />
                    </div>
                    <p className="text-[#66758A] text-[11px]">
                      Last rotated on 15 Feb 2025. Policy requires 90-day cryptographic password refresh.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E5EAF1] bg-white space-y-3">
                  <h5 className="font-bold text-xs text-[#102A43]">Active Authentication Sessions</h5>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-xs">
                          <Icon name="check" size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-[#102A43] block">Chrome 124 • macOS Sonoma (Current Session)</span>
                          <span className="text-[11px] text-[#8A97A8]">IP: 198.51.100.42 • New York, United States</span>
                        </div>
                      </div>
                      <Badge value="Active Now" variant="success" size="sm" />
                    </div>

                    <div className="p-3 rounded-lg border border-[#E5EAF1] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F6F8FC] text-[#66758A] flex items-center justify-center font-bold text-xs">
                          <Icon name="lock" size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-[#102A43] block">Safari Mobile • iOS 18 (Nexora App)</span>
                          <span className="text-[11px] text-[#8A97A8]">IP: 203.0.113.19 • Austin, United States</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Session Terminated', 'Remote iOS mobile session was revoked.', 'info')}
                        className="text-xs font-semibold text-[#D64545] hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Activity Log' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Forensic Audit History</h4>
                <span className="text-[11px] text-[#8A97A8]">Audit records retained for 7 years</span>
              </div>

              {userAuditEntries.length > 0 ? (
                <div className="space-y-2.5">
                  {userAuditEntries.map((log) => (
                    <div key={log.id} className="p-3 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] text-xs flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#102A43]">{log.action}</span>
                          <Badge value={log.status} size="sm" />
                        </div>
                        <p className="text-[#66758A] text-[11px]">{log.details}</p>
                        <span className="text-[10px] text-[#8A97A8] block font-mono">
                          IP: {log.ipAddress} • Module: {log.module}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#8A97A8] flex-shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { action: 'Portal Authentication Success', details: 'User logged in via FIDO2 authenticator', time: selectedUser.lastActivity, ip: '198.51.100.42' },
                    { action: 'Viewed Member Benefits', details: 'Navigated to policy schedule and coverage entitlements', time: '14 May 2025, 02:18 PM', ip: '198.51.100.42' },
                    { action: 'Profile Contact Updated', details: 'Updated emergency phone contact and notification preferences', time: '10 May 2025, 11:05 AM', ip: '198.51.100.42' },
                    { action: 'Password Security Rotation', details: 'Cryptographic credential refresh completed', time: '15 Feb 2025, 09:30 AM', ip: '192.0.2.14' },
                  ].map((entry, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] text-xs flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#102A43]">{entry.action}</span>
                          <Badge value="Success" size="sm" />
                        </div>
                        <p className="text-[#66758A] text-[11px]">{entry.details}</p>
                        <span className="text-[10px] text-[#8A97A8] block font-mono">IP: {entry.ip}</span>
                      </div>
                      <span className="text-[11px] font-medium text-[#8A97A8] flex-shrink-0">{entry.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Provision User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => {
          setIsAddUserOpen(false);
          setEditingUser(null);
        }}
        initialData={editingUser}
        onAddUser={(newUser) => setUsers((prev) => [newUser, ...prev])}
        onUpdateUser={(updatedUser) => {
          setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
          if (selectedUser?.id === updatedUser.id) {
            setSelectedUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
          }
        }}
      />
    </div>
  );
};

export default AllUsers;
