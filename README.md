# Compensation Intelligence System

A structured, queryable, comparable salary database for Indian tech roles. 
Built with Next.js, Express, Prisma, and PostgreSQL.

## Live Links
- **Frontend**: [Your Vercel URL Here]
- **Backend**: [Your Railway URL Here]
- **GitHub Repo**: [Your Repo URL Here]

## Local Setup

### Backend
1. `cd backend`
2. `npm install`
3. Set up `.env` with a local PostgreSQL `DATABASE_URL`
4. `npx prisma migrate dev --name init`
5. `npm run seed`
6. `npm run dev` (Runs on `http://localhost:3001`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Set up `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001`
4. `npm run dev` (Runs on `http://localhost:3000`)

## API Documentation

### 1. `POST /ingest-salary`
Stores a new salary record. Validates all inputs and checks for duplicates.
- **Body**: `{ company, role, level, location, experience_years, base_salary, bonus?, stock?, confidence? }`
- **Response (201)**: The created Salary object.

### 2. `GET /salaries`
Fetches salary records with filtering and sorting.
- **Query Params**: `company`, `role`, `level`, `location`, `sortBy`, `order`.
- **Response (200)**: `{ count: 0, data: [] }`

### 3. `GET /company/:company`
Fetches median stats, level distribution, and all salary records for a specific company.
- **Params**: `company` (String)
- **Response (200)**: `{ company, total_records, median_total_compensation, level_distribution, salaries }`

### 4. `GET /compare`
Compares two specific salary records.
- **Query Params**: `salaryId1`, `salaryId2`
- **Response (200)**: `{ salary1, salary2, difference: { base_salary, bonus, stock, total_compensation, level_same } }`

## Seed Data Details
- **Companies**: Google, Microsoft, Amazon, Flipkart, Razorpay, Atlassian.
- **Levels**: L4, L5, L6, SDE2.
