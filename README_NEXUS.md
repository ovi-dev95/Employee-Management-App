# NEXUS Platform

The "Single Source of Truth" intranet for Web, SEO, Paid Media, and UI/UX teams.

## 🚀 Quick Start

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Initialize Database**:
    ```bash
    pnpm exec prisma migrate dev --name init
    npx tsx prisma/seed.ts
    ```

3.  **Run Development Server**:
    ```bash
    pnpm dev
    ```

4.  **Open in Browser**:
    http://localhost:3000

## 🔑 Access Credentials (Mock)

-   **Login URL**: `/login` (or click "Secure Access" on home)
-   **Email**: `admin@nexus.com` (Any email works for demo)
-   **Password**: `any` (Mock auth)

## 🏗 Modular Architecture

### Module 1: Request Engine (`/dashboard/requests`)
-   Submit Bug Reports, Design Requests, and Content Briefs.
-   *Next Step: Connect `onSubmit` to Zapier/ClickUp webhook.*

### Module 2: The Brain (`/dashboard/university`)
-   Searchable SOP Wiki and Knowledge Base.
-   Filter by category (Web Dev, SEO, etc.).

### Module 3: Sync Station (`/dashboard/schedule`)
-   Booking interface for 1:1s and Team Rooms.
-   *Ready for Calendly Embed integration.*

### Module 4: Product Lab (`/dashboard/product-lab`)
-   Internal Innovation Board.
-   Post ideas, upvote, and track status (Kanban-style badges).

### Module 5: The Pulse (`/dashboard`)
-   Live Analytics Dashboard.
-   Attendance Widget (Clock In/Out).
-   Announcements & Tasks.

## 🛠 Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS + Lucide Icons
-   **Animations**: Framer Motion
-   **Database**: SQLite + Prisma ORM
-   **Forms**: React Hook Form + Zod Validation

## 🎨 customizable Design

-   **Dark Mode**: Native support (toggle via system prefs or extend `globals.css`).
-   **Components**: Reusable UI components in `src/components/ui`.
