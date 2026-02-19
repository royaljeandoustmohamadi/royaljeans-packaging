# 🚀 Quick Start Guide - Royal Jeans Order Management System

## ✅ What You've Done (Backend is Ready!)

You've successfully set up the Backend:
- ✅ Created `.env` file
- ✅ Set up SQLite database
- ✅ Ran migrations
- ✅ Started Backend server on port 5000

---

## 📋 Next Steps: Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies (if not done)

```powershell
npm install
```

### Step 3: Create .env File

```powershell
cp .env.example .env
```

### Step 4: Check .env Content

Make sure it contains:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend Server

**IMPORTANT: Open a NEW terminal window!**

```powershell
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🌐 Access the System

### Backend Server
- URL: `http://localhost:5000`
- Health Check: `http://localhost:5000/health`
- API: `http://localhost:5000/api/*`

### Frontend Application
- URL: `http://localhost:5173`
- Open this in your browser!

---

## 👤 First Time Login

### Register Your First User (Admin)

Since the database is empty, you need to register first:

**Option 1: Using Postman**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@royaljeans.com",
  "password": "123456",
  "fullName": "System Admin",
  "role": "ADMIN"
}
```

**Option 2: Using Frontend Registration Form**

1. Go to `http://localhost:5173`
2. Click "Register" button
3. Fill in:
   - Email: `admin@royaljeans.com`
   - Password: `123456`
   - Full Name: `System Admin`
   - Role: ADMIN

### Login

After registration:
1. Go to login page
2. Email: `admin@royaljeans.com`
3. Password: `123456`

---

## 🎯 Main Features

### 1. Dashboard
- View order statistics
- Charts and graphs
- Quick access to all sections

### 2. Order Management
- **Orders List**: View all orders with search and filters
- **Create Order**: Complete form with 84 fields in 5 tabs:
  - Tab 1: Basic Info (code, date, status)
  - Tab 2: Sizing (healthy, eco 1-3, sample, stock)
  - Tab 3: Inventory (requirements, sewing, fabric)
  - Tab 4: Additional Info
  - Tab 5: Description
- **Edit Order**: Modify order information
- **Delete Order**: Remove order (Admin only)

### 3. Contractor Management
- **Contractors List**: View all contractors
- **Add Contractor**: Register new contractor with type:
  - Fabric
  - Production
  - Packaging
  - Stone Washing
- **Evaluate Contractors**: Rate and comment
- **View Evaluation History**

### 4. Reports
- Excel export of orders
- Filter by date and status
- Statistics and analytics

---

## 🔧 Project Structure

```
royaljeans-packaging/
├── backend/                      # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── index.js            # Server entry point
│   │   ├── routes/             # API Routes
│   │   │   ├── auth.js         # Authentication
│   │   │   ├── orders.js       # Orders CRUD
│   │   │   ├── users.js        # User management
│   │   │   ├── contractors.js  # Contractors CRUD
│   │   │   └── reports.js      # Reports
│   │   ├── middleware/         # Middleware
│   │   └── utils/              # Utilities
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── dev.db              # SQLite database
│   └── package.json
│
└── frontend/                     # Frontend App (React + Chakra UI)
    ├── src/
    │   ├── main.jsx            # React entry
    │   ├── App.jsx             # Main component
    │   ├── pages/              # Pages
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── OrdersList.jsx
    │   │   ├── OrderCreate.jsx
    │   │   └── Contractors.jsx
    │   ├── components/         # Reusable components
    │   ├── services/           # API services
    │   ├── store/              # State management
    │   └── theme/              # Chakra UI theme
    └── package.json
```

---

## 🚀 Important Commands

### Backend

```bash
cd backend

# Start development server
npm run dev

# Start production server
npm start

# View database with Prisma Studio
npm run prisma:studio

# Run migration
npm run prisma:migrate

# Regenerate Prisma Client
npm run prisma:generate
```

### Frontend

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## 🔐 API Endpoints

### Authentication

```http
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login
GET    /api/auth/profile     # Get profile (auth required)
```

### Orders

```http
GET    /api/orders           # List all orders (auth required)
POST   /api/orders           # Create order (auth required)
GET    /api/orders/:id       # Get order (auth required)
PUT    /api/orders/:id       # Update order (auth required)
DELETE /api/orders/:id       # Delete order (auth required)
```

### Contractors

```http
GET    /api/contractors              # List all (auth required)
POST   /api/contractors              # Create contractor (auth required)
GET    /api/contractors/:id          # Get contractor (auth required)
PUT    /api/contractors/:id          # Update contractor (auth required)
DELETE /api/contractors/:id          # Delete contractor (auth required)
POST   /api/contractors/:id/evaluations  # Add evaluation (auth required)
```

