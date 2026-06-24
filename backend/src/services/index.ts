import { AIService as AIServiceImpl } from '../services/ai.service';
import { DatabaseService } from '../services/database.service';
import { NotificationService } from '../services/notification.service';
import { BackupService } from '../services/backup.service';
import { PdfService } from '../services/pdf.service';

export const AIService = AIServiceImpl;
export const NotificationServiceAPI = NotificationService;
export const BackupServiceAPI = BackupService;
export const PdfServiceAPI = PdfService;
export const DatabaseServiceAPI = DatabaseService;
