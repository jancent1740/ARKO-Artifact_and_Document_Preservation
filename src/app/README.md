# UNC Digital Museum

A comprehensive web application for the University of Nueva Caceres Digital Museum, featuring historical collections, educational resources, and a complete membership management portal.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open automatically at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (outputs to `/dist`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
├── src/
│   └── main.tsx              # Application entry point
├── App.tsx                   # Main app component with routing
├── components/               # Reusable React components
│   ├── curator/             # Curator dashboard components
│   ├── staff/               # Staff dashboard components
│   ├── portal/              # Portal & authentication components
│   ├── ui/                  # shadcn/ui components
│   └── figma/               # Figma imported components
├── pages/                   # Main application pages
│   ├── Homepage.tsx
│   ├── Collections.tsx
│   ├── EducationalResources.tsx
│   └── ExclusiveCollections.tsx
├── imports/                 # Figma imported components
├── styles/                  # Global styles and CSS
├── types/                   # TypeScript type definitions
├── data/                    # Mock data and constants
└── public/                  # Static assets

```

## 🎨 Features

### Main Application
- **Homepage** - Landing page with featured collections
- **Collections** - Browse and search museum collections
- **Educational Resources** - Access teaching materials and research tools
- **Exclusive Collections** - Member-only content

### Membership Portal
- **Role-based Authentication** - 5 user roles (General Public, Researcher, Educator, Curator, Staff)
- **Member Dashboard** - Personalized dashboard with role-specific features
- **Membership Tiers** - Weekly, Monthly, and Yearly subscriptions
- **Payment Processing** - Multiple payment methods (Credit Card, Debit Card, GCash, PayPal)

### Admin Dashboards
- **Curator Dashboard** - Complete ARKO system for managing collections, items, and condition reports
- **Staff Dashboard** - Digital archives and item management
- **Analytics** - Visit tracking and member statistics

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Charts**: Recharts

## 🎯 Development

### Code Structure
- Components are organized by feature/domain
- Lazy loading is used for page components
- Path aliases are configured for clean imports:
  - `@/` - Root directory
  - `@components/` - Components directory
  - `@pages/` - Pages directory
  - `@imports/` - Figma imports

### Performance Optimizations
- Lazy loading for routes
- Code splitting with manual chunks
- Image optimization
- CSS purging in production
- Fast Refresh for instant updates

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `/dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

The application can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

See `DEPLOYMENT-GUIDE.md` for detailed deployment instructions.

## 📚 Documentation

- `SYSTEM-README.md` - Complete system documentation
- `MUSEUM-PORTAL-README.md` - Portal system guide
- `CURATOR_ROUTING.md` - Curator dashboard routing
- `DEPLOYMENT-GUIDE.md` - Deployment instructions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 📝 License

Copyright © 2024 University of Nueva Caceres

## 👥 Support

For support and questions, please refer to the documentation files or contact the development team.
