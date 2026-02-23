# CheesePuff Admin - Cattery Management System

A modern cattery management dashboard built with Shadcn UI, providing comprehensive cat management, multi-store support, and AI-powered features.

![CheesePuff Admin](public/images/shadcn-admin.png)

## Overview

CheesePuff Admin is a full-featured cattery management system that supports:

- 🐱 Complete cat information management (CRUD)
- 🏪 Multi-store management
- ⚙️ System configuration management
- 🤖 AI-powered smart fill functionality
- 📊 Data visualization (planned)
- 🎨 Dark/light theme support
- 📱 Responsive design with mobile support

## Tech Stack

**Frontend Framework**:
- React 19
- TypeScript 5
- Vite 7

**UI Components**:
- Shadcn UI (Radix UI + Tailwind CSS v4)
- Lucide Icons

**Routing & State**:
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Zustand (state management)

**Form & Validation**:
- React Hook Form
- Zod (schema validation)

**Development Tools**:
- ESLint (linting)
- Prettier (code formatting)
- Knip (unused code analysis)

**Authentication**:
- Custom JWT authentication (partial implementation)

## Features

### ✅ Implemented

- **Cat Management**
  - Full CRUD operations
  - AI smart fill (breed, description, price, etc.)
  - Batch delete
  - Advanced filtering (breed, status, store)
  - Pagination and sorting
  - URL state sync (shareable links)

- **Store Management**
  - Dynamic store configuration
  - Store enable/disable
  - Multi-store data isolation

- **System Configuration**
  - Breed management
  - Status management
  - Personalization settings

- **UI/UX**
  - Dark/light theme
  - Responsive sidebar
  - Global search command
  - Toast notifications
  - Confirmation dialogs

### 🚧 Planned

- Health record management
- Sales order management
- Data visualization reports
- Batch import/export
- Full permission management

## Quick Start

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Installation

```bash
git clone <repository-url>
cd CheesePuff-Admin
pnpm install
```

### Development Server

```bash
pnpm run dev
```

Visit `http://localhost:5173` to view the application

### Production Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t cheesepuff-admin:latest .
```

### Run Container

```bash
docker run -p 8080:80 cheesepuff-admin:latest
```

Visit `http://localhost:8080` to view the application

### Using Docker Compose

```bash
docker-compose up -d
```

For detailed deployment documentation, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Project Structure

```
src/
├── api/                    # API service layer
│   ├── services/          # Business services (auth, cats, stores, etc.)
│   └── types/             # API type definitions
├── components/            # Shared components
│   ├── ui/               # Shadcn UI base components
│   ├── data-table/       # Data table components
│   └── layout/           # Layout components
├── features/             # Feature modules (business domain)
│   ├── cats/            # Cat management
│   ├── auth/            # Authentication module
│   ├── settings/        # Settings module
│   └── ...
├── routes/              # TanStack Router routes
│   ├── (auth)/         # Authentication pages
│   └── _authenticated/ # Authenticated pages
├── stores/             # Zustand state management
├── hooks/              # Custom Hooks
├── lib/                # Utility functions
└── context/            # Context Providers
```

## Common Commands

```bash
# Development
pnpm run dev              # Start development server

# Build
pnpm run build           # Build for production
pnpm run preview         # Preview production build

# Code Quality
pnpm run lint            # Run ESLint
pnpm run format          # Format code with Prettier
pnpm run knip            # Analyze unused code

# Docker
docker build -t cheesepuff-admin:latest .
docker run -p 8080:80 cheesepuff-admin:latest
```

## Configuration

### Environment Variables

```bash
# API Mock (development only)
VITE_API_MOCK=true

# API Base URL (production)
VITE_API_BASE_URL=https://api.example.com
```

### Path Aliases

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`

## Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use functional components with Hooks
- Prioritize Zustand for state management
- Use Zod schemas for form validation
- No `console.log` (use toast notifications instead)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Author

Mr.Aloong

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com) for excellent UI components
- [TanStack](https://tanstack.com) for powerful routing and query tools
- [Vite](https://vitejs.dev) for lightning-fast build experience
