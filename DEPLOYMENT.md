# LadyB Lux Events - Deployment & Deployment Guide

## STEP E: PAYMENTS, DEPLOYMENT & PRODUCTION READINESS

### E1: Payment Integration (Paystack)

#### Backend Setup

1. **Install Dependencies**
```bash
npm install axios
```

2. **Environment Variables**
Set in `.env`:
```
PAYSTACK_SECRET=sk_live_your_key
PAYSTACK_PUBLIC_KEY=pk_live_your_key
FRONTEND_URL=https://yourapp.com
```

3. **Payment Flow**
- Frontend initiates order → Backend creates order
- Frontend calls `POST /payments/initiate` with orderId
- Backend initializes Paystack transaction and returns authorization URL
- Frontend redirects to Paystack payment page
- User completes payment on Paystack
- Paystack redirects to success page with reference
- Frontend calls `POST /payments/verify` with reference
- Backend confirms payment + locks availability
- Order status changes: PENDING → PAID

4. **Webhook Handling** (Critical!)
- Paystack sends webhook to `POST /payments/webhook/paystack`
- Backend verifies signature using PAYSTACK_SECRET
- If charge.success: confirm payment, lock availability
- Backend MUST return 200 to Paystack within 5 seconds

#### Frontend Setup

1. **Install Dependencies**
Already included: axios, @tanstack/react-query

2. **Payment Button** (already in checkout/page.tsx)
```typescript
onClick={async () => {
  const res = await api.post('/payments/initiate', { orderId });
  window.location.href = res.data.data.authorization_url;
}}
```

3. **Success Redirect**
Handled in `/checkout/success/page.tsx`

---

### E2: Database & Deployment Services

#### Database Options

**Option 1: Supabase (Recommended for quick setup)**
- PostgreSQL hosted on AWS/Google Cloud
- Free tier: 500MB database
- $25/month for production
- URL: https://supabase.com

**Option 2: Neon** 
- Modern PostgreSQL with serverless compute
- Free tier included
- URL: https://neon.tech

**Option 3: AWS RDS**
- t3.micro free tier for 12 months
- Standard production choice
- URL: https://aws.amazon.com

#### Setup Steps (Supabase example):

1. Create project at supabase.com
2. Copy connection string → `DATABASE_URL` in `.env`
3. Run migrations:
```bash
npx prisma migrate deploy
```

---

### E3: Backend Deployment

#### Option 1: Railway (Easiest 🚀)

1. Connect GitHub repo: https://railway.app
2. Create new service → PostgreSQL
3. Create another service → Node.js
4. Set environment variables in dashboard
5. Railway auto-deploys on push

**Cost**: $5/month minimum (includes database + app)

#### Option 2: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub
4. Set environment variables
5. Deploy button

**Cost**: Free tier (sleeps after 15 min inactivity), $7/month for always-on

#### Option 3: Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly secrets set PAYSTACK_SECRET=...
fly deploy
```

---

### E4: Frontend Deployment

#### Vercel (Recommended)

1. Go to https://vercel.com
2. Connect GitHub repo `/frontend`
3. Configure build settings:
   - Framework: Next.js
   - Root directory: frontend
4. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
   ```
5. Deploy (auto on push)

**Cost**: Free tier (12 serverless function invocations/month), $20/month for Pro

#### Netlify

```bash
npm run build  # in /frontend
npm install -g netlify-cli
netlify deploy --prod
```

---

### E5: Production Checklist ✅

#### Security
- [ ] JWT_SECRET is strong and unique
- [ ] PAYSTACK_SECRET never in version control
- [ ] CORS configured properly
- [ ] HTTPS enforced everywhere
- [ ] SQL injection prevented (using Prisma)
- [ ] Rate limiting added for auth endpoints
- [ ] Webhook signature validation working

#### Backend
- [ ] Database backups automated
- [ ] Error logging setup (Sentry/LogRocket)
- [ ] Cron job for marking orders COMPLETED (C8)
- [ ] Payment webhook retry logic
- [ ] API documentation (Swagger)
- [ ] Health check endpoint: `GET /health`

