import { DatabaseService } from './database.service';
import { generateId, now } from '../utils/helpers';

export class BackupService {
  static async create(userId: string, businessId: string): Promise<{ backupId: string; timestamp: number; size: number }> {
    const db = DatabaseService.getInstance();
    const data: any = {};
    for (const table of ['customers', 'products', 'transactions', 'invoices', 'employees', 'expenses']) {
      data[table] = db.dbManager.getDb().prepare(`SELECT * FROM ${table} WHERE business_id = ?`).all(businessId);
    }
    const json = JSON.stringify(data);
    const backup = {
      id: generateId(),
      userId,
      businessId,
      timestamp: now(),
      size: Buffer.byteLength(json, 'utf8'),
      data: json,
    };
    db.backups.create(backup);
    return { backupId: backup.id, timestamp: backup.timestamp, size: backup.size };
  }

  static async list(businessId: string): Promise<{ id: string; timestamp: number; size: number }[]> {
    const db = DatabaseService.getInstance();
    return db.backups.findByBusinessId(businessId).map(b => ({ id: b.id, timestamp: b.timestamp, size: b.size }));
  }

  static async restore(backupId: string): Promise<boolean> {
    const db = DatabaseService.getInstance();
    const backup = db.backups.findById(backupId);
    if (!backup) return false;
    const data = JSON.parse(backup.data);
    const dbInstance = db.dbManager.getDb();
    const transaction = dbInstance.transaction(() => {
      for (const [table, rows] of Object.entries(data)) {
        if (Array.isArray(rows) && rows.length > 0) {
          dbInstance.prepare(`DELETE FROM ${table} WHERE business_id = ?`).run(backup.businessId);
          const insertStmt = dbInstance.prepare(`INSERT OR REPLACE INTO ${table} VALUES (${rows.length > 0 ? Object.keys(rows[0]).map(() => '?').join(',') : ''})`);
          for (const row of rows as any[]) {
            insertStmt.run(Object.values(row));
          }
        }
      }
    });
    transaction();
    return true;
  }
}
