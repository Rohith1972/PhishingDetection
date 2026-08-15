# 🛡️ PhishGuard AI - Enterprise Phishing Detection & Threat Intelligence Platform

An enterprise-grade **AI-Powered Phishing Detection and Cyber Threat Intelligence System** built using a modern decoupled micro-architecture. The platform combines **Spring Boot 3, Java 21, xAI Grok LLM, Scikit-Learn SVM Classifier, Google Safe Browsing API, React 19, MongoDB, and Redis** to deliver real-time multi-vector threat scanning (URLs, emails, and file attachments), automated risk scoring (0-100), interactive AI security chat, and threat analytics dashboards.

> 👥 **Team Project** | 🤖 **AI & ML Threat Intelligence** | 🌐 **Full-Stack Web Development** | ⚡ **Multi-Vector Security Scanner**  
> 🔗 **GitHub Repository:** [https://github.com/Rohith1972/PhishingDetection](https://github.com/Rohith1972/PhishingDetection)

---

## 🚀 Project Overview

**PhishGuard AI** automates and elevates threat detection across digital communication vectors using Large Language Models (LLMs), machine learning classification models, and real-time threat intelligence feeds.

The system empowers cybersecurity teams and end users to scan suspicious website URLs, raw email headers and body text, as well as file attachments for malware signatures, social engineering tactics, typosquatting domains, and phishing indicators. It provides instant risk scores (0–100), severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), AI-driven mitigation advice, interactive security assistant Q&A, and comprehensive administrative threat analytics.

The application is structured into decoupled microservices and components:
* **Backend Core & Business Logic** (Spring Boot 3 REST API, Spring Security & JWT Authentication)
* **AI & Threat Intelligence Engine** (xAI Grok LLM API & Reactive WebClient)
* **Machine Learning Spam/Phishing Classifier** (Python Scikit-Learn SVM Model & TF-IDF Vectorizer)
* **Threat Intelligence Integrations** (Google Safe Browsing v4 API & Heuristic SSL/Domain Scanner)
* **Multi-Vector Scanning Engines** (URL Scanner, Email Body/Header Analyzer, File Attachment Inspector)
* **Web Client Application** (React 19, Vite 8, Tailwind CSS 4, Framer Motion, Recharts, Radix UI)
* **Persistence & Cache Layer** (MongoDB Document Store & Redis Cache with TTL & Rate Limiting)

---

## 🏗️ System Architecture

```text
 ┌─────────────────────────────────────────────────────────┐
 │                   Client Application                    │
 │                                                         │
 │     React Web App (Vite + Tailwind CSS + Recharts)      │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │    Spring Boot Backend    │
                │         (Port 8080)       │
                │                           │
                │ REST APIs                 │
                │ JWT Authentication        │
                │ Rate Limiter (Redis)      │
                │ Multi-Vector Scanner      │
                └─────────────┬─────────────┘
                              │
       ┌──────────────────────┼──────────────────────┬──────────────────────┐
       │                      │                      │                      │
       ▼                      ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│   MongoDB    │      │    Redis     │      │    xAI Grok    │      │ Google Safe    │
│  Database    │      │ Cache Layer  │      │ LLM Inference  │      │ Browsing API   │
└──────────────┘      └──────────────┘      └────────────────┘      └────────────────┘
                                                     │
                                                     ▼
                                            ┌────────────────┐
                                            │ Python ML SVM  │
                                            │ Classification │
                                            └────────────────┘
```

---

# 🛠️ Technology Stack

## Backend API & Core Logic
* **Language:** Java 21
* **Framework:** Spring Boot 3.2.3
* **Security:** Spring Security 6, Stateless JWT (`io.jsonwebtoken 0.11.5`), BCrypt Hashing, OAuth2 Mock Handlers (Google/GitHub)
* **Data Access:** Spring Data MongoDB, Spring Data Redis
* **HTTP & Reactive:** Spring WebFlux (`WebClient`), RestTemplate
* **Documentation & Validation:** SpringDoc OpenAPI 2.3.0 (`Swagger UI`), Jakarta Validation (`spring-boot-starter-validation`)
* **Utilities & Build:** Lombok, Maven 3.8+

