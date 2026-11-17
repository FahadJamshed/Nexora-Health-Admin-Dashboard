import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { CorporateClient } from '../../types';
import AddCorporateClientModal from './AddCorporateClientModal';

export const CorporateClients: React.FC = () => {
  const { corporateClients, insuredMembers, transactions, policies, claims, navigate, showToast, deleteCorporateClient } = useApp();
  const [selectedClient, setSelectedClient] = useState<CorporateClient | null>(null);
  const [editingClient, setEditingClient] = useState<CorporateClient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const columns: Column<CorporateClient>[] = [
    {
      key: 'name',
      header: 'Corporate Employer',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{c.name}</div>
            <span className="text-[11px] text-[#8A97A8]">Employer ID: {c.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'insuranceCompanyName',
      header: 'Underwriting Partner',
      sortable: true,
      render: (c) => (
        <span className="inline-flex items-center gap-1 font-medium text-[#2776EA]">
          {c.insuranceCompanyName}
        </span>
      ),
    },
    {
      key: 'contactPerson',
      header: 'HR Contact Person',
      render: (c) => (
        <div>
          <div className="font-medium text-[#102A43]">{c.contactPerson}</div>
          <span className="text-[11px] text-[#8A97A8]">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'totalEmployees',
      header: 'Covered Employees',
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-[#102A43]">{c.totalEmployees.toLocaleString()}</span>
      ),
    },
    {
      key: 'annualPremium',
      header: 'Annual Contract',
      sortable: true,
      render: (c) => <span className="font-semibold text-[#102A43]">{c.annualPremium}</span>,
    },
    {
      key: 'contractEnd',
      header: 'Contract Expiry',
      sortable: true,
      render: (c) => <span className="text-[#66758A]">{c.contractEnd}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => <Badge value={c.status} size="sm" />,
    },
  ];

  const handleView = (c: CorporateClient) => {
    setSelectedClient(c);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Corporate Clients"
        description="Manage contracted corporate employers, group health policies, employee census verification, and premium payment history."
        breadcrumbs={['Organizations', 'Corporate Clients']}
        primaryAction={{
          label: 'Add Corporate Client',
          icon: 'plus',
          onClick: () => {
            setEditingClient(null);
            setIsAddOpen(true);
          },
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Corporate Clients</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{corporateClients.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Employees</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">
            {corporateClients.reduce((sum, c) => sum + c.totalEmployees, 0).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Group Policies</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">7</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Pending Renewal</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">1 (Cascade Telecom)</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={corporateClients}
        columns={columns}
        searchPlaceholder="Search corporate employer, insurer, or contact..."
        statusKey="status"
        onView={handleView}
        onEdit={(c) => {
          setEditingClient(c);
          setIsAddOpen(true);
        }}
        onDelete={(c) => deleteCorporateClient(c.id)}
        actions={[
          {
            label: 'View Corporate Account',
            icon: 'eye',
            onClick: handleView,
          },
          {
            label: 'Edit Client',
            icon: 'edit',
            onClick: (c) => {
              setEditingClient(c);
              setIsAddOpen(true);
            },
          },
          {
            label: 'View Enrolled Members',
            icon: 'users',
            onClick: () => navigate('Insured Members'),
          },
          {
            label: 'View Group Policies',
            icon: 'policies',
            onClick: () => navigate('Policies'),
          },
        ]}
      />

      {/* Detail Drawer */}
      {selectedClient && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedClient(null);
          }}
          title={selectedClient.name}
          subtitle="Corporate Group Policyholder"
          status={selectedClient.status}
          avatarInitials={selectedClient.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Assigned Insurer', 'Employee Census', 'Contract Terms', 'Payment History']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit Client',
              icon: 'edit',
              variant: 'primary',
              onClick: () => {
                const client = selectedClient;
                setIsDetailOpen(false);
                setEditingClient(client);
                setIsAddOpen(true);
              },
            },
            {
              label: 'Export Contract',
              icon: 'download',
              onClick: () => showToast('Export Complete', `Policy contract PDF exported for ${selectedClient.name}.`),
            },
            {
              label: 'Delete Client',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deleteCorporateClient(selectedClient.id);
                setIsDetailOpen(false);
                setSelectedClient(null);
              },
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Covered Staff</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">
                    {selectedClient.totalEmployees.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Annual Premium</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedClient.annualPremium}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Contract Expiry</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">{selectedClient.contractEnd}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">HR Liaison Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Corporate HR Contact</span>
                    <span className="font-semibold text-[#102A43]">{selectedClient.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Official Email</span>
                    <span className="font-semibold text-[#2776EA]">{selectedClient.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Direct Phone</span>
                    <span className="font-semibold text-[#102A43]">{selectedClient.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Designated Insurer</span>
                    <span className="font-semibold text-[#102A43]">{selectedClient.insuranceCompanyName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Assigned Insurer' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#102A43]">{selectedClient.insuranceCompanyName}</h4>
                    <span className="text-[11px] text-[#8A97A8]">Designated Corporate Health Underwriter</span>
                  </div>
                  <Badge value="Underwritten & Active" variant="success" size="sm" />
                </div>
                <p className="text-[#66758A] leading-relaxed">
                  This corporate account is fully underwritten by <strong className="text-[#102A43]">{selectedClient.insuranceCompanyName}</strong> under master corporate treaty terms with direct cashless hospital admission guarantees across national panel networks.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5EAF1]">
                  <div>
                    <span className="text-[#8A97A8] block">Treaty Type</span>
                    <span className="font-semibold text-[#102A43]">Cashless Hospitalization + OPD</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Underwriter SLA</span>
                    <span className="font-semibold text-[#16865B]">3-Day Claims Reimbursement</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Employee Census' && (() => {
            const clientMembers = insuredMembers.filter(
              (m) => m.corporateClientName?.toLowerCase() === selectedClient.name.toLowerCase()
            );
            const displayMembers = clientMembers.length > 0 ? clientMembers : insuredMembers.slice(0, 5);

            return (
              <div className="space-y-4 text-xs">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Verified Census Records</span>
                    <span className="text-base font-bold text-[#102A43] block mt-0.5">
                      {selectedClient.totalEmployees.toLocaleString()} Active Policyholders
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('Census Exported', `Exported employee census for ${selectedClient.name}.`)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] text-xs font-semibold text-[#2776EA] hover:bg-[#EAF2FF]"
                  >
                    Download Census (CSV)
                  </button>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFBFD] border-b border-[#E5EAF1] text-[#8A97A8] font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Member ID</th>
                        <th className="py-2.5 px-3">Employee Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Annual Cap</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAF1]">
                      {displayMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2776EA]">{m.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#102A43]">{m.name}</td>
                          <td className="py-2.5 px-3 text-[#40516A]">{m.memberType}</td>
                          <td className="py-2.5 px-3 font-medium text-[#102A43]">{m.coverageLimit}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge value={m.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeTab === 'Contract Terms' && (() => {
            const clientPolicies = policies.filter(
              (p) => p.corporateClientName?.toLowerCase() === selectedClient.name.toLowerCase()
            );
            const primaryPolicy = clientPolicies[0] || policies[0];

            return (
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">
                  Master Healthcare Agreement Terms
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#8A97A8] block">Effective Date</span>
                    <span className="font-semibold text-[#102A43]">{selectedClient.contractStart}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Renewal Expiration</span>
                    <span className="font-semibold text-[#102A43]">{selectedClient.contractEnd}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Group Policy Number</span>
                    <span className="font-mono font-semibold text-[#2776EA]">{primaryPolicy?.policyNumber || 'POL-2025001'}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Annual Premium Invoiced</span>
                    <span className="font-bold text-[#16865B]">{selectedClient.annualPremium}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Inpatient Room Sub-limit</span>
                    <span className="font-semibold text-[#102A43]">PKR 25,000 / day (Private Ward)</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Maternity Delivery Benefit</span>
                    <span className="font-semibold text-[#102A43]">Covered up to PKR 350,000</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'Payment History' && (() => {
            const clientTxs = transactions.filter(
              (t) => t.relatedEntity?.toLowerCase() === selectedClient.name.toLowerCase()
            );
            const displayTxs = clientTxs.length > 0 ? clientTxs : transactions.filter((t) => t.type === 'Premium Collection').slice(0, 3);

            return (
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">
                  Corporate Premium Inward Remittances ({displayTxs.length})
                </h4>
                <div className="space-y-2">
                  {displayTxs.map((tx) => (
                    <div key={tx.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2776EA]">{tx.txNumber}</span>
                          <span className="text-[11px] text-[#8A97A8]">· {tx.date}</span>
                        </div>
                        <span className="text-[#40516A] text-[11px] block mt-0.5">
                          {tx.reference} · via {tx.paymentMethod}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#16865B] block">+PKR {tx.amount.toLocaleString()}</span>
                        <Badge value={tx.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DetailDrawer>
      )}

      {/* Add Client Modal */}
      <AddCorporateClientModal
        isOpen={isAddOpen}
        initialData={editingClient}
        onClose={() => {
          setIsAddOpen(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
};

export default CorporateClients;
