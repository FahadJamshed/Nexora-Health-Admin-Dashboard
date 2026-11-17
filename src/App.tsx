import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';

// Overview Pages
import { Dashboard } from './pages/overview/Dashboard';
import { Analytics } from './pages/overview/Analytics';

// Organizations Pages
import { AllCompanies } from './pages/organizations/AllCompanies';
import { InsuranceCompanies } from './pages/organizations/InsuranceCompanies';
import { CorporateClients } from './pages/organizations/CorporateClients';
import { HospitalsClinics } from './pages/organizations/HospitalsClinics';
import { AddCompanyModal } from './pages/organizations/AddCompanyModal';
import { AddCorporateClientModal } from './pages/organizations/AddCorporateClientModal';
import { AddInsuranceProviderModal } from './pages/organizations/AddInsuranceProviderModal';
import { AddHospitalModal } from './pages/organizations/AddHospitalModal';

// People Pages
import { AllUsers } from './pages/people/AllUsers';
import { Customers } from './pages/people/Customers';
import { InsuredMembers } from './pages/people/InsuredMembers';
import { AddMemberModal } from './pages/people/AddMemberModal';
import { AddCustomerModal } from './pages/people/AddCustomerModal';

// Insurance Operations Pages
import { InsurancePlans } from './pages/insurance/InsurancePlans';
import { AddPlanModal } from './pages/insurance/AddPlanModal';
import { Policies } from './pages/insurance/Policies';
import { AddPolicyModal } from './pages/insurance/AddPolicyModal';
import { ClaimsManagement } from './pages/insurance/ClaimsManagement';
import { PreAuthorizations } from './pages/insurance/PreAuthorizations';
import { Settlements } from './pages/insurance/Settlements';
import { CreateSettlementBatchModal } from './pages/insurance/CreateSettlementBatchModal';

// Financial Management Pages
import { FinancialOverview } from './pages/finance/FinancialOverview';
import { Accounting } from './pages/finance/Accounting';
import { Transactions } from './pages/finance/Transactions';
import { InvoicesPayables } from './pages/finance/InvoicesPayables';
import { BankReconciliation } from './pages/finance/BankReconciliation';
import { FinancialReports } from './pages/finance/FinancialReports';
import { AuditLogs } from './pages/finance/AuditLogs';

// Communication Pages
import { NotificationCenter } from './pages/communication/NotificationCenter';

// System Pages
import { AdminUsersRoles } from './pages/system/AdminUsersRoles';
import { PermissionsMatrix } from './pages/system/PermissionsMatrix';
import { SettingsView } from './pages/system/SettingsView';

// Authentication
import { AuthPortal } from './pages/auth/AuthPortal';

const AppContent: React.FC = () => {
  const { currentPage, activeModal, setActiveModal, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      // Overview
      case 'Dashboard':
        return <Dashboard />;
      case 'Analytics & Reports':
        return <Analytics />;

      // Organizations
      case 'All Companies':
        return <AllCompanies />;
      case 'Insurance Companies':
        return <InsuranceCompanies />;
      case 'Corporate Clients':
        return <CorporateClients />;
      case 'Hospitals & Clinics':
        return <HospitalsClinics />;

      // People
      case 'All Users':
        return <AllUsers />;
      case 'Customers':
        return <Customers />;
      case 'Insured Members':
        return <InsuredMembers />;

      // Insurance Operations
      case 'Insurance Plans':
        return <InsurancePlans />;
      case 'Policies':
        return <Policies />;
      case 'Claims Management':
        return <ClaimsManagement />;
      case 'Pre-Authorizations':
        return <PreAuthorizations />;
      case 'Settlements':
        return <Settlements />;

      // Financial Management
      case 'Financial Overview':
        return <FinancialOverview />;
      case 'Accounting':
        return <Accounting />;
      case 'Transactions':
        return <Transactions />;
      case 'Invoices & Payables':
        return <InvoicesPayables />;
      case 'Bank Reconciliation':
        return <BankReconciliation />;
      case 'Financial Reports':
        return <FinancialReports />;
      case 'Audit Logs':
        return <AuditLogs />;

      // Communication
      case 'Notifications':
        return <NotificationCenter />;

      // System
      case 'Admin Users & Roles':
        return <AdminUsersRoles />;
      case 'Permissions':
        return <PermissionsMatrix />;
      case 'Settings':
        return <SettingsView />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <AppShell>
      {renderCurrentPage()}

      {/* Global Modals Triggered via Quick Actions & Context */}
      <AddCompanyModal
        isOpen={activeModal === 'add_company' || activeModal === 'addCompany'}
        onClose={() => setActiveModal(null)}
      />
      <AddMemberModal
        isOpen={activeModal === 'add_member' || activeModal === 'addMember'}
        onClose={() => setActiveModal(null)}
      />
      <AddPlanModal
        isOpen={activeModal === 'add_plan' || activeModal === 'addPlan'}
        onClose={() => setActiveModal(null)}
      />
      <AddPolicyModal
        isOpen={activeModal === 'add_policy' || activeModal === 'addPolicy'}
        onClose={() => setActiveModal(null)}
      />
      <AddCorporateClientModal
        isOpen={activeModal === 'add_corporate_client' || activeModal === 'addCorporateClient'}
        onClose={() => setActiveModal(null)}
      />
      <AddInsuranceProviderModal
        isOpen={activeModal === 'add_insurance_company' || activeModal === 'addInsuranceCompany'}
        onClose={() => setActiveModal(null)}
      />
      <AddHospitalModal
        isOpen={activeModal === 'add_hospital' || activeModal === 'addHospital'}
        onClose={() => setActiveModal(null)}
      />
      <AddCustomerModal
        isOpen={activeModal === 'add_customer' || activeModal === 'addCustomer'}
        onClose={() => setActiveModal(null)}
      />
      <CreateSettlementBatchModal
        isOpen={activeModal === 'create_settlement' || activeModal === 'createSettlement'}
        onClose={() => setActiveModal(null)}
      />
    </AppShell>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
