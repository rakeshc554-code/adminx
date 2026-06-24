import { DatabaseManager } from './database';
import { Customer, Product, Transaction, Invoice, Employee, Expense, SyncQueue, AuditLog, Backup, User, Business } from './types';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  constructor(private db: DatabaseManager) {}
  findByEmail(email: string): User | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, email, phone, password_hash as passwordHash, role, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?').get(email) as any;
  }
  findByPhone(phone: string): User | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, email, phone, password_hash as passwordHash, role, created_at as createdAt, updated_at as updatedAt FROM users WHERE phone = ?').get(phone) as any;
  }
  findById(id: string): User | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, email, phone, password_hash as passwordHash, role, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?').get(id) as any;
  }
  create(user: Omit<User, 'createdAt' | 'updatedAt'>): User {
    const now = Date.now();
    this.db.getDb().prepare('INSERT INTO users (id, business_id, name, email, phone, password_hash, role, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(user.id, user.businessId, user.name, user.email, user.phone, user.passwordHash, user.role, now, now);
    return this.findById(user.id)!;
  }
  update(id: string, data: Partial<User>): User | undefined {
    const fields: string[] = []; const values: any[] = [];
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }
    if (data.passwordHash) { fields.push('password_hash = ?'); values.push(data.passwordHash); }
    if (fields.length > 0) {
      fields.push('updated_at = ?'); values.push(Date.now());
      this.db.getDb().prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
}

export class BusinessRepository {
  constructor(private db: DatabaseManager) {}
  findById(id: string): Business | undefined {
    return this.db.getDb().prepare('SELECT id, name, gst, address, bank_details as bankDetails, created_at as createdAt, updated_at as updatedAt FROM businesses WHERE id = ?').get(id) as any;
  }
  create(business: Omit<Business, 'createdAt' | 'updatedAt'>): Business {
    const now = Date.now();
    this.db.getDb().prepare('INSERT INTO businesses (id, name, gst, address, bank_details, created_at, updated_at) VALUES (?,?,?,?,?,?,?)').run(business.id, business.name, business.gst, business.address, business.bankDetails, now, now);
    return this.findById(business.id)!;
  }
  update(id: string, data: Partial<Business>): Business | undefined {
    const fields: string[] = []; const values: any[] = [];
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.gst !== undefined) { fields.push('gst = ?'); values.push(data.gst); }
    if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
    if (data.bankDetails !== undefined) { fields.push('bank_details = ?'); values.push(data.bankDetails); }
    if (fields.length > 0) {
      fields.push('updated_at = ?'); values.push(Date.now());
      this.db.getDb().prepare(`UPDATE businesses SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
}

export class CustomerRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string, search?: string, filter?: string, sort?: string, page = 1, limit = 20): { data: Customer[]; total: number } {
    let sql = 'FROM customers WHERE business_id = ?';
    const params: any[] = [businessId];
    if (search) { sql += ' AND (name LIKE ? OR phone LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (filter === 'due') sql += ' AND balance > 0';
    else if (filter === 'paid') sql += ' AND balance = 0';
    const count = (this.db.getDb().prepare(`SELECT COUNT(*) as count ${sql}`).get(...params) as any).count;
    let order = 'ORDER BY created_at DESC';
    if (sort === 'name') order = 'ORDER BY name ASC';
    else if (sort === 'balance') order = 'ORDER BY balance DESC';
    else if (sort === 'recent') order = 'ORDER BY updated_at DESC';
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare(`SELECT id, business_id as businessId, name, phone, email, address, balance, created_at as createdAt, updated_at as updatedAt, synced ${sql} ${order} LIMIT ? OFFSET ?`).all(...params, limit, offset) as any[];
    return { data, total: count };
  }
  findById(id: string): Customer | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, phone, email, address, balance, created_at as createdAt, updated_at as updatedAt, synced FROM customers WHERE id = ?').get(id) as any;
  }
  create(customer: Omit<Customer, 'createdAt' | 'updatedAt'>): Customer {
    const now = Date.now();
    this.db.getDb().prepare('INSERT INTO customers (id, business_id, name, phone, email, address, balance, created_at, updated_at, synced) VALUES (?,?,?,?,?,?,?,?,?,?)').run(customer.id, customer.businessId, customer.name, customer.phone, customer.email, customer.address, customer.balance || 0, now, now, customer.synced || 0);
    return this.findById(customer.id)!;
  }
  update(id: string, data: Partial<Customer>): Customer | undefined {
    const fields: string[] = []; const values: any[] = [];
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
    if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
    if (data.balance !== undefined) { fields.push('balance = ?'); values.push(data.balance); }
    fields.push('updated_at = ?'); values.push(Date.now());
    this.db.getDb().prepare(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return this.findById(id);
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM customers WHERE id = ?').run(id);
    return result.changes > 0;
  }
  updateBalance(id: string): void {
    const result = this.db.getDb().prepare("SELECT COALESCE(SUM(CASE WHEN type='CREDIT' THEN amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN type='DEBIT' THEN amount ELSE 0 END), 0) as balance FROM transactions WHERE customer_id = ?").get(id) as any;
    this.db.getDb().prepare('UPDATE customers SET balance = ?, updated_at = ? WHERE id = ?').run(result.balance, Date.now(), id);
  }
}

export class TransactionRepository {
  constructor(private db: DatabaseManager) {}
  findByCustomerId(customerId: string, page = 1, limit = 50): { data: Transaction[]; total: number } {
    const count = (this.db.getDb().prepare('SELECT COUNT(*) as count FROM transactions WHERE customer_id = ?').get(customerId) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare('SELECT id, customer_id as customerId, business_id as businessId, amount, type, description, date, invoice_id as invoiceId, category, synced FROM transactions WHERE customer_id = ? ORDER BY date DESC LIMIT ? OFFSET ?').all(customerId, limit, offset) as any[];
    return { data, total: count };
  }
  findByBusinessId(businessId: string, page = 1, limit = 50): { data: Transaction[]; total: number } {
    const count = (this.db.getDb().prepare('SELECT COUNT(*) as count FROM transactions WHERE business_id = ?').get(businessId) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare('SELECT id, customer_id as customerId, business_id as businessId, amount, type, description, date, invoice_id as invoiceId, category, synced FROM transactions WHERE business_id = ? ORDER BY date DESC LIMIT ? OFFSET ?').all(businessId, limit, offset) as any[];
    return { data, total: count };
  }
  findById(id: string): Transaction | undefined {
    return this.db.getDb().prepare('SELECT id, customer_id as customerId, business_id as businessId, amount, type, description, date, invoice_id as invoiceId, category, synced FROM transactions WHERE id = ?').get(id) as any;
  }
  create(tx: Omit<Transaction, 'synced'>): Transaction {
    this.db.getDb().prepare('INSERT INTO transactions (id, customer_id, business_id, amount, type, description, date, invoice_id, category, synced) VALUES (?,?,?,?,?,?,?,?,?,0)').run(tx.id, tx.customerId, tx.businessId, tx.amount, tx.type, tx.description, tx.date, tx.invoiceId, tx.category);
    return this.findById(tx.id)!;
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return result.changes > 0;
  }
  getRunningBalance(customerId: string): Transaction[] {
    return this.db.getDb().prepare('SELECT id, customer_id as customerId, business_id as businessId, amount, type, description, date, invoice_id as invoiceId, category, synced FROM transactions WHERE customer_id = ? ORDER BY date ASC').all(customerId) as any[];
  }
}

export class ProductRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string, search?: string, filter?: string, page = 1, limit = 20): { data: Product[]; total: number } {
    let sql = 'FROM products WHERE business_id = ?';
    const params: any[] = [businessId];
    if (search) { sql += ' AND (name LIKE ? OR sku LIKE ? OR barcode LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (filter === 'low_stock') sql += ' AND quantity <= reorder_level';
    else if (filter === 'expiring') sql += ' AND expiry_date IS NOT NULL AND expiry_date <= ?'; params.push(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const count = (this.db.getDb().prepare(`SELECT COUNT(*) as count ${sql}`).get(...params) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare(`SELECT id, business_id as businessId, name, sku, barcode, price, cost, quantity, reorder_level as reorderLevel, expiry_date as expiryDate, batch_number as batchNumber, synced ${sql} ORDER BY name ASC LIMIT ? OFFSET ?`).all(...params, limit, offset) as any[];
    return { data, total: count };
  }
  findById(id: string): Product | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, sku, barcode, price, cost, quantity, reorder_level as reorderLevel, expiry_date as expiryDate, batch_number as batchNumber, synced FROM products WHERE id = ?').get(id) as any;
  }
  create(product: Omit<Product, 'synced'>): Product {
    this.db.getDb().prepare('INSERT INTO products (id, business_id, name, sku, barcode, price, cost, quantity, reorder_level, expiry_date, batch_number, synced) VALUES (?,?,?,?,?,?,?,?,?,?,?,0)').run(product.id, product.businessId, product.name, product.sku, product.barcode, product.price, product.cost, product.quantity, product.reorderLevel, product.expiryDate, product.batchNumber);
    return this.findById(product.id)!;
  }
  update(id: string, data: Partial<Product>): Product | undefined {
    const fields: string[] = []; const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${col} = ?`); values.push(val);
      }
    }
    if (fields.length > 0) {
      this.db.getDb().prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export class InvoiceRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string, status?: string, search?: string, page = 1, limit = 20): { data: Invoice[]; total: number } {
    let sql = 'FROM invoices i WHERE business_id = ?';
    const params: any[] = [businessId];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (search) { sql += ' AND (invoice_number LIKE ? OR customer_id IN (SELECT id FROM customers WHERE name LIKE ?))'; params.push(`%${search}%`, `%${search}%`); }
    const count = (this.db.getDb().prepare(`SELECT COUNT(*) as count ${sql}`).get(...params) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare(`SELECT i.id, i.business_id as businessId, i.customer_id as customerId, i.invoice_number as invoiceNumber, i.items, i.subtotal, i.gst, i.total, i.status, i.created_at as createdAt, i.due_date as dueDate, i.synced, i.notes, c.name as customerName FROM invoices i LEFT JOIN customers c ON i.customer_id = c.id ${sql} ORDER BY i.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset) as any[];
    return { data, total: count };
  }
  findById(id: string): Invoice | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, customer_id as customerId, invoice_number as invoiceNumber, items, subtotal, gst, total, status, created_at as createdAt, due_date as dueDate, synced, notes FROM invoices WHERE id = ?').get(id) as any;
  }
  findByNumber(invoiceNumber: string): Invoice | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, customer_id as customerId, invoice_number as invoiceNumber, items, subtotal, gst, total, status, created_at as createdAt, due_date as dueDate, synced, notes FROM invoices WHERE invoice_number = ?').get(invoiceNumber) as any;
  }
  create(invoice: Omit<Invoice, 'createdAt' | 'synced'>): Invoice {
    this.db.getDb().prepare('INSERT INTO invoices (id, business_id, customer_id, invoice_number, items, subtotal, gst, total, status, created_at, due_date, synced, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,?)').run(invoice.id, invoice.businessId, invoice.customerId, invoice.invoiceNumber, invoice.items, invoice.subtotal, invoice.gst, invoice.total, invoice.status, invoice.createdAt, invoice.dueDate, invoice.notes);
    return this.findById(invoice.id)!;
  }
  update(id: string, data: Partial<Invoice>): Invoice | undefined {
    const fields: string[] = []; const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${col} = ?`); values.push(val);
      }
    }
    if (fields.length > 0) {
      this.db.getDb().prepare(`UPDATE invoices SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM invoices WHERE id = ?').run(id);
    return result.changes > 0;
  }
  getNextSequence(businessId: string): number {
    const result = this.db.getDb().prepare("SELECT COUNT(*) as count FROM invoices WHERE business_id = ? AND strftime('%Y', created_at / 1000, 'unixepoch') = strftime('%Y', 'now')").get(businessId) as any;
    return (result.count || 0) + 1;
  }
}

export class EmployeeRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string): Employee[] {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, role, phone, email, salary, attendance, synced FROM employees WHERE business_id = ?').all(businessId) as any[];
  }
  findById(id: string): Employee | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, name, role, phone, email, salary, attendance, synced FROM employees WHERE id = ?').get(id) as any;
  }
  create(emp: Employee): Employee {
    this.db.getDb().prepare('INSERT INTO employees (id, business_id, name, role, phone, email, salary, attendance, synced) VALUES (?,?,?,?,?,?,?,?,?)').run(emp.id, emp.businessId, emp.name, emp.role, emp.phone, emp.email, emp.salary, emp.attendance, emp.synced);
    return this.findById(emp.id)!;
  }
  update(id: string, data: Partial<Employee>): Employee | undefined {
    const fields: string[] = []; const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${col} = ?`); values.push(val);
      }
    }
    if (fields.length > 0) {
      this.db.getDb().prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM employees WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export class ExpenseRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string, category?: string, page = 1, limit = 20): { data: Expense[]; total: number } {
    let sql = 'FROM expenses WHERE business_id = ?';
    const params: any[] = [businessId];
    if (category) { sql += ' AND category = ?'; params.push(category); }
    const count = (this.db.getDb().prepare(`SELECT COUNT(*) as count ${sql}`).get(...params) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare(`SELECT id, business_id as businessId, amount, category, description, date, payment_method as paymentMethod, synced ${sql} ORDER BY date DESC LIMIT ? OFFSET ?`).all(...params, limit, offset) as any[];
    return { data, total: count };
  }
  findById(id: string): Expense | undefined {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, amount, category, description, date, payment_method as paymentMethod, synced FROM expenses WHERE id = ?').get(id) as any;
  }
  create(expense: Expense): Expense {
    this.db.getDb().prepare('INSERT INTO expenses (id, business_id, amount, category, description, date, payment_method, synced) VALUES (?,?,?,?,?,?,?,?)').run(expense.id, expense.businessId, expense.amount, expense.category, expense.description, expense.date, expense.paymentMethod, expense.synced);
    return this.findById(expense.id)!;
  }
  update(id: string, data: Partial<Expense>): Expense | undefined {
    const fields: string[] = []; const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${col} = ?`); values.push(val);
      }
    }
    if (fields.length > 0) {
      this.db.getDb().prepare(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    return this.findById(id);
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM expenses WHERE id = ?').run(id);
    return result.changes > 0;
  }
  getReportByCategory(businessId: string, startDate: number, endDate: number): any[] {
    return this.db.getDb().prepare("SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses WHERE business_id = ? AND date >= ? AND date <= ? GROUP BY category ORDER BY total DESC").all(businessId, startDate, endDate);
  }
}

export class SyncQueueRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string, synced = 0): SyncQueue[] {
    return this.db.getDb().prepare('SELECT id, business_id as businessId, entity, entity_id as entityId, action, data, timestamp, synced FROM sync_queue WHERE business_id = ? AND synced = ? ORDER BY timestamp ASC').all(businessId, synced) as any[];
  }
  create(queue: SyncQueue): SyncQueue {
    this.db.getDb().prepare('INSERT INTO sync_queue (id, business_id, entity, entity_id, action, data, timestamp, synced) VALUES (?,?,?,?,?,?,?,?)').run(queue.id, queue.businessId, queue.entity, queue.entityId, queue.action, queue.data, queue.timestamp, queue.synced);
    return queue;
  }
  markSynced(id: string): void {
    this.db.getDb().prepare('UPDATE sync_queue SET synced = 1 WHERE id = ?').run(id);
  }
}

export class AuditLogRepository {
  constructor(private db: DatabaseManager) {}
  create(log: AuditLog): AuditLog {
    this.db.getDb().prepare('INSERT INTO audit_logs (id, user_id, business_id, action, entity, entity_id, details, timestamp) VALUES (?,?,?,?,?,?,?,?)').run(log.id, log.userId, log.businessId, log.action, log.entity, log.entityId, log.details, log.timestamp);
    return log;
  }
  findByBusinessId(businessId: string, page = 1, limit = 50): { data: AuditLog[]; total: number } {
    const count = (this.db.getDb().prepare('SELECT COUNT(*) as count FROM audit_logs WHERE business_id = ?').get(businessId) as any).count;
    const offset = (page - 1) * limit;
    const data = this.db.getDb().prepare('SELECT id, user_id as userId, business_id as businessId, action, entity, entity_id as entityId, details, timestamp FROM audit_logs WHERE business_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?').all(businessId, limit, offset) as any[];
    return { data, total: count };
  }
}

export class BackupRepository {
  constructor(private db: DatabaseManager) {}
  findByBusinessId(businessId: string): Backup[] {
    return this.db.getDb().prepare('SELECT id, user_id as userId, business_id as businessId, timestamp, size, data FROM backups WHERE business_id = ? ORDER BY timestamp DESC').all(businessId) as any[];
  }
  findById(id: string): Backup | undefined {
    return this.db.getDb().prepare('SELECT id, user_id as userId, business_id as businessId, timestamp, size, data FROM backups WHERE id = ?').get(id) as any;
  }
  create(backup: Backup): Backup {
    this.db.getDb().prepare('INSERT INTO backups (id, user_id, business_id, timestamp, size, data) VALUES (?,?,?,?,?,?)').run(backup.id, backup.userId, backup.businessId, backup.timestamp, backup.size, backup.data);
    return backup;
  }
  delete(id: string): boolean {
    const result = this.db.getDb().prepare('DELETE FROM backups WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
