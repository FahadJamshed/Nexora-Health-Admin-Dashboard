import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';
import AddCompanyModal from './AddCompanyModal';
import CompanyDetailModal from './CompanyDetailModal';

export const AllCompanies: React.FC = () => {
  const { companies, setActiveModal, showToast } = useApp();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCompanies = companies.filter((c) => {
    if (typeFilter !== 'All' && c.type !== typeFilter) return false;
    return true;
  });

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company / Organization',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{c.name}</div>
            <span className="text-[11px] text-[#8A97A8]">{c.registrationNumber}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Organization Type',
      sortable: true,
      render: (c) => <Badge value={c.type} variant="info" size="sm" />,
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-medium text-[#102A43]">{c.contactPerson}</div>
          <span className="text-[11px] text-[#8A97A8]">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c) => <span className="text-[#40516A]">{c.phone}</span>,
    },
    {
      key: 'city',
      header: 'Location',
      sortable: true,
      render: (c) => <span className="text-[#40516A]">{c.city}</span>,
    },
    {
      key: 'totalMembers',
      header: 'Members',
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-[#102A43]">
          {c.totalMembers ? c.totalMembers.toLocaleString() : '—'}
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

  const handleView = (c: Company) => {
    setSelectedCompany(c);
    setIsDetailOpen(true);
  };

  const handleEdit = (c: Company) => {
    setEditingCompany(c);
    setIsAddEditOpen(true);
  };

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsAddEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="All Companies"
        description="Comprehensive directory of registered insurance providers, corporate clients, hospitals, and clinics."
        breadcrumbs={['Organizations', 'All Companies']}
        primaryAction={{
          label: 'Add Company',
          icon: 'plus',
          onClick: handleAddNew,
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Organizations</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{companies.length * 24}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Partners</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">
            {companies.filter((c) => c.status === 'Active').length * 22}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Under Review</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">24</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Updated This Month</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">36</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredCompanies}
        columns={columns}
        searchPlaceholder="Search company, registration number, or contact..."
        statusKey="status"
        extraFilters={
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8A97A8] font-medium hidden sm:inline">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-[#E5EAF1] rounded-lg bg-white text-[#40516A] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20"
            >
              <option value="All">All Types</option>
              <option value="Corporate">Corporate Client</option>
              <option value="Insurance">Insurance Provider</option>
              <option value="Hospital">Hospital</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>
        }
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Detail Drawer */}
      <CompanyDetailModal
        company={selectedCompany}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCompany(null);
        }}
        onEdit={(c) => {
          setIsDetailOpen(false);
          handleEdit(c);
        }}
      />

      {/* Add / Edit Modal */}
      <AddCompanyModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingCompany(null);
        }}
        initialData={editingCompany}
      />
    </div>
  );
};

export default AllCompanies;
