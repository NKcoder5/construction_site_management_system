# 🏗️ Yogesh Constructions - Project Intelligence Documentation

## 1. Project Identity & Status
**Current Version:** 2.1.0 "Integrated Operations"  
**Status:** ✅ GOLD MASTER (Feature Complete & Interconnected)  
**Core Objective:** To transform chaotic site data into structured project intelligence through an offline-first, AI-enhanced desktop ecosystem.

---

## 2. Technical Infrastructure
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Shell** | Electron 30 | Desktop encapsulation, OS-level file access (Explorer integration). |
| **Frontend** | React 19 + Vite | High-performance reactive UI with modern functional patterns. |
| **Interface** | TailwindCSS + Lucide | Glassmorphism design system with curated construction aesthetics. |
| **Storage** | Dexie.js (IndexedDB) | Industrial-grade local database for 100% offline functionality. |
| **Cognition** | Mistral 7B (via Ollama) | Localized AI for site auditing, financial analysis, and task mapping. |

---

## 3. Core Modules & Functionality
### 📊 Intelligence Hub (Dashboard)
- **Status:** Integrated.
- **Function:** Aggregates real-time site data.
- **AI Core:** Generates "Site Audits" by correlating logs, spending, and task completion.

### 📝 Work Reports (Daily Log)
- **Status:** Connected.
- **Function:** Field reporting for site supervisors.
- **Relational Data:** Every report is attributed to a specific **Reporting Official** (Employee). Supports image attachments and priority levels.

### 👥 Team Roster (Staff Management)
- **Status:** Connected.
- **Function:** Central directory for site personnel.
- **Performance Tracking:** Every employee card dynamically reflects their **Report Count** and **Task Utility** based on live relational queries.

### 🕹️ Ops Command (Operational Tasks)
- **Status:** Integrated.
- **Function:** The "Execution Layer." Deployment of specific site objectives.
- **Hybrid Mapping:** Tasks explicitly link to an **Assignee** (Employee) and a **Drawing/Doc** (Blueprint).

### 📐 Drawing Desk (Technical Specs)
- **Status:** Integrated.
- **Function:** Repository for site blueprints and technical documentation. 
- **Desktop Sync:** Features direct "Access Local Database" trigger to sync with local system folders.

### 💰 Treasury (Finance)
- **Status:** Integrated.
- **Function:** Ledger-based financial tracking.
- **Tools:** Includes a global **Floating Calculator** for on-the-fly site valuations.

---

## 4. Primary User Flows (The Connected Cycle)

### Flow A: The Supervisor’s Tactical Cycle
1. **Intelligence Check:** Start at the **Intelligence Hub** to see the AI-generated "Morning Briefing."
2. **Staff Attribution:** Navigate to **Team Roster** to verify which engineers are on-site (Online/Offline status).
3. **Field Reporting:** Go to **Work Reports** to log site progress. Selecting an employee as the "Reporting Official" links the data.
4. **Task Deployment:** Enter **Ops Command** to create the day's tasks. The supervisor assigns a **Member** and links the relevant **Blueprint** from the Drawing Desk.

### Flow B: The Financial & AI Audit Cycle
1. **Expenditure Logging:** Log material costs in the **Treasury** ledger.
2. **Audit Generation:** Click "Generate Site Audit" in the **Reports** section.
3. **AI Reasoning:** The system feeds the current balance, pending high-priority tasks, and recent site logs into the **Mistral 7B Engine**.
4. **Insight Execution:** User reviews AI-suggested cost optimizations or safety alerts and updates the **Ops Command** accordingly.

---

## 5. Data Architecture (Relational Mapping)
The application avoids "Data Silos" through the following schema relationships:

1. **Employee-to-Work:** 
   - `Report.authorId` → `Employee.id` (Accountability)
   - `Task.assignedTo` → `Employee.id` (Utility)
2. **Engineering-to-Operations:**
   - `Task.blueprintId` → `Blueprint.id` (Technical Context)
3. **Financial-to-Project:**
   - `Transaction.projectId` → `GlobalProject.id` (Budgetary Control)

---

## 6. Implementation Integrity
- **Performance:** Optimized `useLiveQuery` hooks ensure the UI updates instantly when database changes occur.
- **Safety:** All "Critical Actions" (Delete, Reset) include high-vibration visual feedback and confirmation modals.
- **Reliability:** Form validation with `type="submit"` and error boundary logging ensuring zero-crash data entry.

---
**Documentation Authored:** Feb 7, 2026  
**Confidentiality:** Internally Disseminated - Yogesh Constructions Proprietary.
