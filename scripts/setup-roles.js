import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');

try {
  const serviceAccountJson = readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase initialized successfully\n');
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.error('Please download it from Firebase Console and place it in project root');
  process.exit(1);
}

const auth = admin.auth();

async function setUserRole(email, role) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role });
    console.log(`✅ ${email} assigned role: ${role}`);
  } catch (error) {
    console.error(`❌ Error for ${email}:`, error.message);
  }
}

async function setup() {
  console.log('🔄 Assigning roles to users...\n');
  await setUserRole('student@test.com', 'student');
  await setUserRole('teacher@test.com', 'teacher');
  await setUserRole('faculty@test.com', 'faculty');
  await setUserRole('registrar@test.com', 'registrar');
  await setUserRole('admin@test.com', 'main_admin');
  console.log('\n✅ All roles assigned successfully!');
  process.exit(0);
}

setup().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

setup();
