# Curator Dashboard Routing Documentation

## Overview
The curator dashboard has been successfully integrated into the main application with proper role-based routing. When users log in as a Curator through the login page, they are automatically redirected to the curator dashboard.

## Routes

### Public Routes
- `/` - Landing Portal (main entry point)
- `/unc-museum` - UNC Museum homepage
- `/collections` - Museum collections
- `/educational` - Educational resources
- `/exclusive` - Exclusive collections

### Authentication Routes
- `/register` - Login/Register page
- `/portal/*` - General public member portal

### Role-Based Dashboards
- `/curator` - **Curator Dashboard** (ARKO system)
- `/staff` - Staff Dashboard (placeholder - under development)

## Login Flow

### For Curators
1. Navigate to `/register`
2. Select "Login" tab
3. Enter any email and password
4. Select "Curator" from Account Type dropdown
5. Click "Sign In"
6. **Automatically redirected to `/curator`**

### For Staff
1. Navigate to `/register`
2. Select "Login" tab
3. Enter any email and password
4. Select "Museum Staff" from Account Type dropdown
5. Click "Sign In"
6. **Automatically redirected to `/staff`** (placeholder page)

### For General Public
1. Navigate to `/register`
2. Select "Login" tab or "Register" tab
3. Complete the form
4. **Redirected to `/portal/dashboard`**

## Architecture

### Component Structure
```
/components
├── curator/
│   ├── CuratorApp.tsx          # Main curator application wrapper
│   ├── CuratorSidebar.tsx      # Sidebar with logout functionality
│   └── [26+ curator components]
├── staff/
│   └── StaffApp.tsx            # Placeholder staff dashboard
└── portal/
    ├── LoginRegister.tsx       # Handles role-based routing
    └── PortalMain.tsx          # General public portal
```

### Key Files Modified
1. **App.tsx**
   - Added curator and staff routes
   - Passes user data and logout handler to dashboards
   - Maintains all existing museum routes

2. **LoginRegister.tsx**
   - Updated `handleLogin` to route based on selected role
   - Curators → `/curator`
   - Staff → `/staff`
   - General Public → `/portal/dashboard`

3. **CuratorSidebar.tsx**
   - Added `onLogout` prop
   - Added logout button in user profile section
   - Navigates back to `/register` on logout

4. **CuratorApp.tsx**
   - New wrapper component for all curator pages
   - Manages internal curator navigation
   - Receives user data from parent App.tsx

## User Authentication
- User state is managed in main App.tsx
- Login handler sets user data: `{ email, role, name }`
- Logout handler clears user state and redirects to login
- User data is passed to dashboard components

## Testing the Curator Dashboard

### Quick Test
```
1. Go to http://localhost:5173/register
2. Click "Login" tab
3. Email: any@example.com
4. Password: any password
5. Account Type: Curator
6. Click "Sign In"
7. ✅ You should see the ARKO Curator Dashboard
```

### Suggested Test Emails (pre-configured)
- `elizabeth@example.com` - Elizabeth Anderson (Curator)
- `jennifer@example.com` - Jennifer Williams (Staff)
- `sarah@example.com` - Sarah Johnson (General Public)

## Features
- ✅ Role-based routing
- ✅ User authentication state management
- ✅ Logout functionality with redirect
- ✅ Curator dashboard fully functional
- ✅ Staff dashboard placeholder
- ✅ General public portal intact
- ✅ All museum pages unchanged

## Front-Facing Museum Pages
All existing museum functionality remains completely unchanged:
- Homepage navigation works as before
- Collections page functions normally
- Educational resources accessible
- Exclusive collections operational
- Search functionality preserved
- All designs and styling intact

## Future Enhancements
- Add protected route middleware
- Implement persistent authentication (localStorage/cookies)
- Add role-based access control to individual pages
- Develop full staff dashboard
- Add password reset functionality
- Implement session timeout
