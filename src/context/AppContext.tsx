import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationPage,
  AuthScreen,
  Company,
  InsuranceCompany,
  CorporateClient,
  Hospital,
  Customer,
  InsuredMember,
  InsurancePlan,
  Policy,
  Claim,
  PreAuthorization,
  Settlement,
  Transaction,
  Invoice,
  Vendor,
  BankAccount,
  BankStatementRecord,
  NotificationItem,
  AdminUser,
  RoleDefinition,
  AuditLog,
  ToastMessage,
} from '../types';
import {
  initialCompanies,
  initialInsuranceCompanies,
  initialCorporateClients,
  initialHospitals,
  initialCustomers,
  initialInsuredMembers,
  initialInsurancePlans,
  initialPolicies,
  initialClaims,
  initialPreAuthorizations,
  initialSettlements,
  initialTransactions,
  initialInvoices,
  initialVendors,
  initialBankAccounts,
  initialBankStatements,
  initialNotifications,
  initialAdminUsers,
  initialRoles,
  initialAuditLogs,
} from '../data/mockData';

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  authMode: 'login_2fa' | 'password_reset_otp';
  setAuthMode: (mode: 'login_2fa' | 'password_reset_otp') => void;
  pendingAuthEmail: string;
  setPendingAuthEmail: (email: string) => void;
  currentUser: AdminUser;
  setCurrentUser: (user: AdminUser) => void;
  login: (email: string, password: string, require2FA?: boolean) => { success: boolean; requires2FA?: boolean };
  verifyOtp: (code: string) => boolean;
  requestPasswordReset: (email: string) => boolean;
  resetPasswordWithOtp: (newPassword: string) => boolean;
  logout: () => void;

  // Navigation
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  navigate: (page: NavigationPage) => void;

  // Overlays & Deep Linking
  viewingItem: { type: string; item: any } | null;
  setViewingItem: (item: { type: string; item: any } | null) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedDetailTab: string;
  setSelectedDetailTab: (tab: string) => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Notifications Popover
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Data Collections
  companies: Company[];
  insuranceCompanies: InsuranceCompany[];
  corporateClients: CorporateClient[];
  hospitals: Hospital[];
  customers: Customer[];
  insuredMembers: InsuredMember[];
  insurancePlans: InsurancePlan[];
  policies: Policy[];
  claims: Claim[];
  preAuthorizations: PreAuthorization[];
  settlements: Settlement[];
  transactions: Transaction[];
  invoices: Invoice[];
  vendors: Vendor[];
  bankAccounts: BankAccount[];
  bankStatements: BankStatementRecord[];
  notifications: NotificationItem[];
  adminUsers: AdminUser[];
  roles: RoleDefinition[];
  auditLogs: AuditLog[];

  // Workflows & Actions
  // Workflow 1: Companies & Organizations
  addCompany: (data: Partial<Company>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addCorporateClient: (data: Partial<CorporateClient>) => CorporateClient;
  addInsuranceCompany: (data: Partial<InsuranceCompany>) => InsuranceCompany;
  addHospital: (data: Partial<Hospital>) => Hospital;
  addSettlement: (data: Partial<Settlement>) => Settlement;

  // Workflow 2: Members & Customers
  addMember: (data: Partial<InsuredMember>) => InsuredMember;
  updateMember: (id: string, updates: Partial<InsuredMember>) => void;
  deleteMember: (id: string) => void;
  addCustomer: (data: Partial<Customer>) => Customer;

  // Workflow 3: Policies & Plans
  addPolicy: (data: Partial<Policy>) => Policy;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  addPlan: (data: Partial<InsurancePlan>) => InsurancePlan;
  updatePlan: (id: string, updates: Partial<InsurancePlan>) => void;

  // Workflow 4: Claims Processing
  addClaim: (data: Partial<Claim>) => Claim;
  approveClaim: (claimId: string, approvedAmount: number, notes?: string) => void;
  rejectClaim: (claimId: string, reason: string, notes?: string) => void;
  requestClaimInfo: (claimId: string, message: string) => void;
  addClaimNote: (claimId: string, noteText: string) => void;
  markClaimAsPaid: (claimId: string) => void;

  // Workflow 5: Pre-Authorizations
  addPreAuth: (data: Partial<PreAuthorization>) => PreAuthorization;
  approvePreAuth: (authId: string, approvedAmount?: number) => void;
  rejectPreAuth: (authId: string, reason: string) => void;
  requestPreAuthInfo: (authId: string, message: string) => void;

  // Workflow 6: Settlements
  processSettlement: (
    settlementId: string,
    paymentMethod: 'Bank Transfer' | 'EFT' | 'Cheque',
    bankAccountUsed: string,
    paymentReference: string
  ) => void;
  markSettlementPaid: (settlementId: string, paymentReference: string) => void;

  // Workflow 7: Invoices
  addInvoice: (data: Partial<Invoice>) => Invoice;
  recordInvoicePayment: (invoiceId: string, amount: number) => void;

  // Workflow 8: Bank Reconciliation
  toggleMatchBankRecord: (stmtId: string, txId?: string) => void;
  addBankAdjustment: (accountId: string, amount: number, description: string, type: 'Debit' | 'Credit') => void;
  completeReconciliation: (accountId: string) => void;

  // Workflow 9: Notifications
  addNotification: (data: Partial<NotificationItem>) => NotificationItem;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Workflow 10: Permissions & Admins
  updateRolePermission: (roleId: string, moduleName: string, permissionKey: string, value: boolean) => void;
  addAdminUser: (data: Partial<AdminUser>) => AdminUser;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;

  // Utility
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const NEXORA_STORAGE_VERSION = 'v4.0-enterprise-en';

// Storage version migration: flushes stale cache if schema or version changes
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('nexora_storage_version');
    if (currentVer !== NEXORA_STORAGE_VERSION) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('nexora_') || k.includes('admin') || k.includes('workspace'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('nexora_storage_version', NEXORA_STORAGE_VERSION);
    }
  } catch (err) {
    console.error('Storage version migration failed:', err);
  }
}

