import { BusinessSettings, Customer, Quotation, Invoice } from '../types';

const STORAGE_KEYS = {
  BUSINESS_SETTINGS: 'fqi_business_settings',
  CUSTOMERS: 'fqi_customers',
  QUOTATIONS: 'fqi_quotations',
  INVOICES: 'fqi_invoices',
};

export class StorageService {
  // Business Settings
  static getBusinessSettings(): BusinessSettings | null {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETTINGS);
    return data ? JSON.parse(data) : null;
  }

  static saveBusinessSettings(settings: BusinessSettings): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify(settings));
  }

  static initializeBusinessSettings(): BusinessSettings {
    const defaultSettings: BusinessSettings = {
      id: 'default',
      businessName: '',
      phone: '',
      address: '',
    };
    this.saveBusinessSettings(defaultSettings);
    return defaultSettings;
  }

  // Customers
  static getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  static saveCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  static getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === id);
  }

  static getOrCreateCustomer(name: string, phone: string, location: string): Customer {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.phone === phone && c.name === name);
    if (existing) {
      return existing;
    }
    const newCustomer: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      location,
      createdAt: Date.now(),
    };
    this.saveCustomer(newCustomer);
    return newCustomer;
  }

  // Quotations
  static getQuotations(): Quotation[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveQuotation(quotation: Quotation): void {
    const quotations = this.getQuotations();
    const existingIndex = quotations.findIndex(q => q.id === quotation.id);
    if (existingIndex >= 0) {
      quotations[existingIndex] = quotation;
    } else {
      quotations.push(quotation);
    }
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }

  static getQuotationById(id: string): Quotation | undefined {
    return this.getQuotations().find(q => q.id === id);
  }

  static generateQuotationNumber(): string {
    const quotations = this.getQuotations();
    const year = new Date().getFullYear();
    const nextNumber = quotations.filter(q => q.quotationNumber.startsWith(`QT-${year}`)).length + 1;
    return `QT-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  static deleteQuotation(id: string): void {
    const quotations = this.getQuotations();
    const filtered = quotations.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(filtered));
  }

  // Invoices
  static getInvoices(): Invoice[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  }

  static saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  static getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find(inv => inv.id === id);
  }

  static generateInvoiceNumber(): string {
    const invoices = this.getInvoices();
    const year = new Date().getFullYear();
    const nextNumber = invoices.filter(inv => inv.invoiceNumber.startsWith(`INV-${year}`)).length + 1;
    return `INV-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  static deleteInvoice(id: string): void {
    const invoices = this.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(filtered));
  }

  // Statistics
  static getStatistics() {
    const quotations = this.getQuotations();
    const invoices = this.getInvoices();

    return {
      totalQuotations: quotations.length,
      pendingQuotations: quotations.filter(q => q.status === 'Pending').length,
      totalInvoices: invoices.length,
      outstandingBalance: invoices.reduce((sum, inv) => sum + inv.balance, 0),
    };
  }
}
