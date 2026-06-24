# ADMINX — Development Plan

**Project:** AdminX — Business Management Suite  
**Total Tasks:** 210 | **Status:** 0/210 Complete  
**Platforms:** Android, iOS, Web, Desktop (Kotlin Multiplatform)  
**Document Date:** June 2026

---

## PHASE 0: FOUNDATION & PLANNING (Week 1–2)

### Sprint 0 — Project Setup & Infrastructure (15 tasks)

**Goal:** Establish all foundational infrastructure before writing business logic.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| SET-001 | Create GitHub repository with README | DevOps | 🔴 | — |
| SET-002 | Set up branch protection rules (main/develop) | DevOps | 🔴 | SET-001 |
| SET-003 | Configure GitHub Actions CI/CD pipeline | DevOps | 🔴 | SET-002 |
| SET-004 | Create Firebase project (Auth, Firestore, Storage) | Backend | 🔴 | — |
| SET-005 | Download and place Firebase config files | Backend | 🔴 | SET-004 |
| SET-006 | Set up Kotlin Multiplatform project structure | Mobile Lead | 🔴 | SET-001 |
| SET-007 | Configure Gradle build scripts | Mobile Lead | 🔴 | SET-006 |
| SET-008 | Create Figma design system file | Designer | 🟠 | — |
| SET-009 | Design AdminX logo and brand assets | Designer | 🟠 | SET-008 |
| SET-010 | Research and select quantized SLM model | ML Engineer | 🟠 | — |
| SET-011 | Set up ONNX Runtime environment for AI inference | ML Engineer | 🟠 | SET-010 |
| SET-012 | Create .env.example file with all required variables | DevOps | 🟠 | SET-001 |
| SET-013 | Set up Firebase Crashlytics/Sentry for error tracking | DevOps | 🟠 | SET-003 |
| SET-014 | Configure Firebase Performance Monitoring | DevOps | 🟡 | SET-013 |
| SET-015 | Set up Firebase Cloud Messaging for push notifications | Backend | 🟡 | SET-004 |

**Deliverables:** GitHub repo with CI/CD, Firebase project live, KMP skeleton compiling, Figma design system file.

---

## PHASE 1: CORE USER & DATA LAYER (Week 3–5)

### Sprint 1a — Authentication & User Management (12 tasks)

**Goal:** Users can register, log in, manage sessions, and create their business profile.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| AUTH-001 | User Registration (Email/Phone + OTP) | Frontend | 🔴 | SET-004, SET-006 |
| AUTH-002 | User Login (Email/Phone + Password) | Frontend | 🔴 | AUTH-001 |
| AUTH-003 | Password Reset flow | Frontend | 🟠 | AUTH-002 |
| AUTH-004 | "Forgot Password" feature | Frontend | 🟠 | AUTH-002 |
| AUTH-005 | Session Management (Token storage, auto-login) | Frontend | 🔴 | AUTH-002 |
| AUTH-006 | Business Profile creation on first login | Frontend | 🔴 | AUTH-002 |
| AUTH-007 | Business Profile editing | Frontend | 🟠 | AUTH-006 |
| AUTH-008 | Multi-Device Sync | Backend | 🟠 | SYNC-001, SYNC-002 |
| AUTH-009 | Firebase Auth Integration (Android) | Android | 🔴 | SET-005, SET-006 |
| AUTH-010 | Firebase Auth Integration (iOS) | iOS | 🔴 | SET-005, SET-006 |
| AUTH-011 | Firebase Auth Integration (Web) | Web | 🟠 | SET-005 |
| AUTH-012 | Firebase Auth Integration (Desktop) | Desktop | 🟡 | SET-005 |

### Sprint 1b — Core Data Layer & Local Database (12 tasks)

