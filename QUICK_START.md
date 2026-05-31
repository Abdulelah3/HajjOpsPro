# 🚀 دليل البدء السريع - HajjOpsPro

## المتطلبات الأساسية

- **Node.js**: النسخة 18 أو أعلى
- **npm** أو **yarn** أو **pnpm**

## خطوات التثبيت السريعة

### 1️⃣ استنساخ أو فتح المشروع
```bash
cd hajjospro
```

### 2️⃣ تثبيت المكتبات
```bash
npm install
```

### 3️⃣ تشغيل سيرفر التطوير
```bash
npm run dev
```

### 4️⃣ فتح في المتصفح
انتقل إلى `http://localhost:3000`

## 📝 الملفات الهامة للتخصيص

| الملف | الوصف |
|------|-------|
| `styles/globals.css` | الأنماط العامة والألوان |
| `tailwind.config.ts` | إعدادات Tailwind و الألوان |
| `lib/types/index.ts` | أنواع البيانات TypeScript |
| `components/` | المكونات القابلة لإعادة الاستخدام |

## 🎨 تخصيص الألوان

عدّل قيمة اللون الأخضر الأساسي في `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#228B22', // اللون الأخضر الرئيسي
    // ... ألوان أخرى
  },
}
```

## 🌍 دعم اللغة العربية

المشروع يدعم RTL بالكامل:
- ✅ الاتجاه من اليمين لليسار
- ✅ خط Cairo المتخصص
- ✅ صيغ التاريخ والوقت العربية

## 📦 الأوامر المتاحة

```bash
# تطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# التحقق من الأخطاء
npm run lint
```

## 🔗 الروابط الرئيسية

- لوحة القيادة: http://localhost:3000/
- الحجاج: http://localhost:3000/pilgrims
- الرحلات: http://localhost:3000/trips
- التقارير: http://localhost:3000/reports
- الإشعارات: http://localhost:3000/notifications

## 💡 نصائح مهمة

1. **البيانات الوهمية**: جميع البيانات حالياً بيانات وهمية، استخدم `lib/api.ts` للاتصال بـ API الحقيقي
2. **التخزين**: استخدم `lib/store/useAppStore.ts` لإدارة الحالة
3. **الواجهات**: استخدم المكونات في `components/UI.tsx` للتناسق

## 🛠️ استكشاف الأخطاء

| المشكلة | الحل |
|--------|------|
| `Port 3000 already in use` | استخدم `npm run dev -- -p 3001` |
| `Module not found` | اشطب `node_modules` و `npm install` مجدداً |
| `Styling issues` | تأكد من تشغيل Tailwind CSS |

## 📞 الدعم

للمزيد من المعلومات، راجع:
- [README.md](./README.md) - التوثيق الكامل
- [ARCHITECTURE.md](./ARCHITECTURE.md) - هيكل المشروع
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - توثيق الـ API

---

**تم تطويره بعناية من قبل Holiday Inn Bakkah Operations ✨**
