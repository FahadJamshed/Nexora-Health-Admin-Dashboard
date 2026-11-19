import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: NavigationPage;
  icon: string;
  badge?: number | string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { name: 'Dashboard', icon: 'dashboard' },
      { name: 'Analytics & Reports', icon: 'analytics' },
    ],
  },
  {
    group: 'ORGANIZATIONS',
    items: [
      { name: 'All Companies', icon: 'company' },
      { name: 'Insurance Companies', icon: 'insurance' },
      { name: 'Corporate Clients', icon: 'corporate' },
      { name: 'Hospitals & Clinics', icon: 'hospital' },
    ],
  },
  {
    group: 'PEOPLE',
    items: [
      { name: 'All Users', icon: 'users' },
      { name: 'Customers', icon: 'customer' },
      { name: 'Insured Members', icon: 'member' },
    ],
  },
  {
    group: 'INSURANCE OPERATIONS',
    items: [
      { name: 'Insurance Plans', icon: 'plans' },
      { name: 'Policies', icon: 'policies' },
      { name: 'Claims Management', icon: 'claims', badge: 5 },
      { name: 'Pre-Authorizations', icon: 'auth' },
      { name: 'Settlements', icon: 'settlements' },
    ],
  },
  {
    group: 'FINANCIAL MANAGEMENT',
    items: [
      { name: 'Financial Overview', icon: 'finance' },
      { name: 'Accounting', icon: 'accounting' },
      { name: 'Transactions', icon: 'transactions' },
      { name: 'Invoices & Payables', icon: 'invoices' },
      { name: 'Bank Reconciliation', icon: 'bank' },
      { name: 'Financial Reports', icon: 'reports' },
      { name: 'Audit Logs', icon: 'audit' },
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [{ name: 'Notifications', icon: 'notifications', badge: 2 }],
  },
  {
    group: 'SYSTEM',
    items: [
      { name: 'Admin Users & Roles', icon: 'admin' },
      { name: 'Permissions', icon: 'permissions' },
      { name: 'Settings', icon: 'settings' },
    ],
  },
];

