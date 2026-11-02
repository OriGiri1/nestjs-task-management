# TaskFlow - Hệ Thống Quản Lý Công Việc Cá Nhân (Task Management System)

> Dự án bài tập **Task Sharing NestJS (Task 2)** kết hợp hoàn chỉnh giữa **NestJS Backend**, **React Frontend**, **PostgreSQL Database** và điều phối bằng **Docker Compose**.

---

## 🌟 1. Tính Năng Chính (Key Features)

### 🚀 Backend (NestJS Boilerplate)
- **Kiến trúc Modular & Clean Architecture**: Tách biệt Controller, Service, DTO, Entity, Response.
- **RESTful API v1**: Chuẩn RESTful cho module `tasks` (`/api/v1/tasks`).
- **PostgreSQL & TypeORM**:
  - Entity `Task` với UUID primary key tự động sinh (`randomUUID()`).
  - Migration script `1761500000001-create-tasks-table.ts` tạo bảng chuẩn hóa.
- **Validation chặt chẽ**:
  - Dùng `class-validator` & `class-transformer`.
  - Validate bắt buộc: `title` (1 - 255 ký tự).
  - Tùy chọn: `category` (string), `description` (text), `isCompleted` (boolean).
- **Lọc & Tìm kiếm**:
  - Lọc theo trạng thái `isCompleted` (`true` / `false`).
  - Lọc theo chủ đề `category`.
  - Sắp xếp mặc định theo thời gian tạo mới nhất (`createdAt: DESC`).
- **Xử lý Exception chuẩn**:
  - `400 Bad Request` khi dữ liệu không hợp lệ.
  - `404 Not Found` với thông báo chuẩn: `Tasks with ID ${id} not found`.
  - `500 Internal Server Error` cho lỗi hệ thống.
- **Swagger Documentation**: Tích hợp OpenAPI Swagger tại `/api-docs`.
- **Unit Tests**: Kiểm thử toàn diện với Jest cho cả `TaskController` và `TaskService`.

### 💻 Frontend (React + Vite + Modern UI)
- **Giao diện hiện đại, trực quan**: Thiết kế chuẩn UI/UX, hỗ trợ Responsive trên cả máy tính và điện thoại.
- **Bảng Thống kê (Dashboard Stats)**: Tổng số việc, đang thực hiện, đã hoàn thành, tỷ lệ hoàn thành (%).
- **Thao tác nhanh 1 chạm (1-Click Toggle)**: Đánh dấu hoàn thành/chưa hoàn thành ngay lập tức với animation.
- **Tìm kiếm & Bộ lọc linh hoạt**:
  - Tìm kiếm tức thời theo từ khóa trong tiêu đề và mô tả.
  - Lọc theo Tab trạng thái: *Tất cả*, *Đang làm*, *Đã xong*.
  - Lọc theo danh mục/chủ đề (*Category*).
- **Modal Thêm / Sửa công việc**: Gợi ý nhanh các thẻ tag (*Backend*, *Frontend*, *DevOps*, *Database*...).
- **Xác nhận xóa an toàn**: Hộp thoại xác nhận trước khi xóa vĩnh viễn.
- **Toast Notifications**: Thông báo trạng thái thành công/lỗi rõ ràng.

### 🐳 Docker & Docker Compose
- Khởi chạy toàn bộ hệ sinh thái chỉ với **1 lệnh duy nhất**:
  - `postgres-db`: Cơ sở dữ liệu PostgreSQL 16.
  - `init_db`: Tự động chạy migrations và seeds khởi tạo dữ liệu.
  - `nestjs-backend`: Backend API chạy trên cổng `3000`.
  - `react-frontend`: Frontend React phục vụ qua Nginx trên cổng `5173`.

---

## 📁 2. Cấu Trúc Dự Án (Project Structure)