function getSaved<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`nexora_${key}`);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    // If parsed array is empty while default array has data, fall back to default
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
      return defaultValue;
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

function saveItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(`nexora_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save nexora_${key} to localStorage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Session
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() =>
    getSaved('auth_status', false)
  );
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authMode, setAuthMode] = useState<'login_2fa' | 'password_reset_otp'>('login_2fa');
  const [pendingAuthEmail, setPendingAuthEmail] = useState<string>('sarah.jenkins@nexora.com');
  const [currentUser, setCurrentUserState] = useState<AdminUser>(() => {
    const saved = getSaved<AdminUser>('current_user', initialAdminUsers[0]);
    if (saved && (saved.name?.includes('Ayesha') || saved.name?.includes('Khan') || !saved.name)) {
      return initialAdminUsers[0];
    }
    return saved;
  });

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    saveItem('auth_status', auth);
  };

  const setCurrentUser = (user: AdminUser) => {
    setCurrentUserState(user);
    saveItem('current_user', user);
  };

  // Navigation & View state
  const [currentPage, setCurrentPageState] = useState<NavigationPage>(() => getSaved('current_page', 'Dashboard'));
  const [viewingItem, setViewingItem] = useState<{ type: string; item: any } | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedDetailTab, setSelectedDetailTab] = useState<string>('Overview');

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown / Popover states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Entities
  const [companies, setCompanies] = useState<Company[]>(() => getSaved('companies', initialCompanies));
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>(() =>
    getSaved('insurance_companies', initialInsuranceCompanies)
  );
  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>(() =>
    getSaved('corporate_clients', initialCorporateClients)
  );
  const [hospitals, setHospitals] = useState<Hospital[]>(() => getSaved('hospitals', initialHospitals));
  const [customers, setCustomers] = useState<Customer[]>(() => getSaved('customers', initialCustomers));
  const [insuredMembers, setInsuredMembers] = useState<InsuredMember[]>(() =>
    getSaved('insured_members', initialInsuredMembers)
  );
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>(() =>
    getSaved('insurance_plans', initialInsurancePlans)
  );
  const [policies, setPolicies] = useState<Policy[]>(() => getSaved('policies', initialPolicies));
  const [claims, setClaims] = useState<Claim[]>(() => getSaved('claims', initialClaims));
  const [preAuthorizations, setPreAuthorizations] = useState<PreAuthorization[]>(() =>
    getSaved('pre_auths', initialPreAuthorizations)
  );
  const [settlements, setSettlements] = useState<Settlement[]>(() => getSaved('settlements', initialSettlements));
  const [transactions, setTransactions] = useState<Transaction[]>(() => getSaved('transactions', initialTransactions));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getSaved('invoices', initialInvoices));
  const [vendors] = useState<Vendor[]>(() => getSaved('vendors', initialVendors));
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() =>
    getSaved('bank_accounts', initialBankAccounts)
  );
  const [bankStatements, setBankStatements] = useState<BankStatementRecord[]>(() =>
    getSaved('bank_statements', initialBankStatements)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getSaved('notifications', initialNotifications)
  );
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getSaved('admin_users', initialAdminUsers));
  const [roles, setRoles] = useState<RoleDefinition[]>(() => getSaved('roles', initialRoles));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getSaved('audit_logs', initialAuditLogs));

  // Sync to local storage
  useEffect(() => saveItem('current_page', currentPage), [currentPage]);
  useEffect(() => saveItem('companies', companies), [companies]);
  useEffect(() => saveItem('insured_members', insuredMembers), [insuredMembers]);
  useEffect(() => saveItem('policies', policies), [policies]);
  useEffect(() => saveItem('claims', claims), [claims]);
  useEffect(() => saveItem('pre_auths', preAuthorizations), [preAuthorizations]);
  useEffect(() => saveItem('settlements', settlements), [settlements]);
  useEffect(() => saveItem('transactions', transactions), [transactions]);
  useEffect(() => saveItem('invoices', invoices), [invoices]);
  useEffect(() => saveItem('bank_accounts', bankAccounts), [bankAccounts]);
  useEffect(() => saveItem('bank_statements', bankStatements), [bankStatements]);
  useEffect(() => saveItem('notifications', notifications), [notifications]);
  useEffect(() => saveItem('roles', roles), [roles]);
  useEffect(() => saveItem('audit_logs', auditLogs), [auditLogs]);

  const setCurrentPage = (page: NavigationPage) => {
    setCurrentPageState(page);
    setViewingItem(null);
    setActiveModal(null);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = setCurrentPage;

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, module: string, description: string, severity: 'Info' | 'Warning' | 'Security' = 'Info') => {
    const newLog: AuditLog = {
      id: `LOG-0${auditLogs.length + 1}`,
      user: 'Sarah Jenkins',
      action,
      module,
      description,
      timestamp: 'Just now',
      ipAddress: '182.185.142.12',
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ─── Workflow 1: Companies ───────────────────────────────────────────────────
  const addCompany = (data: Partial<Company>): Company => {
    const id = `co-0${companies.length + 1}`;
    const newCompany: Company = {
      id,
      name: data.name || 'Untitled Organization',
      type: data.type || 'Corporate',
      registrationNumber: data.registrationNumber || `REG-CORP-2025-${Math.floor(100 + Math.random() * 900)}`,
      contactPerson: data.contactPerson || 'Primary Contact',
      email: data.email || 'contact@organization.com',
      phone: data.phone || '+92 21 0000 000',
      website: data.website || 'https://nexora.com',
      city: data.city || 'New York',
      country: data.country || 'United States',
      address: data.address || 'Business District, New York',
      status: data.status || 'Active',
      totalMembers: data.totalMembers || 0,
      registrationDate: 'Today',
      totalPremium: 'PKR 0',
      activePolicies: 0,
      totalClaims: 0,
    };

    setCompanies((prev) => [newCompany, ...prev]);
    addAuditLog('Company Registered', 'Organizations', `Registered new organization: ${newCompany.name} (${newCompany.type})`);
    showToast('Company Created', `${newCompany.name} was registered successfully.`);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addAuditLog('Company Updated', 'Organizations', `Updated details for company ID: ${id}`);
    showToast('Company Updated', 'Changes were saved to the organization profile.');
  };

  const deleteCompany = (id: string) => {
    const toDelete = companies.find((c) => c.id === id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('Company Deactivated', 'Organizations', `Deactivated company: ${toDelete?.name || id}`, 'Warning');
    showToast('Company Removed', `${toDelete?.name || 'Company'} removed from directory.`, 'info');
  };

  const addCorporateClient = (data: Partial<CorporateClient>): CorporateClient => {
    const id = `corp-0${corporateClients.length + 1}`;
    const newClient: CorporateClient = {
      id,
      companyId: `co-0${companies.length + 1}`,
      name: data.name || 'New Corporate Client',
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      contactPerson: data.contactPerson || 'HR Focal Person',
      email: data.email || 'hr@company.com',
      phone: data.phone || '+1 (555) 456-7890',
      totalEmployees: data.totalEmployees || 250,
      activePolicies: data.activePolicies || 1,
      contractStart: data.contractStart || '01 Jan 2025',
      contractEnd: data.contractEnd || '31 Dec 2025',
      annualPremium: data.annualPremium || 'PKR 14,500,000',
      status: data.status || 'Active',
    };

    setCorporateClients((prev) => [newClient, ...prev]);
    // Also mirror to global companies
    addCompany({
      name: newClient.name,
      type: 'Corporate',
      contactPerson: newClient.contactPerson,
      email: newClient.email,
      phone: newClient.phone,
      totalMembers: newClient.totalEmployees,
      totalPremium: newClient.annualPremium,
      status: newClient.status,
    });
    addAuditLog('Corporate Client Added', 'Organizations', `Contracted corporate client: ${newClient.name} with ${newClient.totalEmployees} employees`);
    showToast('Corporate Client Added', `${newClient.name} successfully registered.`);
    return newClient;
  };

  const addInsuranceCompany = (data: Partial<InsuranceCompany>): InsuranceCompany => {
    const id = `ins-0${insuranceCompanies.length + 1}`;
    const newIns: InsuranceCompany = {
      id,
      companyId: `co-0${companies.length + 1}`,
      name: data.name || 'New Insurance Carrier',
      contactPerson: data.contactPerson || 'Chief Underwriter',
      email: data.email || 'underwriting@carrier.com',
      phone: data.phone || '+1 (555) 888-0000',
      activePlans: data.activePlans || 3,
      activePolicies: data.activePolicies || 0,
      totalMembers: data.totalMembers || 0,
      totalClaims: 0,
      claimsApprovedAmount: 'PKR 0',
      settlementTurnaroundDays: data.settlementTurnaroundDays || 5,
      status: data.status || 'Active',
      supportedPlans: data.supportedPlans || ['Comprehensive Inpatient', 'Outpatient OPD', 'Executive Health Plus'],
    };

    setInsuranceCompanies((prev) => [newIns, ...prev]);
    // Also mirror to global companies
    addCompany({
      name: newIns.name,
      type: 'Insurance',
      contactPerson: newIns.contactPerson,
      email: newIns.email,
      phone: newIns.phone,
      status: newIns.status,
    });
    addAuditLog('Insurance Carrier Added', 'Organizations', `Registered underwriting carrier: ${newIns.name}`);
    showToast('Insurance Carrier Added', `${newIns.name} successfully registered.`);
    return newIns;
  };

  const addHospital = (data: Partial<Hospital>): Hospital => {
    const id = `HSP-0${hospitals.length + 1}`;
    const newHosp: Hospital = {
      id,
      name: data.name || 'New Panel Hospital',
      providerType: data.providerType || 'Hospital',
      location: data.location || 'Central Healthcare District',
      city: data.city || 'New York',
      address: data.address || '450 Healthcare Boulevard',
      contactPerson: data.contactPerson || 'Medical Superintendent',
      phone: data.phone || '+1 (555) 333-2222',
      email: data.email || 'admissions@hospital.org',
      insuranceNetworks: data.insuranceNetworks || ['Apex Health Insurance', 'Guardian Mutual Healthcare', 'State Life Health'],
      departments: data.departments || ['Emergency', 'ICU', 'General Surgery', 'Diagnostics'],
      specialties: data.specialties || ['Cardiology', 'Orthopedics'],
      totalClaims: 0,
      networkStatus: data.networkStatus || 'Active',
    };

    setHospitals((prev) => [newHosp, ...prev]);
    // Also mirror to global companies
    addCompany({
      name: newHosp.name,
      type: newHosp.providerType as any,
      contactPerson: newHosp.contactPerson,
      email: newHosp.email,
      phone: newHosp.phone,
      city: newHosp.city,
      address: newHosp.address,
      status: newHosp.networkStatus as any,
    });
    addAuditLog('Panel Hospital Added', 'Organizations', `Enrolled panel healthcare facility: ${newHosp.name} (${newHosp.city})`);
    showToast('Hospital Added', `${newHosp.name} enrolled in panel network.`);
    return newHosp;
  };

  // ─── Workflow 2: People (Members & Customers) ────────────────────────────────
  const addCustomer = (data: Partial<Customer>): Customer => {
    const id = `CUST-0${customers.length + 1}`;
    const newCust: Customer = {
      id,
      name: data.name || 'New Customer',
      email: data.email || 'customer@nexora.com',
      phone: data.phone || '+1 (555) 000-0000',
      ssn: data.ssn || 'SSN-42101-1',
      gender: data.gender || 'Male',
      dob: data.dob || '01 Jan 1990',
      corporateClientId: data.corporateClientId,
      corporateClientName: data.corporateClientName,
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      activePolicies: 1,
      totalClaims: 0,
      registrationDate: 'Today',
      status: data.status || 'Active',
      address: data.address || 'New York, NY',
      city: data.city || 'New York',
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addMember = (data: Partial<InsuredMember>): InsuredMember => {
    const id = `MEM-0${insuredMembers.length + 1}`;
    const newMember: InsuredMember = {
      id,
      customerId: data.customerId || `CUST-0${customers.length + 1}`,
      name: data.name || 'New Member',
      memberType: data.memberType || 'Primary',
      policyNumber: data.policyNumber || `POL-20250${policies.length + 1}`,
      planId: data.planId || 'pln-001',
      insurancePlanName: data.insurancePlanName || 'Executive Health Plus',
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      corporateClientId: data.corporateClientId || 'corp-001',
      corporateClientName: data.corporateClientName || 'Acme Corporation',
      coverageStart: data.coverageStart || '01 Jan 2025',
      coverageEnd: data.coverageEnd || '31 Dec 2025',
      coverageLimit: data.coverageLimit || 'PKR 5,000,000',
      claimsUtilized: 'PKR 0',
      ssn: data.ssn || 'SSN-42101-1',
      dob: data.dob || '01 Jan 1990',
      bloodGroup: data.bloodGroup || 'B+',
      phone: data.phone || '+1 (555) 000-0000',
      email: data.email || 'member@nexora.com',
      status: 'Active',
      dependents: data.dependents || [],
    };

    setInsuredMembers((prev) => [newMember, ...prev]);
    addAuditLog('Member Registered', 'People', `Registered insured member: ${newMember.name} (${newMember.id})`);
    showToast('Member Registered', `${newMember.name} has been enrolled with ID ${newMember.id}.`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<InsuredMember>) => {
    setInsuredMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    addAuditLog('Member Profile Updated', 'People', `Updated information for member: ${id}`);
    showToast('Member Updated', 'Insured member profile has been updated.');
  };

  const deleteMember = (id: string) => {
    const m = insuredMembers.find((x) => x.id === id);
    setInsuredMembers((prev) => prev.filter((x) => x.id !== id));
    addAuditLog('Member Deactivated', 'People', `Deactivated coverage for: ${m?.name || id}`, 'Warning');
    showToast('Member Removed', `${m?.name || 'Member'} coverage cancelled.`, 'info');
  };

  // ─── Workflow 3: Policies & Plans ────────────────────────────────────────────
  const addPolicy = (data: Partial<Policy>): Policy => {
    const num = `POL-20250${policies.length + 1}`;
    const id = `pol-0${policies.length + 1}`;
    const newPolicy: Policy = {
      id,
      policyNumber: num,
      memberId: data.memberId || 'MEM-001',
      memberName: data.memberName || 'Alexander Wright',
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      planId: data.planId || 'pln-001',
      planName: data.planName || 'Executive Health Plus',
      corporateClientId: data.corporateClientId,
      corporateClientName: data.corporateClientName,
      startDate: data.startDate || '01 Jan 2025',
      expiryDate: data.expiryDate || '31 Dec 2025',
      monthlyPremium: data.monthlyPremium || 'PKR 15,000',
      coverageAmount: data.coverageAmount || 'PKR 5,000,000',
      claimsCount: 0,
      claimsAmountUtilized: 'PKR 0',
      status: 'Active',
    };

    setPolicies((prev) => [newPolicy, ...prev]);
    addAuditLog('Policy Created', 'Insurance Operations', `Created healthcare policy: ${newPolicy.policyNumber} for ${newPolicy.memberName}`);
    showToast('Policy Created', `Policy ${newPolicy.policyNumber} is now active.`);
    return newPolicy;
  };

  const updatePolicy = (id: string, updates: Partial<Policy>) => {
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog('Policy Updated', 'Insurance Operations', `Updated policy: ${id}`);
    showToast('Policy Updated', 'Policy terms and dates saved.');
  };

  const addPlan = (data: Partial<InsurancePlan>): InsurancePlan => {
    const id = `pln-00${insurancePlans.length + 1}`;
    const newPlan: InsurancePlan = {
      id,
      name: data.name || 'Custom Healthcare Plan',
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      planType: data.planType || 'Corporate',
      monthlyPremium: data.monthlyPremium || 'PKR 10,000',
      annualPremium: data.annualPremium || 'PKR 120,000',
      coverageLimit: data.coverageLimit || 'PKR 3,000,000',
      enrolledMembers: 0,
      effectiveDate: data.effectiveDate || '01 Jan 2025',
      expiryDate: data.expiryDate || '31 Dec 2025',
      status: 'Active',
      description: data.description || 'Enterprise healthcare coverage plan.',
      benefits: data.benefits || [
        { category: 'Hospitalization', description: 'Inpatient surgical and medical room', limit: 'PKR 2,000,000' },
        { category: 'Outpatient (OPD)', description: 'Consultations and routine blood tests', limit: 'PKR 150,000' },
      ],
      exclusions: data.exclusions || ['Elective cosmetic surgery', 'Self-inflicted harm'],
      eligibilityRules: data.eligibilityRules || 'US corporate employees aged 18 to 60.',
    };
    setInsurancePlans((prev) => [newPlan, ...prev]);
    addAuditLog('Insurance Plan Created', 'Insurance Operations', `Created new plan: ${newPlan.name}`);
    showToast('Insurance Plan Created', `${newPlan.name} is now available for enrollment.`);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<InsurancePlan>) => {
    setInsurancePlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog('Plan Updated', 'Insurance Operations', `Modified plan details: ${id}`);
    showToast('Plan Updated', 'Insurance plan limits and benefits updated.');
  };

  // ─── Workflow 4: Claims Processing ───────────────────────────────────────────
  const addClaim = (data: Partial<Claim>): Claim => {
    const num = `CLM-20250${claims.length + 1}`;
    const id = `clm-0${claims.length + 1}`;
    const newClaim: Claim = {
      id,
      claimNumber: num,
      memberId: data.memberId || 'MEM-001',
      memberName: data.memberName || 'Alexander Wright',
      policyNumber: data.policyNumber || 'POL-2025001',
      hospitalId: data.hospitalId || 'hosp-001',
      hospitalName: data.hospitalName || 'Metropolitan Medical Center',
      insuranceCompanyId: data.insuranceCompanyId || 'ins-001',
      insuranceCompanyName: data.insuranceCompanyName || 'Apex Health Insurance',
      claimType: data.claimType || 'Hospitalization',
      submittedAmount: data.submittedAmount || 150000,
      submissionDate: 'Today',
      treatmentDate: data.treatmentDate || 'Yesterday',
      diagnosis: data.diagnosis || 'Clinical evaluation and diagnostic procedures',
      priority: data.priority || 'Normal',
      status: 'Submitted',
      treatingDoctor: data.treatingDoctor || 'Dr. Eleanor Vance',
      department: data.department || 'General Medicine',
      lineItems: data.lineItems || [{ category: 'Medical Services', description: 'Treatment & diagnostic tests', amount: data.submittedAmount || 150000 }],
      notes: [],
      timeline: [{ title: 'Claim Submitted', subtitle: 'Electronic submission via provider desk', timestamp: 'Just now' }],
    };

    setClaims((prev) => [newClaim, ...prev]);
    addAuditLog('Claim Submitted', 'Claims', `Lodged new claim: ${newClaim.claimNumber} (PKR ${newClaim.submittedAmount.toLocaleString()})`);
    showToast('Claim Submitted', `Claim ${newClaim.claimNumber} logged for review.`);
    return newClaim;
  };

  const approveClaim = (claimId: string, approvedAmount: number, notes?: string) => {
    const claim = claims.find((c) => c.id === claimId || c.claimNumber === claimId);
    if (!claim) return;

    const updatedTimeline = [
      ...claim.timeline,
      {
        title: 'Claim Approved',
        subtitle: `Approved for PKR ${approvedAmount.toLocaleString()} by Sarah Jenkins`,
        timestamp: 'Just now',
      },
    ];

    const updatedNotes = notes
      ? [...claim.notes, { author: 'Sarah Jenkins', role: 'Super Admin', date: 'Just now', text: notes }]
      : claim.notes;

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id
          ? {
              ...c,
              status: 'Approved',
              approvedAmount,
              timeline: updatedTimeline,
              notes: updatedNotes,
            }
          : c
      )
    );

    // Create a pending settlement automatically (Workflow 6 linkage!)
    const newSettlement: Settlement = {
      id: `set-0${settlements.length + 1}`,
      settlementNumber: `SET-20250${settlements.length + 1}`,
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      hospitalId: claim.hospitalId,
      hospitalName: claim.hospitalName,
      insuranceCompanyId: claim.insuranceCompanyId,
      insuranceCompanyName: claim.insuranceCompanyName,
      settlementAmount: approvedAmount,
      dueDate: '10 business days',
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      createdAt: 'Today',
    };
    setSettlements((prev) => [newSettlement, ...prev]);

    addAuditLog('Claim Approved', 'Claims', `Approved claim ${claim.claimNumber} for PKR ${approvedAmount.toLocaleString()}`);
    showToast('Claim Approved', `Claim ${claim.claimNumber} approved. Settlement record generated.`);
  };

  const rejectClaim = (claimId: string, reason: string, notes?: string) => {
    const claim = claims.find((c) => c.id === claimId || c.claimNumber === claimId);
    if (!claim) return;

    const updatedTimeline = [
      ...claim.timeline,
      {
        title: 'Claim Rejected',
        subtitle: `Reason: ${reason}`,
        timestamp: 'Just now',
      },
    ];

    const updatedNotes = notes
      ? [...claim.notes, { author: 'Sarah Jenkins', role: 'Super Admin', date: 'Just now', text: `Rejection Note: ${notes}` }]
      : claim.notes;

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id
          ? {
              ...c,
              status: 'Rejected',
              rejectionReason: reason,
              timeline: updatedTimeline,
              notes: updatedNotes,
            }
          : c
      )
    );

    addAuditLog('Claim Rejected', 'Claims', `Rejected claim ${claim.claimNumber}: ${reason}`, 'Warning');
    showToast('Claim Rejected', `Claim ${claim.claimNumber} was rejected.`, 'error');
  };

  const requestClaimInfo = (claimId: string, message: string) => {
    const claim = claims.find((c) => c.id === claimId || c.claimNumber === claimId);
    if (!claim) return;

    const updatedTimeline = [
      ...claim.timeline,
      {
        title: 'Information Requested',
        subtitle: message,
        timestamp: 'Just now',
      },
    ];

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id
          ? {
              ...c,
              status: 'More Information Required',
              infoRequestMessage: message,
              timeline: updatedTimeline,
            }
          : c
      )
    );

    addAuditLog('Claim Info Requested', 'Claims', `Requested information for claim ${claim.claimNumber}`);
    showToast('Information Requested', `Notification sent to claimant for ${claim.claimNumber}.`, 'info');
  };

  const addClaimNote = (claimId: string, noteText: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId || c.claimNumber === claimId
          ? {
              ...c,
              notes: [
                ...c.notes,
                { author: 'Sarah Jenkins', role: 'Super Admin', date: 'Just now', text: noteText },
              ],
            }
          : c
      )
    );
    showToast('Note Added', 'Internal audit note saved to claim record.');
  };

  const markClaimAsPaid = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId || c.claimNumber === claimId
          ? {
              ...c,
              status: 'Paid',
              timeline: [
                ...c.timeline,
                { title: 'Payment Disbursed', subtitle: 'Settlement disbursed to provider account', timestamp: 'Just now' },
              ],
            }
          : c
      )
    );
    showToast('Claim Paid', 'Claim marked as paid.');
  };

  // ─── Workflow 5: Pre-Authorizations ──────────────────────────────────────────
  const addPreAuth = (data: Partial<PreAuthorization>): PreAuthorization => {
    const num = `AUTH-20250${preAuthorizations.length + 1}`;
    const id = `auth-0${preAuthorizations.length + 1}`;
    const newAuth: PreAuthorization = {
      id,
      authNumber: num,
      memberId: data.memberId || 'MEM-001',
      memberName: data.memberName || 'Alexander Wright',
      hospitalId: data.hospitalId || 'hosp-001',
      hospitalName: data.hospitalName || 'Metropolitan Medical Center',
      treatment: data.treatment || 'Planned Medical Procedure',
      procedureCode: data.procedureCode || 'CPT-99214',
      department: data.department || 'General Surgery',
      estimatedCost: data.estimatedCost || 250000,
      requestDate: 'Today',
      priority: data.priority || 'Normal',
      status: 'Pending',
      clinicalJustification: data.clinicalJustification || 'Clinical justification provided by treating physician.',
      notes: [],
    };
    setPreAuthorizations((prev) => [newAuth, ...prev]);
    addAuditLog('Pre-Authorization Requested', 'Insurance Operations', `Logged pre-auth ${newAuth.authNumber} for ${newAuth.memberName}`);
    showToast('Pre-Authorization Lodged', `Request ${newAuth.authNumber} submitted.`);
    return newAuth;
  };

  const approvePreAuth = (authId: string, approvedAmount?: number) => {
    setPreAuthorizations((prev) =>
      prev.map((a) =>
        a.id === authId || a.authNumber === authId
          ? {
              ...a,
              status: 'Approved',
              approvedAmount: approvedAmount || a.estimatedCost,
              validUntil: '30 days from today',
              notes: [...a.notes, { author: 'Dr. Evelyn Vance', text: 'Pre-auth approved under cashless panel rules.', date: 'Just now' }],
            }
          : a
      )
    );
    addAuditLog('Pre-Authorization Approved', 'Insurance Operations', `Approved request: ${authId}`);
    showToast('Pre-Authorization Approved', `Request ${authId} approved.`);
  };

  const rejectPreAuth = (authId: string, reason: string) => {
    setPreAuthorizations((prev) =>
      prev.map((a) =>
        a.id === authId || a.authNumber === authId
          ? {
              ...a,
              status: 'Rejected',
              rejectionReason: reason,
              notes: [...a.notes, { author: 'Dr. Evelyn Vance', text: `Rejected: ${reason}`, date: 'Just now' }],
            }
          : a
      )
    );
    addAuditLog('Pre-Authorization Rejected', 'Insurance Operations', `Rejected request ${authId}: ${reason}`, 'Warning');
    showToast('Pre-Authorization Rejected', `Request ${authId} was declined.`, 'error');
  };

  const requestPreAuthInfo = (authId: string, message: string) => {
    setPreAuthorizations((prev) =>
      prev.map((a) =>
        a.id === authId || a.authNumber === authId
          ? {
              ...a,
              status: 'Under Review',
              notes: [...a.notes, { author: 'Sarah Jenkins', text: `Info requested: ${message}`, date: 'Just now' }],
            }
          : a
      )
    );
    showToast('Info Requested', `Clarification requested for ${authId}.`, 'info');
  };

  // ─── Workflow 6: Settlements & Financial Transactions ─────────────────────────
  const addSettlement = (data: Partial<Settlement>): Settlement => {
    const id = `stl-0${settlements.length + 1}`;
    const newSettlement: Settlement = {
      id,
      settlementNumber: data.settlementNumber || `SET-2025-00${settlements.length + 1}`,
      claimId: data.claimId || `clm-0${claims.length + 1}`,
      claimNumber: data.claimNumber || `CLM-2025-00${claims.length + 1}`,
      hospitalId: data.hospitalId || (hospitals[0]?.id ?? 'HSP-001'),
      hospitalName: data.hospitalName || (hospitals[0]?.name ?? 'General Hospital'),
      insuranceCompanyId: data.insuranceCompanyId || (insuranceCompanies[0]?.id ?? 'ins-001'),
      insuranceCompanyName: data.insuranceCompanyName || (insuranceCompanies[0]?.name ?? 'Apex Health Insurance'),
      settlementAmount: data.settlementAmount || 250000,
      dueDate: data.dueDate || '28 May 2025',
      paymentMethod: data.paymentMethod || 'Bank Transfer',
      bankAccountUsed: data.bankAccountUsed || (bankAccounts[0]?.accountName ?? 'Operating Account'),
      status: data.status || 'Pending',
      createdAt: 'Today',
    };

    setSettlements((prev) => [newSettlement, ...prev]);
    addAuditLog(
      'Settlement Batch Generated',
      'Settlements',
      `Generated remittance batch ${newSettlement.settlementNumber} for ${newSettlement.hospitalName} amounting to PKR ${newSettlement.settlementAmount.toLocaleString()}`
    );
    showToast('Settlement Batch Created', `Remittance batch ${newSettlement.settlementNumber} scheduled successfully.`);
    return newSettlement;
  };

  const processSettlement = (
    settlementId: string,
    paymentMethod: 'Bank Transfer' | 'EFT' | 'Cheque',
    bankAccountUsed: string,
    paymentReference: string
  ) => {
    const s = settlements.find((x) => x.id === settlementId || x.settlementNumber === settlementId);
    if (!s) return;

    setSettlements((prev) =>
      prev.map((item) =>
        item.id === s.id
          ? {
              ...item,
              status: 'Completed',
              paymentMethod,
              bankAccountUsed,
              paymentReference,
              paymentDate: 'Today',
            }
          : item
      )
    );

    // Update associated claim to Paid!
    markClaimAsPaid(s.claimId);

    // Create a new Transaction record!
    const newTx: Transaction = {
      id: `tx-0${transactions.length + 1}`,
      txNumber: `TX-20250${transactions.length + 1}`,
      reference: paymentReference || `SET-PAY-${s.settlementNumber}`,
      type: 'Claim Settlement',
      relatedEntity: s.hospitalName,
      amount: s.settlementAmount,
      paymentMethod,
      date: 'Today',
      status: 'Completed',
      account: bankAccountUsed || 'Chase Operating (4728)',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addAuditLog('Settlement Processed', 'Settlements', `Processed payment of PKR ${s.settlementAmount.toLocaleString()} to ${s.hospitalName} (${newTx.txNumber})`);
    showToast('Settlement Processed', `Disbursed PKR ${s.settlementAmount.toLocaleString()} to ${s.hospitalName}.`);
  };

  const markSettlementPaid = (settlementId: string, paymentReference: string) => {
    processSettlement(settlementId, 'Bank Transfer', 'Chase Commercial (4728)', paymentReference || `REF-${Date.now()}`);
  };

  // ─── Workflow 7: Invoices & Payables ──────────────────────────────────────────
  const addInvoice = (data: Partial<Invoice>): Invoice => {
    const num = `INV-20250${invoices.length + 1}`;
    const id = `inv-0${invoices.length + 1}`;
    const subtotal = data.subtotal || 100000;
    const tax = Math.round(subtotal * 0.15);
    const totalAmount = subtotal + tax;

    const newInv: Invoice = {
      id,
      invoiceNumber: num,
      vendorId: data.vendorId || 'vnd-001',
      vendorName: data.vendorName || 'Amazon Web Services US',
      issueDate: 'Today',
      dueDate: data.dueDate || '15 business days',
      subtotal,
      tax,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      category: data.category || 'IT Services',
      lineItems: data.lineItems || [{ description: 'Professional Services', quantity: 1, unitPrice: subtotal, total: subtotal }],
    };

    setInvoices((prev) => [newInv, ...prev]);
    addAuditLog('Invoice Created', 'Invoices & Payables', `Entered vendor invoice ${newInv.invoiceNumber} for ${newInv.vendorName} (PKR ${totalAmount.toLocaleString()})`);
    showToast('Invoice Saved', `Invoice ${newInv.invoiceNumber} logged in payables.`);
    return newInv;
  };

  const recordInvoicePayment = (invoiceId: string, amount: number) => {
    const inv = invoices.find((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (!inv) return;

    const newPaid = inv.paidAmount + amount;
    const paymentStatus = newPaid >= inv.totalAmount ? 'Paid' : 'Partial';

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              paidAmount: newPaid,
              paymentStatus,
              paymentDate: paymentStatus === 'Paid' ? 'Today' : i.paymentDate,
            }
          : i
      )
    );

    // Create a transaction
    const newTx: Transaction = {
      id: `tx-0${transactions.length + 1}`,
      txNumber: `TX-20250${transactions.length + 1}`,
      reference: `PAY-${inv.invoiceNumber}`,
      type: 'Vendor Invoice',
      relatedEntity: inv.vendorName,
      amount,
      paymentMethod: 'Bank Transfer',
      date: 'Today',
      status: 'Completed',
      account: 'Morgan Stanley (7741)',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addAuditLog('Invoice Payment Disbursed', 'Invoices & Payables', `Recorded PKR ${amount.toLocaleString()} payment against ${inv.invoiceNumber}`);
    showToast('Payment Recorded', `Payment of PKR ${amount.toLocaleString()} applied to ${inv.invoiceNumber}.`);
  };

  // ─── Workflow 8: Bank Reconciliation ─────────────────────────────────────────
  const toggleMatchBankRecord = (stmtId: string, txId?: string) => {
    setBankStatements((prev) =>
      prev.map((s) => (s.id === stmtId ? { ...s, matched: !s.matched, matchedTxId: s.matched ? undefined : txId || 'tx-001' } : s))
    );
    showToast('Reconciliation Match', 'Transaction record link updated.');
  };

  const addBankAdjustment = (accountId: string, amount: number, description: string, type: 'Debit' | 'Credit') => {
    const newStmt: BankStatementRecord = {
      id: `stmt-adj-${Date.now()}`,
      date: 'Today',
      description: `Adjustment: ${description}`,
      reference: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      amount,
      type,
      matched: true,
    };
    setBankStatements((prev) => [newStmt, ...prev]);

    // Update account ledger balance
    setBankAccounts((prev) =>
      prev.map((b) =>
        b.id === accountId
          ? {
              ...b,
              ledgerBalance: type === 'Credit' ? b.ledgerBalance + amount : b.ledgerBalance - amount,
            }
          : b
      )
    );

    addAuditLog('Bank Adjustment Recorded', 'Bank Reconciliation', `Recorded ${type} adjustment of PKR ${amount.toLocaleString()}: ${description}`);
    showToast('Adjustment Added', `Bank adjustment applied to operating ledger.`);
  };

  const completeReconciliation = (accountId: string) => {
    setBankAccounts((prev) =>
      prev.map((b) =>
        b.id === accountId
          ? {
              ...b,
              ledgerBalance: b.balance,
              lastReconciled: 'Today',
            }
          : b
      )
    );
    addAuditLog('Bank Reconciliation Finalized', 'Bank Reconciliation', `Completed reconciliation for account ID: ${accountId}`);
    showToast('Reconciliation Complete', 'Statement and ledger balances now 100% matched.');
  };

  // ─── Workflow 9: Notifications ───────────────────────────────────────────────
  const addNotification = (data: Partial<NotificationItem>): NotificationItem => {
    const id = `notif-0${notifications.length + 1}`;
    const newNotif: NotificationItem = {
      id,
      title: data.title || 'Platform Notification',
      message: data.message || 'Notification broadcast content.',
      recipientGroup: data.recipientGroup || 'All Organizations',
      channel: data.channel || 'All Channels',
      type: data.type || 'System Alert',
      createdAt: 'Just now',
      status: data.status || 'Sent',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('Notification Broadcast', 'Communication', `Dispatched notification: "${newNotif.title}" to ${newNotif.recipientGroup}`);
    showToast('Notification Dispatched', `Communication sent via ${newNotif.channel}.`);
    return newNotif;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Marked Read', 'All notifications cleared.');
  };

  // ─── Workflow 10: Permissions & Role Management ──────────────────────────────
  const updateRolePermission = (roleId: string, moduleName: string, permissionKey: string, value: boolean) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        const updatedPermissions = role.permissions.map((p) => {
          if (p.module !== moduleName) return p;
          return { ...p, [permissionKey]: value };
        });
        return { ...role, permissions: updatedPermissions };
      })
    );
    addAuditLog('Role Permission Modified', 'Permissions', `Updated ${permissionKey} on ${moduleName} for role ${roleId}`, 'Security');
    showToast('Permissions Saved', `Role access updated in permission matrix.`);
  };

  const addAdminUser = (data: Partial<AdminUser>): AdminUser => {
    const id = `adm-00${adminUsers.length + 1}`;
    const newAdmin: AdminUser = {
      id,
      name: data.name || 'New Administrator',
      email: data.email || 'admin@nexora.com',
      phone: data.phone || '+1 (555) 000-0000',
      department: data.department || 'Operations',
      role: data.role || 'Operations Admin',
      lastLogin: 'Never',
      status: 'Active',
      avatarInitials: (data.name || 'NA')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
    };
    setAdminUsers((prev) => [newAdmin, ...prev]);
    addAuditLog('Admin User Created', 'Admin Users & Roles', `Provisioned admin account for ${newAdmin.name} (${newAdmin.role})`, 'Security');
    showToast('Admin User Provisioned', `${newAdmin.name} added as ${newAdmin.role}.`);
    return newAdmin;
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    addAuditLog('Admin User Updated', 'Admin Users & Roles', `Updated administrative profile for ${id}`);
    showToast('Admin Profile Updated', 'Administrator profile details saved.');
  };

  // Auth Operations
  const login = (email: string, password: string, require2FA: boolean = true) => {
    const matchedUser =
      adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || initialAdminUsers[0];
    setCurrentUser(matchedUser);
    setPendingAuthEmail(email);

    if (require2FA) {
      setAuthMode('login_2fa');
      setAuthScreen('otp_verify');
      return { success: true, requires2FA: true };
    } else {
      setIsAuthenticated(true);
      addAuditLog('User Login Success', 'Authentication', `Admin session started for ${matchedUser.name} (${email})`);
      return { success: true, requires2FA: false };
    }
  };

  const verifyOtp = (code: string) => {
    // Accepts 123456 or any 6-digit numeric token for seamless demo evaluation
    if (code.length === 6) {
      if (authMode === 'login_2fa') {
        setIsAuthenticated(true);
        addAuditLog('2FA Verified', 'Authentication', `Cryptographic 2FA verified for ${currentUser.name}`);
        showToast('Authentication Verified', `Welcome to Nexora Health Console, ${currentUser.name}!`, 'success');
        return true;
      } else {
        setAuthScreen('reset_password');
        showToast('Identity Verified', 'Please enter your new compliant password.', 'info');
        return true;
      }
    } else {
      showToast('Invalid Code', 'Please check the verification code and try again.', 'error');
      return false;
    }
  };

  const requestPasswordReset = (email: string) => {
    setPendingAuthEmail(email);
    setAuthMode('password_reset_otp');
    setAuthScreen('otp_verify');
    addAuditLog('Password Reset Requested', 'Authentication', `Recovery token requested for ${email}`);
    showToast('Recovery Code Sent', `6-digit reset code transmitted to ${email}.`, 'info');
    return true;
  };

  const resetPasswordWithOtp = (_newPassword: string) => {
    setIsAuthenticated(true);
    addAuditLog('Password Reset Success', 'Authentication', `Password updated for ${currentUser.name}`);
    showToast('Password Updated', 'Your security password was successfully rotated. Signed in automatically.', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthScreen('login');
    showToast('Signed Out', 'You have been securely signed out of your administrator console.', 'info');
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setCompanies(initialCompanies);
    setInsuranceCompanies(initialInsuranceCompanies);
    setCorporateClients(initialCorporateClients);
    setHospitals(initialHospitals);
    setCustomers(initialCustomers);
    setInsuredMembers(initialInsuredMembers);
    setInsurancePlans(initialInsurancePlans);
    setPolicies(initialPolicies);
    setClaims(initialClaims);
    setPreAuthorizations(initialPreAuthorizations);
    setSettlements(initialSettlements);
    setTransactions(initialTransactions);
    setInvoices(initialInvoices);
    setBankAccounts(initialBankAccounts);
    setBankStatements(initialBankStatements);
    setNotifications(initialNotifications);
    setAdminUsers(initialAdminUsers);
    setRoles(initialRoles);
    setAuditLogs(initialAuditLogs);
    showToast('Platform Reset', 'Mock data restored to original initial state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authScreen,
        setAuthScreen,
        authMode,
        setAuthMode,
        pendingAuthEmail,
        setPendingAuthEmail,
        currentUser,
        setCurrentUser,
        login,
        verifyOtp,
        requestPasswordReset,
        resetPasswordWithOtp,
        logout,

        currentPage,
        setCurrentPage,
        navigate,

        viewingItem,
        setViewingItem,
        activeModal,
        setActiveModal,
        selectedDetailTab,
        setSelectedDetailTab,

        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,

        isNotificationsOpen,
        setIsNotificationsOpen,
        isProfileMenuOpen,
        setIsProfileMenuOpen,

        toasts,
        showToast,
        dismissToast,

        companies,
        insuranceCompanies,
        corporateClients,
        hospitals,
        customers,
        insuredMembers,
        insurancePlans,
        policies,
        claims,
        preAuthorizations,
        settlements,
        transactions,
        invoices,
        vendors,
        bankAccounts,
        bankStatements,
        notifications,
        adminUsers,
        roles,
        auditLogs,

        addCompany,
        updateCompany,
        deleteCompany,
        addCorporateClient,
        addInsuranceCompany,
        addHospital,
        addSettlement,

        addMember,
        updateMember,
        deleteMember,
        addCustomer,

        addPolicy,
        updatePolicy,
        addPlan,
        updatePlan,

        addClaim,
        approveClaim,
        rejectClaim,
        requestClaimInfo,
        addClaimNote,
        markClaimAsPaid,

        addPreAuth,
        approvePreAuth,
        rejectPreAuth,
        requestPreAuthInfo,

        processSettlement,
        markSettlementPaid,

        addInvoice,
        recordInvoicePayment,

        toggleMatchBankRecord,
        addBankAdjustment,
        completeReconciliation,

        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        updateRolePermission,
        addAdminUser,
        updateAdminUser,

        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
