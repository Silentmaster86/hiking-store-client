# Hiking Store — Portfolio Project — React E-commerce Frontend

A modern **e-commerce web application** built as a **portfolio project for a Junior Frontend Developer role**.

This project simulates a real-world online store and focuses on demonstrating **frontend engineering skills**, clean architecture, API integration, and UX best practices — while intentionally avoiding overengineering.

## Architecture

* React SPA with REST API backend
* Server-side sessions for cart & auth
* Frontend focused on UX, async state handling, and clean separation of concerns


👉 Live demo:  
https://hiking-store-uk.netlify.app

---

## 🎯 Project Goals

The main goals of this project were to:

* Build a realistic React SPA with clean structure
* Integrate with a real backend API
* Handle async states, errors, and edge cases
* Demonstrate production-style UX patterns
* Show how a frontend works with sessions & server state
* Create a portfolio-ready project similar to real commercial work

---

## Tech Stack

### Frontend

* React (Vite)
* React Router (SPA navigation)
* Styled-components
* Context API (global cart & auth state)
* Fetch API
* Responsive design (mobile-first)

### Backend (integrated)

* Node.js + Express
* PostgreSQL
* Server-side sessions & cookies
* Guest + authenticated carts
* Hosted on Render

### Deployment

* Netlify — frontend
* Render — backend API
* PostgreSQL — database

---

## Key Features

### 🛒 Shopping & Cart

* Product list fetched from REST API
* Category filtering & navigation
* Add to cart / remove / quantity update
* Server-side cart stored in session
* Cart persists across page reloads
* Guest + logged-in user cart support

### ✅ Checkout Flow

* Guest checkout (no login required)
* Form validation (email, address, postcode)
* POST `/checkout` integration
* Order creation in database
* Cart is cleared after successful checkout

### 📦 Orders

* Order confirmation page with order number & total
* Orders stored in PostgreSQL
* Protected order details page (auth required)
* Friendly empty states & error handling (401, 404)

### 🔐 Authentication

* Email + password authentication
* Session-based auth
* OAuth login (Passport.js):
  * Google
  * Facebook
* Protected routes for user-specific data

### 🎨 UI & UX

* Responsive layout (mobile & desktop)
* Skeleton loaders & loading states
* Disabled buttons during requests
* Clear success & error messages
* Consistent design system with styled-components
* Category tiles & chips navigation

---

## What I Learned

During this project I practiced and improved:

* Designing a **realistic React app architecture**
* Working with a real backend API
* Managing global state with Context API
* Handling async loading & error states
* Building session-based cart logic
* Implementing protected routes
* Debugging API & auth issues
* Improving UX with skeleton loaders & feedback
* Working with cookies & CORS in production

---

## Project Scope (Intentional Decisions)

To keep the project focused on **frontend fundamentals**, the following features were intentionally **not implemented yet**:

* Payments (e.g. Stripe)
* Admin panel
* Product management UI
* Stock & inventory management
* Email notifications

These features are outside the scope of a Junior Frontend portfolio and would add unnecessary complexity.

---

## 📸 Screenshots

### Home Page
![Home Page Screenshot](./src/assets/screenshots/home.png)

### Products Page
![Products Page Screenshot](./src/assets/screenshots/products.png)

### Category Boots
![Category boots Page Screenshot](./src/assets/screenshots/category_boots.png)

### Cart Drawer
![Cart Drawer Screenshot](./src/assets/screenshots/cartDrawer.png)

### Checkout Page
![Checkout Page Screenshot](./src/assets/screenshots/checkout.png)

### Order Confirmation Page
![Order Confirmation Screenshot](./src/assets/screenshots/order_confirmation.png)

---


## Environment Variables

The frontend expects the following environment variables:

```env
VITE_API_URL=https://your-backend-api-url

## Example
VITE_API_URL=http://localhost:5000

---

## B) API & Sessions (ważne przy cart)

Dodaj krótką sekcję:

```md
## Sessions & Cookies

This application uses **server-side sessions and cookies** for:

* Guest carts
* Authenticated user carts
* Authentication state

Because of this:

* Cookies must be enabled
* The app requires an active backend connection
* Offline checkout is not supported

## Known Limitations

* Checkout requires an active backend connection
* Cart is stored in server session (not localStorage)
* Offline mode is limited (no offline checkout)
* Payments are not implemented (portfolio scope)

## How to Run Locally

```bash
npm install
npm run dev
