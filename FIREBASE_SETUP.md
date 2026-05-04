# Firebase Authentication Setup Guide

This guide explains how to properly configure Firebase Authentication for the SmartEdu Portal application.

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Firebase Console Setup](#firebase-console-setup)
3. [Authentication Methods](#authentication-methods)
4. [User Roles Setup](#user-roles-setup)
5. [Auth Context Usage](#auth-context-usage)
6. [API Reference](#api-reference)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### How to get these values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → Project Settings
4. Scroll to "Your apps" and click your web app
5. Copy all the values from the config object

---

## 🎯 Firebase Console Setup

### Enable Authentication Methods

1. Go to **Authentication** → **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password** (Required)
   - ⚠️ **Email/Passwordless** (Optional - for PIN verification)

### Create Custom Claims for Roles

User roles are managed via Firebase Custom Claims. You need to set these up using:

**Option 1: Firebase Admin SDK (Recommended)**

```bash
npm install firebase-admin
```

Create `scripts/setup-roles.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project.firebaseio.com'
});

const auth = admin.auth();

// Example: Set a user as an admin
async function setUserRole(email, role) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role });
    console.log(`✓ Set ${email} as ${role}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage:
// setUserRole('student@dpnhs.edu.ph', 'student');
// setUserRole('teacher@dpnhs.edu.ph', 'teacher');
// setUserRole('registrar@dpnhs.edu.ph', 'registrar');
// setUserRole('admin@dpnhs.edu.ph', 'main_admin');
```

**Get your `serviceAccountKey.json`:**
1. Firebase Console → ⚙️ Settings → Service Accounts
2. Click "Generate a new private key"
3. Save it as `serviceAccountKey.json` in your project

**Option 2: Cloud Functions**

```javascript
const admin = require('firebase-admin');
const functions = require('firebase-functions');

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set roles'
    );
  }

  const { uid, role } = data;
  await admin.auth().setCustomUserClaims(uid, { role });
  return { success: true };
});
```

---

## 👥 User Roles Setup

### Supported Roles

```javascript
{
  'student': 'Student Dashboard Access',
  'teacher': 'Teacher Dashboard Access',
  'faculty': 'Faculty Dashboard Access',
  'registrar': 'Registrar Dashboard Access',
  'main_admin': 'Admin Dashboard Access'
}
```

### Setting Up Users

1. **Create User (Firebase Console)**
   - Go to Authentication → Users
   - Click "Add user" → Enter email and password
   - User is created and ready for role assignment

2. **Assign Role Using Admin SDK**
   ```javascript
   await admin.auth().setCustomUserClaims(uid, { role: 'student' });
   ```

3. **Role appears in Client**
   - After login, the role is available via `userData.role`
   - Persists across sessions

---

## 🔑 Auth Context Usage

### In Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { 
    isAuthenticated,
    userData,
    loading,
    login,
    logout,
    sendPasswordReset,
    isStudent,
    isTeacher,
    isAdmin
  } = useAuth();

  // Check authentication
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  // Use user data
  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Role: {userData.role}</p>
      
      {isStudent() && <div>Student Only Content</div>}
      {isAdmin() && <div>Admin Only Content</div>}
    </div>
  );
}
```

### With Protected Routes

```javascript
import ProtectedRoute from './routes/ProtectedRoute';

// Protect by authentication only
<Route
  path="/change-password"
  element={
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  }
/>

// Protect by specific roles
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

// Protect by multiple roles
<Route
  path="/faculty-management"
  element={
    <ProtectedRoute allowedRoles={['teacher', 'faculty', 'main_admin']}>
      <FacultyManagement />
    </ProtectedRoute>
  }
/>
```

---

## 📚 API Reference

### useAuth() Hook Methods

#### **Login**
```javascript
const { login } = useAuth();

try {
  const user = await login(email, password);
  console.log('Logged in:', user.uid);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### **Register**
```javascript
const { register } = useAuth();

try {
  const user = await register(email, password, displayName);
  console.log('User created:', user.uid);
  // Verification email sent automatically
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### **Logout**
```javascript
const { logout } = useAuth();

await logout();
// User is logged out, redirected to login
```

#### **Send Password Reset**
```javascript
const { sendPasswordReset } = useAuth();

try {
  await sendPasswordReset(email);
  console.log('Reset email sent');
} catch (error) {
  console.error('Failed:', error.message);
}
```

#### **Send Email Verification**
```javascript
const { sendVerificationEmail } = useAuth();

try {
  await sendVerificationEmail();
  console.log('Verification email sent');
} catch (error) {
  console.error('Failed:', error.message);
}
```

#### **Update Profile**
```javascript
const { updateUserProfile } = useAuth();

try {
  await updateUserProfile({
    displayName: 'John Doe',
    photoURL: 'https://...'
  });
} catch (error) {
  console.error('Update failed:', error.message);
}
```

### Role Checking Methods

```javascript
const { isStudent, isTeacher, isFaculty, isRegistrar, isAdmin, hasRole, hasAnyRole } = useAuth();

isStudent()           // Returns boolean
isTeacher()           // Returns boolean
isFaculty()           // Returns boolean
isRegistrar()         // Returns boolean
isAdmin()             // Returns boolean

hasRole('student')                              // Check single role
hasAnyRole(['teacher', 'faculty', 'main_admin']) // Check multiple roles
```

### Properties

```javascript
const { user, userData, loading, isAuthenticated, error } = useAuth();

// user: Firebase User object (uid, email, etc.)
// userData: Extended user object with role { uid, email, name, role, emailVerified }
// loading: Boolean - true while fetching auth state
// isAuthenticated: Boolean - true if logged in
// error: String - last error message (or null)
```

---

## 🔄 Authentication Flow

### Login Flow
```
User enters credentials
    ↓
Firebase validates email/password
    ↓
Custom claims with role fetched
    ↓
AuthContext updates with userData + role
    ↓
ProtectedRoute checks role
    ↓
Redirect to appropriate dashboard
```

### Registration Flow
```
User submits registration form
    ↓
Firebase creates user account
    ↓
Display name set
    ↓
Verification email sent
    ↓
User verifies email
    ↓
Admin assigns role via Admin SDK
    ↓
User can login and access role-specific dashboard
```

---

## 🛡️ Security Rules (Firestore)

If using Firestore for additional data, add these rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Admins can read all user data
    match /users/{userId} {
      allow read: if request.auth.token.role == 'main_admin';
    }

    // Students can only read student records
    match /students/{studentId} {
      allow read: if request.auth.token.role in ['student', 'main_admin'];
      allow write: if request.auth.token.role == 'main_admin';
    }
  }
}
```

---

## 🧪 Testing

### Test Login Credentials

Create test users in Firebase Console:

```
Student: student@test.com / password123
Teacher: teacher@test.com / password123
Registrar: registrar@test.com / password123
Admin: admin@test.com / password123
```

Assign roles using Admin SDK:
```javascript
await admin.auth().setCustomUserClaims('student-uid', { role: 'student' });
```

---

## ❌ Common Issues

### "Role is undefined"
- ✅ Make sure role is set via `setCustomUserClaims()`
- ✅ User must logout and login again for role to appear
- ✅ Force token refresh: `user.getIdTokenResult(true)`

### "User not found"
- ✅ Make sure user exists in Firebase
- ✅ Use correct email format
- ✅ Check Firebase rules allow email/password auth

### "Permission denied"
- ✅ Check ProtectedRoute allowedRoles array
- ✅ Verify user has the required role
- ✅ Check Firestore security rules

---

## 📝 Checklist

- [ ] Firebase project created
- [ ] Environment variables set in `.env`
- [ ] Email/Password auth enabled
- [ ] Admin SDK configured
- [ ] User roles assigned to test accounts
- [ ] AuthContext working (check console for errors)
- [ ] Login works and redirects to correct dashboard
- [ ] Protected routes redirect correctly
- [ ] Logout works
- [ ] Password reset emails send

---

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Custom Claims](https://firebase.google.com/docs/auth/admin-sdk-setup)
- [React Integration](https://firebase.google.com/docs/database/web/start)

