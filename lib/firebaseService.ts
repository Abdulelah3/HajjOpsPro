import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  DocumentData,
  onSnapshot,
  writeBatch
} from 'firebase/firestore'
import { db } from './firebase'
import { Pilgrim, Trip, Notification, Location, Staff, MediaItem, CenterConfig, GroupConfig } from './types'

// ============ REAL-TIME HELPERS ============
export function subscribeToCollection(colName: string, callback: (data: DocumentData[]) => void) {
  return onSnapshot(collection(db, colName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

// ============ AUDIT LOGS ============
export interface AuditLog {
  id?: string
  action: string
  details: string
  timestamp: string
  user: string
}

export async function logActivity(action: string, details: string, user: string = 'مدير النظام') {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      action,
      details,
      user,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

// ============ PILGRIMS ============

export async function getPilgrims(): Promise<Pilgrim[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'pilgrims'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Pilgrim))
  } catch (error) {
    console.error('خطأ في جلب الحجاج:', error)
    throw error
  }
}

export async function getPilgrimById(id: string): Promise<Pilgrim | null> {
  try {
    const docRef = doc(db, 'pilgrims', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Pilgrim) : null
  } catch (error) {
    console.error('خطأ في جلب الحاج:', error)
    throw error
  }
}

export async function addPilgrim(pilgrimData: Omit<Pilgrim, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'pilgrims'), {
      ...pilgrimData,
      registrationDate: new Date().toISOString(),
    })
    await logActivity('إضافة حاج', `تم إضافة الحاج: ${pilgrimData.name}`)
    return docRef.id
  } catch (error) {
    console.error('خطأ في إضافة الحاج:', error)
    throw error
  }
}

export async function addPilgrimsBulk(pilgrimsData: Omit<Pilgrim, 'id'>[]): Promise<void> {
  try {
    const chunks = []
    for (let i = 0; i < pilgrimsData.length; i += 500) {
      chunks.push(pilgrimsData.slice(i, i + 500))
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db)
      chunk.forEach(pilgrim => {
        const docRef = doc(collection(db, 'pilgrims'))
        batch.set(docRef, {
          ...pilgrim,
          registrationDate: new Date().toISOString()
        })
      })
      await batch.commit()
    }
    await logActivity('إضافة جماعية', `تم إضافة ${pilgrimsData.length} حاج دفعة واحدة`)
  } catch (error) {
    console.error('خطأ في إضافة الحجاج جماعياً:', error)
    throw error
  }
}

export async function updatePilgrim(id: string, updates: Partial<Pilgrim>): Promise<void> {
  try {
    const docRef = doc(db, 'pilgrims', id)
    await updateDoc(docRef, updates)
    await logActivity('تحديث بيانات حاج', `تم تحديث بيانات الحاج صاحب المعرف: ${id.substring(0, 5)}...`)
  } catch (error) {
    console.error('خطأ في تحديث الحاج:', error)
    throw error
  }
}

export async function deletePilgrim(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'pilgrims', id))
    await logActivity('حذف بيانات حاج', `تم حذف الحاج صاحب المعرف: ${id.substring(0, 5)}...`)
  } catch (error) {
    console.error('خطأ في حذف الحاج:', error)
    throw error
  }
}

export async function deletePilgrimsBulk(ids: string[]): Promise<void> {
  try {
    const chunks = []
    for (let i = 0; i < ids.length; i += 500) {
      chunks.push(ids.slice(i, i + 500))
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db)
      chunk.forEach(id => {
        const docRef = doc(db, 'pilgrims', id)
        batch.delete(docRef)
      })
      await batch.commit()
    }
    await logActivity('حذف جماعي', `تم حذف ${ids.length} حاج دفعة واحدة`)
  } catch (error) {
    console.error('خطأ في حذف الحجاج جماعياً:', error)
    throw error
  }
}

export async function searchPilgrims(searchTerm: string): Promise<Pilgrim[]> {
  try {
    const allPilgrims = await getPilgrims()
    const term = searchTerm.toLowerCase()
    return allPilgrims.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.phone.includes(searchTerm) ||
        (p.passport && p.passport.toLowerCase().includes(term)) ||
        (p.nationality && p.nationality.toLowerCase().includes(term))
    )
  } catch (error) {
    console.error('خطأ في البحث:', error)
    throw error
  }
}

// ============ TRIPS ============

export async function getTrips(): Promise<Trip[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'trips'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Trip))
  } catch (error) {
    console.error('خطأ في جلب الرحلات:', error)
    throw error
  }
}

export async function getTripById(id: string): Promise<Trip | null> {
  try {
    const docRef = doc(db, 'trips', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Trip) : null
  } catch (error) {
    console.error('خطأ في جلب الرحلة:', error)
    throw error
  }
}

export async function addTrip(tripData: Omit<Trip, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('خطأ في إضافة الرحلة:', error)
    throw error
  }
}

