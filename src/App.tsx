import { useState, useEffect } from 'react';
import { StorageService } from './services';
import { Page } from './types';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Quotations from './pages/Quotations';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import NewQuotation from './pages/NewQuotation';
import QuotationView from './pages/QuotationView';
import InvoiceView from './pages/InvoiceView';
import CustomerView from './pages/CustomerView';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [businessConfigured, setBusinessConfigured] = useState(false);

  useEffect(() => {
    const settings = StorageService.getBusinessSettings();
    if (!settings) {
      StorageService.initializeBusinessSettings();
      setCurrentPage('settings');
    } else if (settings.businessName && settings.phone) {
      setBusinessConfigured(true);
    } else {
      setCurrentPage('settings');
    }
  }, []);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setSelectedQuotationId(null);
    setSelectedInvoiceId(null);
    setSelectedCustomerId(null);
  };

  const handleViewQuotation = (id: string) => {
    setSelectedQuotationId(id);
    setCurrentPage('quotation-view');
  };

  const handleViewInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setCurrentPage('invoice-view');
  };

  const handleViewCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentPage('customer-view');
  };

  const handleNewQuotation = () => {
    setCurrentPage('new-quotation');
  };

  const handleQuotationCreated = () => {
    setCurrentPage('quotations');
  };

  const handleConvertToInvoice = (quotationId: string) => {
    setCurrentPage('new-invoice');
    setSelectedQuotationId(quotationId);
  };

  const handleInvoiceCreated = () => {
    setCurrentPage('invoices');
  };

  const handleSettingsSaved = () => {
    setBusinessConfigured(true);
    setCurrentPage('home');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex-1 pb-20 md:pb-0">
        {currentPage === 'home' && businessConfigured && (
          <Home onNewQuotation={handleNewQuotation} />
        )}
        {currentPage === 'quotations' && (
          <Quotations
            onNewQuotation={handleNewQuotation}
            onViewQuotation={handleViewQuotation}
          />
        )}
        {currentPage === 'invoices' && (
          <Invoices onViewInvoice={handleViewInvoice} />
        )}
        {currentPage === 'customers' && (
          <Customers onViewCustomer={handleViewCustomer} />
        )}
        {currentPage === 'settings' && (
          <Settings onSaved={handleSettingsSaved} />
        )}
        {currentPage === 'new-quotation' && (
          <NewQuotation
            onCreated={handleQuotationCreated}
            onCancel={() => handleNavigation('quotations')}
          />
        )}
        {currentPage === 'quotation-view' && selectedQuotationId && (
          <QuotationView
            quotationId={selectedQuotationId}
            onEdit={() => handleNavigation('new-quotation')}
            onConvertToInvoice={handleConvertToInvoice}
            onBack={() => handleNavigation('quotations')}
          />
        )}
        {currentPage === 'new-invoice' && selectedQuotationId && (
          <InvoiceView
            quotationId={selectedQuotationId}
            onCreated={handleInvoiceCreated}
            onCancel={() => handleNavigation('quotations')}
            isNew
          />
        )}
        {currentPage === 'invoice-view' && selectedInvoiceId && (
          <InvoiceView
            invoiceId={selectedInvoiceId}
            onCreated={handleInvoiceCreated}
            onCancel={() => handleNavigation('invoices')}
            isNew={false}
          />
        )}
        {currentPage === 'customer-view' && selectedCustomerId && (
          <CustomerView
            customerId={selectedCustomerId}
            onBack={() => handleNavigation('customers')}
          />
        )}
      </div>

      <BottomNav currentPage={currentPage} onNavigate={handleNavigation} />
    </div>
  );
}

export default App;
