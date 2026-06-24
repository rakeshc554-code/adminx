# AdminX

**A cross-platform business management suite for Indian SMBs** — combining digital ledger (Khata), GST-compliant invoicing, inventory management, employee management, and on-device AI into one unified application.

Targeting **Android, iOS, Web, Windows, and macOS** from a single codebase, with offline-first architecture and zero-operating-cost AI through on-device inference.

---

## Tech Stack

### Current Implementation

| Layer | Technology |
|-------|-----------|
| **Backend API** | Node.js, Express, TypeScript |
| **Frontend (Web)** | React, TypeScript |
| **Database** | SQLite (local), with sync to cloud |
| **Build** | TypeScript Compiler, Vitest |

### Target Stack (Full Cross-Platform)

| Component | Technology |
|-----------|-----------|
| **Cross-Platform Framework** | Kotlin Multiplatform (KMP) |
| **UI Framework** | Compose Multiplatform (Android, iOS, Desktop) + React (Web) |
| **Local Database** | SQLite via Room/KMM |
| **On-Device AI** | ONNX Runtime + Quantized SLM (Phi-3-mini / Llama 3.2 3B) |
| **Authentication** | Firebase Auth |
| **Cloud Sync** | Custom KMP Sync Engine + Firebase Realtime |
| **Push Notifications** | Firebase Cloud Messaging |
| **Payments** | Razorpay SDK |
| **Communication** | WhatsApp Business API, Twilio SMS |

---

## Architecture

AdminX follows a multi-layer architecture:

```
┌──────────────────────────────────────────────────────────┐
│  Presentation Layer                                      │
│  Android │ iOS │ Web │ Desktop                           │
├──────────────────────────────────────────────────────────┤
│  Shared Business Logic (Kotlin Multiplatform)             │
├──────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  Local DB │ On-Device AI │ Sync Engine │ Cloud Backup    │
└──────────────────────────────────────────────────────────┘
```

- **Offline-first**: All data stored locally; syncs when connectivity is available
- **On-device AI**: Privacy-preserving ML for transaction categorization, search, and forecasting
- **Conflict-free sync**: Custom sync engine handles concurrent edits across devices

### Core Modules

- **Khata (Digital Ledger)** — Credit/debit tracking with customer-wise balance
- **GST Invoicing** — GST-compliant invoice generation with IRN/e-Way bill support
- **Inventory** — Stock tracking with barcode support
- **Employee Management** — Attendance, payroll, role-based access
- **Expense Tracking** — Categorised expense logging and reconciliation
- **AI Assistant** — Natural language queries, smart categorisation, payment reminders

---

## Platform Targets

| Platform | Status |
|----------|--------|
| Android | Planned (KMP + Compose Multiplatform) |
| iOS | Planned (KMP + Compose Multiplatform) |
| Web | In progress (React + TypeScript) |
| Desktop (Windows) | Planned (KMP + Compose Multiplatform) |
| Desktop (macOS) | Planned (KMP + Compose Multiplatform) |

---

## Project Structure

```
adminx/
├── backend/              # Node/Express TypeScript API server
│   └── src/
│       ├── models/       # Data models (User, Business, Customer, etc.)
│       ├── routes/       # API route definitions
│       ├── services/     # Business logic (sync, GST, notifications, backup)
│       ├── middleware/    # Auth, validation middleware
│       └── utils/        # Shared utilities
├── frontend/             # React web application
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Page views
│       ├── hooks/        # React hooks
│       ├── services/     # API client services
│       ├── styles/       # CSS/styles
│       └── utils/        # Frontend utilities
├── docs/                 # Documentation
│   ├── adminx_srs.md     # Software Requirements Specification
│   ├── adminx_api_specification.md
│   ├── adminx_technical_design.md
│   ├── adminx_deployment_guide.md
│   ├── adminx_uiux_design_guidelines.txt
│   ├── Test_Plan.txt
│   ├── DevOps_Guide.txt
│   └── *.mermaid         # Architecture and flow diagrams
├── PLAN/                 # Development planning
│   ├── development_plan.md
│   └── command-policy.json
└── README.md
```

---

## Setup

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **TypeScript** >= 5.x

### Backend

```bash
cd backend
npm install
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run test             # Run tests
```

### Frontend (Web)

```bash
cd frontend
npm install
npm run dev              # Start development server
npm run build            # Build for production
```

### Environment

Copy `.env.example` to `.env` in `backend/` and configure:

```bash
cp backend/.env.example backend/.env
```

---

## Documentation

All project documentation is in the [`docs/`](./docs/) directory:

- [Software Requirements Specification](./docs/adminx_srs.md)
- [API Specification](./docs/adminx_api_specification.md)
- [Technical Design](./docs/adminx_technical_design.md)
- [Deployment Guide](./docs/adminx_deployment_guide.md)
- [UI/UX Design Guidelines](./docs/adminx_uiux_design_guidelines.txt)
- [Test Plan](./docs/Test_Plan.txt)
- [DevOps Guide](./docs/DevOps_Guide.txt)

Architecture diagrams are available as `.mermaid` files in the same directory.

---

## License

ISC