export async function addTripsBulk(tripsData: Omit<Trip, 'id'>[]): Promise<void> {
  try {
    const chunks = []
    for (let i = 0; i < tripsData.length; i += 500) {
      chunks.push(tripsData.slice(i, i + 500))
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db)
      chunk.forEach(trip => {
        const docRef = doc(collection(db, 'trips'))
        batch.set(docRef, {
          ...trip,
          createdAt: new Date().toISOString()
        })
      })
      await batch.commit()
    }
  } catch (error) {
    console.error('خطأ في إضافة الرحلات جماعياً:', error)
    throw error
  }
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<void> {
  try {
    const docRef = doc(db, 'trips', id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error('خطأ في تحديث الرحلة:', error)
    throw error
  }
}

export async function deleteTrip(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'trips', id))
  } catch (error) {
    console.error('خطأ في حذف الرحلة:', error)
    throw error
  }
}

export async function deleteTripsBulk(ids: string[]): Promise<void> {
  try {
    const chunks = []
    for (let i = 0; i < ids.length; i += 500) {
      chunks.push(ids.slice(i, i + 500))
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db)
      chunk.forEach(id => {
        const docRef = doc(db, 'trips', id)
        batch.delete(docRef)
      })
      await batch.commit()
    }
    await logActivity('حذف جماعي', `تم حذف ${ids.length} رحلة دفعة واحدة`)
  } catch (error) {
    console.error('خطأ في حذف الرحلات جماعياً:', error)
    throw error
  }
}

// ============ NOTIFICATIONS ============

export async function getNotifications(): Promise<Notification[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'notifications'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Notification))
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error)
    throw error
  }
}

export async function addNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      time: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('خطأ في إضافة الإشعار:', error)
    throw error
  }
}

export async function updateNotification(id: string, updates: Partial<Notification>): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error)
    throw error
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notifications', id))
  } catch (error) {
    console.error('خطأ في حذف الإشعار:', error)
    throw error
  }
}

export async function clearAllNotifications(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, 'notifications'))
    const batch = writeBatch(db)
    querySnapshot.docs.forEach(docSnap => {
      batch.delete(docSnap.ref)
    })
    await batch.commit()
  } catch (error) {
    console.error('خطأ في مسح الإشعارات:', error)
    throw error
  }
}

// ============ LOCATIONS ============

export async function getLocations(): Promise<Location[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Location))
  } catch (error) {
    console.error('خطأ في جلب المواقع:', error)
    throw error
  }
}

export async function addLocation(locationData: Omit<Location, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'locations'), locationData)
    return docRef.id
  } catch (error) {
    console.error('خطأ في إضافة الموقع:', error)
    throw error
  }
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<void> {
  try {
    const docRef = doc(db, 'locations', id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error('خطأ في تحديث الموقع:', error)
    throw error
  }
}

export async function deleteLocation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'locations', id))
  } catch (error) {
    console.error('خطأ في حذف الموقع:', error)
    throw error
  }
}

// ============ STATISTICS ============

export async function getStatistics() {
  try {
    const pilgrims = await getPilgrims()
    const trips = await getTrips()
    const notifications = await getNotifications()

    return {
      totalPilgrims: pilgrims.length,
      activeTrips: trips.filter((t) => t.status === 'تحت المعالجة').length,
      completedTrips: trips.filter((t) => t.status === 'تم الاعتماد').length,
      alerts: notifications.filter((n) => n.type === 'warning').length,
    }
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error)
    throw error
  }
}

// ============ STAFF ============
export async function getStaff(): Promise<Staff[]> {
  const querySnapshot = await getDocs(collection(db, 'staff'))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff))
}
export async function addStaff(data: Omit<Staff, 'id'>) {
  return await addDoc(collection(db, 'staff'), data)
}
export async function updateStaff(id: string, data: Partial<Staff>) {
  await updateDoc(doc(db, 'staff', id), data)
}
export async function deleteStaff(id: string) {
  await deleteDoc(doc(db, 'staff', id))
}

// ============ MEDIA ============
export async function getMedia(): Promise<MediaItem[]> {
  const querySnapshot = await getDocs(collection(db, 'media'))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem))
}
export async function addMedia(data: Omit<MediaItem, 'id'>) {
  return await addDoc(collection(db, 'media'), data)
}
export async function updateMedia(id: string, data: Partial<MediaItem>) {
  await updateDoc(doc(db, 'media', id), data)
}
export async function deleteMedia(id: string) {
  await deleteDoc(doc(db, 'media', id))
}

// ============ CONFIG ============
export async function getCenterConfig(): Promise<CenterConfig | null> {
  const querySnapshot = await getDocs(collection(db, 'config'))
  if (querySnapshot.empty) return null
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as CenterConfig
}
export async function updateCenterConfig(id: string, data: Partial<CenterConfig>) {
  if (id) {
    await updateDoc(doc(db, 'config', id), data)
  } else {
    await addDoc(collection(db, 'config'), data)
  }
}

export async function getGroupConfigs(): Promise<GroupConfig[]> {
  const querySnapshot = await getDocs(collection(db, 'groupConfigs'))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupConfig))
}
export async function updateGroupConfig(id: string, data: Partial<GroupConfig>) {
  await updateDoc(doc(db, 'groupConfigs', id), data)
}
export async function addGroupConfig(data: Omit<GroupConfig, 'id'>) {
  return await addDoc(collection(db, 'groupConfigs'), data)
}
export async function deleteGroupConfig(id: string) {
  await deleteDoc(doc(db, 'groupConfigs', id))
}
