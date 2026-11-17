import React, { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { Claim } from '../../types';
import { useApp } from '../../context/AppContext';

interface ClaimDetailViewProps {
  claim: Claim;
  onBack: () => void;
}

export const ClaimDetailView: React.FC<ClaimDetailViewProps> = ({ claim, onBack }) => {
  const { approveClaim, rejectClaim, requestClaimInfo, addClaimNote, markClaimAsPaid, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('Overview');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Form states
  const [approvedAmountInput, setApprovedAmountInput] = useState<number>(claim.submittedAmount);
  const [approveNote, setApproveNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const tabs = [
    'Overview',
    'Claimant',
    'Policy',
    'Hospital',
    'Treatment',
    'Documents',
    'Review Notes',
    'Timeline',
  ];

  const handleConfirmApprove = () => {
    approveClaim(claim.id, approvedAmountInput, approveNote);
    setShowApproveModal(false);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      showToast('Reason Required', 'Please specify a rejection reason.', 'error');
      return;
    }
    rejectClaim(claim.id, rejectReason, rejectNote);
    setShowRejectModal(false);
  };

  const handleConfirmRequestInfo = () => {
    if (!infoMessage.trim()) return;
    requestClaimInfo(claim.id, infoMessage);
    setShowInfoModal(false);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    addClaimNote(claim.id, newNoteText);
    setNewNoteText('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2776EA] hover:text-[#1E65CF] transition-colors"
        >
          <Icon name="arrow-left" size={14} />
          Back to Claims Management
        </button>

        <div className="flex items-center gap-2">
          {claim.status !== 'Approved' && claim.status !== 'Paid' && (
            <button
              onClick={() => {
                setApprovedAmountInput(claim.submittedAmount);
                setShowApproveModal(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF] shadow-xs"
            >
              Approve Claim
            </button>
          )}

          {claim.status !== 'Rejected' && claim.status !== 'Paid' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FDECEC] border border-[#f7c5c5] text-[#D64545] hover:bg-[#fbd3d3]"
            >
              Reject Claim
            </button>
          )}

          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC]"
          >
            Request Info
          </button>

          <button
            onClick={() => setShowNoteModal(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC]"
          >
            + Add Note
          </button>

          {claim.status === 'Approved' && (
            <button
              onClick={() => markClaimAsPaid(claim.id)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#16865B] text-white hover:bg-[#12704c]"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Claim Hero Banner */}
      <div className="bg-white border border-[#E5EAF1] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] border border-[#c8ddfb] text-[#2776EA] font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-xs">
            CLM
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#102A43]">{claim.claimNumber}</h1>
              <Badge value={claim.status} size="sm" />
              <Badge value={`Priority: ${claim.priority}`} variant={claim.priority === 'Urgent' ? 'error' : 'warning'} size="sm" />
            </div>
            <div className="flex items-center gap-4 text-xs text-[#66758A] mt-1.5 flex-wrap">
              <span>Member: <strong className="text-[#102A43]">{claim.memberName}</strong></span>
              <span>Policy: <strong className="text-[#2776EA]">{claim.policyNumber}</strong></span>
              <span>Hospital: <strong className="text-[#102A43]">{claim.hospitalName}</strong></span>
              <span>Submitted: <strong className="text-[#102A43]">{claim.submissionDate}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#E5EAF1] pt-4 md:pt-0 md:pl-6 flex-shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8] block">Submitted</span>
            <span className="text-xl font-bold text-[#102A43]">PKR {claim.submittedAmount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8] block">Approved</span>
            <span className="text-xl font-bold text-[#16865B]">
              {claim.approvedAmount ? `PKR ${claim.approvedAmount.toLocaleString()}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Rejection Notice Banner (if rejected) */}
      {claim.status === 'Rejected' && claim.rejectionReason && (
        <div className="bg-[#FDECEC] border border-[#f7c5c5] rounded-xl p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#D64545] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            ✕
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#c53f3f]">Formal Rejection Notice</h4>
            <p className="text-xs text-[#c53f3f] mt-0.5 leading-relaxed">{claim.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl px-4 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-2xs">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#2776EA] text-[#2776EA] font-semibold'
                  : 'border-transparent text-[#66758A] hover:text-[#102A43]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
                <span className="text-[11px] text-[#8A97A8] font-medium block">Total Incurred Bill</span>
                <span className="text-xl font-bold text-[#102A43] mt-1 block">
                  PKR {claim.submittedAmount.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#66758A] mt-1 block">Hospital claim tariff checked</span>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
                <span className="text-[11px] text-[#8A97A8] font-medium block">Adjudicated Payable</span>
                <span className="text-xl font-bold text-[#16865B] mt-1 block">
                  {claim.approvedAmount ? `PKR ${claim.approvedAmount.toLocaleString()}` : 'Under Review'}
                </span>
                <span className="text-[11px] text-[#16865B] font-medium mt-1 block">
                  {claim.approvedAmount ? '✓ Net of deductible & co-pay' : 'Awaiting medical audit'}
                </span>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
                <span className="text-[11px] text-[#8A97A8] font-medium block">Adjudication Protocol</span>
                <span className="text-xl font-bold text-[#2776EA] mt-1 block">{claim.claimType}</span>
                <span className="text-[11px] text-[#66758A] mt-1 block">Cashless hospital desk stream</span>
              </div>
            </div>

            {/* Coverage Check Green Alert */}
            <div className="bg-[#E8F6EF] border border-[#c2e8d3] rounded-xl p-4 flex items-start gap-3">
              <span className="text-[#16865B] text-lg font-bold">✓</span>
              <div>
                <h4 className="text-xs font-bold text-[#16865B]">Automated Underwriting Eligibility Check Passed</h4>
                <p className="text-xs text-[#16865B] mt-0.5 leading-relaxed">
                  Member policy {claim.policyNumber} was in active standing on the date of treatment ({claim.treatmentDate}).
                  Treatment category ({claim.claimType}) falls within authorized annual entitlements.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Clinical Summary & Diagnosis</h3>
              <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg">
                <span className="text-xs font-semibold text-[#102A43] block">{claim.diagnosis}</span>
                <span className="text-[11px] text-[#66758A] mt-1 block">
                  Attending Consultant: {claim.treatingDoctor} · Department: {claim.department}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLAIMANT */}
        {activeTab === 'Claimant' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Subscriber Identity Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#8A97A8] block">Member Name</span>
                <span className="font-semibold text-[#102A43]">{claim.memberName}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Member ID</span>
                <span className="font-semibold text-[#2776EA]">{claim.memberId}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Policy Number</span>
                <span className="font-semibold text-[#102A43]">{claim.policyNumber}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Underwriting Carrier</span>
                <span className="font-semibold text-[#102A43]">{claim.insuranceCompanyName}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Admission Status</span>
                <span className="font-semibold text-[#16865B]">Cashless Panel Pre-authorized</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POLICY */}
        {activeTab === 'Policy' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Policy Deductible & Co-Pay Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg">
                <span className="text-[#8A97A8] block">Billed Total</span>
                <span className="font-bold text-[#102A43] text-sm">PKR {claim.submittedAmount.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg">
                <span className="text-[#8A97A8] block">Deductible Applied</span>
                <span className="font-bold text-[#D69B32] text-sm">PKR 10,000</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg">
                <span className="text-[#8A97A8] block">Co-Payment (10%)</span>
                <span className="font-bold text-[#D69B32] text-sm">PKR 25,000</span>
              </div>
              <div className="p-3 bg-[#EAF2FF] border border-[#c8ddfb] rounded-lg">
                <span className="text-[#2776EA] block font-semibold">Net Adjudicated</span>
                <span className="font-bold text-[#2776EA] text-sm">
                  {claim.approvedAmount ? `PKR ${claim.approvedAmount.toLocaleString()}` : 'PKR 450,000'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HOSPITAL */}
        {activeTab === 'Hospital' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Healthcare Provider Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8A97A8] block">Facility Name</span>
                <span className="font-semibold text-[#102A43]">{claim.hospitalName}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Department</span>
                <span className="font-semibold text-[#102A43]">{claim.department}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Treating Consultant</span>
                <span className="font-semibold text-[#102A43]">{claim.treatingDoctor}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block">Treatment Date</span>
                <span className="font-semibold text-[#102A43]">{claim.treatmentDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TREATMENT */}
        {activeTab === 'Treatment' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Itemized Clinical Bill Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#66758A] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Service Category</th>
                    <th className="py-2.5 px-3">Procedure / Medication Description</th>
                    <th className="py-2.5 px-3 text-right">Billed Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF1]">
                  {claim.lineItems.map((li, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-medium text-[#2776EA]">{li.category}</td>
                      <td className="py-2.5 px-3 text-[#102A43]">{li.description}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-[#102A43]">
                        PKR {li.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#F8FAFC] font-bold text-xs">
                    <td colSpan={2} className="py-3 px-3 text-right text-[#102A43]">
                      Total Incurred Charge:
                    </td>
                    <td className="py-3 px-3 text-right text-[#102A43]">
                      PKR {claim.submittedAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Clinical Records & Receipts</h3>
            {[
              { name: 'Hospital_Discharge_Summary_Signed.pdf', size: '3.4 MB', desc: 'Physician clinical notes' },
              { name: 'Itemized_Final_Hospital_Bill.pdf', size: '1.8 MB', desc: 'Audit verified invoice' },
              { name: 'Diagnostic_Lab_Echocardiogram_Reports.pdf', size: '4.2 MB', desc: 'Diagnostic imaging' },
            ].map((doc, i) => (
              <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold">
                    <Icon name="file" size={15} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#102A43] block">{doc.name}</span>
                    <span className="text-[11px] text-[#8A97A8]">{doc.size} · {doc.desc}</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Download Started', `Downloading ${doc.name}`)}
                  className="px-3 py-1 text-xs font-semibold rounded-md border border-[#E5EAF1] text-[#2776EA] hover:bg-[#EAF2FF]"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: REVIEW NOTES */}
        {activeTab === 'Review Notes' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#102A43]">Internal Adjudicator Notes</h3>
              <button
                onClick={() => setShowNoteModal(true)}
                className="text-xs font-semibold text-[#2776EA] hover:underline"
              >
                + Add Note
              </button>
            </div>

            {claim.notes.length > 0 ? (
              <div className="space-y-3">
                {claim.notes.map((n, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#102A43]">{n.author} ({n.role})</span>
                      <span className="text-[10px] text-[#8A97A8]">{n.date}</span>
                    </div>
                    <p className="text-[#40516A] leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A97A8] py-4 text-center">No internal notes added yet.</p>
            )}
          </div>
        )}

        {/* TAB 8: TIMELINE */}
        {activeTab === 'Timeline' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Complete Claim Adjudication Trail</h3>
            <div className="space-y-4 text-xs">
              {claim.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2776EA] mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#102A43]">{item.title}</h5>
                    <p className="text-[11px] text-[#66758A] mt-0.5">{item.subtitle}</p>
                    <span className="text-[10px] text-[#8A97A8]">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPROVE MODAL */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title={`Approve Claim: ${claim.claimNumber}`}
        description="Verify approved financial amount and log internal medical audit confirmation."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">
              Final Approved Amount (PKR) <span className="text-[#D64545]">*</span>
            </label>
            <input
              type="number"
              value={approvedAmountInput}
              onChange={(e) => setApprovedAmountInput(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1] focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA]"
            />
            <span className="text-[11px] text-[#8A97A8] mt-1 block">
              Originally submitted: PKR {claim.submittedAmount.toLocaleString()}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">Adjudication Notes</label>
            <textarea
              rows={2}
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
              placeholder="e.g. Verified panel agreement tariff rates; approved with standard deductible."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5EAF1] flex items-center justify-end gap-2">
            <button
              onClick={() => setShowApproveModal(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmApprove}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF]"
            >
              Confirm Approval
            </button>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title={`Reject Claim: ${claim.claimNumber}`}
        description="A formal policy exclusion or documentation reason is strictly required."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">
              Rejection Reason <span className="text-[#D64545]">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Non-covered procedure under Section 4.2 of policy exclusions..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">Internal Note (Optional)</label>
            <input
              type="text"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Internal audit notes..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5EAF1] flex items-center justify-end gap-2">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#D64545] text-white hover:bg-[#b83535]"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* REQUEST INFO MODAL */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={`Request Information: ${claim.claimNumber}`}
        description="Send notification to hospital billing desk and patient requesting missing documents."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">
              Required Information / Clinical Inquiry <span className="text-[#D64545]">*</span>
            </label>
            <textarea
              rows={3}
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              placeholder="e.g. Please furnish the post-operative histopathology biopsy report from the lab..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5EAF1] flex items-center justify-end gap-2">
            <button
              onClick={() => setShowInfoModal(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRequestInfo}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF]"
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>

      {/* ADD NOTE MODAL */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Internal Adjudication Note"
        description="Notes are visible exclusively to internal Nexora administrators and medical auditors."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">Audit Note</label>
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter clinical or financial audit observation..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5EAF1]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5EAF1] flex items-center justify-end gap-2">
            <button
              onClick={() => setShowNoteModal(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF]"
            >
              Save Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimDetailView;
