import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';

export const AuditLogs: React.FC = () => {
  const { auditLogs, showToast } = useApp();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [moduleFilter, setModuleFilter] = useState<string>('All');

  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter !== 'All' && log.severity !== severityFilter) return false;
    if (moduleFilter !== 'All') {
      const mf = moduleFilter.toLowerCase();
      const lm = log.module.toLowerCase();
      if (!lm.includes(mf) && !mf.includes(lm)) return false;
    }
    return true;
  });

  const totalEvents = auditLogs.length;
  const securityCount = auditLogs.filter((l) => l.severity === 'Security').length;
  const warningCount = auditLogs.filter((l) => l.severity === 'Warning').length;
  const infoCount = auditLogs.filter((l) => l.severity === 'Info').length;

  const handleOpenDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'id',
      header: 'Event ID',
      sortable: true,
      render: (l) => (
        <button
          onClick={() => handleOpenDetail(l)}
          className="font-mono font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {l.id}
        </button>
      ),
    },
    {
      key: 'user',
      header: 'Admin / Operator',
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center font-bold text-[10px]">
            {l.user.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-[#102A43] text-xs block leading-tight">{l.user}</span>
            <span className="text-[11px] text-[#8A97A8] font-mono">{l.ipAddress}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Taken',
      sortable: true,
      render: (l) => <span className="font-semibold text-[#102A43] text-xs">{l.action}</span>,
    },
    {
      key: 'module',
      header: 'Module',
      sortable: true,
      render: (l) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6F8FC] border border-[#E5EAF1] text-[#40516A]">
          {l.module}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Event Narrative',
      render: (l) => <span className="text-xs text-[#66758A] line-clamp-1">{l.description}</span>,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (l) => <span className="text-xs text-[#8A97A8] whitespace-nowrap">{l.timestamp}</span>,
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (l) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            l.severity === 'Security'
              ? 'bg-[#FDECEC] text-[#D64545]'
              : l.severity === 'Warning'
              ? 'bg-[#FFF5DF] text-[#D69B32]'
              : 'bg-[#EAF2FF] text-[#2776EA]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              l.severity === 'Security'
                ? 'bg-[#D64545]'
                : l.severity === 'Warning'
                ? 'bg-[#D69B32]'
                : 'bg-[#2776EA]'
            }`}
          />
          {l.severity}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Audit Logs"
        description="Immutable forensic audit trail recording administrative logins, claim approvals, financial disbursements, and role permissions."
        breadcrumbs={['Financial Management', 'Audit Logs']}
        primaryAction={{
          label: 'Export Security Audit (CSV)',
          icon: 'export',
          onClick: () => showToast('Audit Exported', 'Forensic activity report generated successfully.', 'success'),
        }}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Logged Events</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalEvents}</span>
            <span className="text-xs text-[#16865B] font-semibold bg-[#E8F6EF] px-1.5 py-0.5 rounded">
              Immutable
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">YTD security records</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Security Alerts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D64545]">{securityCount}</span>
            <span className="text-xs text-[#D64545] font-semibold">Elevated</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Permission & policy changes</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Warnings</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D69B32]">{warningCount}</span>
            <span className="text-xs text-[#8A97A8]">Auth retries</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Failed attempts & limits</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Operational Info</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#2776EA]">{infoCount}</span>
            <span className="text-xs text-[#16865B]">Normal</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Routine administrative events</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Info', 'Warning', 'Security'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === sev
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {sev === 'All' ? 'All Severities' : sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Module:</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Modules</option>
            <option value="Claims">Claims Management</option>
            <option value="Settlements">Settlements</option>
            <option value="Insurance">Insurance Plans & Policies</option>
            <option value="Organizations">Organizations & Providers</option>
            <option value="People">People & Members</option>
            <option value="Finance">Financial Operations</option>
            <option value="Invoices">Invoices & Payables</option>
            <option value="Pre-Authorizations">Pre-Authorizations</option>
            <option value="System">System & Security</option>
            <option value="Communication">Notifications & Alerts</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search audit events by action, narrative, user, or IP..."
        searchKey="description"
        onRowClick={handleOpenDetail}
        actions={[
          {
            label: 'View Forensic Details',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedLog && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Forensic Event #${selectedLog.id}`}
          subtitle={`${selectedLog.action} by ${selectedLog.user}`}
          badge={<Badge value={selectedLog.severity} />}
          tabs={['Event Details', 'Compliance & Security']}
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Event Details' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Triggered Action</span>
                      <span className="font-bold text-[#102A43]">{selectedLog.action}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Operating User</span>
                      <span className="font-semibold text-[#102A43]">{selectedLog.user}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Target Module</span>
                      <span className="font-medium text-[#2776EA]">{selectedLog.module}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A97A8]">Severity Level</span>
                      <span className="font-semibold text-[#102A43]">{selectedLog.severity}</span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Event Narrative</h4>
                    <p className="text-xs text-[#40516A] leading-relaxed bg-[#F6F8FC] p-3 rounded-lg border border-[#E5EAF1]">
                      {selectedLog.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compliance & Security' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-3">
                  <div>
                    <span className="text-[#8A97A8] block">IP Address & Network:</span>
                    <span className="font-mono text-[#102A43] font-semibold">{selectedLog.ipAddress} (New York ISP gateway)</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Precise Timestamp (EST UTC-5):</span>
                    <span className="font-mono text-[#102A43]">{selectedLog.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[#8A97A8] block">Healthcare Compliance Standard:</span>
                    <span className="text-[#16865B] font-semibold">Regulation 14(2) Audit Trail Validated</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}
    </div>
  );
};
export default AuditLogs;
