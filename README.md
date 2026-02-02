# 🏦 Loan Application Classification & Approval System

A modern, AI-powered loan application system built with Next.js 16, featuring automatic loan classification, comprehensive risk assessment, and intelligent approval decisions.

![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- 🤖 **AI-Powered Classification**: Automatically categorizes loan applications using LLM
- 📊 **Risk Assessment**: Calculates comprehensive risk scores based on multiple factors
- ✅ **Automated Approval**: Intelligent approval logic with auto-approve, auto-reject, and manual review workflows
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS 4
- 📱 **Responsive Design**: Mobile-first approach that works on all devices
- 🔄 **Real-time Dashboard**: View and manage all loan applications with filtering and search
- 📝 **Status Management**: Complete workflow for reviewing and updating application status
- 🔒 **Type Safety**: Full TypeScript coverage with Zod validation
- 🗄️ **Database**: Prisma ORM with SQLite for easy deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jakegithub24/Loan-Application-Classification.git
cd Loan-Application-Classification

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize the database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Available Scripts

```bash
# Development
bun run dev          # Start development server

# Production
bun run build        # Build for production
bun start            # Start production server

# Database
bun run db:push      # Push schema changes to database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database

# Code Quality
bun run lint         # Run ESLint
```

## 🏗️ Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality, accessible components
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **Framer Motion** - Smooth animations

### Database & Backend
- **Prisma ORM** - Type-safe database client
- **SQLite** - Lightweight database (easily switchable to PostgreSQL/MySQL)
- **z-ai-web-dev-sdk** - AI-powered classification

### Forms & Validation
- **React Hook Form** - Performant forms
- **Zod** - Schema validation

## 📁 Project Structure

```
loan-application-system/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── loan/
│   │   │       ├── submit/
│   │   │       │   └── route.ts          # Submit loan application
│   │   │       ├── applications/
│   │   │       │   └── route.ts          # Fetch all applications
│   │   │       └── [id]/
│   │   │           ├── route.ts          # Get single application
│   │   │           └── update-status/
│   │   │               └── route.ts      # Update application status
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout
│   │   └── page.tsx                       # Main application page
│   ├── components/
│   │   └── ui/                            # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts                  # Mobile detection hook
│   │   └── use-toast.ts                   # Toast notifications
│   └── lib/
│       ├── db.ts                          # Prisma client
│       └── utils.ts                       # Utility functions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── LOAN_SYSTEM_README.md     # Detailed system documentation
├── STATUS_MANAGEMENT_GUIDE.md # Status management documentation
├── package.json               # Dependencies and scripts
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 💡 How It Works

### 1. Application Submission

Users fill out a comprehensive loan application form with:
- **Personal Information**: Name, Email, Phone
- **Loan Details**: Amount, Purpose
- **Financial Information**: Income, Credit Score, Monthly Debt
- **Employment Information**: Status, Duration

### 2. AI Classification

The system uses LLM to:
- **Categorize loan type**: Personal, Business, Education, Mortgage, Auto
- **Assess risk level**: Low, Medium, High
- **Calculate risk score**: 0-100 based on multiple factors
- **Provide analysis**: Detailed explanation of the assessment

**Factors considered:**
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

### 4. Dashboard & Status Management

View and manage all applications with:
- Search by name, email, or ID
- Filter by approval status
- View detailed application information
- Manually update status with decision notes
- Track complete review history

## 🔌 API Endpoints

### POST /api/loan/submit

Submit a new loan application.

**Request:**
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
    "id": "clx...",
    "applicantName": "John Doe",
    "loanAmount": 50000,
    "loanType": "mortgage",
    "riskLevel": "low",
    "approvalStatus": "approved",
    "riskScore": 25,
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

### GET /api/loan/[id]

Get a single loan application by ID.

### PUT /api/loan/[id]/update-status

Update application status.

**Request:**
```json
{
  "approvalStatus": "approved",
  "approvalReason": "Strong credit history",
  "reviewedBy": "Admin"
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

See `.env.example` for all available options.

### Database Configuration

The default configuration uses SQLite. To use PostgreSQL or MySQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

3. Run migrations:
```bash
bun run db:push
```

## 📊 Database Schema

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
  riskLevel           String   // AI-classified
  approvalStatus      String   @default("pending")
  approvalReason      String?
  debtToIncomeRatio   Float
  riskScore           Float    // 0-100
  aiAnalysis          String?
  reviewedAt          DateTime?
  reviewedBy          String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t loan-app-system .

# Run container
docker run -p 3000:3000 loan-app-system
```

### Traditional Hosting

```bash
# Build for production
bun run build

# Start production server
bun start
```

See [DEPLOYMENT.md](#) for detailed deployment guides.

## 🧪 Testing

```bash
# Run linting
bun run lint

# Run type checking
bun run tsc --noEmit
```

## 📝 Documentation

- **[LOAN_SYSTEM_README.md](./LOAN_SYSTEM_README.md)** - Detailed system documentation
- **[STATUS_MANAGEMENT_GUIDE.md](./STATUS_MANAGEMENT_GUIDE.md)** - Status management guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[LICENSE](./LICENSE)** - AGPL v3.0 License

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the AGPL v3.0 License - see the [LICENSE](./LICENSE) file for details.

## 🔐 Security

- Never commit `.env` files
- Use environment variables for sensitive data
- Implement rate limiting for production
- Use HTTPS in production
- Regular security audits recommended
- Keep dependencies updated

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [z-ai-web-dev-sdk](https://z.ai)
- Icons by [Lucide](https://lucide.dev/)

## 📧 Support

For support, email support@example.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] User authentication and authorization
- [ ] Email notifications for applicants
- [ ] Document upload and analysis
- [ ] Credit score integration with bureaus
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] PDF export functionality
- [ ] Mobile app version

---

Built with ❤️ by [jakegithub24](https://github.com/jakegithub24).
