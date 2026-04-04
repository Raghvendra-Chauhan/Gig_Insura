<div align="center">

# GigInsura
### AI-Powered Income Insurance for India's Gig Economy
**When work stops, income doesn't.**

[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4EA94B?style=for-the-badge&logo=PostgreSQL&logoColor=white)](https://PostgreSQL.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

*Built for Guidewire DEVTrails 2026: Unicorn Chase*

📹 **Phase 2 Demo Video:** [Watch Here](https://youtu.be/pzSS6uWeG7o)

</div>

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Problem Statement](#-problem-statement)
3. [Our Solution](#-our-solution)
4. [Persona & Real-World Scenarios](#-persona--real-world-scenarios)
5. [Application Workflow](#-application-workflow)
6. [Weekly Pricing Model](#-weekly-pricing-model)
7. [Parametric Triggers](#-parametric-triggers)
8. [AI/ML Integration](#-aiml-integration)
9. [Fraud Detection & Anti-Spoofing](#-fraud-detection--anti-spoofing)
10. [System Architecture](#-system-architecture)
11. [Data Design](#-data-design)
12. [Tech Stack](#-tech-stack)
13. [Development Roadmap](#-development-roadmap)
14. [Local Setup](#-local-setup)
15. [Contributors](#-contributors)

---

## 📌 Overview

**GigInsura** is an AI-powered **parametric income insurance platform** built exclusively for food delivery partners working on **Zomato and Swiggy**. It protects their weekly earnings from uncontrollable external disruptions — extreme rainfall, hazardous air quality, heatwaves, and sudden curfews — using real-time data monitoring, automated claim triggering, and instant payouts with **zero paperwork**.

> ⚠️ **Coverage Scope:** GigInsura covers **income loss ONLY**. Health, accident, life insurance, and vehicle repair are strictly excluded.

---

## 🎯 Problem Statement

India's food delivery workers are the invisible backbone of the urban economy. Yet they carry 100% of the financial risk from disruptions entirely outside their control.

| The Reality | The Gap |
|:---|:---|
| 5 Crore+ gig workers across India | No income protection product built for them |
| 20–30% monthly earnings lost to disruptions | Insurance is annual, paperwork-heavy, inaccessible |
| Disruptions are measurable and verifiable | No automated, data-driven claims system exists |
| Workers earn and budget week-to-week | All existing products are annual or monthly |

---

## 💡 Our Solution

GigInsura provides a **fully automated, weekly parametric income protection system** with three core pillars:

- 🤖 **AI Risk Engine** — Predicts disruption probability by zone. Adjusts weekly premiums dynamically based on hyper-local risk data.
- ⚡ **Parametric Automation** — Claims triggered automatically by real-world data feeds. No filing, no calls, no forms.
- 🔐 **Fraud Shield** — Multi-layer fraud detection using GPS velocity checks, OS-level mock location detection, and photo-based escrow for ambiguous cases.

---

## 👤 Persona & Real-World Scenarios

**Target Persona:** Full-time food delivery partners on Zomato / Swiggy in metro Indian cities (Delhi, Mumbai, Bengaluru). Aged 20–35, earning ₹8,000–₹15,000/month, working 6–8 hours/day from a smartphone with no employer benefits.

---

### 🌧 Scenario 1 — Heavy Rainfall

> *Raju, 27, delivers for Zomato in South Delhi. Monsoon rainfall hits 58mm/hr in his zone. Orders drop 80%. He parks his bike and cannot work for 4 hours.*

| | Without GigInsura | With GigInsura (Standard Plan) |
|---|---|---|
| Outcome | Loses ₹400, no recourse | ₹400 credited to UPI automatically |
| Effort | Nothing he can do | Zero — fully automatic |
| Time to Resolution | Loss is permanent | Payout within minutes of trigger |

**Behind the scenes:**
1. Weather API detects rainfall > 50mm in Raju's zone
2. System cross-checks Raju's GPS — he is stationary in the affected area
3. Fraud engine clears the claim in seconds
4. ₹400 payout processed via Razorpay Test Mode
5. Push notification: *"Heavy rain detected. ₹400 credited. Stay safe, Raju."*

---

### ☁️ Scenario 2 — Hazardous AQI

> *Priya, 24, delivers for Swiggy in Noida. Delhi's AQI spikes to 435 (Severe). Government issues outdoor advisory. Order counts collapse.*

**With GigInsura (Pro Plan):**
1. IQAir/CPCB API detects AQI > 400 in Priya's registered zone
2. Claim auto-initiated. ₹700 payout processed instantly
3. Priya also receives an in-app air quality health alert

---

### 🚓 Scenario 3 — Curfew / Zone Restriction

> *Arjun, 31, covers Old Delhi for Zomato. A Section 144 order is imposed at 6 PM. He cannot access his primary delivery zone during peak hours.*

**With GigInsura (Standard Plan):**
1. Curfew alert API detects active zone restriction
2. GPS confirms Arjun attempted to operate in the affected area
3. Claim auto-triggers. ₹400 payout processed
4. Admin dashboard flags the zone for next-week risk recalculation

---

### 🛡️ Scenario 4 — Fraud Attempt (Anti-Spoofing)

> *A bad actor installs a GPS spoofing app and fakes their location inside a rainfall zone without actually being there.*

**GigInsura's Response:**
1. GPS shows "teleportation" — 9km traversal in 2 seconds → velocity anomaly flagged
2. OS-level check detects mock location provider app active on the device
3. Claim enters **Escrow** — not instant rejection
4. Worker receives: *"Please share a quick photo of your surroundings to verify your claim."*
5. No valid photo submitted → Claim denied. Genuine workers in real disruptions pass through.

---

## 🔄 Application Workflow

```mermaid
flowchart TD
    A([Worker Opens App]) --> B[Onboarding\nPlatform · Earnings · Zone · Location]
    B --> C[AI Risk Engine\nGenerates Risk Score]
    C --> D[Plan Selection\nBasic · Standard · Pro]
    D --> E[Weekly Premium Deducted]
    E --> F{Active Coverage\nTrigger Engine Polls APIs}
    F -->|No Disruption| F
    F -->|Disruption Threshold Crossed| G[Fraud Engine\nGPS + OS Flag Check]
    G -->|PASS| H[Instant Payout\nRazorpay Test Mode]
    G -->|FLAG| I[Escrow State\nPhoto Request Sent]
    I -->|Photo Submitted| J[Admin Review]
    J -->|Approved| H
    J -->|Rejected| K([Claim Denied])
    H --> L([Push Notification\nPayout Confirmed])
```

---

## 💰 Weekly Pricing Model

GigInsura uses a **weekly subscription model** aligned to the payout cycle of gig workers. No annual commitment. No upfront cost barrier.

| Plan | Base Weekly Premium | Weekly Payout Cap | Best For |
|:---|:---:|:---:|:---|
| 🟢 **Basic** | ₹15 / week | ₹200 | Part-time, low-risk zones |
| 🟡 **Standard** | ₹30 / week | ₹400 | Full-time, moderate-risk zones |
| 🔴 **Pro** | ₹50 / week | ₹700 | High-income, high-risk zones |

**Why weekly?** Zomato and Swiggy pay partners weekly. A weekly insurance cycle eliminates the upfront cost barrier of monthly or annual products that most gig workers cannot afford.

### Dynamic Premium Formula

```
Final Weekly Premium = Base Price + (Risk Score × Zone Adjustment Factor)
```

- **Risk Score:** ML model output (0.0 → 1.0), based on zone disruption history and seasonal patterns
- **Zone Adjustment Factor:** Calibrated per delivery zone from historical disruption data
- A worker in a flood-prone zone pays ₹5–₹10 more per week than one in a historically safe zone

---

## ⚡ Parametric Triggers

Claims are triggered **automatically** by crossing measurable real-world thresholds. No manual filing. Ever.

| # | Trigger | Data Source | Threshold | Outcome |
|:---:|:---|:---|:---|:---|
| 1 | Heavy Rainfall | OpenWeatherMap API | > 50mm/hr | Instant payout |
| 2 | Severe Air Quality | IQAir / CPCB API | AQI > 400 | Instant payout |
| 3 | Curfew / Section 144 | Govt. / News Alert API | Active zone restriction | Instant payout |
| 4 | Extreme Heatwave | OpenWeatherMap API | Temperature > 45°C | Instant payout |
| 5 | Flash Flood Advisory | Civic Alert API (mock) | Zone flood advisory active | Instant payout |

> **Platform Choice — Mobile (React Native):** Delivery partners are mobile-first workers. GPS telemetry, push notifications for disruption alerts, and photo upload for escrow resolution all require native mobile capabilities unavailable in a pure web solution.

---

## 🧠 AI/ML Integration

### Model 1 — Risk Scoring & Dynamic Premium (Random Forest)

```
Input Features:
├── Worker's primary delivery zone
├── Historical disruption frequency in zone
├── Seasonal weather patterns (monsoon / winter smog)
├── AQI trend over past 30 days
├── Time-of-year risk multiplier
└── Average daily hours worked

Output → Risk Score (0.0 to 1.0)
├── Low  (0.0 – 0.3) → No premium adjustment
├── Med  (0.3 – 0.6) → +₹5/week
└── High (0.6 – 1.0) → +₹10/week
```

### Model 2 — Fraud Detection (Isolation Forest)

```
Input Features:
├── GPS coordinate sequence + timestamps
├── Calculated velocity between consecutive pings
├── OS mock location provider flag (boolean)
├── IP address consistency across session
├── Claim frequency per worker (rolling 30 days)
└── Time delta between trigger event and claim

Output → Fraud Score (0.0 to 1.0)
├── < 0.4   → Auto-approve claim
├── 0.4–0.7 → Escrow + photo verification request
└── > 0.7   → Flag for Admin manual review
```

### Model 3 — Predictive Disruption Forecasting *(Phase 3)*

- **Purpose:** Forecast next week's likely claim volume and payout exposure by zone for Admin dashboard
- **Output:** Expected claims count and estimated payout exposure per delivery zone

---

## 🛡️ Fraud Detection & Anti-Spoofing

GigInsura's fraud architecture uses three independent detection layers:

```mermaid
flowchart LR
    A([Claim Submitted]) --> B[Layer 1\nGPS Velocity Check]
    B -->|Anomaly Detected| E
    B -->|Pass| C[Layer 2\nOS Mock Flag Check]
    C -->|Mock App Detected| E
    C -->|Pass| D[Layer 3\nIP Consistency Check]
    D -->|Static IP + Moving GPS| E
    D -->|Pass| F([Auto Approve])
    E([Escrow State\nPhoto Request]) --> G{Admin Review}
    G -->|Approved| H([Payout Processed])
    G -->|Rejected| I([Claim Denied])
```

**Layer 1 — GPS Velocity Validation**
The backend calculates time-distance delta between every GPS ping. Any traversal physically impossible for a delivery vehicle (e.g., 9km in 2 seconds) is instantly classified as a spoofed coordinate.

**Layer 2 — OS Mock Location Provider Detection**
The mobile app extracts native OS-level flags that detect fake GPS applications running on the device. A genuine moving delivery partner will not have a mock location provider active during their shift.

**Layer 3 — Network Fingerprinting**
A genuine moving worker transitions across cellular towers, producing a changing network IP. A stationary spoofer maintains a suspicious static residential IP while showing rapid GPS coordinate shifts.

**Escrow — Not Hard Rejection**
Flagged claims are never instantly denied because extreme weather can cause genuine GPS jitter. The worker receives a push notification requesting a live contextual photo (e.g., the flooded street). This shifts the burden of proof to localized visual confirmation while protecting honest workers.

---

## ⚙️ System Architecture

```mermaid
graph TD
    subgraph Mobile["Mobile App - React Native"]
        APP[Worker App\nOnboarding · Dashboard · Alerts]
        ADMIN_UI[Admin Dashboard\nClaims · Fraud · Analytics]
    end

    subgraph Backend["Backend - Node.js + Express"]
        API[REST API Layer\nAuth · Policy · Claims · Payout]
        TRIGGER[Trigger Engine\nPolls APIs Every 2 min]
    end

    subgraph AI["AI/ML Engine - Python"]
        RISK[Risk Engine\nRandom Forest\nPremium Calculation]
        FRAUD[Fraud Engine\nIsolation Forest\nAnomaly Detection]
    end

    subgraph DB["Data Layer - PostgreSQL"]
        MONGO[(PostgreSQL\nUsers · Policies\nClaims · Payouts · Fraud Logs)]
    end

    subgraph External["External APIs"]
        WEATHER[OpenWeatherMap\nRainfall · Temperature]
        AQI[IQAir / CPCB\nAQI Feed]
        CURFEW[Govt Alert API\nCurfew · Restrictions]
        PAY[Razorpay\nTest Mode]
    end

    APP -->|Location · Telemetry · OS Flags| API
    API <-->|Risk Score Request| RISK
    API <-->|Fraud Validation| FRAUD
    TRIGGER -->|Disruption Event Detected| API
    API -->|Read / Write| MONGO
    API -->|Trigger Payout| PAY
    WEATHER -.->|Weather Data| TRIGGER
    AQI -.->|AQI Data| TRIGGER
    CURFEW -.->|Alert Data| TRIGGER
    FRAUD -.->|FLAG: Escrow| APP
    API -->|Push Notification| APP
    ADMIN_UI -->|Review Flagged Claims| API
```

---

## 🗃️ Data Design

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        string user_id PK
        string name
        string phone_number
        string city
        string delivery_platform
        string role
    }
    RIDER_PROFILE {
        string profile_id PK
        string user_id FK
        string delivery_zone
        string work_schedule
        number weekly_income_baseline
        string active_plan
    }
    POLICY {
        string policy_id PK
        string user_id FK
        string coverage_week_start
        string coverage_week_end
        number premium_paid
        number payout_cap
        string plan_type
        string status
    }
    RISK_PROFILE {
        string risk_profile_id PK
        string user_id FK
        number risk_score
        number zone_disruption_frequency
        number premium_adjustment
        string model_version
    }
    TRIGGER_EVENT {
        string event_id PK
        string zone
        string event_type
        number severity
        string data_source
        string timestamp
        boolean threshold_breached
    }
    CLAIM {
        string claim_id PK
        string policy_id FK
        string trigger_event_id FK
        number estimated_lost_hours
        number expected_payout
        number fraud_score
        string status
    }
    FRAUD_LOG {
        string fraud_log_id PK
        string claim_id FK
        boolean gps_velocity_flag
        boolean os_mock_flag
        boolean ip_consistency_flag
        boolean duplicate_flag
        string escrow_photo_url
        string reviewer_notes
    }
    PAYOUT {
        string payout_id PK
        string claim_id FK
        number amount
        string payment_mode
        string razorpay_txn_id
        string payout_status
        string processed_at
    }

    USER ||--o{ RIDER_PROFILE : has
    USER ||--o{ POLICY : purchases
    USER ||--o{ RISK_PROFILE : receives
    TRIGGER_EVENT ||--o{ CLAIM : initiates
    POLICY ||--o{ CLAIM : covers
    CLAIM ||--o| FRAUD_LOG : evaluated_by
    CLAIM ||--o| PAYOUT : results_in
```

---

## 🧩 Tech Stack

| Layer | Technology | Justification |
|:---|:---|:---|
| **Mobile Frontend** | React Native | Cross-platform, GPS access, push notifications, photo upload |
| **Backend** | Node.js + Express | Fast async I/O, ideal for real-time API polling |
| **AI / ML** | Python + Scikit-learn | Random Forest (risk scoring), Isolation Forest (fraud detection) |
| **Database** | PostgreSQL | Flexible schema for evolving claim and fraud data structures |
| **Weather API** | OpenWeatherMap (Free Tier) | Real-time rainfall and temperature by coordinates |
| **AQI API** | IQAir / CPCB (Free Tier) | Hyper-local pollution index for Indian cities |
| **Payments** | Razorpay Test Mode | Widely used in India, simple UPI payout simulation |

---

## 🗺️ Development Roadmap

### ✅ Phase 1 — Ideation & Foundation `March 4 – 20`
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

### 🔨 Phase 2 — Automation & Protection `March 21 – April 4`
*Theme: "Protect Your Worker"*

- [ ] React Native mobile frontend — onboarding, plan selection, worker dashboard
- [ ] Node.js + Express backend — auth, policy engine, claims engine
- [ ] PostgreSQL schema implementation
- [ ] Python ML models — Random Forest (risk scoring), Isolation Forest (fraud)
- [ ] 3–5 automated parametric trigger integrations (Weather · AQI · Curfew)
- [ ] Dynamic premium calculation engine
- [ ] Zero-touch claims flow — auto-trigger → fraud check → payout or escrow
- [ ] Phase 2 demo video (2 min)

**Deliverables:** Working Code · Registration · Policy Management · Dynamic Premium · Claims Management · 2-min Demo

---

### 📈 Phase 3 — Scale & Optimise `April 5 – 17`
*Theme: "Perfect for Your Worker"*

- [ ] Advanced fraud detection — GPS velocity, OS mock-flag, IP fingerprinting
- [ ] Photo escrow flow with push notifications
- [ ] Razorpay test mode payout simulation end-to-end
- [ ] Worker dashboard — earnings protected, coverage status, payout history
- [ ] Admin dashboard — claims analytics, fraud alerts, risk heatmaps, predictive forecasting
- [ ] Full system integration and end-to-end testing
- [ ] Final pitch deck (PDF)
- [ ] Final demo video (5 min) — simulated disruption → auto claim → payout

**Deliverables:** Advanced Fraud Detection · Instant Payout System · Intelligent Dashboards · 5-min Demo · Final Pitch Deck

---

## 💻 Local Setup

> ⚠️ Full application targeting Phase 2 completion. Setup instructions will be updated progressively.

### Prerequisites

```
Node.js  >= 18.x
Python   >= 3.10
PostgreSQL  >= 6.x
Expo CLI    (npm install -g expo-cli)
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/GigInsura.git
cd GigInsura

# 2. Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# 3. Frontend setup (new terminal)
cd ../frontend
npm install
npx expo start

# 4. AI/ML Engine setup (new terminal)
cd ../ml
pip install -r requirements.txt
python app.py
```

### Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/giginsura
JWT_SECRET=your_jwt_secret_here

OPENWEATHER_API_KEY=your_key_here
IQAIR_API_KEY=your_key_here

RAZORPAY_KEY_ID=your_test_key_here
RAZORPAY_KEY_SECRET=your_test_secret_here
```

---

## 👨‍💻 Contributors

| Name | Role |
|:---|:---|
| **Satvik Chaurasia** | Team Lead · Full Stack Developer |
| **Raghvendra Chauhan** | Backend · Fraud Detection ML |
| **Suryansh Chauhan** | Frontend · React Native · UX |
| **Samarth Kesari** | AI/ML · Risk Scoring · Dynamic Pricing |
| **Gargi Sharma** | Research · Strategy · Documentation |

---
