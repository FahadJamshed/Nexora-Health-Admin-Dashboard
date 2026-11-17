import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';
import AddPolicyModal from './AddPolicyModal';

export const Policies: React.FC = () => {
  const { policies, claims, transactions, insuredMembers, navigate, showToast, deletePolicy } = useApp();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Summary');

  const columns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy Number',
      sortable: true,
      render: (p) => <span className="font-semibold text-[#2776EA] font-mono">{p.policyNumber}</span>,
    },
    {
      key: 'memberName',
      header: 'Policyholder',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-[#102A43] leading-snug">{p.memberName}</div>
          <span className="text-[11px] text-[#8A97A8]">{p.corporateClientName || 'Individual Subscriber'}</span>
        </div>
      ),
    },
    {
      key: 'insuranceCompanyName',
      header: 'Insurance Carrier',
      sortable: true,
      render: (p) => <span className="font-medium text-[#102A43]">{p.insuranceCompanyName}</span>,
    },
    {
      key: 'planName',
      header: 'Plan Name',
      sortable: true,
      render: (p) => <span className="text-[#40516A]">{p.planName}</span>,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (p) => <span className="text-[#8A97A8]">{p.startDate}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      sortable: true,
      render: (p) => <span className="text-[#40516A]">{p.expiryDate}</span>,
    },
    {
      key: 'monthlyPremium',
      header: 'Premium',
      render: (p) => <span className="font-medium text-[#102A43]">{p.monthlyPremium}</span>,
    },
    {
      key: 'coverageAmount',
      header: 'Coverage Limit',
      sortable: true,
      render: (p) => <span className="font-bold text-[#102A43]">{p.coverageAmount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => <Badge value={p.status} size="sm" />,
    },
  ];

  const handleView = (p: Policy) => {
    setSelectedPolicy(p);
    setActiveTab('Summary');
    setIsDetailOpen(true);
  };

  // Dynamically resolve linked policy entities
  const policyClaims = selectedPolicy
    ? claims.filter(
        (c) =>
          c.policyNumber.toLowerCase() === selectedPolicy.policyNumber.toLowerCase() ||
          c.memberName.toLowerCase() === selectedPolicy.memberName.toLowerCase()
      )
    : [];

  const policyTransactions = selectedPolicy
    ? transactions.filter(
        (t) =>
          t.reference.toLowerCase().includes(selectedPolicy.policyNumber.toLowerCase()) ||
          t.relatedEntity.toLowerCase().includes(selectedPolicy.memberName.toLowerCase())
      )
    : [];

  const policyholderMember = selectedPolicy
    ? insuredMembers.find((m) => m.name.toLowerCase() === selectedPolicy.memberName.toLowerCase())
    : null;

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Policies"
        description="Comprehensive healthcare policy portfolio management, underwriting terms, automated renewals, and premium schedules."
        breadcrumbs={['Insurance Operations', 'Policies']}
        primaryAction={{
          label: 'Create Policy',
          icon: 'plus',
          onClick: () => {
            setEditingPolicy(null);
            setIsAddOpen(true);
          },
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Active Policies</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{policies.length * 856}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Current Active</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">11,240</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Expiring (30 Days)</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">284</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Cancelled / Terminated</span>
          <span className="text-xl font-bold text-[#66758A] block mt-0.5">316</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={policies}
        columns={columns}
        searchPlaceholder="Search policy number, subscriber, insurer, or plan..."
        statusKey="status"
        onView={handleView}
        onEdit={(p) => {
          setEditingPolicy(p);
          setIsAddOpen(true);
        }}
        onDelete={(p) => deletePolicy(p.id)}
        actions={[
          {
            label: 'View Policy Agreement',
            icon: 'eye',
            onClick: handleView,
          },
          {
            label: 'Edit Policy',
            icon: 'edit',
            onClick: (p) => {
              setEditingPolicy(p);
              setIsAddOpen(true);
            },
          },
          {
            label: 'View Incurred Claims',
            icon: 'claims',
            onClick: () => navigate('Claims Management'),
          },
          {
            label: 'View Subscriber Profile',
            icon: 'member',
            onClick: () => navigate('Insured Members'),
          },
        ]}
      />

      {/* Detail Drawer */}
      {selectedPolicy && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedPolicy(null);
          }}
          title={selectedPolicy.policyNumber}
          subtitle={`${selectedPolicy.planName} · ${selectedPolicy.insuranceCompanyName}`}
          status={selectedPolicy.status}
          tabs={['Summary', 'Policyholder', 'Coverage Breakdown', 'Incurred Claims', 'Payment History', 'Documents']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit Policy',
              icon: 'edit',
              variant: 'primary',
              onClick: () => {
                const pol = selectedPolicy;
                setIsDetailOpen(false);
                setEditingPolicy(pol);
                setIsAddOpen(true);
              },
            },
            {
              label: 'Renew Policy',
              variant: 'secondary',
              onClick: () => showToast('Renewal Initiated', `Renewal terms generated for ${selectedPolicy.policyNumber}.`),
            },
            {
              label: 'Download Policy Schedule',
              icon: 'download',
              variant: 'secondary',
              onClick: () => showToast('Schedule Exported', `Official PDF exported for ${selectedPolicy.policyNumber}.`),
            },
            {
              label: 'Delete Policy',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deletePolicy(selectedPolicy.id);
                setIsDetailOpen(false);
                setSelectedPolicy(null);
              },
            },
          ]}
        >
          {activeTab === 'Summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Total Ceiling</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedPolicy.coverageAmount}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Monthly Premium</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">{selectedPolicy.monthlyPremium}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Incurred Claims</span>
                  <span className="text-base font-bold text-[#D69B32] mt-0.5 block">
                    {selectedPolicy.claimsAmountUtilized}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">Policy Tenure & Parties</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Policyholder</span>
                    <span className="font-semibold text-[#102A43]">{selectedPolicy.memberName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Corporate Client</span>
                    <span className="font-semibold text-[#102A43]">
                      {selectedPolicy.corporateClientName || 'Individual Direct'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Underwriting Carrier</span>
                    <span className="font-semibold text-[#2776EA]">{selectedPolicy.insuranceCompanyName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Plan Classification</span>
                    <span className="font-semibold text-[#102A43]">{selectedPolicy.planName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Effective Date</span>
                    <span className="font-semibold text-[#102A43]">{selectedPolicy.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Expiry Date</span>
                    <span className="font-semibold text-[#102A43]">{selectedPolicy.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Policyholder' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Primary Insured Profile</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8A97A8] block">Insured Name</span>
                  <span className="font-semibold text-[#102A43] text-sm">{selectedPolicy.memberName}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">National ID / SSN</span>
                  <span className="font-semibold text-[#102A43] font-mono">{policyholderMember?.ssn || '35201-8849102-1'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Corporate Group</span>
                  <span className="font-semibold text-[#102A43]">{selectedPolicy.corporateClientName || 'Direct Retail'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Covered Lives / Dependents</span>
                  <span className="font-semibold text-[#2776EA]">
                    {policyholderMember ? `${policyholderMember.dependents.length + 1} Lives` : '3 Lives (Spouse & 2 Children)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Contact Phone</span>
                  <span className="font-semibold text-[#102A43]">{policyholderMember?.phone || '+1 (555) 234-5678'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Corporate Email</span>
                  <span className="font-semibold text-[#2776EA]">{policyholderMember?.email || 'subscriber@nexora.com'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Coverage Breakdown' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Annual Entitlement Sub-Limits</h4>
                <span className="text-xs font-bold text-[#102A43]">Cap: {selectedPolicy.coverageAmount}</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                  <div>
                    <span className="font-semibold text-[#102A43] block">Inpatient Hospitalization & Surgeries</span>
                    <span className="text-[11px] text-[#8A97A8]">ICU, OT, room rent, medicines & doctor visits</span>
                  </div>
                  <span className="font-bold text-[#102A43]">{selectedPolicy.coverageAmount}</span>
                </div>
                <div className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                  <div>
                    <span className="font-semibold text-[#102A43] block">Outpatient (OPD) Consultations & Diagnostics</span>
                    <span className="text-[11px] text-[#8A97A8]">Specialist consults, laboratory tests & MRI/CT</span>
                  </div>
                  <span className="font-bold text-[#102A43]">PKR 150,000 / Year</span>
                </div>
                <div className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                  <div>
                    <span className="font-semibold text-[#102A43] block">Maternity & Childcare Support</span>
                    <span className="text-[11px] text-[#8A97A8]">Prenatal, normal/C-section delivery & neonatal ICU</span>
                  </div>
                  <span className="font-bold text-[#102A43]">PKR 450,000</span>
                </div>
                <div className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                  <div>
                    <span className="font-semibold text-[#102A43] block">Prescription Medicine Reimbursement</span>
                    <span className="text-[11px] text-[#8A97A8]">Prescribed chronic & acute medications</span>
                  </div>
                  <span className="font-bold text-[#102A43]">PKR 85,000</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Incurred Claims' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Claims Filed Under This Policy</h4>
                <span className="text-xs text-[#2776EA] font-semibold">{policyClaims.length} Claims Recorded</span>
              </div>

              {policyClaims.length > 0 ? (
                <div className="space-y-3">
                  {policyClaims.map((clm) => (
                    <div key={clm.id} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{clm.claimNumber}</span>
                          <span className="text-[11px] text-[#8A97A8]">{clm.hospitalName} • {clm.diagnosis}</span>
                        </div>
                        <Badge value={clm.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Claimed</span>
                          <span className="font-bold text-[#102A43]">PKR {clm.submittedAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved</span>
                          <span className="font-bold text-[#16865B]">
                            {clm.approvedAmount ? `PKR ${clm.approvedAmount.toLocaleString()}` : 'In Review'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Date</span>
                          <span className="font-medium text-[#40516A]">{clm.submissionDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { clm: 'CLM-2025001', hosp: 'Metropolitan Medical Center', diag: 'Emergency Inpatient Treatment', amt: 'PKR 485,000', appr: 'PKR 450,000', date: '12 May 2025', status: 'Approved' },
                    { clm: 'CLM-2025004', hosp: 'St. Jude Memorial Hospital', diag: 'Diagnostic MRI & Pathology Scan', amt: 'PKR 45,000', appr: 'PKR 45,000', date: '04 Apr 2025', status: 'Paid' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{item.clm}</span>
                          <span className="text-[11px] text-[#8A97A8]">{item.hosp} • {item.diag}</span>
                        </div>
                        <Badge value={item.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Claimed</span>
                          <span className="font-bold text-[#102A43]">{item.amt}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved</span>
                          <span className="font-bold text-[#16865B]">{item.appr}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Date</span>
                          <span className="font-medium text-[#40516A]">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Payment History' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Premium Tranches & Billing</h4>
                <span className="text-xs text-[#16865B] font-semibold">Current / No Arrears</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { desc: 'Monthly Premium Installment (May 2025)', ref: `FT-2025-${selectedPolicy.policyNumber.slice(-4)}-05`, amt: selectedPolicy.monthlyPremium, date: '01 May 2025' },
                  { desc: 'Monthly Premium Installment (Apr 2025)', ref: `FT-2025-${selectedPolicy.policyNumber.slice(-4)}-04`, amt: selectedPolicy.monthlyPremium, date: '01 Apr 2025' },
                  { desc: 'Monthly Premium Installment (Mar 2025)', ref: `FT-2025-${selectedPolicy.policyNumber.slice(-4)}-03`, amt: selectedPolicy.monthlyPremium, date: '01 Mar 2025' },
                ].map((tranche, idx) => (
                  <div key={idx} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                    <div>
                      <span className="font-semibold text-[#102A43] block">{tranche.desc}</span>
                      <span className="text-[11px] text-[#8A97A8] font-mono">Ref: {tranche.ref} • {tranche.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#16865B] block">{tranche.amt}</span>
                      <Badge value="Paid" variant="success" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Policy Certificates & Endorsements</h4>
              {[
                `Master_Policy_Schedule_${selectedPolicy.policyNumber}.pdf`,
                `Underwriting_Acceptance_Slip_${selectedPolicy.policyNumber}.pdf`,
                `Digital_Health_Cards_Batch_${selectedPolicy.policyNumber}.pdf`,
              ].map((doc, idx) => (
                <div key={idx} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                    <div>
                      <span className="font-medium text-[#102A43] block">{doc}</span>
                      <span className="text-[10px] text-[#8A97A8]">Issued by {selectedPolicy.insuranceCompanyName}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Download Started', `Downloading ${doc}`)}
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

      {/* Add Policy Modal */}
      <AddPolicyModal
        isOpen={isAddOpen}
        initialData={editingPolicy}
        onClose={() => {
          setIsAddOpen(false);
          setEditingPolicy(null);
        }}
      />
    </div>
  );
};

export default Policies;
