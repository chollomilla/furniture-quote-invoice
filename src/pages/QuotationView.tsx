import { useState, useEffect } from 'react';
import { StorageService, FormatService } from '../services';
import { Quotation } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { MessageCircle, Printer } from 'lucide-react';

interface QuotationViewProps {
  quotationId: string;
  onEdit: () => void;
  onConvertToInvoice: (id: string) => void;
  onBack: () => void;
}

function QuotationView({ quotationId, onEdit, onConvertToInvoice, onBack }: QuotationViewProps) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    const data = StorageService.getQuotationById(quotationId);
    if (data) {
      setQuotation(data);
    }
  }, [quotationId]);

  if (!quotation) {
    return (
      <div className="max-w-4xl mx-auto">
        <Header title="Nukuu" onBack={onBack} />
        <div className="p-4">
          <Card className="text-center py-8">
            <p className="text-gray-600">Nukuu haijapata...</p>
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
    const message = `Habari ${quotation.customerName},\n\nHii ni quotation yako kutoka ${business?.businessName || 'Furniture Workshop'}.\n\nQuotation: ${quotation.quotationNumber}\nJumla: ${FormatService.formatCurrency(quotation.total)}\n\nAsante kwa biashara yako.`;
    const encodedMessage = encodeURIComponent(message);
    const phone = quotation.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleConvert = () => {
    // Update quotation status to Accepted
    const updated = { ...quotation, status: 'Accepted' as const };
    StorageService.saveQuotation(updated);
    onConvertToInvoice(quotationId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header title={quotation.quotationNumber} onBack={onBack} />

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
            <h2 className="text-3xl font-bold text-gray-900">QUOTATION</h2>
          </div>

          {/* Doc Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Quotation No.</p>
              <p className="font-bold text-gray-900">{quotation.quotationNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tarehe</p>
              <p className="font-bold text-gray-900">{FormatService.formatDate(quotation.createdAt)}</p>
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-sm font-bold text-gray-600 mb-2">CUSTOMER</p>
            <p className="font-bold text-gray-900">{quotation.customerName}</p>
            <p className="text-gray-600">{quotation.phone}</p>
            <p className="text-gray-600">{quotation.location}</p>
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
                {quotation.items.map((item) => (
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
              <span className="font-bold">{FormatService.formatCurrency(quotation.subtotal)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Punguzo</span>
              <span className="font-bold">{FormatService.formatCurrency(quotation.discount)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Usafirishaji</span>
              <span className="font-bold">{FormatService.formatCurrency(quotation.delivery)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>JUMLA</span>
              <span>{FormatService.formatCurrency(quotation.total)}</span>
            </div>
          </div>

          {/* Terms */}
          <div className="border-t pt-4 text-xs text-gray-600">
            <p className="font-bold mb-2">SHARTHI:</p>
            <p>- Quotation hii ni halali kwa siku 7</p>
            <p>- Malipo: 50% mwanzo, 50% baada ya kumalizia</p>
          </div>
        </div>

        {/* Screen View */}
        <div className="no-print space-y-4">
          <Card>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase">Quotation No.</p>
                <p className="font-bold text-lg text-gray-900">{quotation.quotationNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase">Tarehe</p>
                <p className="font-bold text-lg text-gray-900">{FormatService.formatDate(quotation.createdAt)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-bold text-gray-600 mb-2">CUSTOMER</p>
            <p className="font-bold text-gray-900">{quotation.customerName}</p>
            <p className="text-sm text-gray-600">{quotation.phone}</p>
            <p className="text-sm text-gray-600">{quotation.location}</p>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-900 mb-3">Vitu</h3>
            <div className="space-y-3">
              {quotation.items.map((item) => (
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
                <span className="font-bold text-gray-900">{FormatService.formatCurrency(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Punguzo</span>
                <span className="font-bold text-gray-900">-{FormatService.formatCurrency(quotation.discount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usafirishaji</span>
                <span className="font-bold text-gray-900">+{FormatService.formatCurrency(quotation.delivery)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">JUMLA</span>
                <span className="font-bold text-lg text-accent">{FormatService.formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-xs text-gray-600 space-y-2">
              <p><span className="font-bold">Status:</span> {quotation.status === 'Pending' ? 'Inaeleana' : 'Ikubaliwa'}</p>
              <p><span className="font-bold">Halali kwa:</span> Siku 7</p>
              <p><span className="font-bold">Malipo:</span> 50% mwanzo, 50% baada ya kumalizia</p>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button fullWidth onClick={handlePrint} className="flex items-center justify-center gap-2">
              <Printer size={18} />
              Chapisha / Hifadhi kama PDF
            </Button>
            <Button fullWidth variant="secondary" onClick={handleWhatsApp} className="flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Tuma WhatsApp
            </Button>
            {quotation.status === 'Pending' && (
              <Button fullWidth variant="secondary" onClick={handleConvert}>
                Badilisha kuwa Ankara
              </Button>
            )}
            <Button fullWidth variant="secondary" onClick={onEdit}>
              Badilisha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuotationView;