### Reports

```http
GET    /api/reports/orders            # Get orders report (auth required)
GET    /api/reports/orders/export     # Export to Excel (auth required)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Frontend can't connect to Backend

**Cause**: Backend not running or wrong port

**Solution**:
```bash
# Check Backend status in its terminal
# Or test health endpoint
curl http://localhost:5000/health
```

### Issue 2: CORS Error

**Cause**: CORS settings incorrect

**Solution**:
1. Check `backend/.env` file
2. Make sure `NODE_ENV=development` is set
3. Restart Backend server

### Issue 3: Database not working

**Cause**: Database corrupted or migration not run

**Solution**:
```bash
cd backend

# Delete current database
rm prisma/dev.db

# Run migration again
npx prisma migrate dev

# Restart server
npm run dev
```

### Issue 4: Port already in use

**Cause**: Port 5000 or 5173 already used

**Solution**:
```bash
# Find process using the port
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in .env file
```

### Issue 5: Authentication Error

**Cause**: Token expired or missing

**Solution**:
1. Logout from system
2. Login again
3. If problem persists, refresh browser

---

## 🗄️ Database Tables

### User
- id, email, password, fullName, role
- Roles: ADMIN, MANAGER, USER

### Order (84 fields!)
- Basic: code, date, status, createdBy
- Sizing: healthy, eco1, eco2, eco3, sample, stock
- Inventory: requirements, sewing, fabric
- And more...

### Contractor
- id, name, type, contactInfo, isActive
- Types: FABRIC, PRODUCTION, PACKAGING, STONE_WASHING

### ContractorEvaluation
- id, contractorId, rating, comment, evaluatedBy, createdAt

### AuditLog
- id, entity, entityId, action, userId, changes, createdAt

### View Database

```bash
cd backend
npm run prisma:studio
```

Opens a GUI to view and edit the database.

---

## 📱 Testing with Postman

### 1. Health Check

```http
GET http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-02-19T...",
  "version": "1.0.0"
}
```

### 2. Register User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@royaljeans.com",
  "password": "123456",
  "fullName": "Test User",
  "role": "USER"
}
```

### 3. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@royaljeans.com",
  "password": "123456"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@royaljeans.com",
    "fullName": "Test User",
    "role": "USER"
  }
}
```

### 4. Get Orders

```http
GET http://localhost:5000/api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 UI Features

### RTL Support (Right-to-Left)
- All Persian text displays correctly
- Layout is right-to-left

### Persian Font
- Uses Vazirmatn font
- High readability and beauty

### Dark Mode
- Switch between light and dark mode
- Settings saved in browser

### Responsive
- Works on mobile, tablet, and desktop
- Sidebar hides on mobile

---

## 🔒 Security Tips for Production

1. **Change JWT_SECRET**
   ```env
   # In backend/.env
   JWT_SECRET="your-very-secure-secret-key-here"
   ```

2. **Use Stronger Database**
   - Use PostgreSQL or MySQL in production
   - Configure in `prisma/schema.prisma`

3. **Enable HTTPS**
   - Always use HTTPS in production
   - Set up SSL Certificate

4. **Environment Variables**
   - Never commit `.env` to git
   - Use `.env.example` only

---

## 🎯 Complete Setup Checklist

### Backend ✅
- [x] Install dependencies (`npm install`)
- [x] Create `.env` file
- [x] Run migration (`npx prisma migrate dev`)
- [x] Start server (`npm run dev`)
- [ ] Test Health Check
- [ ] Register Admin user

### Frontend
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env` file
- [ ] Start server (`npm run dev`)
- [ ] Open browser at `http://localhost:5173`
- [ ] Register user
- [ ] Login to system
- [ ] Test creating order
- [ ] Test contractor management

---

## 💡 Development Tips

### Add New Field to Order

1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Edit `backend/src/routes/orders.js`
4. Edit `frontend/src/pages/OrderCreate.jsx`

### Add New API Endpoint

1. Create route file in `backend/src/routes/`
2. Add to `backend/src/index.js`
3. Create service in `frontend/src/services/api.js`
4. Use in React components

### Modify UI

1. Edit components in `frontend/src/components/`
2. Edit pages in `frontend/src/pages/`
3. Change theme in `frontend/src/theme/`

---

## 🆘 Troubleshooting

If you encounter issues:

1. **Read Logs**: Check terminal output
2. **Health Check**: Test `http://localhost:5000/health`
3. **Prisma Studio**: Use to view database
4. **Browser Console**: Check for Frontend errors

---

## 🎉 Congratulations!

You now have a complete Order Management System!
Built for **Royal Jeans** 🏭

---

**Last Updated**: February 2024
**Version**: 1.0.0
