# استخدام نسخة PHP 7.4 كأساس كما في إعدادك الحالي
FROM php:7.4-fpm

# تثبيت الحزم الأساسية للنظام
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git curl libonig-dev libxml2-dev

# الأداة السحرية لتثبيت إضافات PHP بدون أخطاء التعارض
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# تثبيت الإضافات المطلوبة (تمت إضافة mysqli هنا لحل مشكلة فحص النظام)
RUN install-php-extensions gd pdo_mysql mysqli mbstring exif pcntl bcmath redis swoole

# تثبيت Composer لإدارة الحزم
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تحديد مسار العمل
WORKDIR /var/www/html

# نسخ ملفات المشروع
COPY . .

# إعطاء الصلاحيات اللازمة للمجلدات لضمان عمل النظام
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# المنفذ الذي سيعمل عليه السيرفر
EXPOSE 9000

# الدخول لمجلد crmeb لتشغيل الأوامر منه
WORKDIR /var/www/html/crmeb