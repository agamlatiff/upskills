# UpSkills

UpSkills is a web platform designed to help users improve their abilities through structured learning. Built with a **Laravel backend** and a **React + TypeScript frontend**, it provides a modern environment for course browsing, progress tracking, and skill development.

---

## 📌 Features

- User authentication (register/login)
- Course list & learning paths
- Lesson progress tracking
- User dashboard for active courses
- Admin panel for managing content (if applicable)
- REST API powered by Laravel
- Fast and responsive UI built with React + TypeScript

---

## 🛠️ Tech Stack

**Frontend**
- React  
- TypeScript  
- Tailwind CSS 
- Axios  
- TanStack Query

**Backend**
- Laravel  
- MySQL/PostgreSQL/SQLite (choose your DB)

---

## 📂 Project Structure

```bash
upskills/
├── backend/        # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── resources/
└── frontend/       # React + TypeScript frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── services/
````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/agamlatiff/upskills.git
cd upskills
```

---

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install

cp .env.example .env
php artisan key:generate

# Configure .env database settings
php artisan migrate
php artisan db:seed   # optional
php artisan serve
```

---

### 3. Frontend Setup (React + TS)

```bash
cd ../frontend
npm install   # or yarn
cp .env.example .env   # if available
npm run dev
```

---

## ▶️ Usage

1. Start Laravel backend:

   ```bash
   php artisan serve
   ```
2. Start React frontend:

   ```bash
   npm run dev
   ```
3. Open your browser at the provided frontend URL.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

**Agam Latiff**
GitHub: [https://github.com/agamlatiff](https://github.com/agamlatiff)
Project: [https://github.com/agamlatiff/upskills](https://github.com/agamlatiff/upskills)


