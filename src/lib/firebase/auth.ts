import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, FieldValue } from 'firebase/firestore'
import { auth, db } from './config'
import { UserProfile } from '@/types/user'

const googleProvider = new GoogleAuthProvider()

export class AuthService {
  // Email/Password Registration
  static async registerWithEmail(email: string, password: string, displayName: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile
      await updateProfile(user, { displayName })
      
      // Create user profile in Firestore
      await this.createUserProfile(user)
      
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  // Email/Password Sign In
  static async signInWithEmail(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  // Google Sign In
  static async signInWithGoogle() {
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await this.createUserProfile(user)
      }
      
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  // Anonymous Sign In
  static async signInAnonymously() {
    try {
      const { user } = await signInAnonymously(auth)
      
      // Create guest profile
      await this.createUserProfile(user, true)
      
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  // Link Anonymous Account
  static async linkAnonymousAccount(email: string, password: string, displayName: string) {
    if (!auth.currentUser || !auth.currentUser.isAnonymous) {
      throw new Error('No anonymous user to link')
    }

    try {
      const credential = EmailAuthProvider.credential(email, password)
      const { user } = await linkWithCredential(auth.currentUser, credential)
      
      // Update profile
      await updateProfile(user, { displayName })
      
      // Update user profile in Firestore
      await this.updateUserProfile(user.uid, {
        displayName,
        email,
        isGuest: false,
        accountLinkedAt: serverTimestamp() as FieldValue,
      })
      
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  // Sign Out
  static async signOut() {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Create User Profile
  static async createUserProfile(user: User, isGuest = false) {
    const userProfile: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || (isGuest ? 'Guest Player' : 'Player'),
      photoURL: user.photoURL,
      isGuest,
      points: 100, // Starting points
      tickets: 0,
      level: 1,
      experience: 0,
      unlockedArcades: ['classic'],
      unlockedModes: ['freeplay', 'challenges'],
      createdAt: serverTimestamp() as FieldValue,
      updatedAt: serverTimestamp() as FieldValue,
      lastLoginAt: serverTimestamp() as FieldValue,
    }

    await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true })
  }

  // Update User Profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...updates,
        updatedAt: serverTimestamp() as FieldValue,
      },
      { merge: true }
    )
  }

  // Get User Profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null
  }
}