**Goal:** All local storage infrastructure is in place with encrypted, versioned repositories.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| DB-001 | Design SQLite schema (all tables) | Backend | 🔴 | — |
| DB-002 | Implement SQLite setup with SQLDelight (KMP) | Mobile Lead | 🔴 | DB-001, SET-006 |
| DB-003 | Repository pattern for CRUD operations | Backend | 🔴 | DB-002 |
| DB-004 | BaseEntity with versioning (for CRDT) | Backend | 🔴 | DB-003 |
| DB-005 | Customer Repository | Backend | 🔴 | DB-004 |
| DB-006 | Product Repository | Backend | 🔴 | DB-004 |
| DB-007 | Transaction Repository | Backend | 🔴 | DB-004 |
| DB-008 | Invoice Repository | Backend | 🔴 | DB-004 |
| DB-009 | Employee Repository | Backend | 🟠 | DB-004 |
| DB-010 | Database migration system | Backend | 🟠 | DB-002 |
| DB-011 | Database indices for performance | Backend | 🟠 | DB-002 |
| DB-012 | Data encryption at rest (AES-256) | Security | 🔴 | DB-002, SEC-001 |

**Deliverables:** Auth flows working on all platforms, SQLite schema live, all repositories implemented.

---

## PHASE 2: CUSTOMER & INVENTORY (Week 6–9)

### Sprint 2a — Customer Management (16 tasks)

**Goal:** Full customer lifecycle — list, add, edit, delete, search, filter, ledger, transactions.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| CUST-001 | Customer List screen (Mobile) | Mobile | 🔴 | DB-005 |
| CUST-002 | Customer List screen (Desktop) | Desktop | 🟠 | DB-005 |
| CUST-003 | Customer List screen (Web) | Web | 🟠 | DB-005 |
| CUST-004 | Add Customer form (Mobile) | Mobile | 🔴 | DB-005 |
| CUST-005 | Add Customer form (Desktop/Web) | Desktop/Web | 🟠 | DB-005 |
| CUST-006 | Edit Customer functionality | All | 🟠 | CUST-004 |
| CUST-007 | Delete Customer with confirmation | All | 🟠 | CUST-004 |
| CUST-008 | Customer Search (Name, Phone) | All | 🔴 | CUST-001 |
| CUST-009 | Customer Filter (All, Due, Paid) | All | 🟠 | CUST-001 |
| CUST-010 | Customer Sort (Balance, Name, Recent) | All | 🟠 | CUST-001 |
| CUST-011 | Customer Ledger screen (Mobile) | Mobile | 🔴 | DB-007 |
| CUST-012 | Customer Ledger screen (Desktop/Web) | Desktop/Web | 🟠 | DB-007 |
| CUST-013 | Add Transaction (Credit/Debit) | All | 🔴 | DB-007 |
| CUST-014 | Transaction List with running balance | All | 🔴 | CUST-013 |
| CUST-015 | Send Payment Reminder (WhatsApp/SMS) | All | 🟠 | PAY-007, PAY-008 |
| CUST-016 | AI-powered customer search suggestions | All | 🟡 | AI-002 |

### Sprint 2b — Inventory Management (14 tasks)

**Goal:** Full product lifecycle — list, add, edit, delete, barcode, stock alerts, expiry tracking.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| INVM-001 | Product List screen (Mobile) | Mobile | 🔴 | DB-006 |
| INVM-002 | Product List screen (Desktop/Web) | Desktop/Web | 🟠 | DB-006 |
| INVM-003 | Add Product form | All | 🔴 | DB-006 |
| INVM-004 | Edit Product functionality | All | 🟠 | INVM-003 |
| INVM-005 | Delete Product with confirmation | All | 🟠 | INVM-003 |
| INVM-006 | Product Search (Name, SKU, Barcode) | All | 🔴 | INVM-001 |
| INVM-007 | Product Filters (All, Low Stock, Expiring) | All | 🟠 | INVM-001 |
| INVM-008 | Barcode Generation (ZXing) | Backend | 🟠 | DB-006 |
| INVM-009 | Barcode Scanning (Camera integration) | Mobile | 🟠 | INVM-008 |
| INVM-010 | Low Stock Alerts (Dashboard + Push) | All | 🟠 | INVM-001, SET-015 |
| INVM-011 | Expiry Date Tracking & Alerts | All | 🟠 | INVM-001 |
| INVM-012 | Stock Quantity Update (Manual) | All | 🟠 | INVM-003 |
| INVM-013 | Batch Tracking (batch numbers) | Backend | 🟡 | DB-006 |
| INVM-014 | AI-Powered Stock Forecasting | ML Engineer | 🟢 | AI-002 |

