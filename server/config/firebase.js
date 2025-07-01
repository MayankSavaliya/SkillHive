import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

let serviceAccount;

try {
  // Try to read from file first (easier for development)
  const serviceAccountPath = path.join(process.cwd(), 'config', 'serviceAccountKey.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  // Fallback to environment variables
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_PRIVATE_KEY && 
      process.env.FIREBASE_CLIENT_EMAIL) {
    
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
  } else {
    console.error('❌ Firebase configuration missing!');
    console.error('Please either:');
    console.error('1. Place serviceAccountKey.json in server/config/ folder, OR');
    console.error('2. Set Firebase environment variables in .env file');
    
    // For now, let's not exit the process to allow testing without Firebase
    console.warn('⚠️  Firebase Admin SDK not initialized - Firebase auth features will not work');
    serviceAccount = null;
  }
}

// Initialize Firebase Admin only if we have valid service account
export const initializeFirebase = () => {
  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  }
};

// Auto-initialize on import
initializeFirebase();

export const adminAuth = serviceAccount ? admin.auth() : null;
export default admin;
