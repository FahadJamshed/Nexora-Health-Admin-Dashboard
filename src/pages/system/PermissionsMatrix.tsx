import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

export const PermissionsMatrix: React.FC = () => {
  const { roles, updateRolePermission, addRole, deleteRole, showToast, resetToDefaults } = useApp();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-001');
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'profile' | 'scope'>('profile');

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [baselineAccess, setBaselineAccess] = useState<'Read Only' | 'Standard Operational' | 'Privileged'>('Standard Operational');

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleCheckboxToggle = (
    moduleName: string,
    permissionKey: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export',
    currentValue: boolean
  ) => {
    updateRolePermission(selectedRoleId, moduleName, permissionKey, !currentValue);
  };

  const handleSaveMatrix = () => {
    showToast(
      'Permissions Committed',
      `Access control policies for role "${selectedRole?.name}" saved to runtime policy engine.`,
      'success'
    );
  };

  const handleCloneRole = () => {
    if (!selectedRole) return;
    const cloned = addRole({
      name: `${selectedRole.name} (Copy)`,
      description: `Cloned snapshot of ${selectedRole.name}. ${selectedRole.description}`,
      permissions: selectedRole.permissions.map((p) => ({ ...p })),
    });
    setSelectedRoleId(cloned.id);
  };

  const handleDeleteCurrentRole = () => {
    if (!selectedRole) return;
    if (selectedRole.id === 'role-001' || selectedRole.name.toLowerCase().includes('super admin')) {
      showToast('Action Prohibited', 'The Super Administrator root role cannot be deleted.', 'error');
      return;
    }
    const roleName = selectedRole.name;
    deleteRole(selectedRole.id);
    setSelectedRoleId(roles[0]?.id || 'role-001');
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showToast('Validation Error', 'Role title is required.', 'error');
      return;
    }

    const defaultModules = [
      'Overview & Reports',
      'Organizations',
      'People & Members',
      'Insurance Plans & Policies',
      'Claims & Pre-Authorizations',
      'Settlements & Finance',
      'Audit Logs & System Settings',
    ];

    const permissions = defaultModules.map((module) => {
      if (baselineAccess === 'Read Only') {
        return { module, view: true, create: false, edit: false, delete: false, approve: false, export: true };
      }
      if (baselineAccess === 'Privileged') {
        return { module, view: true, create: true, edit: true, delete: true, approve: true, export: true };
      }
      // Standard Operational
      return {
        module,
        view: true,
        create: module !== 'Audit Logs & System Settings',
        edit: module !== 'Audit Logs & System Settings',
        delete: false,
        approve: module.includes('Claims'),
        export: true,
      };
    });

    const newRole = addRole({
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || `Configured with ${baselineAccess} baseline access.`,
      permissions,
    });

    setSelectedRoleId(newRole.id);
    setIsAddRoleOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Role & Permissions Matrix"
        description="Granular Role-Based Access Control (RBAC) security matrix enforcing least privilege across platform operations."
        breadcrumbs={['System', 'Permissions']}
        primaryAction={{
          label: 'Create Custom Role',
          icon: 'plus',
          onClick: () => setIsAddRoleOpen(true),
        }}
        secondaryActions={[
          {
            label: 'Save Access Rules',
            icon: 'check',
            onClick: handleSaveMatrix,
          },
          {
            label: 'Clone Role',
            icon: 'copy',
            onClick: handleCloneRole,
          },
          ...(selectedRole && selectedRole.id !== 'role-001' && !selectedRole.name.toLowerCase().includes('super admin')
            ? [
                {
                  label: 'Delete Role',
                  icon: 'trash',
                  onClick: handleDeleteCurrentRole,
                },
              ]
            : []),
          {
            label: 'Export Matrix (CSV)',
            icon: 'export',
            onClick: () => showToast('Exported', 'Security access matrix downloaded.', 'info'),
          },
        ]}
      />

      {/* Role Selector Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8] block mb-2">
          Select Role to Configure:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRoleId === r.id
                  ? 'border-[#2776EA] bg-[#EAF2FF] shadow-xs'
                  : 'border-[#E5EAF1] bg-white hover:bg-[#F6F8FC]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#102A43]">{r.name}</span>
                {selectedRoleId === r.id && (
                  <span className="w-2 h-2 rounded-full bg-[#2776EA]" />
                )}
              </div>
              <span className="text-[11px] text-[#8A97A8] block mt-1">
                {r.usersCount || 1} assigned users
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Role Description Banner */}
      {selectedRole && (
        <div className="bg-[#102A43] text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">{selectedRole.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/90">
                Security Policy Group
              </span>
              {selectedRole.id !== 'role-001' && !selectedRole.name.toLowerCase().includes('super admin') && (
                <button
                  type="button"
                  onClick={handleDeleteCurrentRole}
                  className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-medium transition-colors"
                  title="Delete this custom role"
                >
                  <Icon name="trash" className="w-3.5 h-3.5" />
                  Delete Role
                </button>
              )}
            </div>
            <p className="text-xs text-[#E5EAF1]/80 mt-0.5">{selectedRole.description}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#E5EAF1]/70 block">Enforced Standard</span>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-2 py-0.5 rounded">
              ISO/IEC 27001
            </span>
          </div>
        </div>
      )}

      {/* Interactive Permission Grid */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E5EAF1] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#102A43] text-sm">Privilege Assignment Table</h3>
            <p className="text-xs text-[#8A97A8]">
              Checkboxes grant or revoke capabilities. Changes are reactive and persistent.
            </p>
          </div>
          <button
            onClick={() => {
              resetToDefaults();
              showToast('Reset Baseline', 'Re-applied default system permissions.', 'info');
            }}
            className="text-xs text-[#66758A] hover:text-[#102A43] font-medium"
          >
            Reset to Default
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F8FC] text-[#66758A] border-b border-[#E5EAF1]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#102A43] w-1/4">System Module</th>
                <th className="py-3 px-3 font-semibold text-center">View / Read</th>
                <th className="py-3 px-3 font-semibold text-center">Create</th>
                <th className="py-3 px-3 font-semibold text-center">Edit / Update</th>
                <th className="py-3 px-3 font-semibold text-center">Delete / Revoke</th>
                <th className="py-3 px-3 font-semibold text-center">Approve / Settle</th>
                <th className="py-3 px-3 font-semibold text-center">Export Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1]">
              {selectedRole?.permissions.map((perm) => (
                <tr key={perm.module} className="hover:bg-[#F6F8FC]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#102A43]">
                    {perm.module}
                  </td>

                  {/* View */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.view}
                      onChange={() => handleCheckboxToggle(perm.module, 'view', perm.view)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>

                  {/* Create */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.create}
                      onChange={() => handleCheckboxToggle(perm.module, 'create', perm.create)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>

                  {/* Edit */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.edit}
                      onChange={() => handleCheckboxToggle(perm.module, 'edit', perm.edit)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>

                  {/* Delete */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.delete}
                      onChange={() => handleCheckboxToggle(perm.module, 'delete', perm.delete)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>

                  {/* Approve */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.approve}
                      onChange={() => handleCheckboxToggle(perm.module, 'approve', perm.approve)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>

                  {/* Export */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={perm.export}
                      onChange={() => handleCheckboxToggle(perm.module, 'export', perm.export)}
                      className="w-4 h-4 rounded text-[#2776EA] border-[#E5EAF1] focus:ring-[#2776EA] cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Custom Role Modal with Tabs & Sticky Footer */}
      <Modal
        isOpen={isAddRoleOpen}
        onClose={() => setIsAddRoleOpen(false)}
        title="Create Custom Security Role"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveRoleTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeRoleTab === 'profile' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Role Profile & Scope
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab('scope')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeRoleTab === 'scope' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Baseline Policy
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateRole}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Provision Role
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
          {activeRoleTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Role Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Medical Auditor or Compliance Reviewer"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Role Scope Narrative</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational responsibilities and privilege boundary for this role..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                />
              </div>
            </div>
          )}

          {activeRoleTab === 'scope' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Baseline Privilege Template</label>
                <select
                  value={baselineAccess}
                  onChange={(e) => setBaselineAccess(e.target.value as any)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="Read Only">Read Only (Forensic Auditor Template)</option>
                  <option value="Standard Operational">Standard Operational (Adjudication & Claims)</option>
                  <option value="Privileged">Privileged (Supervisory & Financial Settle)</option>
                </select>
              </div>

              <div className="p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1] text-[11px] text-[#66758A]">
                Permissions will be initialized using the template and can be granularly toggled in the matrix anytime.
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default PermissionsMatrix;