**Deliverables:** Customer & product CRUD on all platforms, barcode scanning, ledger with running balance.

---

## PHASE 3: INVOICING & BILLING (Week 10–13)

### Sprint 3 — Invoicing & Billing (19 tasks)

**Goal:** Complete invoice lifecycle — creation wizard, GST calculation, PDF generation, send, list, search.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| INV-001 | Invoice Creation Wizard (3-step) | All | 🔴 | DB-008 |
| INV-002 | Customer Selection in Invoice | All | 🔴 | INV-001, DB-005 |
| INV-003 | Product Selection with Search | All | 🔴 | INV-001, DB-006 |
| INV-004 | Add Custom Item (non-inventory) | All | 🟠 | INV-001 |
| INV-005 | GST Calculation Engine | Backend | 🔴 | DB-001 |
| INV-006 | Subtotal, GST, Grand Total calculation | Backend | 🔴 | INV-005 |
| INV-007 | Invoice Number Auto-generation | Backend | 🔴 | DB-008 |
| INV-008 | Save Invoice as Draft | All | 🟠 | INV-001 |
| INV-009 | Send Invoice (WhatsApp/Email/SMS) | All | 🔴 | INV-001, PAY-007, PAY-008 |
| INV-010 | Invoice PDF Generation (2 templates) | Backend | 🟠 | INV-001 |
| INV-011 | Invoice List screen (Mobile) | Mobile | 🔴 | DB-008 |
| INV-012 | Invoice List screen (Desktop/Web) | Desktop/Web | 🟠 | DB-008 |
| INV-013 | Invoice Detail screen | All | 🔴 | INV-011 |
| INV-014 | Invoice Status Tabs | All | 🟠 | INV-011 |
| INV-015 | Invoice Search | All | 🟠 | INV-011 |
| INV-016 | Duplicate Invoice | All | 🟡 | INV-001 |
| INV-017 | Delete Invoice with confirmation | All | 🟠 | INV-001 |
| INV-018 | Recurring Invoices | Backend | 🟡 | INV-001 |
| INV-019 | Progress Invoicing | Backend | 🟢 | INV-001 |

**Deliverables:** Full invoice wizard, GST-compliant PDFs, send via WhatsApp/Email/SMS.

---

## PHASE 4: AI, OFFLINE & ACCOUNTING (Week 14–17)

### Sprint 4a — AI & Intelligence Features (10 tasks)

**Goal:** On-device SLM model for chat assistant, NL query processing, and smart suggestions.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| AI-001 | Bundle quantized SLM model with app | ML Engineer | 🔴 | SET-010 |
| AI-002 | Implement ONNX Runtime inference engine | ML Engineer | 🔴 | SET-011 |
| AI-003 | Implement AI Task Router | ML Engineer | 🟠 | AI-002 |
| AI-004 | Implement AI Chat Assistant UI | All | 🟠 | AI-003 |
| AI-005 | Implement Natural Language Query Processing | ML Engineer | 🟠 | AI-003 |
| AI-006 | Transaction Auto-Categorization | ML Engineer | 🟡 | AI-002 |
| AI-007 | Smart Product Suggestions in Invoice | ML Engineer | 🟡 | AI-002 |
| AI-008 | Cash Flow Forecasting | ML Engineer | 🟢 | AI-002 |
| AI-009 | Progressive Model Loading | Mobile | 🟡 | AI-001 |
| AI-010 | Model Download Status UI | All | 🟠 | AI-001 |

### Sprint 4b — Offline Sync & Backup (part 1: 5 tasks)

