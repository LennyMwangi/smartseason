# 🌿 SmartSeason Field Management System

## 📌 Overview

SmartSeason is a full-stack web application designed to help agricultural teams manage farm fields, assign field agents, and track field progress across different growth stages.

The system provides:

* Role-based access (Admin & Agent)
* Field tracking and updates
* Assignment workflows
* Dashboard analytics with charts
* Clean, modern user interface

---

## 🚀 Tech Stack

### Frontend

* React (JavaScript)
* Tailwind CSS
* Recharts (data visualization)
* Axios (API communication)

### Backend

* Node.js + Express
* PostgreSQL
* JWT Authentication
* bcrypt (password hashing)

---

## 🔐 Authentication & Roles

### Admin

* Create fields
* Assign agents to fields
* View all fields
* Access dashboard analytics

### Agent

* View assigned fields
* Submit field updates
* Track progress stages

---

## 📊 Features

### 1. Authentication

* Secure login with JWT
* Password hashing using bcrypt
* Role-based authorization

---

### 2. Field Management

* Create fields (Admin)
* Assign agents to fields
* Track:

  * Crop type
  * Planting date
  * Current stage

---

### 3. Field Updates

Agents can:

* Add updates
* Change field stage
* Add notes

System automatically:

* Updates current stage
* Tracks update history

---

### 4. Status Logic

Each field has a dynamic status:

* 🟢 **Active**
* 🔴 **At Risk**
* 🟡 **Completed**

Status is computed based on:

* Latest field update
* Time and stage progression

---

### 5. Dashboard

#### Summary Cards

* Total Fields
* Active Fields
* At Risk Fields
* Completed Fields

#### Charts

* Pie Chart → Field status distribution
* Bar Chart → Fields by stage

#### Table Features

* Search fields
* Filter by status
* Pagination
* Role-based actions

---

## 🗄️ Database Schema

### users

* id
* name
* email
* password
* role (admin / agent)

### fields

* id
* name
* crop_type
* planting_date
* current_stage
* assigned_agent_id

### field_updates

* id
* field_id
* user_id
* stage
* notes
* created_at

---

## 🔌 API Endpoints

### Auth

* POST `/auth/register`
* POST `/auth/login`
* GET `/auth/users`

### Fields

* GET `/fields`
* POST `/fields`
* PUT `/fields/:id/assign`

### Updates

* POST `/updates/:fieldId`
* GET `/updates/:fieldId`

---

## 🧪 How to Run the Project

### 1. Clone repository

```bash
git clone <your-repo-url>
cd smartseason
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=smartseason
JWT_SECRET=secretkey
```

Run migrations:

```bash
npx knex migrate:latest
```

Start server:

```bash
node src/server.js
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

---

## 🎨 UI Design

* Tailwind CSS for styling
* Glassmorphism login UI
* Responsive dashboard layout
* Clean table design
* Interactive charts

---

## 📈 Future Improvements

* Field location mapping (GIS integration)
* Real-time updates (WebSockets)
* Mobile responsiveness enhancements
* Notifications system
* Export reports (PDF/Excel)

---

## 🧠 Key Learnings

This project demonstrates:

* Full-stack application design
* REST API development
* Authentication & authorization
* Database design & relationships
* UI/UX development with modern tools
* Data visualization

---

## 📬 Author

Developed as part of a full-stack project to demonstrate practical application of modern web development technologies.
