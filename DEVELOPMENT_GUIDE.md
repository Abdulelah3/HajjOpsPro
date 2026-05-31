# 🚀 دليل التطوير والإضافة - HajjOpsPro

## 🎯 كيفية الإضافة للمشروع

### 1️⃣ إضافة صفحة جديدة

#### الخطوة 1: أنشئ المجلد
```bash
mkdir -p app/new-feature
```

#### الخطوة 2: أنشئ الملف
```bash
# app/new-feature/page.tsx

'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function NewFeaturePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {/* Your content here */}
        </main>
      </div>
    </div>
  )
}
```

#### الخطوة 3: أضفها في الـ Sidebar
```typescript
// components/Sidebar.tsx

const menuItems = [
  // ... الميزات الأخرى
  {
    icon: MyIcon,
    label: 'الميزة الجديدة',
    href: '/new-feature',
  },
]
```

---

### 2️⃣ إضافة مكون جديد

#### الطريقة الأساسية
```bash
# components/MyNewComponent.tsx

'use client'

interface MyNewComponentProps {
  title: string
  data?: any[]
}

export default function MyNewComponent({
  title,
  data = [],
}: MyNewComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {/* Component content */}
    </div>
  )
}
```

#### الاستخدام
```typescript
import MyNewComponent from '@/components/MyNewComponent'

export default function Page() {
  return (
    <MyNewComponent
      title="عنواني"
      data={myData}
    />
  )
}
```

---

### 3️⃣ إضافة نموذج/Form

```typescript
'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  // ... حقول أخرى
}

export default function MyForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit:', formData)
    // أرسل البيانات إلى API
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="الاسم"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold"
      >
        إرسال
      </button>
    </form>
  )
}
```

---

### 4️⃣ إضافة API Endpoint

```bash
# app/api/my-endpoint/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // منطق الـ GET
    return NextResponse.json(
      { success: true, data: [] },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // منطق الـ POST
    return NextResponse.json(
      { success: true, data: body },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

---

### 5️⃣ إضافة حالة جديدة (State)

```typescript
// lib/store/useAppStore.ts

interface AppStore {
  // ... الحالات الأخرى
  myNewData: any[]
  addMyNewData: (data: any) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // ... الإجراءات الأخرى
  myNewData: [],
  addMyNewData: (data) =>
    set((state) => ({
      myNewData: [...state.myNewData, data],
    })),
}))

// الاستخدام في مكون:
import { useAppStore } from '@/lib/store/useAppStore'

export default function MyComponent() {
  const { myNewData, addMyNewData } = useAppStore()
  
  return (
    <div>
      {myNewData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

---

### 6️⃣ إضافة Type جديد

```typescript
// lib/types/index.ts

export interface MyNewType {
  id: number
  name: string
  createdAt: string
  status: 'active' | 'inactive'
}

// الاستخدام:
import { MyNewType } from '@/lib/types'

const item: MyNewType = {
  id: 1,
  name: 'My Item',
  createdAt: new Date().toISOString(),
  status: 'active',
}
```

---

## 📊 أفضل الممارسات

### 1. التسمية (Naming)
```typescript
// ✅ صحيح
function handleUserSubmit() {}
const isLoading = true
const MAX_RETRIES = 3

// ❌ خطأ
function hus() {}
const loading = true
const max_retries = 3
```

### 2. الملفات
```
// ✅ صحيح
components/Dashboard/
├── DashboardStats.tsx
├── DashboardCharts.tsx
└── DashboardCard.tsx

// ❌ خطأ
components/
├── stats.tsx
├── charts.tsx
└── card.tsx
```

### 3. الكود
```typescript
// ✅ صحيح
interface UserData {
  id: number
  name: string
}

function getUserData(id: number): UserData | null {
  // ...
}

// ❌ خطأ
function getUserData(id) {
  // ...
}
```

### 4. التنسيقات
```typescript
// ✅ صحيح - استخدم Tailwind
<div className="bg-primary-500 text-white p-4 rounded-lg">
  Content
</div>

// ❌ خطأ - تجنب inline styles
<div style={{
  backgroundColor: '#228B22',
  color: 'white',
  padding: '1rem',
  borderRadius: '0.5rem'
}}>
  Content
</div>
```

---

## 🔍 استكشاف الأخطاء

### خطأ: "Cannot find module"
```bash
# الحل
npm install
npm run dev
```

### خطأ: "Type 'X' is not assignable"
```bash
# تحقق من التعريفات
# lib/types/index.ts
# واستخدم النوع الصحيح
```

### خطأ: الأنماط لا تظهر
```bash
# تأكد من استخدام Tailwind classes
# وليس CSS مخصص

# أعد تشغيل السيرفر
npm run dev
```

---

## 🧪 الاختبار

### اختبار يدوي
```bash
# 1. شغّل السيرفر
npm run dev

# 2. افتح في المتصفح
http://localhost:3000

# 3. اختبر الميزات
```

### اختبار الأداء
```bash
# استخدم Chrome DevTools
# Ctrl + Shift + I > Performance
# وسجل الأداء
```

---

## 📈 التحسينات المستقبلية

### قريباً 🔜
- [ ] نظام مصادقة متقدم (Firebase/Auth0)
- [ ] قاعدة بيانات MongoDB
- [ ] نظام إشعارات SMS
- [ ] خريطة حية Mapbox
- [ ] تقارير PDF متقدمة
- [ ] نسخ احتياطية تلقائية

### الإضافات الاختيارية
- [ ] Dark Mode
- [ ] Multi-language (English)
- [ ] نسخة Mobile App (React Native)
- [ ] نسخة Desktop (Electron)

---

## 🔗 الموارد المفيدة

### الوثائق
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)

### أدوات التطوير
- VS Code
- Chrome DevTools
- Postman (لاختبار API)

---

## 💡 نصائح وحيل

### 1. استخدم Snippets
```json
{
  "Next.js Component": {
    "prefix": "nextc",
    "body": [
      "'use client'",
      "",
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div></div>",
      "  )",
      "}"
    ]
  }
}
```

### 2. استخدم GitHub Copilot
- اكتب comment لوصف الوظيفة
- Copilot سيساعدك في الكود

### 3. استخدم Prettier
```bash
npm run format
# أو
npx prettier --write .
```

---

**آخر تحديث: مايو 2026**
