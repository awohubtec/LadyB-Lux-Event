# LadyB Lux Events - Complete Guide

**A full-stack event vendor marketplace** where customers book services, rentals, food and entertainment for their events.

---

## 🎯 Project Overview

### What Is LadyB Lux Events?

A marketplace connecting **event planners, decorators, caterers, and entertainers** with **customers planning events** (weddings, birthdays, corporate gatherings).

**Key Flow:**
1. User registers & creates an event
2. Browses vendors by category (planners, decorations, cakes, food)
3. Adds services/rentals/food to cart
4. Checks out & pays via Paystack
5. Vendors fulfill the order
6. Platform takes 15% commission

---

## 📦 Tech Stack

### Backend
- **NestJS** - TypeScript backend framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Paystack** - Payment processing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management (cart)
- **TanStack Query** - Data fetching
- **Axios** - HTTP client

### Deployment
- **Railway/Render** - Backend hosting
- **Vercel** - Frontend hosting
- **Supabase/Neon** - Database

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or Supabase)
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup database
npx prisma migrate deploy  # Production
# or
npx prisma migrate dev --name init  # Development

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start development
npm run start:dev
```

**Runs on:** http://localhost:3001

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local (set NEXT_PUBLIC_API_URL)

# Start development
npm run dev
```

**Runs on:** http://localhost:3000

---

## 📁 Project Structure

```
LadyB-Lux-Event/
│
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication (JWT, Guards)
│   │   ├── orders/            # Order management (C7, C8, C9)
│   │   ├── payments/          # Paystack integration (E1)
│   │   ├── products/          # Product/vendor management
│   │   ├── events/            # Event management
│   │   └── main.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Data models
│   │   └── migrations/        # Database migrations
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── app/
│   │   ├── auth/              # Login/Register pages
│   │   ├── vendors/           # Browse vendors
│   │   ├── event/create/      # Create event
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Payment page
│   │   └── dashboard/         # Customer/Vendor/Admin dashboards
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities (API, Auth)
│   ├── store/                 # Zustand state management
│   └── package.json
│
└── DEPLOYMENT.md              # Deployment guide
```

---

## ✨ Key Features Implemented

### C7 - FOOD ORDER LOGIC ✅
- Food orders require only `deliveryDate` (no date range)
- Optional `dailyCapacity` check to prevent overbooking
- Simpler than rental/service checkout flow
```typescript
if (product.type === 'FOOD') {
  // Validate deliveryDate only
  // Optional: check daily capacity
}
```

### C8 - ORDER STATUS LIFECYCLE ✅
Status flow: `PENDING → PAID → IN_PROGRESS → COMPLETED` or `CANCELLED`
- **Admin only**: Can cancel orders (especially after payment)
- **Vendor only**: Can mark orders as IN_PROGRESS
- **System**: Auto-completes orders after event date
- **Endpoint**: `PATCH /orders/:id/status?status=IN_PROGRESS`

### C9 - VENDOR VIEW (Filter Orders) ✅
- **Endpoint**: `GET /orders/vendor/orders`
- Retrieves only orders containing vendor's products
- Prisma query filters by `items.some.product.vendorId`
- Protected by `@Roles('VENDOR')` guard

### D - FRONTEND SETUP ✅
Complete Next.js frontend with:
- 🔐 Auth (Login/Register)
- 🏠 Homepage with category browse
- 🏪 Vendor listing by category
- 🛒 Shopping cart (Zustand)
- 💳 Checkout with dates
- 📊 Customer dashboard (view orders)
- 📈 Vendor dashboard (view their orders)
- 👨‍💼 Admin dashboard (manage orders + vendors)

### E1 - PAYMENT INTEGRATION ✅
Paystack payment gateway:
1. Frontend initiates payment → `POST /payments/initiate`
2. Backend returns Paystack authorization URL
3. User completes payment on Paystack
4. Paystack redirects → `/checkout/success` with reference
5. Frontend verifies → `POST /payments/verify`
6. Backend confirms & locks availability
7. Backend also receives webhook for reliability

