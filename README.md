# HajjOpsPro - نظام إدارة الحج

نظام إدارة حج احترافي وشامل من تطوير **Abdulelah Hani Balkhi**.

## 🌟 الميزات الرئيسية

### ✅ لوحة القيادة
- إحصائيات شاملة وفورية
- رسوم بيانية متقدمة
- مؤشرات أداء رئيسية (KPIs)

### ✅ إدارة الحجاج
- إضافة وتعديل وحذف الحجاج
- تصنيف الحجاج في مجموعات
- تتبع حالة التسجيل

### ✅ إدارة الرحلات
- إنشاء وتخطيط الرحلات
- تتبع الرحلات الحية
- إدارة أوقات المغادرة والوصول

### ✅ التقارير الشاملة
- تقارير الحجاج
- تقارير الرحلات
- تقارير الحضور

### ✅ نظام الإشعارات
- تنبيهات فورية
- إدارة الإشعارات
- تتبع التحديثات

### ✅ لوحة التحكم الإدارية
- إدارة المستخدمين
- الإعدادات النظام
- السجلات والتقارير

## 🎨 التصميم

- **الألوان**: أخضر (#228B22) وأبيض
- **الخط**: Cairo (عربي احترافي)
- **الاتجاه**: RTL (من اليمين لليسار)
- **التصميم**: احترافي وفخم

## 🛠️ التقنيات المستخدمة

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API**: Axios

## 📦 التثبيت والتشغيل

```bash
# تثبيت المتطلبات
npm install

# تشغيل سيرفر التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# التحقق من الأخطاء
npm run lint
```

## 📁 هيكل المشروع

```
hajjospro/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout الرئيسي
│   ├── page.tsx           # لوحة القيادة
│   ├── pilgrims/          # صفحة إدارة الحجاج
│   ├── trips/             # صفحة إدارة الرحلات
│   ├── reports/           # صفحة التقارير
│   └── notifications/     # صفحة الإشعارات
├── components/            # React Components
│   ├── Navbar.tsx         # شريط التنقل
│   ├── Sidebar.tsx        # القائمة الجانبية
│   ├── Dashboard/         # مكونات لوحة القيادة
│   ├── Pilgrims/          # مكونات الحجاج
│   └── Trips/             # مكونات الرحلات
├── lib/                   # المساعدات والأدوات
│   ├── types/            # أنواع TypeScript
│   └── store/            # State Management (Zustand)
├── styles/               # التنسيقات العامة
├── public/               # الملفات الثابتة
├── package.json          # المتطلبات
├── tsconfig.json         # إعدادات TypeScript
├── tailwind.config.ts    # إعدادات Tailwind
└── next.config.js        # إعدادات Next.js
```

## 🔐 الحقوق

**© 2026 Abdulelah Hani Balkhi**
جميع الحقوق محفوظة.

## 📞 الدعم والمساعدة

للمزيد من المعلومات والدعم، يرجى التواصل مع فريق الدعم لدينا.

---

تم التطوير بعناية واحترافية من قبل Abdulelah Hani Balkhi ✨