## AI, ML & Threat Intelligence Engines
* **LLM Engine:** xAI Grok API (Context-aware phishing intent extraction, header analysis, social engineering vector detection)
* **Machine Learning Engine:** Python 3.10+, Scikit-Learn Support Vector Machine (SVM) Classifier (`spam_svm_model.pkl`) & TF-IDF Vectorizer (`tfidf_vectorizer.pkl`)
* **Threat Intelligence Feed:** Google Safe Browsing API v4 (Real-time malware & social engineering lookup)
* **Heuristic Engine:** Domain age verification, SSL certificate status check, suspicious TLD detection (`.xyz`, `.top`, `.club`), typosquatting/homograph detection, obfuscated payload scanning

## Scanning Capabilities
* **URL Scanner:** Subdomain depth analysis, IP host resolution, redirect chain tracking, typosquatting detection, Google Safe Browsing API integration
* **Email Analyzer:** Raw email header inspection, email body classification via Python SVM ML model + Grok LLM, spoofed sender detection, urgency score calculation
* **File Attachment Inspector:** Extension signature verification (`.exe`, `.vbs`, `.js`, `.scr`, `.bat`, `.pdf` scripts), payload size checks, MIME type verification

## Frontend Web Application
* **Framework:** React 19
* **Build Tool:** Vite 8
* **Routing:** React Router DOM v7
* **Styling:** Tailwind CSS 4, PostCSS, Framer Motion (Smooth page transitions), Radix UI (Dropdown, Tabs, Toast)
* **Data Visualization:** Recharts (Analytics Dashboard & Threat Risk Distribution)
* **Icons & Components:** Lucide React Icons, Custom Theme Toggle (Dark/Light mode)

## Database & Caching
* **Primary Database:** MongoDB 6.0+ (Document persistence for Users, Scan Histories, Threat Logs)
* **Caching & Rate Limiting:** Redis 7+ (Scan response hash caching with TTL, IP/User-based rate limiting via Spring Data Redis)

## DevOps & Cloud
* **Containerization:** Docker, Dockerfile (Multi-stage build), `docker-compose.yml`
* **Cloud Config:** Render deployment manifest (`render.yaml`)

---

# ✨ Key Features

## 👤 User Features
* **Multi-Vector Phishing Scanning:** Analyze URLs, raw email headers/content, and file attachments in seconds.
* **Instant Risk Scoring:** Comprehensive risk index (0–100) categorized into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` threat levels.
* **Email Header & Body Analysis:** Uncover spoofed sender addresses, suspicious DKIM/SPF failures, and urgent financial scam indicators.
* **File Payload Inspection:** Detect disguised executable extensions, malicious macros, and suspicious payload structures.
* **Interactive AI Security Assistant:** Chat in real-time with xAI Grok LLM for threat mitigation strategies, phishing awareness, and security advice.
* **Scan History & Reports:** Filterable user audit log storing past scans with full threat breakdowns and risk scores.

## 👨💼 Admin & Threat Analytics Features
* **Security Analytics Dashboard:** Real-time metrics tracking total scans, risk level distributions, scan type breakdown (URL vs. Email vs. File), and active threat trends.
* **Global Scan Logs Inspection:** Inspect system-wide threat submissions and inspect detected malicious URLs/emails.
* **Rate Limit Monitoring:** Automatic protections using Redis token bucket rate limiting to prevent scan API abuse.

## 🤖 Multi-Vector Threat Detection Pipeline

```text
Input Submission (URL / Email Content / File Attachment)
  ↓
Rate Limit Guard (Redis sliding window / token bucket check)
  ↓
Redis Threat Cache Lookup (Instant response return if URL/hash scanned recently)
  ↓
Parallel Scanning Pipeline:
  ├── Heuristic Rules Engine (Domain age, SSL status, TLD checks, IP resolution)
  ├── Google Safe Browsing API v4 (Malware & social engineering database lookup)
  ├── Python ML SVM Classifier (TF-IDF vectorizer + SVM spam/phishing probability)
  └── xAI Grok LLM Inference (Deep contextual intent & social engineering analysis)
  ↓
Risk Score Calculator (Weighted aggregation 0–100 & RiskLevel assignment)
  ↓
MongoDB Document Storage (Save scan result to ScanHistory collection)
  ↓