**Goal:** Offline-first architecture with CRDT conflict resolution.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| SYNC-001 | Implement Offline Queue | Backend | 🔴 | DB-003 |
| SYNC-002 | Implement CRDT Conflict Resolution Engine | Backend | 🔴 | DB-004 |
| SYNC-003 | Automatic Sync on Network Reconnect | Backend | 🔴 | SYNC-001, SYNC-002 |
| SYNC-004 | Manual Sync (Force Sync button) | All | 🟠 | SYNC-003 |
| SYNC-005 | Delta Sync | Backend | 🟠 | SYNC-003 |

### Sprint 4c — Accounting & Expenses (6 tasks)

**Goal:** Expense tracking, bank reconciliation, and AI categorization.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| ACC-001 | Expense Tracking (Add Expense) | All | 🟠 | DB-003 |
| ACC-002 | Expense Categories | Backend | 🟠 | ACC-001 |
| ACC-003 | AI-Powered Expense Categorization | ML Engineer | 🟡 | AI-002, ACC-002 |
| ACC-004 | Bank Reconciliation (CSV upload) | Backend | 🟡 | ACC-001 |
| ACC-005 | Cash Flow Forecasting (AI) | ML Engineer | 🟢 | ACC-001, AI-002 |
| ACC-006 | Reserve Fund Tracking | Backend | 🟢 | ACC-001 |

**Deliverables:** On-device AI running, offline queue working with CRDT sync, expense tracking live.

---

## PHASE 5: REPORTS & ROLES (Week 18–21)

### Sprint 5a — Reports & Analytics (12 tasks)

**Goal:** Financial reports (P&L, Balance Sheet, GST), dashboard KPIs, charts, export.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| REP-001 | Profit & Loss Statement | Backend | 🔴 | DB-007, DB-008 |
| REP-002 | Balance Sheet | Backend | 🟠 | DB-007, DB-008 |
| REP-003 | GST Reports (GSTR-1, GSTR-3B, GSTR-9) | Backend | 🔴 | INV-005 |
| REP-004 | Sales Reports | Backend | 🟠 | DB-007 |
| REP-005 | Expense Reports | Backend | 🟠 | ACC-001 |
| REP-006 | Dashboard KPI Cards | All | 🔴 | REP-001 |
| REP-007 | Dashboard Sales Trend Chart | All | 🟠 | REP-004 |
| REP-008 | Dashboard Recent Activity Feed | All | 🔴 | SYNC-001 |
| REP-009 | Dashboard AI Insight Card | All | 🟠 | AI-003 |
| REP-010 | Report Date Range Filter | All | 🟠 | REP-001 |
| REP-011 | Export Reports (PDF, Excel, CSV) | Backend | 🟠 | REP-001 |
| REP-012 | Expense Breakdown Chart | All | 🟡 | ACC-001 |

### Sprint 5b — Role-Based Views (7 tasks)

**Goal:** RBAC with 5 role types and UI-level permission enforcement.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| RBAC-001 | Owner/Admin View (Full Access) | All | 🔴 | AUTH-006 |
| RBAC-002 | Sales Rep View (Invoicing only) | All | 🟠 | RBAC-006 |
| RBAC-003 | Accountant View (Finance & Reports only) | All | 🟠 | RBAC-006 |
| RBAC-004 | Manager View (Inventory & Team only) | All | 🟡 | RBAC-006 |
| RBAC-005 | Viewer View (Read-Only) | All | 🟡 | RBAC-006 |
| RBAC-006 | Role-Based Permission Checks | Backend | 🔴 | DB-009 |
| RBAC-007 | Role-Based UI Component Visibility | All | 🔴 | RBAC-006 |

**Deliverables:** All reports generating, dashboard live with KPIs, RBAC enforcing permissions.

---

## PHASE 6: PAYMENTS, SYNC & EMPLOYEES (Week 22–25)

### Sprint 6a — Payments & Integrations (9 tasks)

