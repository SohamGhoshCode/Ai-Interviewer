<div align="center">

# 🤖 AI-Powered Interview Preparation App

### Smart, Personalized Interview Prep — Powered by Gemini AI & MERN Stack

[![JavaScript](https://img.shields.io/badge/JavaScript-94.1%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

> **Ace your next interview with AI-generated questions tailored to your role, experience, and goals.**

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](https://github.com/SohamGhoshCode/Ai-Interviewer/issues) · [✨ Request Feature](https://github.com/SohamGhoshCode/Ai-Interviewer/issues)

</div>

---

## 📸 Preview

> _Add a screenshot or screen recording of your app here_

```
📌 Tip: Use tools like Loom or Cleanshot to record your screen and paste the GIF here.
```

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🧠 About the Project

**AI-Powered Interview Preparation App** is a full-stack MERN application that helps job seekers prepare smarter and faster for technical interviews.

Using the **Gemini API**, the app generates intelligent, role-specific interview questions and provides detailed AI explanations on demand — making it your personal interview coach, available 24/7.

Whether you're a fresher or an experienced professional, this app adapts to your **job role** and **experience level** to deliver a focused, personalized preparation experience.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🔐 **Secure Authentication** | Sign up & log in with JWT-based auth for personalized, safe access |
| 🎯 **Role-Based Sessions** | Auto-generate questions based on your job role and experience level |
| 🧠 **AI-Powered Q&A** | High-quality technical questions & answers via Gemini API |
| 📚 **Accordion-Style Interface** | Clean, expandable Q&A layout for distraction-free studying |
| 💡 **Dynamic AI Explanations** | On-demand concept breakdowns for deeper understanding |
| 📌 **Pin & Prioritize** | Bookmark key questions for quick access and focused revision |
| 🗂️ **Persistent Storage** | Sessions saved securely in MongoDB for ongoing progress tracking |
| 🎨 **Responsive UI** | Mobile-friendly design with Tailwind CSS and smooth transitions |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Axios** — API communication

### Backend
- **Node.js** — Runtime environment
- **Express.js** — RESTful API framework
- **JWT** — Secure authentication
- **bcrypt** — Password hashing

### Database
- **MongoDB** — NoSQL persistent storage
- **Mongoose** — ODM for MongoDB

### AI Integration
- **Google Gemini API** — AI question & explanation generation
- **Model Rotation System** — Auto-switches across free models to prevent quota exhaustion

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SohamGhoshCode/Ai-Interviewer.git
   cd Ai-Interviewer
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables** _(see below)_

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MODEL_LIST=gemini-3.1-flash-lite,gemini-2.5-flash-lite,gemini-2.5-flash,gemini-3-flash
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## 📁 Project Structure

```
Ai-Interviewer/
│
├── backend/
│   ├── controllers/         # Route logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── middleware/          # Auth middleware
│   ├── utils/
│   │   └── geminiClient.js  # Gemini model rotation utility
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── context/         # Global state
│   │   └── App.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Interview Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/generate` | Generate AI questions by role |
| GET | `/api/interview/sessions` | Get all saved sessions |
| DELETE | `/api/interview/:id` | Delete a session |

### Question Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/question/pin/:id` | Pin/unpin a question |
| POST | `/api/question/explain` | Get AI explanation for a question |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Soham Ghosh**

[![GitHub](https://img.shields.io/badge/GitHub-SohamGhoshCode-181717?style=for-the-badge&logo=github)](https://github.com/SohamGhoshCode)

_If you found this project helpful, please consider giving it a ⭐ — it means a lot!_

</div>
