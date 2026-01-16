# ClarityFlow - Personal Budget Tracker

A modern, responsive web application for managing personal finances with clarity and ease. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Transaction Management**: Easily add income and expense transactions with detailed descriptions, dates, and amounts
- **Smart Categorization**: Organize your finances with built-in categories for both income and expenses
- **Budget Goals**: Set monthly budget limits for specific expense categories with visual progress tracking
- **Financial Dashboard**:
  - Real-time summary of Total Income, Total Expenses, and Current Balance
  - Interactive pie chart showing expense distribution by category
  - Bar chart comparing monthly income versus expenses
- **Search & Filter**: Powerful filtering options by text, type, date range, and amount range
- **Data Import/Export**: Import existing CSV data and export transactions for external analysis
- **Dark/Light Theme**: Toggle between themes to suit your preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd ClarityFlow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
ClarityFlow/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── budget/             # Budget-related components
│   ├── charts/             # Chart components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   ├── transactions/       # Transaction components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── calculations.ts     # Financial calculations
│   └── dataHandler.ts      # Data persistence
├── providers/              # React context providers
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
└── old_python_app/         # Original Python application (archived)
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Theme**: next-themes
- **Icons**: lucide-react
- **CSV Handling**: papaparse
- **Date Utilities**: date-fns

## 📊 Data Storage

- Data is stored in browser localStorage
- Automatic persistence on every change
- CSV import/export for data portability

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and configure the build
5. Click "Deploy"

Your app will be live in minutes with automatic HTTPS and global CDN!

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 Usage Guide

### Adding Transactions
1. Fill in the transaction form (left panel)
2. Select date, type (income/expense), category, description, and amount
3. Click "Add Transaction"

### Setting Budget Goals
1. Navigate to "Set Budget Goals" (middle panel)
2. Select an expense category
3. Enter your monthly budget limit
4. Click "Set Budget Goal"
5. Track progress in the "Budget Tracking" section below

### Filtering Transactions
1. Use the "Search & Filter" panel (left panel)
2. Apply filters by text, type, date range, or amount
3. Click "Clear" to reset all filters

### Importing/Exporting Data
- **Export**: Click "Export CSV" in the header to download your data
- **Import**: Click "Import CSV" to upload a CSV file with your transactions

### CSV Format
```csv
id,date,type,category,description,amount
1,2024-01-15,expense,Food,Groceries,125.50
2,2024-01-16,income,Salary,Monthly salary,3000.00
```

## 🎯 Migrating from Python Version

If you have data from the old Python application:

1. Your old data is in `old_python_app/budget_data.csv`
2. Use the "Import CSV" button to load it
3. Budget goals need to be manually set again (they were in `budget_goals.json`)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ using Next.js**
