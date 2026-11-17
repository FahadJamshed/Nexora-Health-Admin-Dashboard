import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { InsurancePlan } from '../../types';
import AddPlanModal from './AddPlanModal';

export const InsurancePlans: React.FC = () => {
  const { insurancePlans, policies, insuredMembers, showToast } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InsurancePlan | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const columns: Column<InsurancePlan>[] = [
    {
      key: 'name',
      header: 'Plan Title',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-[#102A43] leading-snug">{p.name}</div>
          <span className="text-[11px] text-[#8A97A8]">{p.id}</span>
        </div>
      ),
    },
    {
      key: 'insuranceCompanyName',
      header: 'Insurance Carrier',
      sortable: true,
      render: (p) => <span className="font-medium text-[#2776EA]">{p.insuranceCompanyName}</span>,
    },
    {
      key: 'planType',
      header: 'Plan Category',
      sortable: true,
      render: (p) => <Badge value={p.planType} variant="info" size="sm" />,
    },
    {
      key: 'monthlyPremium',
      header: 'Monthly Premium',
      sortable: true,
      render: (p) => <span className="font-semibold text-[#102A43]">{p.monthlyPremium}</span>,
    },
    {
      key: 'coverageLimit',
      header: 'Annual Limit',
      sortable: true,
      render: (p) => <span className="font-bold text-[#102A43]">{p.coverageLimit}</span>,
    },
    {
      key: 'enrolledMembers',
      header: 'Enrolled Members',
      sortable: true,
      render: (p) => <span className="font-medium text-[#40516A]">{p.enrolledMembers.toLocaleString()}</span>,
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (p) => <span className="text-[#8A97A8]">{p.effectiveDate}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => <Badge value={p.status} size="sm" />,
    },
  ];

  const handleView = (p: InsurancePlan) => {
    setSelectedPlan(p);
    setActiveTab('Overview');
    setIsDetailOpen(true);
  };

  const handleEdit = (p: InsurancePlan) => {
    setEditingPlan(p);
    setIsAddOpen(true);
  };

  // Dynamically resolve linked policies and members
  const linkedPolicies = selectedPlan
    ? policies.filter((p) => p.planName.toLowerCase() === selectedPlan.name.toLowerCase())
    : [];

  const linkedMembers = selectedPlan
    ? insuredMembers.filter(
        (m) =>
          m.insurancePlanName?.toLowerCase() === selectedPlan.name.toLowerCase() ||
          m.coverageLimit === selectedPlan.coverageLimit
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Insurance Plans"
        description="Configure healthcare benefit tiers, annual coverage limits, exclusions, eligibility rules, and member enrollment quotas."
        breadcrumbs={['Insurance Operations', 'Insurance Plans']}
        primaryAction={{
          label: 'Create Plan',
          icon: 'plus',
          onClick: () => {
            setEditingPlan(null);
            setIsAddOpen(true);
          },
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Configured Plans</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{insurancePlans.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Healthcare Cover</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">38 Plans</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Enrolled Subscribers</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">48,520</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Under Product Review</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">4 Plans</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={insurancePlans}
        columns={columns}
        searchPlaceholder="Search plan name, insurer, or category..."
        statusKey="status"
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Detail Drawer */}
      {selectedPlan && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedPlan(null);
          }}
          title={selectedPlan.name}
          subtitle={`${selectedPlan.insuranceCompanyName} · ${selectedPlan.planType}`}
          status={selectedPlan.status}
          avatarInitials={selectedPlan.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Benefits Schedule', 'Policy Exclusions', 'Eligibility Rules', 'Subscribers & Policies']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit Plan',
              icon: 'edit',
              variant: 'primary',
              onClick: () => {
                setIsDetailOpen(false);
                handleEdit(selectedPlan);
              },
            },
            {
              label: 'Download Schedule',
              icon: 'download',
              variant: 'secondary',
              onClick: () => showToast('Schedule Exported', `Plan benefits schedule exported for ${selectedPlan.name}.`),
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Annual Limit</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedPlan.coverageLimit}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Monthly Premium</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">{selectedPlan.monthlyPremium}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Enrolled Members</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">
                    {selectedPlan.enrolledMembers.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Plan Overview & Underwriting Scope</h4>
                <p className="text-xs text-[#40516A] leading-relaxed">{selectedPlan.description}</p>
                <div className="grid grid-cols-2 gap-4 text-xs mt-4 pt-3 border-t border-[#E5EAF1]">
                  <div>
                    <span className="text-[#8A97A8] block">Underwriting Carrier</span>
                    <span className="font-semibold text-[#2776EA]">{selectedPlan.insuranceCompanyName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Plan Effective Date</span>
                    <span className="font-semibold text-[#102A43]">{selectedPlan.effectiveDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Benefits Schedule' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Covered Entitlements</h4>
              <div className="space-y-2.5">
                {selectedPlan.benefits.map((b, i) => (
                  <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs bg-[#F8FAFC]">
                    <div>
                      <span className="font-semibold text-[#102A43] block">{b.category}</span>
                      <span className="text-[#66758A] text-[11px]">{b.description}</span>
                    </div>
                    <span className="font-bold text-[#2776EA] ml-4 flex-shrink-0">{b.limit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Policy Exclusions' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Standard Exclusions</h4>
              {selectedPlan.exclusions.map((ex, i) => (
                <div key={i} className="p-2.5 bg-[#FDECEC]/40 border border-[#f7c5c5] rounded-lg text-xs text-[#c53f3f] flex items-center gap-2">
                  <span>✕</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Eligibility Rules' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Enrollment Criteria</h4>
              <p className="text-[#40516A] leading-relaxed">{selectedPlan.eligibilityRules}</p>
            </div>
          )}

          {activeTab === 'Subscribers & Policies' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Enrolled Groups & Policyholders</h4>
                <span className="text-xs text-[#2776EA] font-semibold">{selectedPlan.enrolledMembers.toLocaleString()} Enrolled</span>
              </div>

              {linkedPolicies.length > 0 ? (
                <div className="space-y-3">
                  {linkedPolicies.map((pol) => (
                    <div key={pol.id} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{pol.memberName}</span>
                          <span className="text-[11px] text-[#8A97A8] font-mono">
                            Policy: {pol.policyNumber} • {pol.corporateClientName || 'Direct Subscriber'}
                          </span>
                        </div>
                        <Badge value={pol.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Coverage</span>
                          <span className="font-bold text-[#102A43]">{pol.coverageAmount}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Monthly Premium</span>
                          <span className="font-semibold text-[#2776EA]">{pol.monthlyPremium}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Tenure</span>
                          <span className="font-medium text-[#40516A]">{pol.startDate} — {pol.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { client: 'Acme Corporation Group Policy', pol: 'POL-2025-001', members: '1,240 Enrolled Lives', status: 'Active' },
                    { client: 'Apex Health Systems Employee Pool', pol: 'POL-2025-004', members: '840 Enrolled Lives', status: 'Active' },
                    { client: 'Nexus Technologies Staff Policy', pol: 'POL-2025-007', members: '620 Enrolled Lives', status: 'Active' },
                  ].map((grp, idx) => (
                    <div key={idx} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{grp.client}</span>
                          <span className="text-[11px] text-[#8A97A8] font-mono">Policy No: {grp.pol}</span>
                        </div>
                        <Badge value={grp.status} size="sm" />
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <span className="text-[#2776EA] font-semibold">{grp.members}</span>
                        <span className="text-[#8A97A8]">Valid through Dec 2025</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingPlan(null);
        }}
        initialData={editingPlan}
      />
    </div>
  );
};

export default InsurancePlans;
