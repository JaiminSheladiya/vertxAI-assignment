# 🌟 VertxAI Application

## 📋 Overview

VertxAI is a social media aggregator application that collects, displays, and allows interaction with posts from platforms like Reddit and Twitter. Users can save posts, report inappropriate content, and track their activities. The application also provides a dashboard for admins to manage users and analytics.

## ✨ Features

- **📱 Feed Aggregation**: Fetches posts from Reddit and Twitter.
- **👆 User Interactions**: Users can save and report posts.
- **📊 User Dashboard**: Displays statistics like credits balance and daily rewards.
- **👑 Admin Dashboard**: Admins can manage users, view their activities, and make changes to user roles.
- **📝 Activity Tracking**: Users' activities like saving or reporting posts are tracked and displayed.
- **⏱️ Automated Posts Fetching**: Fetches posts from external APIs (Reddit, Twitter) every 16 minutes.
- **🧹 Automatic Cleanup**: Deletes old posts (older than 3 days) to maintain database performance.

---

## 📑 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
4. [Frontend Overview](#frontend-overview)
5. [Backend Overview](#backend-overview)
6. [Cron Jobs](#cron-jobs)
7. [Running the Application](#running-the-application)
8. [Contributing](#contributing)

---

## 🛠️ Tech Stack

- **🖥️ Frontend**: React, Ant Design, Redux
- **⚙️ Backend**: Node.js, Express.js
- **💾 Database**: MongoDB
- **🔒 Authentication**: JWT (JSON Web Token)
- **🔄 API Integrations**: Axios (for fetching posts from Reddit and Twitter)
- **⏰ Cron Jobs**: node-cron (for periodic tasks like fetching posts and cleaning up old data)
  
---

## 📥 Installation

### Backend

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vertxai.git
cd vertxai/backend
```

# 🚀 Project Setup Guide

## 🔧 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend/ directory and configure the following:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your_database
   JWT_SECRET=your_jwt_secret
   X_TOKEN= (GENERATE YOUR OWN X TOKEN FROM X developers)
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## 🎨 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend/ directory and configure the following:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## 📱 Usage

- Open the frontend in your browser at http://localhost:3000.
- Register or log in to access the dashboard.
- Explore the feed, save or report posts, and view your activity.
- Admin users can access the admin panel for user management and analytics.

## 📜 Scripts

### Backend
- `npm run dev`: Start the backend server in development mode.
- `npm run build`: Build the backend (if applicable).

### Frontend
- `npm start`: Start the frontend development server.
- `npm run build`: Build the frontend for production.
- `npm test`: Run tests for the frontend.

## 🧰 Technologies Used

### Frontend
- ⚛️ React
- 🔄 Redux
- 🐜 Ant Design
- 📡 Axios

### Backend
- 🚂 Express.js
- 🍃 MongoDB
- 🧠 Mongoose
- ⏰ Node-Cron
- 🔑 JWT Authentication

## 👨‍💻 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## 📞 Contact

For any inquiries or support, please contact the project maintainer at jaimins107@gmail.com 🍄.
