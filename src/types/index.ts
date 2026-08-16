export interface BusinessSettings {
  id: string;
  businessName: string;
  phone: string;
  address: string;
  logo?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  createdAt: number;
}

export interface QuotationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: 'Pending' | 'Accepted';
  createdAt: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: 'Issued' | 'Paid';
  createdAt: number;
}

export type Page = 'home' | 'quotations' | 'invoices' | 'customers' | 'settings' | 'new-quotation' | 'quotation-view' | 'new-invoice' | 'invoice-view' | 'customer-view';
