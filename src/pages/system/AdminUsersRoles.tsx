import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types';

export const AdminUsersRoles: React.FC = () => {
  const { adminUsers, roles, auditLogs, addAdminUser, updateAdminUser, showToast, navigate } = useApp();

  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Add Admin Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+1 (555) 123-4567');
  const [newDepartment, setNewDepartment] = useState('Claims Adjudication');
  const [newRole, setNewRole] = useState('Claims Officer');

  const filteredAdmins = adminUsers.filter((u) => {
    if (roleFilter !== 'All') {
      const rf = roleFilter.toLowerCase();
      const ur = u.role.toLowerCase();
      if (!ur.includes(rf) && !rf.includes(ur)) return false;
    }
    return true;
  });

  const totalAdmins = adminUsers.length;
  const activeCount = adminUsers.filter((u) => u.status === 'Active').length;
  const twoFactorCount = adminUsers.filter((u) => u.twoFactorEnabled).length;

  const handleOpenDetail = (u: AdminUser) => {
    setSelectedAdmin(u);
    setIsDetailOpen(true);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Validation Error', 'Name and corporate email are required.', 'error');
      return;
    }

    addAdminUser({
      name: newName,
      email: newEmail,
      phone: newPhone,
      department: newDepartment,
      role: newRole,
      status: 'Active',
      twoFactorEnabled: true,
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleToggleStatus = (u: AdminUser) => {
    const updatedStatus = u.status === 'Active' ? 'Suspended' : 'Active';
    updateAdminUser(u.id, { status: updatedStatus });
    showToast('Admin Updated', `Status for ${u.name} set to ${updatedStatus}.`, 'success');
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Admin Name',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#102A43] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {u.name.charAt(0)}
          </div>
          <div>
            <button
              onClick={() => handleOpenDetail(u)}
              className="text-left font-semibold text-[#102A43] hover:text-[#2776EA] block leading-tight"
            >
              {u.name}
            </button>
            <span className="text-[11px] text-[#8A97A8]">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (u) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF2FF] text-[#2776EA]">
          {u.role}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (u) => <span className="text-xs text-[#40516A]">{u.department}</span>,
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: (u) => <span className="text-xs text-[#8A97A8] font-mono">{u.phone}</span>,
    },
    {
      key: 'twoFactorEnabled',
      header: '2FA Security',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
            u.twoFactorEnabled ? 'bg-[#E8F6EF] text-[#16865B]' : 'bg-[#FFF5DF] text-[#D69B32]'
          }`}
        >
          <Icon name={u.twoFactorEnabled ? 'check' : 'lock'} size={12} />
          {u.twoFactorEnabled ? 'Enforced' : 'Optional'}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Active',
      sortable: true,
      render: (u) => <span className="text-xs text-[#8A97A8]">{u.lastLogin || 'Today, 10:14 AM'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (u) => <Badge value={u.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Admin Users & Roles"
        description="Manage administrative security accounts, departmental role assignments, and authentication safeguards."
        breadcrumbs={['System', 'Admin Users & Roles']}
        primaryAction={{
          label: 'Add Admin User',
          icon: 'plus',
          onClick: () => setIsAddModalOpen(true),
        }}
        secondaryActions={[
          {
            label: 'Permissions Matrix',
            icon: 'lock',
            onClick: () => navigate('Permissions'),
          },
        ]}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Admin Accounts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalAdmins}</span>
            <span className="text-xs text-[#16865B] font-semibold bg-[#E8F6EF] px-1.5 py-0.5 rounded">
              {activeCount} Active
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Staff operators</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Configured Roles</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#2776EA]">{roles.length}</span>
            <span className="text-xs text-[#8A97A8]">RBAC Tiered</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Access profiles</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">2FA Compliance</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#16865B]">{twoFactorCount}</span>
            <span className="text-xs text-[#16865B] font-semibold">
              {Math.round((twoFactorCount / totalAdmins) * 100)}% Enforced
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">FIDO2 / Authenticator</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Security Auditing</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">ISO 27001</span>
            <span className="text-xs font-semibold text-[#16865B]">Compliant</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Mandatory password cycle</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Super Admin', 'Claims Manager', 'Finance Admin', 'Operations Admin', 'Underwriter', 'Support Admin'].map(
            (role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  roleFilter === role
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            )
          )}
        </div>

        <div className="text-xs text-[#8A97A8]">
          Showing <strong>{filteredAdmins.length}</strong> of <strong>{adminUsers.length}</strong> administrators
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredAdmins}
        columns={columns}
        searchPlaceholder="Search admins by name, email, or department..."
        searchKey="name"
        onRowClick={handleOpenDetail}
        actions={[
          {
            label: 'View Admin Profile',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'Toggle Account Access',
            icon: 'lock',
            onClick: handleToggleStatus,
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedAdmin && (() => {
        const userRole = roles.find(
          (r) =>
            r.name.toLowerCase() === selectedAdmin.role.toLowerCase() ||
            selectedAdmin.role.toLowerCase().includes(r.name.toLowerCase())
        );

        const adminAuditLogs = auditLogs.filter(
          (a) =>
            a.user.toLowerCase() === selectedAdmin.name.toLowerCase() ||
            a.user.toLowerCase().includes(selectedAdmin.name.split(' ')[0].toLowerCase())
        );

        return (
          <DetailDrawer
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            title={selectedAdmin.name}
            subtitle={`${selectedAdmin.role} • ${selectedAdmin.department}`}
            badge={<Badge value={selectedAdmin.status} />}
            tabs={['Admin Profile', 'Permissions Matrix', 'Activity & Audit Trail']}
          >
            {(activeTab) => (
              <div className="space-y-4">
                {activeTab === 'Admin Profile' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                        <span className="text-[11px] text-[#8A97A8] font-medium block">Department</span>
                        <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedAdmin.department}</span>
                      </div>
                      <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                        <span className="text-[11px] text-[#8A97A8] font-medium block">Security Status</span>
                        <span className="text-base font-bold text-[#16865B] mt-0.5 block">
                          {selectedAdmin.twoFactorEnabled ? '2FA Enforced' : 'Optional'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Administrator Identity</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#8A97A8] block">Corporate Email</span>
                          <span className="font-semibold text-[#102A43]">{selectedAdmin.email}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Direct Phone</span>
                          <span className="font-semibold text-[#102A43]">{selectedAdmin.phone}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Assigned Role</span>
                          <span className="font-bold text-[#2776EA]">{selectedAdmin.role}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Last Successful Login</span>
                          <span className="font-medium text-[#102A43]">{selectedAdmin.lastLogin || 'Today, 10:14 AM'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#8A97A8] block">Role Description</span>
                          <p className="text-[#40516A] text-[11px] mt-0.5 leading-relaxed">
                            {userRole?.description || 'Authorized operational user for healthcare platform management and operational reporting.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Permissions Matrix' && (
                  <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">
                        Effective RBAC Permissions ({selectedAdmin.role})
                      </h4>
                      <span className="text-xs font-semibold text-[#2776EA]">
                        {userRole ? `${userRole.permissions.length} Modules Authorized` : 'Standard Privileges'}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { module: 'Claims Adjudication', desc: 'Review, approve, and reject clinical pre-authorizations and inpatient claims', granted: true, level: 'Full Write' },
                        { module: 'Settlements & Treasury', desc: 'Execute batch hospital payouts, bank transfers, and remittance ledgers', granted: selectedAdmin.role.includes('Finance') || selectedAdmin.role.includes('Super'), level: selectedAdmin.role.includes('Finance') || selectedAdmin.role.includes('Super') ? 'Full Write' : 'Read Only' },
                        { module: 'Organization Oversight', desc: 'Manage insurance companies, panel hospitals, and corporate employer accounts', granted: true, level: 'Full Write' },
                        { module: 'User & Member Provisioning', desc: 'Create insured member records, assign family dependents, and reset credentials', granted: true, level: 'Full Write' },
                        { module: 'Security Audit & Compliance', desc: 'Inspect forensic audit trails, tamper-proof system logs, and security policies', granted: selectedAdmin.role.includes('Super') || selectedAdmin.role.includes('Audit'), level: selectedAdmin.role.includes('Super') ? 'Full Admin' : 'Read Only' },
                      ].map((perm, idx) => (
                        <div key={idx} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#102A43] block">{perm.module}</span>
                            <span className="text-[11px] text-[#66758A]">{perm.desc}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge value={perm.level} variant={perm.granted ? 'info' : 'neutral'} size="sm" />
                            <span className={`w-2 h-2 rounded-full ${perm.granted ? 'bg-[#16865B]' : 'bg-[#8A97A8]'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Activity & Audit Trail' && (
                  <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Forensic Activity Audit</h4>
                      <span className="text-[11px] text-[#8A97A8]">Hardware token FIDO2 verified</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC]">
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Two-Factor Device</span>
                        <span className="font-semibold text-[#16865B]">YubiKey 5 NFC / Google Authenticator</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block text-[11px]">Session Inactivity Timeout</span>
                        <span className="font-semibold text-[#102A43]">15 Minutes (Mandatory)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(adminAuditLogs.length > 0 ? adminAuditLogs : [
                        { id: '1', action: 'Approved Pre-Authorization #PA-2025001', module: 'Pre-Authorizations', timestamp: 'Today, 10:14 AM', ipAddress: '198.51.100.42', status: 'Success', details: 'Authorized cashless admission at Metropolitan Medical Center' },
                        { id: '2', action: 'Exported Financial Reconciliation Batch', module: 'Settlements', timestamp: 'Yesterday, 04:30 PM', ipAddress: '198.51.100.42', status: 'Success', details: 'Generated bank remittance CSV for Chase operating account' },
                        { id: '3', action: 'Updated Policy Terms POL-2025002', module: 'Policies', timestamp: '12 May 2025, 02:15 PM', ipAddress: '198.51.100.42', status: 'Success', details: 'Endorsed increased outpatient sub-limit' },
                      ]).map((log: any) => (
                        <div key={log.id} className="p-3 border border-[#E5EAF1] rounded-lg bg-[#F8FAFC] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#102A43]">{log.action}</span>
                            <span className="text-[11px] text-[#8A97A8]">{log.timestamp}</span>
                          </div>
                          <p className="text-[#66758A] text-[11px]">{log.details}</p>
                          <div className="flex items-center justify-between text-[10px] text-[#8A97A8] font-mono pt-1">
                            <span>Module: {log.module}</span>
                            <span>IP: {log.ipAddress}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DetailDrawer>
        );
      })()}

      {/* Add Admin Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Administrator Account"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateAdmin}
              className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
            >
              Issue Credentials
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Dr. Arthur Edwards"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Corporate Email *</label>
            <input
              type="email"
              placeholder="e.g. arthur.edwards@nexorahealth.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Claims Adjudication">Claims Adjudication</option>
                <option value="Underwriting">Underwriting</option>
                <option value="Treasury & Finance">Treasury & Finance</option>
                <option value="Network Provider Ops">Network Provider Ops</option>
                <option value="Information Security">Information Security</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Role & Permission Tier *</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} - {r.description}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminUsersRoles;
