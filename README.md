# MilhasPix

This project is a technical test for an interview, featuring a modern Next.js application for managing airline miles and offers. It is built with NextJS, TypeScript, React Query, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Start the development server with Turbopack for faster builds:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

This project includes comprehensive testing setup with both unit tests and end-to-end tests.

### Unit Tests (Vitest)

Run unit tests:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

### End-to-End Tests (Playwright)

Run E2E tests:

```bash
pnpm e2e
```

Run E2E tests with UI:

```bash
pnpm e2e:ui
```

## 🏗️ Architecture

### Feature-Based Structure

The project follows a feature-based architecture where each feature (`announcement`, `offers`) is self-contained with:

- **API Layer**: Data fetching and API calls
- **Components**: Feature-specific React components
- **Types**: TypeScript type definitions
- **Schemas**: Zod validation schemas
- **Business Logic**: Pure functions for data processing

## 📁 Project Structure

```
milhaspix/
├── app/                         # Next.js App Router pages
│   ├── announcement/            # Announcement feature pages
│   │   ├── layout.tsx           # Layout for announcement pages
│   │   └── page.tsx             # Main announcement page
│   ├── api/                     # API routes
│   │   ├── announcement/        
│   │   ├── simulate-offers-list/ 
│   │   └── simulate-ranking/    
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # Reusable UI components
│   ├── ui/                      # Base UI components (Radix UI)
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...                  # Other UI components
│   └── header.tsx               # Main header component
├── features/                    # Feature-based modules
│   ├── announcement/            # Announcement feature
│   │   ├── api/                 # API layer
│   │   ├── components/          # Feature-specific components
│   │   ├── constants.ts         # Feature constants
│   │   ├── ctx.tsx              # React context
│   │   ├── fn.ts                # Business logic functions
│   │   ├── schemas.ts           # Zod validation schemas
│   │   └── types.ts             # TypeScript types
│   └── offers/                  # Offers feature
│       ├── api/                 # API layer
│       ├── components/          # Feature components
│       ├── constants.ts
│       └── types.ts
├── hooks/                       # Custom React hooks
│   ├── use-debounce.ts
│   └── use-mobile.ts
├── lib/                         # Utility functions
│   └── utils.ts
├── providers/                   # React context providers
│   └── query-provider.tsx       # React Query provider
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   ├── loadicon.tsx
│   ├── plane.tsx
│   └── zap.tsx
├── _e2e_/                       # End-to-end tests
│   ├── announcement.spec.ts     # E2E test specs
│   ├── results/                 # Test results
│   └── report/                  # Test reports
└── config files                 # Configuration files
    ├── biome.json               # Biome configuration
    ├── components.json          # shadcn/ui configuration
    ├── next.config.ts           # Next.js configuration
    ├── playwright.config.ts     # Playwright configuration
    ├── tailwind.config.ts       # Tailwind CSS configuration
    ├── tsconfig.json            # TypeScript configuration
    └── vitest.config.ts         # Vitest configuration
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Playwright Documentation](https://playwright.dev/)