**Goal:** Razorpay integration, WhatsApp/Twilio APIs, UPI payment links.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| PAY-001 | Integrate Razorpay SDK (Android) | Mobile | 🟠 | SET-004 |
| PAY-002 | Integrate Razorpay SDK (iOS) | Mobile | 🟠 | SET-004 |
| PAY-003 | Payment Order Creation API | Backend | 🟠 | PAY-001 |
| PAY-004 | Razorpay Webhook Handler | Backend | 🟠 | PAY-003 |
| PAY-005 | Payment Verification Logic | Backend | 🟠 | PAY-003 |
| PAY-006 | Invoice Mark as Paid | Backend | 🟠 | INV-013, PAY-005 |
| PAY-007 | WhatsApp Business API integration | Backend | 🟠 | — |
| PAY-008 | Twilio SMS integration | Backend | 🟠 | — |
| PAY-009 | UPI Payment Link generation | Backend | 🟡 | PAY-003 |

### Sprint 6b — Employee Management (7 tasks)

**Goal:** Employee CRUD, attendance, payroll, payslip generation.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| EMP-001 | Employee List screen | All | 🟠 | DB-009 |
| EMP-002 | Add Employee form | All | 🟠 | DB-009 |
| EMP-003 | Role-Based Access Control (RBAC) | Backend | 🟠 | DB-009 |
| EMP-004 | Attendance Tracking (Clock-in/Out) | Mobile | 🟡 | EMP-001 |
| EMP-005 | Attendance Report | Backend | 🟡 | EMP-004 |
| EMP-006 | Payroll Management | Backend | 🟡 | EMP-001, ACC-001 |
| EMP-007 | Payslip Generation (PDF) | Backend | 🟢 | EMP-006 |

### Sprint 6c — Offline Sync & Backup (remaining 4 tasks)

**Goal:** Backup/restore and sync status UI.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| SYNC-006 | Automatic Backup (Daily, to Cloud) | Backend | 🟠 | SYNC-003 |
| SYNC-007 | Manual Backup (User-initiated) | All | 🟠 | SYNC-006 |
| SYNC-008 | Restore from Backup | All | 🟠 | SYNC-007 |
| SYNC-009 | Sync Status UI | All | 🟠 | SYNC-003 |

**Deliverables:** Payment processing live, employee management working, full backup/restore.

---

## PHASE 7: SECURITY, QA & DEPLOYMENT (Week 26–30)

### Sprint 7a — Security & Compliance (10 tasks)

**Goal:** AES-256 encryption, TLS 1.3, OWASP compliance, audit logs, privacy policies.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| SEC-001 | AES-256 Encryption for Local DB | Security | 🔴 | DB-012 |
| SEC-002 | TLS 1.3 for All Network Calls | DevOps | 🔴 | — |
| SEC-003 | Secure Key Management | Security | 🔴 | SEC-001 |
| SEC-004 | OWASP Top 10 Security Practices | Security | 🔴 | — |
| SEC-005 | Conduct Security Audit | Security | 🟠 | SEC-004 |
| SEC-006 | DPDP Act Compliance (Indian Users) | Legal | 🟠 | — |
| SEC-007 | GDPR Compliance (EU users) | Legal | 🟢 | — |
| SEC-008 | Audit Logs for All Critical Actions | Backend | 🟠 | DB-003 |
| SEC-009 | Data Retention Policy | Backend | 🟠 | SEC-008 |
| SEC-010 | Privacy Policy & Terms of Service in app | Legal | 🔴 | — |

### Sprint 7b — Testing & QA (10 tasks)

