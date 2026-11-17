export type NavigationPage =
  | 'Dashboard'
  | 'Analytics & Reports'
  | 'All Companies'
  | 'Insurance Companies'
  | 'Corporate Clients'
  | 'Hospitals & Clinics'
  | 'All Users'
  | 'Customers'
  | 'Insured Members'
  | 'Insurance Plans'
  | 'Policies'
  | 'Claims Management'
  | 'Pre-Authorizations'
  | 'Settlements'
  | 'Financial Overview'
  | 'Accounting'
  | 'Transactions'
  | 'Invoices & Payables'
  | 'Bank Reconciliation'
  | 'Financial Reports'
  | 'Audit Logs'
  | 'Notifications'
  | 'Admin Users & Roles'
  | 'Permissions'
  | 'Settings';

export type AuthScreen = 'login' | 'forgot_password' | 'otp_verify' | 'reset_password';

export interface Company {
  id: string;
  name: string;
  type: 'Insurance' | 'Corporate' | 'Hospital' | 'Clinic';
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  country: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Under Review';
  totalMembers: number;
  registrationDate: string;
  totalPremium?: string;
  activePolicies?: number;
  totalClaims?: number;
}

export interface InsuranceCompany {
  id: string;
  companyId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  activePlans: number;
  activePolicies: number;
  totalMembers: number;
  totalClaims: number;
  claimsApprovedAmount: string;
  settlementTurnaroundDays: number;
  status: 'Active' | 'Pending' | 'Inactive';
  supportedPlans: string[];
}

export interface CorporateClient {
  id: string;
  companyId: string;
  name: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalEmployees: number;
  activePolicies: number;
  contractStart: string;
  contractEnd: string;
  annualPremium: string;
  status: 'Active' | 'Pending' | 'Expired';
}

export interface Hospital {
  id: string;
  name: string;
  providerType: 'Hospital' | 'Clinic' | 'Diagnostic Center';
  location: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  insuranceNetworks: string[];
  departments: string[];
  specialties: string[];
  totalClaims: number;
  networkStatus: 'Active' | 'Pending' | 'Suspended';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ssn: string;
  gender: 'Male' | 'Female';
  dob: string;
  corporateClientId?: string;
  corporateClientName?: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  activePolicies: number;
  totalClaims: number;
  registrationDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
  address: string;
  city: string;
}

export interface Dependent {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Parent';
  dob: string;
  ssn: string;
  status: 'Active' | 'Inactive';
}

export interface InsuredMember {
  id: string;
  customerId: string;
  name: string;
  memberType: 'Primary' | 'Spouse' | 'Child' | 'Parent';
  policyNumber: string;
  planId: string;
  insurancePlanName: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  corporateClientId: string;
  corporateClientName: string;
  coverageStart: string;
  coverageEnd: string;
  coverageLimit: string;
  claimsUtilized: string;
  ssn: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  status: 'Active' | 'Expired' | 'Suspended';
  dependents: Dependent[];
}

export interface InsurancePlan {
  id: string;
  name: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  planType: 'Corporate' | 'Individual' | 'Family' | 'Executive' | 'Group';
  monthlyPremium: string;
  annualPremium: string;
  coverageLimit: string;
  enrolledMembers: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'Active' | 'Draft' | 'Under Review' | 'Retired';
  description: string;
  benefits: { category: string; description: string; limit: string }[];
  exclusions: string[];
  eligibilityRules: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  memberId: string;
  memberName: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  planId: string;
  planName: string;
  corporateClientId?: string;
  corporateClientName?: string;
  startDate: string;
  expiryDate: string;
  monthlyPremium: string;
  coverageAmount: string;
  claimsCount: number;
  claimsAmountUtilized: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Cancelled' | 'Renewed';
  renewalDate?: string;
}

export interface ClaimLineItem {
  description: string;
  category: string;
  amount: number;
}

export interface Claim {
  id: string;
  claimNumber: string;
  memberId: string;
  memberName: string;
  policyNumber: string;
  hospitalId: string;
  hospitalName: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  claimType: 'Hospitalization' | 'Outpatient' | 'Emergency' | 'Dental' | 'Vision';
  submittedAmount: number;
  approvedAmount?: number;
  deductibleApplied?: number;
  coPayApplied?: number;
  submissionDate: string;
  treatmentDate: string;
  dischargeDate?: string;
  diagnosis: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'More Information Required' | 'Paid';
  treatingDoctor: string;
  department: string;
  lineItems: ClaimLineItem[];
  rejectionReason?: string;
  infoRequestMessage?: string;
  notes: { author: string; role: string; date: string; text: string }[];
  timeline: { title: string; subtitle: string; timestamp: string }[];
}

export interface PreAuthorization {
  id: string;
  authNumber: string;
  memberId: string;
  memberName: string;
  hospitalId: string;
  hospitalName: string;
  treatment: string;
  procedureCode: string;
  department: string;
  estimatedCost: number;
  approvedAmount?: number;
  requestDate: string;
  validUntil?: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  clinicalJustification: string;
  rejectionReason?: string;
  notes: { author: string; text: string; date: string }[];
}

export interface Settlement {
  id: string;
  settlementNumber: string;
  claimId: string;
  claimNumber: string;
  hospitalId: string;
  hospitalName: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  settlementAmount: number;
  dueDate: string;
  paymentMethod: 'Bank Transfer' | 'EFT' | 'Cheque';
  paymentDate?: string;
  paymentReference?: string;
  bankAccountUsed?: string;
  status: 'Pending' | 'Processing' | 'Completed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  txNumber: string;
  reference: string;
  type: 'Premium Collection' | 'Claim Settlement' | 'Provider Payment' | 'Refund' | 'Vendor Invoice';
  relatedEntity: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'EFT' | 'Cheque' | 'Credit Card' | 'Direct Debit';
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  account: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  paymentDate?: string;
  category: 'IT Services' | 'Medical Supplies' | 'Legal & Audit' | 'Consulting' | 'Facilities';
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  totalBilled: string;
  outstanding: string;
  status: 'Active' | 'Inactive';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branch: string;
  balance: number;
  ledgerBalance: number;
  currency: 'PKR';
  status: 'Active' | 'Restricted';
  lastReconciled: string;
}

export interface BankStatementRecord {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: 'Debit' | 'Credit';
  matched: boolean;
  matchedTxId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  recipientGroup: 'All Organizations' | 'Insurance Providers' | 'Corporate Clients' | 'Members' | 'Admins';
  channel: 'In-App' | 'Email' | 'SMS' | 'All Channels';
  type: 'System Alert' | 'Claim Update' | 'Policy Notice' | 'Settlement Advice';
  createdAt: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  read: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'Executive' | 'Operations' | 'Finance' | 'Claims' | 'Customer Support' | 'IT & Security';
  role: 'Super Admin' | 'Operations Admin' | 'Finance Admin' | 'Claims Manager' | 'Organization Manager' | 'Support Admin';
  lastLogin: string;
  status: 'Active' | 'Inactive';
  avatarInitials: string;
}

export interface RolePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: RolePermission[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  severity: 'Info' | 'Warning' | 'Security';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
