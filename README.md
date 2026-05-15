# Loan Management System (LMS)

A complete, full-stack Loan Management System built with modern web technologies. This platform allows borrowers to apply for loans through a multi-step wizard, while internal executives manage the loan lifecycle (Sanction, Disbursement, Collection) via a secure, role-based Operations Dashboard.

## 🚀 Tech Stack

**Frontend:**
* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* React Hook Form & Zod (Validation)
* Axios (API calls)

**Backend:**
* Node.js & Express.js
* TypeScript
* MongoDB & Mongoose
* JWT & bcrypt (Authentication)
* Multer (File Uploads)

---

## ✨ Key Features

1. **Borrower Portal:**
   * Multi-step application wizard.
   * Business Rule Engine (BRE) validating Age, Salary, PAN, and Employment Status.
   * Secure Salary Slip upload (PDF/Image).
   * Interactive loan configuration sliders with live Simple Interest calculation.

2. **Operations Dashboard:**
   * **Sales Module:** Pre-application lead tracking.
   * **Sanction Module:** Review applications, inspect documents, approve, or reject with custom reasons.
   * **Disbursement Module:** Release funds for sanctioned loans.
   * **Collection Module:** Track active loans, outstanding balances, and record payments with unique UTR validation.
   * **Admin View:** System-wide metrics and KPIs.

3. **Security & Architecture:**
   * Strict Role-Based Access Control (RBAC) enforced on both Frontend and Backend API routes.
   * JWT-based authentication with HTTP-only conceptually handled via cookies/headers.
   * Centralized robust error handling.

---

## 🛠️ Local Setup Instructions

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (running locally on port 27017 or a MongoDB Atlas URI)

### 1. Clone & Install Dependencies

Open two terminal windows/tabs to run the backend and frontend simultaneously.

**Backend Setup:**
```bash
cd backend
npm install