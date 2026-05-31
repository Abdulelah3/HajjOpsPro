// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  createdAt: string
}

// ============ Session Cookie Helpers ============

function setSessionCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'hajj_session=authenticated; path=/; max-age=86400; SameSite=Lax'
  }
}

function clearSessionCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'hajj_session=; path=/; max-age=0; SameSite=Lax'
  }
}

// ============ تسجيل مستخدم جديد ============

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'manager' | 'user' = 'user'
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    })

    setSessionCookie()
    return user
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير معروف'
    console.error('خطأ في التسجيل:', message)
    throw error
  }
}

// ============ تسجيل الدخول ============

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    setSessionCookie()
    return userCredential.user
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير معروف'
    console.error('خطأ في تسجيل الدخول:', message)
    throw error
  }
}

// ============ تسجيل الخروج ============

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
    clearSessionCookie()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير معروف'
    console.error('خطأ في تسجيل الخروج:', message)
    throw error
  }
}

// ============ الحصول على ملف المستخدم ============

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير معروف'
    console.error('خطأ في جلب الملف:', message)
    throw error
  }
}

// ============ الاستماع لتغييرات المصادقة ============

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      setSessionCookie()
    } else {
      clearSessionCookie()
    }
    callback(user)
  })
}

// ============ الحصول على المستخدم الحالي ============

export function getCurrentUser(): User | null {
  return auth.currentUser
}

// ============ تحديث ملف المستخدم ============

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, updates, { merge: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير معروف'
    console.error('خطأ في تحديث الملف:', message)
    throw error
  }
}
