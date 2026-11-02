# NestJS Task Sharing Management API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="160" alt="Nest Logo" /></a>
</p>

## 📌 Tổng Quan (Overview)

Dự án phát triển module **`tasks`** trên nền tảng **NestJS Boilerplate** (sử dụng PostgreSQL, TypeORM, Swagger) hỗ trợ quản lý danh sách công việc cá nhân theo đúng yêu cầu đề bài Task 2.

---

## 🗄️ Mô Hình Dữ Liệu (Data Model)

Entity `Task` (`src/database/typeorm/entities/task.entity.ts`):
- `id`: Chuỗi UUID tự sinh (`randomUUID()`).
- `title`: `string`, bắt buộc, độ dài từ 1 - 255 ký tự.
- `category`: `string`, chủ đề của công việc (tùy chọn).
- `description`: `string`, mô tả chi tiết (tùy chọn).
- `isCompleted`: `boolean`, mặc định `false`.
- `createdAt`: `timestamp with time zone`, thời gian tạo.
- `updatedAt`: `timestamp with time zone`, thời gian cập nhật gần nhất.

---

## 📡 Danh Sách Endpoint (API Endpoints)

Tiền tố chung: `/api`

| Method | Endpoint | Mô tả | HTTP Status |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/tasks` | Tạo mới một công việc | `201 Created` |
| **GET** | `/api/v1/tasks` | Lấy danh sách công việc (có query lọc) | `200 OK` |
| **GET** | `/api/v1/tasks/:id` | Lấy chi tiết một công việc theo UUID | `200 OK` / `404 Not Found` |
| **PATCH** | `/api/v1/tasks/:id` | Cập nhật thông tin công việc | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/api/v1/tasks/:id` | Xóa một công việc | `204 No Content` / `404 Not Found` |

### Query Params cho GET `/api/v1/tasks`
- `isCompleted`: boolean (`true` hoặc `false`) - Lọc công việc theo trạng thái hoàn thành.
- `category`: string - Lọc công việc theo danh mục/chủ đề.

### Xử lý Ngoại lệ & Mã Lỗi (Exception Handling)
- `400 Bad Request`: Trả về từ `ValidationPipe` khi thiếu `title`, `title` rỗng hoặc vượt quá 255 ký tự.
- `404 Not Found`: Ném `NotFoundException('Tasks with ID ${id} not found')` khi không tìm thấy bản ghi hoặc ID không phải định dạng UUID.
- `500 Internal Server Error`: Xử lý ngoại lệ hệ thống.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu
- [Node.js](https://nodejs.org/) v16+
- [Docker Desktop](https://www.docker.com/) (để chạy PostgreSQL)

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Khởi tạo Database & Chạy Migrations bằng Docker
```bash
docker compose up -d init_db
```
Lệnh trên sẽ:
- Khởi động container PostgreSQL `postgres-db`.
- Tự động chạy TypeORM migrations để tạo các bảng dữ liệu (bao gồm bảng `tasks`).

### 3. Chạy ứng dụng NestJS ở chế độ phát triển
```bash
npm run start:dev
```
Ứng dụng sẽ chạy tại: **`http://localhost:3000`**.

### 4. Xem tài liệu Swagger UI
Truy cập: **`http://localhost:3000/api-docs`** hoặc **`http://localhost:3000/docs`**.

---

## 🧪 Kiểm Thử (Unit Tests)

Bộ unit test đầy đủ cho `TaskController` và `TaskService` được viết bằng **Jest**:

```bash
# Chạy tất cả test
npm test

# Chạy riêng test cho module task
npm test task.controller.spec.ts
npm test task.service.spec.ts
```

---

## 🛠️ Các Lệnh Thao Tác TypeORM

```bash
# Chạy migration thủ công
npm run typeorm:run-migration

# Tạo migration mới
npm run typeorm:create-migration --name=create-something

# Revert migration gần nhất
npm run typeorm:revert-migration
```
