# Contractor Synchronization Feature

## Overview
This document explains the synchronization feature between the Settings panel and the Contractor management system.

## Problem Solved
1. **500 Internal Server Error on `/api/settings/all`**: The error was caused by the database not being properly initialized with Prisma client.
2. **Contractor-Settings Synchronization**: Information entered in the admin panel's Settings section (Fabric Suppliers and Production Suppliers) now automatically syncs with the Contractors table.

## Changes Made

### 1. Database Setup
- Created `.env` file in the backend directory with proper database configuration
- Ran `npm install` to install all dependencies
- Generated Prisma client using `npm run prisma:generate`
- Synced database schema using `npx prisma db push`

### 2. Contractor Synchronization Logic
Modified `/backend/src/routes/settings.js` to implement bidirectional synchronization:

#### Fabric Suppliers (`/api/settings/fabric-suppliers`)
- **CREATE**: When a fabric supplier is added, a corresponding contractor entry is created with `type: 'FABRIC'`
- **UPDATE**: When a fabric supplier is renamed:
  - The contractor entry is updated with the new name
  - If the old contractor still exists, it's deactivated
- **DELETE**: When a fabric supplier is deleted, the corresponding contractor is deactivated (`isActive: false`)

#### Production Suppliers (`/api/settings/production-suppliers`)
- **CREATE**: When a production supplier is added, a corresponding contractor entry is created with `type: 'PRODUCTION'`
- **UPDATE**: When a production supplier is renamed:
  - The contractor entry is updated with the new name
  - If the old contractor still exists, it's deactivated
- **DELETE**: When a production supplier is deleted, the corresponding contractor is deactivated (`isActive: false`)

## How It Works

### Adding a Supplier
```javascript
// Admin Panel → Add Fabric Supplier "پارچه‌فروش نمونه"
// Automatically creates Contractor entry:
{
  name: "پارچه‌فروش نمونه",
  type: "FABRIC",
  isActive: true
}
```

### Updating a Supplier
```javascript
// Admin Panel → Update "پارچه‌فروش نمونه" to "پارچه‌فروش جدید"
// Updates Contractor entry and deactivates old one:
// Old: { name: "پارچه‌فروش نمونه", isActive: false }
// New: { name: "پارچه‌فروش جدید", isActive: true }
```

### Deleting a Supplier
```javascript
// Admin Panel → Delete "پارچه‌فروش جدید"
// Sets Contractor entry to inactive:
{
  name: "پارچه‌فروش جدید",
  type: "FABRIC",
  isActive: false  // Not deleted, just deactivated
}
```

## Benefits
1. **Consistency**: Data is consistent across both the Settings panel and Contractor management
2. **Efficiency**: No need to manually enter the same information in multiple places
3. **Traceability**: Historical data is preserved even when suppliers are deactivated
4. **Flexibility**: Contractors can still be managed independently with additional details (phone, address, notes, evaluations)

## Testing
The synchronization has been tested with the following scenarios:
1. ✅ Creating a fabric supplier → Contractor created successfully
2. ✅ Creating a production supplier → Contractor created successfully
3. ✅ Deleting a fabric supplier → Contractor deactivated successfully
4. ✅ `/api/settings/all` endpoint returns proper data

## API Endpoints

### Settings Endpoints (with sync)
- `POST /api/settings/fabric-suppliers` - Create & sync
- `PUT /api/settings/fabric-suppliers/:id` - Update & sync
- `DELETE /api/settings/fabric-suppliers/:id` - Deactivate & sync
- `POST /api/settings/production-suppliers` - Create & sync
- `PUT /api/settings/production-suppliers/:id` - Update & sync
- `DELETE /api/settings/production-suppliers/:id` - Deactivate & sync

### Contractor Endpoints (independent)
- `GET /api/contractors` - Get all contractors (requires auth)
- `POST /api/contractors` - Create contractor (requires auth)
- `PUT /api/contractors/:id` - Update contractor (requires auth)
- `DELETE /api/contractors/:id` - Delete contractor (requires auth)

## Future Enhancements
Potential improvements that could be made:
1. Sync for Stone Wash and Packaging contractors
2. Conflict resolution when both a Settings entry and Contractor entry exist with same name
3. Two-way sync (Contractors created in Contractor panel appear in Settings)
4. Bulk sync for existing data
