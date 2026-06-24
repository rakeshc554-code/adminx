import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class DatabaseManager {
  private db: Database.Database;

  constructor(dbPath: string = './data/adminx.db') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        gst TEXT,
        address TEXT NOT NULL DEFAULT '',
        bank_details TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        balance REAL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('CREDIT','DEBIT')),
        description TEXT,
        date INTEGER NOT NULL,
        invoice_id TEXT,
        category TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sku TEXT,
        barcode TEXT,
        price REAL NOT NULL,
        cost REAL DEFAULT 0,
        quantity INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 0,
        expiry_date INTEGER,
        batch_number TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        invoice_number TEXT NOT NULL,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        gst REAL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','SENT','PAID','OVERDUE','CANCELLED')),
        created_at INTEGER NOT NULL,
        due_date INTEGER,
        synced INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (business_id) REFERENCES businesses(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );

      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        salary REAL DEFAULT 0,
        attendance TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date INTEGER NOT NULL,
        payment_method TEXT DEFAULT 'cash',
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS backups (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        size INTEGER DEFAULT 0,
        data TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL CHECK(action IN ('create','update','delete')),
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_business ON transactions(business_id);
      CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
      CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
      CREATE INDEX IF NOT EXISTS idx_invoices_business ON invoices(business_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_employees_business ON employees(business_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_business ON expenses(business_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_business ON sync_queue(business_id);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_business ON audit_logs(business_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
    `);
  }

  getDb(): Database.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}