const workspaces = [
  { id: 'ws-us', name: 'US Enterprise Health (USD)', region: 'North America Primary', code: 'NX-US' },
  { id: 'ws-na', name: 'North America Group Healthcare (USD)', region: 'Commercial Corporate', code: 'NX-NA' },
  { id: 'ws-gb', name: 'Global Corporate Benefits (USD)', region: 'Multinational Accounts', code: 'NX-GB' },
  { id: 'ws-eu', name: 'UK & European Care (GBP)', region: 'International Division', code: 'NX-EU' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentPage, navigate, showToast } = useApp();

  // Accordion state for sidebar groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    ORGANIZATIONS: true,
    PEOPLE: true,
    'INSURANCE OPERATIONS': true,
    'FINANCIAL MANAGEMENT': true,
    COMMUNICATION: true,
    SYSTEM: true,
  });

  // Workspace switcher state
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  // Auto-expand group of currently active page
  useEffect(() => {
    const parentGroup = navGroups.find((g) => g.items.some((i) => i.name === currentPage));
    if (parentGroup) {
      setOpenGroups((prev) => ({ ...prev, [parentGroup.group]: true }));
    }
  }, [currentPage]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleItemClick = (pageName: NavigationPage) => {
    navigate(pageName);
    onCloseMobile();
  };

  const handleSelectWorkspace = (ws: typeof workspaces[0]) => {
    setSelectedWorkspace(ws);
    setIsWorkspaceMenuOpen(false);
    showToast('Workspace Switched', `Active workspace set to ${ws.name}`, 'info');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#102A43]/50 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 box-border flex-none bg-white border-r border-[#E5EAF1] z-40 flex flex-col transition-[width,transform] duration-200 ease-in-out ${
          collapsed ? '!w-[76px] min-w-[76px] max-w-[76px]' : '!w-[252px] min-w-[252px] max-w-[252px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-[68px] border-b border-[#E5EAF1] flex items-center justify-between px-3 flex-shrink-0 relative">
          <div
            onClick={() => handleItemClick('Dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none overflow-hidden flex-1 min-w-0"
          >
            {collapsed ? (
              /* Collapsed: show authentic brand mark icon */
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center mx-auto">
                <img
                  src="/logo-icon.png"
                  alt="Nexora Health"
                  className="w-8 h-8 object-contain"
                />
              </div>
            ) : (
              /* Expanded: show clean balanced logo */
              <img
                src="/logo.png"
                alt="Nexora Health Dashboard"
                className="h-10 w-auto object-contain max-w-[185px]"
              />
            )}
          </div>

          {/* Collapse Button (Desktop Only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E5EAF1] shadow-lg items-center justify-center text-[#172B4D] hover:bg-[#F6F8FC] z-[60]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name="chevron"
              size={12}
              className={`transition-transform duration-200 ${collapsed ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Workspace Switcher Dropdown */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1 relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] hover:bg-white hover:border-[#2776EA]/50 transition-all text-left group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {selectedWorkspace.code.slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-[#8A97A8] uppercase tracking-wider leading-none">
                    Workspace
                  </span>
                  <span className="text-xs font-semibold text-[#172B4D] truncate mt-0.5 leading-tight group-hover:text-[#2776EA]">
                    {selectedWorkspace.name}
                  </span>
                </div>
              </div>
              <Icon
                name="chevron-down"
                size={12}
                className={`text-[#8A97A8] transition-transform duration-150 ${
                  isWorkspaceMenuOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Workspace Dropdown Menu */}
            {isWorkspaceMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsWorkspaceMenuOpen(false)}
                />
                <div className="absolute left-3 right-3 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-[#E5EAF1] py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-[#E5EAF1]">
                    <span className="text-[10px] font-bold text-[#8A97A8] uppercase tracking-wider">
                      Switch Healthcare Hub
                    </span>
                  </div>
                  {workspaces.map((ws) => {
                    const isCurrent = ws.id === selectedWorkspace.id;
                    return (
                      <button
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(ws)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-[#EAF2FF] text-[#2776EA] font-semibold'
                            : 'text-[#40516A] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="truncate leading-snug">{ws.name}</span>
                          <span className="text-[10px] text-[#8A97A8] font-normal leading-tight">
                            {ws.region}
                          </span>
                        </div>
                        {isCurrent && (
                          <Icon name="check" size={13} className="text-[#2776EA] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation Items (Scrollable Accordion) */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 no-scrollbar">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.group] !== false;

            return (
              <div key={group.group} className="space-y-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[#8A97A8] uppercase tracking-[1px] hover:text-[#102A43] hover:bg-[#F8FAFC] rounded-md transition-colors"
                    title={isOpen ? `Collapse ${group.group}` : `Expand ${group.group}`}
                  >
                    <span className="truncate">{group.group}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[9px] font-semibold text-[#8A97A8] bg-[#F1F4F9] px-1.5 py-0.2 rounded-full">
                        {group.items.length}
                      </span>
                      <Icon
                        name="chevron-down"
                        size={11}
                        className={`transition-transform duration-200 text-[#8A97A8] ${
                          isOpen ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    </div>
                  </button>
                )}

                {(collapsed || isOpen) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = currentPage === item.name;

                      return (
                        <button
                          key={item.name}
                          onClick={() => handleItemClick(item.name)}
                          title={collapsed ? item.name : undefined}
                          className={`w-full flex items-center rounded-lg text-xs font-medium transition-all group ${
                            collapsed
                              ? 'h-10 justify-center p-0'
                              : 'px-2.5 py-2 justify-between gap-2.5'
                          } ${
                            isActive
                              ? 'bg-[#EAF2FF] text-[#2776EA] font-semibold shadow-xs'
                              : 'text-[#53657C] hover:bg-[#F8FAFC] hover:text-[#102A43]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`flex-shrink-0 transition-colors ${
                                isActive ? 'text-[#2776EA]' : 'text-[#8A97A8] group-hover:text-[#40516A]'
                              }`}
                            >
                              <Icon name={item.icon} size={16} />
                            </span>
                            {!collapsed && <span className="truncate">{item.name}</span>}
                          </div>

                          {!collapsed && item.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-[#2776EA] text-white'
                                  : 'bg-[#F1F4F9] text-[#2776EA]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {collapsed && item.badge !== undefined && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2776EA]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
