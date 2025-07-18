# GTA5RPHELPER — Установка и запуск на Ubuntu сервере с HTTPS

## 1. Требования

- Ubuntu 20.04/22.04
- Node.js 18+ (лучше LTS)
- npm или pnpm (по умолчанию используется npm)
- Доменное имя, указывающее на ваш сервер
- root-доступ или sudo

## 2. Установка зависимостей

```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
# (опционально) Установить pnpm:
npm install -g pnpm
```

## 3. Клонирование и установка

```bash
git clone <ВАШ_РЕПОЗИТОРИЙ> gta5rpprod
cd gta5rpprod
npm install
# или, если используете pnpm:
# pnpm install
```

## 4. Сборка и запуск

```bash
npm run build
npm start
# или через pm2 для автозапуска:
# npm install -g pm2
# pm2 start npm --name gta5rpprod -- start
```

## 5. Настройка HTTPS через Nginx

### Установка Nginx

```bash
sudo apt install -y nginx
```

### Настройка reverse proxy

Создайте файл `/etc/nginx/sites-available/gta5rpprod`:

```
server {
    listen 80;
    server_name your-domain.com;

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

Активируйте сайт и перезапустите Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/gta5rpprod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Получение SSL сертификата (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Следуйте инструкциям, чтобы получить и применить сертификат.

## 6. Проверка

- Откройте https://your-domain.com — сайт должен быть доступен по HTTPS.

## 7. Обновление

```bash
git pull
npm install
npm run build
pm run start # или pm2 restart gta5rpprod
```

---

**P.S.** Если нужен запуск на другом порту, с кастомным сервером, через Docker или systemd — напишите, добавлю инструкции. 