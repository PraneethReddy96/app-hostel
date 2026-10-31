# 🏢 JoyStay — Smart Hostel Management System

A full-stack, dual-portal Hostel ERP & Resident Management Suite built with **React**, **Vite**, and an embedded **SQLite 3 Relational Database** (`WAL` mode) with real-time Server-Sent Events (SSE) synchronization.

---

## 🏗️ System Architecture (3 Standalone Services)

| Service | Directory | Default Port | Description |
| :--- | :--- | :---: | :--- |
| **1. Student App (Front-End)** | `student-app/` | `:5173` | Dedicated mobile-first resident portal for students. |
| **2. Management App (Back-End ERP)** | `management-app/` | `:5174` | Dedicated administration & control web portal for Wardens, Accounts, and Security. |
| **3. Shared SQLite Database & API** | `server/` | `:4000` | Central SQLite 3 database (`server/data/joystay.sqlite`) and real-time sync server powering both apps. |

---

## ✨ Features

### 📱 A. Student App — Front-End (`:5173`)
- **Student Experience Dashboard**: Live overview of fee status, upcoming meals, active laundry progress, maintenance tickets, and parcel pickup alerts.
- **Student Registration, Login & Emergency Contacts**: Resident sign-in, new candidate registration, personal particulars, and primary/secondary guardian contacts.
- **Room & Building Details**: Allocated block, floor, room, bed number, roommate details, room amenities, Wi-Fi credentials, and housekeeping schedule.
- **Monthly Fee Status & Online/Offline Payments**: Itemized monthly billing breakdown, instant UPI QR / Card payment or offline cash voucher submission, and downloadable receipts.
- **Food Menu**: 7-day weekly dining schedule (Breakfast, Lunch, Evening Snacks, and Dinner) with timings and calories.
- **Laundry Services**: Monthly garment quota tracker, pickup slot booking, 5-stage live order tracker (`Booked` → `Ready`), and locker drop OTP.
- **Complaints & Maintenance Requests**: Raise repair tickets with urgency levels and photo attachments, plus live tracking of assigned technicians.
- **Notices, Events & Parcel Notifications**: Official hostel circulars, campus events with RSVP, and gate parcel delivery notifications with security handover OTPs.
- **Profile, Documents & Help Desk**: KYC verification documents and 24/7 virtual help desk & emergency contacts.

### 🖥️ B. Management App — Back-End ERP (`:5174`)
- **Administration Dashboard**: Real-time KPIs (Properties/Wings, Total Residents, Occupancy %, Expected vs. Collected Revenue), weekly collection chart, and quick actions.
- **Student Admission & Records**: Admit new candidates, auto-assign roll numbers and beds, filter/search resident directory, and export Student Records to CSV.
- **Room & Bed Allocation**: Visual wing/floor occupancy matrix (`Occupied`, `Vacant`, `Under Maintenance`), one-click bed allocation/vacating, and Room Occupancy CSV export.
- **Fee Collection, Dues & Receipts**: Track pending dues, record counter cash/UPI/NEFT payments, send automated reminders, and download Dues & Receipts CSV ledgers.
- **Mess Menu, Expenses & Inventory**: Pantry warehouse stock alerts with one-click restock, live 7-day menu planner, monthly mess procurement expenses, and CSV exports for Inventory & Expenses.
- **Complaint Assignment & Resolution**: Triage student maintenance requests, assign technicians, log repair notes, update ticket statuses, and export Complaints CSV.
- **Staff, Warden & Security Management**: Staff shift directory, main gate visitor check-in/out register, and CSV exports.
- **Incident Reports**: Log and archive disciplinary infractions and safety incidents with severity tracking and CSV export.
- **Reports, Analytics & Notifications**: Wing occupancy breakdown, Executive KPI & Expenses CSV Export Center, and live notice broadcast engine.
- **Hostel Settings, RBAC & Database Backup**: Configure hostel identity, curfew rules, 5-tier Role-Based Access Permissions matrix, and one-click SQLite database backups.

---

## 🚀 Quick Start

### Option 1: One-Click Windows Launcher
Double-click **`START_JOYSTAY.bat`** in the project root. It automatically installs dependencies (if needed) and launches all 3 services.

### Option 2: Terminal Commands
```bash
# Install dependencies
npm install

# Start all 3 services together (SQLite Backend :4000 + Student App :5173 + Management App :5174)
npm run dev
```

Or run each service individually:
```bash
npm run dev:backend      # Starts SQLite Database & API Server on http://localhost:4000
npm run dev:student      # Starts Student App on http://localhost:5173
npm run dev:management   # Starts Management App on http://localhost:5174
```
