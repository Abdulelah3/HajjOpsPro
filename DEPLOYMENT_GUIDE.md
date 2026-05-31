# 🌐 دليل النشر (Deployment) - HajjOpsPro

## 📋 جدول المحتويات

1. [النشر على Vercel](#النشر-على-vercel) ⭐ الأسهل
2. [النشر على Netlify](#النشر-على-netlify)
3. [النشر على خادم عادي](#النشر-على-خادم-عادي)
4. [النشر على AWS](#النشر-على-aws)
5. [الإعدادات الأمان](#الإعدادات-الأمان)

---

## النشر على Vercel

### الطريقة الأولى: عبر واجهة Vercel

#### الخطوة 1: قم بـ Push إلى GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hajjospro
git push -u origin main
```

#### الخطوة 2: توصيل مع Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول بحسابك
3. اضغط "New Project"
4. اختر Repository الخاص بك
5. اترك الإعدادات الافتراضية
6. اضغط "Deploy"

#### الخطوة 3: الانتظار ✅
```
Vercel سيقوم بـ build والنشر تلقائياً
الموقع سيكون متاحاً على: https://your-app.vercel.app
```

### الطريقة الثانية: عبر CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel

# أو في الإنتاج
vercel --prod
```

---

## النشر على Netlify

### الخطوة 1: بناء المشروع
```bash
npm run build
```

### الخطوة 2: رفع على Netlify
1. اذهب إلى [netlify.com](https://netlify.com)
2. اضغط "New site from Git"
3. اختر Repository
4. أعدادات الـ Build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. اضغط "Deploy"

### ملاحظة مهمة:
Netlify قد يحتاج إعدادات خاصة لـ Next.js. استخدم Vercel لأنه أبسط.

---

## النشر على خادم عادي

### المتطلبات
- Node.js 18+
- npm أو yarn
- خادم (VPS, Dedicated, etc.)
- SSH Access

### الخطوات

#### 1. حضّر الخادم
```bash
# تحديث النظام
sudo apt update
sudo apt upgrade

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PM2 (مدير العمليات)
sudo npm install -g pm2
```

#### 2. انسخ المشروع
```bash
# من خادمك
git clone https://github.com/YOUR_USERNAME/hajjospro.git
cd hajjospro
npm install
npm run build
```

#### 3. شغّل التطبيق مع PM2
```bash
# ابدأ التطبيق
pm2 start npm --name "hajjospro" -- start

# اجعله يبدأ مع النظام
pm2 startup
pm2 save

# عرض الحالة
pm2 monit
```

#### 4. أعدّ Nginx (اختياري)
```bash
# تثبيت Nginx
sudo apt install nginx

# أنشئ ملف إعدادات
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# أعد تشغيل Nginx
sudo systemctl restart nginx
```

#### 5. أضف SSL (Https)
```bash
# استخدم Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## النشر على AWS

### استخدام Elastic Beanstalk

#### الخطوة 1: تثبيت AWS CLI و EB CLI
```bash
pip install awsebcli --upgrade --user
```

#### الخطوة 2: أنشئ تطبيق
```bash
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" hajjospro
eb create hajjospro-prod
```

#### الخطوة 3: نشّر
```bash
eb deploy
eb open
```

### باستخدام ECS (Docker)

#### الخطوة 1: أنشئ Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

#### الخطوة 2: بناء الـ Image
```bash
docker build -t hajjospro .
```

#### الخطوة 3: Push إلى ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker tag hajjospro:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/hajjospro:latest

docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/hajjospro:latest
```

---

## الإعدادات الأمان

### 1. متغيرات البيئة
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=your_database_connection_string
API_SECRET=your_secret_key
```

### 2. HTTPS إجباري
```javascript
// next.config.js
module.exports = {
  redirects: async () => [
    {
      source: '/:path*',
      has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
      destination: 'https://:host/:path*',
      permanent: true,
    },
  ],
}
```

### 3. Headers الأمان
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

### 4. CORS
```javascript
// app/api/route.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  return response
}
```

---

## مراقبة ما بعد النشر

### استخدام Sentry (لتتبع الأخطاء)
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### استخدام LogRocket (لتتبع الجلسات)
```bash
npm install logrocket
```

### استخدام Google Analytics
```bash
npm install next-google-analytics
```

---

## جدول مقارنة المنصات

| المنصة | السعر | الصعوبة | السرعة | الأمان |
|-------|------|--------|-------|--------|
| **Vercel** | مجاني | سهلة جداً | سريع | ممتاز |
| **Netlify** | مجاني | سهلة | سريع | جيد |
| **AWS** | المفروع | متوسطة | سريع جداً | ممتاز |
| **خادم عادي** | الشهري | متوسطة | يعتمد | يعتمد |
| **DigitalOcean** | $6+ | متوسطة | سريع | جيد |

---

## أفضل الممارسات

✅ استخدم اسم نطاق مخصص (Domain)
✅ فعّل HTTPS/SSL
✅ استخدم CDN للملفات الثابتة
✅ راقب الأداء
✅ اعمل backup منتظم
✅ استخدم نسخة محرجة (Staging)
✅ فعّل التسجيل (Logging)

---

## استكشاف الأخطاء

### خطأ: Build fails
```bash
# تحقق من الأخطاء
npm run build

# ركّب الحزم مجدداً
npm install
npm run build
```

### خطأ: عدم الوصول للبيانات
- تحقق من متغيرات البيئة
- تحقق من اتصال قاعدة البيانات
- تحقق من CORS Settings

### خطأ: الموقع بطيء
- استخدم CDN
- حسّن الصور
- استخدم Caching

---

## الخطوات التالية

1. ✅ اختر منصة النشر
2. ✅ أعدّ متغيرات البيئة
3. ✅ فعّل الأمان
4. ✅ اختبر التطبيق
5. ✅ راقب الأداء

---

**آخر تحديث: مايو 2026**

**توصياتنا: استخدم Vercel للبدء السريع! 🚀**
