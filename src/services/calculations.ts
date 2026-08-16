import { QuotationItem } from '../types';

export class CalculationService {
  static calculateItemAmount(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  static calculateSubtotal(items: QuotationItem[]): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  static calculateTotal(subtotal: number, discount: number, delivery: number): number {
    return subtotal - discount + delivery;
  }

  static calculateBalance(total: number, amountPaid: number): number {
    const balance = total - amountPaid;
    return balance < 0 ? 0 : balance;
  }
}
