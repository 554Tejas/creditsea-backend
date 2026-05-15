# 🌊 CreditSea - Backend API

This repository contains the backend Node.js / Express REST API for the **CreditSea Loan Management System (LMS)**. It powers the Business Rule Engine (BRE), handles role-based access control (RBAC), and manages secure data storage via MongoDB.

## 🚀 Live API
* **Base URL:** [Insert your Render URL here]

## ✨ Key Features
* **Business Rule Engine (BRE):** Automated logic to evaluate loan applications based on applicant income and employment data.
* **Role-Based Access Control (RBAC):** Secure middleware ensuring Borrowers, Sanction Officers, Disbursement Officers, and Collection Officers only access their designated endpoints.
* **Stateless Authentication:** JWT-based user authentication with securely hashed passwords using `bcryptjs`.
* **Security First:** Implements `cors`, `helmet`, and `morgan` for secure cross-origin requests, HTTP header protection, and request logging.
* **Database Management:** MongoDB Atlas integration using Mongoose for robust data modeling.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB Atlas (Mongoose ORM)
* **Auth:** JSON Web Tokens (JWT)

## 💻 Local Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/creditsea-backend.git
cd creditsea-backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Server
```bash
# Run in development mode (with hot-reloading)
npm run dev

# Run in production mode
npm run build
npm start
```
The server will start on `http://localhost:5000`.

## 📂 Project Structure
* `/src/controllers` - Route logic and business operations.
* `/src/models` - Mongoose database schemas (User, Loan, etc.).
* `/src/routes` - API route definitions.
* `/src/middlewares` - Auth, error handling, and RBAC protection.
* `/src/utils` - Helper functions and error classes.
