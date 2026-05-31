# 📚 توثيق API - HajjOpsPro

## قاعدة الـ URL

```
Base URL: http://localhost:3000/api
```

## 🧑‍💼 إدارة الحجاج

### الحصول على قائمة الحجاج
```http
GET /api/pilgrims
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "phone": "+966501234567",
      "email": "ahmed@email.com",
      "group": "المجموعة A",
      "status": "مؤكد"
    }
  ]
}
```

### إضافة حاج جديد
```http
POST /api/pilgrims
Content-Type: application/json

{
  "name": "علي أحمد",
  "phone": "+966502234567",
  "email": "ali@email.com",
  "group": "المجموعة B",
  "nationality": "السعودية",
  "passport": "ABC123456"
}
```

**الرد الناجح (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "علي أحمد",
    "phone": "+966502234567",
    "email": "ali@email.com",
    "group": "المجموعة B",
    "status": "في الانتظار"
  }
}
```

### تحديث بيانات الحاج
```http
PUT /api/pilgrims/1
Content-Type: application/json

{
  "name": "أحمد محمد علي",
  "group": "المجموعة B",
  "status": "مؤكد"
}
```

### حذف الحاج
```http
DELETE /api/pilgrims/1
```

---

## 🚌 إدارة الرحلات

### الحصول على قائمة الرحلات
```http
GET /api/trips
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "رحلة المسجد الحرام",
      "from": "الفندق الرئيسي",
      "to": "المسجد الحرام",
      "time": "08:00",
      "pilgrims": 45,
      "status": "مكتملة",
      "date": "2024-05-12"
    }
  ]
}
```

### إنشاء رحلة جديدة
```http
POST /api/trips
Content-Type: application/json

{
  "name": "رحلة جبل عرفة",
  "from": "الفندق الرئيسي",
  "to": "جبل عرفة",
  "date": "2024-05-13",
  "time": "05:30",
  "description": "رحلة الوقوف بجبل عرفة"
}
```

### تحديث بيانات الرحلة
```http
PUT /api/trips/1
Content-Type: application/json

{
  "status": "قيد التنفيذ",
  "time": "06:00"
}
```

### حذف الرحلة
```http
DELETE /api/trips/1
```

---

## 📊 الإحصائيات

### الحصول على الإحصائيات
```http
GET /api/statistics
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "data": {
    "totalPilgrims": 1247,
    "activeTrips": 23,
    "completedTrips": 89,
    "alerts": 12
  }
}
```

---

## 🔔 الإشعارات

### الحصول على الإشعارات
```http
GET /api/notifications
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "تنبيه: تأخر رحلة",
      "message": "رحلة المسجد الحرام تأخرت 15 دقيقة",
      "time": "2024-05-12T08:45:00Z",
      "read": false,
      "type": "warning"
    }
  ]
}
```

### تحديد إشعار كمقروء
```http
PUT /api/notifications/1
Content-Type: application/json

{
  "read": true
}
```

---

## 📄 التقارير

### الحصول على التقارير
```http
GET /api/reports
```

### تنزيل تقرير
```http
GET /api/reports/pilgrims/download?format=pdf
```

**الرد الناجح (200):**
```
PDF Binary Content
```

---

## ❌ رموز الأخطاء

| الرمز | الرسالة | الحل |
|------|--------|-----|
| **400** | Bad Request | تحقق من صيغة الطلب |
| **401** | Unauthorized | قم بتسجيل الدخول |
| **403** | Forbidden | لا توجد صلاحيات |
| **404** | Not Found | المورد غير موجود |
| **500** | Server Error | خطأ في الخادم |

---

## 🔐 المصادقة

### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "مدير النظام",
      "email": "admin@example.com"
    }
  }
}
```

---

## 📝 ملاحظات مهمة

1. **جميع الطلبات** يجب أن تتضمن Header `Authorization`:
   ```http
   Authorization: Bearer {token}
   ```

2. **الصيغة الزمنية**: استخدم ISO 8601
   ```
   2024-05-12T08:45:00Z
   ```

3. **الترقيم العربي**: استخدم أرقام عربية في الرسائل

---

**آخر تحديث: مايو 2026**
