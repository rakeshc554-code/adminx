export type TransactionType = 'CREDIT' | 'DEBIT';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type UserRole = 'admin' | 'sales_rep' | 'accountant' | 'manager' | 'viewer';
export type SyncAction = 'create' | 'update' | 'delete';

export interface User {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export interface Business {
  id: string;
  name: string;
  gst: string | null;
  address: string;
  bankDetails: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  balance: number;
  createdAt: number;
  updatedAt: number;
  synced: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  businessId: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: number;
  invoiceId: string | null;
  category: string | null;
  synced: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode: string | null;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  expiryDate: number | null;
  batchNumber: string | null;
  synced: number;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

export interface Invoice {
  id: string;
  businessId: string;
  customerId: string;
  invoiceNumber: string;
  items: string;
  subtotal: number;
  gst: number;
  total: number;
  status: InvoiceStatus;
  createdAt: number;
  dueDate: number | null;
  synced: number;
  notes: string | null;
}

export interface Employee {
  id: string;
  businessId: string;
  name: string;
  role: string;
  phone: string;
  email: string | null;
  salary: number;
  attendance: string | null;
  synced: number;
}

export interface Expense {
  id: string;
  businessId: string;
  amount: number;
  category: string;
  description: string;
  date: number;
  paymentMethod: string;
  synced: number;
}

export interface Backup {
  id: string;
  userId: string;
  businessId: string;
  timestamp: number;
  size: number;
  data: string;
}

export interface SyncQueue {
  id: string;
  businessId: string;
  entity: string;
  entityId: string;
  action: SyncAction;
  data: string;
  timestamp: number;
  synced: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  businessId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
