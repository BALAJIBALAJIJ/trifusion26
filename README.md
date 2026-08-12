# TRIFUSION'26 — 24-Hour International Interdisciplinary Hackathon

![TRIFUSION'26](frontend/public/assets/college-logo.png)

**Shree Venkateshwara Hi-Tech Engineering College (Autonomous)**  
Othakuthirai, Gobichettipalayam, Tamil Nadu, India

> Organized by: **ECE × EEE × BME**

---

## 🚀 Overview

TRIFUSION'26 is a full-stack hackathon management website featuring:

- **Cinematic Landing Page** — Three.js 3D animations, GSAP intro, particles
- **Participant Portal** — Registration, multi-step form, payment submission
- **Admin Dashboard** — Team management, payment verification, data export
- **JWT Authentication** — Secure role-based access (Admin/Participant)
- **Payment Verification** — UPI manual verification with screenshot upload (Cloudinary)
- **Excel/CSV Export** — Complete registration data download

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Three.js, GSAP, Framer Motion |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | MongoDB Atlas |
| Storage | Cloudinary (payment screenshots) |
| Deploy | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
TRIFUSION26/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI, layout, landing, admin, three
│   │   ├── pages/          # All route pages
│   │   ├── contexts/       # AuthContext
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom hooks
│   │   ├── config/         # Event configuration
│   │   └── utils/          # Validators, helpers
│   ├── public/assets/      # College logo, static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env.example
│
├── backend/                # Spring Boot backend
│   ├── src/main/java/com/trifusion/
│   │   ├── config/         # CORS, Cloudinary, MongoDB
│   │   ├── security/       # JWT, SecurityConfig
│   │   ├── model/          # User, Registration, Payment
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── repository/     # MongoDB repositories
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST controllers
│   │   ├── exception/      # Global exception handling
│   │   └── util/           # File validator
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ (JDK)
- **Maven** 3.8+ (or use included mvnw wrapper)
- **MongoDB** (local or Atlas)
- **Cloudinary** account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd TRIFUSION26
```

### 2. Set Up Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your values (see Environment Variables section below)

# Build and run
./mvnw spring-boot:run
# On Windows: mvnw.cmd spring-boot:run
```

The backend starts on `http://localhost:8080`

### 3. Set Up Frontend

```bash
cd frontend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env` or Render Environment Variables)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/trifusion26` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-very-long-random-secret-key-at-least-32-chars` |
| `ADMIN_EMAIL` | Admin login email | `admin@trifusion.com` |
| `ADMIN_PASSWORD` | Admin login password | `YourSecurePassword123!` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://trifusion26.vercel.app` |

### Frontend (`frontend/.env` or Vercel Environment Variables)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://trifusion26-api.onrender.com/api` |
| `VITE_PAYMENT_UPI_ID` | UPI ID for payments | `hackathon@upi` |
| `VITE_PAYMENT_ACCOUNT_NAME` | Payment account name | `TRIFUSION Committee` |
| `VITE_PAYMENT_AMOUNT` | Registration fee (INR) | `500` |
| `VITE_PAYMENT_QR_URL` | UPI QR code image URL | `https://res.cloudinary.com/...` |

---

## 🌐 Deployment Guide

### Step 1: MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create a database user with read/write access
4. Whitelist IP `0.0.0.0/0` (for Render access)
5. Get the connection string → use as `MONGODB_URI`
6. Database name: `trifusion26`

### Step 2: Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret from the Dashboard
4. Use these for `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Step 3: Backend → Render

1. Go to [Render](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Settings:
   - **Name**: `trifusion26-api`
   - **Root Directory**: `backend`
   - **Runtime**: Java
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
5. Add all backend environment variables (see table above)
6. Deploy

> ⚠️ **Important**: Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Render environment variables. These are your admin login credentials. Never commit them to code.

### Step 4: Frontend → Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add frontend environment variables:
   - `VITE_API_URL` = `https://trifusion26-api.onrender.com/api` (your Render URL)
   - `VITE_PAYMENT_UPI_ID`, `VITE_PAYMENT_ACCOUNT_NAME`, `VITE_PAYMENT_AMOUNT`, `VITE_PAYMENT_QR_URL`
5. Deploy

### Step 5: Update CORS

After deploying the frontend, update the backend's `CORS_ORIGIN` on Render:
```
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🔑 Admin Setup

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your backend environment variables
2. Navigate to `/admin/login` on the website
3. Log in with the credentials you set
4. On first login, the system automatically creates the admin account in the database

**Security Notes:**
- Admin password is stored as a BCrypt hash in MongoDB
- Admin credentials are NEVER exposed in frontend code
- All admin API endpoints require JWT with ADMIN role
- The admin password is only set via environment variables

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Participant registration |
| POST | `/api/auth/login` | Public | Participant login |
| POST | `/api/auth/admin-login` | Public | Admin login |
| GET | `/api/auth/me` | JWT | Get current user |

### Registrations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/registrations` | Participant | Create team registration |
| GET | `/api/registrations/me` | Participant | Get own registration |
| PUT | `/api/registrations/me` | Participant | Update own registration |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/submit` | Participant | Submit payment (multipart) |
| GET | `/api/payments/me` | Participant | Get own payment |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/api/admin/registrations` | Admin | List all (paginated, filterable) |
| GET | `/api/admin/registrations/{id}` | Admin | Registration detail |
| PUT | `/api/admin/registrations/{id}/status` | Admin | Update status |
| PUT | `/api/admin/payments/{id}/verify` | Admin | Verify payment |
| PUT | `/api/admin/payments/{id}/reject` | Admin | Reject payment |
| GET | `/api/admin/export/xlsx` | Admin | Download Excel |
| GET | `/api/admin/export/csv` | Admin | Download CSV |

---

## 🎨 Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with intro |
| `/login` | Public | Role selection (Admin/Participant) |
| `/participant/register` | Public | Participant signup/login |
| `/participant/dashboard` | Participant | Dashboard with status |
| `/participant/registration` | Participant | Multi-step registration form |
| `/participant/payment` | Participant | Payment submission |
| `/admin/login` | Public | Admin login |
| `/admin/dashboard` | Admin | Admin dashboard |
| `/admin/registrations` | Admin | All registrations |
| `/admin/registrations/:id` | Admin | Registration detail |

---

## 📝 Key Design Decisions

1. **Payment Verification**: Manual UPI verification (not automated). Participant uploads screenshot + UTR, admin verifies.
2. **File Storage**: Payment screenshots uploaded to Cloudinary, only URL stored in MongoDB.
3. **3D Animations**: Used sparingly (Canvas 2D for particles, CSS for department cards) to maintain mobile performance.
4. **Admin on First Login**: Admin user is created in MongoDB on first successful login using env var credentials.
5. **Team Size**: Configurable min 3, max 5 (including leader).
6. **Event Dates**: Configurable in `src/config/eventConfig.js`.
7. **AI Tools Policy**: Configurable in the rules section.

---

## 📄 License

This project was built for TRIFUSION'26 at Shree Venkateshwara Hi-Tech Engineering College.

---

**Built with ❤️ for TRIFUSION'26**
