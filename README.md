# 🌾 ANNADHARA AI
> **"From Uncertain Queues to Intelligent Procurement"**  
> *Smart India Hackathon 2026 Project*

---

## 🌟 Overview
**Annadhara AI** is an intelligent, full-stack, mobile-responsive PWA platform engineered to eliminate unpredictable procurement queues, eradicate long waiting times, prevent produce rejections, and empower Indian farmers through smart centre recommendations, transparent wait-time predictions, dynamic slot rescheduling, authorized family management, multilingual AI assistance (RAG + Action Router), and hardware-inclusive telephone access (interactive feature phone DTMF keypad simulator & missed-call triggers).

---

## 🚜 Key Features & Capabilities

### 1. Smart Centre Recommendation (Section 5)
- Multi-criteria weighted scoring considering **Distance, Queue size, Daily capacity, and Active counters**.
- Transparent natural language explanations (*"Centre B is recommended because it has a 30-min estimated wait and 3 active counters, saving 60 mins compared to Centre A"*).
- Congestion detection when queue exceeds threshold (&gt; 80 farmers), automatically triggering traffic diversion alerts.

### 2. Smart Slot Booking & Token Generation (Section 6)
- Complete 5-step intuitive booking workflow: Crop selection &rarr; Quantity &rarr; Centre &rarr; Slot &rarr; Representative designation.
- Instant token issuance (e.g. `T118`) and Booking Code (e.g. `KS-2026-1025`).

### 3. Transparent Queue Tracking & Waiting-Time Prediction (Sections 7 & 8)
- Displays current serving token, people ahead, and estimated waiting time.
- Real algorithmic formula transparency:
  $$\text{waiting\_time} = \frac{\text{people\_ahead} \times \text{avg\_processing\_time}}{\text{active\_counters}}$$

### 4. Dynamic Rescheduling (Section 9)
- Reschedule slot up to 2 hours before appointment.
- Atomically releases old slot quota, reserves new slot, retains queue priority, and dispatches in-app + SMS notifications.

### 5. Family Account System & Authorized Representative (Sections 10 & 11)
- Manage family members with device tagging (`Keypad` vs `Smartphone`).
- **Strict Verification Protocol**: Farmers can designate an authorized family member (e.g. Son Rahul Kumar) to visit the centre on their behalf; unauthorized individuals are flagged and prevented from selling another's produce.

### 6. Interactive Feature Phone Keypad & Dual-Language IVR (Section 19)
- Browser-based classic feature phone with authentic **Web Audio API DTMF dual tones**.
- Spoken Voice Prompts in **Hindi & English** via Web Speech API.
- Fully wired to backend APIs: Press 1 to Book, 2 for Status, 3 for Queue, 4 to Reschedule, 5 for Payment, 6 for Helpline!

### 7. 1-Click Missed Call Callback (Section 21)
- Farmers with basic phones dial toll-free `1800-266-ANNADHARA` and disconnect.
- System automatically recognizes caller ID and responds with spoken callback & SMS detailing their token, queue position, and wait time.

### 8. AI Farmer Assistant (RAG + Action Router) (Sections 12, 13, 14)
- RAG knowledge retrieval over verified MSP rates, grain moisture guidelines, required KYC documents, and centre rules.
- Action Router maps farmer intents directly to authorized backend services (never allowing direct arbitrary database mutations).

### 9. Pre-Visit Rejection Prevention Checklist (Section 15)
- Advisory checklist verifying moisture standard (&le; 12.0% for wheat), Aadhaar linkage, Khasra land record, and representative authorization before departure.

### 10. Multi-Role Portals (Sections 22 & 23)
- **Farmer Dashboard**: Mobile-first overview, active token, quick actions.
- **Centre Operator Console**: Counter terminal with "Call Next Token", "Mark Arrived", "Quality Check (Moisture Slider)", "Weighbridge Measurement", and "Formal Acceptance".
- **Mandi Supervisor Admin**: Capacity utilization, overcrowding monitors, and immutable audit logs.

### 11. Guided 20-Step Demo Tour (Section 30)
- A floating interactive demo controller walking evaluators seamlessly through the full 20-step lifecycle from initial booking to quality check, weighing, and Aadhaar DBT credit.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS v3, Vite, Lucide Icons |
| **PWA & Audio** | Service Worker Manifest, Web Audio API (DTMF), Web Speech API (TTS) |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic v2 |
| **Database** | SQLite (zero-config local default), PostgreSQL compatible |
| **Authentication** | JWT (HS256), OTP Simulation, Role-Based Access Control |
| **AI / RAG** | Vectorless lexical/semantic retrieval, Intent Classifier, Action Router |
| **Containers** | Docker, Docker Compose, Nginx |

---

## 🚀 Quickstart & Local Setup

### 1. Start the Backend API
```bash
# In project root
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Run with Docker Compose
```bash
docker-compose up --build
```

---

## 👤 Demo Personas & Credentials

| Role | Name | Phone | Demo OTP | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Main Farmer** | Ramesh Kumar | `9876543210` | `123456` | Family ID: `F101`, Keypad Phone user |
| **Authorized Son** | Rahul Kumar | `9876543211` | `123456` | Sub-user `S103`, Smartphone user |
| **Centre Operator**| Surendra Singh | `9876500001` | `123456` | Centre B Operator Console |
| **Mandi Admin** | Dr. Rajesh Sharma | `9876500002` | `123456` | State Supervisor |

---

## 📜 REST API Endpoints Overview

- `POST /api/auth/login` - Request OTP simulation
- `POST /api/auth/verify-otp` - Verify OTP and generate JWT
- `GET /api/centres` - List procurement centres
- `GET /api/centres/recommendations` - Smart score-based recommendations
- `POST /api/bookings` - Create slot booking and token
- `PATCH /api/bookings/{id}/reschedule` - Dynamic slot rescheduling
- `GET /api/queue/{bookingId}` - Real-time queue and wait prediction
- `POST /api/queue/centre/{centreId}/call-next` - Operator calls next token
- `GET /api/families/{id}` - Family details and sub-user roster
- `PATCH /api/families/{id}/members/{memberId}` - Toggle representative authorization
- `PATCH /api/procurement/{bookingId}/status` - Advance quality & weighing stages
- `GET /api/payments/{bookingId}` - DBT transaction status
- `POST /api/ai/chat` - RAG assistant with Action Router
- `POST /api/ivr/call` & `POST /api/ivr/input` - Keypad phone state machine
- `POST /api/ivr/missed-call` - 1-click missed call callback
- `GET /api/admin/dashboard` - Mandi analytics and capacity alerts
- `POST /api/demo/step/{step}` - Programmatic step execution for SIH judges
