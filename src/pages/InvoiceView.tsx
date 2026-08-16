import { useState, useEffect } from 'react';
import { StorageService, CalculationService, FormatService } from '../services';
import { Invoice, Quotation } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { MessageCircle, Printer } from 'lucide-react';

interface InvoiceViewProps {
  quotationId?: string;
  invoiceId?: string;
  onCreated: () => void;
  onCancel: () => void;
  isNew: boolean;
}

function InvoiceView({ quotationId, invoiceId, onCreated, onCancel, isNew }: InvoiceViewProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [amountPaidInput, setAmountPaidInput] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isNew && quotationId) {
      // Create from quotation
      const quotation = StorageService.getQuotationById(quotationId);
      if (quotation) {
        const newInvoice: Invoice = {
          id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          invoiceNumber: StorageService.generateInvoiceNumber(),
          quotationId,
          customerId: quotation.customerId,
          customerName: quotation.customerName,
          phone: quotation.phone,
          location: quotation.location,
          items: quotation.items,
          subtotal: quotation.subtotal,
          discount: quotation.discount,
          delivery: quotation.delivery,
          total: quotation.total,
          amountPaid: 0,
          balance: quotation.total,
          status: 'Issued',
          createdAt: Date.now(),
        };
        setInvoice(newInvoice);
      }
    } else if (!isNew && invoiceId) {
      // Load existing invoice
      const data = StorageService.getInvoiceById(invoiceId);
      if (data) {
        setInvoice(data);
        setAmountPaidInput(data.amountPaid);
      }
    }
  }, [quotationId, invoiceId, isNew]);

  const handleSaveNew = () => {
    if (!invoice) return;
    StorageService.saveInvoice(invoice);
    onCreated();
  };

  const handleRecordPayment = () => {
    if (!invoice) return;

    const newErrors: string[] = [];

    if (amountPaidInput < 0) {
      newErrors.push('Kiasi haiwezi kuwa hasi');
    }
    if (amountPaidInput > invoice.total) {
      newErrors.push('Kiasi haiwezi kuwa zaidi ya jumla');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const balance = CalculationService.calculateBalance(invoice.total, amountPaidInput);
    const updated: Invoice = {
      ...invoice,
      amountPaid: amountPaidInput,
      balance,
      status: balance === 0 ? 'Paid' : 'Issued',
    };

    StorageService.saveInvoice(updated);
    setInvoice(updated);
    setErrors([]);
  };

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto">
        <Header title="Ankara" onBack={onCancel} />
        <div className="p-4">
          <Card className="text-center py-8">
            <p className="text-gray-600">Ankara haijapata...</p>
          </Card>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const business = StorageService.getBusinessSettings();
    const message = `Habari ${invoice.customerName},\n\nHii ni ankara yako kutoka ${business?.businessName || 'Furniture Workshop'}.\n\nAnkara: ${invoice.invoiceNumber}\nJumla: ${FormatService.formatCurrency(invoice.total)}\nKilicholipwa: ${FormatService.formatCurrency(invoice.amountPaid)}\nSalio: ${FormatService.formatCurrency(invoice.balance)}\n\nAsante kwa biashara yako.`;
    const encodedMessage = encodeURIComponent(message);
    const phone = invoice.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header title={invoice.invoiceNumber} onBack={onCancel} />

      <div className="p-4 space-y-4 pb-8">
        {/* Print View */}
        <div className="print-only bg-white p-8 space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {StorageService.getBusinessSettings()?.businessName}
              </h1>
              <p className="text-gray-600">{StorageService.getBusinessSettings()?.phone}</p>
              <p className="text-gray-600">{StorageService.getBusinessSettings()?.address}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
          </div>

          {/* Doc Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice No.</p>
              <p className="font-bold text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tarehe</p>
              <p className="font-bold text-gray-900">{FormatService.formatDate(invoice.createdAt)}</p>
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-sm font-bold text-gray-600 mb-2">CUSTOMER</p>
            <p className="font-bold text-gray-900">{invoice.customerName}</p>
            <p className="text-gray-600">{invoice.phone}</p>
            <p className="text-gray-600">{invoice.location}</p>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">Kitu</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">Maelezo</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-bold">Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-bold">Bei</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-bold">Jumla</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-3 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{item.quantity}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">{FormatService.formatCurrency(item.unitPrice)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-bold">{FormatService.formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto w-64">
            <div className="flex justify-between border-b pb-2">
              <span>Jumla Ndogo</span>
              <span className="font-bold">{FormatService.formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Punguzo</span>
              <span className="font-bold">{FormatService.formatCurrency(invoice.discount)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Usafirishaji</span>
              <span className="font-bold">{FormatService.formatCurrency(invoice.delivery)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>JUMLA</span>
              <span>{FormatService.formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Kilicholipwa</span>
              <span className="font-bold text-lg">{FormatService.formatCurrency(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Salio</span>
              <span>{FormatService.formatCurrency(invoice.balance)}</span>
            </div>
          </div>
        </div>

        {/* Screen View */}
        <div className="no-print space-y-4">
          {errors.length > 0 && (
            <Card className="bg-error/10 border-error">
              <ul className="list-disc list-inside text-error text-sm space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase">Invoice No.</p>
                <p className="font-bold text-lg text-gray-900">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase">Tarehe</p>
                <p className="font-bold text-lg text-gray-900">{FormatService.formatDate(invoice.createdAt)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-bold text-gray-600 mb-2">CUSTOMER</p>
            <p className="font-bold text-gray-900">{invoice.customerName}</p>
            <p className="text-sm text-gray-600">{invoice.phone}</p>
            <p className="text-sm text-gray-600">{invoice.location}</p>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-900 mb-3">Vitu</h3>
            <div className="space-y-3">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm pb-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.quantity} x {FormatService.formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">{FormatService.formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumla Ndogo</span>
                <span className="font-bold text-gray-900">{FormatService.formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Punguzo</span>
                <span className="font-bold text-gray-900">-{FormatService.formatCurrency(invoice.discount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usafirishaji</span>
                <span className="font-bold text-gray-900">+{FormatService.formatCurrency(invoice.delivery)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">JUMLA</span>
                <span className="font-bold text-lg text-accent">{FormatService.formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </Card>

          {/* Payment Section */}
          <Card>
            <h3 className="font-bold text-gray-900 mb-4">Malipo</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kiasi Kilicholipwa
                </label>
                <input
                  type="number"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  min="0"
                  max={invoice.total}
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Jumla</span>
                  <span className="font-bold text-gray-900">{FormatService.formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Salio</span>
                  <span className={CalculationService.calculateBalance(invoice.total, amountPaidInput) === 0 ? 'text-success' : 'text-error'}>
                    {FormatService.formatCurrency(CalculationService.calculateBalance(invoice.total, amountPaidInput))}
                  </span>
                </div>
              </div>

              <Button fullWidth onClick={handleRecordPayment}>
                Rekodi Malipo
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-sm">
              <p><span className="font-bold text-gray-900">Status:</span> <span className={invoice.balance > 0 ? 'text-warning' : 'text-success'}>{invoice.status === 'Paid' ? 'Imelihua' : 'Inaeleana'}</span></p>
              <p className="mt-2"><span className="font-bold text-gray-900">Kilicholipwa:</span> {FormatService.formatCurrency(invoice.amountPaid)}</p>
              <p><span className="font-bold text-gray-900">Salio:</span> {FormatService.formatCurrency(invoice.balance)}</p>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {isNew && (
              <Button fullWidth onClick={handleSaveNew}>
                Hifadhi Ankara
              </Button>
            )}
            <Button fullWidth onClick={handlePrint} className="flex items-center justify-center gap-2">
              <Printer size={18} />
              Chapisha / Hifadhi kama PDF
            </Button>
            <Button fullWidth variant="secondary" onClick={handleWhatsApp} className="flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Tuma WhatsApp
            </Button>
            {isNew && (
              <Button fullWidth variant="secondary" onClick={onCancel}>
                Ghairi
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
