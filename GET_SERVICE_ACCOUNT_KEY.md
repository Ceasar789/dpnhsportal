# 🔑 How to Get serviceAccountKey.json from Firebase

## Quick Steps (2 minutes)

### 1. Go to Firebase Console
- Open: https://console.firebase.google.com
- Select: **SmartEdu Portal** project

### 2. Get Service Account Key
- Click **⚙️ Settings** (top left, gear icon)
- Click **"Service Accounts"** tab
- Click **"Generate New Private Key"** button (blue)
- A JSON file downloads automatically

### 3. Save the File
- The file is named something like: `smartedu-portal-xxxxx.json`
- **Rename it to:** `serviceAccountKey.json`
- **Move it to project root** (same folder as package.json)

### 4. Verify File Location
```
C:\SchoolWorks\dpnhs_portal\SmartEdu_Portal\
├── serviceAccountKey.json  ← Should be here!
├── .env
├── package.json
├── scripts/
│   └── setup-roles.js
└── ...
```

### 5. Run the Script
```powershell
node scripts/setup-roles.js
```

You should see:
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

## ⚠️ Important Security Notes

1. **NEVER commit serviceAccountKey.json to git**
   - It's already in `.gitignore` ✓

2. **Keep it private**
   - This file gives full access to your Firebase project
   - Don't share it or upload it anywhere

3. **If leaked**
   - Regenerate a new key in Firebase Console
   - Delete the old one

---

## ❌ Troubleshooting

### "serviceAccountKey.json not found"
- Make sure the file is in project root
- Check the filename is exactly: `serviceAccountKey.json`
- Make sure it's in the right folder (same level as package.json)

### "Permission denied" or "Invalid credentials"
- Make sure you downloaded the key from the correct Firebase project
- Make sure the file hasn't been modified

### "User not found"
- Make sure users exist in Firebase Console → Authentication → Users
- Check email addresses are exactly correct

---

Done! Let me know once you place the file and we'll run it! 👇
