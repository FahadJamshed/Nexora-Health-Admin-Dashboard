import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalSearchModal from './GlobalSearchModal';
import ToastContainer from '../ui/Toast';

interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_EXPANDED  = 252;
const SIDEBAR_COLLAPSED =  76;

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
      <div className="min-h-screen bg-[#F6F8FC] text-[#172B4D] font-sans antialiased flex">
      {/* ── Fixed sidebar (stays on top, out of flow) ── */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/*
        ── Invisible spacer that matches the fixed sidebar width exactly ──
        This pushes the content area to the right without any CSS magic.
        On mobile the sidebar slides in as overlay so spacer = 0.
      */}
      <div
        className="flex-shrink-0 hidden lg:block"
        style={{
          width: `${sidebarWidth}px`,
          transition: 'width 200ms ease-in-out',
        }}
      />

      {/* ── Main content — takes all remaining horizontal space ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <Header onOpenMobile={() => setMobileOpen(true)} />

        {/* Page body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export default AppShell;
