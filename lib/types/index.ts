export interface Pilgrim {
  id: string
  name: string
  phone: string
  email?: string
  group: string
  status: string
  registrationDate?: string
  nationality?: string
  passport?: string
  passportNumber?: string
  location?: string
}

export interface Trip {
  id: string
  movementType?: string
  groupName?: string
  flightNumber?: string
  date: string
  time: string
  airport?: string
  status: string
  destination?: string
  accommodation?: string
  pilgrimsCount?: number
  createdAt?: string
  description?: string
  // Legacy fields (for compatibility)
  name?: string
  from?: string
  to?: string
  pilgrims?: number
  // Excel bulk upload fields
  fromLocation?: string
  toLocation?: string
  transportCompany?: string
  busNumber?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'warning' | 'info' | 'success' | 'error'
}

export interface Statistics {
  totalPilgrims: number
  activeTrips: number
  completedTrips: number
  alerts: number
}

export interface Location {
  id: string
  name: string
  company: string
  pilgrimsCount: number
  address: string
  lat: number
  lng: number
  type: 'فندق' | 'مقر' | 'موقع'
}

export interface Staff {
  id: string
  name: string
  title: string
  image: string
  level: 'head' | 'vice' | 'specialist' | 'member'
  order: number
  experience?: string
  bio?: string
  specializations?: string[]
}

export interface MediaItem {
  id: string
  title: string
  type: 'video' | 'image'
  url: string
  thumbnail: string
}

export interface CenterConfig {
  id: string
  centerName: string
  headName: string
  totalPilgrimsTarget: number
  // Manual stats overrides
  statsMode?: 'auto' | 'manual'
  manualArrived?: number
  manualDeparted?: number
  manualMakkah?: number
  manualMadina?: number
  manualPresent?: number
  manualRemaining?: number

  // White-Label / Site Control Customizations (تحكم في الموقع)
  systemName?: string
  systemLogo?: string
  systemFavicon?: string
  systemCover?: string
  primaryColor?: string
  secondaryColor?: string
  pilgrimsTerm?: string
  tripsTerm?: string
  reportHeader?: string

  // Dynamic Theme (Colors & Shapes)
  themePrimaryColor?: string
  themeSecondaryColor?: string
  themeBackgroundColor?: string
  themeSurfaceColor?: string
  themeTextColor?: string
  themeCardRadius?: string
  themeButtonRadius?: string

  // CMS Sidebar Labels & Visibility
  labelDashboard?: string
  showDashboard?: boolean
  labelPilgrims?: string
  showPilgrims?: boolean
  labelTrips?: string
  showTrips?: boolean
  labelNusuk?: string
  showNusuk?: boolean
  labelStaff?: string
  showStaff?: boolean
  labelReports?: string
  showReports?: boolean
  labelNotifications?: string
  showNotifications?: boolean
  labelSettings?: string
  showSettings?: boolean

  // CMS Dashboard Tabs Labels & Visibility
  labelTabStats?: string
  showTabStats?: boolean
  labelTabMovements?: string
  showTabMovements?: boolean
  labelTabMaps?: string
  showTabMaps?: boolean
  labelTabOrg?: string
  showTabOrg?: boolean
  labelTabMedia?: string
  showTabMedia?: boolean

  // CMS Subpages Titles & Subtitles
  titlePilgrimsPage?: string
  subPilgrimsPage?: string
  titleTripsPage?: string
  subTripsPage?: string
  titleNusukPage?: string
  subNusukPage?: string

  // CMS Buttons
  btnPilgrimAdd?: string
  btnPilgrimUpload?: string
  btnTripAdd?: string

  // CMS Login Page Customizations
  loginTitle?: string
  loginSubtitle?: string
  loginBtnText?: string
  loginFooterText?: string
  loginCopyright?: string

  // Global Copyrights
  siteCopyright?: string
  developerCopyright?: string
  showDeveloperCopyright?: boolean

  // TV Command Center Page Customizations
  tvTitle?: string
  tvSubtitle?: string
  tvRadarTitle?: string
  tvLiveBadgeText?: string
  tvShowTarget?: boolean
  tvLabelTarget?: string
  tvShowPresent?: boolean
  tvLabelPresent?: string
  tvShowArrived?: boolean
  tvLabelArrived?: string
  tvShowDeparted?: boolean
  tvLabelDeparted?: string
  tvHeaderBgColor?: string
  tvHeaderTextColor?: string
  tvPageBgColor?: string
  tvActiveTripsPastHours?: number
  tvActiveTripsFutureHours?: number

  // AI Settings
  aiEnabled?: boolean
  aiProvider?: 'gemini' | 'openai' | 'groq' | 'anthropic' | 'openrouter'
  aiModel?: string
  aiApiKey?: string
  aiEnableChat?: boolean
  aiEnableOcr?: boolean
  aiEnableInsights?: boolean
  aiEnableAnomalies?: boolean
  aiEnableTranslation?: boolean
}

export interface GroupConfig {
  id: string
  name: string
  totalCount: number
  color: string
  manualArrived?: number
}
