# ✈️ SkyBook - Flight Booking System

A full-stack **Flight Management System** built with **React.js**, **Node.js (Express)**, and **MongoDB**. Allows users to search flights, manage bookings, track itineraries, and provides an admin panel for flight and user management.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green?logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-Payment-purple?logo=stripe)

---

## 📸 Screenshots

### Home Page - Flight Search
> Modern search interface with destination suggestions and popular routes

### Search Results
> Filtered results with sort options (price, duration, stops)

### Booking Flow
> 3-step booking: Passenger Details → Payment → Confirmation

### Admin Dashboard
> Stats overview, flight management, booking management, user management, revenue analytics

---

## 🚀 Features

### User Features
- 🔍 **Flight Search** - Search by destination, date, passengers with real-time filters
- 📋 **Flight Details** - View amenities, baggage allowance, pricing by class
- 🎫 **Booking Management** - Book flights, view bookings, cancel with refund calculation
- 💳 **Secure Payments** - Stripe integration with payment intent flow
- ✅ **Online Check-in** - Check in 24 hours before departure
- 📧 **Email Notifications** - Booking confirmation, cancellation, reminders
- 🔐 **Authentication** - JWT-based auth with registration & login

### Admin Features
- 📊 **Dashboard** - Real-time stats (users, flights, bookings, revenue)
- ✈️ **Flight Management** - Add, edit, delete flights, update status
- 📑 **Booking Management** - View all bookings, filter by status
- 👥 **User Management** - View users, search, manage accounts
- 📈 **Revenue Analytics** - Monthly revenue charts, conversion rates, avg booking value

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router, React Icons, React Toastify |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **Payments** | Stripe API |
| **Styling** | Custom CSS (responsive, modern UI) |

---

## 📁 Project Structure

```
flight-booking-system/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── FlightCard.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js
│   │   │   ├── SearchResults.js
│   │   │   ├── FlightDetails.js
│   │   │   ├── BookingPage.js
│   │   │   ├── MyBookings.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── AdminDashboard.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                    # Mongoose Models
│   ├── User.js
│   ├── Flight.js
│   └── Booking.js
├── routes/                    # API Routes
│   ├── auth.routes.js
│   ├── flight.routes.js
│   ├── booking.routes.js
│   ├── payment.routes.js
│   └── admin.routes.js
├── middleware/
│   └── auth.js                # JWT Auth Middleware
├── seed.js                    # Database Seeder
├── server.js                  # Express Server
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flight-booking-system.git
cd flight-booking-system

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with sample flights
node seed.js

# Run backend & frontend together
npm run dev        # Backend on port 5000
npm run client     # Frontend on port 3000
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### Flights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights/search` | Search flights with filters |
| GET | `/api/flights/:id` | Get flight details |
| GET | `/api/flights/popular/routes` | Popular routes |
| GET | `/api/flights/status/:flightNumber` | Flight status |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | User's bookings |
| GET | `/api/bookings/:id` | Booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/checkin` | Online check-in |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| POST | `/api/admin/flights` | Create flight |
| PUT | `/api/admin/flights/:id` | Update flight |
| DELETE | `/api/admin/flights/:id` | Delete flight |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/bookings` | All bookings |

---

## 📜 License

MIT License - feel free to use this project for your portfolio or learning.

---

**Built with ❤️ using React, Node.js & MongoDB**