Structured JSON Response & Frontend Visualization
```

---

# 🔐 Security & Compliance

The platform adopts defense-in-depth security engineering practices:

* **JWT Authentication:** Stateless JSON Web Token verification on all protected API routes with 24-hour expiration.
* **Password Encryption:** Strong BCrypt hashing applied to developer account credentials.
* **Role-Based Access Control (RBAC):** Strict permissions enforcing boundaries between `USER` and `ADMIN` roles.
* **Redis Rate Limiting Service:** Custom rate limiter protecting scanning endpoints from automated denial-of-service or bot abuse.
* **File Attachment Guard:** Capped 10MB upload limit with MIME-type verification and file signature sanitization.
* **CORS & Security Configuration:** Configured CORS origins with state-sanitized headers.

---

# 📱 Multi-Platform & Service Architecture

```text
                   PhishGuard Threat Platform
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   React Web App          REST API Clients        Security Systems
 (Vite + Tailwind)     (Postman / Webhooks)    (SIEM / SOC Webhooks)
```

---

# 📂 Project Structure

```text
PhishingDetection/
│
├── BackEnd/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/phishguard/backend/
│   │   │   │   ├── config/        # Redis, WebClient, OpenApi & Security Config
│   │   │   │   ├── controller/    # REST Endpoints (Auth, Scan, History, Chat, Dashboard)
│   │   │   │   ├── dto/           # Data Transfer Objects (Requests & Responses)
│   │   │   │   ├── entity/        # MongoDB Documents (User, ScanHistory, Enums)
│   │   │   │   ├── exception/     # Global Exception Handling & ApiException
│   │   │   │   ├── repository/    # Spring Data MongoDB Repositories
│   │   │   │   ├── security/      # JWT Filter, UserPrincipal, CustomUserDetailsService
│   │   │   │   └── service/       # Scan, Grok LLM, SafeBrowsing, RateLimiter, Auth Services
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   │
│   │   └── test/
│   │
│   ├── ml_data/                   # Trained SVM Model (.pkl) & TF-IDF Vectorizer
│   ├── ml_scripts/                # Python ML Spam Classifier Script (spam_classifier.py)
│   ├── Dockerfile
│   └── pom.xml
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/            # Layout, UI components (Radix UI, Theme Provider)
│   │   ├── pages/                 # LandingPage, Dashboard, UrlScanner, EmailAnalyzer, FileAnalyzer, AiChat, History, Auth
│   │   ├── lib/                   # Utility helpers & API client configuration
│   │   ├── App.jsx                # Routing & Navigation
│   │   ├── main.jsx               # React 19 Entry Point
│   │   └── index.css              # Tailwind CSS 4 Styling
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml             # Container Orchestration (Backend, Frontend, Redis)
├── render.yaml                    # Cloud Deployment Config
├── .env                           # Environment Variables Template
└── README.md
```

---

# ⚡ Quick Start

## Prerequisites

Ensure the following tools are installed on your environment:

* **Java 21 JDK**
* **Node.js 18+** & **npm**
* **Python 3.10+** (with `scikit-learn`, `joblib`, `pandas`, `numpy`)
* **Maven 3.8+**
* **MongoDB 6.0+**
* **Redis Server 7+** *(Or run via Docker)*

---

## 📦 Clone the Repository

```bash
git clone https://github.com/Rohith1972/PhishingDetection.git
cd PhishingDetection
```

---

## ⚙️ Manual Setup

### 1. Environment Configuration

Create a `.env` file in the root directory (or update `BackEnd/src/main/resources/application.yml`):

```env
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/phishguard
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379
GROK_API_KEY=your_xai_grok_api_key
SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
```

---

### 2. Spring Boot Backend

Navigate to the `BackEnd` directory, build dependencies, and start the Spring Boot server:

```bash
cd BackEnd

# Build application
mvn clean install

# Run application
mvn spring-boot:run
```

The Backend server will launch on:

```text
http://localhost:8080
```

* Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
* OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

---

### 3. Python ML Model Environment

Verify that the ML script and model artifacts are in place:

```bash
cd BackEnd/ml_scripts
pip install scikit-learn joblib pandas numpy
python spam_classifier.py --predict "Claim your free prize now!"
```

---

### 4. React Frontend

In a separate terminal, navigate to `FrontEnd` and launch the Vite dev server:

```bash
cd FrontEnd

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will be live at:

