import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Claim } from '../../types';
import { ClaimDetailView } from './ClaimDetailView';

export const ClaimsManagement: React.FC = () => {
  const {
    claims,
    insuredMembers,
    hospitals,
    policies,
    addClaim,
    approveClaim,
    rejectClaim,
    showToast,
  } = useApp();

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isAddClaimModalOpen, setIsAddClaimModalOpen] = useState(false);

  // Quick Action Modals
  const [quickActionClaim, setQuickActionClaim] = useState<Claim | null>(null);
  const [quickActionType, setQuickActionType] = useState<'approve' | 'reject' | null>(null);
  const [quickAmount, setQuickAmount] = useState<number>(0);
  const [quickReason, setQuickReason] = useState<string>('');

  // Add Claim Form State
  const [newClaimMemberId, setNewClaimMemberId] = useState(insuredMembers[0]?.id || '');
  const [newClaimHospitalId, setNewClaimHospitalId] = useState(hospitals[0]?.id || '');
  const [newClaimType, setNewClaimType] = useState<'Inpatient' | 'Outpatient' | 'Emergency' | 'Maternity' | 'Dental' | 'Optical'>('Inpatient');
  const [newClaimDiagnosis, setNewClaimDiagnosis] = useState('');
  const [newClaimAmount, setNewClaimAmount] = useState(85000);
  const [newClaimPriority, setNewClaimPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [newClaimAdmission, setNewClaimAdmission] = useState('2025-05-10');
  const [newClaimDischarge, setNewClaimDischarge] = useState('2025-05-12');

  // If a claim is selected for detailed inspection, show full ClaimDetailView
  if (selectedClaim) {
    const liveClaim = claims.find((c) => c.id === selectedClaim.id) || selectedClaim;
    return <ClaimDetailView claim={liveClaim} onBack={() => setSelectedClaim(null)} />;
  }

  // Filter Claims
  const filteredClaims = claims.filter((claim) => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'More Info Needed' || statusFilter === 'More Information Required') {
        if (claim.status !== 'More Info Needed' && claim.status !== 'More Information Required') return false;
      } else if (claim.status !== statusFilter) {
        return false;
      }
    }
    if (priorityFilter !== 'All' && claim.priority !== priorityFilter) return false;
    if (typeFilter !== 'All' && claim.claimType !== typeFilter) return false;
    return true;
  });

  // Calculate Metrics
  const totalClaimsCount = claims.length;
  const pendingCount = claims.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const approvedCount = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length;
  const rejectedCount = claims.filter((c) => c.status === 'Rejected').length;
  const totalSubmittedAmount = claims.reduce((sum, c) => sum + c.submittedAmount, 0);

  const statusTabs = [
    { label: 'All Claims', value: 'All', count: totalClaimsCount },
    { label: 'Submitted', value: 'Submitted', count: claims.filter((c) => c.status === 'Submitted').length },
    { label: 'Under Review', value: 'Under Review', count: claims.filter((c) => c.status === 'Under Review').length },
    { label: 'Approved', value: 'Approved', count: claims.filter((c) => c.status === 'Approved').length },
    { label: 'Paid', value: 'Paid', count: claims.filter((c) => c.status === 'Paid').length },
    { label: 'Rejected', value: 'Rejected', count: rejectedCount },
    {
      label: 'More Info Needed',
      value: 'More Info Needed',
      count: claims.filter((c) => c.status === 'More Info Needed' || c.status === 'More Information Required').length,
    },
  ];

  const handleOpenQuickApprove = (c: Claim) => {
    setQuickActionClaim(c);
    setQuickAmount(c.submittedAmount);
    setQuickActionType('approve');
  };

  const handleOpenQuickReject = (c: Claim) => {
    setQuickActionClaim(c);
    setQuickReason('');
    setQuickActionType('reject');
  };

  const handleSaveQuickAction = () => {
    if (!quickActionClaim) return;
    if (quickActionType === 'approve') {
      approveClaim(quickActionClaim.id, quickAmount, 'Quick approval from Claims Management dashboard.');
    } else if (quickActionType === 'reject') {
      if (!quickReason.trim()) {
        showToast('Reason Required', 'Please specify a rejection reason.', 'error');
        return;
      }
      rejectClaim(quickActionClaim.id, quickReason, 'Direct adjudication.');
    }
    setQuickActionClaim(null);
    setQuickActionType(null);
  };

  const handleCreateNewClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const member = insuredMembers.find((m) => m.id === newClaimMemberId);
    const hospital = hospitals.find((h) => h.id === newClaimHospitalId);
    const policy = policies.find((p) => p.memberId === member?.id) || policies[0];

    if (!newClaimDiagnosis) {
      showToast('Validation Error', 'Primary diagnosis / condition is required.', 'error');
      return;
    }

    addClaim({
      memberId: member?.id || 'MBR-1001',
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Sarah Jenkins',
      hospitalId: hospital?.id || 'HSP-001',
      hospitalName: hospital?.name || 'Metropolitan Medical Center',
      policyNumber: policy?.policyNumber || 'POL-2025-001',
      claimType: newClaimType,
      admissionDate: newClaimAdmission,
      dischargeDate: newClaimDischarge,
      submittedAmount: Number(newClaimAmount),
      primaryDiagnosis: newClaimDiagnosis,
      priority: newClaimPriority,
      insuranceCompanyName: policy?.insuranceCompanyName || 'Guardian Mutual Healthcare',
      copayPercentage: 10,
    });

    setIsAddClaimModalOpen(false);
    setNewClaimDiagnosis('');
  };

  const columns: Column<Claim>[] = [
    {
      key: 'claimNumber',
      header: 'Claim ID',
      sortable: true,
      render: (c) => (
        <button
          onClick={() => setSelectedClaim(c)}
          className="text-left font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {c.claimNumber}
        </button>
      ),
    },
    {
      key: 'memberName',
      header: 'Member / Patient',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{c.memberName}</span>
          <span className="text-[11px] text-[#8A97A8]">{c.policyNumber}</span>
        </div>
      ),
    },
    {
      key: 'hospitalName',
      header: 'Hospital / Provider',
      sortable: true,
      render: (c) => (
        <div>
          <span className="text-sm font-medium text-[#102A43] block leading-tight">{c.hospitalName}</span>
          <span className="text-[11px] text-[#66758A]">{c.primaryDiagnosis}</span>
        </div>
      ),
    },
    {
      key: 'claimType',
      header: 'Type',
      sortable: true,
      render: (c) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6F8FC] border border-[#E5EAF1] text-[#40516A]">
          {c.claimType}
        </span>
      ),
    },
    {
      key: 'submittedAmount',
      header: 'Submitted (PKR)',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-bold text-[#102A43] block leading-tight">
            PKR {c.submittedAmount.toLocaleString()}
          </span>
          {c.approvedAmount ? (
            <span className="text-[11px] text-[#16865B] font-medium">
              Approved: PKR {c.approvedAmount.toLocaleString()}
            </span>
          ) : (
            <span className="text-[11px] text-[#8A97A8]">Pending Adjudication</span>
          )}
        </div>
      ),
    },
    {
      key: 'submissionDate',
      header: 'Submitted On',
      sortable: true,
      render: (c) => <span className="text-xs text-[#66758A]">{c.submissionDate}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (c) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            c.priority === 'Emergency'
              ? 'bg-[#FDECEC] text-[#D64545]'
              : c.priority === 'Urgent'
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : 'bg-[#F6F8FC] text-[#66758A]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              c.priority === 'Emergency'
                ? 'bg-[#D64545]'
                : c.priority === 'Urgent'
                ? 'bg-[#D69B32]'
                : 'bg-[#66758A]'
            }`}
          />
          {c.priority}
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

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Claims Management"
        description="Review, adjudicate, verify clinical documents, and process settlements for healthcare claims across panel hospitals."
        breadcrumbs={['Insurance Operations', 'Claims Management']}
        primaryAction={{
          label: 'File New Claim',
          icon: 'plus',
          onClick: () => setIsAddClaimModalOpen(true),
        }}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Claims</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalClaimsCount}</span>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-1.5 py-0.5 rounded">+8.4%</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">YTD claim portfolio</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Pending Review</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D69B32]">{pendingCount}</span>
            <span className="text-xs text-[#8A97A8]">SLA &lt; 24h</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Awaiting medical officer</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Approved & Paid</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#16865B]">{approvedCount}</span>
            <span className="text-xs text-[#16865B] font-semibold">{Math.round((approvedCount / totalClaimsCount) * 100)}%</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Disbursed / scheduled</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Rejected</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D64545]">{rejectedCount}</span>
            <span className="text-xs text-[#8A97A8]">Policy exclusion</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Out of network / invalid</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Total Submitted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">
              PKR {(totalSubmittedAmount / 1000000).toFixed(1)}M
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Portfolio exposure</span>
        </div>
      </div>

      {/* Filter Tabs & Secondary Filters */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E5EAF1] pb-2 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-[#E5EAF1] text-[#66758A]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary dropdown filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8A97A8] flex items-center gap-1">
              <Icon name="filter" size={14} /> Filter by:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
            >
              <option value="All">All Claim Types</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Maternity">Maternity</option>
              <option value="Dental">Dental</option>
              <option value="Optical">Optical</option>
            </select>
          </div>

          <div className="text-xs text-[#8A97A8]">
            Showing <strong className="text-[#102A43]">{filteredClaims.length}</strong> of{' '}
            <strong className="text-[#102A43]">{claims.length}</strong> claims
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredClaims}
        columns={columns}
        searchPlaceholder="Search claims by ID, member, hospital, or diagnosis..."
        searchKey="claimNumber"
        onRowClick={(c) => setSelectedClaim(c)}
        actions={[
          {
            label: 'Review Claim Details',
            icon: 'eye',
            onClick: (c) => setSelectedClaim(c),
          },
          {
            label: 'Quick Approve',
            icon: 'check',
            onClick: (c) => handleOpenQuickApprove(c),
            show: (c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'More Info Needed',
          },
          {
            label: 'Quick Reject',
            icon: 'close',
            onClick: (c) => handleOpenQuickReject(c),
            show: (c) => c.status === 'Submitted' || c.status === 'Under Review',
          },
        ]}
      />

      {/* Quick Approve / Reject Modal */}
      <Modal
        isOpen={Boolean(quickActionClaim && quickActionType)}
        onClose={() => {
          setQuickActionClaim(null);
          setQuickActionType(null);
        }}
        title={quickActionType === 'approve' ? 'Quick Approve Claim' : 'Quick Reject Claim'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setQuickActionClaim(null);
                setQuickActionType(null);
              }}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveQuickAction}
              className={`px-4 py-2 rounded-lg text-xs font-semibold text-white ${
                quickActionType === 'approve'
                  ? 'bg-[#16865B] hover:bg-[#13724c]'
                  : 'bg-[#D64545] hover:bg-[#b53737]'
              }`}
            >
              {quickActionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </div>
        }
      >
        {quickActionClaim && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#F6F8FC] p-3 rounded-lg border border-[#E5EAF1] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Claim ID:</span>
                <span className="font-semibold text-[#102A43]">{quickActionClaim.claimNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Member:</span>
                <span className="font-medium text-[#102A43]">{quickActionClaim.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Hospital:</span>
                <span className="font-medium text-[#102A43]">{quickActionClaim.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Submitted Amount:</span>
                <span className="font-bold text-[#102A43]">
                  PKR {quickActionClaim.submittedAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {quickActionType === 'approve' ? (
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Approved Amount (PKR)</label>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-sm text-[#102A43] font-semibold focus:outline-hidden focus:border-[#2776EA]"
                />
                <p className="text-[11px] text-[#8A97A8] mt-1">
                  Approving this claim will automatically create a pending Settlement for hospital disbursement.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Rejection Reason</label>
                <select
                  value={quickReason}
                  onChange={(e) => setQuickReason(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                >
                  <option value="">Select reason...</option>
                  <option value="Policy Exclusion">Policy Exclusion (Clause 4.2 Non-covered treatment)</option>
                  <option value="Pre-existing Condition Not Declared">Pre-existing Condition Not Declared</option>
                  <option value="Treatment Received Outside Network Without Approval">Treatment Outside Network</option>
                  <option value="Annual Coverage Limit Exceeded">Annual Coverage Limit Exceeded</option>
                  <option value="Incomplete Clinical Documentation">Incomplete Clinical Documentation</option>
                </select>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add New Claim Modal */}
      <Modal
        isOpen={isAddClaimModalOpen}
        onClose={() => setIsAddClaimModalOpen(false)}
        title="File New Healthcare Claim"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddClaimModalOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNewClaim}
              className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
            >
              Submit Claim for Adjudication
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateNewClaim} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Select Insured Member *</label>
              <select
                value={newClaimMemberId}
                onChange={(e) => setNewClaimMemberId(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              >
                {insuredMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.memberNumber}) - {m.corporateClientName || 'Direct'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Panel Hospital / Clinic *</label>
              <select
                value={newClaimHospitalId}
                onChange={(e) => setNewClaimHospitalId(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Claim Type *</label>
              <select
                value={newClaimType}
                onChange={(e) => setNewClaimType(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Emergency">Emergency</option>
                <option value="Maternity">Maternity</option>
                <option value="Dental">Dental</option>
                <option value="Optical">Optical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Priority</label>
              <select
                value={newClaimPriority}
                onChange={(e) => setNewClaimPriority(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Claim Amount (PKR) *</label>
              <input
                type="number"
                value={newClaimAmount}
                onChange={(e) => setNewClaimAmount(Number(e.target.value))}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] font-semibold focus:outline-hidden focus:border-[#2776EA]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Primary Diagnosis / ICD-10 *</label>
            <input
              type="text"
              placeholder="e.g. Acute Appendicitis (ICD-10 K35.8)"
              value={newClaimDiagnosis}
              onChange={(e) => setNewClaimDiagnosis(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Admission Date</label>
              <input
                type="date"
                value={newClaimAdmission}
                onChange={(e) => setNewClaimAdmission(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Discharge Date</label>
              <input
                type="date"
                value={newClaimDischarge}
                onChange={(e) => setNewClaimDischarge(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ClaimsManagement;
