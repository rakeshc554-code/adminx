import { DatabaseService } from './database.service';
import { generateId, now } from '../utils/helpers';

export class SyncService {
  static async pull(businessId: string, lastSyncTimestamp: number): Promise<{ changes: any[]; newTimestamp: number }> {
    const db = DatabaseService.getInstance();
    const changes: any[] = [];
    const entities = ['customers', 'products', 'transactions', 'invoices', 'employees'];
    for (const entity of entities) {
      const rows = db.dbManager.getDb().prepare(
        `SELECT * FROM ${entity} WHERE business_id = ? AND updated_at > ?`
      ).all(businessId, lastSyncTimestamp) as any[];
      for (const row of rows) {
        changes.push({ entity: entity.slice(0, -1), action: 'update', data: row, timestamp: row.updated_at });
      }
    }
    const newTimestamp = now();
    return { changes, newTimestamp };
  }

  static async push(businessId: string, changes: any[]): Promise<{ accepted: boolean; conflicts: any[] }> {
    const db = DatabaseService.getInstance();
    const conflicts: any[] = [];
    for (const change of changes) {
      try {
        const queueEntry = {
          id: generateId(),
          businessId,
          entity: change.entity,
          entityId: change.data.id || generateId(),
          action: change.action,
          data: JSON.stringify(change.data),
          timestamp: change.timestamp || now(),
          synced: 1,
        };
        db.syncQueue.create(queueEntry);
      } catch (err: any) {
        conflicts.push({ entity: change.entity, localVersion: null, remoteVersion: change.data, error: err.message });
      }
    }
    return { accepted: conflicts.length === 0, conflicts };
  }

  static queueChange(businessId: string, entity: string, entityId: string, action: string, data: any): void {
    const db = DatabaseService.getInstance();
    db.syncQueue.create({
      id: generateId(),
      businessId,
      entity,
      entityId,
      action: action as any,
      data: JSON.stringify(data),
      timestamp: now(),
      synced: 0,
    });
  }

  static processQueue(businessId: string): void {
    const db = DatabaseService.getInstance();
    const queue = db.syncQueue.findByBusinessId(businessId, 0);
    for (const item of queue) {
      try {
        db.syncQueue.markSynced(item.id);
      } catch (err) {
        console.error('Failed to process sync queue item:', item.id, err);
      }
    }
  }
}
