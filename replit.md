# Beer Inventory Management System

## Overview

This is a full-stack beer inventory management system built with React, Express, TypeScript, and PostgreSQL. The application features a French dark-themed interface optimized for tablet use, allowing users to manage beer types and track keg counts with an intuitive card-based layout.

## User Preferences

- Preferred communication style: Simple, everyday language (French)
- Interface: French language, dark theme, tablet-optimized
- Design: Minimal, clean interface without unnecessary elements
- Layout: Card-based beer inventory with compact controls

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Validation**: Zod schemas for request/response validation
- **API Pattern**: RESTful API design

## Key Components

### Database Schema
- **Beer Types Table**: Stores beer information (id, name, keg_count)
- **Users Table**: Basic user structure (placeholder for future auth)
- **Migrations**: Drizzle-managed schema migrations

### API Endpoints
- `GET /api/beer-types` - Fetch all beer types
- `POST /api/beer-types` - Create new beer type
- `DELETE /api/beer-types/:id` - Remove beer type
- `PATCH /api/beer-types/:id/adjust` - Update keg count (implied from frontend)

### Frontend Features
- Beer inventory dashboard
- Add new beer types with validation
- Adjust keg counts (increase/decrease)
- Delete beer types with confirmation
- Responsive design with mobile support
- Toast notifications for user feedback

## Data Flow

1. **Client Requests**: Frontend makes HTTP requests through the apiRequest utility
2. **API Layer**: Express routes handle requests with Zod validation
3. **Storage Layer**: Database storage class abstracts Drizzle ORM operations
4. **Database**: PostgreSQL stores persistent data
5. **Response**: JSON responses sent back to frontend
6. **State Management**: React Query manages caching and synchronization

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation
- **wouter**: Minimal router

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- Uses Vite dev server with HMR (Hot Module Replacement)
- TSX for running TypeScript server code directly
- Environment-based configuration for database connections

### Production Build
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command
4. **Deployment**: Single Node.js process serves both API and static files

### Configuration Requirements
- `DATABASE_URL`: PostgreSQL connection string (required)
- Environment variables loaded for database configuration
- Neon serverless WebSocket configuration for database connections

### File Structure
- `/client`: Frontend React application
- `/server`: Backend Express application
- `/shared`: Shared TypeScript types and schemas
- `/migrations`: Database migration files
- Root-level config files for build tools and TypeScript

## Recent Changes

### January 22, 2025
- ✅ Added dotenv support for .env file reading on Windows
- ✅ Created Windows batch scripts (start-dev.bat, create-env.bat) for easy setup
- ✅ Improved error handling for missing environment variables
- ✅ Added comprehensive installation guides (README.md, INSTALLATION.md)
- ✅ Configured cross-env for Windows compatibility
- ✅ Fixed PostgreSQL permissions and Docker setup instructions