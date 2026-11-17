import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { PreAuthorization } from '../../types';

export const PreAuthorizations: React.FC = () => {
  const {
    preAuthorizations,
    insuredMembers,
    hospitals,
    approvePreAuth,
    rejectPreAuth,
    requestPreAuthInfo,
    addPreAuth,
    deletePreAuth,
    navigate,
    showToast,
  } = useApp();

  const [selectedAuth, setSelectedAuth] = useState<PreAuthorization | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Adjudication Modals
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [infoQuery, setInfoQuery] = useState('');

  // New Request Modal
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState(insuredMembers[0]?.id || '');
  const [newHospitalId, setNewHospitalId] = useState(hospitals[0]?.id || '');
  const [newTreatment, setNewTreatment] = useState('');
  const [newProcedureCode, setNewProcedureCode] = useState('CPT-47562');
  const [newDepartment, setNewDepartment] = useState('General Surgery');
  const [newEstimatedCost, setNewEstimatedCost] = useState(140000);
  const [newPriority, setNewPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newJustification, setNewJustification] = useState('');

  const filteredAuths = preAuthorizations.filter((pa) => {
    if (statusFilter !== 'All' && pa.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && pa.priority !== priorityFilter) return false;
    return true;
  });

  const totalCount = preAuthorizations.length;
  const pendingCount = preAuthorizations.filter((p) => p.status === 'Pending' || p.status === 'Under Review').length;
  const approvedCount = preAuthorizations.filter((p) => p.status === 'Approved').length;
  const urgentCount = preAuthorizations.filter((p) => p.priority === 'Urgent').length;
  const totalEstimatedPKR = preAuthorizations.reduce((acc, p) => acc + p.estimatedCost, 0);

  const handleOpenDetail = (pa: PreAuthorization) => {
    setSelectedAuth(pa);
    setIsDetailOpen(true);
  };

  const handleOpenApproveModal = (pa: PreAuthorization) => {
    setSelectedAuth(pa);
    setApprovedAmount(pa.approvedAmount || pa.estimatedCost);
    setIsApproveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedAuth) return;
    approvePreAuth(selectedAuth.id, approvedAmount);
    setIsApproveOpen(false);
    setIsDetailOpen(false);
  };

  const handleOpenRejectModal = (pa: PreAuthorization) => {
    setSelectedAuth(pa);
    setRejectionReason('');
    setIsRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedAuth) return;
    if (!rejectionReason.trim()) {
      showToast('Reason Required', 'Please provide a medical or contractual reason for rejection.', 'error');
      return;
    }
    rejectPreAuth(selectedAuth.id, rejectionReason);
    setIsRejectOpen(false);
    setIsDetailOpen(false);
  };

  const handleConfirmRequestInfo = () => {
    if (!selectedAuth) return;
    if (!infoQuery.trim()) {
      showToast('Query Required', 'Please provide notes describing the missing documentation.', 'error');
      return;
    }
    requestPreAuthInfo(selectedAuth.id, infoQuery);
    setIsRequestInfoOpen(false);
    setInfoQuery('');
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const member = insuredMembers.find((m) => m.id === newMemberId);
    const hospital = hospitals.find((h) => h.id === newHospitalId);

    if (!newTreatment || !newJustification) {
      showToast('Validation Error', 'Treatment title and clinical justification are required.', 'error');
      return;
    }

    addPreAuth({
      memberId: member?.id || 'MBR-1001',
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Sarah Jenkins',
      hospitalId: hospital?.id || 'HSP-001',
      hospitalName: hospital?.name || 'Metropolitan Medical Center',
      treatment: newTreatment,
      procedureCode: newProcedureCode,
      department: newDepartment,
      estimatedCost: Number(newEstimatedCost),
      priority: newPriority,
      clinicalJustification: newJustification,
    });

    setIsNewRequestOpen(false);
    setNewTreatment('');
    setNewJustification('');
  };

  const columns: Column<PreAuthorization>[] = [
    {
      key: 'authNumber',
      header: 'Authorization ID',
      sortable: true,
      render: (pa) => (
        <button
          onClick={() => handleOpenDetail(pa)}
          className="font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {pa.authNumber}
        </button>
      ),
    },
    {
      key: 'memberName',
      header: 'Insured Patient',
      sortable: true,
      render: (pa) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{pa.memberName}</span>
          <span className="text-[11px] text-[#8A97A8]">ID: {pa.memberId}</span>
        </div>
      ),
    },
    {
      key: 'hospitalName',
      header: 'Hospital & Dept',
      sortable: true,
      render: (pa) => (
        <div>
          <span className="text-sm font-medium text-[#102A43] block leading-tight">{pa.hospitalName}</span>
          <span className="text-[11px] text-[#66758A]">{pa.department}</span>
        </div>
      ),
    },
    {
      key: 'treatment',
      header: 'Procedure / Diagnosis',
      sortable: true,
      render: (pa) => (
        <div>
          <span className="font-medium text-[#102A43] block leading-tight">{pa.treatment}</span>
          <span className="text-[11px] font-mono text-[#40516A]">{pa.procedureCode}</span>
        </div>
      ),
    },
    {
      key: 'estimatedCost',
      header: 'Est. Cost (PKR)',
      sortable: true,
      render: (pa) => (
        <div>
          <span className="font-bold text-[#102A43] block">
            PKR {pa.estimatedCost.toLocaleString()}
          </span>
          {pa.approvedAmount && (
            <span className="text-[11px] text-[#16865B] font-semibold">
              Appr: PKR {pa.approvedAmount.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (pa) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            pa.priority === 'Urgent'
              ? 'bg-[#FDECEC] text-[#D64545]'
              : pa.priority === 'High'
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : 'bg-[#F6F8FC] text-[#66758A]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              pa.priority === 'Urgent'
                ? 'bg-[#D64545]'
                : pa.priority === 'High'
                ? 'bg-[#D69B32]'
                : 'bg-[#66758A]'
            }`}
          />
          {pa.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (pa) => <Badge value={pa.status} size="sm" />,
    },
    {
      key: 'requestDate',
      header: 'Requested Date',
      sortable: true,
      render: (pa) => <span className="text-xs text-[#8A97A8]">{pa.requestDate}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Pre-Authorizations"
        description="Clinical review of prospective hospital admissions, surgical procedures, and high-value treatments prior to care delivery."
        breadcrumbs={['Insurance Operations', 'Pre-Authorizations']}
        primaryAction={{
          label: 'Request Pre-Auth',
          icon: 'plus',
          onClick: () => setIsNewRequestOpen(true),
        }}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Requests</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalCount}</span>
            <span className="text-xs font-semibold text-[#16865B] bg-[#E8F6EF] px-1.5 py-0.5 rounded">+12%</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">YTD submitted requests</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Pending Review</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D69B32]">{pendingCount}</span>
            <span className="text-xs text-[#8A97A8]">SLA 2 hrs</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Awaiting medical officer</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Approved</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#16865B]">{approvedCount}</span>
            <span className="text-xs text-[#16865B] font-semibold">{Math.round((approvedCount / totalCount) * 100)}%</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Guaranteed coverage</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Urgent Cases</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D64545]">{urgentCount}</span>
            <span className="text-xs text-[#D64545] font-semibold">Priority 1</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Expedited triage queue</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Total Requested</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">
              PKR {(totalEstimatedPKR / 1000000).toFixed(1)}M
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Total pipeline cost</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {status === 'All' ? 'All Authorizations' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={filteredAuths}
        columns={columns}
        searchPlaceholder="Search authorizations by ID, member, hospital, or procedure..."
        searchKey="authNumber"
        onRowClick={handleOpenDetail}
        onView={handleOpenDetail}
        onDelete={(pa) => deletePreAuth(pa.id)}
        actions={[
          {
            label: 'View Clinical File',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'Approve Authorization',
            icon: 'check',
            onClick: handleOpenApproveModal,
            show: (pa) => pa.status === 'Pending' || pa.status === 'Under Review',
          },
          {
            label: 'Reject Authorization',
            icon: 'close',
            onClick: handleOpenRejectModal,
            show: (pa) => pa.status === 'Pending' || pa.status === 'Under Review',
          },
          {
            label: 'View in Claims Management',
            icon: 'claims',
            onClick: () => navigate('Claims Management'),
            show: (pa) => pa.status === 'Approved',
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedAuth && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Pre-Authorization #${selectedAuth.authNumber}`}
          subtitle={`${selectedAuth.hospitalName} • Requested ${selectedAuth.requestDate}`}
          badge={<Badge value={selectedAuth.status} />}
          tabs={['Overview', 'Clinical Justification', 'Adjudication Notes']}
          actions={[
            {
              label: 'Delete Pre-Auth',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deletePreAuth(selectedAuth.id);
                setIsDetailOpen(false);
                setSelectedAuth(null);
              },
            },
          ]}
          footer={
            selectedAuth.status === 'Approved' ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-[#16865B] font-semibold flex items-center gap-1">
                  <Icon name="check" size={14} /> Approved & Ready for Admission
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('Claims Management');
                  }}
                  className="px-3.5 py-1.5 bg-[#2776EA] text-white rounded-lg text-xs font-semibold hover:bg-[#1f5ec2]"
                >
                  View in Claims Management →
                </button>
              </div>
            ) : (selectedAuth.status === 'Pending' || selectedAuth.status === 'Under Review') ? (
              <div className="flex items-center justify-end gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsRequestInfoOpen(true)}
                  className="px-3 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
                >
                  Request More Info
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenRejectModal(selectedAuth)}
                  className="px-3 py-1.5 bg-[#FDECEC] text-[#D64545] rounded-lg text-xs font-semibold hover:bg-[#fbdada]"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenApproveModal(selectedAuth)}
                  className="px-4 py-1.5 bg-[#16865B] text-white rounded-lg text-xs font-semibold hover:bg-[#13724c]"
                >
                  Approve Pre-Auth
                </button>
              </div>
            ) : null
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Overview' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Patient Name</span>
                      <span className="font-semibold text-[#102A43] text-sm">{selectedAuth.memberName}</span>
                      <span className="text-[11px] text-[#66758A] block">ID: {selectedAuth.memberId}</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Panel Hospital</span>
                      <span className="font-semibold text-[#102A43] text-sm">{selectedAuth.hospitalName}</span>
                      <span className="text-[11px] text-[#66758A] block">{selectedAuth.department}</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Estimated Cost</span>
                      <span className="font-bold text-[#102A43] text-base">
                        PKR {selectedAuth.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Approved Amount</span>
                      <span className="font-bold text-[#16865B] text-base">
                        {selectedAuth.approvedAmount ? `PKR ${selectedAuth.approvedAmount.toLocaleString()}` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Procedure Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#8A97A8]">Procedure:</span>
                        <p className="font-medium text-[#102A43]">{selectedAuth.treatment}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">CPT / Code:</span>
                        <p className="font-mono text-[#102A43] font-semibold">{selectedAuth.procedureCode}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">Priority Level:</span>
                        <p className="font-semibold text-[#102A43]">{selectedAuth.priority}</p>
                      </div>
                      <div>
                        <span className="text-[#8A97A8]">Validity:</span>
                        <p className="text-[#102A43]">{selectedAuth.validUntil || '30 days from approval'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Clinical Justification' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#EAF2FF] border border-[#2776EA]/20 rounded-xl text-[#102A43]">
                    <span className="font-bold block mb-1">Attending Physician's Clinical Rationale:</span>
                    <p className="leading-relaxed text-sm">{selectedAuth.clinicalJustification}</p>
                  </div>
                  {selectedAuth.rejectionReason && (
                    <div className="p-3 bg-[#FDECEC] border border-[#D64545]/20 rounded-xl text-[#D64545]">
                      <span className="font-bold block mb-1">Rejection Reason:</span>
                      <p className="leading-relaxed">{selectedAuth.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Adjudication Notes' && (
                <div className="space-y-3 text-xs">
                  {selectedAuth.notes && selectedAuth.notes.length > 0 ? (
                    selectedAuth.notes.map((n, idx) => (
                      <div key={idx} className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <strong className="text-[#102A43]">{n.author}</strong>
                          <span className="text-[#8A97A8]">{n.date}</span>
                        </div>
                        <p className="text-[#40516A]">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#8A97A8]">No internal review notes recorded.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Approve Pre-Authorization"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsApproveOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmApprove}
              className="px-4 py-2 bg-[#16865B] hover:bg-[#13724c] text-white rounded-lg text-xs font-semibold"
            >
              Issue Approval Letter
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#66758A]">
            You are approving cashless hospital coverage for <strong>{selectedAuth?.memberName}</strong> at{' '}
            <strong>{selectedAuth?.hospitalName}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Approved Amount (PKR) *</label>
            <input
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(Number(e.target.value))}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-sm font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
            />
            <span className="text-[11px] text-[#8A97A8] mt-1 block">
              Estimated request was PKR {selectedAuth?.estimatedCost.toLocaleString()}
            </span>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Pre-Authorization"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRejectOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              className="px-4 py-2 bg-[#D64545] hover:bg-[#b53737] text-white rounded-lg text-xs font-semibold"
            >
              Confirm Rejection
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#66758A]">
            Please enter the clinical or policy justification for declining this request.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Rejection Reason *</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Procedure is an elective cosmetic intervention not covered under Schedule B."
              className="w-full border border-[#E5EAF1] rounded-lg p-2.5 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
            />
          </div>
        </div>
      </Modal>

      {/* Request Info Modal */}
      <Modal
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        title="Request Additional Clinical Information"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRequestInfoOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRequestInfo}
              className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
            >
              Send Request to Hospital
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-[#66758A]">
            Ask the hospital administration or attending surgeon for additional diagnostics (e.g., MRI scan, histopathology report).
          </p>
          <textarea
            rows={4}
            value={infoQuery}
            onChange={(e) => setInfoQuery(e.target.value)}
            placeholder="Specify requested reports or clinical questions..."
            className="w-full border border-[#E5EAF1] rounded-lg p-2.5 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
          />
        </div>
      </Modal>

      {/* New Request Modal */}
      <Modal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        title="Create Pre-Authorization Request"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewRequestOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNewRequest}
              className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
            >
              Submit for Medical Review
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateNewRequest} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Select Insured Member *</label>
              <select
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              >
                {insuredMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.memberNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Panel Hospital *</label>
              <select
                value={newHospitalId}
                onChange={(e) => setNewHospitalId(e.target.value)}
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
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Procedure / Treatment *</label>
              <input
                type="text"
                placeholder="e.g. Laparoscopic Cholecystectomy"
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Procedure / CPT Code</label>
              <input
                type="text"
                placeholder="e.g. CPT-47562"
                value={newProcedureCode}
                onChange={(e) => setNewProcedureCode(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Hospital Department</label>
              <input
                type="text"
                placeholder="e.g. General Surgery"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Estimated Cost (PKR) *</label>
              <input
                type="number"
                value={newEstimatedCost}
                onChange={(e) => setNewEstimatedCost(Number(e.target.value))}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Normal">Normal (Standard 24h SLA)</option>
                <option value="High">High (Urgent 6h SLA)</option>
                <option value="Urgent">Urgent (Emergency 2h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Clinical Justification & Notes *</label>
            <textarea
              rows={3}
              value={newJustification}
              onChange={(e) => setNewJustification(e.target.value)}
              placeholder="Clinical symptoms, diagnostic ultrasound / MRI summary, and necessity for procedure..."
              className="w-full border border-[#E5EAF1] rounded-lg p-2.5 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default PreAuthorizations;
