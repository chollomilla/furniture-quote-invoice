import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Customer } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import { Search } from 'lucide-react';

interface CustomersProps {
  onViewCustomer: (id: string) => void;
}

function Customers({ onViewCustomer }: CustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = StorageService.getCustomers();
    const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
    setCustomers(sorted);
    setFilteredCustomers(sorted);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Wateja" />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tafuta mteja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* List */}
        {filteredCustomers.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-600">Wateja wataonekana hapa baada ya quotation ya kwanza.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map((c) => (
              <Card
                key={c.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewCustomer(c.id)}
              >
                <div>
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.phone}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.location}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
