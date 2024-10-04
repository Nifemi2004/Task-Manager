# Task Management API

![NestJS](https://img.shields.io/badge/NestJS-1ED760?logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=white)
![Bull](https://img.shields.io/badge/Bull-FFCE54?logo=redis&logoColor=white)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

The Task Management API is a robust backend application built with NestJS, designed to help users manage their tasks efficiently. It offers features such as user authentication, task creation and management, reminder notifications, and real-time updates via WebSockets.

## Features

- User Authentication:

  - Register and login with JWT-based authentication.
  - Secure routes using guards to ensure only authenticated users can access them.

- Task Management:

  - Create, read, update, and delete tasks.
  - Assign tasks to specific users.
  - Filter tasks based on status (active or completed).

- Reminders:

  - Users can opt-in to receive reminders for their tasks.
  - Schedule reminders using Bull queues and cron jobs.
  - Receive real-time notifications via WebSockets.

- Real-Time Notifications:

  - Implemented using Socket.IO for instant task reminders.

- API Documentation:
  - Comprehensive documentation available via Swagger UI.

## Technology Stack

- Backend Framework: NestJS
- Language: TypeScript
- Database: MySQL (Managed via MikroORM)
- Queue Management: Bull (with Redis)
- Real-Time Communication: Socket.IO
- API Documentation: Swagger

## Getting Started

### Prerequisites

- Node.js: v14 or higher
- yarn: v1.22.22
- MySQL: v5.7 or higher
- Redis: v5 or higher

### Installation

1. Clone the Repository:

   git clone https://github.com/Nifemi2004/task-management-api.git
   cd task-management-api

Install Dependencies:

yarn install

Environment Variables
Create a .env file in the root directory and configure the following variables:

# Database Configuration

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s

# Redis Configuration

REDIS_HOST=localhost
REDIS_PORT=6379

# Server Configuration

PORT=3000
Note: Replace your_database_name, your_database_user, your_database_password, and your_jwt_secret with your actual credentials and secrets.

Running the Application
Run Migrations:

Ensure your database is set up and run the migrations to create the necessary tables.

npx mikro-orm-ocm migration:up
Start the Application:

yarn start
The server should now be running at http://localhost:3000.

API Documentation
Access the Swagger UI for detailed API documentation and testing:

http://localhost:3000/docs

src/
├── app.module.ts
├── main.ts
├── config/
│ └── index.ts
├── tasks/
│ ├── dto/
│ │ ├── create-task.dto.ts
│ │ └── update-task.dto.ts
│ ├── task.entity.ts
│ ├── task.service.ts
│ ├── tasks.controller.ts
│ ├── reminders.gateway.ts
│ └── reminders.processor.ts
├── user/
│ ├── dto/
│ │ ├── create-user.dto.ts
│ │ └── login-user.dto.ts
│ ├── user.entity.ts
│ ├── user.service.ts
│ ├── user.controller.ts
│ └── auth/
│ ├── auth.guard.ts
│ └── auth.middleware.ts
└── common/
└── decorators/
└── user.decorator.ts

Usage

1. Authentication
   a. Register a New User
   Endpoint: POST /users

Request Body:

{
"username": "john_doe",
"email": "john@example.com",
"password": "strongPassword123"
}
Response:

{
"user": {
"email": "john@example.com",
"token": "jwt_token_here",
"username": "john_doe"
}
}
b. Login
Endpoint: POST /users/login

Request Body:
{
"email": "john@example.com",
"password": "strongPassword123"
}
Response:
{
"user": {
"email": "john@example.com",
"token": "jwt_token_here",
"username": "john_doe"
}
} 2. Task Management
Note: All task endpoints require authentication. Include the JWT token in the Authorization header as Bearer <token>.

a. Create a Task
Endpoint: POST /tasks

Request Body:

{
"description": "Clean the plates.",
"status": "active",
"dueDate": "2024-10-03T14:22:10.000Z",
"reminderEnabled": true,
"reminderTimeGapMinutes": 30
}
Response:

json
Copy code
{
"id": 1,
"description": "Clean the plates.",
"status": "active",
"dueDate": "2024-10-03T14:22:10.000Z",
"createdAt": "2024-10-03T19:22:06.407Z",
"updatedAt": "2024-10-03T19:22:06.407Z",
"user": {
"id": 1,
"username": "john_doe",
"email": "john@example.com"
},
"reminderEnabled": true,
"reminderTimeGapMinutes": 30
}
b. Retrieve All Tasks
Endpoint: GET /tasks

Response:

[
{
"id": 1,
"description": "Wash sokooya",
"status": "active",
"dueDate": "2024-10-03T14:22:10.000Z",
"createdAt": "2024-10-03T19:22:06.407Z",
"updatedAt": "2024-10-03T19:22:06.407Z",
"user": {
"id": 1,
"username": "john_doe",
"email": "john@example.com"
},
"reminderEnabled": true,
"reminderTimeGapMinutes": 30
}
// ... other tasks
]
c. Retrieve a Specific Task
Endpoint: GET /tasks/:id

Response:

{
"id": 1,
"description": "Wash sokooya",
"status": "active",
"dueDate": "2024-10-03T14:22:10.000Z",
"createdAt": "2024-10-03T19:22:06.407Z",
"updatedAt": "2024-10-03T19:22:06.407Z",
"user": {
"id": 1,
"username": "john_doe",
"email": "john@example.com"
},
"reminderEnabled": true,
"reminderTimeGapMinutes": 30
}

d. Update a Task
Endpoint: PATCH /tasks/:id

Request Body:
{
"status": "completed",
"reminderEnabled": false
}
Response:

{
"id": 1,
"description": "Wash sokooya",
"status": "completed",
"dueDate": "2024-10-03T14:22:10.000Z",
"createdAt": "2024-10-03T19:22:06.407Z",
"updatedAt": "2024-10-03T20:00:00.000Z",
"user": {
"id": 1,
"username": "john_doe",
"email": "john@example.com"
},
"reminderEnabled": false,
"reminderTimeGapMinutes": 30
}

e. Delete a Task
Endpoint: DELETE /tasks/:id
Response: 204 No Content

3. Real-Time Reminders
   To receive real-time task reminders:

Connect to the WebSocket Gateway:

Use Socket.IO client to connect. Ensure you provide the JWT token for authentication.

import io from 'socket.io-client';

const token = 'YOUR_JWT_TOKEN'; // Replace with your actual JWT token

const socket = io('http://localhost:3000', {
query: {
token,
},
});

socket.on('connect', () => {
console.log('Connected to WebSocket server.');
});

socket.on('task-reminder', (data) => {
alert(data.message);
console.log('Received Task Reminder:', data.task);
});

socket.on('disconnect', () => {
console.log('Disconnected from WebSocket server.');
});
Trigger Reminders:

When a task with reminders enabled reaches the specified time gap before its due date, the server will emit a task-reminder event to the connected user.

Name: Sokooya Nifemi
Happy Coding! 🚀
