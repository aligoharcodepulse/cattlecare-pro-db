# 🐄 CattleCare Pro

A web-based Farm Management System built for **Green Valley Farm, Mianwali**. It allows farm workers to manage cattle records, track health and breeding, record sales and purchases, and automatically calculate profit/loss — all through a simple, easy-to-use interface designed for users with no technical background.

---

## 📋 Table of Contents

- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Features & Usage](#-features--usage)
- [Code Structure](#-code-structure)
- [Database](#-database)
- [AI Disclosure](#-ai-disclosure)

---

## ⚙️ System Requirements

### Software
| Software | Version | Purpose |
|---|---|---|
| Node.js | v18 or higher | Runs React frontend and Express backend |
| npm | v9 or higher | Installs project dependencies |
| MySQL Server | 9.6 | Database engine |
| MySQL Workbench | Any recent | Run SQL scripts and view data |
| Web Browser | Chrome / Edge | View the GUI |

### Hardware
| Component | Minimum |
|---|---|
| RAM | 4 GB |
| Storage | 500 MB free |
| OS | Windows 10 or higher |

### Libraries — Frontend (React)
| Library | Purpose |
|---|---|
| `react` | UI framework |
| `axios` | HTTP requests to backend |
| `vite` | Development server and build tool |

### Libraries — Backend (Node.js)
| Library | Purpose |
|---|---|
| `express` | Web server framework |
| `mysql2` | Connects Node.js to MySQL |
| `cors` | Allows React to talk to backend |
| `dotenv` | Loads environment variables from `.env` |

---

## 🚀 Installation

### Step 1 — Clone or download the project

```bash
git clone https://github.com/your-username/cattlecare-pro.git
cd cattlecare-pro
```

### Step 2 — Set up the database

1. Open **MySQL Workbench**
2. Run `dbDDL.sql` — creates all tables, triggers, stored procedures, and views
3. Run `dbDML.sql` — inserts sample data (15–20 rows per table)

```sql
-- In Workbench, open each file and press Ctrl+Shift+Enter
```

### Step 3 — Configure backend environment

Inside the `backend/` folder, open `.env` and fill in your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=cattlecare_pro
PORT=5000
```

### Step 4 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 5 — Install frontend dependencies

```bash
cd cattlecare-gui
npm install
```

---

## ▶️ Running the Project

You need **two terminals open at the same time**.

### Terminal 1 — Start the backend

```bash
cd backend
node server.js
```

✅ You should see:
```
✅ MySQL connected — cattlecare_pro
🚀 CattleCare backend running on http://localhost:5000
```

### Terminal 2 — Start the frontend

```bash
cd cattlecare-gui
npm run dev
```

✅ You should see:
```
VITE v5.x  ready in 300ms
➜  Local: http://localhost:5173/
```

### Open in browser

```
http://localhost:5173
```

> ⚠️ Both terminals must stay running while using the app.

---

## 🖥️ Features & Usage

### 🏠 Dashboard
Shows a live overview of the farm — total cattle, daily milk production, pending breedings, profit/loss summary, and recent activity.

### 🐄 All Cattle
- **Add** new cattle using the ➕ Add New Cattle button
- **Search** by name, tag number, or breed
- **Filter** by status (Active / Sold / Dead) or gender
- **View** full profile including weight history
- **Edit** or **Delete** any record

### 🥛 Cows & Milk
- View all cows with their daily milk production
- Update lactation status (Lactating / Dry / Pregnant)
- Update last calving date

### 🐂 Bulls
- View all bulls with fertility and semen quality
- Update fertility status after vet checkup

### 💑 Breeding
- Record new breeding events (Natural or AI method)
- Update outcome (Pending / Successful / Failed)

### 🐣 Births
- Record new calf births linked to mother and breeding record
- Mark any complications during delivery

### 🪦 Deaths
- Record cattle deaths — status auto-updates to "Dead" via database trigger
- Mark whether vet has verified the death

### ⚖️ Weight Records
- Add weight measurements per cattle with date
- View weight history with visual progress bar

### 🛒 Purchases
- Record cattle purchase with seller name, price, and market
- Running total of all money spent

### 💰 Sales
- Record cattle sales — triggers automatically update status to "Sold"
- Profit/Loss is auto-calculated and inserted by database trigger

### 📊 Profit & Loss
- Auto-generated from sales — no manual entry needed
- Shows net profit/loss per cattle and overall farm total

---

## 📁 Code Structure

```
cattlecare-pro/
│
├── backend/                        # Express.js backend server
│   ├── server.js                   # All API routes — calls stored procedures only
│   ├── package.json                # Backend dependencies
│   └── .env                        # MySQL credentials (never share this file)
│
├── cattlecare-gui/                 # React Vite frontend
│   ├── index.html                  # Entry HTML — includes Google Fonts
│   ├── vite.config.js              # Vite configuration
│   ├── package.json                # Frontend dependencies
│   │
│   └── src/
│       ├── main.jsx                # React entry point — mounts App
│       ├── App.jsx                 # Main shell — sidebar + routing between pages
│       ├── api.js                  # All axios API calls to backend (one place)
│       ├── styles.css              # Global CSS — colors, layout, buttons, tables
│       │
│       ├── components/
│       │   ├── Sidebar.jsx         # Left navigation menu
│       │   └── UI.jsx              # Reusable components — Modal, Toast, Badge, Field
│       │
│       └── pages/
│           ├── Dashboard.jsx       # Home screen with farm statistics
│           ├── CattlePage.jsx      # Full CRUD for cattle records
│           ├── CowsPage.jsx        # Milk production and lactation management
│           ├── HealthPages.jsx     # Bulls, Breeding, Births, Deaths pages
│           └── FinancePages.jsx    # Weight, Purchases, Sales, Profit/Loss pages
│
├── dbDDL.sql                       # Creates all 12 tables, triggers, stored procedures, views
├── dbDML.sql                       # Inserts 15–20 sample rows per table
└── README.md                       # This file
```

### Key Files Explained

| File | What it does |
|---|---|
| `server.js` | The only file that touches MySQL — calls stored procedures, never raw SQL from GUI |
| `api.js` | Single place for all frontend HTTP calls — easy to update base URL |
| `App.jsx` | Controls which page is shown based on sidebar selection |
| `UI.jsx` | Shared components used across all pages — Modal, Toast notifications, Status badges |
| `styles.css` | All visual design — colors, fonts, cards, tables, buttons in one file |
| `dbDDL.sql` | Run this first — sets up entire database schema |
| `dbDML.sql` | Run this second — fills database with realistic sample data |

---

## 🗄️ Database

- **Database name:** `cattlecare_pro`
- **Tables:** 12 (USER, FARM, CATTLE, COW, BULL, WEIGHT_RECORD, COLOR_RECORD, DEATH_RECORD, BREEDING_RECORD, BIRTH_RECORD, PURCHASE_RECORD, SALE_RECORD, PROFIT_LOSS_RECORD)
- **Stored Procedures:** 10 — one for each core operation
- **Triggers:** 5 — auto-update cattle status on death/sale, auto-calculate profit/loss, enforce gender constraints
- **Views:** 3 — active cattle, milk overview, profit/loss summary

> All GUI operations go through stored procedures. Direct SQL from the frontend is not used.

---

## 🤖 AI Disclosure

This project used AI assistance (Claude by Anthropic) during development. Below are the prompts used:

| # | Prompt Summary |
|---|---|
| 1 | Generate complete DDL script for CattleCare Pro based on ERD |
| 2 | Generate complete DML script with 15+ rows per table, no hardcoded PKs |
| 3 | Design a farm-friendly GUI in React with full CRUD for all tables |
| 4 | Create Express backend connecting React to MySQL via stored procedures |
| 5 | Fix input focus loss bug in React forms |
| 6 | Write professional README file |

All AI-generated code was reviewed, tested, and understood by the team before submission.

---

## 👥 Team

| Name | Role |
|---|---|
| [Your Name] | Database implementation, GUI development |
| [Teammate 2] | ERD to relational schema conversion |
| [Teammate 3] | Normalization, report writing |

---

## 📚 References

- MySQL 9.6 Documentation — https://dev.mysql.com/doc/
- React Documentation — https://react.dev/
- Express.js Documentation — https://expressjs.com/
- Anthropic Claude — https://claude.ai (AI assistance)

---

> **Course:** CSC-271 Database Systems | **Institution:** Namal University, Mianwali | **Deadline:** 21st June, 2026
