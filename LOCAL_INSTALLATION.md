# Lexintel POS System - Local Installation Guide

## System Requirements

### Hardware
- Computer with at least 4GB RAM
- 500MB free disk space
- Windows 10/11, macOS, or Linux

### Software
- **Bun** (JavaScript runtime) - Required for running the application
- **Web browser** - Chrome, Firefox, Edge, or Safari

---

## Installation Methods

### Method 1: Quick Start (Recommended for Testing)

1. **Install Bun**
   ```powershell
   # Windows (PowerShell)
   powershell -ExecutionPolicy Bypass -Command "irm bun.sh/install.ps1 | iex"

   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Download the Source Code**
   - Clone from repository OR
   - Download the project folder

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Start the Application**
   ```bash
   bun run dev
   ```

5. **Access the System**
   - Open browser: http://localhost:3000

### Method 2: Production Build (For Permanent Installation)

1. **Install Bun** (see Method 1)

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Build for Production**
   ```bash
   bun run build
   ```

4. **Start Production Server**
   ```bash
   bun run start
   ```

5. **Access the System**
   - Open browser: http://localhost:3000

---

## First Time Setup

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lexintel.local | Admin@1234 |
| Manager | jane@lexintel.local | Change@1234 |
| Cashier | peter@lexintel.local | Change@1234 |
| Accountant | mary@lexintel.local | Change@1234 |

**⚠️ IMPORTANT:** Change your password after first login!

### Initial Setup Steps

1. **Login** with admin credentials
2. **Change admin password** when prompted
3. **Review user accounts** - Add or modify users as needed
4. **Configure inventory** - Add your products
5. **Set up suppliers** - Add your suppliers
6. **Test POS** - Process a test sale

---

## Network Setup (Multiple Computers)

### Option 1: Single Computer (All Users)

Simply run the application on one computer and access via:
- http://localhost:3000 (on the same computer)
- http://[COMPUTER-IP]:3000 (from other computers on network)

### Option 2: Server + Workstations

1. **On Server Computer:**
   ```bash
   bun run start
   ```
   - Note the server's IP address (e.g., 192.168.1.100)

2. **On Workstation Computers:**
   - Open browser to: http://192.168.1.100:3000

3. **Firewall Setup (if needed):**
   - Windows: Allow port 3000 in Windows Firewall
   - Linux: `sudo ufw allow 3000`

---

## Database Location

The database is stored locally in:
- **Path:** `./data/lexintel.db`
- **Format:** SQLite (no additional software needed)

### Backup Database
Simply copy the `lexintel.db` file to backup.

### Restore Database
Replace the `lexintel.db` file with your backup.

---

## Troubleshooting

### "Bun is not recognized"
- Restart your terminal after installation
- Or add Bun to your PATH

### "Port 3000 is already in use"
```bash
# Find and kill the process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### "Cannot connect to database"
- Delete the `data` folder and restart
- The database will be recreated automatically

### Slow Performance
- Close unused browser tabs
- Ensure adequate RAM (4GB+ recommended)
- Use a solid-state drive (SSD) if possible

---

## Features Overview

### Modules

1. **Dashboard** - Real-time sales and inventory overview
2. **Point of Sale (POS)** - Fast checkout with barcode scanning
3. **Inventory** - Product management and stock tracking
4. **Accounting** - Financial entries and expense tracking
5. **Reports** - Sales analytics and performance reports
6. **Suppliers** - Supplier management and purchase orders
7. **Users & Roles** - Staff accounts and permissions
8. **Settings** - System configuration
9. **Training** - Interactive learning module

### User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full system access, user management |
| Manager | Sales, inventory, reports, suppliers |
| Cashier | Process sales, view products |
| Accountant | Financial reports, accounting entries |

---

## Support

For issues or questions:
- Check the Training module in the application
- Review this documentation
- Contact system administrator

---

## System Information

- **Version:** 1.0.0
- **Built with:** Next.js, React, SQLite
- **Database:** Local SQLite (no cloud required)
- **Deployment:** Local network ready
