import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import AddCustomerModal from './AddCustomerModal';

export const Customers: React.FC = () => {
  const { customers, policies, claims, transactions, showToast } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{c.name}</div>
            <span className="text-[11px] text-[#8A97A8]">{c.id} · {c.ssn}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact Info',
      render: (c) => (
        <div>
          <div className="font-medium text-[#102A43]">{c.email}</div>
          <span className="text-[11px] text-[#8A97A8]">{c.phone}</span>
        </div>
      ),
    },
    {
      key: 'corporateClientName',
      header: 'Corporate Client',
      sortable: true,
      render: (c) => <span className="text-[#40516A]">{c.corporateClientName || 'Individual'}</span>,
    },
    {
      key: 'insuranceCompanyName',
      header: 'Assigned Insurer',
      sortable: true,
      render: (c) => <span className="text-[#2776EA] font-medium">{c.insuranceCompanyName}</span>,
    },
    {
      key: 'activePolicies',
      header: 'Policies',
      sortable: true,
      render: (c) => <span className="font-semibold text-[#102A43]">{c.activePolicies}</span>,
    },
    {
      key: 'registrationDate',
      header: 'Enrolled On',
      sortable: true,
      render: (c) => <span className="text-[#8A97A8]">{c.registrationDate}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => <Badge value={c.status} size="sm" />,
    },
  ];

  const handleView = (c: Customer) => {
    setSelectedCustomer(c);
    setActiveTab('Overview');
    setIsDetailOpen(true);
  };

  // Dynamically resolve linked customer entities
  const customerPolicies = selectedCustomer
    ? policies.filter(
        (p) =>
          p.memberName.toLowerCase() === selectedCustomer.name.toLowerCase() ||
          (selectedCustomer.corporateClientName &&
            p.corporateClientName?.toLowerCase() === selectedCustomer.corporateClientName.toLowerCase())
      )
    : [];

  const customerClaims = selectedCustomer
    ? claims.filter(
        (c) =>
          c.memberName.toLowerCase() === selectedCustomer.name.toLowerCase() ||
          c.memberId === selectedCustomer.id ||
          (selectedCustomer.corporateClientName &&
            c.insuranceCompanyName?.toLowerCase() === selectedCustomer.insuranceCompanyName?.toLowerCase())
      )
    : [];

  const customerTransactions = selectedCustomer
    ? transactions.filter(
        (t) =>
          t.relatedEntity.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          (selectedCustomer.corporateClientName &&
            t.relatedEntity.toLowerCase().includes(selectedCustomer.corporateClientName.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Customers"
        description="Subscriber profiles, corporate account relationships, individual policy accounts, and payment history."
        breadcrumbs={['People', 'Customers']}
        primaryAction={{
          label: 'Add Customer',
          icon: 'plus',
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Subscribers</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{customers.length * 1016}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Accounts</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">14,120</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">New This Month</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">284</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Pending KYC Verification</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">48</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customer by name, SSN / ID, email, or company..."
        statusKey="status"
        onView={handleView}
      />

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCustomer(null);
          }}
          title={selectedCustomer.name}
          subtitle={`Subscriber Account (${selectedCustomer.id})`}
          status={selectedCustomer.status}
          avatarInitials={selectedCustomer.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Policies', 'Claims', 'Payments', 'Documents']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Export Statement',
              icon: 'download',
              onClick: () => showToast('Export Complete', `Customer statement exported for ${selectedCustomer.name}.`),
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Active Policies</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">{selectedCustomer.activePolicies}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Account Status</span>
                  <span className="text-base font-bold text-[#16865B] mt-0.5 block">{selectedCustomer.status}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">KYC Verified</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">Approved</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">Customer Profile & KYC</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">National ID / SSN</span>
                    <span className="font-semibold text-[#102A43] font-mono">{selectedCustomer.ssn}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Date of Birth</span>
                    <span className="font-semibold text-[#102A43]">{selectedCustomer.dob}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Email Address</span>
                    <span className="font-semibold text-[#102A43]">{selectedCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Contact Number</span>
                    <span className="font-semibold text-[#102A43]">{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Corporate Employer</span>
                    <span className="font-semibold text-[#102A43]">{selectedCustomer.corporateClientName || 'Individual Direct'}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Underwriting Carrier</span>
                    <span className="font-semibold text-[#2776EA]">{selectedCustomer.insuranceCompanyName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#8A97A8] block">Billing / Residential Address</span>
                    <span className="font-semibold text-[#102A43]">
                      {selectedCustomer.address}, {selectedCustomer.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Policies' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Underwritten Policies & Coverage</h4>
                <span className="text-xs text-[#2776EA] font-semibold">{customerPolicies.length} Active Policies</span>
              </div>

              {customerPolicies.length > 0 ? (
                <div className="space-y-3">
                  {customerPolicies.map((pol) => (
                    <div key={pol.id} className="p-4 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{pol.planName}</span>
                          <span className="text-[#2776EA] font-mono font-semibold">Policy No: {pol.policyNumber}</span>
                        </div>
                        <Badge value={pol.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Annual Limit</span>
                          <span className="font-bold text-[#102A43]">{pol.coverageAmount}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Monthly Premium</span>
                          <span className="font-semibold text-[#2776EA]">{pol.monthlyPremium}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Expiry Date</span>
                          <span className="font-medium text-[#40516A]">{pol.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#102A43] text-sm block">Comprehensive Group Health Plan</span>
                      <span className="text-[#2776EA] font-mono font-semibold">Policy No: POL-2025-00{selectedCustomer.id.replace(/\D/g, '')}</span>
                    </div>
                    <Badge value="Active" size="sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                    <div>
                      <span className="text-[#8A97A8] block">Annual Limit</span>
                      <span className="font-bold text-[#102A43]">PKR 2,500,000</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block">Monthly Premium</span>
                      <span className="font-semibold text-[#2776EA]">PKR 14,500</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block">Expiry Date</span>
                      <span className="font-medium text-[#40516A]">31 Dec 2025</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Claims' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Medical Claims Record</h4>
                <span className="text-xs text-[#66758A]">{customerClaims.length} Claims Filed</span>
              </div>

              {customerClaims.length > 0 ? (
                <div className="space-y-3">
                  {customerClaims.map((clm) => (
                    <div key={clm.id} className="p-4 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{clm.claimNumber}</span>
                          <span className="text-[#66758A]">{clm.hospitalName} • {clm.diagnosis}</span>
                        </div>
                        <Badge value={clm.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Submitted</span>
                          <span className="font-bold text-[#102A43]">PKR {clm.submittedAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved</span>
                          <span className="font-bold text-[#16865B]">
                            {clm.approvedAmount ? `PKR ${clm.approvedAmount.toLocaleString()}` : 'Pending'}
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
                    {
                      claimNumber: `CLM-2025-00${selectedCustomer.id.replace(/\D/g, '') || '12'}`,
                      hospital: 'St. Jude Memorial Hospital',
                      diag: 'Inpatient Diagnostic Endoscopy & Consultation',
                      submitted: 125000,
                      approved: 125000,
                      status: 'Paid',
                      date: '14 Apr 2025',
                    },
                    {
                      claimNumber: `CLM-2025-00${Number(selectedCustomer.id.replace(/\D/g, '') || '12') + 1}`,
                      hospital: 'Summit Valley Medical Center',
                      diag: 'Outpatient Specialist Prescription & Labs',
                      submitted: 42000,
                      approved: 38500,
                      status: 'Approved',
                      date: '02 May 2025',
                    },
                  ].map((clm, idx) => (
                    <div key={idx} className="p-4 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{clm.claimNumber}</span>
                          <span className="text-[#66758A]">{clm.hospital} • {clm.diag}</span>
                        </div>
                        <Badge value={clm.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Submitted</span>
                          <span className="font-bold text-[#102A43]">PKR {clm.submitted.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved</span>
                          <span className="font-bold text-[#16865B]">PKR {clm.approved.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Date</span>
                          <span className="font-medium text-[#40516A]">{clm.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Payments' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Premium Payment Ledger</h4>
                <span className="text-xs text-[#16865B] font-semibold">Up to Date</span>
              </div>

              {customerTransactions.length > 0 ? (
                <div className="space-y-2.5">
                  {customerTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs bg-[#F8FAFC]">
                      <div>
                        <span className="font-bold text-[#102A43] block">{tx.type}</span>
                        <span className="text-[11px] text-[#8A97A8] font-mono">Ref: {tx.reference} • {tx.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#16865B] block">PKR {tx.amount.toLocaleString()}</span>
                        <Badge value={tx.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { title: 'Monthly Corporate Payroll Deduction (May 2025)', ref: 'PAY-2025-05-991', amount: 'PKR 14,500', date: '01 May 2025' },
                    { title: 'Monthly Corporate Payroll Deduction (Apr 2025)', ref: 'PAY-2025-04-812', amount: 'PKR 14,500', date: '01 Apr 2025' },
                    { title: 'Monthly Corporate Payroll Deduction (Mar 2025)', ref: 'PAY-2025-03-744', amount: 'PKR 14,500', date: '01 Mar 2025' },
                  ].map((p, idx) => (
                    <div key={idx} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs bg-[#F8FAFC]">
                      <div>
                        <span className="font-semibold text-[#102A43] block">{p.title}</span>
                        <span className="text-[11px] text-[#8A97A8] font-mono">Ref: {p.ref} • {p.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#16865B] block">{p.amount}</span>
                        <Badge value="Completed" variant="success" size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Verified Subscriber Documents</h4>
              {[
                `Government_ID_Verification_${selectedCustomer.id}.pdf`,
                'Employment_Verification_Letter.pdf',
                'Signed_Insurance_Proposal_Consent.pdf',
                'HIPAA_Patient_Privacy_Authorization.pdf',
              ].map((doc, i) => (
                <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs bg-[#F8FAFC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                    <div>
                      <span className="font-medium text-[#102A43] block">{doc}</span>
                      <span className="text-[10px] text-[#8A97A8]">Verified & Digitally Stamped</span>
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

      {/* Add Customer Modal */}
      <AddCustomerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};

export default Customers;
