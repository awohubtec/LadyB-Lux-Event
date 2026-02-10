# 🚀 LadyB Lux Events - Complete Setup Guide (1-5)

## ✅ STATUS: ALL INSTALLATIONS COMPLETE

Dependencies are now installed for:
- ✅ Backend (NestJS) - 818 packages
- ✅ Frontend (Next.js) - 131 packages

---

## 1️⃣ TEST LOCALLY

### Prerequisites
- PostgreSQL running (local or cloud)
- Node.js v18+
- All dependencies installed ✅

### Backend Setup (API)

```bash
# 1a. Copy environment template
cd backend
cp .env.example .env

# 1b. Edit .env with:
# DATABASE_URL=postgresql://user:password@localhost:5432/ladyb_lux_event
# JWT_SECRET=your_random_secret_key_here
# PAYSTACK_SECRET=sk_test_xxxx (from Paystack)
# PAYSTACK_PUBLIC_KEY=pk_test_xxxx
# FRONTEND_URL=http://localhost:3000

# 1c. Set up database (choose one):
# Option A: Local PostgreSQL
createdb ladyb_lux_event
npx prisma migrate deploy

# Option B: Supabase (cloud)
# 1. Go to supabase.com, create project
# 2. Copy connection string → DATABASE_URL
# 3. Run: npx prisma migrate deploy

# 1d. Generate Prisma types
npx prisma generate

# 1e. Start backend
npm run start:dev
# Server runs on http://localhost:3001
```

### Frontend Setup (Web)

```bash
# 2a. Copy environment template
cd ../frontend
cp .env.example .env.local

# 2b. Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 2c. Start frontend
npm run dev
# App runs on http://localhost:3000
```

### Test Full Flow

1. Open http://localhost:3000
2. Click "Register" → Create customer account
3. Create an event
4. Browse vendors by category
5. Add products to cart
6. Go to checkout
7. Test payment with Paystack test card:
   - Card: `4084084084084081`
   - Expiry: `01/45`
   - CVV: `000`
   - OTP: Keep pressing "Continue"

---

## 2️⃣ DEPLOY TO PRODUCTION

### Option A: Railway (Easiest) 🚀

**Backend + Database**
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Create project:
   - Add PostgreSQL service
   - Add Node.js service
   - Connect GitHub repo (/backend folder)
4. Set environment variables:
   DATABASE_URL (from PostgreSQL)
   JWT_SECRET
   PAYSTACK_SECRET
   PAYSTACK_PUBLIC_KEY
   FRONTEND_URL=https://your-vercel-domain.com
5. Deploy (auto on push)
6. Copy backend URL from railway.app
```

Cost: $5-15/month (includes database)

**Frontend**
```
1. Go to https://vercel.com
2. Sign up with GitHub  
3. Import repository (/frontend folder)
4. Set environment variables:
   NEXT_PUBLIC_API_URL=https://your-railway-url.com
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
5. Deploy (auto on push)
```

Cost: Free (with Pro at $20/month)

### Option B: Docker Deployment

```bash
# Backend Dockerfile (create backend/Dockerfile):
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

# Frontend Dockerfile (create frontend/Dockerfile):
FROM node:18 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json .
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 3️⃣ ADD NEW FEATURES

### Feature 1: Reviews & Ratings

```bash
# Add to Prisma schema:
model Review {
  id        String   @id @default(uuid())
  vendorId  String
  userId    String
  rating    Int     // 1-5
  comment   String?
  createdAt DateTime @default(now())

  vendor    Vendor   @relation(fields: [vendorId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

# Then:
npx prisma migrate dev --name add_reviews
```

### Feature 2: Email Notifications

```bash
npm install nodemailer

# Backend - add to payments.service.ts:
import * as nodemailer from 'nodemailer';

async sendOrderConfirmationEmail(orderId: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: '✅ Order Confirmed',
    html: `<h1>Order #${orderId.slice(0, 8)}</h1>...`,
  });
}
```

### Feature 3: Vendor Earnings Dashboard

```bash
# Add to Prisma schema:
model Earnings {
  id        String   @id @default(uuid())
  vendorId  String
  orderId   String
  amount    Float
  status    String  @default("pending")  // pending, paid
  createdAt DateTime @default(now())

  vendor    Vendor   @relation(fields: [vendorId], references: [id])
}

