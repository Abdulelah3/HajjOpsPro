# 📑 فهرس المشروع الكامل - HajjOpsPro

## 🎯 بدء سريع

**للبدء الفوري**: اقرأ [START_HERE.md](./START_HERE.md) أولاً ⭐

---

## 📚 ملفات التوثيق

### المستوى الأول - الأساسيات
| الملف | الوصف | الوقت |
|------|-------|-------|
| [START_HERE.md](./START_HERE.md) | نقطة البداية ⭐ | 5 د |
| [QUICK_START.md](./QUICK_START.md) | البدء السريع | 10 د |
| [README.md](./README.md) | التوثيق الرئيسي | 15 د |

### المستوى الثاني - الفهم
| الملف | الوصف | الوقت |
|------|-------|-------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | هيكل المشروع | 20 د |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | ملخص شامل | 15 د |
| [FEATURES_GUIDE.md](./FEATURES_GUIDE.md) | دليل الميزات | 30 د |

### المستوى الثالث - التطوير
| الملف | الوصف | الوقت |
|------|-------|-------|
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | دليل التطوير | 45 د |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | توثيق الـ API | 30 د |
| [FAQ.md](./FAQ.md) | الأسئلة الشائعة | 20 د |

### المستوى الرابع - الإنتاج
| الملف | الوصف | الوقت |
|------|-------|-------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | دليل النشر | 40 د |
| [CHECKLIST.md](./CHECKLIST.md) | قائمة التحقق | 10 د |

---

## 📁 هيكل المجلدات

```
hajjospro/
│
├── 📑 التوثيق (11 ملف)
│   ├── START_HERE.md ⭐ (ابدأ هنا)
│   ├── README.md
│   ├── QUICK_START.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_SUMMARY.md
│   ├── FEATURES_GUIDE.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── FAQ.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── CHECKLIST.md
│
├── ⚙️ ملفات التكوين
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── .env.example
│   └── middleware.ts
│
├── 📱 التطبيق (app/)
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── page.tsx (Dashboard)
│   ├── pilgrims/
│   │   ├── page.tsx
│   │   ├── add/
│   │   └── search/
│   ├── trips/
│   │   ├── page.tsx
│   │   ├── create/
│   │   └── tracking/
│   ├── reports/
│   │   └── page.tsx
│   └── notifications/
│       └── page.tsx
│
├── 🧩 المكونات (components/)
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── UI.tsx
│   └── Dashboard/
│       ├── DashboardStats.tsx
│       └── DashboardCharts.tsx
│
├── 🛠️ الأدوات (lib/)
│   ├── api.ts
│   ├── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── store/
│       └── useAppStore.ts
│
├── 🎨 الأنماط (styles/)
│   └── globals.css
│
├── 📦 الملفات الثابتة (public/)
│   ├── favicon.ico
│   └── manifest.json
│
└── ⚙️ إعدادات VS Code (.vscode/)
    ├── settings.json
    └── extensions.json
```

---

## 🗺️ خريطة الصفحات

### صفحات المستخدم

| الصفحة | المسار | الوصف |
|-------|--------|-------|
| لوحة القيادة | `/` | الإحصائيات والرسوم البيانية |
| الحجاج | `/pilgrims` | قائمة الحجاج |
| إضافة حاج | `/pilgrims/add` | نموذج إضافة حاج |
| البحث | `/pilgrims/search` | بحث وتصفية الحجاج |
| الرحلات | `/trips` | قائمة الرحلات |
| إنشاء رحلة | `/trips/create` | نموذج رحلة جديدة |
| تتبع الرحلات | `/trips/tracking` | تتبع الرحلات الحية |
| التقارير | `/reports` | التقارير والإحصائيات |
| الإشعارات | `/notifications` | الإشعارات والتنبيهات |

### API Endpoints (للمستقبل)

```
GET    /api/pilgrims
POST   /api/pilgrims
PUT    /api/pilgrims/:id
DELETE /api/pilgrims/:id

GET    /api/trips
POST   /api/trips
PUT    /api/trips/:id
DELETE /api/trips/:id

GET    /api/reports
GET    /api/notifications
PUT    /api/notifications/:id
```

---

## 🎨 الألوان والتصميم

