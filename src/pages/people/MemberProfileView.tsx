import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { InsuredMember } from '../../types';
import { useApp } from '../../context/AppContext';

interface MemberProfileViewProps {
  member: InsuredMember;
  onBack: () => void;
  onEdit: (member: InsuredMember) => void;
}

export const MemberProfileView: React.FC<MemberProfileViewProps> = ({ member, onBack, onEdit }) => {
  const { showToast, claims, preAuthorizations, transactions, policies } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview',
    'Personal Information',
    'Dependents',
    'Insurance Coverage',
    'Policies',
    'Claims',
    'Pre-Authorizations',
    'Transactions',
    'Documents',
    'Activity Timeline',
  ];

  const memberClaims = claims.filter((c) => c.memberId === member.id || c.memberName === member.name);
  const memberPreAuths = preAuthorizations.filter((a) => a.memberId === member.id || a.memberName === member.name);
  const memberPolicies = policies.filter((p) => p.memberId === member.id || p.memberName === member.name);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2776EA] hover:text-[#1E65CF] transition-colors"
        >
          <Icon name="arrow-left" size={14} />
          Back to Insured Members
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(member)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E5EAF1] text-[#40516A] hover:bg-[#F8FAFC]"
          >
            <Icon name="edit" size={13} />
            Edit Profile
          </button>
          <button
            onClick={() => showToast('Card Downloaded', `Digital health card downloaded for ${member.name}.`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2776EA] text-white hover:bg-[#1E65CF]"
          >
            <Icon name="download" size={13} />
            Download Health Card
          </button>
        </div>
      </div>

      {/* Member Hero Banner */}
      <div className="bg-white border border-[#E5EAF1] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] border border-[#c8ddfb] text-[#2776EA] font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-xs">
            {member.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#102A43]">{member.name}</h1>
              <Badge value={member.status} size="sm" />
              <Badge value={member.memberType} variant="info" size="sm" />
            </div>
            <div className="flex items-center gap-4 text-xs text-[#66758A] mt-1.5 flex-wrap">
              <span>Member ID: <strong className="text-[#102A43]">{member.id}</strong></span>
              <span>Policy: <strong className="text-[#2776EA]">{member.policyNumber}</strong></span>
              <span>Employer: <strong className="text-[#102A43]">{member.corporateClientName}</strong></span>
              <span>SSN / ID: <strong className="text-[#102A43]">{member.ssn}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#E5EAF1] pt-4 md:pt-0 md:pl-6 flex-shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8] block">Annual Limit</span>
            <span className="text-lg font-bold text-[#102A43]">{member.coverageLimit}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8] block">Utilized</span>
            <span className="text-lg font-bold text-[#D69B32]">{member.claimsUtilized}</span>
          </div>
        </div>
      </div>

      {/* 10-Tab Navigation Bar */}
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
                <span className="text-[11px] text-[#8A97A8] font-medium block">Total Available Coverage</span>
                <span className="text-xl font-bold text-[#102A43] mt-1 block">{member.coverageLimit}</span>
                <span className="text-[11px] text-[#16865B] font-medium mt-1 block">✓ 100% Cashless at Network Hospitals</span>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
                <span className="text-[11px] text-[#8A97A8] font-medium block">Incurred Claims YTD</span>
                <span className="text-xl font-bold text-[#102A43] mt-1 block">{member.claimsUtilized}</span>
                <span className="text-[11px] text-[#66758A] mt-1 block">{memberClaims.length} total claims filed</span>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
                <span className="text-[11px] text-[#8A97A8] font-medium block">Covered Family Dependents</span>
                <span className="text-xl font-bold text-[#2776EA] mt-1 block">{member.dependents.length} Lives</span>
                <span className="text-[11px] text-[#66758A] mt-1 block">Included in unified family pool</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Personal Profile Snapshot</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Date of Birth</span>
                    <span className="font-semibold text-[#102A43]">{member.dob}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Blood Group</span>
                    <span className="font-semibold text-[#D64545]">{member.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Mobile Phone</span>
                    <span className="font-semibold text-[#102A43]">{member.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Email</span>
                    <span className="font-semibold text-[#2776EA]">{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Underwriting & Corporate Plan</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Insurance Company</span>
                    <span className="font-semibold text-[#102A43]">{member.insuranceCompanyName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Plan Tier</span>
                    <span className="font-semibold text-[#2776EA]">{member.insurancePlanName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Coverage Effective</span>
                    <span className="font-semibold text-[#102A43]">{member.coverageStart}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Coverage Expiry</span>
                    <span className="font-semibold text-[#102A43]">{member.coverageEnd}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL INFORMATION */}
        {activeTab === 'Personal Information' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-semibold text-[#102A43]">Verified Identity & Demographics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Full Name</span>
                <span className="font-semibold text-[#102A43] text-sm">{member.name}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Social Security Number (SSN / ID)</span>
                <span className="font-semibold text-[#102A43] text-sm">{member.ssn}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Date of Birth</span>
                <span className="font-semibold text-[#102A43] text-sm">{member.dob}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Blood Group</span>
                <span className="font-semibold text-[#D64545] text-sm">{member.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Primary Phone</span>
                <span className="font-semibold text-[#102A43] text-sm">{member.phone}</span>
              </div>
              <div>
                <span className="text-[#8A97A8] block mb-0.5">Work Email Address</span>
                <span className="font-semibold text-[#2776EA] text-sm">{member.email}</span>
              </div>
            </div>

            <div className="border-t border-[#E5EAF1] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">Emergency Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8A97A8] block">Designated Kin</span>
                  <span className="font-semibold text-[#102A43]">Emily Wright (Spouse)</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Emergency Phone</span>
                  <span className="font-semibold text-[#102A43]">+1 (555) 456-7891</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEPENDENTS */}
        {activeTab === 'Dependents' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#102A43]">Covered Family Dependents</h3>
                <p className="text-xs text-[#66758A] mt-0.5">Family members linked under policy {member.policyNumber}</p>
              </div>
            </div>

            {member.dependents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#66758A] font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Dependent Name</th>
                      <th className="py-2.5 px-3">Relationship</th>
                      <th className="py-2.5 px-3">SSN / ID</th>
                      <th className="py-2.5 px-3">Date of Birth</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1]">
                    {member.dependents.map((dep) => (
                      <tr key={dep.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-3 font-semibold text-[#102A43]">{dep.name}</td>
                        <td className="py-2.5 px-3 text-[#2776EA] font-medium">{dep.relationship}</td>
                        <td className="py-2.5 px-3 text-[#40516A]">{dep.ssn}</td>
                        <td className="py-2.5 px-3 text-[#8A97A8]">{dep.dob}</td>
                        <td className="py-2.5 px-3">
                          <Badge value={dep.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#8A97A8] py-8 text-center">No dependent family members currently enrolled.</p>
            )}
          </div>
        )}

        {/* TAB 4: INSURANCE COVERAGE */}
        {activeTab === 'Insurance Coverage' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#102A43]">{member.insurancePlanName} — Benefit Schedule</h3>
              <p className="text-xs text-[#66758A] mt-0.5">Underwritten by {member.insuranceCompanyName}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Inpatient Hospitalization', limit: 'PKR 3,000,000', used: 'PKR 450,000', status: 'Available' },
                { title: 'Outpatient (OPD) Consults', limit: 'PKR 250,000', used: 'PKR 18,000', status: 'Available' },
                { title: 'Maternity Benefit (Normal / C-Sec)', limit: 'PKR 350,000', used: 'PKR 0', status: 'Available' },
                { title: 'Dental & Vision Care', limit: 'PKR 100,000', used: 'PKR 17,000', status: 'Available' },
              ].map((b, i) => (
                <div key={i} className="p-4 border border-[#E5EAF1] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#102A43]">
                    <span>{b.title}</span>
                    <span className="text-[#2776EA]">{b.limit}</span>
                  </div>
                  <div className="w-full bg-[#E5EAF1] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2776EA] h-full rounded-full w-[20%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8A97A8]">
                    <span>Utilized: {b.used}</span>
                    <span className="text-[#16865B] font-medium">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: POLICIES */}
        {activeTab === 'Policies' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Active Healthcare Policies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#66758A] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Policy Number</th>
                    <th className="py-2.5 px-3">Plan Name</th>
                    <th className="py-2.5 px-3">Insurer</th>
                    <th className="py-2.5 px-3">Tenure</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF1]">
                  {memberPolicies.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-semibold text-[#2776EA]">{p.policyNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-[#102A43]">{p.planName}</td>
                      <td className="py-2.5 px-3 text-[#66758A]">{p.insuranceCompanyName}</td>
                      <td className="py-2.5 px-3 text-[#8A97A8]">
                        {p.startDate} – {p.expiryDate}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge value={p.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CLAIMS */}
        {activeTab === 'Claims' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Adjudicated & Filed Claims</h3>
            {memberClaims.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#66758A] font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Claim ID</th>
                      <th className="py-2.5 px-3">Hospital</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right">Submitted</th>
                      <th className="py-2.5 px-3 text-right">Approved</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1]">
                    {memberClaims.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-3 font-semibold text-[#2776EA]">{c.claimNumber}</td>
                        <td className="py-2.5 px-3 text-[#102A43]">{c.hospitalName}</td>
                        <td className="py-2.5 px-3 text-[#66758A]">{c.claimType}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-[#102A43]">
                          PKR {c.submittedAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-[#16865B]">
                          {c.approvedAmount ? `PKR ${c.approvedAmount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-[#8A97A8]">{c.submissionDate}</td>
                        <td className="py-2.5 px-3">
                          <Badge value={c.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#8A97A8] py-6 text-center">No claims recorded for this member.</p>
            )}
          </div>
        )}

        {/* TAB 7: PRE-AUTHORIZATIONS */}
        {activeTab === 'Pre-Authorizations' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Treatment Pre-Authorizations</h3>
            {memberPreAuths.length > 0 ? (
              <div className="space-y-2">
                {memberPreAuths.map((auth) => (
                  <div key={auth.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#2776EA] block">{auth.authNumber}</span>
                      <span className="font-medium text-[#102A43]">{auth.treatment}</span>
                      <span className="text-[11px] text-[#8A97A8] block">
                        {auth.hospitalName} · Estimated: PKR {auth.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <Badge value={auth.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A97A8] py-6 text-center">No pre-authorization requests on record.</p>
            )}
          </div>
        )}

        {/* TAB 8: TRANSACTIONS */}
        {activeTab === 'Transactions' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Financial Transactions</h3>
            <p className="text-xs text-[#66758A]">
              Premium and reimbursement disbursements processed for {member.name}.
            </p>
            <div className="space-y-2">
              {[
                { title: 'Claim Reimbursement CLM-2025001', amount: 'PKR 450,000', date: '20 May 2025', status: 'Completed' },
                { title: 'Corporate Premium Share', amount: 'PKR 15,000', date: '01 Jan 2025', status: 'Completed' },
              ].map((tx, i) => (
                <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-[#102A43] block">{tx.title}</span>
                    <span className="text-[11px] text-[#8A97A8]">{tx.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#102A43]">{tx.amount}</span>
                    <Badge value={tx.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#102A43]">Verified Policy Documents</h3>
            {[
              { name: 'Member_Health_Card_Digital.pdf', size: '1.2 MB', desc: 'Official digital health card' },
              { name: 'Policy_Schedule_POL-2025001.pdf', size: '2.5 MB', desc: 'Coverage schedule and terms' },
              { name: 'ID_Verification_Document.pdf', size: '840 KB', desc: 'Verified government identity document' },
            ].map((doc, i) => (
              <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold">
                    <Icon name="file" size={15} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#102A43] block">{doc.name}</span>
                    <span className="text-[11px] text-[#8A97A8]">
                      {doc.size} · {doc.desc}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Downloaded', `Downloading ${doc.name}`)}
                  className="px-3 py-1 text-xs font-semibold rounded-md border border-[#E5EAF1] text-[#2776EA] hover:bg-[#EAF2FF]"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 10: ACTIVITY TIMELINE */}
        {activeTab === 'Activity Timeline' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#102A43]">Member Lifecycle Trail</h3>
            <div className="space-y-4 text-xs">
              {[
                { title: 'Claim CLM-2025001 Approved', time: '13 May 2025, 10:20 AM', desc: 'Approved for PKR 450,000 by Sarah Jenkins' },
                { title: 'Pre-Authorization AUTH-2025001 Granted', time: '08 May 2025, 04:15 PM', desc: 'Approved for Coronary Angioplasty at Metropolitan Medical' },
                { title: 'Policy Renewed for FY25', time: '01 Jan 2025, 09:00 AM', desc: 'Enrolled under Executive Health Plus' },
                { title: 'Primary Member Registered', time: '20 Jan 2024, 11:30 AM', desc: 'Added by HR Coordinator at Acme Corporation' },
              ].map((trail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2776EA] mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#102A43]">{trail.title}</h5>
                    <p className="text-[11px] text-[#66758A] mt-0.5">{trail.desc}</p>
                    <span className="text-[10px] text-[#8A97A8]">{trail.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfileView;
