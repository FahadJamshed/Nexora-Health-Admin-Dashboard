import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
  } = useApp();

  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');

  // Create Notification Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newRecipientGroup, setNewRecipientGroup] = useState<NotificationItem['recipientGroup']>('Members');
  const [newChannel, setNewChannel] = useState<NotificationItem['channel']>('All Channels');
  const [newType, setNewType] = useState<NotificationItem['type']>('Policy Notice');

  const filteredNotifs = notifications.filter((n) => {
    if (statusFilter === 'Unread' && n.read) return false;
    if (statusFilter !== 'All' && statusFilter !== 'Unread' && n.status !== statusFilter) return false;
    if (channelFilter !== 'All' && n.channel !== channelFilter) return false;
    return true;
  });

  const totalNotifs = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const sentCount = notifications.filter((n) => n.status === 'Sent').length;

  const handleOpenDetail = (n: NotificationItem) => {
    setSelectedNotif(n);
    if (!n.read) {
      markNotificationAsRead(n.id);
    }
    setIsDetailOpen(true);
  };

  const handleCreateNotification = (status: 'Sent' | 'Draft') => {
    if (!newTitle.trim() || !newMessage.trim()) {
      showToast('Validation Error', 'Title and message text are required.', 'error');
      return;
    }

    addNotification({
      title: newTitle,
      message: newMessage,
      recipientGroup: newRecipientGroup,
      channel: newChannel,
      type: newType,
      status: status,
      read: false,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  const columns: Column<NotificationItem>[] = [
    {
      key: 'title',
      header: 'Notification Title',
      sortable: true,
      render: (n) => (
        <div className="flex items-start gap-2">
          {!n.read && (
            <span className="w-2 h-2 rounded-full bg-[#2776EA] mt-1.5 shrink-0" title="Unread" />
          )}
          <div>
            <button
              onClick={() => handleOpenDetail(n)}
              className="text-left font-semibold text-[#102A43] hover:text-[#2776EA] block leading-tight"
            >
              {n.title}
            </button>
            <span className="text-[11px] text-[#8A97A8] line-clamp-1 mt-0.5">{n.message}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'recipientGroup',
      header: 'Audience',
      sortable: true,
      render: (n) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6F8FC] border border-[#E5EAF1] text-[#40516A]">
          {n.recipientGroup}
        </span>
      ),
    },
    {
      key: 'channel',
      header: 'Delivery Channel',
      sortable: true,
      render: (n) => <span className="text-xs text-[#102A43] font-medium">{n.channel}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (n) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            n.type === 'System Alert'
              ? 'bg-[#FDECEC] text-[#D64545]'
              : n.type === 'Claim Update'
              ? 'bg-[#E8F6EF] text-[#16865B]'
              : n.type === 'Settlement Advice'
              ? 'bg-[#EAF2FF] text-[#2776EA]'
              : 'bg-[#FFF5DF] text-[#D69B32]'
          }`}
        >
          {n.type}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      sortable: true,
      render: (n) => <span className="text-xs text-[#8A97A8]">{n.createdAt}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (n) => <Badge value={n.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Notifications & Communications"
        description="Broadcast operational announcements, claims status updates, policy renewal reminders, and settlement remittance notices."
        breadcrumbs={['Communication', 'Notifications']}
        primaryAction={{
          label: 'Broadcast Notification',
          icon: 'plus',
          onClick: () => setIsCreateModalOpen(true),
        }}
        secondaryActions={[
          {
            label: 'Mark All as Read',
            icon: 'check',
            onClick: () => {
              markAllNotificationsAsRead();
              showToast('Notifications Marked', 'All alerts marked as read.', 'success');
            },
          },
        ]}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Broadcasts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#102A43]">{totalNotifs}</span>
            <span className="text-xs text-[#16865B] font-semibold bg-[#E8F6EF] px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Cross-channel campaigns</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2776EA]">Unread Alerts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#2776EA]">{unreadCount}</span>
            <span className="text-xs text-[#8A97A8]">Inbox queue</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Requiring admin attention</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Successfully Sent</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#16865B]">{sentCount}</span>
            <span className="text-xs font-semibold text-[#16865B]">99.4% Delivery</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">SMS, Email & In-app</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Dispatch Gateways</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">Amazon SNS / Twilio</span>
            <span className="text-xs font-semibold text-[#16865B]">Online</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">SMS API & SendGrid</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Unread', 'Sent', 'Draft', 'Scheduled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {status === 'All' ? 'All Communications' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Channel:</span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Channels</option>
            <option value="All Channels">Multi-Channel</option>
            <option value="In-App">In-App</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredNotifs}
        columns={columns}
        searchPlaceholder="Search broadcasts by title or content..."
        searchKey="title"
        onRowClick={handleOpenDetail}
        actions={[
          {
            label: 'View Broadcast Details',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'Mark as Read',
            icon: 'check',
            onClick: (n) => markNotificationAsRead(n.id),
            show: (n) => !n.read,
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedNotif && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedNotif.title}
          subtitle={`Dispatched ${selectedNotif.createdAt} • ${selectedNotif.channel}`}
          badge={<Badge value={selectedNotif.status} />}
          tabs={['Message Content', 'Delivery Metrics']}
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Message Content' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Recipient Target</span>
                      <span className="font-semibold text-[#102A43]">{selectedNotif.recipientGroup}</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Communication Type</span>
                      <span className="font-semibold text-[#102A43]">{selectedNotif.type}</span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-[#102A43] text-sm">Broadcast Payload</h4>
                    <p className="text-xs text-[#40516A] leading-relaxed whitespace-pre-wrap bg-[#F6F8FC] p-3 rounded-lg border border-[#E5EAF1]">
                      {selectedNotif.message}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Delivery Metrics' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Dispatched Targets:</span>
                    <span className="font-bold text-[#102A43]">1,480 recipients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Confirmed Delivery:</span>
                    <span className="font-bold text-[#16865B]">99.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Telecom Gateway:</span>
                    <span className="text-[#102A43]">Twilio Shortcode 8820</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Broadcast Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Compose Broadcast Notification"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleCreateNotification('Draft')}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#102A43] hover:bg-[#F6F8FC]"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleCreateNotification('Sent')}
              className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
            >
              Send Broadcast Now
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Notification Title *</label>
            <input
              type="text"
              placeholder="e.g. Annual Policy Renewal Window Open for Acme Corp Employees"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Target Audience *</label>
              <select
                value={newRecipientGroup}
                onChange={(e) => setNewRecipientGroup(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="All Organizations">All Organizations</option>
                <option value="Insurance Providers">Insurance Providers</option>
                <option value="Corporate Clients">Corporate Clients</option>
                <option value="Members">Insured Members</option>
                <option value="Admins">Platform Administrators</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Delivery Channel *</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="All Channels">Multi-Channel (SMS + Email + App)</option>
                <option value="In-App">In-App Notification Only</option>
                <option value="Email">Email Notification Only</option>
                <option value="SMS">SMS Alert Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Alert Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                <option value="Policy Notice">Policy Notice</option>
                <option value="Claim Update">Claim Update</option>
                <option value="Settlement Advice">Settlement Advice</option>
                <option value="System Alert">System Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">Message Content *</label>
            <textarea
              rows={4}
              placeholder="Enter message text with instructions or policy links..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full border border-[#E5EAF1] rounded-lg p-3 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default NotificationCenter;