**Goal:** 80%+ coverage, E2E tests, performance/accessibility testing, beta program.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| QA-001 | Unit Tests for Core Business Logic | All | 🔴 | All Sprint 1–3 |
| QA-002 | Integration Tests for Database Operations | Backend | 🟠 | DB-002 |
| QA-003 | UI Tests for Critical User Journeys | QA | 🟠 | All Sprint 1–4 |
| QA-004 | E2E Tests (Invoice creation, Sync) | QA | 🟠 | All Sprint 3–4 |
| QA-005 | Conduct Performance Testing | QA | 🟠 | — |
| QA-006 | Conduct Compatibility Testing | QA | 🟠 | — |
| QA-007 | Conduct Accessibility Testing | QA | 🟡 | — |
| QA-008 | Conduct Localization Testing | QA | 🟡 | — |
| QA-009 | Beta Testing with 100-500 external users | QA | 🟠 | QA-001–004 |
| QA-010 | Implement Automated Regression Testing | DevOps | 🟠 | QA-001, QA-004 |

### Sprint 7c — Deployment & DevOps (12 tasks)

**Goal:** Production deployment to all stores, monitoring, alerts.

| ID | Task | Owner | Priority | Dependencies |
|----|------|-------|----------|-------------|
| DEP-001 | Set up Production Environment | DevOps | 🔴 | SET-003, SET-004 |
| DEP-002 | Configure Production CI/CD Pipeline | DevOps | 🔴 | DEP-001 |
| DEP-003 | Build Android AAB for Google Play | DevOps | 🔴 | SET-006, QA-001–004 |
| DEP-004 | Build iOS IPA for App Store | DevOps | 🔴 | SET-006, QA-001–004 |
| DEP-005 | Deploy Web App to Production | DevOps | 🟠 | DEP-002 |
| DEP-006 | Build Desktop Installers (Windows/Mac) | DevOps | 🟡 | SET-006 |
| DEP-007 | Set up Monitoring (Crashlytics, Performance) | DevOps | 🔴 | DEP-001, SET-013 |
| DEP-008 | Set up Alerts (PagerDuty/Opsgenie) | DevOps | 🟠 | DEP-007 |
| DEP-009 | Create Google Play Store Listing | Marketing | 🟠 | — |
| DEP-010 | Create Apple App Store Listing | Marketing | 🟠 | — |
| DEP-011 | Submit to Google Play (Production Track) | DevOps | 🔴 | DEP-003, DEP-009 |
| DEP-012 | Submit to Apple App Store (Production) | DevOps | 🔴 | DEP-004, DEP-010 |

**Deliverables:** Security-hardened app, all tests passing, apps live on stores.

---

## UI/UX & DESIGN — Cross-Cutting (Spans All Sprints)

| ID | Task | Sprint | Priority | Dependencies |
|----|------|--------|----------|-------------|
| UI-001 | Implement Design System | Sprint 0–1 | 🔴 | SET-008 |
| UI-002 | Implement Component Library | Sprint 0–1 | 🔴 | UI-001 |
| UI-003 | Dark Mode support | Sprint 2–3 | 🟠 | UI-001 |
| UI-004 | Responsive Layouts | Sprint 1–2 | 🔴 | UI-002 |
| UI-005 | Loading States (Skeleton screens) | Sprint 1–2 | 🟠 | UI-002 |
| UI-006 | Empty States (All screens) | Sprint 1–2 | 🟠 | UI-002 |
| UI-007 | Toast Notifications | Sprint 1 | 🔴 | UI-002 |
| UI-008 | Modal/Bottom Sheet Components | Sprint 1 | 🔴 | UI-002 |
| UI-009 | Micro-interactions | Sprint 3–4 | 🟡 | UI-002 |
| UI-010 | Onboarding Flow | Sprint 2 | 🟠 | AUTH-002 |

---

## POST-MVP (Future — No Sprint Assigned)

| ID | Task | Priority |
|----|------|----------|
| FUT-001 | Multi-Business Support | 🟢 |
| FUT-002 | Shopify/WooCommerce Integration | 🟢 |
| FUT-003 | Advanced Marketing Automation | 🟢 |
| FUT-004 | Customer Portal | 🟢 |
| FUT-005 | POS Hardware Integration | 🟢 |
| FUT-006 | Advanced AI Features | 🟢 |
| FUT-007 | Custom Invoice Designer | 🟢 |
| FUT-008 | SMS/WhatsApp Broadcasting | 🟢 |

---

