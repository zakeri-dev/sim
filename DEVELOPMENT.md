# Development Setup with Docker

## استفاده از Docker Compose Override برای Development

این پروژه از `docker-compose.override.yml` برای development استفاده می‌کنه که به شما امکان hot reload و تغییرات فوری رو می‌ده.

## نحوه استفاده

### 1. اجرای Development Environment

```bash
# اجرای تمام سرویس‌ها در حالت development
docker-compose up

# یا اجرای در background
docker-compose up -d
```

### 2. مشاهده Logs

```bash
# مشاهده logs تمام سرویس‌ها
docker-compose logs -f

# مشاهده logs سرویس خاص
docker-compose logs -f simstudio
docker-compose logs -f realtime
```

### 3. توقف سرویس‌ها

```bash
# توقف تمام سرویس‌ها
docker-compose down

# توقف و حذف volumes
docker-compose down -v
```

## ویژگی‌های Development Mode

### ✅ Hot Reload

- تغییرات در کد مستقیماً در کانتینر اعمال می‌شن
- نیازی به rebuild نیست
- Next.js و Socket Server هر دو hot reload دارن

### ✅ Bind Mounts

- کدهای پروژه مستقیماً mount شدن
- `node_modules` از کانتینر استفاده می‌شه (سریع‌تر)
- فایل‌های build (`.next`) ignore شدن

### ✅ Development Commands

- `simstudio`: `bun run dev:full` (Next.js + Socket Server)
- `realtime`: `bun run dev:sockets` (فقط Socket Server)

## Ports

- **3000**: Next.js Development Server
- **3002**: Socket Server
- **5432**: PostgreSQL Database
- **8080**: Realtime Service (external)
- **8081**: Main App (external)

## Environment Variables

تمام environment variables از `docker-compose.local.yml` استفاده می‌شن، اما در development mode:

- `NODE_ENV=development`
- `NEXT_TELEMETRY_DISABLED=1`
- `VERCEL_TELEMETRY_DISABLED=1`

## Troubleshooting

### مشکل: تغییرات اعمال نمی‌شن

```bash
# Restart سرویس
docker-compose restart simstudio

# یا rebuild فقط dependencies
docker-compose build --no-cache simstudio
```

### مشکل: node_modules کار نمی‌کنه

```bash
# حذف و rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### مشکل: Port در حال استفاده

```bash
# بررسی ports در حال استفاده
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002

# تغییر port در docker-compose.override.yml
```

## Production vs Development

- **Production**: از `docker-compose.local.yml` استفاده کنه
- **Development**: از `docker-compose.override.yml` استفاده کنه (اتوماتیک)

برای production:

```bash
docker-compose -f docker-compose.local.yml up
```

برای development:

```bash
docker-compose up  # override فایل خودکار اعمال می‌شه
```
