# Software Requirements Specification (SRS)
**Project Name:** Yogesh Constructions - Site Management System (CMS)  
**Version:** 1.0  
**Date:** February 6, 2026  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the **Yogesh Constructions Site Management System (CMS)**. This application is designed to streamline construction site operations by providing a centralized desktop platform for daily reporting, blueprint management, workforce tracking, and financial logging.

### 1.2 Scope
The CMS is an **Electron-based Desktop Application** that prioritizes offline functionality. It enables site supervisors to maintain digital records of daily activities, manage local drawing files, and track expenses without relying on continuous internet connectivity. The system syncs data to the cloud when a connection is available but remains fully functional offline.

### 1.3 Intended Audience
- **Site Supervisors:** Primary users who input daily logs and access blueprints.
- **Project Managers:** Reviewers of construction progress and financial data.
- **Academic Evaluators:** Reviewers of the project architecture and implementation.

---

## 2. Overall Description

### 2.1 Product Perspective
This system serves as a replacement for fragmented manual processes (paper logbooks, scattered PDF files, and mental notes). It operates as a standalone desktop executable (`.exe`) installed on site laptops/computers. It integrates directly with the host operating system to manage local file repositories (blueprints) while using a local database (`IndexedDB/Dexie.js`) for rapid data access.

### 2.2 Product Features Summary
- **Offline-First Reporting:** create, read, update, and delete daily site logs.
- **Blueprint Management:** Index and open local CAD/PDF engineering drawings.
- **Workforce Directory:** View contact details and roles of site staff.
- **Finance Manager:** Log operational expenses and material costs.
- **Operations Dashboard:** Quick view of recent activities and site stats.
- **Theme Customization:** Native support for Light and Dark modes.

---

## 3. Product Perspective
The system interacts with:
- **Host Operating System (Windows):** For file system access (opening drawings) and window management.
- **Local Storage (Dexie.js):** For persisting data on the physical machine.
- **Cloud Backend (Firebase):** For authentication and data synchronization (when online).

---

## 4. Product Functions

### 4.1 Daily Activity Logging
- Users can create detailed reports including text captions, tags, and priority levels.
- Supports "acknowledgment" workflows (marking issues as seen/fixed).
- Allows editing and deletion of reports.

### 4.2 Blueprint & Document Management
- **Drawing Desk:** Provides a searchable interface for engineering documents.
- **Local Integration:** Users can open the actual file location on their computer directly from the app using Electron IPC (Inter-Process Communication).

### 4.3 Staff & Team Management
- **Staff Directory:** Lists all team members, roles, and departments.
- **Finance Manager:** Interface for logging debit/credit transactions related to site logistics.

### 4.5 Settings & Personalization
- **Profile Management:** View user details (Name, Role).
- **Appearance:** Toggle between Light and Dark themes.

### 4.6 AI Assistance (Ollama Integration)
- **Local Intelligence:** Users can interact with a local AI assistant for site queries.
- **Report Enhancement:** AI can rewrite rough field notes into professional reports.
- **Privacy:** All AI processing happens locally on the machine, ensuring site data never leaves the device.

---

## 5. User Classes and Characteristics

### 5.1 Site Supervisor (Primary User)
- **Technical Skill:** Moderate.
- **Responsibilities:** Entering daily logs, checking drawings, managing site expenses.
- **Environment:** Often unconnected or low-bandwidth construction sites.

### 5.2 Administrator
- **Responsibilities:** System configuration and user management (handled via backend).

---

## 6. Operating Environment

### 6.1 Hardware Requirements
- **Device:** Desktop PC or Laptop.
- **RAM:** Minimum 4GB (8GB recommended).
- **Storage:** 500MB free space for application + adequate space for local drawing files.

### 6.2 Software Requirements
- **OS:** Windows 10/11 (Primary target).
- **Dependencies:** None (Self-contained executable).

---

## 7. Functional Requirements

### 7.1 Authentication
- **FR-01:** System shall facilitate user authentication via Firebase (Email/Password).
- **FR-02:** System shall persist user sessions across app restarts.

### 7.2 Reporting Module
- **FR-03:** Users shall be able to create new logs with content, timestamp, and metadata.
- **FR-04:** System shall store logs locally immediately upon creation.
- **FR-05:** Users shall be able to mark logs as "Important" or "Flagged".

### 7.3 File System Integration
- **FR-06:** System shall interact with the generic `Documents/Yogesh/Drawing Files` directory.
- **FR-07:** "Open File" action shall trigger the OS default application for that file type (PDF viewer, CAD viewer).
- **FR-08:** "Open Explorer" action shall open the specific folder in Windows Explorer.

### 7.4 Network Handling
- **FR-09:** System shall detect network status (Online/Offline).
- **FR-10:** UI shall visually indicate functionality limits when offline (e.g., status pill in Sidebar).

---

## 8. Non-Functional Requirements

### 8.1 Performance
- **NFR-01:** Application load time shall be under 2 seconds.
- **NFR-02:** UI interactions (page switches) shall be instantaneous (<100ms) due to local routing.

### 8.2 Reliability & Availability
- **NFR-03:** System must remain 100% functional for core tasks (Viewing drawings, Writing logs) even without an internet connection.

### 8.3 Usability
- **NFR-04:** Interface must support high-contrast Dark Mode for visibility in low-light site planning rooms.
- **NFR-05:** Font sizes and icons must be legible on standard laptop screens (1366x768 and above).

---

## 9. External Interface Requirements

### 9.1 User Interface
- **Technology:** React.js with TailwindCSS.
- **Style:** Modern Dashboard aesthetic (Glassmorphism, Rounded Corners, Card layouts).
- **Navigation:** Sidebar-based navigation with routing via `HashRouter`.

### 9.2 Software Interfaces
- **Electron API:** Used for `shell.openPath` and `ipcRenderer` calls.
- **Browser API:** Used for `navigator.onLine` status checks.

---

## 10. System Constraints

- **Platform:** Current build is optimized for Windows (`.exe` output).
- **File Storage:** Large files (Blueprints) are not synced to the cloud; they function as a local index. Cloud sync is reserved for lightweight JSON data (Logs, Finance).

---

## 11. Assumptions and Dependencies

- **Assumption:** The user has the relevant engineering drawings stored in the local `Documents/Yogesh` folder structure.
- **Dependency:** The application requires the Electron runtime (bundled) to execute OS-level commands.

---

## 12. Future Enhancements

- **Mobile Companion App:** A lightweight mobile viewer for supervisors on the move.
- **Real-Time GPS Asset Tracking:** Integration with GPS modules for heavy machinery.
- **Automated Weather Alerts:** Fetching weather data for the site location when online.
- **Cloud File Sync:** Full synchronization of heavy blueprint files (e.g., AWS S3 integration).
