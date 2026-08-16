export class FormatService {
  static formatCurrency(amount: number): string {
    return `TZS ${Math.round(amount).toLocaleString('en-US')}`;
  }

  static formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('sw-TZ');
  }

  static formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('sw-TZ');
  }

  static formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as Tanzanian phone number if needed
    return cleaned;
  }
}
