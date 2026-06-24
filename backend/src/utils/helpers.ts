import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function now(): number {
  return Date.now();
}

export function sanitizeHtml(input: string): string {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function parsePagination(query: any): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

export function calculateRunningBalance(transactions: { type: string; amount: number }[]): number[] {
  let balance = 0;
  return transactions.map(tx => {
    balance += tx.type === 'CREDIT' ? tx.amount : -tx.amount;
    return balance;
  });
}
