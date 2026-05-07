# PayMatrix 💸
**A Production-Grade Compensation Intelligence System**

![PayMatrix Dashboard Placeholder](https://via.placeholder.com/1000x400?text=PayMatrix+Dashboard)

PayMatrix is a full-stack, structured compensation intelligence platform inspired by the analytical rigor of Levels.fyi. Instead of relying on fragmented, unstructured job titles (e.g., "Software Developer" vs. "Backend Engineer"), PayMatrix enforces strict level standardization across companies. 

By translating raw salary data into a **Structured → Queryable → Comparable → Decision-ready** format, it enables engineers to make high-signal, data-driven career decisions.

## ✨ Core Features
* **Strict Level Standardization:** Enforces structured technical tiers (L4, SDE2, STAFF) rather than unstructured strings, ensuring true 1-to-1 mathematical comparability.
* **Intelligent Search & Discovery:** Debounced, multi-parameter filtering across companies, roles, levels, and locations.
* **Company Analytics:** Dynamic aggregation routes that calculate Median Total Compensation and generate proportional Level Distribution charts.
* **Side-by-Side Comparison Engine:** Interactive selection logic allows users to compare any two roles in the database. A differential math engine calculates the exact gap in base, bonus, stock, and total compensation with color-coded (red/green) highlights.
* **Decision-Ready UX:** Next.js Server Components and Tailwind CSS deliver rapid load times, smooth interactive states, and plain-English "Decision Summary" banners.

## 🛠️ Tech Stack
This repository utilizes a modern, decoupled monorepo architecture designed for type safety and horizontal scalability:
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Validation:** Zod (Strict runtime schema validation)
* **CI/CD:** GitHub Actions
* **Infrastructure:** Vercel (Frontend), Railway (Backend & DB)

## 🚀 Live Demo
* **Frontend Application:** [Your Vercel URL Here]
* **Backend API:** [Your Railway URL Here]

## 💻 Local Development Setup

### 1. Database & Backend Setup
```bash
cd backend
npm install

# Set up your environment variables
cp .env.example .env
# Edit .env to include your local PostgreSQL connection string

# Run migrations to build the tables
npx prisma migrate dev --name init

# Seed the database with 25 initial baseline records
npm run seed

# Start the backend server (Runs on http://localhost:3001)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Set up your environment variables
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL is set to http://localhost:3001

# Start the Next.js development server
npm run dev
```

## 📡 API Documentation

### `POST /ingest-salary`
Ingests and validates new compensation data. Rejects negative numbers, calculates total compensation natively on the server, and prevents duplicate submissions.
* **Payload:** `{ company, role, level, location, experience_years, base_salary, bonus?, stock?, confidence? }`

### `GET /salaries`
The core discovery engine.
* **Query Params:** `company`, `role`, `level`, `location`, `sortBy`, `order`

### `GET /company/:company`
Returns mathematical aggregations for a specific organization.
* **Response:** `{ company, total_records, median_total_compensation, level_distribution, salaries }`

### `GET /compare`
The differential engine. Accepts two record IDs and subtracts them field-by-field.
* **Query Params:** `salaryId1`, `salaryId2`
* **Response:** Returns both salary objects, plus a `difference` object mapping the exact financial gap.

## 🏗️ Architecture & Philosophy
Unlike generic job portals, PayMatrix relies heavily on PostgreSQL's `@default(0)` constraints and Prisma's `enum` types to eradicate null-pointer exceptions and unstructured title inflation. Every piece of logic is decoupled: the Express API handles mathematical routing, Zod provides an impenetrable validation wall, and Next.js simply renders the intelligence beautifully to the user.
