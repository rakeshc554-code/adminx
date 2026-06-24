import { DatabaseManager } from './database';
import { CustomerRepository, ProductRepository, TransactionRepository, InvoiceRepository, EmployeeRepository, ExpenseRepository, SyncQueueRepository, AuditLogRepository, BackupRepository, UserRepository, BusinessRepository } from './repositories';

export class DatabaseService {
  private static instance: DatabaseService;
  dbManager: DatabaseManager;
  users: UserRepository;
  businesses: BusinessRepository;
  customers: CustomerRepository;
  products: ProductRepository;
  transactions: TransactionRepository;
  invoices: InvoiceRepository;
  employees: EmployeeRepository;
  expenses: ExpenseRepository;
  syncQueue: SyncQueueRepository;
  auditLogs: AuditLogRepository;
  backups: BackupRepository;

  private constructor(dbPath?: string) {
    this.dbManager = new DatabaseManager(dbPath);
    this.users = new UserRepository(this.dbManager);
    this.businesses = new BusinessRepository(this.dbManager);
    this.customers = new CustomerRepository(this.dbManager);
    this.products = new ProductRepository(this.dbManager);
    this.transactions = new TransactionRepository(this.dbManager);
    this.invoices = new InvoiceRepository(this.dbManager);
    this.employees = new EmployeeRepository(this.dbManager);
    this.expenses = new ExpenseRepository(this.dbManager);
    this.syncQueue = new SyncQueueRepository(this.dbManager);
    this.auditLogs = new AuditLogRepository(this.dbManager);
    this.backups = new BackupRepository(this.dbManager);
  }

  static getInstance(dbPath?: string): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(dbPath);
    }
    return DatabaseService.instance;
  }

  close(): void {
    this.dbManager.close();
  }
}
