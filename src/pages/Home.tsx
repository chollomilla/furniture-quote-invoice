import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Quotation, Invoice } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus } from 'lucide-react';

interface HomeProps {
  onNewQuotation: () => void;
}

function Home({ onNewQuotation }: HomeProps) {
  const [businessName, setBusinessName] = useState('');
  const [stats, setStats] = useState({ totalQuotations: 0, pendingQuotations: 0, totalInvoices: 0, outstandingBalance: 0 });
  const [recentItems, setRecentItems] = useState<(Quotation | Invoice)[]>([]);

  useEffect(() => {
    const settings = StorageService.getBusinessSettings();
    if (settings) {
      setBusinessName(settings.businessName);
    }

    const newStats = StorageService.getStatistics();
    setStats(newStats);

    const quotations = StorageService.getQuotations();
    const invoices = StorageService.getInvoices();
    const all = [...quotations, ...invoices].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    setRecentItems(all);
  }, []);

  const isQuotation = (item: any): item is Quotation => 'quotationNumber' in item;

  return (
    <div className="max-w-4xl mx-auto">
      <Header title={businessName || 'Karibu'} subtitle="Dashboard" />

      <div className="p-4 space-y-6">
        {/* Quick Action */}
        <Button
          size="lg"
          fullWidth
          onClick={onNewQuotation}
          className="flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Nukuu Mpya
        </Button>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <div className="text-3xl font-bold text-accent">{stats.totalQuotations}</div>
            <div className="text-xs text-gray-600 mt-1">Jumla ya Nukuu</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-warning">{stats.pendingQuotations}</div>
            <div className="text-xs text-gray-600 mt-1">Nukuu Zinazoelea</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</div>
            <div className="text-xs text-gray-600 mt-1">Jumla ya Ankara</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-error">{FormatService.formatCurrency(stats.outstandingBalance)}</div>
            <div className="text-xs text-gray-600 mt-1">Salio Lisilolipwa</div>
          </Card>
        </div>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Karibuni</h2>
            <div className="space-y-2">
              {recentItems.map((item) => (
                <Card key={item.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {isQuotation(item) ? item.quotationNumber : item.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-600">{item.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{FormatService.formatCurrency(item.total)}</div>
                    <div className="text-xs text-gray-500">
                      {isQuotation(item) ? (
                        <span className={item.status === 'Pending' ? 'text-warning' : 'text-success'}>
                          {item.status === 'Pending' ? 'Inaeleana' : 'Ikubaliwa'}
                        </span>
                      ) : (
                        <span className={item.balance > 0 ? 'text-warning' : 'text-success'}>
                          {item.balance > 0 ? `Salio: ${FormatService.formatCurrency(item.balance)}` : 'Imelihua'}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
