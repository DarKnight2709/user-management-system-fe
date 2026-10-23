# ==========================================
# STAGE 1: Build Stage (Biên dịch React/Vite)
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# 1. Tối ưu Cache: Copy file quản lý thư viện trước
COPY package.json package-lock.json ./

# 2. Cài đặt toàn bộ dependencies để build
RUN npm ci

# 3. Copy mã nguồn và tiến hành build ra file tĩnh trong /app/dist
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Stage (Phục vụ bằng Nginx)
# ==========================================
# Sử dụng Nginx Alpine siêu nhẹ (~20MB) thay vì Node.js (~180MB)
FROM nginx:1.25.4-alpine-slim

# Copy file cấu hình Nginx tối ưu cho React SPA (xử lý React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy toàn bộ file tĩnh đã build từ Stage 1 sang thư mục web của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Chuyển quyền sở hữu các file tĩnh cho user nginx (non-root)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    # Tạo các file tạm cần thiết cho Nginx chạy non-root
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx

# Chuyển sang user không phải root (user 'nginx' có sẵn trong image Nginx)
USER nginx

# Khai báo port 8080 (Port không cần quyền root)
EXPOSE 8080

# Thêm Health Check để kiểm tra Nginx có đang sống không
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Khởi chạy Nginx ở chế độ foreground
CMD ["nginx", "-g", "daemon off;"]
