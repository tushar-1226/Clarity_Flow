# ClarityFlow - Setup & Deployment Guide

## 🚀 New Features Implemented

### 1. ✅ Recurring Transactions
- **Auto-generate** monthly bills, subscriptions, and income
- **Flexible scheduling**: Daily, weekly, monthly, yearly
- **Pause/Resume** functionality
- **End date** support for finite recurring transactions

### 2. 📊 Advanced Analytics Dashboard
- **Monthly Trend Chart**: Visualize income, expenses, and net savings over time
- **Financial Health Score**: 0-100 score based on savings rate, budget adherence, income stability
- **Category Trends**: Track top 5 expense categories month-over-month
- **Actionable Insights**: See what's working and what needs improvement

### 3. ☁️ Cloud Sync with Authentication (Optional)
- **Multi-device sync** using Vercel Postgres
- **Secure authentication** with NextAuth.js
- **Automatic data migration** from localStorage
- **Sign up/Sign in** pages ready to use

---

## 📦 Dependencies Installed

```bash
npm install next-auth@latest @vercel/postgres bcryptjs @types/bcryptjs
```

---

## 🔧 Local Development (No Cloud)

**No additional setup needed!** The app works perfectly with localStorage alone:

```bash
npm run dev
```

Navigate to:
- **Dashboard**: `http://localhost:3000`
- **Analytics**: `http://localhost:3000/analytics`

All data is saved locally in your browser.

---

## ☁️ Cloud Sync Setup (Optional)

If you want multi-device sync, follow these steps:

### Step 1: Enable Vercel Postgres

1. Deploy to Vercel (if not already):
   ```bash
   vercel
   ```

2. In Vercel Dashboard:
   - Go to your project → **Storage** tab
   - Click **Create Database** → Select **Postgres**
   - Choose the free **Hobby** plan

3. After creation, copy the **DATABASE_URL** from the **.env.local** tab

### Step 2: Set Environment Variables

Create `.env.local` in your project root (already created, just update values):

```bash
# Database
DATABASE_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb"

# NextAuth
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Change to production URL when deployed
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### Step 3: Run Database Schema

1. Go to Vercel Dashboard → Your Project → Storage → Your Postgres Database
2. Click on **Query** tab
3. Copy contents of `lib/db/schema.sql` and execute it

This creates all necessary tables (users, transactions, recurring_transactions, budget_goals, savings_goals).

### Step 4: Deploy

```bash
# Add environment variables to Vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy
vercel --prod
```

### Step 5: Use Cloud Features

- Navigate to `/signup` to create an account
- Sign in at `/signin`
- Your data will automatically sync across devices!

---

## 🗂️ Database Schema

Tables created:
- **users**: User accounts with hashed passwords
- **transactions**: All income/expense transactions
- **recurring_transactions**: Recurring transaction templates
- **budget_goals**: Budget limits by category and period
- **savings_goals**: Savings targets with progress tracking

See `lib/db/schema.sql` for full schema.

---

## 🎯 Features Overview

### Recurring Transactions
1. Click "Create Recurring Transaction" on dashboard
2. Set amount, frequency, start/end dates
3. Transactions auto-generate on schedule
4. Pause anytime without deleting

### Analytics Dashboard
1. Navigate to **Analytics** from header
2. View financial health score (aim for 80+!)
3. Track spending trends by category
4. See month-over-month comparisons

### Cloud Sync (When Enabled)
- Data backed up to cloud automatically
- Access from any device
- Offline changes sync when reconnected
- Export still works as backup

---

##  ⚙️ Configuration

### Without Cloud (Default)
- Data stored in localStorage
- Works offline
- No account needed
- Export CSV for backups

### With Cloud (Optional)
- Requires Vercel Postgres
- Multi-device sync
- Account required
- Automatic backups

---

## 🚨 Important Notes

1. **Data Migration**: When you first enable cloud sync and sign in, your localStorage data will automatically migrate to the cloud

2. **Environment Variables**: Never commit `.env.local` to git (already in `.gitignore`)

3. **Free Tier Limits** (Vercel Postgres Hobby):
   - 256 MB storage
   - 60 hours compute/month
   - Perfect for personal use!

4. **Backwards Compatible**: All features work without cloud sync enabled

---

## 📱 Usage

### Add Recurring Transaction
```
Type: Expense
Category: Housing
Description: Monthly Rent
Amount: 1200
Frequency: Monthly
Start Date: 2024-01-01
```

### View Analytics
1. Click "Analytics" in navigation
2. See your financial health score
3. Review spending trends
4. Identify areas to save

### Enable Cloud Sync
1. Complete Vercel Postgres setup above
2. Navigate to `/signup`
3. Create account
4. Sign in
5. ✅ Data syncs automatically!

---

## 🔐 Security

- Passwords hashed with bcrypt
- NextAuth.js session management
- User data isolated (can only access own data)
- HTTPS enforced on Vercel

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is set correctly in `.env.local`
- Verify Vercel Postgres is created and running
- Make sure schema.sql has been executed

### "Failed to sign in"
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### "Transactions not syncing"
- Ensure you're signed in
- Check browser console for errors
- Verify API routes are accessible

---

## 📄 Project Structure

```
ClarityFlow/
├── app/
│   ├── analytics/          # Analytics dashboard page
│   ├── signin/             # Sign-in page
│   ├── signup/             # Sign-up page
│   └── api/
│       ├── auth/           # NextAuth handlers
│       ├── transactions/   # Transaction CRUD API
│       └── signup/         # User registration
├── components/
│   ├── charts/             # Chart components
│   ├── recurring/          # Recurring transaction UI
│   └── layout/             # Header, navigation
├── lib/
│   ├── analytics.ts        # Analytics calculations
│   ├── recurringService.ts # Recurring logic
│   └── db/                 # Database client & schema
├── auth.ts                 # NextAuth configuration
└── .env.local              # Environment variables
```

---

## 🎉 You're All Set!

Your ClarityFlow app now has:
- ✅ Recurring transactions that auto-generate
- ✅ Advanced analytics with financial health scoring
- ✅ Optional cloud sync for multi-device access

**Start tracking your finances with clarity!** 💰📊
