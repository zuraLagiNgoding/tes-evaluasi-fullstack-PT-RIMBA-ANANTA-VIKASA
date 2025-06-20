# Manajemen User & Task - RESTful API

Proyek ini merupakan sistem RESTful API untuk manajemen pengguna dan tugas, dengan dashboard internal berbasis role, otorisasi, dan log aktivitas. Dibangun menggunakan **Laravel 12** untuk backend dan **HTML + Vanilla JS + Bootstrap** untuk frontend.

## Setup

### 1. Clone Repository
```
bash
git clone https://github.com/zuraLagiNgoding/tes-evaluasi-fullstack-PT-RIMBA-ANANTA-VIKASA.git
cd tes-evaluasi-fullstack-PT-RIMBA-ANANTA-VIKASA
```

### 2. Install Dependency
```bash
composer install
npm install && npm run build
```

### 3. Setup Environment
Salin file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database:
```bash
cp .env.example .env
```

### 4. Generate Key & Run Migration
```bash
php artisan key:generate
php artisan migrate --seed
```

### 5. Jalankan Server
```bash
php artisan serve
```

### 6. Scheduler & Log
Pastikan scheduler berjalan untuk proses pengecekan task yang overdue:
```bash
php artisan schedule:work
```

## ERD (Entity Relationship Diagram)

```
User
├── id: UUID (PK)
├── name: string
├── email: string (unique)
├── password: hashed
├── role: enum (admin, manager, staff)
├── status: boolean (active/inactive)

Task
├── id: UUID (PK)
├── title: string
├── description: text
├── assigned_to: UUID (FK -> User)
├── created_by: UUID (FK -> User)
├── status: enum (pending, in_progress, done)
├── due_date: date

ActivityLog
├── id: UUID (PK)
├── user_id: UUID (FK -> User)
├── action: string
├── description: text
├── logged_at: datetime
```

## Fitur

- Role based action permission
- Cookies authentication
- Log for every activity
- Check overdue task scheduler

### Role & Akses
| Role    | View Users | Manage Tasks | Assign Tasks | View Logs |
|---------|------------|--------------|--------------|-----------|
| Admin   | ✅         | ✅           | ✅           | ✅        |
| Manager | ✅         | ✅ (staff)   | ✅ (staff)   | ❌        |
| Staff   | ❌         | ✅ (self)    | ❌           | ❌        |

### API Utama
- `POST /login`
- `GET /users` (admin & manager)
- `POST /users` (admin)
- `GET /tasks` (berdasarkan role)
- `POST /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}` (admin/creator)
- `GET /logs` (admin)
