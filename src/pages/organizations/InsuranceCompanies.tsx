import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { InsuranceCompany } from '../../types';
import AddInsuranceProviderModal from './AddInsuranceProviderModal';

export const InsuranceCompanies: React.FC = () => {
  const { insuranceCompanies, insurancePlans, corporateClients, claims, policies, navigate, showToast, deleteInsuranceCompany } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<InsuranceCompany | null>(null);
  const [editingProvider, setEditingProvider] = useState<InsuranceCompany | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const columns: Column<InsuranceCompany>[] = [
    {
      key: 'name',
      header: 'Insurance Carrier',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{c.name}</div>
            <span className="text-[11px] text-[#8A97A8]">Underwriter Partner</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Authorized Liaison',
      render: (c) => (
        <div>
          <div className="font-medium text-[#102A43]">{c.contactPerson}</div>
          <span className="text-[11px] text-[#8A97A8]">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Direct Phone',
      render: (c) => <span className="text-[#40516A]">{c.phone}</span>,
    },
    {
      key: 'activePlans',
      header: 'Active Plans',
      sortable: true,
      render: (c) => <span className="font-semibold text-[#102A43]">{c.activePlans} Plans</span>,
    },
    {
      key: 'activePolicies',
      header: 'Policies',
      sortable: true,
      render: (c) => <span className="text-[#40516A]">{c.activePolicies.toLocaleString()}</span>,
    },
    {
      key: 'totalMembers',
      header: 'Covered Members',
      sortable: true,
      render: (c) => <span className="font-semibold text-[#102A43]">{c.totalMembers.toLocaleString()}</span>,
    },
    {
      key: 'settlementTurnaroundDays',
      header: 'SLA Turnaround',
      sortable: true,
      render: (c) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F4F9] text-[#102A43]">
          {c.settlementTurnaroundDays} Days Avg
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => <Badge value={c.status} size="sm" />,
    },
  ];

  const handleView = (c: InsuranceCompany) => {
    setSelectedProvider(c);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Insurance Companies"
        description="Manage licensed healthcare underwriting partners, available insurance plans, policy portfolios, and claims settlement SLA."
        breadcrumbs={['Organizations', 'Insurance Companies']}
        primaryAction={{
          label: 'Add Provider',
          icon: 'plus',
          onClick: () => {
            setEditingProvider(null);
            setIsAddOpen(true);
          },
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Licensed Underwriters</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{insuranceCompanies.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Underwritten Policies</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">12,840</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Enrolled Lives</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">24,870</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Claims Approved YTD</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">PKR 142.5M</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={insuranceCompanies}
        columns={columns}
        searchPlaceholder="Search insurance provider, contact person, or plan..."
        statusKey="status"
        onView={handleView}
        onEdit={(c) => {
          setEditingProvider(c);
          setIsAddOpen(true);
        }}
        onDelete={(c) => deleteInsuranceCompany(c.id)}
        actions={[
          {
            label: 'View Carrier Partner',
            icon: 'eye',
            onClick: handleView,
          },
          {
            label: 'Edit Carrier',
            icon: 'edit',
            onClick: (c) => {
              setEditingProvider(c);
              setIsAddOpen(true);
            },
          },
          {
            label: 'View Underwritten Plans',
            icon: 'plans',
            onClick: () => navigate('Insurance Plans'),
          },
          {
            label: 'View Underwritten Policies',
            icon: 'policies',
            onClick: () => navigate('Policies'),
          },
        ]}
      />

      {/* Detail Drawer */}
      {selectedProvider && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedProvider(null);
          }}
          title={selectedProvider.name}
          subtitle="Licensed Healthcare Underwriter"
          status={selectedProvider.status}
          avatarInitials={selectedProvider.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Supported Plans', 'Corporate Clients', 'Claims Performance', 'Documents']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit Carrier',
              icon: 'edit',
              variant: 'primary',
              onClick: () => {
                const prov = selectedProvider;
                setIsDetailOpen(false);
                setEditingProvider(prov);
                setIsAddOpen(true);
              },
            },
            {
              label: 'Export Carrier SLA',
              icon: 'download',
              onClick: () => showToast('Export SLA', `Carrier performance report generated for ${selectedProvider.name}.`),
            },
            {
              label: 'Delete Carrier',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deleteInsuranceCompany(selectedProvider.id);
                setIsDetailOpen(false);
                setSelectedProvider(null);
              },
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Approved Volume</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedProvider.claimsApprovedAmount}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Turnaround SLA</span>
                  <span className="text-base font-bold text-[#16865B] mt-0.5 block">
                    {selectedProvider.settlementTurnaroundDays} Days
                  </span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Total Claims</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedProvider.totalClaims}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">Carrier Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Authorized Representative</span>
                    <span className="font-semibold text-[#102A43]">{selectedProvider.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Claims Desk Email</span>
                    <span className="font-semibold text-[#2776EA]">{selectedProvider.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Emergency Hotline</span>
                    <span className="font-semibold text-[#102A43]">{selectedProvider.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Contract Status</span>
                    <span className="font-semibold text-[#16865B]">Active Master Agreement</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Supported Plans' && (() => {
            const providerPlans = insurancePlans.filter(
              (p) => p.insuranceCompanyName.toLowerCase() === selectedProvider.name.toLowerCase()
            );
            const displayPlans = providerPlans.length > 0 ? providerPlans : insurancePlans.slice(0, 4);

            return (
              <div className="space-y-4 text-xs">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Underwritten Products</span>
                    <span className="text-base font-bold text-[#102A43] block mt-0.5">
                      {selectedProvider.activePlans} Configured Healthcare Plans
                    </span>
                  </div>
                  <span className="text-xs text-[#2776EA] font-semibold">{selectedProvider.activePolicies.toLocaleString()} Total Policies</span>
                </div>

                <div className="space-y-2.5">
                  {displayPlans.map((plan) => (
                    <div key={plan.id} className="p-3.5 bg-white border border-[#E5EAF1] rounded-xl shadow-2xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#102A43] text-sm">{plan.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF2FF] text-[#2776EA]">
                            {plan.planType}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#66758A] block mt-1">
                          Monthly: {plan.monthlyPremium} · Annual Limit: <strong className="text-[#102A43]">{plan.coverageLimit}</strong>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#102A43] block">{plan.enrolledMembers.toLocaleString()}</span>
                        <span className="text-[10px] text-[#8A97A8]">Enrolled</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeTab === 'Corporate Clients' && (() => {
            const clients = corporateClients.filter(
              (c) => c.insuranceCompanyName.toLowerCase().includes(selectedProvider.name.toLowerCase().split(' ')[0])
            );
            const displayClients = clients.length > 0 ? clients : corporateClients.slice(0, 3);

            return (
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-1">
                  Contracted Corporate Group Health Accounts ({displayClients.length})
                </h4>
                <div className="space-y-2.5">
                  {displayClients.map((corp) => (
                    <div key={corp.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#102A43] block text-sm">{corp.name}</span>
                        <span className="text-[11px] text-[#66758A]">
                          Contact: {corp.contactPerson} ({corp.phone}) · Term: {corp.contractStart} to {corp.contractEnd}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#16865B] block">{corp.annualPremium}</span>
                        <span className="text-[10px] text-[#8A97A8]">{corp.totalEmployees.toLocaleString()} Staff</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeTab === 'Claims Performance' && (() => {
            const providerClaims = claims.filter(
              (c) => c.insuranceCompanyName.toLowerCase() === selectedProvider.name.toLowerCase()
            );
            const displayClaims = providerClaims.length > 0 ? providerClaims : claims.slice(0, 4);

            return (
              <div className="space-y-4 text-xs">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Carrier Adjudication SLA Compliance</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span>Claims adjudicated within {selectedProvider.settlementTurnaroundDays}-day SLA window:</span>
                    <span className="font-bold text-[#16865B]">96.4% Compliance Rate</span>
                  </div>
                  <div className="w-full bg-[#E5EAF1] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#16865B] h-full rounded-full w-[96.4%]" />
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-1">
                    Recently Processed Claims Underwriting ({displayClaims.length})
                  </h4>
                  <div className="space-y-2">
                    {displayClaims.map((c) => (
                      <div key={c.id} className="p-2.5 border border-[#E5EAF1] rounded-lg flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#2776EA]">{c.claimNumber}</span>
                            <span className="font-semibold text-[#102A43]">{c.memberName}</span>
                          </div>
                          <span className="text-[11px] text-[#8A97A8] block">
                            Hospital: {c.hospitalName} · Diagnosis: {c.diagnosis}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#102A43] block">PKR {c.submittedAmount.toLocaleString()}</span>
                          <Badge value={c.status} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'Documents' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">
                Certified Legal & Regulatory Documents
              </h4>
              {[
                { name: `${selectedProvider.name.replace(/[^a-zA-Z0-9]/g, '_')}_Insurance_Charter_License.pdf`, size: '3.1 MB', date: 'Active License' },
                { name: 'National_Healthcare_Underwriter_Statutory_Treaty.pdf', size: '4.5 MB', date: 'Signed Jan 2025' },
                { name: 'Cashless_Settlement_Direct_Disbursement_MoU.pdf', size: '1.8 MB', date: 'Active Term' },
              ].map((d, i) => (
                <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Icon name="file" size={14} className="text-[#2776EA]" />
                    <div>
                      <span className="font-medium text-[#102A43] block">{d.name}</span>
                      <span className="text-[10px] text-[#8A97A8]">{d.size} · {d.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Downloaded', `Downloading ${d.name}`)}
                    className="text-[#2776EA] font-semibold hover:underline"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Add Provider Modal */}
      <AddInsuranceProviderModal
        isOpen={isAddOpen}
        initialData={editingProvider}
        onClose={() => {
          setIsAddOpen(false);
          setEditingProvider(null);
        }}
      />
    </div>
  );
};

export default InsuranceCompanies;
