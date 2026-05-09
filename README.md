# ExpertConnect — Real-Time Expert Session Booking System

A full-stack web application for booking sessions with domain experts in real-time.

## Tech Stack
- **Frontend:** React.js, Socket.io-client, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Socket.io
- **Database:** MongoDB (Mongoose ODM)

## Features
- Browse and search experts by name and category
- Filter with pagination
- Real-time slot updates via Socket.io
- Double booking prevention (application + DB level)
- Full booking flow with form validation
- View bookings by email with status tracking

## Project Structure
expert-booking/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Error handler
│   └── server.js
└── frontend/
└── src/
├── pages/      # ExpertList, ExpertDetail, Booking, MyBookings
├── components/
├── context/    # Socket context
└── utils/      # Axios instance

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experts` | Get experts (pagination + filter) |
| GET | `/api/experts/:id` | Get expert by ID |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings?email=` | Get bookings by email |
| PATCH | `/api/bookings/:id/status` | Update booking status |

## Run Locally

### Backend
```bash
cd backend
npm install
# create .env from .env.example
npm run dev
```

### Seed Data
```bash
node seed.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Critical Requirements Implemented
- **Double Booking Prevention:** Atomic MongoDB `findOneAndUpdate` with `isBooked: false` guard + unique compound index on `(expertId, date, timeSlot)`
- **Real-Time Updates:** Socket.io emits `slot_booked` event on every booking, all connected clients update instantly
- **Error Handling:** Global error middleware, meaningful API responses, frontend validation