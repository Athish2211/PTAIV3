# PTAI v3 - Project Progress & Status Tracker

**Last Updated:** September 17, 2026  
**System Status:** Development & Testing  
**Local SLM Status:** Active (Ollama `phi4-mini:latest`)

---

## 1. System Architecture & Component Status

| Component | Status | Details |
| :--- | :---: | :--- |
| **Global Theme & Tokens** | ✅ Completed | Dark obsidian palette (`#090a0f`), glassmorphism, responsive CSS |
| **Doctor 3-Option Command Hub** | ✅ Completed | Quick pathways: Patient Lookup (RAG), Generate Rx, Data Analysis |
| **Real-Time Patient Auto-Match** | ✅ Completed | Search by name/MRN with instantaneous profile pop-up |
| **Inline Patient Quick-Create** | ✅ Completed | Instant inline registration if patient is not found |
| **Prescription Composer & Safety Guard** | ✅ Completed | Medication row editor, sig codes, live Penicillin/contraindication warnings |
| **Hospital-Grade Prescription Print Modal** | ✅ Completed | `@media print` optimized stationery with Rx symbol & QR verification block |
| **Scanned Prescription Upload & OCR** | ✅ Completed | Drag-and-drop file uploader with entity extraction and auto-fill |
| **RAG Agent with Longitudinal Search** | ✅ Completed | Powered by local Ollama SLM (`phi4-mini:latest`) + Vector grounding |
| **1-Click Hand-off ("Continue w/o Re-entry")**| ✅ Completed | Direct state transfer from RAG search into Prescription Composer |
| **Multi-Agent Analytics Pipeline (PTAI V2)** | ✅ Completed | 4 agents: Trend Agent, Anomaly Agent, Risk Agent, Cohort Agent |
| **De-Identified Patient Registry** | ✅ Completed | Dual-mode view: full PHI for Doctor, `PT-ANON-XXXX` for Admin/CMO |
| **Privacy, KMS & HIPAA Audit Console** | ✅ Completed | Telemetry for AES-256 at rest, local SLM zero-retention, audit trail |
| **Database State Policy** | 🛡️ Enforced | Clean database policy strictly maintained (no demo data seeded) |

---

## 2. Issues & Bug Fixes Log

