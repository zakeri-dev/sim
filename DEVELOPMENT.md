# راهنمای Development با Live Reload

این راهنما نحوه اجرای پروژه در حالت development با قابلیت live reload را توضیح می‌دهد.

## ویژگی‌های Development Mode

- ✅ **Live Reload**: تغییرات کد به صورت خودکار نمایش داده می‌شود
- ✅ **Hot Module Replacement**: تغییرات React components بدون reload صفحه
- ✅ **Volume Mounting**: کد شما مستقیماً در container mount می‌شود
- ✅ **Development Dependencies**: تمام dev dependencies نصب می‌شوند

## نحوه اجرا

### روش 1: استفاده از اسکریپت‌های آماده

#### در Windows:

```bash
dev.bat
```

#### در Linux/Mac:

```bash
./dev.sh
```

### روش 2: اجرای مستقیم Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## فایل‌های جدید ایجاد شده

### 1. `docker-compose.dev.yml`

فایل Docker Compose مخصوص development که شامل:

- Volume mapping برای live reload
- Environment variables مناسب development
- Health checks
- Resource limits

### 2. `docker/app.dev.Dockerfile`

Dockerfile مخصوص development برای اپلیکیشن اصلی که شامل:

- نصب dev dependencies
- تنظیمات development environment
- Command مناسب برای development server

### 3. `docker/realtime.dev.Dockerfile`

Dockerfile مخصوص development برای realtime server

### 4. `dev.sh` و `dev.bat`

اسکریپت‌های اجرا برای Windows و Linux

## تفاوت‌های Development Mode

| ویژگی           | Production      | Development      |
| --------------- | --------------- | ---------------- |
| Build           | Full build      | Live reload      |
| Dependencies    | Production only | All dependencies |
| Volume Mounting | No              | Yes              |
| Environment     | Production      | Development      |
| Hot Reload      | No              | Yes              |

## Volume Mapping

فایل‌های زیر در container mount می‌شوند:

- `./apps/sim` → `/app/apps/sim`
- `./packages` → `/app/packages`
- `./package.json` → `/app/package.json`
- `./bun.lock` → `/app/bun.lock`
- `./turbo.json` → `/app/turbo.json`

## Environment Variables

فایل `.env` به صورت خودکار ایجاد می‌شود با مقادیر پیش‌فرض:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=simstudio
POSTGRES_PORT=5432
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_auth_secret_here_change_this_in_production
ENCRYPTION_KEY=your_encryption_key_here_change_this_in_production
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
```

## دستورات مفید

### متوقف کردن environment:

```bash
docker-compose -f docker-compose.dev.yml down
```

### مشاهده لاگ‌ها:

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Restart کردن سرویس‌ها:

```bash
docker-compose -f docker-compose.dev.yml restart
```

### Rebuild کردن:

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## پورت‌ها

- **Application**: http://localhost:3000
- **Socket Server**: http://localhost:3002
- **Database**: localhost:5432

## نکات مهم

1. **اولین بار**: ممکن است build کردن کمی طول بکشد
2. **Volume Mounting**: تغییرات در فایل‌های mount شده بلافاصله اعمال می‌شود
3. **Database**: داده‌های database در volume `postgres_data` ذخیره می‌شود
4. **Performance**: در development mode ممکن است کمی کندتر باشد

## عیب‌یابی

### مشکل: تغییرات نمایش داده نمی‌شود

- بررسی کنید که volume mapping درست باشد
- container را restart کنید

### مشکل: Port در دسترس نیست

- بررسی کنید که پورت‌ها در دسترس باشند
- از `docker ps` برای بررسی container ها استفاده کنید

### مشکل: Database connection

- بررسی کنید که database container در حال اجرا باشد
- Environment variables را بررسی کنید
