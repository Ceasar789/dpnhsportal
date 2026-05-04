# 🚀 Firebase Setup - Next Steps

## ✅ What's Already Done

| Item | Status |
|------|--------|
| Firebase project created | ✅ |
| Web app registered | ✅ |
| `.env` file created | ✅ |
| Email/Password auth enabled | ✅ |
| 5 test users created in Firebase | ✅ |
| `setup-roles.js` script created | ✅ |
| `firebase-admin` installed | ✅ |

---

## ⏳ What You Need to Do Now

### **ONLY 1 Step Left!**

#### Get the serviceAccountKey.json file:

1. **Go to Firebase Console:**
   - https://console.firebase.google.com
   - Select "SmartEdu Portal"

2. **Click Settings ⚙️** (top left)

3. **Click "Service Accounts"** tab

4. **Click "Generate New Private Key"** button

5. **A JSON file downloads**

6. **Rename it to:** `serviceAccountKey.json`

7. **Move it to project root** (next to package.json)

8. **Run this command:**
   ```powershell
   node scripts/setup-roles.js
   ```

---

## 🔍 Expected Output

When you run the script, you should see:

```
🔄 Assigning roles to users...

✅ student@test.com assigned role: student
✅ teacher@test.com assigned role: teacher
✅ faculty@test.com assigned role: faculty
✅ registrar@test.com assigned role: registrar
✅ admin@test.com assigned role: main_admin

✅ All roles assigned successfully!
```

---

## 🧪 After Roles Are Assigned

### Test Login:

1. Go to: http://localhost:5178/login
2. Click "Student Login"
3. Enter: `student@test.com` / `password123`
4. **Should redirect to Student Dashboard!** ✅

Try other users too:
- `teacher@test.com` → Teacher Dashboard
- `registrar@test.com` → Registrar Dashboard
- `admin@test.com` → Admin Dashboard
- `faculty@test.com` → Faculty Dashboard

---

## 📂 File Locations

Your project structure should look like:

```
SmartEdu_Portal/
├── serviceAccountKey.json          ← DOWNLOAD FROM FIREBASE
├── .env                            ✅ Created
├── .gitignore                      ✅ Updated
├── package.json                    ✅ Ready
├── scripts/
│   └── setup-roles.js              ✅ Created
├── GET_SERVICE_ACCOUNT_KEY.md      📖 Guide
└── src/
    ├── config/
    │   └── firebase.js             ✅ Configured
    └── context/
        └── AuthContext.jsx         ✅ Ready
```

---

## 🚨 Remember

- ✅ **NEVER commit serviceAccountKey.json to git** (it's in .gitignore)
- ✅ **Keep it private** - it gives full access to your Firebase project
- ✅ **Regenerate if leaked** - do it in Firebase Console

---

## ✨ You're Almost There!

**Just need to:**
1. Download `serviceAccountKey.json` from Firebase Console
2. Place it in project root
3. Run: `node scripts/setup-roles.js`
4. Test login! 🎉

---

See `GET_SERVICE_ACCOUNT_KEY.md` for detailed step-by-step instructions!
