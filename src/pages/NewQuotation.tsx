import { useState } from 'react';
import { StorageService, CalculationService, FormatService } from '../services';
import { Quotation, QuotationItem } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Trash2 } from 'lucide-react';

interface NewQuotationProps {
  onCreated: () => void;
  onCancel: () => void;
}

function NewQuotation({ onCreated, onCancel }: NewQuotationProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const addItem = () => {
    const newItem: QuotationItem = {
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.amount = CalculationService.calculateItemAmount(
              updated.quantity,
              updated.unitPrice
            );
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = CalculationService.calculateSubtotal(items);
  const total = CalculationService.calculateTotal(subtotal, discount, delivery);

  const validateAndSave = () => {
    const newErrors: string[] = [];

    if (!customerName.trim()) {
      newErrors.push('Jina la mteja ni muhimu');
    }
    if (items.length === 0) {
      newErrors.push('Ongeza angalau item moja');
    }
    items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors.push(`Item ${index + 1}: Jina ni muhimu`);
      }
      if (item.quantity <= 0) {
        newErrors.push(`Item ${index + 1}: Kiasi lazima kiwe kubwa kuliko 0`);
      }
      if (item.unitPrice < 0) {
        newErrors.push(`Item ${index + 1}: Bei haiwezi kuwa hasi`);
      }
    });
    if (discount < 0) {
      newErrors.push('Punguzo haiwezi kuwa hasi');
    }
    if (delivery < 0) {
      newErrors.push('Usafirishaji haiwezi kuwa hasi');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create customer
    const customer = StorageService.getOrCreateCustomer(
      customerName,
      customerPhone,
      customerLocation
    );

    // Create quotation
    const quotation: Quotation = {
      id: `quot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quotationNumber: StorageService.generateQuotationNumber(),
      customerId: customer.id,
      customerName,
      phone: customerPhone,
      location: customerLocation,
      items,
      subtotal,
      discount,
      delivery,
      total,
      status: 'Pending',
      createdAt: Date.now(),
    };

    StorageService.saveQuotation(quotation);
    onCreated();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Nukuu Mpya" onBack={onCancel} />

      <div className="p-4 space-y-4 pb-8">
        {/* Errors */}
        {errors.length > 0 && (
          <Card className="bg-error/10 border-error">
            <ul className="list-disc list-inside text-error text-sm space-y-1">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Customer Info */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Habari ya Mteja</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jina la Mteja *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="John Mwaka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Namba ya Simu
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="+255 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mahali
              </label>
              <input
                type="text"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Dar es Salaam"
              />
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Vitu</h2>
            <Button size="sm" onClick={addItem} className="flex items-center gap-2">
              <Plus size={16} />
              Ongeza
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Hakuna vitu vilivyoongezwa</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Kitu {index + 1}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-error hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Jina la Kitu *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                        placeholder="Sofa ya watu 3"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Maelezo
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                        placeholder="2.4m, grey fabric"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Kiasi *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Bei *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Jumla
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                          {FormatService.formatCurrency(item.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Totals */}
        <Card>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Jumla Ndogo</span>
              <span className="font-semibold text-gray-900">{FormatService.formatCurrency(subtotal)}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Punguzo
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Usafirishaji
              </label>
              <input
                type="number"
                value={delivery}
                onChange={(e) => setDelivery(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                min="0"
              />
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Jumla</span>
              <span className="font-bold text-lg text-accent">{FormatService.formatCurrency(total)}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Ghairi
          </Button>
          <Button fullWidth onClick={validateAndSave}>
            Hifadhi & Angalia
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewQuotation;
