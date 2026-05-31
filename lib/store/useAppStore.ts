import { create } from 'zustand'
import { Pilgrim, Trip, Notification, Location, Staff, MediaItem, CenterConfig, GroupConfig } from '../types'
import * as firebaseService from '../firebaseService'

interface AppStore {
  // Data
  pilgrims: Pilgrim[]
  trips: Trip[]
  notifications: Notification[]
  locations: Location[]
  staff: Staff[]
  media: MediaItem[]
  centerConfig: CenterConfig | null
  groupConfigs: GroupConfig[]
  loading: boolean
  error: string | null

  // Subscription management
  _isSubscribed: boolean
  subscribeToAll: () => () => void

  // Pilgrim Actions
  fetchPilgrims: () => Promise<void>
  addPilgrim: (pilgrim: Omit<Pilgrim, 'id'>) => Promise<string>
  addPilgrimsBulk: (pilgrims: Omit<Pilgrim, 'id'>[]) => Promise<void>
  updatePilgrim: (id: string, pilgrim: Partial<Pilgrim>) => Promise<void>
  deletePilgrim: (id: string) => Promise<void>
  deletePilgrimsBulk: (ids: string[]) => Promise<void>
  searchPilgrims: (term: string) => Promise<void>

  // Trip Actions
  fetchTrips: () => Promise<void>
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<string>
  addTripsBulk: (trips: Omit<Trip, 'id'>[]) => Promise<void>
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  deleteTripsBulk: (ids: string[]) => Promise<void>

  // Notification Actions
  fetchNotifications: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<string>
  deleteNotification: (id: string) => Promise<void>
  clearAllNotifications: () => Promise<void>

  // Location Actions
  fetchLocations: () => Promise<void>
  addLocation: (location: Omit<Location, 'id'>) => Promise<string>
  updateLocation: (id: string, location: Partial<Location>) => Promise<void>
  deleteLocation: (id: string) => Promise<void>

  // Staff Actions
  fetchStaff: () => Promise<void>
  addStaff: (data: Omit<Staff, 'id'>) => Promise<void>
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>
  deleteStaff: (id: string) => Promise<void>

  // Media Actions
  fetchMedia: () => Promise<void>
  addMedia: (data: Omit<MediaItem, 'id'>) => Promise<void>
  updateMedia: (id: string, data: Partial<MediaItem>) => Promise<void>
  deleteMedia: (id: string) => Promise<void>

  // Config Actions
  fetchConfigs: () => Promise<void>
  updateCenterConfig: (id: string, data: Partial<CenterConfig>) => Promise<void>
  addGroupConfig: (data: Omit<GroupConfig, 'id'>) => Promise<void>
  updateGroupConfig: (id: string, data: Partial<GroupConfig>) => Promise<void>
  deleteGroupConfig: (id: string) => Promise<void>

  // Utils
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  pilgrims: [],
  trips: [],
  notifications: [],
  locations: [],
  staff: [],
  media: [],
  centerConfig: null,
  groupConfigs: [],
  loading: false,
  error: null,
  _isSubscribed: false,

  // ============ REAL-TIME SUBSCRIPTIONS ============
  subscribeToAll: () => {
    // Guard: prevent double-subscription
    if (get()._isSubscribed) {
      return () => {}
    }

    set({ loading: true, _isSubscribed: true })
    
    // Subscribe to Pilgrims
    const unsubPilgrims = firebaseService.subscribeToCollection('pilgrims', (data) => {
      set({ pilgrims: data as Pilgrim[] })
    })

    // Subscribe to Trips
    const unsubTrips = firebaseService.subscribeToCollection('trips', (data) => {
      set({ trips: data as Trip[] })
    })

    // Subscribe to Locations
    const unsubLocations = firebaseService.subscribeToCollection('locations', (data) => {
      set({ locations: data as Location[] })
    })

    // Subscribe to Staff
    const unsubStaff = firebaseService.subscribeToCollection('staff', (data) => {
      set({ staff: data as Staff[] })
    })

    // Subscribe to Media
    const unsubMedia = firebaseService.subscribeToCollection('media', (data) => {
      set({ media: data as MediaItem[] })
    })

    // Subscribe to Notifications
    const unsubNotifications = firebaseService.subscribeToCollection('notifications', (data) => {
      set({ notifications: data as Notification[] })
    })

    // Subscribe to Config
    const unsubConfig = firebaseService.subscribeToCollection('config', (data) => {
      set({ centerConfig: (data[0] as CenterConfig) || null })
    })

    // Subscribe to GroupConfigs
    const unsubGroupConfigs = firebaseService.subscribeToCollection('groupConfigs', (data) => {
      set({ groupConfigs: data as GroupConfig[], loading: false })
    })

    return () => {
      unsubPilgrims()
      unsubTrips()
      unsubLocations()
      unsubStaff()
      unsubMedia()
      unsubNotifications()
      unsubConfig()
      unsubGroupConfigs()
      set({ _isSubscribed: false })
    }
  },