```text
nestjs-boilerplate-develop/
├── src/
│   ├── database/
│   │   └── typeorm/
│   │       ├── entities/
│   │       │   ├── task.entity.ts           # Entity Task (UUID, title, category, ...)
│   │       │   └── index.ts
│   │       └── migrations/
│   │           └── 1761500000001-create-tasks-table.ts # Migration tạo bảng tasks
│   ├── modules/
│   │   └── task/
│   │       ├── dto/
│   │       │   ├── create-task.dto.ts       # DTO tạo task (validation)
│   │       │   ├── update-task.dto.ts       # DTO cập nhật task
│   │       │   └── get-tasks-query.dto.ts   # DTO query lọc (isCompleted, category)
│   │       ├── response/
│   │       │   └── task.response.ts         # Response DTO chuẩn hóa
│   │       ├── task.controller.ts           # Controller định nghĩa các endpoints
│   │       ├── task.controller.spec.ts      # Unit test cho Controller
│   │       ├── task.service.ts              # Business logic thao tác DB
│   │       ├── task.service.spec.ts         # Unit test cho Service
│   │       └── task.module.ts               # Module kết nối Entity & Controller & Service
│   ├── app.module.ts                        # Đăng ký TaskModule vào App
│   └── main.ts                              # Thiết lập Global Prefix (/api), CORS, Swagger
├── frontend/                                # Ứng dụng React Frontend
│   ├── src/
│   │   ├── components/                      # Navbar, TaskCard, TaskModal, FilterBar, ...
│   │   ├── services/api.ts                  # Gọi API NestJS
│   │   ├── types/task.ts                    # TypeScript types
│   │   ├── App.tsx
│   │   └── index.css
│   ├── Dockerfile                           # Dockerfile multi-stage build cho Frontend
│   ├── nginx.conf                           # Cấu hình Nginx reverse proxy
│   └── vite.config.ts
├── docker-compose.yml                       # Docker Compose cho PostgreSQL, NestJS, React
├── base.Dockerfile                          # Dockerfile cho NestJS Backend
├── .env.example                             # File mẫu biến môi trường
└── README.md
```

---

## 📡 3. Danh Sách API Endpoints

Prefix chung: `/api`

| Method | Endpoint | Mô tả | Mã phản hồi |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/tasks` | Tạo mới một công việc | `201 Created` |
| **GET** | `/api/v1/tasks` | Lấy danh sách công việc (có query lọc) | `200 OK` |
| **GET** | `/api/v1/tasks/:id` | Xem chi tiết công việc theo UUID | `200 OK` / `404 Not Found` |
| **PATCH**| `/api/v1/tasks/:id` | Cập nhật thông tin công việc | `200 OK` / `400` / `404` |
| **DELETE**| `/api/v1/tasks/:id`| Xóa một công việc | `204 No Content` / `404` |

### Ví dụ Request & Response

#### 1. Tạo task mới (POST `/api/v1/tasks`)
**Request Body:**
```json
{
  "title": "Học NestJS cơ bản",
  "category": "Backend",
  "description": "Tìm hiểu về DTO, Controller, Service và Module"
}
```
**Response (201 Created):**
```json
{
  "id": "a3b2c1d0-1234-4567-89ab-cdef01234567",
  "title": "Học NestJS cơ bản",
  "category": "Backend",
  "description": "Tìm hiểu về DTO, Controller, Service và Module",
  "isCompleted": false,
  "createdAt": "2026-10-27T08:30:00.000Z",
  "updatedAt": "2026-10-27T08:30:00.000Z"
}
```

#### 2. Lấy danh sách có bộ lọc (GET `/api/v1/tasks?isCompleted=false&category=Backend`)
**Response (200 OK):**
```json
[
  {
    "id": "a3b2c1d0-1234-4567-89ab-cdef01234567",
    "title": "Học NestJS cơ bản",
    "category": "Backend",
    "description": "Tìm hiểu về DTO, Controller, Service và Module",
    "isCompleted": false,
    "createdAt": "2026-10-27T08:30:00.000Z",
    "updatedAt": "2026-10-27T08:30:00.000Z"
  }
]
```

#### 3. Cập nhật task (PATCH `/api/v1/tasks/:id`)
**Request Body:**
```json
{
  "title": "Học NestJS nâng cao",
  "isCompleted": true
}
```
**Response (200 OK):**
```json
{
  "id": "a3b2c1d0-1234-4567-89ab-cdef01234567",
  "title": "Học NestJS nâng cao",
  "category": "Backend",
  "description": "Tìm hiểu về DTO, Controller, Service và Module",
  "isCompleted": true,
  "createdAt": "2026-10-27T08:30:00.000Z",
  "updatedAt": "2026-10-27T08:35:00.000Z"
}
```

#### 4. Xử lý lỗi Not Found (404 Not Found)
Khi gọi `GET /api/v1/tasks/non-existent-id`:
```json
{
  "statusCode": 404,
  "message": "Tasks with ID non-existent-id not found",
  "error": "Not Found"
}
```

---

## 🚀 4. Hướng Dẫn Chạy Bằng Docker (Khuyên Dùng)

### Yêu cầu:
- Đã cài đặt **Docker Desktop** và đang mở.

### Các bước thực hiện:

1. **Chuẩn bị file cấu hình môi trường**:
   Sao chép `.env.example` thành `.env` (file `.env` đã được cấu hình sẵn cho bạn trong repo).

2. **Khởi chạy toàn bộ hệ thống bằng Docker Compose**:
   ```bash
   docker compose up --build
   ```

3. **Truy cập các dịch vụ**:
   - 🌐 **Frontend React**: Mở trình duyệt tại [http://localhost:5173](http://localhost:5173)
   - 📑 **Swagger API Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - 🔌 **Backend REST API**: [http://localhost:3000/api/v1/tasks](http://localhost:3000/api/v1/tasks)

4. **Dừng hệ thống**:
   ```bash
   docker compose down
   ```

---

## 🛠️ 5. Hướng Dẫn Chạy Thủ Công (Không Cần Docker)

### Bước 1: Khởi động cơ sở dữ liệu PostgreSQL
Đảm bảo bạn có PostgreSQL đang chạy trên cổng `5432` với database tên `boilerplate` (hoặc sửa thông tin trong `.env`).

### Bước 2: Chạy Backend NestJS
```bash
# Di chuyển vào thư mục gốc
cd nestjs-boilerplate-develop

