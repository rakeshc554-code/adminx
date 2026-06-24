export interface GstBreakdown {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
}

export class GstService {
  static calculate(amount: number, gstRate: number = 18, isInterState: boolean = false): GstBreakdown {
    const taxableAmount = Math.round((amount * 100) / (100 + gstRate) * 100) / 100;
    const totalGst = amount - taxableAmount;
    if (isInterState) {
      return { taxableAmount, cgst: 0, sgst: 0, igst: Math.round(totalGst * 100) / 100, totalGst: Math.round(totalGst * 100) / 100 };
    }
    const halfGst = Math.round((totalGst / 2) * 100) / 100;
    return { taxableAmount, cgst: halfGst, sgst: halfGst, igst: 0, totalGst: Math.round(totalGst * 100) / 100 };
  }

  static calculateInvoiceTotal(items: Array<{ price: number; quantity: number; gst: number }>): { subtotal: number; gst: number; total: number } {
    let subtotal = 0;
    let totalGst = 0;
    for (const item of items) {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      totalGst += lineTotal * item.gst / 100;
    }
    subtotal = Math.round(subtotal * 100) / 100;
    totalGst = Math.round(totalGst * 100) / 100;
    return { subtotal, gst: totalGst, total: Math.round((subtotal + totalGst) * 100) / 100 };
  }

  static generateInvoiceNumber(businessId: string, sequence: number): string {
    const year = new Date().getFullYear();
    const shortYear = year % 100;
    const seq = String(sequence).padStart(4, '0');
    return `INV-${shortYear}-${seq}`;
  }
}
