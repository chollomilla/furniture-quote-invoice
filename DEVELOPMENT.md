# Development Guide

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173

## Code Style

- Use TypeScript for all files
- Components in `/pages` and `/components`
- Services in `/services`
- Types in `/types`
- Tailwind CSS for styling (no CSS files)

## Adding a New Page

1. Create file in `src/pages/NewPage.tsx`
2. Add TypeScript interface for props
3. Import in `App.tsx`
4. Add to navigation state
5. Add route handling

## Adding a Service

1. Create file in `src/services/newService.ts`
2. Export from `src/services/index.ts`
3. Use in components via import

## Working with LocalStorage

All data persists in browser LocalStorage. Keys start with `fqi_`:

```typescript
import { StorageService } from '../services';

// Get all quotations
const quotations = StorageService.getQuotations();

// Save a quotation
StorageService.saveQuotation(quotation);

// Get statistics
const stats = StorageService.getStatistics();
```

## Calculations

Use `CalculationService` for all math:

```typescript
import { CalculationService } from '../services';

// Calculate item amount
const amount = CalculationService.calculateItemAmount(quantity, unitPrice);

// Calculate subtotal
const subtotal = CalculationService.calculateSubtotal(items);

// Calculate total
const total = CalculationService.calculateTotal(subtotal, discount, delivery);

// Calculate balance
const balance = CalculationService.calculateBalance(total, amountPaid);
```

## Formatting

Use `FormatService` for currency, dates, and numbers:

```typescript
import { FormatService } from '../services';

// Format currency
FormatService.formatCurrency(1000000); // "TZS 1,000,000"

// Format date
FormatService.formatDate(timestamp); // "1/1/2026"

// Format phone
FormatService.formatPhoneNumber('+255712345678'); // "255712345678"
```

## Component Patterns

### Page Component
```typescript
interface PageProps {
  onNavigate?: () => void;
}

function Page({ onNavigate }: PageProps) {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    const loaded = StorageService.getData();
    setData(loaded);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Page Title" />
      {/* Content */}
    </div>
  );
}

export default Page;
```

### Using Button Component
```typescript
<Button onClick={handleClick}>Click Me</Button>
<Button variant="secondary" fullWidth>Full Width</Button>
<Button size="sm">Small</Button>
<Button variant="danger">Delete</Button>
```

### Using Card Component
```typescript
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

## Print Styling

Use `.print-only` and `.no-print` classes:

```tsx
<div className="no-print">
  {/* This is hidden when printing */}
</div>

<div className="print-only">
  {/* This is only shown when printing */}
</div>
```

## Validation

Always validate in the handler, show errors in a Card:

```typescript
const handleSubmit = () => {
  const errors: string[] = [];
  
  if (!customerName) errors.push('Name required');
  if (items.length === 0) errors.push('Add at least one item');
  
  if (errors.length > 0) {
    setErrors(errors);
    return;
  }
  
  // Process
};

return (
  <>
    {errors.length > 0 && (
      <Card className="bg-error/10 border-error">
        <ul className="list-disc list-inside text-error text-sm">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </Card>
    )}
  </>
);
```

## Working with Quotations

```typescript
import { StorageService } from '../services';
import { Quotation } from '../types';

// Create quotation
const quotation: Quotation = {
  id: `quot_${Date.now()}`,
  quotationNumber: StorageService.generateQuotationNumber(),
  customerId: customer.id,
  customerName: customer.name,
  phone: customer.phone,
  location: customer.location,
  items: items,
  subtotal: calculateSubtotal(items),
  discount: 0,
  delivery: 0,
  total: calculateSubtotal(items),
  status: 'Pending',
  createdAt: Date.now(),
};

StorageService.saveQuotation(quotation);
```

## Working with Invoices

```typescript
import { StorageService } from '../services';
import { Invoice } from '../types';

// Create invoice from quotation
const quotation = StorageService.getQuotationById(quotationId);
const invoice: Invoice = {
  id: `inv_${Date.now()}`,
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

StorageService.saveInvoice(invoice);
```

## Testing

Manual testing checklist:

1. **Quotation Flow**
   - [ ] Create quotation
   - [ ] Add items
   - [ ] Verify calculations
   - [ ] Save and refresh
   - [ ] Verify data persists

2. **Invoice Flow**
   - [ ] Convert quotation
   - [ ] Record payment
   - [ ] Verify balance updates
   - [ ] Payment exceeds total (should error)

3. **Mobile**
   - [ ] 360px width
   - [ ] 390px width
   - [ ] 412px width
   - [ ] Touch interactions
   - [ ] Bottom nav works

4. **Print**
   - [ ] Print quotation
   - [ ] Save as PDF
   - [ ] Layout looks good

5. **WhatsApp**
   - [ ] Share message appears
   - [ ] Opens WhatsApp
   - [ ] Message formatted correctly

## Build

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Debugging

- Open DevTools (F12)
- Check Console for errors
- Inspect LocalStorage: Application → LocalStorage → localhost
- Use React DevTools for component inspection

## Performance

- Quotations/invoices sorted by date (newest first)
- Search filters done on client (no API)
- Statistics calculated on demand
- No unnecessary re-renders (useEffect dependencies)

## Mobile-First Tips

- Design for 360px first
- Use `px-4` for padding (consistent spacing)
- Buttons `py-2.5` minimum (44px height when combined)
- Labels `text-sm` for readability on small screens
- Bottom nav overlaps content (pb-20 on content)
- Grid `grid-cols-2` works well on mobile

## Accessibility

- Use semantic HTML
- All buttons have clear labels
- Form labels associated with inputs
- Color not only indicator (also text)
- Focus styles visible
- Touch targets min 44px

## Future: Supabase Migration

When ready to add backend:

1. Replace `StorageService` with Supabase client
2. Move tables to Supabase database
3. Add authentication
4. Keep same data model
5. Keep same service interface
6. Add real-time sync
7. Add multi-device support
