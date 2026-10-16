# Project management

Client đơn giản cho backend `../user-management-system`, sử dụng React + Vite + TypeScript strict, TanStack Query v5, Tailwind CSS v4, shadcn/ui (Radix), React Hook Form + Zod và React Router v7 (đáp ứng v6+).

## Chạy cục bộ

Yêu cầu Node.js 22.12+ (hoặc 20.19+). Khởi động backend và các dịch vụ PostgreSQL, Redis, S3 theo tài liệu backend trước.

```sh
npm install
cp .env.example .env
npm run dev
```

PowerShell: dùng `Copy-Item .env.example .env` thay cho `cp` nếu cần. `.env` đã được tạo sẵn trong workspace.

Mở URL Vite in ra (mặc định http://localhost:5173). `npm run build` kiểm tra TypeScript và tạo `dist/`; `npm run preview` xem bản build.

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:3000
```

Vite chuyển `/api/*` đến backend và bỏ prefix `/api`. Backend hiện không bật CORS nên proxy giúp chạy local không cần sửa backend. Nếu deploy static, cấu hình reverse proxy `/api` tới backend và SPA fallback về `index.html`. Hoặc dùng URL backend tuyệt đối trong `VITE_API_BASE_URL` và bật CORS cho origin frontend ở backend. Các biến `VITE_*` là công khai, không chứa secret.

## Cấu trúc

```text
src/
  components/
    ui/                   # Button, Input, Skeleton, ConfirmDialog (Radix)
    feedback.tsx          # ErrorNotice và ErrorBoundary
    form-fields.tsx       # Trường form có label và lỗi validation
  lib/
    axios.ts              # baseURL, bearer token, refresh interceptor
    query-client.ts       # QueryClient và thông báo lỗi mutation
    session.ts            # Session store
    errors.ts             # Lỗi backend và validation 422 dạng nested
    utils.ts              # cn cho shadcn/ui
  features/
    auth/
      api/                # API và Query/Mutation hooks
      components/         # LoginForm, AuthPage, SecurityPage
      schemas/            # Login, register, password
      types/
    users/
      api/
      components/         # ProfileForm, ProfilePage, UsersTable, UsersPage
      schemas/
      types/
    health/
      api/
      components/
      types/
  routes/                 # Router, protected routes, layout
  types/                  # ApiResponse, ApiError, Session, CurrentUser
```

Feature health không có request body nên không cần schema form. LoginForm, ProfileForm, UsersTable chỉ nhận dữ liệu và callback; container page sử dụng API hooks.

## Chức năng và API đã nối

| Màn hình         | Endpoint                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `/login`         | `POST /auth/login`                                                                                 |
| `/register`      | `POST /auth/register`                                                                              |
| `/profile`       | `GET /auth/me`, `GET /users/:id`, `PUT /users`, `POST /users/avatar`, `DELETE /users/:id` (tự xóa) |
| `/security`      | `POST /auth/change-password`, `POST /auth/refresh-token`, `POST /auth/logout-all`                  |
| Header đăng xuất | `POST /auth/logout`                                                                                |
| `/users`         | `GET /users`, `DELETE /users/:id`                                                                  |
| `/health`        | `GET /`, `GET /health/live`, `GET /health/ready`                                                   |

`GET /users` cần quyền platform `USER:read`; xóa người khác cần `USER:delete`. Backend là nơi quyết định quyền; frontend hiển thị lỗi 403, không suy đoán quyền từ username. API danh sách hiện trả `{ items, total, page, limit }`; client dùng phân trang 20 người/trang và tìm kiếm trong trang đang xem. Backend cho phép đọc hồ sơ người khác với quyền `USER:read`; sửa hồ sơ vẫn là thao tác của chính người đăng nhập.

## Khu vực người dùng và admin

- `/login`: màn đăng nhập người dùng, dẫn đến dashboard cá nhân tại `/user`, kể cả khi tài khoản có quyền quản trị.
- `/admin/login`: màn đăng nhập quản trị riêng, kiểm tra quyền `USER:read` trước khi chấp nhận phiên và dẫn đến dashboard tổng quan tại `/admin`. Không có đăng ký admin công khai.
- `/user`: dashboard cá nhân với thông tin tài khoản và lối tắt hồ sơ/bảo mật.
- `/admin`: dashboard quản trị với tổng người dùng thực tế từ API và lối tắt quản lý/giám sát.
- `/user/profile`: hồ sơ, avatar và tự xóa tài khoản.
- `/user/security`: đổi mật khẩu, refresh phiên và đăng xuất tất cả.
- `/organization`: trang tổ chức của tôi, có nút “+ Tạo tổ chức” phía trên dẫn đến `/organization/create`. Đường dẫn cũ `/user/organizations` chuyển hướng về đây. Backend hiện chưa có API danh sách tổ chức tham gia, nên trang hiển thị trạng thái chưa khả dụng thay vì danh sách giả hoặc kết luận người dùng chưa tham gia tổ chức nào.
- `/organization/create`: form tạo tổ chức qua `POST /organizations`, yêu cầu tên 1–100 ký tự và slug duy nhất 3–63 ký tự, chuẩn hóa trim/lowercase đúng DTO backend. Có trạng thái đang tạo, lỗi API và thông báo thành công; tạo xong chuyển về `/organization`.
- `/admin/users`: quản lý danh sách người dùng, phân trang và xóa tài khoản.
- `/admin/users/:id`: xem hồ sơ người dùng bằng `GET /users/:id`, yêu cầu `USER:read`. Mở bằng nút “Xem hồ sơ” trong danh sách admin; hiển thị avatar, thông tin cá nhân và thời gian tạo/cập nhật, không có chức năng sửa tài khoản người khác.
- `/admin/health`: trạng thái hệ thống trong layout admin. `/health` vẫn là trang kiểm tra kết nối công khai.
- Menu admin: Dashboard quản trị, Quản lý người dùng, Trạng thái API, Hồ sơ quản trị viên, Bảo mật. Menu người dùng: Dashboard cá nhân, Hồ sơ cá nhân, Bảo mật.
- Hai cổng có luồng điều hướng riêng: truy cập route chưa đăng nhập đưa về đúng màn login; đăng xuất admin trở về `/admin/login`, người dùng trở về `/login`. Muốn đổi cổng cần đăng nhập ở màn tương ứng. Mỗi tab trình duyệt giữ một phiên đang hoạt động; đăng nhập cổng khác thay thế phiên cục bộ. `/` trở về dashboard của cổng đang đăng nhập. URL cũ `/profile`, `/security`, `/users` vẫn có chuyển hướng.
- Session `/auth/me` chưa cung cấp role/permissions. Client kiểm tra quyền admin bằng `GET /users?page=1&limit=1` ở bước đăng nhập và tại route admin, chỉ coi 403 là không có quyền; lỗi mạng/server có giao diện thử lại. Thuộc tính `portal` trong session chỉ điều khiển giao diện, được giữ khi refresh token; backend tiếp tục xác thực và kiểm tra quyền trên từng request, bao gồm quyền xóa riêng biệt.

## Auth và xử lý lỗi

- `login-form.tsx` dùng React Hook Form + `zodResolver(loginSchema)`, nhận callback từ `AuthPage`; `useLogin` dùng TanStack mutation và lưu cặp token từ response `{ data, meta }`.
- Token giữ trong memory và `sessionStorage` của tab, xóa khi đăng xuất. Đây là lựa chọn boilerplate; token vẫn có thể bị đọc bởi JavaScript nếu có XSS. Không ghi token vào log hoặc URL.
- Interceptor gửi Bearer token; khi 401, dùng một promise chung để xoay refresh token, sau đó retry tối đa một lần. Login/register và lỗi mật khẩu hiện tại không kích hoạt refresh. Refresh thất bại kết thúc phiên. Request mutation không tự retry ngoài lần xử lý 401.
- Đăng xuất hiện tại xoay token trước khi revoke để gửi đúng refresh token mới nhất. Nếu backend không truy cập được, có nút thoát cục bộ; thao tác này chỉ xóa token phía client.
- Đổi mật khẩu thu hồi refresh sessions theo backend và đưa người dùng về login. Access token cũ ở thiết bị khác có thể còn hiệu lực đến hết hạn theo cơ chế backend.
- Loading sử dụng Skeleton; mutation có pending/disabled và notification; lỗi query có nút thử lại; router và React có error boundary. Hiển thị lỗi validation 422 và lỗi quyền/rate limit từ backend.
- Password đăng ký/đổi mật khẩu: tối thiểu 15 ký tự, tối đa 72 byte UTF-8. Ngày sinh gửi chuỗi `YYYY-MM-DD`, backend có implicit conversion sang Date. Avatar gửi multipart field `avatar`, chỉ JPEG tối đa 2 MB; backend xác minh nội dung và giới hạn 16 triệu pixel.

## Kiểm tra thủ công

1. Vào `/health`, xác nhận API và database hoạt động.
2. Đăng ký tài khoản, đăng nhập, tải lại trang, sửa hồ sơ và upload JPEG.
3. Làm mới phiên, đổi mật khẩu rồi đăng nhập bằng mật khẩu mới.
4. Đăng nhập ở `/admin/login` bằng tài khoản có `USER:read`, kiểm tra dashboard `/admin`, tìm/xóa người dùng ở `/admin/users`; tài khoản thường phải bị từ chối ở cổng admin.
5. Kiểm tra đăng xuất hiện tại, đăng xuất tất cả, tự xóa tài khoản và lỗi khi backend dừng.

Chưa thực hiện xác minh end-to-end với backend đang chạy hoặc tài khoản thật; build thành công chỉ xác nhận TypeScript và bundling.
