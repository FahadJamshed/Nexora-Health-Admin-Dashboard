import React, { useState } from 'react';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Icon from '../../components/ui/Icon';
import Badge from '../../components/ui/Badge';
import { Company } from '../../types';
import { useApp } from '../../context/AppContext';

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (company: Company) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, isOpen, onClose, onEdit }) => {
  const {
    showToast,
    deleteCompany,
    corporateClients,
    insuranceCompanies,
    hospitals,
    insuredMembers,
    policies,
    claims,
    insurancePlans,
    transactions,
  } = useApp();

  const [activeTab, setActiveTab] = useState('Overview');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!company) return null;

  // Interconnected dynamic queries based on company type
  const isCorporate = company.type === 'Corporate';
  const isInsurance = company.type === 'Insurance';
  const isHospital = company.type === 'Hospital' || company.type === 'Clinic';

  const linkedCorporate = corporateClients.find((c) => c.name.toLowerCase() === company.name.toLowerCase());
  const linkedInsurance = insuranceCompanies.find((i) => i.name.toLowerCase() === company.name.toLowerCase());
  const linkedHospital = hospitals.find((h) => h.name.toLowerCase() === company.name.toLowerCase());

  // Linked records
  const linkedPolicies = policies.filter(
    (p) =>
      p.corporateClientName?.toLowerCase() === company.name.toLowerCase() ||
      p.insuranceCompanyName?.toLowerCase() === company.name.toLowerCase()
  );

  const linkedMembers = insuredMembers.filter(
    (m) =>
      m.corporateClientName?.toLowerCase() === company.name.toLowerCase() ||
      m.insuranceCompanyName?.toLowerCase() === company.name.toLowerCase()
  );

  const linkedClaims = claims.filter(
    (c) =>
      c.hospitalName?.toLowerCase() === company.name.toLowerCase() ||
      c.insuranceCompanyName?.toLowerCase() === company.name.toLowerCase()
  );

  const linkedPlans = insurancePlans.filter(
    (p) => p.insuranceCompanyName?.toLowerCase() === company.name.toLowerCase()
  );

  const linkedTransactions = transactions.filter(
    (t) => t.relatedEntity?.toLowerCase() === company.name.toLowerCase()
  );

  const tabs = ['Overview', 'Associated Records', 'Documents', 'Activity Trail'];

  const handleDelete = () => {
    deleteCompany(company.id);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <>
      <DetailDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={company.name}
        subtitle={`${company.type} Healthcare Partner`}
        status={company.status}
        avatarInitials={company.name.slice(0, 2).toUpperCase()}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          {
            label: 'Edit Profile',
            icon: 'edit',
            variant: 'primary',
            onClick: () => onEdit(company),
          },
          {
            label: 'Export Portfolio Brief',
            icon: 'download',
            variant: 'secondary',
            onClick: () => showToast('Summary Exported', `Downloaded PDF briefing for ${company.name}.`),
          },
          {
            label: 'Deactivate',
            icon: 'trash',
            variant: 'danger',
            onClick: () => setShowConfirmDelete(true),
          },
        ]}
      >
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-[#8A97A8] font-medium block">
              {isHospital ? 'Patient Capacity' : 'Enrolled Members'}
            </span>
            <span className="text-base font-bold text-[#102A43] mt-0.5 block">
              {isHospital
                ? `${linkedHospital?.totalBeds || 450} Beds`
                : (company.totalMembers || linkedMembers.length || 1200).toLocaleString()}
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-[#8A97A8] font-medium block">
              {isHospital ? 'Claims Handled' : isInsurance ? 'Active Plans' : 'Active Policies'}
            </span>
            <span className="text-base font-bold text-[#102A43] mt-0.5 block">
              {isHospital
                ? (linkedHospital?.totalClaims || linkedClaims.length || 380).toLocaleString()
                : isInsurance
                ? `${linkedPlans.length || 4} Plans`
                : `${linkedPolicies.length || company.activePolicies || 1} Policies`}
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-[#8A97A8] font-medium block">Turnaround SLA</span>
            <span className="text-base font-bold text-[#16865B] mt-0.5 block">
              {isHospital ? '2.5 hrs Admittance' : isInsurance ? '4.2 Days Settlement' : '24 hrs Service'}
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-[#8A97A8] font-medium block">Annual Volume</span>
            <span className="text-base font-bold text-[#2776EA] mt-0.5 block">
              {company.totalPremium || (linkedCorporate?.annualPremium ?? 'PKR 45.2M')}
            </span>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                Corporate & Statutory Identity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8A97A8] block">Legal Entity Name</span>
                  <span className="font-semibold text-[#102A43]">{company.name}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Corporate Tax ID / EIN</span>
                  <span className="font-semibold text-[#102A43] font-mono">{company.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Entity Classification</span>
                  <span className="font-semibold text-[#2776EA]">
                    {company.type === 'Insurance'
                      ? 'Underwriting Carrier & Risk Holder'
                      : company.type === 'Corporate'
                      ? 'Corporate Employer & Policy Sponsor'
                      : company.type === 'Hospital'
                      ? 'Tertiary Care Hospital & Surgical Center'
                      : 'Specialized Medical Facility'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Initial Onboarding Date</span>
                  <span className="font-semibold text-[#102A43]">{company.registrationDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                Liaison & Facility Headquarters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8A97A8] block">Principal Contact / Administrator</span>
                  <span className="font-semibold text-[#102A43]">{company.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Corporate Email</span>
                  <a href={`mailto:${company.email}`} className="font-semibold text-[#2776EA] hover:underline">
                    {company.email}
                  </a>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Telephone Hotline</span>
                  <span className="font-semibold text-[#102A43]">{company.phone}</span>
                </div>
                <div>
                  <span className="text-[#8A97A8] block">Digital Portal / Website</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#2776EA] hover:underline flex items-center gap-1"
                  >
                    {company.website || 'https://www.nexorahealth.com'} <Icon name="external" size={11} />
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#8A97A8] block">Physical Facility Address</span>
                  <span className="font-semibold text-[#102A43]">
                    {company.address}, {company.city}, {company.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Associated Records (Dynamic per Entity Type) */}
        {activeTab === 'Associated Records' && (
          <div className="space-y-4">
            {/* If Corporate Client */}
            {isCorporate && (
              <div className="space-y-4">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">
                      Active Group Insurance Policies ({linkedPolicies.length || 1})
                    </h4>
                    <span className="text-xs text-[#2776EA] font-semibold">Underwritten by {linkedCorporate?.insuranceCompanyName || 'Apex Health Insurance'}</span>
                  </div>
                  <div className="space-y-2">
                    {(linkedPolicies.length > 0 ? linkedPolicies : policies.slice(0, 2)).map((pol) => (
                      <div key={pol.id} className="p-3 rounded-lg border border-[#E5EAF1] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#102A43] block">{pol.policyNumber} · {pol.planName}</span>
                          <span className="text-[11px] text-[#8A97A8]">
                            Covering {pol.memberName} · Limit: {pol.coverageAmount} · Term: {pol.startDate} to {pol.expiryDate}
                          </span>
                        </div>
                        <Badge value={pol.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Covered Employee Census Sample ({linkedMembers.length > 0 ? linkedMembers.length : 3} Enrolled)
                  </h4>
                  <div className="space-y-2">
                    {(linkedMembers.length > 0 ? linkedMembers : insuredMembers.slice(0, 3)).map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg border border-[#E5EAF1] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#EAF2FF] text-[#2776EA] font-bold text-[11px] flex items-center justify-center">
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#102A43] block leading-tight">{m.name}</span>
                            <span className="text-[10px] text-[#8A97A8] font-mono">{m.id} · {m.memberType}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#102A43] block">{m.coverageLimit}</span>
                          <span className="text-[10px] text-[#16865B]">Active Cover</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Insurance Company */}
            {isInsurance && (
              <div className="space-y-4">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Underwritten Insurance Plans ({linkedPlans.length || 3})
                  </h4>
                  <div className="space-y-2">
                    {(linkedPlans.length > 0 ? linkedPlans : insurancePlans.slice(0, 3)).map((plan) => (
                      <div key={plan.id} className="p-3 rounded-lg border border-[#E5EAF1] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#102A43] block">{plan.name}</span>
                          <span className="text-[11px] text-[#8A97A8]">
                            Category: {plan.planType} · Monthly: {plan.monthlyPremium} · Annual Cap: {plan.coverageLimit}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF2FF] text-[#2776EA]">
                          {plan.enrolledMembers.toLocaleString()} Members
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Contracted Corporate Clients
                  </h4>
                  <div className="space-y-2">
                    {corporateClients
                      .filter((c) => c.insuranceCompanyName.toLowerCase().includes(company.name.toLowerCase().split(' ')[0]))
                      .map((corp) => (
                        <div key={corp.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-[#102A43] block">{corp.name}</span>
                            <span className="text-[11px] text-[#8A97A8]">
                              {corp.totalEmployees.toLocaleString()} Covered Staff · Premium: {corp.annualPremium}
                            </span>
                          </div>
                          <Badge value={corp.status} size="sm" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Hospital / Clinic */}
            {isHospital && (
              <div className="space-y-4">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Cashless Panel Treaties & Network Agreements
                  </h4>
                  <div className="space-y-2">
                    {(linkedHospital?.insuranceNetworks || ['Apex Health Insurance', 'Guardian Mutual Healthcare', 'Beacon Life & Health']).map((net, idx) => (
                      <div key={idx} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#102A43] block">{net}</span>
                          <span className="text-[11px] text-[#8A97A8]">Standard Cashless Admission MoU · 0% Co-Pay</span>
                        </div>
                        <Badge value="Active Panel" variant="success" size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Clinical Departments & Surgical Suites
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(linkedHospital?.departments || ['Cardiology', 'Orthopedics', 'General Surgery', 'Obstetrics & Gynecology', 'Emergency Medicine']).map((dept, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] text-[#102A43] font-medium flex items-center gap-1.5">
                        <span className="text-[#2776EA]">✓</span> {dept}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">
                    Recent Admitted Claims Handled
                  </h4>
                  <div className="space-y-2">
                    {(linkedClaims.length > 0 ? linkedClaims : claims.slice(0, 3)).map((c) => (
                      <div key={c.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#2776EA] block">{c.claimNumber} · {c.memberName}</span>
                          <span className="text-[11px] text-[#8A97A8]">{c.diagnosis} · Inpatient Admission</span>
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
            )}
          </div>
        )}

        {/* Tab 3: Documents */}
        {activeTab === 'Documents' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">
              Verified Legal, Regulatory & Compliance Documents
            </h4>
            {[
              {
                name: `${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate_of_Incorporation.pdf`,
                size: '2.4 MB',
                date: 'Verified 14 May 2024',
              },
              {
                name: `IRS_W9_Federal_EIN_Tax_Registration_${company.registrationNumber}.pdf`,
                size: '890 KB',
                date: 'Verified 15 May 2024',
              },
              {
                name: 'HIPAA_Business_Associate_Agreement_Nexora.pdf',
                size: '3.6 MB',
                date: 'Signed & Counter-signed 01 Jan 2025',
              },
              {
                name: 'Master_Healthcare_Panel_Service_Agreement_2025.pdf',
                size: '4.8 MB',
                date: 'Active Term through 31 Dec 2025',
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-[#E5EAF1] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-xs">
                    <Icon name="file" size={15} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#102A43]">{doc.name}</h5>
                    <span className="text-[11px] text-[#8A97A8]">
                      {doc.size} · {doc.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Download Started', `Downloading ${doc.name}`, 'info')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E5EAF1] text-[#2776EA] hover:bg-[#EAF2FF] transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Activity Trail */}
        {activeTab === 'Activity Trail' && (
          <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">
              Governance & Security Audit Trail
            </h4>
            <div className="space-y-4">
              {[
                {
                  title: 'Annual Institutional Treaty Renewed',
                  time: '18 May 2025, 03:00 PM',
                  user: 'Chloe Bennett (Organization Manager)',
                  desc: 'Executed renewal addendum extending coverage terms through end of fiscal year 2025.',
                },
                {
                  title: 'Compliance & Tax Certification Verified',
                  time: '10 Feb 2025, 11:15 AM',
                  user: 'Samuel Foster, CPA (Finance Admin)',
                  desc: 'Audited statutory filings and IRS W-9 form against federal healthcare registers.',
                },
                {
                  title: 'Organization Identity Profile Enrolled',
                  time: '15 Jan 2024, 09:30 AM',
                  user: 'Sarah Jenkins (Super Admin)',
                  desc: 'Initial master account provisioned on Nexora Health core administrative portal.',
                },
              ].map((trail, i) => (
                <div key={i} className="flex items-start gap-3 text-xs border-b border-[#E5EAF1] pb-3 last:border-0 last:pb-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2776EA] mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#102A43]">{trail.title}</h5>
                    <p className="text-[#66758A] text-[11px] mt-0.5">{trail.desc}</p>
                    <span className="text-[10px] text-[#8A97A8] block mt-1">
                      {trail.time} by <strong className="text-[#102A43]">{trail.user}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Confirmation Modal for Deactivate */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-[#E5EAF1] max-w-sm w-full p-5 space-y-3">
            <h4 className="text-sm font-semibold text-[#102A43]">Deactivate {company.name}?</h4>
            <p className="text-xs text-[#66758A] leading-relaxed">
              This will suspend all associated insurance policies and active claims processing for this organization.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E5EAF1] text-[#40516A]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D64545] text-white hover:bg-[#b83535]"
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetailModal;