# Backend endpoint:
@Get('vendor/earnings')
async getVendorEarnings(@Req() req: any) {
  const earnings = await this.prisma.earnings.groupBy({
    by: ['vendorId'],
    where: { vendorId: req.vendor.id },
    _sum: { amount: true },
  });
  return earnings;
}
```

### Feature 4: Search & Filter

```bash
# Backend - Add to products.service.ts:
async searchProducts(query: string, category?: string) {
  return this.prisma.product.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        category ? { vendor: { category } } : {},
      ],
    },
    include: { vendor: true },
  });
}
```

---

## 4️⃣ FIX/DEBUG

### Common Issues & Solutions

**Issue: Port 3000/3001 already in use**
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>

# Or use different ports
PORT=3002 npm run start:dev  # backend
PORT=3001 npm run dev          # frontend
```

**Issue: Database connection error**
```bash
# Check DATABASE_URL format:
postgresql://username:password@localhost:5432/dbname

# Ensure PostgreSQL is running:
pg_isready -h localhost

# Test connection:
psql -U username -d ladyb_lux_event -h localhost
```

**Issue: JWT token not working**
```bash
# Verify token is in localStorage:
localStorage.getItem('token')

# Check JWT_SECRET matches backend & frontend
# Verify token expiration
```

**Issue: CORS errors**
```bash
# Backend - add to main.ts:
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**Issue: Payment webhook not firing**
```bash
# 1. Verify Paystack test keys in .env
# 2. Set webhook URL in Paystack dashboard:
#    https://your-backend.com/payments/webhook/paystack
# 3. Check signature verification:
#    Hash HMAC-SHA512(payload, PAYSTACK_SECRET)
# 4. Log webhook requests:
console.log('Webhook received:', payload);
```

---

## 5️⃣ PRODUCTION CHECKLIST

### Security ✅
- [ ] JWT_SECRET is random & strong
- [ ] PAYSTACK_SECRET removed from git
- [ ] HTTPS enforced everywhere
- [ ] CORS whitelisted properly
- [ ] SQL injection prevented (using Prisma)
- [ ] Rate limiting added
- [ ] API keys rotated

### Backend ✅
- [ ] Error logging (Sentry)
- [ ] Database backups automated
- [ ] Health check endpoint: GET /health
- [ ] API documentation (Swagger)
- [ ] Environment variables validated
- [ ] Cron job for order completion
- [ ] Payment webhook retries

### Frontend ✅
- [ ] Environment variables not hardcoded
- [ ] Error boundaries added
- [ ] Loading states for all async
- [ ] Mobile responsive
- [ ] Analytics setup (Google Analytics)
- [ ] 404 page
- [ ] Cache strategy configured

### Operations ✅
- [ ] Monitoring (Uptime Robot, Sentry)
- [ ] Database backups
- [ ] Payment reconciliation
- [ ] Support email configured
- [ ] Terms of service
- [ ] Privacy policy

---

## 🎯 SUMMARY

### Status
- ✅ Dependencies installed
- ✅ Project structure complete
- ✅ 20 frontend components/pages
- ✅ Payment integration ready
- ✅ Database migrations ready
- ✅ Documentation complete

### Quick Commands

```bash
# Local Development
cd backend && npm run start:dev   # Terminal 1
cd frontend && npm run dev         # Terminal 2

# Database
npx prisma studio                  # View database

# Deployment
# Push to GitHub → Railway/Vercel auto-deploys

# Production
npm run build && npm run start:prod
```

### Cost Estimates
- Railway Backend: $5-15/month
- Vercel Frontend: Free (Pro $20/month)
- Database: $5-10/month
- **Total: $10-35/month** ✅

---

## 📞 SUPPORT RESOURCES

- **README.md** - Architecture & API
- **DEPLOYMENT.md** - Detailed deployment
- **QUICKSTART.md** - 5-minute setup
- **Paystack Docs** - https://paystack.com/docs

---

**You're ready to launch! 🚀**
- Backend ready on port 3001
- Frontend ready on port 3000
- Payment integration complete
- Database ready to deploy

Next Steps:
1. Set up .env files
2. Start backend & frontend
3. Test payment flow
4. Deploy to Railway + Vercel
5. Go live! 🎉
