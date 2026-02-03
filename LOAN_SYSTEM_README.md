# Loan Application Classification & Approval System

A modern, AI-powered loan application system built with Next.js 16, featuring automatic loan classification, risk assessment, and intelligent approval decisions.

## 🚀 Features

- **AI-Powered Classification**: Automatically categorizes loan applications (personal, business, education, mortgage, auto) using LLM
- **Risk Assessment**: Calculates comprehensive risk scores based on multiple factors
- **Automated Approval**: Intelligent approval logic with auto-approve, auto-reject, and manual review workflows
- **Beautiful UI**: Built with shadcn/ui components and Tailwind CSS 4
- **Real-time Dashboard**: View and manage all loan applications with filtering and search
- **Responsive Design**: Mobile-first approach that works on all devices

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui
- **Database**: Prisma ORM + SQLite
- **AI/ML**: z-ai-web-dev-sdk (LLM for classification)
- **State Management**: React hooks with TanStack Query patterns

### Database Schema
```prisma
model LoanApplication {
  id                  String   @id @default(cuid())
  applicantName       String
  applicantEmail      String
  applicantPhone      String
  loanAmount          Float
  loanPurpose         String
  annualIncome        Float
  creditScore         Int
  employmentStatus    String
  employmentDuration  Int?
  monthlyDebt         Float    @default(0)
  loanType            String   // AI-classified
  riskLevel           String   // AI-classified: low/medium/high
  approvalStatus      String   // pending/approved/rejected/under_review
  approvalReason      String?
  debtToIncomeRatio   Float
  riskScore           Float    // 0-100
  aiAnalysis          String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── loan/
│   │       ├── submit/
│   │       │   └── route.ts       # Submit loan application with AI classification
│   │       └── applications/
│   │           └── route.ts       # Fetch all applications
│   ├── page.tsx                    # Main application UI
│   └── layout.tsx                  # Root layout with toaster
├── components/
│   └── ui/                         # shadcn/ui components
└── lib/
    ├── db.ts                       # Prisma client
    └── utils.ts                    # Utility functions

prisma/
└── schema.prisma                    # Database schema
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- Bun (recommended)

### Installation
```bash
# Install dependencies
bun install

# Set up database
bun run db:push

# Start development server
bun run dev
```

The application will be available at `http://localhost:3000`

## 💡 How It Works

### 1. Application Submission
Users fill out a comprehensive loan application form with:
- Personal information (name, email, phone)
- Loan details (amount, purpose)
- Financial information (income, credit score, monthly debt)
- Employment information (status, duration)

### 2. AI Classification
The system uses LLM to:
- **Categorize the loan type**: personal, business, education, mortgage, or auto
- **Assess risk level**: low, medium, or high
- **Calculate risk score**: 0-100 based on multiple factors
- **Provide analysis**: Detailed explanation of the assessment

Factors considered:
- Credit score (40% weight)
- Debt-to-income ratio (30% weight)
- Employment stability (20% weight)
- Income level (10% weight)

### 3. Approval Decision
Automated decision logic:

**Auto-Approve Criteria:**
- Credit score ≥ 750
- DTI < 30%
- Risk score < 30

**Auto-Reject Criteria:**
- Credit score < 580
- DTI > 50%
- Risk score > 80

**Manual Review:**
- Borderline cases that don't meet auto-approve or auto-reject criteria

### 4. Dashboard
View all applications with:
- Search by name, email, or ID
- Filter by approval status
- Sort and view details
- Real-time statistics

## 🔌 API Endpoints

### POST /api/loan/submit
Submit a new loan application.

**Request Body:**
```json
{
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "+1 234 567 8900",
  "loanAmount": "50000",
  "loanPurpose": "Home purchase",
  "annualIncome": "75000",
  "creditScore": "720",
  "employmentStatus": "employed",
  "employmentDuration": "3",
  "monthlyDebt": "1500"
}
```

**Response:**
```json
{
  "success": true,
  "application": {
    "id": "...",
    "applicantName": "John Doe",
    "loanAmount": 50000,
    "loanType": "mortgage",
    "riskLevel": "low",
    "approvalStatus": "approved",
    "riskScore": 25,
    "createdAt": "2024-01-15T10:30:00Z",
    "aiAnalysis": "...",
    "approvalReason": "..."
  }
}
```

### GET /api/loan/applications
Fetch all loan applications.

**Query Parameters:**
- `status`: Filter by approval status (optional)
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "applications": [...],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

## 🎨 UI Components

The application uses shadcn/ui components for a modern, accessible interface:
- Card, Form, Input, Label
- Select, Tabs, Badge
- Table, Button, Textarea
- Toaster for notifications

## 🔒 Validation

All inputs are validated on both client and server:
- Credit score: 300-850 range
- Loan amount: must be positive
- Annual income: must be positive
- Required fields: name, email, phone, loan amount, purpose, income, credit score, employment status, monthly debt

## 🚨 Error Handling

The system includes:
- Client-side form validation
- Server-side API validation
- AI fallback to rule-based classification
- Toast notifications for user feedback
- Detailed error logging

## 📊 Risk Assessment Algorithm

The risk score (0-100) is calculated using:

```javascript
riskScore = baseline(50)
           + creditScoreFactor(±40)
           + dtiFactor(±30)
           + employmentFactor(±20)
           + incomeFactor(±10)
```

Lower scores = lower risk, higher scores = higher risk

## 🔄 Future Enhancements

Potential improvements:
- Manual review workflow for administrators
- Email notifications to applicants
- Document upload and analysis
- Credit score integration with bureaus
- Historical analytics and reporting
- Multi-language support
- Advanced filtering and sorting
- Export functionality

## 📝 License

AGPL v3.0


## 👨‍💻 Development

```bash
# Lint code
bun run lint

# Database operations
bun run db:push      # Push schema changes
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run migrations
```

---

Built with ❤️ by [jakegithub24](https://github.com/jakegithub24)