  // ============ PILGRIMS ============

  fetchPilgrims: async () => {},

  addPilgrim: async (pilgrim) => {
    set({ loading: true, error: null })
    try {
      const id = await firebaseService.addPilgrim(pilgrim)
      return id
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  addPilgrimsBulk: async (pilgrims) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.addPilgrimsBulk(pilgrims)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  updatePilgrim: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.updatePilgrim(id, updates)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  deletePilgrim: async (id) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.deletePilgrim(id)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  deletePilgrimsBulk: async (ids) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.deletePilgrimsBulk(ids)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  searchPilgrims: async (term) => {
    set({ loading: true, error: null })
    try {
      const results = await firebaseService.searchPilgrims(term)
      set({ pilgrims: results, loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
    }
  },

  // ============ TRIPS ============

  fetchTrips: async () => {},

  addTrip: async (trip) => {
    set({ loading: true, error: null })
    try {
      const id = await firebaseService.addTrip(trip)
      return id
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  addTripsBulk: async (trips) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.addTripsBulk(trips)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  updateTrip: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.updateTrip(id, updates)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  deleteTrip: async (id) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.deleteTrip(id)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  deleteTripsBulk: async (ids) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.deleteTripsBulk(ids)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  // ============ NOTIFICATIONS ============

  fetchNotifications: async () => {
    set({ loading: true, error: null })
    try {
      const notifications = await firebaseService.getNotifications()
      set({ notifications, loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
    }
  },

  addNotification: async (notification) => {
    try {
      const id = await firebaseService.addNotification(notification)
      return id
    } catch (error: unknown) {
      throw error
    }
  },

  deleteNotification: async (id) => {
    try {
      await firebaseService.deleteNotification(id)
    } catch (error: unknown) {
      throw error
    }
  },

  clearAllNotifications: async () => {
    try {
      await firebaseService.clearAllNotifications()
    } catch (error: unknown) {
      throw error
    }
  },

  // ============ LOCATIONS ============

  fetchLocations: async () => {
    set({ loading: true, error: null })
    try {
      const locations = await firebaseService.getLocations()
      set({ locations, loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
    }
  },

  addLocation: async (location) => {
    set({ loading: true, error: null })
    try {
      const id = await firebaseService.addLocation(location)
      return id
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  updateLocation: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.updateLocation(id, updates)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  deleteLocation: async (id) => {
    set({ loading: true, error: null })
    try {
      await firebaseService.deleteLocation(id)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطأ غير معروف'
      set({ error: message, loading: false })
      throw error
    }
  },

  // ============ STAFF ============
  fetchStaff: async () => {
    const staff = await firebaseService.getStaff()
    set({ staff })
  },
  addStaff: async (data) => {
    await firebaseService.addStaff(data)
  },
  updateStaff: async (id, data) => {
    await firebaseService.updateStaff(id, data)
  },
  deleteStaff: async (id) => {
    await firebaseService.deleteStaff(id)
  },

  // ============ MEDIA ============
  fetchMedia: async () => {
    const media = await firebaseService.getMedia()
    set({ media })
  },
  addMedia: async (data) => {
    await firebaseService.addMedia(data)
  },
  updateMedia: async (id, data) => {
    await firebaseService.updateMedia(id, data)
  },
  deleteMedia: async (id) => {
    await firebaseService.deleteMedia(id)
  },

  // ============ CONFIG ============
  fetchConfigs: async () => {
    const centerConfig = await firebaseService.getCenterConfig()
    const groupConfigs = await firebaseService.getGroupConfigs()
    set({ centerConfig, groupConfigs })
  },
  updateCenterConfig: async (id, data) => {
    await firebaseService.updateCenterConfig(id, data)
  },
  addGroupConfig: async (data) => {
    await firebaseService.addGroupConfig(data)
  },
  updateGroupConfig: async (id, data) => {
    await firebaseService.updateGroupConfig(id, data)
  },
  deleteGroupConfig: async (id) => {
    await firebaseService.deleteGroupConfig(id)
  },

  // ============ UTILS ============

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
