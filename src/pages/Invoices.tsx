import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Invoice } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import { Search } from 'lucide-react';

interface InvoicesProps {
  onViewInvoice: (id: string) => void;
}

function Invoices({ onViewInvoice }: InvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = StorageService.getInvoices();
    const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
    setInvoices(sorted);
    setFilteredInvoices(sorted);
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Ankara" />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tafuta ankara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* List */}
        {filteredInvoices.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-600">Bado hujatengeneza ankara.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredInvoices.map((inv) => (
              <Card
                key={inv.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewInvoice(inv.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{inv.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">{inv.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">{FormatService.formatDate(inv.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{FormatService.formatCurrency(inv.total)}</div>
                    <div className="text-xs text-gray-600 mt-1">Kilicholipwa: {FormatService.formatCurrency(inv.amountPaid)}</div>
                    <div
                      className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        inv.balance > 0
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {inv.balance > 0 ? `Salio: ${FormatService.formatCurrency(inv.balance)}` : 'Imelihua'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Invoices;
