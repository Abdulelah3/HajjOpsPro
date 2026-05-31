# 📋 هيكل المشروع - HajjOpsPro

## نظرة عامة على الهيكل

```
hajjospro/
│
├── app/                                    # Next.js App Router
│   ├── layout.tsx                         # العناصر الأساسية (HTML, Body)
│   ├── providers.tsx                      # موفرو الحالة والإعدادات
│   ├── page.tsx                           # لوحة القيادة الرئيسية
│   │
│   ├── pilgrims/                          # إدارة الحجاج
│   │   ├── page.tsx                       # قائمة الحجاج
│   │   └── add/
│   │       └── page.tsx                   # إضافة حاج جديد
│   │
│   ├── trips/                             # إدارة الرحلات
│   │   ├── page.tsx                       # قائمة الرحلات
│   │   └── create/
│   │       └── page.tsx                   # إنشاء رحلة جديدة
│   │
│   ├── reports/                           # التقارير
│   │   └── page.tsx                       # عرض التقارير
│   │
│   └── notifications/                     # الإشعارات
│       └── page.tsx                       # إدارة الإشعارات
│
├── components/                            # مكونات React
│   ├── Navbar.tsx                         # شريط التنقل العلوي
│   ├── Sidebar.tsx                        # القائمة الجانبية
│   ├── UI.tsx                             # مكونات UI عامة
│   │
│   ├── Dashboard/                         # مكونات لوحة القيادة
│   │   ├── DashboardStats.tsx             # إحصائيات الرئيسية
│   │   └── DashboardCharts.tsx            # الرسوم البيانية
│   │
│   ├── Pilgrims/                          # مكونات الحجاج
│   │   └── (مكونات إضافية يمكن إضافتها)
│   │
│   └── Trips/                             # مكونات الرحلات
│       └── (مكونات إضافية يمكن إضافتها)
│
├── lib/                                   # الأدوات والمساعدات
│   ├── api.ts                             # عميل API و Axios
│   ├── utils.ts                           # دوال مساعدة عامة
│   │
│   ├── types/                             # أنواع TypeScript
│   │   └── index.ts                       # تعريفات الواجهات
│   │
│   └── store/                             # إدارة الحالة (Zustand)
│       └── useAppStore.ts                 # المتجر الرئيسي
│
├── styles/                                # ملفات CSS
│   └── globals.css                        # الأنماط العامة
│
├── public/                                # ملفات ثابتة
│   ├── favicon.ico                        # أيقونة التطبيق
│   ├── manifest.json                      # تكوين PWA
│   └── (صور وملفات أخرى)
│
├── middleware.ts                          # middleware Next.js
├── next.config.js                         # تكوين Next.js
├── tsconfig.json                          # تكوين TypeScript
├── tailwind.config.ts                     # تكوين Tailwind CSS
├── postcss.config.js                      # تكوين PostCSS
├── package.json                           # المتطلبات والإعدادات
├── .eslintrc.json                         # قواعد ESLint
├── .gitignore                             # ملفات Git المتجاهلة
│
├── README.md                              # التوثيق الرئيسي
├── QUICK_START.md                         # دليل البدء السريع
├── ARCHITECTURE.md                        # هيكل المشروع (هذا الملف)
└── .env.example                           # مثال متغيرات البيئة
```

## التدفق النموذجي للبيانات

```
User Interface (صفحات)
        ↓
Components (مكونات)
        ↓
App Store (Zustand)
        ↓
API Client (Axios)
        ↓
Backend API / Database
```

## مراحل الطلب HTTP

```javascript
// 1. الطلب يُرسل من Component
axios.get('/api/pilgrims')

// 2. Interceptor يعالجه (إضافة Token)
apiClient.interceptors.request.use()

// 3. يصل إلى Server
// Server يعالجه ويرسل Response

// 4. Response Interceptor يعالجه
apiClient.interceptors.response.use()

// 5. Component يتحدث عن النتيجة
setState(data)
```

## مسار الملفات المهمة

### للإضافة جديدة
1. أضف Type في `lib/types/index.ts`
2. أضف Action في `lib/store/useAppStore.ts`
3. أنشئ Component في `components/`
4. أضفه في الصفحة المناسبة

### للصفحة جديدة
1. أنشئ مجلد في `app/`
2. أنشئ `page.tsx`
3. استخدم `Navbar` و `Sidebar`
4. أضفها في `components/Sidebar.tsx`

## المكتبات الرئيسية المستخدمة

| المكتبة | الاستخدام |
|--------|----------|
| **Next.js** | Framework الويب |
| **React** | مكتبة الواجهات |
| **TypeScript** | لغة البرمجة |
| **Tailwind CSS** | التنسيقات |
| **Zustand** | إدارة الحالة |
| **Axios** | طلبات HTTP |
| **Recharts** | الرسوم البيانية |
| **Lucide React** | الأيقونات |
| **React Hot Toast** | الإشعارات |

## معايير الكود

### Naming Convention
- Components: `PascalCase` (مثل: `DashboardStats.tsx`)
- Functions: `camelCase` (مثل: `handleSubmit()`)
- Variables: `camelCase` (مثل: `userName`)
- Constants: `UPPER_SNAKE_CASE` (مثل: `MAX_RETRIES`)

### ملفات العربية
- استخدم UTF-8 دائماً
- تأكد من دعم RTL في CSS
- استخدم التنسيقات العربية للتواريخ

---

**آخر تحديث: مايو 2026**
