# JoyStay Smart Hostel System — Client Handover & Deployment Guide

## 1. Product Architecture (3-Tier Standalone Suite)
Your product is packaged as **three separated layers** inside a single project folder:

| Component | Folder | Default Port | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Student App (Front-End)** | `student-app/` | `:5173` | Used by hostel students on phones/laptops (Login, Registration, Room info, Fee payment, Food menu, Laundry, Complaints, Gate Outpass, Notices/Parcels, Helpdesk). |
| **2. Management App (Admin ERP)** | `management-app/` | `:5174` | Used by Chief Warden, Assistant Wardens, Accounts & Security (Dashboard, Student Admissions, Room/Bed Allocation, Fee Collection, Mess & Inventory, Complaint Dispatch, Security/Visitors/Outpass Approval, Incidents, Analytics, Settings). |
| **3. Shared SQLite Database & API** | `server/` | `:4000` | Central **SQLite 3 (WAL mode)** relational database (`server/data/joystay.sqlite`) and real-time sync server that powers both apps simultaneously. |

---

## 2. Does the Client Have to Pay for Backend / Database Storage?

**No — $0/month required if hosted on the hostel's reception/warden PC, or $0–$7/month on the cloud.**

Because the system uses an embedded **SQLite 3 Relational Database** (`server/data/joystay.sqlite`), it requires **zero paid external database subscriptions** (no AWS RDS or MongoDB Atlas bills). Even 5,000 students and years of fee receipts take less than **25 MB** of disk space.

### Option A: Zero-Cost On-Premise Hostel Setup ($0 / month)
- **How it works**: Put this project folder on the Hostel Reception or Warden Office PC (Windows/Mac/Linux) connected to the hostel Wi-Fi.
- **How to start**: Double-click `START_JOYSTAY.bat` (or run `npm run dev`).
- **How everyone connects**:
  - Warden uses `http://localhost:5174` (or `http://<OFFICE-PC-IP>:5174`).
  - Students on Hostel Wi-Fi open `http://<OFFICE-PC-IP>:5173` on their phones.
- **Cost**: **100% Free ($0/month)** forever. Backups can be downloaded with one click inside **Management App → Hostel Settings → Download Full Database Backup**.

### Option B: 24/7 Cloud Hosting (Access from anywhere on the internet)
If the client wants students and parents to access the app over mobile data (4G/5G) from anywhere:
1. **Frontend Hosting (Student App + Management App)**:
   - Host `student-app/` and `management-app/` on **Vercel**, **Netlify**, or **Cloudflare Pages**.
   - **Cost**: **$0 / month** (Free tier covers 100GB bandwidth/month).
2. **Backend + SQLite Database (`server/`)**:
   - Host `server/index.js` on **Render.com**, **Railway.app**, or a **DigitalOcean / Hetzner VPS** with a persistent disk volume mounted at `server/data`.
   - **Cost**:
     - **Free** on Render/Oracle Cloud Free Tier, OR
     - **~$5 to $7 / month** (₹400–₹600/month) for a dedicated 24/7 production server with persistent disk storage.
   -*(Optional)* Custom domain name (e.g., `joystayhostel.in`): ~₹700–₹900 / year.

---

## 3. What the Client Needs to Do (Step-by-Step)

### If running on a Local Machine / Hostel Server:
1. Install **Node.js (v22+ LTS)** once from [https://nodejs.org](https://nodejs.org).
2. Extract the `app_hostel` folder.
3. Double-click **`START_JOYSTAY.bat`** (on Windows) or run `npm install && npm run dev`.
4. Open:
   - **Student App**: `http://localhost:5173`
   - **Management App**: `http://localhost:5174`
   - **Database API**: `http://localhost:4000`

### If deploying to the Cloud:
1. Push the repository to GitHub.
2. Deploy `server/index.js` to Render/Railway (Start command: `npm run dev:backend`). Copy the backend URL (e.g. `https://api.yourhostel.com`).
3. Deploy `student-app` and `management-app` to Vercel/Netlify with environment variable:
   ```env
   VITE_API_URL=https://api.yourhostel.com
   ```
   - Student Build Command: `npm run build:student` (Output: `student-app/dist`)
   - Management Build Command: `npm run build:management` (Output: `management-app/dist`)

