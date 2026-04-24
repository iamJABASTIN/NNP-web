# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Development Server: `npm run dev`
- Preview Production Build: `npm run preview`

## Architecture & Structure
The project is a React-based web application serving as the Customer Ordering Interface and Admin Dashboard for a Smart Restaurant Management System.

### Core Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion (motion), Lucide React.
- **Backend/Database**: Supabase (PostgreSQL) for real-time data synchronization.
- **Routing**: React Router DOM.

### Key Directory Structure
- `src/pages/`: Main view components (AdminDashboard, AuthPage, MenuPage).
- `src/components/`: Reusable UI elements, split by domain (Admin, Auth, Menu, Navigation).
- `src/sections/`: Large page sections (Hero, About, Footer, etc.).
- `src/hooks/`: Custom React hooks for business logic and data fetching (e.g., `useMenu`, `useOrderTracking`, `useSession`).
- `src/lib/`: External service configurations (e.g., `supabase.js` for Supabase client).
- `src/constants/`: Static configuration and styles.

### System Flow
The web app interacts with a Supabase backend to manage:
1. **Customer Ordering**: Menu browsing, cart management, and order placement via QR code access.
2. **Admin Management**: Menu updates, user/cook management, and sales overview.
3. **Real-time Updates**: Order status changes (Preparing -> Ready) are synced via Supabase.

### Important
The generated code will be reviewed by the CodeX.