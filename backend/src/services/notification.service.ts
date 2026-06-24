export class NotificationService {
  static async sendWhatsApp(recipient: string, message: string): Promise<{ success: boolean; messageId?: string }> {
    const apiToken = process.env.WHATSAPP_API_TOKEN;
    if (!apiToken) {
      console.log(`[WhatsApp Mock] To: ${recipient}, Message: ${message}`);
      return { success: true, messageId: `mock-${Date.now()}` };
    }
    try {
      const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: recipient, text: { body: message } }),
      });
      const data = await response.json();
      return { success: response.ok, messageId: data.messages?.[0]?.id };
    } catch (err: any) {
      console.error('WhatsApp send failed:', err.message);
      return { success: false };
    }
  }

  static async sendSMS(recipient: string, message: string): Promise<{ success: boolean; messageId?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      console.log(`[SMS Mock] To: ${recipient}, Message: ${message}`);
      return { success: true, messageId: `mock-${Date.now()}` };
    }
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: recipient, From: process.env.TWILIO_PHONE || '+1234567890', Body: message }),
      });
      const data = await response.json();
      return { success: response.ok, messageId: data.sid };
    } catch (err: any) {
      console.error('SMS send failed:', err.message);
      return { success: false };
    }
  }

  static async sendPaymentReminder(customer: { name: string; phone: string; balance: number }, business: { name: string }): Promise<any> {
    const message = `Dear ${customer.name}, this is a reminder from ${business.name}. Your outstanding balance of ₹${customer.balance.toFixed(2)} is due. Please pay at your earliest convenience. Thank you!`;
    const channel = customer.phone.startsWith('+91') ? 'whatsapp' : 'sms';
    if (channel === 'whatsapp') {
      return this.sendWhatsApp(customer.phone, message);
    }
    return this.sendSMS(customer.phone, message);
  }

  static async sendInvoice(recipient: string, channel: string, invoiceNumber: string, total: number): Promise<any> {
    const message = `Your invoice ${invoiceNumber} for ₹${total.toFixed(2)} has been generated. Thank you for your business!`;
    if (channel === 'whatsapp') return this.sendWhatsApp(recipient, message);
    if (channel === 'sms') return this.sendSMS(recipient, message);
    console.log(`[Email Mock] To: ${recipient}, Invoice: ${invoiceNumber}, Total: ${total}`);
    return { success: true };
  }
}