### النظام اللوني
```
اللون الأساسي:  #228B22 (الأخضر)
اللون الثانوي:  #FFFFFF (أبيض)
نص النجاح:      #228B22 (أخضر)
نص التحذير:     #FFA500 (برتقالي)
نص الخطأ:       #EF4444 (أحمر)
نص المعلومة:    #3B82F6 (أزرق)
```

### الخط
```
Font: Cairo (Google Fonts)
الأوزان: 400, 500, 600, 700, 800, 900
الاتجاه: RTL (من اليمين لليسار)
```

---

## 🎯 استخدام الملفات

### إذا كنت تريد...

**الإعدادات والتكوين**
→ `package.json`, `tsconfig.json`, `tailwind.config.ts`

**البدء السريع**
→ `QUICK_START.md`, `START_HERE.md`

**فهم البنية**
→ `ARCHITECTURE.md`, `PROJECT_SUMMARY.md`

**الميزات التفصيلية**
→ `FEATURES_GUIDE.md`, `API_DOCUMENTATION.md`

**التطوير والإضافة**
→ `DEVELOPMENT_GUIDE.md`, `FAQ.md`

**النشر والإنتاج**
→ `DEPLOYMENT_GUIDE.md`

---

## 📊 إحصائيات المشروع

### الملفات المُنشأة
```
ملفات TypeScript/TSX:  20+
ملفات التوثيق:         11
ملفات الإعدادات:       10
ملفات CSS:             1
ملفات أخرى:            5

الإجمالي:             50+ ملف
```

### الأسطر البرمجية
```
TypeScript/React:  2000+ سطر
التوثيق:          3000+ سطر
الإعدادات:        500+ سطر

الإجمالي:         5500+ سطر
```

### المكتبات المستخدمة
```
Framework:   Next.js 14
Language:    TypeScript
Styling:     Tailwind CSS
State:       Zustand
API:         Axios
Charts:      Recharts
Icons:       Lucide React
Notifications: React Hot Toast

الإجمالي:    15+ مكتبة
```

---

## 🔄 دورة التطوير

### 1️⃣ البدء (1 ساعة)
```
اقرأ START_HERE.md
↓
اقرأ QUICK_START.md
↓
شغّل: npm install && npm run dev
↓
تصفح الصفحات
```

### 2️⃣ الفهم (2 ساعة)
```
اقرأ ARCHITECTURE.md
↓
اقرأ FEATURES_GUIDE.md
↓
استكشف الملفات
↓
اقرأ الكود
```

### 3️⃣ التطوير (متعاقب)
```
اقرأ DEVELOPMENT_GUIDE.md
↓
ابدأ بالإضافة
↓
اختبر المحلي
↓
ارفع الكود
```

### 4️⃣ النشر (نهاية)
```
اقرأ DEPLOYMENT_GUIDE.md
↓
اختر منصة النشر
↓
أعدّ الإعدادات
↓
انشر الموقع
```

---

## 🚀 الأوامر السريعة

### التطوير
```bash
npm run dev          # شغّل السيرفر المحلي
npm run build        # بناء الإنتاج
npm start            # شغّل الإنتاج
npm run lint         # فحص الأخطاء
```

### الملفات
```bash
# فتح المشروع
cd hajjospro
code .

# التثبيت
npm install

# التشغيل
npm run dev
```

---

## 🔗 الروابط المهمة

### المشروع
- **المجلد**: `c:\Users\Dell\Desktop\Holiday Inn Bakkah\hajjospro`
- **الرابط المحلي**: http://localhost:3000

### المكتبات
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## ❓ احتياج مساعدة؟

### ابحث في الملفات التالية

1. **الأسئلة الشائعة**: → [FAQ.md](./FAQ.md)
2. **الأخطاء الشائعة**: → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
3. **مشاكل النشر**: → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
4. **السؤال غير محدد**: → [START_HERE.md](./START_HERE.md)

---

## 📞 التواصل

- 📧 البريد: operations@holidayinn-bakkah.com
- 📞 الهاتف: +966-XX-XXXX-XXXX

---

## ✨ ملاحظة ختامية

هذا الفهرس يساعدك على الملاحة السريعة في المشروع.

**الملف الأول للقراءة**: [START_HERE.md](./START_HERE.md) ⭐

**الملف الثاني**: [QUICK_START.md](./QUICK_START.md)

**بعدها**: اختر حسب احتياجك من الجدول أعلاه.

---

**شكراً لاستخدام HajjOpsPro! 🚀**

**© 2026 Holiday Inn Bakkah Operations**
