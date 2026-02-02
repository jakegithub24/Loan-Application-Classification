# Contributing to Loan Application System

Thank you for your interest in contributing to the Loan Application Classification & Approval System! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this standard:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Be open to different viewpoints
- Act in the best interest of the community

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn
- Git
- Basic knowledge of TypeScript, React, Next.js

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/your-username/loan-application-system.git
cd loan-application-system

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Setup database
bun run db:push

# Start development server
bun run dev
```

### Understanding the Project

Before contributing, please read:

- [README.md](./README.md) - Project overview
- [LOAN_SYSTEM_README.md](./LOAN_SYSTEM_README.md) - System architecture
- [STATUS_MANAGEMENT_GUIDE.md](./STATUS_MANAGEMENT_GUIDE.md) - Status management
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## Development Workflow

### 1. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards below
- Add comments for complex logic
- Update relevant documentation

### 3. Test Your Changes

```bash
# Run linter
bun run lint

# Test the application manually
bun run dev
```

### 4. Commit Changes

Follow the [Commit Guidelines](#commit-guidelines) below.

```bash
git add .
git commit -m "type: description"
```

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types; use proper typing
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Enable strict type checking

**Good:**
```typescript
interface LoanApplication {
  id: string;
  applicantName: string;
  loanAmount: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

async function getApplication(id: string): Promise<LoanApplication | null> {
  // implementation
}
```

**Bad:**
```typescript
function getApplication(id: any): any {
  // implementation
}
```

### React/Next.js

- Use functional components with hooks
- Use `'use client'` for client-side code
- Use `'use server'` for server actions (if needed)
- Keep components small and focused
- Use proper prop types

**Good:**
```typescript
'use client';

interface LoanCardProps {
  application: LoanApplication;
  onView: (id: string) => void;
}

export function LoanCard({ application, onView }: LoanCardProps) {
  return <div>...</div>;
}
```

### Naming Conventions

- **Files**: kebab-case (`loan-application-form.tsx`)
- **Components**: PascalCase (`LoanApplicationForm`)
- **Functions/Variables**: camelCase (`getLoanApplications`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LOAN_AMOUNT`)
- **Types/Interfaces**: PascalCase (`LoanApplication`)

### Code Organization

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { LoanApplication } from '@/types';

// 2. Types/Interfaces
interface Props { ... }

// 3. Constants
const MAX_AMOUNT = 1000000;

// 4. Component
export function ComponentName({ ... }: Props) {
  // 5. Hooks
  const [state, setState] = useState();

  // 6. Event handlers
  const handleClick = () => { ... };

  // 7. Effects
  useEffect(() => { ... }, []);

  // 8. Helper functions
  const formatAmount = (amount: number) => { ... };

  // 9. Render
  return <div>...</div>;
}
```

### Error Handling

Always handle errors properly:

**Good:**
```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('Failed to fetch data:', error);
  toast.error('An error occurred. Please try again.');
  return null;
}
```

**Bad:**
```typescript
const result = await apiCall(); // No error handling
return result;
```

### API Routes

- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Validate input data
- Return appropriate status codes
- Include error messages
- Use try-catch for error handling

**Good:**
```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Process
    const result = await createApplication(body);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Styling

- Use Tailwind CSS classes
- Follow existing design patterns
- Use shadcn/ui components when possible
- Maintain consistency with existing UI

## Commit Guidelines

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

**Good commits:**
```
feat(api): add application filtering by status

Implement status filtering in the applications endpoint
to allow users to filter applications by pending,
approved, rejected, or under_review.

Closes #123
```

```
fix(ui): resolve modal overflow on mobile

The detail modal was not scrolling properly on small
screens due to incorrect max-height setting.
```

```
docs: update deployment guide with AWS ECS instructions

Add comprehensive guide for deploying to AWS ECS
including task definitions and service configuration.
```

**Bad commits:**
```
fix bug
update stuff
wip
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] Code is properly formatted
- [ ] No linting errors (`bun run lint`)
- [ ] Changes are tested manually
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have updated the documentation accordingly

## Related Issues
Closes #(issue number)
```

### PR Review Process

1. **Automated Checks**: CI runs linting and tests
2. **Peer Review**: At least one maintainer reviews
3. **Feedback**: Address any requested changes
4. **Approval**: Maintainer approves
5. **Merge**: Squash and merge to main

### Handling Feedback

- Respond to all comments
- Make requested changes or explain why not
- Be open to suggestions
- Keep discussions constructive

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Application starts without errors
- [ ] Loan submission works
- [ ] Dashboard loads correctly
- [ ] Status updates work
- [ ] Filters and search work
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Responsive design works on mobile

### Testing Different Scenarios

```typescript
// Example test cases
const testCases = [
  {
    name: 'Valid loan application',
    input: { loanAmount: 50000, creditScore: 700 },
    expected: { status: 'approved' }
  },
  {
    name: 'Low credit score',
    input: { loanAmount: 50000, creditScore: 500 },
    expected: { status: 'rejected' }
  },
  {
    name: 'High DTI ratio',
    input: { loanAmount: 100000, creditScore: 650, dti: 50 },
    expected: { status: 'rejected' }
  }
];
```

## Documentation

### When to Update Documentation

- Adding new features → Update README
- Changing API → Update API documentation
- Bug fixes → Update relevant guides
- Changing configuration → Update .env.example
- New deployment options → Update DEPLOYMENT.md

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep it up to date
- Use proper formatting (Markdown)

## Reporting Issues

### Before Reporting

- Search existing issues first
- Check if it's a configuration issue
- Verify you're using the latest version

### Issue Report Template

```markdown
## Description
Clear description of the problem.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.17.0]
- Bun version: [e.g., 1.0.0]

## Additional Context
Any other relevant information.
```

## Feature Requests

### Before Requesting

- Check if feature already exists
- Search for similar requests
- Consider if it fits the project scope

### Feature Request Template

```markdown
## Problem Statement
What problem does this solve?

## Proposed Solution
Detailed description of the proposed feature.

## Alternatives Considered
What alternatives did you consider?

## Additional Context
Any other relevant information.
```

## Questions and Discussions

For questions:
- Check documentation first
- Search GitHub Discussions
- Create a new discussion if needed

## Getting Help

- 📖 Read the documentation
- 💬 Start a GitHub Discussion
- 🐛 Report an issue
- 📧 Contact maintainers

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- Release notes
- Project README

## License

By contributing, you agree that your contributions will be licensed under the AGPL v3.0 License.

---

Thank you for contributing! 🎉
