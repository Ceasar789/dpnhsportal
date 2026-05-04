# Firebase Authentication - Quick Setup Guide

## ✅ What's Connected

Your Firebase authentication is now fully integrated into your SmartEdu Portal:

### ✓ Connected Components
- [x] AuthContext - Firebase auth state management
- [x] RoleLogin - Email/password authentication
- [x] ForgotPassword - Password reset flow
- [x] VerifyEmail - Email verification
- [x] ProtectedRoute - Role-based access control
- [x] AppRoutes - All routes with role protection
- [x] App.jsx & main.jsx - Proper router setup

### ✓ Authentication Features
- ✅ User login with email/password
- ✅ User registration with verification email
- ✅ Password reset via email link
- ✅ Email verification
- ✅ Profile updates
- ✅ Logout with state reset
- ✅ Persistent authentication (survives page refresh)
- ✅ Role-based dashboard routing

---

## 🚀 Next Steps to Complete Setup

### Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "SmartEdu Portal"
3. Follow the setup wizard
4. Click "Web" icon to register your web app
5. Copy the configuration

### Step 2: Set Up Environment Variables (2 minutes)

Create `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these values from Firebase Console → ⚙️ Settings → Project Settings → Your apps

### Step 3: Enable Email/Password Authentication (1 minute)

1. Firebase Console → Authentication → Sign-in method
2. Click on "Email/Password"
3. Toggle ON "Enable"
4. Save changes

### Step 4: Create Test Users (5 minutes)

1. Firebase Console → Authentication → Users tab
2. Click "Add user" button
3. Create these test users:

| Email | Password | Role |
|-------|----------|------|
| student@test.com | password123 | student |
| teacher@test.com | password123 | teacher |
| registrar@test.com | password123 | registrar |
| admin@test.com | password123 | main_admin |

### Step 5: Set Up Firebase Admin SDK for Roles (10 minutes)

1. **Install Firebase Admin SDK:**
   ```bash
   npm install firebase-admin
   ```

2. **Get Service Account Key:**
   - Firebase Console → ⚙️ Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` (KEEP PRIVATE!)

3. **Create `scripts/setup-roles.js`:**
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('../serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
   });

   const auth = admin.auth();

   async function setUserRole(email, role) {
     try {
       const user = await auth.getUserByEmail(email);
       await auth.setCustomUserClaims(user.uid, { role });
       console.log(`✓ ${email} set as ${role}`);
     } catch (error) {
       console.error(`✗ Error for ${email}:`, error.message);
     }
   }

   // Set roles for test users
   async function setup() {
     await setUserRole('student@test.com', 'student');
     await setUserRole('teacher@test.com', 'teacher');
     await setUserRole('registrar@test.com', 'registrar');
     await setUserRole('admin@test.com', 'main_admin');
     console.log('✓ All roles set!');
     process.exit(0);
   }

   setup();
   ```

4. **Run the script:**
   ```bash
   node scripts/setup-roles.js
   ```

### Step 6: Test the App (3 minutes)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test login flow:**
   - Go to http://localhost:5173/login
   - Click "Student Login"
   - Enter: `student@test.com` / `password123`
   - Should redirect to `/student-dashboard`

3. **Test role verification:**
   - Logout
   - Try logging in as different users
   - Each should redirect to their role-specific dashboard

---

## 🔧 Troubleshooting

### "FirebaseError: Firebase is not initialized"
- ✅ Make sure `.env` file exists with correct values
- ✅ Restart dev server after creating `.env`
- ✅ Check values match exactly (copy-paste from Firebase)

### "Role is undefined after login"
- ✅ Make sure you ran `node scripts/setup-roles.js`
- ✅ User must logout and login again after role is set
- ✅ Check browser console for errors

### "Login shows 'invalid-credential'"
- ✅ Verify user exists in Firebase Console
- ✅ Check email/password are correct
- ✅ Make sure Email/Password auth is enabled

### "Sent to wrong dashboard after login"
- ✅ Check user has correct role in Firebase Console
- ✅ Roles must match: `student`, `teacher`, `faculty`, `registrar`, `main_admin`
- ✅ Clear browser localStorage and try again

---

## 📚 Using Auth in Your Components

### Check if user is logged in:
```javascript
import { useAuth } from '../context/AuthContext';

export default function MyComponent() {
  const { isAuthenticated, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {userData.name}!</div>;
}
```

### Check user role:
```javascript
const { isStudent, isTeacher, isAdmin } = useAuth();

{isAdmin() && <AdminPanel />}
{isStudent() && <StudentGrades />}
{isTeacher() && <TeacherGradeBook />}
```

### Use login/logout functions:
```javascript
const { login, logout } = useAuth();

const handleLogin = async () => {
  try {
    await login('email@example.com', 'password');
    // User is logged in, navigate to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

const handleLogout = async () => {
  await logout();
  // User logged out
};
```

---

## 🛡️ Security Checklist

- [ ] `.env` file created with correct values
- [ ] `.env` file added to `.gitignore` (NEVER commit to git!)
- [ ] `serviceAccountKey.json` is in `.gitignore`
- [ ] Environment variables are VITE_* prefixed
- [ ] Email/Password auth is enabled in Firebase
- [ ] User roles are set via Admin SDK
- [ ] All dashboard routes have role protection
- [ ] Test users work correctly

---

## 📖 Full Documentation

For complete API reference and advanced setup, see **FIREBASE_SETUP.md** in the project root.

---

## 🆘 Need Help?

1. Check **FIREBASE_SETUP.md** for detailed documentation
2. See browser console (F12 → Console tab) for error messages
3. Check Firebase Console → Authentication → Logs for auth failures
4. Verify all environment variables are set correctly

---

## ✨ You're All Set!

Your Firebase authentication is now fully integrated. Users can:
- ✅ Login with email/password
- ✅ Reset forgotten passwords
- ✅ Verify email addresses
- ✅ Access role-specific dashboards
- ✅ Stay logged in across page refreshes
- ✅ Logout securely

**Happy coding! 🚀**

