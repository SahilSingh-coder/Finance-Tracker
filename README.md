# 💰 Finance Tracker

A full-stack personal finance management application built with the MERN stack. Finance Tracker allows users to securely manage their income and expenses, track transactions, visualize financial activity, and manage their account from a centralized dashboard.

🔗 **Live Application:** https://finance-tracker-1-e0o0.onrender.com

---

## 📌 Overview

Finance Tracker is a full-stack web application designed to make personal financial management simple and organized.

Users can create an account, securely log in, record income and expenses, manage transactions, view their financial summary, analyze spending patterns, and manage their profile.

The project was built from scratch with a focus on:

- RESTful API development
- Authentication and authorization
- Database design
- CRUD operations
- Frontend-backend integration
- Secure password handling
- Data visualization
- Production deployment

---

## ✨ Features

### 🔐 Authentication & Security

- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt
- Change password
- Forgot password functionality
- Password reset using secure reset tokens
- Authentication rate limiting
- Helmet security headers
- Environment variables for sensitive configuration

### 💳 Transaction Management

- Add income transactions
- Add expense transactions
- Edit transactions
- Delete transactions
- Transaction categories
- Transaction descriptions
- Transaction dates
- Search transactions
- Filter transactions

### 📊 Dashboard

The dashboard provides a quick overview of the user's financial activity:

- Total balance
- Total income
- Total expenses
- Recent transactions

### 📈 Analytics

The analytics section provides visual insights into financial activity using charts.

- Income analysis
- Expense analysis
- Category-based spending visualization
- Interactive charts using Recharts

### 👤 Profile Management

Users can:

- View their profile
- Update name
- Update email
- Change password
- Reset forgotten passwords

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Recharts
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Nodemailer
- Helmet
- express-rate-limit

## Database

- MongoDB Atlas

## Deployment & Development

- Git
- GitHub
- Render
- MongoDB Atlas

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                          REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      + Node.js      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        JWT Authentication   Mongoose       Nodemailer
              │                │                │
              │                ▼                │
              │        ┌───────────────┐        │
              │        │    MongoDB    │        │
              │        │     Atlas     │        │
              │        └───────────────┘        │
              │                                 │
              └────────── Password Reset ───────┘
