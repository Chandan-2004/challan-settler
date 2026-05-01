# 🚀 Challan Settler (Team Task Manager)

A full-stack web application where users can create tasks (challans), assign them, and track progress with role-based access.

---

## 🌐 Live Demo

Frontend: https://challansettler.up.railway.app
Backend: https://challan-settler.up.railway.app

---

## 🧠 Features

* 🔐 Authentication (JWT-based login/signup)
* 👥 Role-based access (Admin / Member)
* 📁 Project management
* 📌 Task (Challan) creation
* 👨‍⚖️ Task assignment to members
* 🔄 Status tracking (Submitted → Assigned → Completed)
* ⏰ Due date & overdue tracking
* 📊 Dashboard overview
* 📧 Email notifications

---

## 🏗️ Tech Stack

**Frontend**

* Next.js
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL (Neon)

**Deployment**

* Railway

---

## 📂 Project Structure

```
challan-settler/
│── backend/
│── frontend/
```

---

## ⚙️ Setup (Local Development)

### 1️⃣ Clone Repository

```
git clone https://github.com/Chandan-2004/challan-settler.git
cd challan-settler
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
RESEND_API_KEY=your_key
ADMIN_EMAIL=your_email
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend:

```
npm run dev
```

---

## 👥 Roles

| Role   | Permissions                |
| ------ | -------------------------- |
| Admin  | Manage users, assign tasks |
| Member | Update task status         |

---

## 🎯 Future Improvements

* Better UI/UX
* Notifications dashboard
* File upload enhancements
* Analytics

---

## 👨‍💻 Author

Chandan Yadav
