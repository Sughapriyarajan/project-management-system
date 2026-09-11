# Project Management System

A web-based Project Management System developed to manage users, projects, and tasks efficiently through a RESTful backend API.

## Features

- User registration
- Secure password hashing using bcrypt
- User login
- Project creation and management
- Task creation and management
- Task priority and status management
- Project-task relationship
- MySQL database integration
- Prisma ORM
- RESTful API architecture
- CORS and Helmet security middleware

## Tech Stack

### Backend
- Node.js
- Express.js
- JavaScript

### Database
- MySQL
- Prisma ORM
- Prisma MariaDB Adapter

### Security
- bcryptjs
- Helmet
- CORS
- Environment variables

## Project Structure

```text
project-management-system/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   └── prisma.js
│   │   │
│   │   └── server.js
│   │
│   ├── prisma7.config.ts
│   ├── package.json
│
├── .gitignore
├── package.json
└── README.md

API Endpoints
Users
Method	Endpoint	        Description
POST	/api/users	        Create a new user
GET	    /api/users	        Get all users
POST	/api/users/login	User login

Projects
Method	Endpoint	    Description
POST    /api/projects	Create a project
GET	    /api/projects	Get all projects

Tasks
Method	Endpoint	Description
POST	/api/tasks	Create a task
GET	    /api/tasks	Get all tasks

Database Models

The application uses three main models:

1.User – Stores user information.
2.Project – Stores project details and belongs to a user.
3.Task – Stores task details and belongs to a project.

Installation

Clone the repository:
git clone https://github.com/Sughapriyarajan/project-management-system.git

Navigate to the backend:
cd project-management-system/backend

Install dependencies:
npm install

Create a .env file and configure your database connection and application settings.

Run Prisma:
npx prisma generate
npx prisma db push

Start the development server:
npm run dev

The server will run on:
http://localhost:5000

Author 

Sughapriya R
B.Tech Information Technology