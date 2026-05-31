# ❓ الأسئلة الشائعة - FAQ

## 🚀 الأسئلة حول البدء والتشغيل

### س: كيف أبدأ بالمشروع؟
**ج:**
```bash
cd hajjospro
npm install
npm run dev
```
ثم افتح `http://localhost:3000`

### س: أي version من Node.js أحتاج؟
**ج:** النسخة 18 أو أعلى. تحقق بـ:
```bash
node --version
```

### س: Port 3000 مشغول، ماذا أفعل؟
**ج:** استخدم منفذ آخر:
```bash
npm run dev -- -p 3001
```

---

## 🎨 أسئلة حول التصميم والألوان

### س: كيف أغيّر اللون الأساسي؟
**ج:** عدّل `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#YOUR_COLOR', // غيّر هنا
  },
}
```

### س: كيف أضيف خط مخصص؟
**ج:**
```css
/* styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap');
```

ثم في `tailwind.config.ts`:
```typescript
fontFamily: {
  custom: ['YourFont', 'sans-serif'],
}
```

### س: هل يدعم الوضع الليلي (Dark Mode)؟
**ج:** حالياً لا، لكن يمكن إضافته بـ Tailwind:
```bash
tailwindcss dark mode
```

---

## 🔐 أسئلة حول الأمان والبيانات

### س: كيف أحمي البيانات الحساسة؟
**ج:**
1. استخدم `.env` لـ API keys
2. أضف HTTPS في الإنتاج
3. استخدم Token-based authentication

### س: أين تُحفظ البيانات الحالية؟
**ج:** البيانات حالياً وهمية في الكود. استخدم:
- `lib/store/useAppStore.ts` للحالة
- قاعدة بيانات للبيانات الحقيقية

### س: كيف أصل إلى قاعدة البيانات؟
**ج:** استخدم `lib/api.ts`:
```typescript
// الطلب
const response = await apiClient.get('/api/pilgrims')

// الرد
const data = response.data
```

---

## 📱 أسئلة حول الجوال والاستجابة

### س: هل الموقع يعمل على الهاتف الذكي؟
**ج:** نعم! الموقع responsive بالكامل.

### س: كيف أختبر على جوال؟
**ج:**
```bash
# الكمبيوتر الخاص بك (IP)
npm run dev

# من الجوال:
http://YOUR_IP:3000
```

---

## 🔧 أسئلة حول التطوير والإضافة

### س: كيف أضيف صفحة جديدة؟
**ج:** أنشئ مجلد وملف:
```bash
mkdir app/my-page
touch app/my-page/page.tsx
```

### س: كيف أضيف مكون جديد؟
**ج:**
```bash
touch components/MyComponent.tsx
```

### س: كيف أستخدم حالة عامة؟
**ج:** استخدم Zustand:
```typescript
import { useAppStore } from '@/lib/store/useAppStore'

const { pilgrims, addPilgrim } = useAppStore()
```

### س: كيف أضيف API endpoint؟
**ج:**
```bash
mkdir -p app/api/my-endpoint
touch app/api/my-endpoint/route.ts
```

---

## 🐛 أسئلة حول الأخطاء والمشاكل

### س: الأنماط غير ظاهرة!
**ج:**
1. تأكد من تشغيل Tailwind
2. أعد تشغيل السيرفر: `npm run dev`
3. اشطح المتصفح cache

### س: "Module not found" - خطأ
**ج:**
```bash
rm -rf node_modules
npm install
npm run dev
```

### س: الأيقونات لا تظهر!
**ج:**
```bash
npm install lucide-react
npm run dev
```

### س: البيانات لا تُحفظ!
**ج:** البيانات الحالية مؤقتة. للحفظ الدائم:
```typescript
// استخدم localStorage
localStorage.setItem('key', JSON.stringify(data))
```

---

## 📊 أسئلة حول الرسوم البيانية

### س: كيف أضيف رسم بياني جديد؟
**ج:** استخدم Recharts:
```typescript
import { BarChart, Bar, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'يناير', value: 100 },
  { name: 'فبراير', value: 200 },
]

<BarChart data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Bar dataKey="value" fill="#228B22" />
</BarChart>
```

---

## 🌍 أسئلة حول اللغات والترجمة

### س: هل يدعم اللغة الإنجليزية؟
**ج:** حالياً عربي فقط. للإضافة:
```bash
# استخدم next-i18n-router
npm install next-i18n-router
```

### س: كيف أترجم النصوص؟
**ج:** أنشئ ملف ترجمة:
```typescript
// locales/ar.ts
export const ar = {
  home: 'الرئيسية',
  pilgrims: 'الحجاج',
}

// الاستخدام
import { ar } from '@/locales/ar'
<h1>{ar.home}</h1>
```

---

## 💾 أسئلة حول النسخ الاحتياطية

### س: كيف أعمل backup للمشروع؟
**ج:**
```bash
# استخدم Git
git init
git add .
git commit -m "Initial commit"
git remote add origin <repo-url>
git push
```

### س: كيف أسترجع نسخة قديمة؟
**ج:**
```bash
git log # اعرض السجل
git checkout <commit-hash>
```

---

## 🚀 أسئلة حول النشر

### س: كيف أنشر الموقع؟
**ج:** استخدم Vercel (الأسهل):
```bash
npm install -g vercel
vercel
```

### س: هل يمكن النشر على خادم عادي؟
**ج:** نعم:
```bash
npm run build
npm start
# أو استخدم PM2
pm2 start npm --name "hajjospro" -- start
```

---

## 📚 أسئلة حول الوثائق

### س: أين توثيق الـ API؟
**ج:** اقرأ `API_DOCUMENTATION.md`

### س: كيف أفهم هيكل المشروع؟
**ج:** اقرأ `ARCHITECTURE.md`

### س: كيف أبدأ التطوير؟
**ج:** اقرأ `DEVELOPMENT_GUIDE.md`

---

## 🤝 أسئلة حول المساهمة

### س: هل يمكنني المساهمة في المشروع؟
**ج:** نعم! تابع:
1. Fork المشروع
2. أنشئ branch جديد
3. اعمل على الميزة
4. اعمل Pull Request

### س: ما معايير الكود؟
**ج:**
- استخدم TypeScript
- اتبع Tailwind CSS
- اكتب تعليقات واضحة
- اختبر الكود

---

## 💡 أسئلة أخرى

### س: هل المشروع مفتوح المصدر؟
**ج:** حالياً ملكية Holiday Inn Bakkah Operations. اطلب التفاصيل.

### س: كيف أتصل بفريق الدعم؟
**ج:** راسل:
- البريد: operations@holidayinn-bakkah.com
- الهاتف: +966-XX-XXXX-XXXX

### س: ما أفضل ممارسات الأمان؟
**ج:**
1. لا تضع credentials في الكود
2. استخدم `.env`
3. استخدم HTTPS
4. تحقق من الإدخال

### س: كيف أحسّن الأداء؟
**ج:**
1. استخدم Code Splitting
2. أضف Image Optimization
3. استخدم Lazy Loading
4. قلل حجم الحزم

---

## 🎉 شكراً على الأسئلة!

إذا كان لديك أسئلة أخرى، لا تتردد في السؤال!

**Happy Coding! 🚀**

---

**آخر تحديث: مايو 2026**
