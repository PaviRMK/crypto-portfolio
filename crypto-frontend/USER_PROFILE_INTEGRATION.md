# User Profile Integration Guide

## Overview
The frontend now uses a centralized **UserContext** to manage user profile data dynamically from the backend API.

## Architecture

### 1. **UserContext** (`src/contexts/UserContext.jsx`)
- Manages global user profile state
- Handles API calls and caching
- Provides hooks: `useUser()`

### 2. **User API Service** (`src/services/userApi.jsx`)
- `fetchUserProfile()` — GET `/user/profile`
- `updateUserProfile(data)` — PUT `/user/profile`
- `changeUserPassword(data)` — POST `/user/change-password`

### 3. **Component Integration**
- **Navbar**: Displays user name, email, profile summary
- **ProfilePage**: Shows and edits user profile
- **SettingsPage**: Manages user preferences

## Backend Expected Responses

### GET /api/user/profile
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "joinDate": "2025-01-15T10:30:00Z"
}
```

### PUT /api/user/profile
**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:** Updated user object (same structure as GET)

### POST /api/user/change-password
**Request:**
```json
{
  "currentPassword": "old123",
  "newPassword": "new456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## Data Flow

1. **Login** → Token stored in localStorage
2. **App Mounts** → UserContext fetches `/user/profile` using token
3. **Components Subscribe** → Navbar and ProfilePage use `useUser()` hook
4. **Caching** → Profile cached in localStorage as `userProfileCache` for offline fallback
5. **On Logout** → Token cleared, context resets

## Loading & Error Handling

### Navbar Loading State
- Avatar shows loading pulse animation while fetching
- Dropdown name/email show skeleton text
- Falls back to cached data if available

### ProfilePage Loading State
- Shows skeleton loading blocks
- Displays success/error messages on save
- Disables button while saving

### Error Handling
- If API fails: Falls back to localStorage cache
- If no cache: Shows error message
- User can retry by navigating away and back

## Token Management
- Token stored in localStorage after login
- Automatically included in all API requests via axios interceptor
- Cleared on logout

## Future Enhancements
- Add refresh token mechanism
- Implement re-auth on 401 errors
- Add Settings API endpoints for notification/dark mode toggles