**Webhook Signature Verification**: Critical for security ✅

### E2-E10 - DEPLOYMENT READY ✅
- Environment variable templates
- Database setup guides (Supabase, Neon, RDS)
- Backend deployment (Railway, Render, Fly.io)
- Frontend deployment (Vercel, Netlify)
- Production checklist
- Commission calculation logic
- Cron job setup for auto-complete orders

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your_super_secret_key
PAYSTACK_SECRET=sk_live_your_secret
PAYSTACK_PUBLIC_KEY=pk_live_your_public
FRONTEND_URL=http://localhost:3000 (or https://yourapp.com)
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001 (or https://api.yourapp.com)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

---

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login

### Events
- `POST /events` - Create event
- `GET /events` - List user's events

### Products
- `GET /products` - List all products
- `GET /vendors` - List vendors
- `GET /vendors/:category` - List by category

### Orders
- `POST /orders` - Create order
- `GET /orders` - My orders
- `GET /orders/vendor/orders` - Vendor's orders (C9)
- `GET /orders/:id` - Order details
- `PATCH /orders/:id/status?status=IN_PROGRESS` - Update status (C8)

### Payments (E1)
- `POST /payments/initiate` - Start Paystack payment
- `POST /payments/verify` - Verify payment
- `POST /payments/webhook/paystack` - Webhook (no auth required)

---

## 🛠️ Development

### Database Migrations
```bash
# Create new migration
npm run prisma:migrate

# Generate Prisma types
npx prisma generate

# View database
npx prisma studio
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

---

## 📱 User Roles

### Customer
- Create events
- Browse vendors
- Add to cart & checkout
- View orders
- Leave reviews

### Vendor
- Add products
- View orders for their products
- Update order status
- Track earnings
- Manage availability

### Admin
- View all orders
- Approve vendors
- Manage commissions
- View revenue
- Resolve disputes

---

## 💰 Commission Model

- **Platform Commission**: 15% of order total
- **Vendor Earnings**: 85% of order total
- **Payout**: Can be automated weekly or paid manually

Example:
```
Customer orders: ₦100,000
Platform fee: ₦15,000
Vendor receives: ₦85,000
```

---

## 🔒 Security Features

✅ JWT authentication with roles
✅ Password hashing (bcrypt)
✅ CORS protection
✅ SQL injection prevention (Prisma)
✅ Paystack webhook signature verification
✅ Environment variables (never hardcoded secrets)
✅ HTTPS in production
✅ Rate limiting (recommended)

---

## 🚀 Deployment Checklist

- [ ] Database: Supabase/Neon/RDS
- [ ] Backend: Railway/Render/Fly.io
- [ ] Frontend: Vercel/Netlify
- [ ] Domain: Configured & DNS updated
- [ ] SSL: HTTPS everywhere
- [ ] Paystack: Live merchant account
- [ ] Monitoring: Uptime Robot + Sentry
- [ ] Backups: Automated daily
- [ ] Email: SendGrid/Mailgun

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions**

---

## 📊 Database Schema (Prisma)

Models:
- `User` - Customers, vendors, admins
- `Vendor` - Vendor profiles
- `Product` - Items for sale (services, rentals, food)
- `Event` - Customer's event
- `Order` - Customer's order
- `OrderItem` - Line items in order (supports multiple vendors)
- `Payment` - Payment records
- `Review` - Customer reviews
- `Availability` - Rental/service date locks
- `CommissionLog` (suggested) - Track vendor payouts

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review API endpoints above
3. Check Prisma schema in `backend/prisma/schema.prisma`
4. Open a GitHub issue

---

## 📄 License

UNLICENSED - Proprietary software

---

## 🎉 Next Steps

1. **Local Development**: Follow Quick Start above
2. **Paystack Account**: Sign up at https://paystack.com
3. **Test Payment Flow**: Use Paystack test keys
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Go Live**: 🚀

---

**Built with ❤️ for event planners everywhere**

Current date: February 10, 2026