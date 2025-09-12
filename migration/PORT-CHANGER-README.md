# 🔄 Port Changer for SimStudio

این اسکریپت **خودکار** پورت‌های پیش‌فرض را تغییر می‌دهد.

## 📋 ویژگی‌ها

- ✅ **خودکار** - همه فایل‌های مربوطه را به‌روزرسانی می‌کند
- ✅ **ایمن** - قبل از تغییرات backup ایجاد می‌کند
- ✅ **هوشمند** - فقط پورت‌های مورد نیاز را تغییر می‌دهد
- ✅ **بررسی پورت** - دسترسی پورت‌ها را بررسی می‌کند

## 🎯 چه کاری انجام می‌دهد؟

### 1. **Docker Compose** (`docker-compose.local.yml`)

- تغییر پورت‌های host برای سرویس‌ها
- به‌روزرسانی متغیرهای محیطی URL
- تنظیم پورت‌های جدید

### 2. **Environment File** (`apps/sim/lib/env.ts`)

- به‌روزرسانی پورت‌های hardcoded
- تنظیم URL های جدید

### 3. **Next Config** (`apps/sim/next.config.ts`)

- به‌روزرسانی پورت‌های hardcoded
- تنظیم configuration های جدید

## 🛠️ نحوه استفاده

### 1. اجرای مستقیم:

```bash
cd migration
node port-changer.js
```

### 2. از طریق npm:

```bash
cd migration
npm run change-ports
```

## ⚙️ تنظیمات پورت

اسکریپت از این تنظیمات استفاده می‌کند:

```javascript
// پورت‌های پیش‌فرض (اصلی)
const DEFAULT_PORTS = {
  simstudio: 3000,
  realtime: 3002,
  db: 5432,
  redis: 6379,
};

// پورت‌های سفارشی (جدید)
const CUSTOM_PORTS = {
  simstudio: 8081, // تغییر از 3000 به 8081
  realtime: 8080, // تغییر از 3002 به 8080
  db: 5432, // پورت database بدون تغییر
  redis: 6379, // پورت Redis بدون تغییر
};
```

**برای تغییر تنظیمات:** فایل `port-changer.js` را ویرایش کنید.

## 📁 فایل‌های ایجاد شده

### Backup

- `backup-before-port-change/` - نسخه پشتیبان از فایل‌های اصلی

### Configuration

- `migration/port-config.env` - فایل تنظیمات پورت‌ها

## 🔄 مراحل تغییر پورت

1. **بررسی دسترسی پورت‌ها** - اطمینان از آزاد بودن پورت‌ها
2. **ایجاد Backup** - از همه فایل‌های اصلی
3. **به‌روزرسانی Docker Compose** - تغییر پورت‌ها و URL ها
4. **به‌روزرسانی Environment File** - تغییر پورت‌های hardcoded
5. **به‌روزرسانی Next Config** - تغییر configuration ها
6. **تولید فایل تنظیمات** - برای استفاده آتی

## 🚨 نکات مهم

### قبل از اجرا:

- ✅ Docker Compose در حال اجرا باشد
- ✅ فایل‌های اصلی قابل نوشتن باشند
- ✅ فضای کافی برای backup داشته باشید
- ✅ پورت‌های جدید آزاد باشند

### بعد از اجرا:

- 🔄 Docker Compose services را restart کنید
- 🧪 دسترسی به سرویس‌ها را تست کنید
- 📝 تغییرات را بررسی کنید

## 📊 مثال خروجی

```
🚀 Starting Port Change for SimStudio...

🔍 Checking port availability...
✅ Port 8081 is available
✅ Port 8080 is available

📦 Creating backup of current configuration...
✅ Backed up: docker-compose.local.yml
✅ Backed up: apps/sim/lib/env.ts
✅ Backed up: apps/sim/next.config.ts
📁 Backup created in: backup-before-port-change/backup-2025-09-04T22-00-00-000Z

🐳 Updating docker-compose.local.yml ports...
✅ Updated simstudio ports: 3000:3000 → 8081:3000
✅ Updated realtime ports: 3002:3002 → 8080:3002
✅ Updated NEXT_PUBLIC_APP_URL: http://localhost:3000 → http://localhost:8081
✅ Updated BETTER_AUTH_URL: http://localhost:3000 → http://localhost:8081
✅ Updated NEXT_PUBLIC_SOCKET_URL: http://localhost:3002 → http://localhost:8080
✅ docker-compose.local.yml updated successfully

⚙️  Updating apps/sim/lib/env.ts...
ℹ️  No port changes needed in env.ts

⚙️  Updating apps/sim/next.config.ts...
ℹ️  No port changes needed in next.config.ts

📝 Generating port configuration file...
✅ Port configuration file generated: migration/port-config.env

📊 Port Change Summary:
✅ Docker Compose: Updated
✅ Environment File: Skipped
✅ Next Config: Skipped

🎯 Port Change completed successfully!
📁 Backup created in: backup-before-port-change/backup-2025-09-04T22-00-00-000Z
📝 Port config generated in: migration/port-config.env

🔧 Next steps:
1. Review the changes in the updated files
2. Restart Docker Compose services
3. Access SimStudio at: http://localhost:8081
4. Socket connection at: http://localhost:8080
5. If needed, restore from backup using the backup directory

📋 New Port Configuration:
   SimStudio: 3000 → 8081
   Realtime:  3002 → 8080
   Database:  5432 → 5432 (unchanged)
   Redis:     6379 → 6379 (unchanged)
```

## 🔧 عیب‌یابی

### خطای "Port already in use"

```
⚠️  Port 8081 is already in use
```

**راه حل:** سرویس‌های دیگر را متوقف کنید یا پورت دیگری انتخاب کنید

### خطای "File not found"

```
⚠️  docker-compose.local.yml not found, skipping...
```

**راه حل:** فایل در مسیر صحیح قرار دهید

### خطای "Permission denied"

```
❌ Permission denied
```

**راه حل:** دسترسی‌های فایل را بررسی کنید

## 🔄 بازگشت به حالت قبل

اگر نیاز به بازگشت داشتید:

1. **از backup استفاده کنید:**

```bash
cp backup-before-port-change/backup-*/docker-compose.local.yml ./
cp backup-before-port-change/backup-*/apps_sim_lib_env.ts ./apps/sim/lib/env.ts
cp backup-before-port-change/backup-*/apps_sim_next.config.ts ./apps/sim/next.config.ts
```

2. **Docker Compose را restart کنید:**

```bash
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up -d
```

## 🎯 پورت‌های پیشنهادی

### برای توسعه:

- **SimStudio:** 3000, 3001, 8080, 8081
- **Realtime:** 3002, 3003, 8082, 8083

### برای تولید:

- **SimStudio:** 80, 443, 8000, 8001
- **Realtime:** 8002, 8003, 9000, 9001

## 📞 پشتیبانی

اگر مشکلی داشتید:

1. Backup را بررسی کنید
2. Logs را مطالعه کنید
3. فایل‌های تولید شده را بررسی کنید
4. Docker Compose را restart کنید
5. پورت‌های جدید را تست کنید