# Cài đặt dependencies
npm install

# Chạy migration tạo bảng dữ liệu
npm run typeorm:run-migration

# Khởi chạy backend ở chế độ watch
npm run start:dev
```
Backend sẽ chạy tại: `http://localhost:3000`.

### Bước 3: Chạy Frontend React
Mở một cửa sổ Terminal mới:
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Khởi chạy frontend ở chế độ dev
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`.

---

## 🧪 6. Chạy Unit Test (Kiểm Thử Đơn Vị)

Dự án đã viết đầy đủ unit tests cho `TaskController` và `TaskService`:
```bash
# Chạy tất cả test
npm test

# Chạy riêng test cho module task
npm test task.controller.spec.ts
npm test task.service.spec.ts

# Xem độ bao phủ (Coverage)
npm run test:cov
```

---

## 📤 7. Hướng Dẫn Đẩy Lên GitHub (Push to GitHub)

### Bước 1: Cài đặt Git (nếu máy chưa có)
Mở PowerShell (với quyền Administrator) và chạy:
```powershell
winget install --id Git.Git -e --source winget
```
*(Sau khi cài đặt xong, hãy tắt và mở lại PowerShell)*.

### Bước 2: Khởi tạo Git Repository và Commit
Tại thư mục gốc dự án (`E:\nestjs-boilerplate-develop`), mở PowerShell và chạy:
```powershell
# Khởi tạo git repo
git init

# Cấu hình danh tính (nếu chưa cấu hình)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Thêm tất cả các file vào Git
git add .

# Tạo commit đầu tiên
git commit -m "feat: complete Task 2 with NestJS Tasks module, React frontend, and Docker integration"

# Đổi nhánh chính thành main
git branch -M main
```

### Bước 3: Tạo Repository mới trên GitHub & Push
1. Đăng nhập vào [GitHub](https://github.com/), nhấn vào dấu **+** ở góc trên bên phải -> chọn **New repository**.
2. Đặt tên repository (ví dụ: `nestjs-react-task-management`), chọn **Public** hoặc **Private**, và **KHÔNG** tích chọn "Add a README file" hay .gitignore.
3. Nhấn **Create repository**.
4. Copy lệnh GitHub cung cấp và dán vào PowerShell:
```powershell
git remote add origin https://github.com/<your-username>/nestjs-react-task-management.git
git push -u origin main
```
Toàn bộ mã nguồn bài tập cùng giao diện React, cấu hình Docker và tài liệu sẽ được đẩy lên GitHub thành công!
