import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Connect to emulators in development (disabled by default - uncomment to use emulators)
// Note: For production Firebase, keep this section commented out
/*
if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATORS === 'true') {
  try {
    // Only connect if not already connected
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }
    
    // Check if Firestore emulator is not already connected
    const firestoreSettings = (db as unknown as { _delegate?: { _databaseId?: { host?: string } } })._delegate?._databaseId
    if (!firestoreSettings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
    
    // Check if Storage emulator is not already connected
    if (!((storage as unknown as { _host?: string })._host?.includes('localhost'))) {
      connectStorageEmulator(storage, 'localhost', 9199)
    }
  } catch (error) {
    // Emulators might already be connected, ignore connection errors
    console.log('Firebase emulators connection info:', error)
  }
}
*/

export { app }
export default app