```text
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication
```text
POST /api/auth/register       # Register new user account
POST /api/auth/login          # Authenticate and return JWT token
GET  /api/auth/oauth/google   # Google OAuth authentication mock endpoint
GET  /api/auth/oauth/github   # GitHub OAuth authentication mock endpoint
```

## Threat Scanning
```text
POST /api/scan/url            # Scan target URL (Heuristics + Safe Browsing + Grok LLM)
POST /api/scan/message        # Scan email text/message (Python ML SVM + Grok LLM)
POST /api/scan/file           # Upload and scan file attachment payload
POST /api/scan/trainMessageModel # Retrain ML spam classification model
```

## Threat History & Audit
```text
GET  /api/history             # Paginated user scan history (Filter by riskLevel)
GET  /api/history/{id}        # Retrieve detailed scan log by ID
```

## AI Security Assistant
```text
POST /api/chat                # Contextual cybersecurity Q&A with Grok LLM
```

## Dashboard & Analytics
```text
GET  /api/dashboard           # Fetch user threat metrics, total scans, and risk levels
```

---

# 🗄️ Database Schema & Data Models

## `users` Collection (MongoDB)

| Field       | Type       | Constraints             | Description                     |
| ----------- | ---------- | ----------------------- | ------------------------------- |
| `id`        | `String`   | `PRIMARY KEY` (ObjectId)| Unique User ID                  |
| `name`      | `String`   | NOT NULL                | Full name                       |
| `email`     | `String`   | `UNIQUE`, NOT NULL      | User email                      |
| `password`  | `String`   | NOT NULL                | BCrypt hashed password          |
| `role`      | `Role`     | `USER` / `ADMIN`        | Role-Based Access Control       |
| `provider`  | `Enum`     | `LOCAL` / `GOOGLE`      | Auth Provider                   |

## `scan_histories` Collection (MongoDB)

| Field        | Type        | Constraints             | Description                     |
| ------------ | ----------- | ----------------------- | ------------------------------- |
| `id`         | `String`    | `PRIMARY KEY` (ObjectId)| Unique Scan Log ID              |
| `userId`     | `String`    | `INDEXED`               | User reference ID               |
| `scanType`   | `ScanType`  | `URL` / `EMAIL` / `FILE`| Target scan vector              |
| `target`     | `String`    | NOT NULL                | Scanned URL, email subject, file|
| `riskScore`  | `Integer`   | `0 - 100`               | Calculated risk index           |
| `riskLevel`  | `RiskLevel` | `LOW` / `MEDIUM` / `HIGH` / `CRITICAL` | Categorized threat severity |
| `details`    | `String`    | LONGTEXT                | Full AI analysis & report       |
| `createdAt`  | `Instant`   | NOT NULL                | Scan timestamp                  |

---

# 📊 Performance Targets

* **Cached Scan Response Time:** `< 30ms` (via Redis Hash Caching)
* **ML Classifier Latency:** `< 150ms` (Scikit-Learn SVM Inference)
* **Grok LLM Deep Inference:** `< 1.2s` (via Spring WebFlux WebClient)
* **Rate Limiting Capacity:** 10 requests / min per user (customizable)
* **Scanned Vectors:** URLs, Email Bodies & Headers, File Attachments

---

# 🔧 Configuration Options

### Backend `application.yml`

```yaml
server:
  port: 8080

spring:
  application:
    name: PhishGuard-Backend
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/phishguard}
    redis:
      host: ${SPRING_REDIS_HOST:localhost}
      port: ${SPRING_REDIS_PORT:6379}

grok:
  api:
    key: ${GROK_API_KEY}

safebrowsing:
  api:
    key: ${SAFE_BROWSING_API_KEY}

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: 86400000 # 24 hours
```

---

# 🧪 Testing & Verification

## Run Backend Automated Tests

```bash
cd BackEnd
mvn test
```

## API Scan Verification with cURL

```bash
# Test URL Scan Endpoint
curl -X POST http://localhost:8080/api/scan/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"url": "http://paypal-security-update-fix.xyz/login"}'
```

---

# 🐳 Docker & Containerization

### Launch Complete Stack with Docker Compose

Run Backend, Frontend, and Redis simultaneously:

```bash
# Build and launch all services
docker-compose up --build -d

