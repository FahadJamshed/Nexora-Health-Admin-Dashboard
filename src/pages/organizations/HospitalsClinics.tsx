import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import AddHospitalModal from './AddHospitalModal';

export const HospitalsClinics: React.FC = () => {
  const { hospitals, claims, navigate, showToast, deleteHospital } = useApp();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const columns: Column<Hospital>[] = [
    {
      key: 'name',
      header: 'Hospital / Healthcare Provider',
      sortable: true,
      render: (h) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {h.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{h.name}</div>
            <span className="text-[11px] text-[#8A97A8]">{h.location}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'providerType',
      header: 'Facility Type',
      sortable: true,
      render: (h) => <Badge value={h.providerType} variant="neutral" size="sm" />,
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
      render: (h) => <span className="font-medium text-[#102A43]">{h.city}</span>,
    },
    {
      key: 'contactPerson',
      header: 'Medical Administrator',
      render: (h) => (
        <div>
          <div className="font-medium text-[#102A43]">{h.contactPerson}</div>
          <span className="text-[11px] text-[#8A97A8]">{h.phone}</span>
        </div>
      ),
    },
    {
      key: 'insuranceNetworks',
      header: 'Panel Networks',
      render: (h) => (
        <span className="text-xs font-semibold text-[#2776EA] bg-[#EAF2FF] px-2 py-0.5 rounded">
          {h.insuranceNetworks.length} Insurers
        </span>
      ),
    },
    {
      key: 'totalClaims',
      header: 'Claims Filed',
      sortable: true,
      render: (h) => <span className="font-semibold text-[#102A43]">{h.totalClaims.toLocaleString()}</span>,
    },
    {
      key: 'networkStatus',
      header: 'Panel Status',
      sortable: true,
      render: (h) => <Badge value={h.networkStatus} size="sm" />,
    },
  ];

  const handleView = (h: Hospital) => {
    setSelectedHospital(h);
    setActiveTab('Overview');
    setIsDetailOpen(true);
  };

  // Dynamically resolve hospital claims
  const hospitalClaims = selectedHospital
    ? claims.filter(
        (c) =>
          c.hospitalName.toLowerCase() === selectedHospital.name.toLowerCase() ||
          c.hospitalName.toLowerCase().includes(selectedHospital.name.toLowerCase().split(' ')[0]) ||
          selectedHospital.name.toLowerCase().includes(c.hospitalName.toLowerCase().split(' ')[0])
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Hospitals & Clinics"
        description="Healthcare provider network directory, panel agreements, department capabilities, and settlement processing."
        breadcrumbs={['Organizations', 'Hospitals & Clinics']}
        primaryAction={{
          label: 'Add Hospital',
          icon: 'plus',
          onClick: () => {
            setEditingHospital(null);
            setIsAddOpen(true);
          },
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Panel Hospitals</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{hospitals.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Cashless Partners</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">
            {hospitals.filter((h) => h.networkStatus === 'Active').length}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Admitted Claims</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">1,842</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Settlements Pending</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">12 Hospitals</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={hospitals}
        columns={columns}
        searchPlaceholder="Search hospital, city, doctor, or department..."
        statusKey="networkStatus"
        onView={handleView}
        onEdit={(h) => {
          setEditingHospital(h);
          setIsAddOpen(true);
        }}
        onDelete={(h) => deleteHospital(h.id)}
        actions={[
          {
            label: 'View Hospital Profile',
            icon: 'eye',
            onClick: handleView,
          },
          {
            label: 'Edit Facility',
            icon: 'edit',
            onClick: (h) => {
              setEditingHospital(h);
              setIsAddOpen(true);
            },
          },
          {
            label: 'View Hospital Claims',
            icon: 'claims',
            onClick: () => navigate('Claims Management'),
          },
          {
            label: 'View Remittance Batches',
            icon: 'settlements',
            onClick: () => navigate('Settlements'),
          },
        ]}
      />

      {/* Detail Drawer */}
      {selectedHospital && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedHospital(null);
          }}
          title={selectedHospital.name}
          subtitle={`${selectedHospital.providerType} · ${selectedHospital.city}`}
          status={selectedHospital.networkStatus}
          avatarInitials={selectedHospital.name.slice(0, 2).toUpperCase()}
          tabs={['Overview', 'Departments', 'Specialties', 'Claims & Admitted Patients', 'Network Agreements', 'Documents']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          actions={[
            {
              label: 'Edit Facility',
              icon: 'edit',
              variant: 'primary',
              onClick: () => {
                const hosp = selectedHospital;
                setIsDetailOpen(false);
                setEditingHospital(hosp);
                setIsAddOpen(true);
              },
            },
            {
              label: 'Export Panel Agreement',
              icon: 'download',
              onClick: () => showToast('Export Agreement', `Panel agreement exported for ${selectedHospital.name}.`),
            },
            {
              label: 'Delete Hospital',
              icon: 'trash',
              variant: 'danger',
              onClick: () => {
                deleteHospital(selectedHospital.id);
                setIsDetailOpen(false);
                setSelectedHospital(null);
              },
            },
          ]}
        >
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Total Claims Processed</span>
                  <span className="text-base font-bold text-[#102A43] mt-0.5 block">{selectedHospital.totalClaims}</span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Active Insurance Treaties</span>
                  <span className="text-base font-bold text-[#2776EA] mt-0.5 block">
                    {selectedHospital.insuranceNetworks.length} Insurers
                  </span>
                </div>
                <div className="bg-white border border-[#E5EAF1] rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[11px] text-[#8A97A8] font-medium block">Panel Status</span>
                  <span className="text-base font-bold text-[#16865B] mt-0.5 block">{selectedHospital.networkStatus}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-3">Facility & Contact Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A97A8] block">Hospital Focal Person</span>
                    <span className="font-semibold text-[#102A43]">{selectedHospital.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Direct Contact Number</span>
                    <span className="font-semibold text-[#102A43]">{selectedHospital.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Billing / TPA Email</span>
                    <span className="font-semibold text-[#2776EA]">{selectedHospital.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Location Zone</span>
                    <span className="font-semibold text-[#102A43]">{selectedHospital.location}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#8A97A8] block">Street Address</span>
                    <span className="font-semibold text-[#102A43]">
                      {selectedHospital.address}, {selectedHospital.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Departments' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Clinical Departments</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedHospital.departments.map((dept, i) => (
                  <div key={i} className="p-2.5 bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg font-medium text-[#102A43]">
                    ✓ {dept}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Specialties' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Advanced Surgical Specialties</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedHospital.specialties.map((spec, i) => (
                  <div key={i} className="p-2.5 bg-[#EAF2FF] border border-[#c8ddfb] rounded-lg font-medium text-[#2776EA]">
                    ★ {spec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Claims & Admitted Patients' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Admitted Patient Claims</h4>
                <span className="text-xs text-[#2776EA] font-semibold">{hospitalClaims.length} Claims Filed</span>
              </div>

              {hospitalClaims.length > 0 ? (
                <div className="space-y-3">
                  {hospitalClaims.map((clm) => (
                    <div key={clm.id} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{clm.memberName}</span>
                          <span className="text-[11px] text-[#8A97A8] font-mono">Claim ID: {clm.claimNumber} • {clm.policyNumber}</span>
                        </div>
                        <Badge value={clm.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Procedure / Diagnosis</span>
                          <span className="font-semibold text-[#102A43]">{clm.diagnosis}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Submitted</span>
                          <span className="font-bold text-[#102A43]">PKR {clm.submittedAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved Payout</span>
                          <span className="font-bold text-[#16865B]">
                            {clm.approvedAmount ? `PKR ${clm.approvedAmount.toLocaleString()}` : 'In Review'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Jenkins', claim: 'CLM-2025001', diag: 'Emergency Appendectomy', amt: 485000, appr: 450000, status: 'Approved' },
                    { name: 'Michael Carter', claim: 'CLM-2025003', diag: 'Cardiology Inpatient Angioplasty', amt: 620000, appr: 620000, status: 'Paid' },
                    { name: 'Emily Davis', claim: 'CLM-2025005', diag: 'Orthopedic Arthroscopy', amt: 310000, appr: 290000, status: 'Under Review' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#102A43] text-sm block">{item.name}</span>
                          <span className="text-[11px] text-[#8A97A8] font-mono">Claim ID: {item.claim}</span>
                        </div>
                        <Badge value={item.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                        <div>
                          <span className="text-[#8A97A8] block">Procedure / Diagnosis</span>
                          <span className="font-semibold text-[#102A43]">{item.diag}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Submitted</span>
                          <span className="font-bold text-[#102A43]">PKR {item.amt.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8A97A8] block">Approved Payout</span>
                          <span className="font-bold text-[#16865B]">PKR {item.appr.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Network Agreements' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8]">Active Cashless Treaties & SLAs</h4>
                <span className="text-xs text-[#16865B] font-semibold">{selectedHospital.insuranceNetworks.length} Active Partners</span>
              </div>
              <div className="space-y-3 text-xs">
                {selectedHospital.insuranceNetworks.map((net, i) => (
                  <div key={i} className="p-4 border border-[#E5EAF1] rounded-xl bg-[#F8FAFC] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#102A43]">{net}</span>
                      <Badge value="Cashless Admission" variant="success" size="sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF1] text-[11px]">
                      <div>
                        <span className="text-[#8A97A8] block">Pre-Auth SLA</span>
                        <span className="font-semibold text-[#102A43]">Within 2 Hours</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block">Tariff Schedule</span>
                        <span className="font-semibold text-[#2776EA]">15% Panel Discount</span>
                      </div>
                      <div>
                        <span className="text-[#8A97A8] block">Disbursement Cycle</span>
                        <span className="font-semibold text-[#102A43]">Net 14 Days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="bg-white border border-[#E5EAF1] rounded-xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A97A8] mb-2">Hospital Compliance & Tariff Files</h4>
              {[
                'Joint_Commission_JCAHO_Accreditation_Certificate.pdf',
                'CMS_Medicare_Provider_Agreement_W9.pdf',
                'Cashless_TPA_Hospital_Tariff_Schedule_2025.pdf',
                'HIPAA_BAA_Business_Associate_Agreement.pdf',
              ].map(
                (d, i) => (
                  <div key={i} className="p-3 border border-[#E5EAF1] rounded-lg flex items-center justify-between text-xs bg-[#F8FAFC]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <span className="font-medium text-[#102A43] block">{d}</span>
                        <span className="text-[10px] text-[#8A97A8]">Verified & Current for 2025</span>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('Download Started', `Downloading ${d}`)}
                      className="text-[#2776EA] font-semibold hover:underline"
                    >
                      Download
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Add Hospital Modal */}
      <AddHospitalModal
        isOpen={isAddOpen}
        initialData={editingHospital}
        onClose={() => {
          setIsAddOpen(false);
          setEditingHospital(null);
        }}
      />
    </div>
  );
};

export default HospitalsClinics;
