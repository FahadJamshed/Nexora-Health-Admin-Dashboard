import React from 'react';
import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const {
    currentPage,
    navigate,
    setIsSearchOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentUser,
    logout,
    showToast,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-[68px] bg-white border-b border-[#E5EAF1] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-[#66758A] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#8A97A8]">
          <span className="font-medium hover:text-[#172B4D] cursor-pointer" onClick={() => navigate('Dashboard')}>
            Nexora
          </span>
          <span className="text-[#8A97A8]/50">/</span>
          <span className="font-semibold text-[#102A43]">{currentPage}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] text-[#8A97A8] hover:bg-white hover:border-[#D0D9E4] hover:text-[#172B4D] text-xs transition-all w-40 sm:w-56 justify-between group shadow-2xs"
          title="Search (Cmd+K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Icon name="search" size={14} className="group-hover:text-[#2776EA]" />
            <span className="truncate text-[11px] sm:text-xs">Quick search...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-semibold text-[#8A97A8] bg-white border border-[#E5EAF1] rounded shadow-3xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileMenuOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#66758A] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors relative"
            aria-label="Notifications"
          >
            <Icon name="bell" size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D64545] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E5EAF1] z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-3.5 border-b border-[#E5EAF1] flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#102A43]">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#EAF2FF] text-[#2776EA] text-[10px] font-bold rounded">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-[#2776EA] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F4F9]">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        navigate('Notifications');
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 text-left hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#F4F8FE]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-semibold text-[#102A43] leading-snug">{n.title}</h5>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#2776EA] flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-[#66758A] mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-[#8A97A8] mt-1.5 block">{n.createdAt}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E5EAF1] text-center">
                  <button
                    onClick={() => {
                      navigate('Notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-semibold text-[#2776EA] hover:underline"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help & Support Button */}
        <button
          onClick={() => showToast('Help Center', 'Nexora Health Knowledge Base & 24/7 Support Desk connected.', 'info')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#66758A] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors"
          title="Help & Support"
        >
          <Icon name="help" size={18} />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-[#F6F8FC] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#EAF2FF] border border-[#c8ddfb] text-[#2776EA] font-bold text-xs flex items-center justify-center">
              {currentUser.avatarInitials || 'SJ'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#102A43] leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-[#8A97A8] mt-0.5 leading-none">{currentUser.role}</span>
            </div>
            <Icon name="chevron-down" size={12} className="text-[#8A97A8] hidden md:inline" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E5EAF1] py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#E5EAF1]">
                  <p className="text-xs font-semibold text-[#102A43]">{currentUser.name}</p>
                  <p className="text-[10px] text-[#8A97A8] truncate">{currentUser.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('Settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Icon name="user" size={14} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    navigate('Settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Icon name="settings" size={14} />
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    navigate('Permissions');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Icon name="permissions" size={14} />
                  Role & Permissions
                </button>

                <div className="border-t border-[#E5EAF1] my-1" />

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#D64545] hover:bg-[#FDECEC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Icon name="close" size={14} />
                  Sign Out / Switch Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
