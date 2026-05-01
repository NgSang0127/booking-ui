# 🏥 Clinic Booking — Frontend (booking-ui)

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-v9-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-OAuth2%2FOIDC-4D4D4D?style=for-the-badge&logo=keycloak&logoColor=white)

**Giao diện người dùng (SPA) cho hệ thống đặt lịch khám phòng khám**

[Tổng quan](#-tổng-quan) · [Tính năng](#-tính-năng) · [Kiến trúc](#-kiến-trúc-frontend) · [Cài đặt](#-hướng-dẫn-cài-đặt) · [Cấu trúc thư mục](#-cấu-trúc-thư-mục) · [Công nghệ](#-công-nghệ-sử-dụng)

</div>

---

## 📋 Tổng quan

**booking-ui** là ứng dụng Single Page Application (SPA) được xây dựng bằng **React 19 + Vite**, đóng vai trò giao diện người dùng cho toàn bộ hệ thống đặt lịch khám phòng khám. Ứng dụng hỗ trợ **3 vai trò người dùng** (Customer, Clinic Owner, Admin) với các luồng nghiệp vụ khác nhau, tích hợp xác thực **OAuth2/OIDC qua Keycloak**, thanh toán trực tuyến, và thông báo real-time qua **WebSocket (STOMP/SockJS)**.

### 🎯 Điểm nổi bật kỹ thuật

- **React 19** — phiên bản mới nhất với các cải tiến hiệu năng
- **Keycloak SSO** — xác thực tập trung OAuth2/OIDC, không lưu password phía client
- **RTK Query** — data fetching & caching tự động, giảm boilerplate đáng kể
- **Real-time Notifications** — WebSocket (SockJS + STOMP) với JWT authentication header
- **Lazy Loading** — tất cả feature modules đều được code-split, tối ưu bundle size
- **Role-based Routing** — ProtectedRoute kiểm tra quyền trước khi render
- **Cloudinary Direct Upload** — upload ảnh trực tiếp lên CDN, không qua server backend
- **Recharts Dashboard** — biểu đồ thống kê booking & doanh thu tương tác

---

## ✨ Tính năng

### 👤 Dành cho Khách hàng (Customer)

| Tính năng | Mô tả |
|-----------|-------|
| 🏠 Trang chủ | Hero banner, danh sách dịch vụ nổi bật, tìm kiếm nhanh |
| 🔍 Tìm kiếm phòng khám | Lọc theo tên, chuyên khoa, địa điểm |
| 🏥 Chi tiết phòng khám | Thông tin đầy đủ, danh sách dịch vụ, đánh giá |
| 📅 Đặt lịch khám | Chọn dịch vụ → Chọn khung giờ → Xác nhận & Thanh toán |
| 💳 Thanh toán online | Redirect cổng thanh toán, xử lý callback success/cancel |
| 📋 Quản lý lịch hẹn | Xem, theo dõi trạng thái tất cả lịch đã đặt |
| ⭐ Đánh giá dịch vụ | Gửi rating + nhận xét sau khi hoàn thành khám |
| 🔔 Thông báo real-time | Nhận thông báo tức thời qua WebSocket |
| 👤 Hồ sơ cá nhân | Xem/sửa thông tin cá nhân, đổi mật khẩu |
| ℹ️ Trang Giới thiệu / Liên hệ | About page, contact form |

### 🏥 Dành cho Chủ phòng khám (Clinic Owner / OWNER)

| Tính năng | Mô tả |
|-----------|-------|
| 📝 Đăng ký đối tác | Multi-step form (3 bước) đăng ký trở thành đối tác |
| 📊 Dashboard tổng quan | Thống kê booking, doanh thu theo biểu đồ (Recharts) |
| 🛎️ Quản lý dịch vụ | Thêm/sửa/xóa các dịch vụ khám, upload ảnh Cloudinary |
| 📅 Quản lý booking | Xem danh sách lịch hẹn, cập nhật trạng thái |
| 🗂️ Quản lý danh mục | CRUD chuyên khoa/category của phòng khám |
| 💰 Tài chính | Xem giao dịch thanh toán, lịch sử payout |
| 🔔 Thông báo | Nhận thông báo đặt lịch mới theo phòng khám |
| 👤 Hồ sơ phòng khám | Cập nhật thông tin, ảnh đại diện phòng khám |

### 🛡️ Dành cho Quản trị viên (Admin)

| Tính năng | Mô tả |
|-----------|-------|
| 📋 Quản lý phòng khám | Xem, duyệt, vô hiệu hóa tất cả phòng khám trên hệ thống |
| 👥 Quản lý người dùng | Xem danh sách, phân quyền, khóa tài khoản |
| 📊 Dashboard Admin | Tổng quan toàn hệ thống |

---

## 🏗️ Kiến trúc Frontend

### Tổng quan kiến trúc

```
┌────────────────────────────────────────────────────────────────────┐
│                       booking-ui (React SPA)                        │
│                                                                      │
│  ┌───────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  Keycloak JS  │  │  React Router   │  │  Redux Toolkit Store │  │
│  │  SDK (Auth)   │  │  v7 (SPA mode)  │  │  ┌────────────────┐  │  │
│  │               │  │  3 route groups │  │  │  State Slices  │  │  │
│  │  - SSO check  │  │  - Admin        │  │  │  RTK Query API │  │  │
│  │  - JWT token  │  │  - Clinic Owner │  │  │  Cache Layer   │  │  │
│  │  - token auto │  │  - Customer     │  │  └────────────────┘  │  │
│  │    refresh    │  └─────────────────┘  └──────────────────────┘  │
│  └───────────────┘                                                   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Feature Modules                           │   │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌───────────────┐  │   │
│  │  │   Customer   │  │  Clinic (Owner)  │  │     Admin     │  │   │
│  │  │  /features/  │  │  /features/      │  │  /features/   │  │   │
│  │  └──────────────┘  └──────────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐   │
│  │  WebSocket (SockJS+STOMP)│  │  Cloudinary (Image CDN Upload) │   │
│  │  Real-time Notifications │  │  Direct Upload (bypass server) │   │
│  └──────────────────────────┘  └────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                              │
             HTTP (Axios + Bearer Token auto-inject)
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│          API Gateway — Spring Cloud Gateway  :5000                  │
└────────────────────────────────────────────────────────────────────┘
```

### Luồng xác thực (Keycloak OAuth2/OIDC)

```
1. App khởi động
   └─► Khởi tạo Keycloak JS SDK (initOptions: { onLoad: 'check-sso' })

2. Người dùng vào route protected
   └─► ProtectedRoute kiểm tra: initialized? isAuthenticated? hasRole?

3. Chưa đăng nhập
   └─► keycloak.login() → redirect đến Keycloak Login Page

4. Đăng nhập thành công
   └─► Keycloak redirect về app + đính kèm Authorization Code
   └─► Keycloak JS đổi code lấy JWT Access Token + Refresh Token

5. Axios interceptor (config/api.js)
   └─► Mọi HTTP request → keycloak.updateToken(70) → Bearer token header

6. Token hết hạn
   └─► updateToken tự động refresh → không cần đăng nhập lại

7. Redux sync
   └─► useGetUserProfileQuery → dispatch(setUser(profile))
```

### Phân quyền theo Role

| Route | Roles yêu cầu | Fallback |
|-------|--------------|----------|
| `/admin/*` | `ADMIN` | `/unauthorized` |
| `/clinic-dashboard/*`, `/become-partner` | `OWNER` | `/unauthorized` |
| `/bookings`, `/profile`, `/notifications` | `CUSTOMER`, `OWNER`, `ADMIN` | Keycloak login |
| `/`, `/search`, `/clinic/:id`, `/about`, `/contact` | Public | — |

---

## 🗂️ Cấu trúc thư mục

```
booking-ui/
├── 📄 index.html                      # Entry HTML (Vite)
├── 📄 vite.config.js                  # Vite + React + Tailwind config
├── 📄 eslint.config.js                # ESLint rules
├── 📄 package.json                    # Dependencies & npm scripts
├── 📄 .env                            # Environment variables
│
├── 📁 public/
│   ├── favicon.svg                    # App favicon
│   ├── logo.png / logo.svg            # Brand logo
│   └── silent-check-sso.html          # Keycloak silent SSO check page
│
└── 📁 src/
    ├── 📄 main.jsx                    # Root: ReactDOM.render + Keycloak Provider + Redux Provider
    ├── 📄 App.jsx                     # RootLayout: MUI Theme + Auth state sync + Global Snackbar
    ├── 📄 index.css                   # Global styles (Tailwind @base)
    │
    ├── 📁 config/
    │   └── api.js                     # Axios instance + Keycloak request interceptor
    │
    ├── 📁 keycloak/
    │   └── keycloak.js                # Keycloak JS client instance (url/realm/clientId từ .env)
    │
    ├── 📁 theme/
    │   ├── blueTheme.js               # MUI custom theme (primary blue) — đang dùng
    │   └── redTheme.js                # MUI theme alternative
    │
    ├── 📁 routes/
    │   ├── Routes.jsx                 # createBrowserRouter — root router
    │   ├── ProtectedRoute.jsx         # Role-based guard (check initialized + auth + role)
    │   ├── AdminRoutes.jsx            # /admin/* — chỉ ADMIN
    │   ├── ClinicRoutes.jsx           # /clinic-dashboard/* — chỉ OWNER
    │   └── CustomerRoutes.jsx         # Layout public + protected CUSTOMER routes
    │
    ├── 📁 redux/
    │   ├── store.js                   # configureStore (reducers + RTK Query middlewares)
    │   ├── uiSlice.js                 # Global UI state (loading, snackbar message)
    │   ├── api/baseQuery.js           # RTK Query baseQuery với JWT inject
    │   ├── Auth/
    │   │   ├── authApi.js             # getUserProfile endpoint
    │   │   └── authSlice.js           # state.auth: { user, isLoading }
    │   ├── Booking/bookingApi.js      # CRUD lịch hẹn
    │   ├── Category/categoryApi.js    # CRUD danh mục
    │   ├── Clinic/
    │   │   ├── clinicApi.js           # CRUD phòng khám
    │   │   └── clinicSlice.js         # state.clinic: { selectedClinic }
    │   ├── ClinicService/clinicServiceApi.js  # CRUD dịch vụ của phòng khám
    │   ├── Dashboard/dashboardApi.js  # Stats + Notifications (WebSocket cache update)
    │   ├── Payment/paymentApi.js      # Tạo + truy vấn giao dịch
    │   └── Review/reviewApi.js        # CRUD đánh giá
    │
    ├── 📁 hooks/
    │   └── useAuth.js                 # Custom hook: { initialized, isAuthenticated, hasRole, login }
    │
    ├── 📁 util/
    │   ├── getTodayDate.js            # Helper: format ngày hôm nay
    │   ├── isServiceSelected.js       # Helper: kiểm tra service đã được chọn
    │   ├── readableDateTime.js        # Helper: format datetime thân thiện
    │   ├── totalEarning.js            # Helper: tính tổng doanh thu
    │   ├── uploadToCloudinary.js      # Helper: POST ảnh lên Cloudinary API
    │   └── useNotificationWebsocket.jsx  # Custom hook: SockJS + STOMP connection
    │
    ├── 📁 data/
    │   └── services.js                # Static data mẫu danh sách dịch vụ
    │
    ├── 📁 assets/
    │   └── hero.png                   # Hero section image
    │
    ├── 📁 components/
    │   ├── common/
    │   │   ├── AppSnackbar.jsx        # Global toast (success/error/info)
    │   │   ├── EmptyState.jsx         # UI khi không có dữ liệu
    │   │   ├── LazyWrapper.jsx        # <Suspense> wrapper cho lazy-loaded routes
    │   │   └── TableSkeleton.jsx      # Loading skeleton cho MUI DataTable
    │   └── error/
    │       ├── NotFound.jsx           # Trang 404 (với animation)
    │       ├── Unauthorized.jsx       # Trang 403
    │       └── InternalServerError.jsx # Trang 500
    │
    └── 📁 features/
        │
        ├── 📁 Auth/
        │   ├── Auth.jsx               # Container: chọn Login hoặc Register
        │   ├── Login.jsx              # Nút đăng nhập → keycloak.login()
        │   └── Register.jsx           # Form đăng ký tài khoản mới (Formik + Yup)
        │
        ├── 📁 Loading/
        │   ├── Loader.jsx             # Animated spinner component
        │   └── LoaderManager.jsx      # Global loading state controller
        │
        ├── 📁 Admin/                  # === ADMIN PORTAL ===
        │   ├── components/
        │   │   └── DrawerList.jsx     # Sidebar menu của Admin
        │   └── pages/
        │       ├── Dashboard/Dashboard.jsx     # Admin layout (sidebar + outlet)
        │       ├── Clinic/ClinicTable.jsx       # Bảng quản lý tất cả phòng khám
        │       └── User/AdminUserList.jsx       # Bảng quản lý tất cả người dùng
        │
        ├── 📁 Clinic/                 # === CLINIC OWNER PORTAL ===
        │   ├── components/Sidebar/DrawerList.jsx
        │   └── pages/
        │       ├── Account/
        │       │   ├── Profile.jsx              # Hồ sơ phòng khám (full CRUD + ảnh)
        │       │   └── ProfileFieldCard.jsx
        │       │
        │       ├── BecomePartner/               # Multi-step registration
        │       │   ├── BecomePartnerForm.jsx     # Orchestrator: quản lý bước hiện tại
        │       │   ├── BecomePartnerFormStep1.jsx # Bước 1: Thông tin cá nhân
        │       │   ├── BecomePartnerFormStep2.jsx # Bước 2: Thông tin phòng khám
        │       │   ├── BecomePartnerFormStep3.jsx # Bước 3: Xác nhận & submit
        │       │   └── ClinicForm.jsx
        │       │
        │       ├── Booking/
        │       │   └── BookingTable.jsx         # Danh sách lịch hẹn của phòng khám
        │       │
        │       ├── Category/
        │       │   ├── Category.jsx
        │       │   ├── CategoryForm.jsx         # Form thêm chuyên khoa
        │       │   ├── CategoryTable.jsx        # Bảng danh mục
        │       │   └── UpdateCategoryForm.jsx
        │       │
        │       ├── ClinicService/
        │       │   ├── Services.jsx
        │       │   ├── ServicesTable.jsx        # Bảng dịch vụ
        │       │   ├── AddServiceForm.jsx       # Form thêm dịch vụ (Formik + Cloudinary)
        │       │   └── UpdateServiceClinicForm.jsx
        │       │
        │       ├── Payment/
        │       │   ├── Payment.jsx              # Tổng quan tài chính
        │       │   ├── PayoutsTable.jsx         # Bảng payout
        │       │   └── TransactionTable.jsx     # Bảng lịch sử giao dịch
        │       │
        │       └── SellerDashboard/
        │           ├── ClinicDashboard.jsx      # Layout dashboard (lazy loaded)
        │           ├── HomePage.jsx             # Trang chủ dashboard: stats + charts
        │           └── Chart/
        │               ├── BookingChart.jsx     # Recharts: Line chart lịch hẹn theo ngày
        │               ├── EarningChart.jsx     # Recharts: Bar chart doanh thu
        │               ├── StatCard.jsx         # Card số liệu nhanh
        │               └── QuickLinks.jsx       # Shortcut navigation links
        │
        └── 📁 Customer/               # === CUSTOMER PORTAL ===
            └── pages/
                ├── Home/
                │   ├── Home.jsx                 # Trang chủ toàn bộ
                │   ├── Banner.jsx               # Hero section + CTA + Swiper
                │   └── HomeServiceCard.jsx      # Card dịch vụ nổi bật
                │
                ├── Navbar/Navbar.jsx             # Top navigation: logo, menu, auth controls
                ├── Footer/Footer.jsx             # Footer: links, social, info
                │
                ├── About/AboutPage.jsx           # Trang giới thiệu (animated)
                ├── Contact/ContactPage.jsx       # Form liên hệ
                │
                ├── Clinic/
                │   ├── ClinicList.jsx            # Grid danh sách phòng khám
                │   ├── ClinicCard.jsx            # Card hiển thị một phòng khám
                │   ├── SearchClinic.jsx          # Tìm kiếm + bộ lọc phức tạp
                │   └── ClinicDetail/
                │       ├── ClinicDetail.jsx      # Container route chi tiết
                │       ├── ClinicDetails.jsx     # Layout (sidebar + content)
                │       ├── ClinicServiceDetails.jsx # Chọn dịch vụ & luồng đặt lịch
                │       ├── ServiceCard.jsx       # Card một dịch vụ
                │       ├── CategoryCard.jsx      # Card một chuyên khoa
                │       └── SelectedServiceList.jsx # Danh sách dịch vụ đã chọn
                │
                ├── Booking/
                │   ├── Bookings.jsx             # Danh sách lịch hẹn của người dùng
                │   └── BookingCard.jsx          # Card một lịch hẹn
                │
                ├── Payment/
                │   ├── PaymentSuccessHandler.jsx # Xử lý redirect sau thanh toán thành công
                │   └── PaymentCancel.jsx         # Trang hủy thanh toán
                │
                ├── Review/
                │   ├── Review.jsx               # Danh sách đánh giá
                │   ├── ReviewCard.jsx            # Card một review
                │   ├── RatingCard.jsx            # Hiển thị rating tổng hợp
                │   └── CreateReviewForm.jsx      # Form viết đánh giá (Formik + star rating)
                │
                ├── Notification/
                │   ├── Notification.jsx          # Danh sách thông báo
                │   └── NotificationCard.jsx      # Card một thông báo
                │
                └── Profile/
                    ├── UserProfile.jsx           # Hồ sơ cá nhân: xem + sửa
                    └── ChangePasswordModal.jsx   # Modal đổi mật khẩu
```

---

## 🛠️ Công nghệ sử dụng

### Core Framework

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **React** | 19.2.4 | UI framework |
| **Vite** | 8.0.4 | Build tool, HMR dev server cực nhanh |
| **react-router-dom** | 7.14.1 | SPA routing, nested routes |

### UI & Styling

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **@mui/material** | 9.0.0 | Component library (Button, Table, Dialog, Drawer...) |
| **@mui/icons-material** | 9.0.0 | Bộ icon Material Design |
| **@mui/x-date-pickers** | 9.0.0 | Date/Time picker (tích hợp dayjs) |
| **Tailwind CSS** | 4.2.2 | Utility-first CSS, layout & spacing |
| **framer-motion** | 12.38.0 | Animation & page transitions |
| **styled-components** | 6.4.1 | CSS-in-JS cho các component phức tạp |
| **Swiper** | 12.1.3 | Touch-enabled carousel/slider |
| **Recharts** | 3.8.1 | Biểu đồ Line, Bar, Area cho dashboard |

### State Management & Data Fetching

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **@reduxjs/toolkit** | 2.11.2 | Redux store + RTK Query (API caching) |
| **react-redux** | 9.2.0 | React bindings cho Redux |
| **redux-thunk** | 3.1.0 | Async action middleware |
| **axios** | 1.15.0 | HTTP client (với interceptor JWT) |

### Authentication

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **keycloak-js** | 26.2.4 | Keycloak JavaScript adapter |
| **@react-keycloak/web** | 3.4.0 | ReactKeycloakProvider + useKeycloak hook |

### Real-time Communication

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **sockjs-client** | 1.6.1 | WebSocket với fallback HTTP transport |
| **stompjs** | 2.3.3 | STOMP messaging protocol over WebSocket |

### Forms & Validation

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **Formik** | 2.4.9 | Form state management & submission |
| **Yup** | 1.7.1 | Schema validation (kết hợp với Formik) |

### Utilities

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **dayjs** | 1.11.20 | Date/time parsing, formatting, manipulation |
| **react-i18next** | 17.0.2 | Internationalization (i18n) framework |
| **web-vitals** | 5.2.0 | Core Web Vitals performance metrics |

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x (hoặc yarn / pnpm)
- **Keycloak** server đang chạy (xem [BookingMicroservice](https://github.com/NgSang0127/BookingMicroservice))
- **API Gateway** backend chạy tại port `5000`

### Bước 1: Clone repository

```bash
git clone https://github.com/NgSang0127/booking-ui.git
cd booking-ui
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc:

```env
# =============================
# Keycloak Configuration
# =============================
VITE_KEYCLOAK_URL=http://localhost:7080
VITE_KEYCLOAK_REALM=clinic-booking
VITE_KEYCLOAK_CLIENT_ID=clinic-booking-react

# =============================
# Backend API Gateway
# =============================
VITE_API_BASE_URL=http://localhost:5000

# =============================
# Cloudinary (Image Upload CDN)
# =============================
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_API_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```

### Bước 4: Cấu hình Keycloak Client

Trong Keycloak Admin Console (`http://localhost:7080`), tạo Client:

| Trường | Giá trị |
|--------|---------|
| Client ID | `clinic-booking-react` |
| Client Type | `Public` |
| Valid Redirect URIs | `http://localhost:5173/*` |
| Valid Post Logout Redirect URIs | `http://localhost:5173/*` |
| Web Origins | `http://localhost:5173` |

### Bước 5: Khởi động ứng dụng

```bash
# Development server (hot reload tại :5173)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Chạy ESLint
npm run lint
```

Truy cập: **http://localhost:5173**

---

## 🌐 Các Route chính

### Public (không cần đăng nhập)

| Path | Component | Mô tả |
|------|-----------|-------|
| `/` | `Home` | Trang chủ |
| `/search` | `SearchClinic` | Tìm kiếm & lọc phòng khám |
| `/clinic/:id` | `ClinicDetails` | Chi tiết phòng khám + đặt lịch |
| `/about` | `AboutPage` | Giới thiệu |
| `/contact` | `ContactPage` | Liên hệ |
| `/login` | `Auth` | Đăng nhập qua Keycloak |
| `/register` | `Auth` | Đăng ký tài khoản |
| `/payment-success/:id` | `PaymentSuccessHandler` | Callback thanh toán thành công |
| `/payment/cancel` | `PaymentCancel` | Callback hủy thanh toán |
| `/unauthorized` | `Unauthorized` | Trang 403 |

### Protected — Customer (CUSTOMER / OWNER / ADMIN)

| Path | Component | Mô tả |
|------|-----------|-------|
| `/bookings` | `Bookings` | Danh sách lịch hẹn của tôi |
| `/profile` | `UserProfile` | Hồ sơ cá nhân |
| `/notifications` | `Notification` | Thông báo của tôi |

### Protected — Clinic Owner (OWNER)

| Path | Component | Mô tả |
|------|-----------|-------|
| `/become-partner` | `BecomePartnerForm` | Đăng ký trở thành đối tác (3 bước) |
| `/clinic-dashboard` | `ClinicDashboard` | Dashboard chính |
| `/clinic-dashboard/services` | `Services` | Quản lý dịch vụ |
| `/clinic-dashboard/services/:id` | `UpdateServiceForm` | Sửa dịch vụ |
| `/clinic-dashboard/add-services` | `ServiceForm` | Thêm dịch vụ mới |
| `/clinic-dashboard/bookings` | `BookingTable` | Quản lý lịch hẹn |
| `/clinic-dashboard/category` | `Category` | Quản lý danh mục |
| `/clinic-dashboard/payment` | `Payment` | Tổng quan tài chính |
| `/clinic-dashboard/transaction` | `TransactionTable` | Lịch sử giao dịch |
| `/clinic-dashboard/account` | `Profile` | Hồ sơ phòng khám |
| `/clinic-dashboard/notifications` | `Notification` | Thông báo phòng khám |
| `/clinic-dashboard/profile` | `UserProfile` | Hồ sơ cá nhân của Owner |

### Protected — Admin (ADMIN)

| Path | Component | Mô tả |
|------|-----------|-------|
| `/admin` | `AdminDashboard` | Dashboard quản trị |
| `/admin` (index) | `ClinicTable` | Quản lý tất cả phòng khám |
| `/admin/users` | `AdminUserList` | Quản lý tất cả người dùng |

---

## 🔔 Real-time Notifications (WebSocket)

Khi người dùng đăng nhập, ứng dụng tự động kết nối WebSocket:

```
SockJS("http://localhost:5000/api/notifications/ws")
  └─► STOMP.connect({ Authorization: "Bearer <JWT_TOKEN>" })
        │
        ├─► subscribe("/notification/user/{userId}")      ← Customer
        └─► subscribe("/notification/clinic/{clinicId}")  ← Clinic Owner

Khi nhận tin nhắn mới:
  └─► dispatch RTK Query cache update (prepend vào danh sách)
  └─► UI re-render tức thì (không cần refetch API)
```

---

## ☁️ Upload ảnh với Cloudinary

Ứng dụng upload ảnh **trực tiếp** từ browser lên Cloudinary CDN mà không qua backend:

```
Browser (chọn file)
  └─► uploadToCloudinary.js
        └─► POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload
              ├─► upload_preset: (từ .env)
              └─► file: (base64 / File object)
                    └─► Response: { secure_url: "https://res.cloudinary.com/..." }
                          └─► Lưu URL vào form → submit form lên API server
```

Lợi ích: giảm tải hoàn toàn cho backend, tốc độ upload nhanh hơn.

---

## 📦 Scripts

```bash
npm run dev       # Vite dev server với HMR tại http://localhost:5173
npm run build     # Build production bundle → dist/
npm run preview   # Chạy preview production build
npm run lint      # ESLint kiểm tra toàn bộ src/
```

---

## 🗺️ Roadmap

- [x] Xác thực OAuth2/OIDC với Keycloak (SSO)
- [x] Role-based routing (ADMIN / OWNER / CUSTOMER)
- [x] RTK Query data fetching, caching & invalidation
- [x] Real-time notification qua WebSocket (STOMP/SockJS) + JWT header
- [x] Dashboard biểu đồ Recharts (booking & doanh thu)
- [x] Upload ảnh Cloudinary trực tiếp từ browser
- [x] Multi-step form đăng ký đối tác (3 bước)
- [x] Lazy loading toàn bộ feature modules (code-split)
- [x] Animated error pages (404, 403, 500)
- [x] Axios interceptor tự động refresh JWT token
- [ ] Viết Unit Tests (Vitest + React Testing Library)
- [ ] E2E Tests (Playwright / Cypress)
- [ ] Tối ưu SEO (React Helmet Async)
- [ ] PWA support (Service Worker)
- [ ] Dark mode toggle
- [ ] Hoàn thiện i18n đa ngôn ngữ (react-i18next đã tích hợp sẵn)
- [ ] Storybook components documentation

---

## 🔗 Liên kết liên quan

- **Backend Microservices:** [BookingMicroservice](https://github.com/NgSang0127/BookingMicroservice)
- **Keycloak Docs:** [keycloak.org/documentation](https://www.keycloak.org/documentation)
- **MUI v9:** [mui.com](https://mui.com)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)
- **RTK Query:** [redux-toolkit.js.org/rtk-query](https://redux-toolkit.js.org/rtk-query/overview)

---

## 👨‍💻 Tác giả

**NgSang0127**

- GitHub: [@NgSang0127](https://github.com/NgSang0127)

---

<div align="center">

⭐ Nếu dự án này hữu ích, hãy để lại một **Star** nhé!

</div>