## DEPENDENCY GRAPH (High-Level)

```
Sprint 0 (Setup)
   ↓
Sprint 1a (Auth) ──→ Sprint 1b (Database)
   ↓                        ↓
Sprint 2a (Customers)    Sprint 2b (Inventory)
   ↓                        ↓
Sprint 3 (Invoicing) ←──────┘
   ↓
Sprint 4a (AI) ──→ Sprint 4b (Offline) ──→ Sprint 4c (Accounting)
   ↓                        ↓
Sprint 5a (Reports) ←── Sprint 5b (RBAC)
   ↓
Sprint 6a (Payments) ──→ Sprint 6b (Employees) ──→ Sprint 6c (Backup)
   ↓
Sprint 7a (Security) ──→ Sprint 7b (QA) ──→ Sprint 7c (Deployment)
```

---

## RESOURCE ALLOCATION

| Role | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 | Sprint 7 |
|------|----------|----------|----------|----------|----------|----------|----------|----------|
| **DevOps** | Full | — | — | — | — | — | — | Full |
| **Backend** | Partial | Full | Full | Full | Full | Full | Full | Partial |
| **Mobile Lead** | Full | Full | Full | Partial | Partial | — | — | — |
| **Android** | — | Full | Full | Full | Full | Full | Full | Partial |
| **iOS** | — | Full | Full | Full | Full | Full | Full | Partial |
| **Web** | — | Partial | Full | Full | Full | Full | Partial | — |
| **Desktop** | — | — | Partial | Partial | Partial | Full | Full | Partial |
| **Designer** | Full | Partial | Partial | Partial | — | — | — | — |
| **ML Engineer** | Partial | — | — | — | Full | Partial | — | — |
| **Security** | — | — | — | — | — | — | — | Full |
| **QA** | — | — | — | — | Partial | Partial | — | Full |
| **Marketing/Legal** | — | — | — | — | — | — | — | Partial |

---

## MILESTONE TIMELINE

| Milestone | Sprint | Estimated Date | Key Deliverables |
|-----------|--------|---------------|------------------|
| M0 — Foundation Complete | Sprint 0 | End Week 2 | Repo, CI/CD, Firebase, KMP skeleton, Figma DS |
| M1 — Auth & Data Layer | Sprint 1 | End Week 5 | Auth on all platforms, SQLite + repositories |
| M2 — Customers & Inventory | Sprint 2 | End Week 9 | Full CRUD, barcode scanning, ledger |
| M3 — Invoicing Live | Sprint 3 | End Week 13 | Invoice wizard, GST, PDF, send |
| M4 — AI & Offline MVP | Sprint 4 | End Week 17 | On-device AI, offline queue, expenses |
| M5 — Reports & RBAC | Sprint 5 | End Week 21 | P&L, GST reports, dashboard, role views |
| M6 — Payments & Employees | Sprint 6 | End Week 25 | Razorpay, employees, backup/restore |
| M7 — Ship Ready | Sprint 7 | End Week 30 | Security audit, all tests pass, store submission |

**Total estimated timeline: ~30 weeks (7.5 months)**

---

## RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| KMP learning curve delays | Medium | High | Start with mobile-only, expand later |
| SLM model on-device performance | Medium | High | Benchmark early; fallback to cloud inference |
| CRDT sync complexity | High | High | Prototype sync engine in Sprint 1; simplify if needed |
| GST calculation errors | Low | Critical | Comprehensive test suite for tax engine |
| App Store review rejection | Medium | High | Pre-submit checklist; beta TestFlight first |
| Feature creep | High | Medium | Strict Sprint scope; defer 🟢 items to post-MVP |

---

## MVP SCOPE (Critical + High Priority Only)

- **Total tasks for MVP:** 112 (🔴 + 🟠)
- **Post-MVP tasks:** 98 (🟡 + 🟢)
- **MVP sprints:** Sprint 0 through Sprint 6

Tasks marked 🟡 (Medium) and 🟢 (Low) should be deferred to post-MVP unless capacity permits.
