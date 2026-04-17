<div align="center">

# GigInsura
### AI-Powered Parametric Income Insurance for India's Gig Economy
**When work stops, income doesn't.**

[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
<<<<<<< HEAD
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
=======
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4EA94B?style=for-the-badge&logo=PostgreSQL&logoColor=white)](https://PostgreSQL.com/)
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

*Built for Guidewire DEVTrails 2026: Unicorn Chase*

<<<<<<< HEAD
**Phase 1 Demo Video:** [Watch Here](https://youtu.be/pzSS6uWeG7o)
=======
📹 **Phase 2 Demo Video:** [Watch Here](https://youtu.be/hlaArL6H4fk)
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Our Solution](#our-solution)
4. [Persona & Real-World Scenarios](#persona--real-world-scenarios)
5. [Application Workflow](#application-workflow)
6. [Weekly Pricing Model](#weekly-pricing-model)
7. [Parametric Triggers](#parametric-triggers)
8. [AI/ML Integration](#aiml-integration)
9. [Fraud Detection & Anti-Spoofing](#fraud-detection--anti-spoofing)
10. [System Architecture](#system-architecture)
11. [API Reference](#api-reference)
12. [Data Design](#data-design)
13. [Tech Stack](#tech-stack)
14. [Development Roadmap](#development-roadmap)
15. [Local Setup](#local-setup)
16. [Contributors](#contributors)

---

## Overview

**GigInsura** is an AI-powered **parametric income insurance platform** built exclusively for food delivery partners working on Zomato, Swiggy, Blinkit, and Zepto. It protects their weekly earnings from uncontrollable external disruptions — extreme rainfall, hazardous air quality, heatwaves, and sudden curfews — using real-time data monitoring, automated claim triggering, and instant payouts with **zero paperwork**.

> **Coverage Scope:** GigInsura covers **income loss ONLY**. Health, accident, life insurance, and vehicle repair are strictly excluded.

---

## Problem Statement

India's food delivery workers are the invisible backbone of the urban economy. Yet they carry 100% of the financial risk from disruptions entirely outside their control.

| The Reality | The Gap |
|:---|:---|
| 5 Crore+ gig workers across India | No income protection product built for them |
| 20–30% monthly earnings lost to disruptions | Insurance is annual, paperwork-heavy, inaccessible |
| Disruptions are measurable and verifiable | No automated, data-driven claims system exists |
| Workers earn and budget week-to-week | All existing products are annual or monthly |

---

## Our Solution

GigInsura provides a **fully automated, weekly parametric income protection system** with three core pillars:

- **AI Risk Engine** — Predicts disruption probability by zone. Adjusts weekly premiums dynamically based on hyper-local risk data.
- **Parametric Automation** — Claims triggered automatically by real-world data feeds. No filing, no calls, no forms.
- **Fraud Shield** — Multi-layer fraud detection using GPS velocity checks, OS-level mock location detection, and IP consistency analysis. Suspicious claims enter escrow rather than being hard-rejected.

---

## Persona & Real-World Scenarios

**Target Persona:** Full-time food delivery partners on Zomato / Swiggy in metro Indian cities (Delhi, Mumbai, Bengaluru). Aged 20–35, earning Rs. 8,000–15,000/month, working 6–8 hours/day from a smartphone with no employer benefits.

---

### Scenario 1 — Heavy Rainfall

> *Raju, 27, delivers for Zomato in South Delhi. Monsoon rainfall hits 58mm/hr in his zone. Orders drop 80%. He parks his bike and cannot work for 4 hours.*

| | Without GigInsura | With GigInsura (Standard Plan) |
|---|---|---|
| Outcome | Loses Rs. 400, no recourse | Rs. 400 credited to UPI automatically |
| Effort | Nothing he can do | Zero — fully automatic |
| Time to Resolution | Loss is permanent | Payout within minutes of trigger |

**Behind the scenes:**
1. Weather API detects rainfall > 50mm in Raju's zone
2. System cross-checks GPS signal — stationary in affected area
3. Fraud engine scores the claim: GPS normal, OS clean, IP consistent
4. Rs. 400 payout processed via Razorpay test-mode simulation
5. Claim status updates to PAID in real time

---

### Scenario 2 — Hazardous AQI

> *Priya, 24, delivers for Swiggy in Noida. Delhi's AQI spikes to 435 (Severe). Government issues outdoor advisory. Order counts collapse.*

**With GigInsura (Pro Plan):**
1. IQAir/CPCB API detects AQI > 400 in Priya's registered zone
2. Claim auto-initiated. Rs. 700 payout processed instantly
3. Claim record shows full fraud signal audit trail in the app

---

### Scenario 3 — Curfew / Zone Restriction

> *Arjun, 31, covers Old Delhi for Zomato. A Section 144 order is imposed at 6 PM. He cannot access his primary delivery zone during peak hours.*

**With GigInsura (Standard Plan):**
1. Manual trigger fires the curfew event for his zone
2. Claim auto-triggers. Rs. 400 payout processed
3. Admin dashboard flags the event for risk recalculation

---

### Scenario 4 — Fraud Attempt (Anti-Spoofing)

> *A bad actor installs a GPS spoofing app and fakes their location inside a rainfall zone without actually being there.*

**GigInsura's Response:**
1. GPS shows high velocity traversal — anomaly flagged
2. OS-level check detects mock location provider active on device
3. Claim enters **Escrow** — not instant rejection
4. Admin console shows the escrow claim with GPS / OS / IP signal detail
5. Admin reviews and rejects — no payout processed

---

## Application Workflow

```mermaid
flowchart TD
    A([Worker Opens App]) --> B[Onboarding\nPlatform · Earnings · Zone]
    B --> C[AI Risk Engine\nGenerates Risk Score]
    C --> D[Plan Selection\nBasic · Standard · Pro]
    D --> E[Weekly Premium Activated]
    E --> F{Trigger Engine\nPolls APIs Every 2 min}
    F -->|No Disruption| F
    F -->|Threshold Crossed| G[Fraud Engine\nGPS Velocity + OS Flag + IP Check]
    G -->|Score < 0.4 — PASS| H[Instant Payout\nRazorpay Simulation]
    G -->|Score 0.4–0.7 — FLAG| I[Escrow State\nAdmin Review Queue]
    G -->|Score > 0.7 — REJECT| K([Claim Rejected])
    I -->|Admin Approves| J[Simulate Payout\nAdmin Console]
    I -->|Admin Rejects| K
    J --> H
    H --> L([Claim Status: PAID\nTXN ID Recorded])
```

---

## Weekly Pricing Model

GigInsura uses a **weekly subscription model** aligned to the payout cycle of gig workers. No annual commitment. No upfront cost barrier.

| Plan | Base Weekly Premium | Weekly Payout Cap | Best For |
|:---|:---:|:---:|:---|
| Basic    | Rs. 15 / week | Rs. 200 | Part-time, low-risk zones |
| Standard | Rs. 30 / week | Rs. 400 | Full-time, moderate-risk zones |
| Pro      | Rs. 50 / week | Rs. 700 | High-income, high-risk zones |

**Why weekly?** Zomato and Swiggy pay partners weekly. A weekly insurance cycle eliminates the upfront cost barrier of monthly or annual products that most gig workers cannot afford.

### Dynamic Premium Formula

```
Final Weekly Premium = Base Price + Risk Adjustment

Risk Adjustment:
  Low  risk (0.0 – 0.3) → +Rs. 0
  Med  risk (0.3 – 0.6) → +Rs. 5
  High risk (0.6 – 1.0) → +Rs. 10
```

---

## Parametric Triggers

Claims are triggered **automatically** by crossing measurable real-world thresholds. No manual filing. Ever.

| # | Trigger | Data Source | Threshold | Outcome |
|:---:|:---|:---|:---|:---|
| 1 | Heavy Rainfall | OpenWeatherMap API | > 50mm/hr | Instant payout |
| 2 | Severe Air Quality | IQAir / CPCB API | AQI > 400 | Instant payout |
| 3 | Curfew / Section 144 | Manual trigger (demo) | Active zone restriction | Instant payout |
| 4 | Extreme Heatwave | OpenWeatherMap API | Temperature > 45°C | Instant payout |
| 5 | Flash Flood Advisory | Manual trigger (demo) | Zone flood advisory | Instant payout |

> **Platform Choice — Mobile (React Native):** Delivery partners are mobile-first workers. GPS telemetry, push notifications for disruption alerts, and photo upload for escrow resolution all require native mobile capabilities unavailable in a pure web solution.

---

## AI/ML Integration

### Model 1 — Risk Scoring & Dynamic Premium (Random Forest)

```
Input Features:
├── Zone disruption frequency (historical)
├── AQI 30-day average
├── Seasonal rainfall index
├── Temperature max average
├── Hours worked per day (derived from income baseline)
└── Months active on platform

Output → Risk Label + Score (0.0 to 1.0)
├── low    → No premium adjustment (+Rs. 0)
├── medium → +Rs. 5/week
└── high   → +Rs. 10/week
```

**Endpoint:** `POST /predict-risk` (ML service, port 8000)

---

### Model 2 — Fraud Detection (Isolation Forest)

```
Input Features:
├── GPS velocity (km/h) — calculated from coordinate sequence
├── OS mock location flag (boolean — device-level)
├── IP change count across session
├── Claim count in rolling 30-day window
└── Time delta between trigger event and claim submission (minutes)

Output → Fraud Score (0.0 to 1.0) + Decision
├── < 0.4   → decision: "approve" → Auto-approve claim
├── 0.4–0.7 → decision: "escrow"  → Hold for admin review
└── > 0.7   → decision: "reject"  → Claim rejected
```

**Endpoint:** `POST /detect-fraud` (ML service, port 8000)

---

## Fraud Detection & Anti-Spoofing

GigInsura's fraud architecture uses three independent detection layers, all signals stored in `fraud_logs` and surfaced in both the worker claims view and admin console:

```mermaid
flowchart LR
    A([Claim Auto-Created]) --> B[Layer 1\nGPS Velocity Check]
    B -->|Anomaly| E
    B -->|Pass| C[Layer 2\nOS Mock Flag Check]
    C -->|Mock App Detected| E
    C -->|Pass| D[Layer 3\nIP Consistency Check]
    D -->|Static IP + Moving GPS| E
    D -->|Pass| F([Auto Approve → Payout])
    E([Escrow State\nAdmin Review Queue]) --> G{Admin Console}
    G -->|Approved| H([Simulate Razorpay Payout])
    G -->|Rejected| I([Claim Denied])
```

**Layer 1 — GPS Velocity**
Calculates traversal speed from GPS pings. Any velocity physically impossible for a delivery vehicle flags the claim. Threshold: >50 km/h registers as `gps_velocity_flag = true`.

**Layer 2 — OS Mock Location Provider**
Detects if a fake GPS application is running on the device at claim submission time. `os_mock_flag = true` on the fraud log record.

**Layer 3 — IP Consistency**
A genuine moving worker transitions across cellular towers (changing IP). A stationary spoofer retains a static residential IP while showing rapid GPS shifts. `ip_consistency_flag = true` when anomaly detected.

**Escrow — Not Hard Rejection**
Flagged claims are never instantly denied. They queue in the admin console's Escrow tab where the admin can Approve (and then simulate payout) or Reject individually.

---

## System Architecture

```mermaid
graph TD
    subgraph Mobile["Mobile App — React Native (Expo)"]
        APP[Worker App\nLogin · Dashboard · Policy · Claims]
        ADMIN_UI[Admin Console\nKPI Grid · Fraud Summary · Escrow Review]
    end

    subgraph Backend["Backend — Node.js + Express (Port 5000)"]
        API[REST API\nAuth · Policy · Claims · Payout]
        TRIGGER[Trigger Engine\nCron every 2 min\nWeather API Polling]
    end

    subgraph AI["ML Service — Python + Flask (Port 8000)"]
        RISK[Risk Engine\nRandom Forest\nPremium Calculation]
        FRAUD[Fraud Engine\nIsolation Forest\nAnomaly Detection]
    end

<<<<<<< HEAD
    subgraph DB["Data Layer — PostgreSQL"]
        PG[(PostgreSQL\nusers · rider_profiles · policies\nclaims · trigger_events\nfraud_logs · payouts · risk_profiles)]
=======
    subgraph DB["Data Layer - PostgreSQL"]
        MONGO[(PostgreSQL\nUsers · Policies\nClaims · Payouts · Fraud Logs)]
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c
    end

    subgraph External["External Services"]
        WEATHER[OpenWeatherMap\nRainfall · Temperature]
        PAY[Razorpay Test Mode\nSimulated UPI Payout]
    end

    APP --> API
    ADMIN_UI --> API
    API <-->|Risk Score| RISK
    API <-->|Fraud Score + Decision| FRAUD
    TRIGGER --> API
    API --> PG
    API --> PAY
    WEATHER -.-> TRIGGER
```

---

## API Reference

All endpoints require `Authorization: Bearer <token>` except `/api/auth/register` and `/api/auth/login`.

### Auth

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| POST | `/api/auth/register` | Public | Register worker + create rider profile |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET  | `/api/auth/profile` | Worker | Fetch profile + risk score |

### Policy

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| POST | `/api/policy/quote` | Worker | Get AI-adjusted premium quote |
| POST | `/api/policy/create` | Worker | Activate a weekly policy |
| GET  | `/api/policy/active` | Worker | Get current active policy |
| GET  | `/api/policy/all` | Worker | Full policy history |

### Claims

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| GET  | `/api/claims/my` | Worker | Claims with fraud signal detail |
| GET  | `/api/claims/all` | Admin | All claims with worker info + fraud logs |
| GET  | `/api/claims/stats` | Admin | KPI totals + fraud signal counts |
| POST | `/api/claims/trigger/manual` | Any | Fire a manual disruption trigger |
| PATCH | `/api/claims/:id/review` | Admin | Approve or reject an escrow claim |

### Payout

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| GET  | `/api/payout/my` | Worker | Payout history with TXN IDs |
| GET  | `/api/payout/all` | Admin | All payouts across workers |
| POST | `/api/payout/simulate` | Admin | Razorpay test-mode payout simulation |

### ML Service (Port 8000)

| Method | Endpoint | Description |
|:---|:---|:---|
| POST | `/predict-risk` | Risk score + adjusted premium |
| POST | `/detect-fraud` | Fraud score + approve/escrow/reject decision |
| GET  | `/health` | Service health check |

---

## Data Design

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string phone
        string password_hash
        string city
        string delivery_platform
        string role
    }
    RIDER_PROFILES {
        int id PK
        int user_id FK
        string delivery_zone
        string work_schedule
        float weekly_income_baseline
        string active_plan
        float risk_score
    }
    POLICIES {
        int id PK
        int user_id FK
        string plan_type
        float premium_paid
        float payout_cap
        date coverage_week_start
        date coverage_week_end
        string status
    }
    RISK_PROFILES {
        int id PK
        int user_id FK
        float risk_score
        string risk_label
        float premium_adjustment
        string model_version
    }
    TRIGGER_EVENTS {
        int id PK
        string zone
        string event_type
        float severity
        string data_source
        float raw_value
        float threshold_value
        bool threshold_breached
    }
    CLAIMS {
        int id PK
        int policy_id FK
        int user_id FK
        int trigger_event_id FK
        float expected_payout
        float fraud_score
        string status
        string reviewer_notes
    }
    FRAUD_LOGS {
        int id PK
        int claim_id FK
        bool gps_velocity_flag
        bool os_mock_flag
        bool ip_consistency_flag
        bool duplicate_flag
    }
    PAYOUTS {
        int id PK
        int claim_id FK
        int user_id FK
        float amount
        string payment_mode
        string razorpay_txn_id
        string payout_status
    }

    USERS ||--o| RIDER_PROFILES : has
    USERS ||--o{ POLICIES : purchases
    USERS ||--o| RISK_PROFILES : receives
    TRIGGER_EVENTS ||--o{ CLAIMS : initiates
    POLICIES ||--o{ CLAIMS : covers
    CLAIMS ||--o| FRAUD_LOGS : evaluated_by
    CLAIMS ||--o| PAYOUTS : results_in
```

---

## Tech Stack

| Layer | Technology | Justification |
|:---|:---|:---|
<<<<<<< HEAD
| Mobile Frontend | React Native (Expo) | Cross-platform, GPS access, push notifications |
| Backend | Node.js + Express | Fast async I/O, ideal for real-time API polling |
| AI / ML | Python + Flask + Scikit-learn | Random Forest (risk), Isolation Forest (fraud) |
| Database | PostgreSQL | Relational integrity for policy/claim/payout chain |
| Weather API | OpenWeatherMap (Free Tier) | Real-time rainfall and temperature by coordinates |
| Payments | Razorpay Test Mode | Simulated UPI payouts with real TXN ID format |
| Dev Tooling | node-cron, axios, bcryptjs, jsonwebtoken | Standard Node.js ecosystem |
=======
| **Mobile Frontend** | React Native | Cross-platform, GPS access, push notifications, photo upload |
| **Backend** | Node.js + Express | Fast async I/O, ideal for real-time API polling |
| **AI / ML** | Python + Scikit-learn | Random Forest (risk scoring), Isolation Forest (fraud detection) |
| **Database** | PostgreSQL | Flexible schema for evolving claim and fraud data structures |
| **Weather API** | OpenWeatherMap (Free Tier) | Real-time rainfall and temperature by coordinates |
| **AQI API** | IQAir / CPCB (Free Tier) | Hyper-local pollution index for Indian cities |
| **Payments** | Razorpay Test Mode | Widely used in India, simple UPI payout simulation |
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c

---

## Development Roadmap

### Phase 1 — Ideation & Foundation `March 4 – 20`
*Theme: "Ideate & Know Your Delivery Worker"*

- [x] Persona research and problem analysis
- [x] Core strategy documentation (this README)
- [x] System architecture design
- [x] Parametric trigger definition
- [x] AI/ML integration plan
- [x] GitHub repository setup
- [x] Phase 1 video (2 min)

**Deliverables:** README · GitHub Repo · 2-min Video

---

### Phase 2 — Automation & Protection `March 21 – April 4`
*Theme: "Protect Your Worker"*

<<<<<<< HEAD
- [x] React Native mobile frontend — login, register, dashboard, policy, claims screens
- [x] Node.js + Express backend — auth, policy engine, claims engine, payout routes
- [x] PostgreSQL schema — users, rider_profiles, policies, risk_profiles, trigger_events, claims, fraud_logs, payouts
- [x] Python ML service (Flask) — Random Forest risk scoring, Isolation Forest fraud detection
- [x] Parametric trigger engine — OpenWeatherMap polling every 2 minutes, threshold detection
- [x] Dynamic premium calculation via ML risk endpoint
- [x] Zero-touch claims flow — auto-trigger → ML fraud check → payout or escrow
- [x] Razorpay test-mode payout simulation in trigger engine
- [x] JWT authentication with role-based access (worker / admin)
=======
- [x] React Native mobile frontend — onboarding, plan selection, worker dashboard
- [x] Node.js + Express backend — auth, policy engine, claims engine
- [x] PostgreSQL schema implementation
- [x] Python ML models — Random Forest (risk scoring), Isolation Forest (fraud)
- [x] 3–5 automated parametric trigger integrations (Weather · AQI · Curfew)
- [x] Dynamic premium calculation engine
- [x] Zero-touch claims flow — auto-trigger → fraud check → payout or escrow
- [x] Phase 2 demo video (2 min)
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c

**Deliverables:** Working Code · Registration · Policy Management · Dynamic Premium · Claims Management

---

### Phase 3 — Scale & Optimise `April 5 – 17`
*Theme: "Perfect for Your Worker"*

- [x] Advanced fraud detection — per-claim GPS velocity signal, OS mock flag, IP change count — all passed live to Isolation Forest ML model
- [x] Fraud signal audit trail — `fraud_logs` joined in all claim queries, surfaced in worker claims UI
- [x] Razorpay payout simulation REST endpoint — `POST /api/payout/simulate` (admin-only, generates `rzp_test_*` TXN ID)
- [x] Worker Claims screen redesigned — full Fraud Signal Panel (GPS, OS mock, IP consistency, decision engine reasoning, TXN ID)
- [x] Worker Dashboard — coverage status block, earnings protected stat, conditional Admin Console button
- [x] Admin Console screen — KPI grid (total/approved/paid/escrow/rejected/payout sum), fraud signal summary, tabbed claims list
- [x] Admin Escrow Review — one-tap Approve / Reject per claim
- [x] Admin Payout Simulation — one-tap Razorpay simulate per approved claim with TXN ID confirmation
- [x] `GET /api/claims/stats` endpoint for admin KPIs and fraud signal counts
- [x] `GET /api/payout/all` admin payout history
- [x] Full frontend redesign — professional Japanese minimal aesthetic (no emojis, uppercase tracking, structured grid borders, dark navy palette)
- [ ] Final pitch deck PDF
- [ ] Final demo video (5 min)

**Deliverables:** Advanced Fraud Detection · Intelligent Dashboards · Razorpay Simulation · 5-min Demo · Final Pitch Deck

---

## Local Setup

### Prerequisites

```
<<<<<<< HEAD
Node.js     >= 18.x
Python      >= 3.10
PostgreSQL  >= 14.x
=======
Node.js  >= 18.x
Python   >= 3.10
PostgreSQL  >= 6.x
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c
Expo CLI    (npm install -g expo-cli)
```

### Quick Start (Windows)

```bat
start.bat
```

This opens three terminal windows:
1. ML Service on port 8000
2. Backend on port 5000
3. Expo frontend (scan QR with Expo Go)

### Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/GigInsura.git
cd GigInsura

# 2. Train ML models first (one-time)
cd ml
pip install flask flask-cors scikit-learn joblib numpy pandas
python train_risk.py
python train_fraud.py
python app.py        # Starts on port 8000

# 3. Backend setup (new terminal)
cd backend
npm install
node server.js       # Starts on port 5000

# 4. Frontend setup (new terminal)
cd frontend
npm install
npx expo start
```

### Environment Variables (`backend/.env`)

```env
PORT=5000
<<<<<<< HEAD
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/giginsura
=======
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/giginsura
>>>>>>> c07c4373237083f62bd8facae0e0abb2a83bde7c
JWT_SECRET=your_jwt_secret_here
ML_SERVICE_URL=http://localhost:8000

OPENWEATHER_API_KEY=your_openweathermap_key
IQAIR_API_KEY=your_iqair_key

RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_test_secret
```

### Seed an Admin User

To access the Admin Console during the demo, run this SQL once after your first registration:

```sql
UPDATE users SET role = 'admin' WHERE phone = 'your_registered_phone';
```

### Fire a Manual Trigger (Demo)

```bash
curl -X POST http://localhost:5000/api/claims/trigger/manual \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"zone":"delhi-south","event_type":"rainfall","value":65}'
```

---

## Contributors

| Name | Role |
|:---|:---|
| **Satvik Chaurasia** | Team Lead · Full Stack Developer |
| **Raghvendra Chauhan** | Backend · Fraud Detection ML |
| **Suryansh Chauhan** | Frontend · React Native · UX |
| **Samarth Kesari** | AI/ML · Risk Scoring · Dynamic Pricing |
| **Gargi Sharma** | Research · Strategy · Documentation |

---

<div align="center">
<sub>GigInsura · Guidewire DEVTrails 2026 · Built with purpose for India's delivery workers</sub>
</div>