#### Frontend
- [ ] Environment variables not hardcoded
- [ ] Error boundaries added
- [ ] Loading states for all async operations
- [ ] Mobile responsive
- [ ] Analytics setup (Google Analytics)
- [ ] 404 error page

#### Operations
- [ ] Monitoring in place (Uptime Robot)
- [ ] Database backups (daily minimum)
- [ ] Payment reconciliation script
- [ ] Support email for disputes
- [ ] Terms of service & privacy policy

---

### E6: Setup Cron Job for Auto-Complete Orders (C8)

**Backend - Add to main.ts:**
```typescript
import { CronJob } from 'cron';
import { PaymentService } from './payments/payments.service';

// Run daily at 11:59 PM
const job = new CronJob('0 23 * * *', async () => {
  await ordersService.markCompletedAfterEventDate();
  console.log('Orders marked as completed');
});

job.start();
```

Install: `npm install cron @types/cron`

---

### E7: Paystack Integration Summary

**Keys to obtain:**
1. Sign up at https://paystack.com
2. Go to Settings → API Keys
3. Copy Secret Key (sk_live_...)
4. Copy Public Key (pk_live_...)

**Webhook URL to set in Paystack Dashboard:**
```
POST https://your-backend.com/payments/webhook/paystack
```

**Testing Paystack locally:**
Use Paystack test keys (sk_test_..., pk_test_...)

---

### E8: Monitoring & Analytics

#### Option 1: Sentry (Error Tracking)
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

#### Option 2: LogRocket (Session Replay)
Frontend only, great for debugging

#### Option 3: DataDog
Enterprise choice, costs $$$

---

### E9: Email Notifications

Add to orders.service.ts (C8):
```typescript
async notifyVendor(orderId: string) {
  const order = await this.prisma.order.findUnique({...});
  
  // Send email to vendor
  await emailService.send({
    to: order.vendor.email,
    template: 'new-order',
    data: { order }
  });
}
```

Popular services:
- SendGrid
- Mailgun
- AWS SES

---

### E10: Commission Calculation

**In OrderItem creation:**
```typescript
// Platform commission (15%)
const commission = item.price * item.quantity * 0.15;
const vendorEarnings = item.price * item.quantity - commission;

// Record in new CommissionLog model
await prisma.commissionLog.create({
  data: {
    orderId,
    vendorId,
    amount: vendorEarnings,
    status: 'PENDING_PAYOUT'
  }
});
```

**Weekly payout (manual initially, automated later):**
```typescript
const summary = await prisma.commissionLog.groupBy({
  by: ['vendorId'],
  where: { status: 'PENDING_PAYOUT' },
  _sum: { amount: true }
});
// Create payout records
```

---

## DEPLOYMENT DECISION MATRIX

| Aspect | Railway | Render | Vercel/Netlify |
|--------|---------|--------|----------------|
| **Setup Time** | 5 min | 10 min | 3 min |
| **Cost** | $5/mo | Free+ | Free+ |
| **Backend** | ✅ | ✅ | ❌ |
| **Frontend** | ❌ | ✅ | ✅ |
| **Database Included** | ✅ | ⚠️ | ❌ |

### Recommended Setup:
- **Backend**: Railway (includes DB)
- **Frontend**: Vercel (Next.js optimized)
- **Total Cost**: $5-25/month

---

## Final Checklist Before Launch 🚀

```
✅ Database: Supabase/Neon/RDS
✅ Backend: Railway/Render/Fly
✅ Frontend: Vercel/Netlify
✅ Domain: Purchased & configured
✅ SSL: HTTPS everywhere
✅ Email: SendGrid/Mailgun setup
✅ Paystack: Live keys configured
✅ Monitoring: Uptime Robot + Sentry
✅ Backups: Automated daily
✅ Docs: README updated
```

**Estimated Monthly Cost:**
- Railway Backend: $7-15
- Sendgrid/Email: $10-20
- Supabase: $5
- **Total: $22-40/month** ✅

---

## Next Steps

1. Get Supabase database ready
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Get Paystack merchant account
5. Configure webhooks
6. Test full payment flow
7. Go live! 🎉

Questions? Check the production checklist above.
