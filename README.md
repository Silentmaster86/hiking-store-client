# Hiking Store — Junior Frontend Portfolio Project

A modern **e-commerce web application** built as a **portfolio project for a Junior Frontend Developer role**.

The goal of this project was to demonstrate real-world frontend skills such as **React architecture, API integration, state management, routing, UX polish**, and collaboration with a backend API — without overengineering.

Live demo: [https://hiking-store-uk.netlify.app](https://hiking-store-uk.netlify.app)

---

## Tech Stack

**Frontend**

* React (Vite)
* React Router (SPA navigation)
* Styled-components
* Context API (cart state)
* Fetch API

**Backend (provided / integrated)**

* Node.js + Express
* PostgreSQL
* Sessions & cookies (guest checkout)
* Hosted on Render

**Deployment**

* Netlify (frontend)
* Render (backend)

---

## Key Features

### 🛒 Shopping & Cart

* Product list fetched from API
* Add to cart / remove / quantity update
* Server-side cart stored in session
* Cart persists across page reloads

### ✅ Checkout Flow

* Guest checkout (no login required)
* Form validation (email, address, postcode)
* POST `/checkout` integration
* Cart is cleared after successful checkout

### 📦 Orders

* Order confirmation page with order number & total
* Orders stored in database
* Protected order details page (auth required)
* Friendly error handling (401, empty states)

### 🎨 UI & UX

* Responsive layout (mobile & desktop)
* Loading states & disabled buttons during requests
* Clear success & error messages
* Consistent design system using styled-components

---

## What I Learned

During this project I learned how to:

* Build a **realistic React application structure**
* Work with a backend API and handle async states
* Manage global state (cart) using Context API
* Implement a full checkout flow without payments
* Handle edge cases (empty cart, unauthorized access)
* Debug API issues using browser DevTools
* Improve UX with loading & error states

---

## Project Scope (Intentional Decisions)

To keep the project focused on **frontend fundamentals**, the following features were intentionally **not implemented**:

* Payments (e.g. Stripe)
* Admin panel
* User authentication UI
* Stock management
* Email notifications

These features are outside the scope of a Junior Frontend portfolio and would add unnecessary complexity.

---

## Screenshots

> Add screenshots of:
>
> * Products page
> * Cart drawer
> * Checkout page
> * Order confirmation page

---

## How to Run Locally

```bash
npm install
npm run dev
```

Make sure the backend API is running or update the API base URL in the config.

---

## Author

**Przemysław Pietkun**
Junior Frontend Developer
GitHub: [https://github.com/Silentmaster86](https://github.com/Silentmaster86)
Portfolio: [https://silent86.netlify.app](https://silent86.netlify.app)

---

This project is part of my journey transitioning into a professional frontend development role and showcases my practical React skills.
