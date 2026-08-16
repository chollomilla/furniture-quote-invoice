import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Customer, Quotation, Invoice } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';

interface CustomerViewProps {
  customerId: string;
  onBack: () => void;
}

function CustomerView({ customerId, onBack }: CustomerViewProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const cust = StorageService.getCustomerById(customerId);
    if (cust) {
      setCustomer(cust);

      // Get quotations for this customer
      const allQuotations = StorageService.getQuotations();
      const custQuotations = allQuotations.filter(q => q.customerId === customerId);
      setQuotations(custQuotations);

      // Get invoices for this customer
      const allInvoices = StorageService.getInvoices();
      const custInvoices = allInvoices.filter(inv => inv.customerId === customerId);
      setInvoices(custInvoices);

      // Calculate total balance
      const totalBalance = custInvoices.reduce((sum, inv) => sum + inv.balance, 0);
      setBalance(totalBalance);
    }
  }, [customerId]);

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto">
        <Header title="Mteja" onBack={onBack} />
        <div className="p-4">
          <Card className="text-center py-8">
            <p className="text-gray-600">Mteja haijapata...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Header title={customer.name} subtitle="Habari ya Mteja" onBack={onBack} />

      <div className="p-4 space-y-4 pb-8">
        {/* Customer Info */}
        <Card>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium">Jina</p>
              <p className="font-bold text-lg text-gray-900">{customer.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium">Namba ya Simu</p>
              <p className="font-bold text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium">Mahali</p>
              <p className="font-bold text-gray-900">{customer.location}</p>
            </div>
          </div>
        </Card>

        {/* Balance Summary */}
        <Card className="bg-blue-50 border-accent">
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase font-medium">Salio Lisilolipwa</p>
            <p className="font-bold text-2xl text-accent mt-1">{FormatService.formatCurrency(balance)}</p>
            <p className="text-xs text-gray-600 mt-2">
              Jumla ya ankara: {invoices.length}
            </p>
          </div>
        </Card>

        {/* Quotations */}
        {quotations.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Nukuu ({quotations.length})</h3>
            <div className="space-y-2">
              {quotations.map((q) => (
                <Card key={q.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{q.quotationNumber}</p>
                      <p className="text-xs text-gray-600 mt-1">{FormatService.formatDate(q.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{FormatService.formatCurrency(q.total)}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        q.status === 'Pending' ? 'text-warning' : 'text-success'
                      }`}>
                        {q.status === 'Pending' ? 'Inaeleana' : 'Ikubaliwa'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Invoices */}
        {invoices.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Ankara ({invoices.length})</h3>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <Card key={inv.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{inv.invoiceNumber}</p>
                      <p className="text-xs text-gray-600 mt-1">{FormatService.formatDate(inv.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{FormatService.formatCurrency(inv.total)}</p>
                      <p className="text-xs text-gray-600 mt-1">Kilicholipwa: {FormatService.formatCurrency(inv.amountPaid)}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        inv.balance > 0 ? 'text-warning' : 'text-success'
                      }`}>
                        {inv.balance > 0 ? `Salio: ${FormatService.formatCurrency(inv.balance)}` : 'Imelihua'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {quotations.length === 0 && invoices.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-gray-600">Hakuna nukuu au ankara kwa mteja huyu.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default CustomerView;
