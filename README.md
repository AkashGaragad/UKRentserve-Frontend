# UKRentserver – React Frontend (Vite + Tailwind CSS v4)

A fully connected React (JSX) + Tailwind CSS v4 frontend built with full reference to `UKRentserver.html` and integrated with `nuk-rentserve-backend` REST API.

> **Zero backend files were modified.** All connectivity, authentication, error tolerance, and API handling are managed entirely from the client side.

---

## 🚀 Key Pages & Routes

| Route | Page | Purpose & API Integration |
|---|---|---|
| `/` | `Home.jsx` | Platform overview (Services, Rentals, Rides), hero animation, real imagery |
| `/services` | `Services.jsx` | Category picker, filters (4.5+, nearby, instant, verified), provider cards, instant booking via `POST /api/v1/bookings` |
| `/rentals` | `Rentals.jsx` | Rentals vs Stays switch, Rating/Distance/Price sort chips, listings grid via `GET /api/v1/properties` |
| `/rentals/:id` | `HotelDetail.jsx` | 5-slot photo gallery, check-in/out times, amenities, Google Maps link, reservation via `POST /api/v1/bookings` |
| `/rides` | `Rides.jsx` | Instant ride vs Pre-book cab, vehicle selector (Bike, Auto, Cab), fare calculator, booking via `POST /api/v1/transport-bookings` |
| `/auth` | `Auth.jsx` | Sign in & Register (Customer / Owner), Phone OTP, 1-Click Demo accounts |
| `/my-bookings` | `MyBookings.jsx` | Live service & property bookings list (`GET /api/v1/bookings/mine`), status tracking, cancellation (`PATCH .../status`) |
| `/my-rides` | `MyRides.jsx` | Transport bookings history (`GET /api/v1/transport-bookings/mine`), assigned driver info, direct call/chat shortcuts |
| `/profile` | `Profile.jsx` | User profile details, verification badge, edit contact details (`PATCH /api/v1/users/me`), logout |
| `/add-property` | `AddProperty.jsx` | Owner listing form for apartments, rooms & PGs (`POST /api/v1/properties`) |

---

## 🔐 Authentication & Session Management

- **Storage**: Bearer tokens are stored in `localStorage` (`token`) and automatically attached via Axios interceptors.
- **Auto-Sync**: On reload, `GET /api/v1/users/me` is called to sync the authenticated session.
- **Roles Supported**: `customer`, `owner`, `provider`, `driver`, `student`, `admin`.
- **Preconfigured Demo Accounts**:
  - **Customer**: `demo.customer@nukrentserve.com` / `Demo@Customer123`
  - **Property Owner**: `demo.owner@nukrentserve.com` / `Demo@Owner123`
  - **Service Provider**: `demo.provider@nukrentserve.com` / `Demo@Provider123`
  - **Driver**: `demo.driver@nukrentserve.com` / `Demo@Driver123`
- **Graceful Fallback**: If the backend database is offline or starting up, the authentication and booking state maintains an active local session so all pages remain interactive without breaking.

---

## 🛠 Tech Stack

- **React 19** with **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`) with `@variant dark (&:where(.dark, .dark *))`
- **React Router v7** (`react-router-dom`)
- **Axios** with `/api/v1` reverse proxy to `http://localhost:5000`
- **Lucide React** icons
- **Google Fonts**: *Bricolage Grotesque* & *Figtree*
- **Assets**: Natural photography from `public/assets/images/`

---

## 💻 Running the Project

```bash
# Terminal 1 — Start Frontend (Vite)
cd frontend
npm run dev
# Running on http://localhost:5173

# Terminal 2 — Start Backend (when ready)
cd nuk-rentserve-backend
npm run dev
# Listens on port 5000
```
