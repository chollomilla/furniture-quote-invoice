# Furniture Quote & Invoice

A mobile-first web app for furniture makers in Tanzania to create professional quotations, convert them to invoices, record payments, and track balances.

## Features

✅ **Business Settings** - Store business information (name, phone, address)
✅ **Quotations** - Create and manage quotations with multiple items
✅ **Invoices** - Convert quotations to invoices and track payments
✅ **Customers** - Automatically save customer information
✅ **Payment Tracking** - Record partial and full payments with balance calculation
✅ **PDF/Print** - Print quotations and invoices as PDF
✅ **WhatsApp Integration** - Share quotations and invoices via WhatsApp
✅ **Local Storage** - All data persists in browser (no backend needed)
✅ **PWA** - Install as app on Android home screen
✅ **Mobile-First** - Optimized for 360px, 390px, 412px screens
✅ **Swahili UI** - Complete interface in Swahili
✅ **TZS Currency** - All amounts in Tanzanian Shilling

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Storage**: Browser LocalStorage
- **Icons**: Lucide React
- **Language**: Swahili (sw-TZ)

## Project Structure

```
src/
├── pages/
│   ├── Home.tsx              # Dashboard with statistics
│   ├── Quotations.tsx        # List quotations
│   ├── Invoices.tsx          # List invoices
│   ├── Customers.tsx         # List customers
│   ├── Settings.tsx          # Business settings
│   ├── NewQuotation.tsx      # Create quotation
│   ├── QuotationView.tsx     # View/print quotation
│   ├── InvoiceView.tsx       # View/print invoice, record payment
│   └── CustomerView.tsx      # View customer details
├── components/
│   ├── BottomNav.tsx         # Mobile bottom navigation
│   ├── Button.tsx            # Reusable button component
│   ├── Card.tsx              # Reusable card component
│   └── Header.tsx            # Page header component
├── services/
│   ├── localStorage.ts       # Data persistence
│   ├── calculations.ts       # Math helpers
│   ├── format.ts             # Formatting helpers (currency, date)
│   └── index.ts              # Service exports
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles

public/
├── manifest.json             # PWA manifest
└── sw.js                     # Service worker for offline

vite.config.ts               # Vite configuration
tailwind.config.js           # Tailwind configuration
package.json                 # Dependencies
```

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/chollomilla/furniture-quote-invoice.git
cd furniture-quote-invoice

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:5173
```

## Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Usage Flow

### 1. Configure Business Settings
- Open app → Settings
- Enter business name, phone, address
- Save

### 2. Create Quotation
- Home → + Nukuu Mpya
- Enter customer name, phone, location
- Add furniture items (name, description, quantity, price)
- Add discount and delivery (optional)
- System calculates totals automatically
- Save quotation

### 3. View & Share
- View quotation details
- Print/Save as PDF
- Share via WhatsApp

### 4. Convert to Invoice
- When customer accepts: "Badilisha kuwa Ankara"
- Invoice created automatically with same details
- Quotation status changes to "Accepted"

### 5. Record Payment
- Open invoice
- Enter amount paid
- System calculates balance
- When balance = 0, status becomes "PAID"

### 6. Track Customers
- Customers tab shows all customers
- Click customer to see their quotations and invoices
- View total outstanding balance per customer

## Data Model

### BusinessSettings
```typescript
{
  id: string;
  businessName: string;
  phone: string;
  address: string;
  logo?: string;
}
```

### Customer
```typescript
{
  id: string;
  name: string;
  phone: string;
  location: string;
  createdAt: number; // timestamp
}
```

### Quotation
```typescript
{
  id: string;
  quotationNumber: string; // QT-2026-0001
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: 'Pending' | 'Accepted';
  createdAt: number;
}
```

### QuotationItem
```typescript
{
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
```

### Invoice
```typescript
{
  id: string;
  invoiceNumber: string; // INV-2026-0001
  quotationId?: string;
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: 'Issued' | 'Paid';
  createdAt: number;
}
```

## LocalStorage Keys

- `fqi_business_settings` - Business configuration
- `fqi_customers` - Customers list
- `fqi_quotations` - Quotations list
- `fqi_invoices` - Invoices list

## Mobile Optimization

The app is optimized for mobile screens:
- **360px** - Small Android phones
- **390px** - iPhone/Android mid-range
- **412px** - iPhone/Android standard
- **Desktop** - Full responsive layout

### Key Mobile Features
- Large touch targets (min 44px)
- Full-width buttons and inputs
- Sticky bottom navigation
- Minimal scrolling
- Clear typography hierarchy
- Optimized keyboard input

## PWA Installation

### Android
1. Open in Chrome/Samsung Internet
2. Tap menu → "Add to Home Screen" or "Install app"
3. App appears on home screen
4. Works offline (with cached data)

### Desktop
1. Click install icon in address bar (Chrome/Edge)
2. Or click the install prompt that appears

## Validation Rules

- ✓ Customer name required
- ✓ At least one item required per quotation
- ✓ Item name required
- ✓ Quantity must be > 0
- ✓ Prices cannot be negative
- ✓ Discount cannot be negative
- ✓ Delivery cannot be negative
- ✓ Payment cannot exceed invoice total

## Print/PDF

- Click "Chapisha / Hifadhi kama PDF"
- Browser print dialog opens
- Select "Save as PDF" to download
- Print layout hides UI elements
- Professional format for customer

## WhatsApp Integration

- Click "Tuma WhatsApp"
- Pre-formatted message with document details
- Customer phone number from quotation/invoice
- Message includes amount and document number
- Does NOT auto-send (user must confirm)

## Future Enhancements

The architecture is designed for easy Supabase migration:
- Replace `StorageService` with Supabase client
- Add user authentication
- Enable multi-user support
- Add cloud backup
- Implement real-time sync

## Swahili Terms

- **Nyumbani** - Home
- **Nukuu** - Quotation
- **Ankara** - Invoice
- **Wateja** - Customers
- **Mipango** - Settings
- **Hifadhi** - Save
- **Angalia** - View
- **Badilisha** - Convert/Edit
- **Kiasi** - Amount/Quantity
- **Salio** - Balance
- **Jumla** - Total
- **Punguzo** - Discount
- **Usafirishaji** - Delivery
- **Kilicholipwa** - Amount Paid
- **Malipo** - Payment

## Testing Checklist

- [ ] Create quotation with 1 item
- [ ] Create quotation with 3+ items
- [ ] Update quantity and verify total recalculates
- [ ] Update price and verify total recalculates
- [ ] Add discount and verify calculation
- [ ] Add delivery and verify calculation
- [ ] Save and refresh page - data persists
- [ ] Print quotation
- [ ] Save as PDF
- [ ] Test WhatsApp share
- [ ] Convert quotation to invoice
- [ ] Record partial payment
- [ ] Record final payment
- [ ] Verify status becomes "PAID"
- [ ] Search quotations
- [ ] Search invoices
- [ ] Search customers
- [ ] Test on 360px screen
- [ ] Test on 390px screen
- [ ] Test on 412px screen
- [ ] Test desktop layout
- [ ] Check browser console (no errors)
- [ ] Check for layout overflow
- [ ] Test offline (PWA)

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Connect to Netlify and deploy
npm run build
# Upload 'dist' folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Samsung Internet 14+

## License

MIT

## Support

For issues or questions, create a GitHub issue.