| Issue # | Description | Severity | Resolution Status |
| :--- | :--- | :---: | :--- |
| **BUG-01** | Next.js build failure: `PageNotFoundError: Cannot find module for page: /analytics` caused by empty `src/app/(app)/analytics/datasets` directory. | High | **Resolved** — Removed the empty directory; `next build` now compiles all 14 routes cleanly. |
| **BUG-02** | RAG and orchestrator returning hardcoded simulated text instead of connecting to local SLM. | High | **Resolved** — Connected local Ollama `phi4-mini:latest` to Next.js API route (`/api/ai/query`) and backend supervisor pipeline with longitudinal vector context. |
| **BUG-03** | `EMBEDDING_MODEL_NAME` attribute error in `backend/app/ai/llm/embeddings.py`. | Medium | **Resolved** — Aligned settings property with `EMBEDDING_MODEL` in `config.py` using `nomic-embed-text:latest`. |
| **BUG-04** | Patient detail view (`/patients/[id]`) showing unstyled "Patient not found" when backend record is empty or loading. | Medium | **Resolved** — Modernized UI with obsidian dark theme and added seamless fallback to patient profile data and AI SOAP assistant. |
| **BUG-05** | Prescriptions created in Prescription Composer not persisting to `/prescriptions` directory. | Medium | **Resolved** — Added centralized state persistence via `RoleContext` / local storage so created records appear dynamically in the directory. |
| **BUG-06** | Patient directory (`/patients`) rows missing clickable link to `/patients/[id]`. | Low | **Resolved** — Added direct navigation to patient records and profile buttons. |
| **BUG-07** | Reports (`/reports`) and Login (`/login`) pages using outdated light mode inline styles. | Low | **Resolved** — Restyled with modern obsidian glassmorphism matching the global design system. |
| **BUG-08** | Print document not working properly due to dark mode CSS token bleed and fixed modal backdrop during browser print. | High | **Resolved** — Implemented high-fidelity isolated iframe print pipeline copying active stylesheets, and overhauled `@media print` rules in `globals.css` to suppress dashboard chrome and force pure white stationery. |
| **BUG-09** | Prescription QR code was a static placeholder icon that could not be scanned. | High | **Resolved** — Integrated `qrcode` library to generate authentic 2D scannable QR codes encoding cryptographic verification tokens, and built the public verification portal at `/verify/rx/[id]`. |
| **BUG-10** | Greedy auto-locking during patient search in `/prescriptions/new` prevented entering sub-names (e.g. typing "sanc" locked into "sanchit"). | High | **Resolved** — Replaced greedy auto-locking with a non-blocking suggestions dropdown and explicit "Register '[query]' as a New Patient Profile" action. |
| **BUG-11** | Inline patient registration allowed negative numbers in the Age field. | Medium | **Resolved** — Implemented positive age validation (`min={0}`, `max={130}`, key blocking for `-`/`+`/`e`, and bounds clamping). |
| **BUG-12** | Patient Lookup section (`/ai`) displayed only one patient with no way to switch or search other patients. | High | **Resolved** — Added a Patient Switcher dropdown, quick-select chips, and dynamic longitudinal context loading for all registered patients. |
| **BUG-13** | Data Analysis section (`/analytics`) was displaying static fake mock charts instead of calculating live metrics from user data. | High | **Resolved** — Rewrote `/analytics` to dynamically compute longitudinal trend curves, Isolation Forest anomaly vectors, polypharmacy risk percentages, and chronic disease cohorts from live EHR state, with zero-data empty states. |
| **BUG-14** | Clinical Command Hub (`/dashboard`) displayed hardcoded random statistics (`18 Patients Today`, `42 Active Prescriptions`, etc.). | High | **Resolved** — Connected all workstation metrics directly to live `patients` and `prescriptions` counts, added a dynamic Recent Prescriptions feed with Print actions, and an empty state card. |
| **BUG-15** | Application pre-loaded mock patient records and prescriptions on startup. | High | **Resolved** — Wiped `DEFAULT_PATIENTS` and `DEFAULT_PRESCRIPTIONS` to empty arrays (`[]`), implemented automatic clean-slate localStorage migration, and added an explicit "Clear All Data" action. |
| **BUG-16** | No input fields or records existed for Patient Blood Group and Phone Number. | High | **Resolved** — Added Blood Group dropdown (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `Unknown`) and Phone Number inputs to inline registration in `/prescriptions/new` and `/patients` modal; integrated Blood Group and Phone into patient cards, directories, and printable prescription stationery. |

---

## 3. Completed Checklist

- [x] Clear Next.js compilation issues and verify production build.
- [x] Verify local Ollama server and fetch `phi4-mini:latest` SLM (and `nomic-embed-text:latest`).
- [x] Connect `phi4-mini:latest` to the backend RAG pipeline and frontend AI assistant (`/api/ai/query`).
- [x] Update `RoleContext` with state persistence for new prescriptions and patients without seeding DB.
- [x] Wipe all mock demo data across the app and provide a clean-slate state.
- [x] Connect Clinical Command Hub (`/dashboard`) to real live metrics and recent activity feed.
- [x] Rewrite Data Analysis (`/analytics`) to compute live trends, anomalies, risks, and cohorts dynamically.
- [x] Add Blood Group and Phone Number inputs to patient creation and display them in print stationery and directories.
- [x] Polish patient detail, directory, and document views to match obsidian dark theme.
- [x] Conduct end-to-end self-testing using browser verification (recordings and screenshots captured).