# View running container logs
docker-compose logs -f
```

The services will be exposed at:
* **Frontend:** `http://localhost:5173`
* **Backend:** `http://localhost:8080`
* **Redis:** `localhost:6379`

---

# 👨💻 Engineering Contributions

### Backend & Microservice Architecture
* Architected Spring Boot 3 RESTful services orchestrating multi-vector threat scans.
* Integrated xAI Grok LLM API via Spring `WebClient` for high-speed, non-blocking contextual threat evaluation.
* Built hybrid detection engine combining Python Scikit-Learn SVM model classification with Google Safe Browsing API v4.
* Implemented Redis cache lookup to store and serve previously scanned threat hashes instantly.

### Security & Authentication
* Implemented Spring Security 6 with stateless JWT authentication filter.
* Designed token bucket rate-limiting service (`RateLimitingService`) to protect scanning endpoints.

### Frontend Development
* Developed responsive React 19 UI with Tailwind CSS 4, Framer Motion, and Radix UI components.
* Built interactive Recharts visualizers for threat risk distributions and user scan history dashboards.
* Integrated live cybersecurity AI chatbot page with streaming-style responses.

---

# 🚢 Production Deployment Checklist

```text
[ ] Configure production MongoDB Atlas database connection string
[ ] Configure production Redis Cloud / ElastiCache instance
[ ] Set strong 256-bit JWT secret key in environment variables
[ ] Set active GROK_API_KEY and SAFE_BROWSING_API_KEY
[ ] Enable HTTPS / TLS certificate termination
[ ] Deploy Frontend to Vercel / Netlify / Cloudflare Pages
[ ] Deploy Backend to Render / AWS ECS / DigitalOcean App Platform
[ ] Configure Spring Boot Actuator for health check monitoring
```

---

# 🐛 Troubleshooting

### Grok API Key Error
* **Issue:** `401 Unauthorized` or empty AI review response.
* **Fix:** Verify `GROK_API_KEY` is exported in `.env` or set in environment properties.

### Python ML Model Missing (`spam_svm_model.pkl Not Found`)
* **Issue:** Email scanner fails with process execution error.
* **Fix:** Run `python spam_classifier.py` inside `BackEnd/ml_scripts/` to generate the `.pkl` binary model artifacts into `BackEnd/ml_data/`.

### MongoDB Connection Failure
* **Issue:** `MongoSocketOpenException` on startup.
* **Fix:** Ensure local MongoDB daemon is active on port 27017 or verify MongoDB Atlas connection URI.

---

# 📚 Academic / Resume Value

### Project Title
**PhishGuard AI - Enterprise Phishing Detection & Cyber Threat Intelligence System**

### Project Type
**Team Project | Cybersecurity & Threat Intelligence | Full-Stack | AI / ML Integration**

### Technologies
**Java 21, Spring Boot 3, Spring Security, JWT, xAI Grok LLM, Scikit-Learn SVM, Google Safe Browsing API, React 19, Vite, Tailwind CSS 4, Recharts, MongoDB, Redis, Docker**

### Key Concepts Demonstrated
* Multi-vector cybersecurity threat analysis (URL, Email, File Payload)
* Hybrid detection pipeline combining Rule Heuristics, Machine Learning (SVM), and LLM Reasoning
* High-performance caching & rate-limiting with Redis
* Stateless JWT Security & Role-Based Access Control
* Modern Single Page Application (SPA) development with React 19 & Recharts analytics

---

# 🔮 Future Enhancements

* **Browser Extension:** Chrome / Firefox extension for inline website risk warnings before navigation.
* **Automated Domain Takedown:** Generator for WHOIS abuse reporting and automated takedown notices.
* **SIEM / SOC Integration:** Webhooks and syslog exporter for Splunk, Elastic SIEM, and Microsoft Sentinel.
* **Deep Learning NLP:** Transitioning from SVM to Fine-Tuned DeBERTa-v3 model for hyper-accurate phishing text classification.

---

# 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

```bash
git clone https://github.com/Rohith1972/PhishingDetection.git
cd PhishingDetection
git checkout -b feature/your-feature-name
```

---

# 📄 License

This project is licensed under the MIT License.

---

## ❤️ Built With

**Java 21 • Spring Boot 3 • xAI Grok • Python Scikit-Learn • React 19 • Tailwind CSS • MongoDB • Redis • Docker**
