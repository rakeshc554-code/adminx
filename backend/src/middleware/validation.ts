import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

const phoneRegex = /^\+?[1-9]\d{9,14}$/;
const idRegex = /^[0-9a-f-]{36}$/;

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  password: z.string().min(6).max(128),
  businessName: z.string().min(2).max(200),
});

export const loginSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  password: z.string().min(1),
}).refine(data => data.email || data.phone, { message: 'Email or phone required' });

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['CREDIT', 'DEBIT']),
  description: z.string().max(500).optional().or(z.literal('')),
  date: z.number().optional(),
  invoiceId: z.string().uuid().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().max(100).optional().or(z.literal('')),
  barcode: z.string().max(100).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().min(0).optional().default(0),
  quantity: z.number().int().min(0).optional().default(0),
  reorderLevel: z.number().int().min(0).optional().default(0),
  expiryDate: z.number().optional().nullable(),
  batchNumber: z.string().max(100).optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export const invoiceItemSchema = z.object({
  productId: z.string().optional().or(z.literal('')),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  gst: z.number().min(0).max(100).default(18),
  total: z.number().positive(),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item required'),
  dueDate: z.number().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  status: z.enum(['DRAFT', 'SENT']).optional().default('DRAFT'),
});

export const createEmployeeSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  phone: z.string().regex(phoneRegex).optional().or(z.literal('')),
  email: z.string().email().optional().nullable(),
  salary: z.number().min(0).optional().default(0),
});

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  date: z.number().optional(),
  paymentMethod: z.string().max(50).optional().default('cash'),
});

export const syncPushSchema = z.object({
  changes: z.array(z.object({
    entity: z.enum(['customer', 'product', 'transaction', 'invoice', 'employee']),
    action: z.enum(['create', 'update', 'delete']),
    data: z.record(z.any()),
    timestamp: z.number(),
  })),
});

export const syncPullSchema = z.object({
  lastSyncTimestamp: z.number(),
});

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
        timestamp: Date.now(),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
