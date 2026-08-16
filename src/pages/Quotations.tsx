import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Quotation } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Search } from 'lucide-react';

interface QuotationsProps {
  onNewQuotation: () => void;
  onViewQuotation: (id: string) => void;
}

function Quotations({ onNewQuotation, onViewQuotation }: QuotationsProps) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = StorageService.getQuotations();
    const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
    setQuotations(sorted);
    setFilteredQuotations(sorted);
  }, []);

  useEffect(() => {
    const filtered = quotations.filter(
      (q) =>
        q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuotations(filtered);
  }, [searchTerm, quotations]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Nukuu" />

      <div className="p-4 space-y-4">
        <Button size="lg" fullWidth onClick={onNewQuotation} className="flex items-center justify-center gap-2">
          <Plus size={20} />
          Nukuu Mpya
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tafuta nukuu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* List */}
        {filteredQuotations.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-600">Bado hujatengeneza quotation.</p>
            <Button size="sm" onClick={onNewQuotation} className="mt-4">
              Anza Sasa
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredQuotations.map((q) => (
              <Card
                key={q.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewQuotation(q.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{q.quotationNumber}</div>
                    <div className="text-sm text-gray-600">{q.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">{FormatService.formatDate(q.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{FormatService.formatCurrency(q.total)}</div>
                    <div
                      className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        q.status === 'Pending'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {q.status === 'Pending' ? 'Inaeleana' : 'Ikubaliwa'}
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

export default Quotations;
