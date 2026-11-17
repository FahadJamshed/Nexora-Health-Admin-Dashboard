import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { InsuredMember } from '../../types';
import AddMemberModal from './AddMemberModal';
import MemberProfileView from './MemberProfileView';

export const InsuredMembers: React.FC = () => {
  const { insuredMembers, viewingItem, setViewingItem } = useApp();

  const [selectedMember, setSelectedMember] = useState<InsuredMember | null>(() => {
    if (viewingItem?.type === 'Member' && viewingItem.item) {
      return viewingItem.item as InsuredMember;
    }
    return null;
  });

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<InsuredMember | null>(null);
  const [memberTypeFilter, setMemberTypeFilter] = useState('All');

  const filteredMembers = insuredMembers.filter((m) => {
    if (memberTypeFilter !== 'All' && m.memberType !== memberTypeFilter) return false;
    return true;
  });

  const columns: Column<InsuredMember>[] = [
    {
      key: 'name',
      header: 'Member Name',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {m.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#102A43] leading-snug">{m.name}</div>
            <span className="text-[11px] text-[#8A97A8]">{m.id} · {m.ssn}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'memberType',
      header: 'Category',
      sortable: true,
      render: (m) => (
        <Badge
          value={m.memberType}
          variant={m.memberType === 'Primary' ? 'success' : 'info'}
          size="sm"
        />
      ),
    },
    {
      key: 'policyNumber',
      header: 'Policy Number',
      sortable: true,
      render: (m) => <span className="font-semibold text-[#2776EA]">{m.policyNumber}</span>,
    },
    {
      key: 'insurancePlanName',
      header: 'Coverage Plan',
      sortable: true,
      render: (m) => (
        <div>
          <div className="font-medium text-[#102A43]">{m.insurancePlanName}</div>
          <span className="text-[11px] text-[#8A97A8]">{m.insuranceCompanyName}</span>
        </div>
      ),
    },
    {
      key: 'corporateClientName',
      header: 'Corporate Client',
      sortable: true,
      render: (m) => <span className="text-[#40516A]">{m.corporateClientName}</span>,
    },
    {
      key: 'coverageEnd',
      header: 'Coverage Expiry',
      sortable: true,
      render: (m) => <span className="text-[#66758A]">{m.coverageEnd}</span>,
    },
    {
      key: 'claimsUtilized',
      header: 'Claims Utilized',
      sortable: true,
      render: (m) => (
        <span className="font-semibold text-[#102A43]">
          {m.claimsUtilized !== 'PKR 0' ? m.claimsUtilized : 'PKR 0'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (m) => <Badge value={m.status} size="sm" />,
    },
  ];

  const handleView = (m: InsuredMember) => {
    setSelectedMember(m);
  };

  const handleEdit = (m: InsuredMember) => {
    setEditingMember(m);
    setIsAddEditOpen(true);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setIsAddEditOpen(true);
  };

  // If viewing a member's full profile
  if (selectedMember) {
    return (
      <MemberProfileView
        member={selectedMember}
        onBack={() => {
          setSelectedMember(null);
          setViewingItem(null);
        }}
        onEdit={(m) => handleEdit(m)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Insured Members"
        description="Comprehensive member registry managing primary subscribers, spouses, children, dependents, and real-time coverage balances."
        breadcrumbs={['People', 'Insured Members']}
        primaryAction={{
          label: 'Register Member',
          icon: 'plus',
          onClick: handleAddNew,
        }}
      />

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Insured Members</span>
          <span className="text-xl font-bold text-[#102A43] block mt-0.5">{insuredMembers.length * 2426}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active Healthcare Cover</span>
          <span className="text-xl font-bold text-[#16865B] block mt-0.5">44,280</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Covered Dependents</span>
          <span className="text-xl font-bold text-[#2776EA] block mt-0.5">12,840</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Expiring This Month</span>
          <span className="text-xl font-bold text-[#D69B32] block mt-0.5">284</span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredMembers}
        columns={columns}
        searchPlaceholder="Search member name, ID, SSN / ID, or employer..."
        statusKey="status"
        extraFilters={
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8A97A8] font-medium hidden sm:inline">Category:</span>
            <select
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-[#E5EAF1] rounded-lg bg-white text-[#40516A] focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20"
            >
              <option value="All">All Categories</option>
              <option value="Primary">Primary Policyholder</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
            </select>
          </div>
        }
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Add / Edit Modal */}
      <AddMemberModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingMember(null);
        }}
        initialData={editingMember}
      />
    </div>
  );
};

export default InsuredMembers;
