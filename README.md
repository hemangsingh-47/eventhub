<div align="center">
  <h1>🎟️ Campus Event Hub</h1>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind Badge" />
    <br/>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License Badge" />
  </p>
</div>

## 📖 Project Description
Campus Event Hub is a definitive full-stack MERN application aimed at solving a universal university problem: decentralized event discovery. By providing an interconnected web platform, students can efficiently discover, query, and RSVP to campus events such as hackathons, workshops, and cultural fests. Organizers are equipped with a powerful role-based dashboard for creation, management, and real-time attendance tracking via QR Code ticketing functionalities. Built specifically for high-impact hackathon presentation, it features optimized MongoDB text-search parsing and atomic database validations to ensure seat integrity.

**Live Demo:** [Deploy-URL-Here](https://campuseventhub-demo.vercel.app/)

## ✨ Key Features
- **Role-Based Authentication:** Secure JWT implementation distinguishing between "Student" and "Organizer" permissions.
- **Event Discovery Engine:** Fully paginated feed with live, debounced MongoDB text-index keyword search natively implemented.
- **Robust RSVP System:** One-click registration heavily enforced with backend concurrency checks protecting `availableSeats`.
- **Dynamic QR Code Generation:** Instant cryptographic verifiable QR codes rendered live upon RSVP confirmation for event-day scanning.
- **Organizer Dashboard:** Full CRUD (Create, Read, Update, Delete) capability dedicated solely to verified organizers.
- **Modern User Interface:** Highly responsive, glassmorphic layout structured with Tailwind CSS avoiding generic UI traps.

## 🛠 Tech Stack Table
| Layer | Technology Used | Description |
|---|---|---|
| **Frontend** | React 18, Vite | UI Rendering and virtual DOM manipulation |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid UI styling |
| **Routing** | React Router v6 | Client-side navigation mapping |
| **Backend** | Node.js, Express.js | API server layer handling stateless HTTP requests |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL Document Database |
| **ODM / Tooling**| Mongoose, Axios | Data modeling and Promise-based HTTP fetching |
| **Auth** | JWT, bcryptjs | Securing routes and hashing passwords |

## 📂 Abbreviated Folder Structure
```text
eventhub/
├── backend/
│   ├── config/db.js          # MongoDB Connect
│   ├── controllers/          # Business logic (event, auth, rsvp)
│   ├── models/               # Mongoose Schemas (User, Event, RSVP)
│   ├── routes/               # API endpoint definitions
│   └── server.js             # Main express application
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI (Navbar, Cards, Modals)
    │   ├── context/          # AuthContext for Global State
    │   ├── pages/            # View components (Home, Dashboard)
    │   └── utils/            # Axios API config
    ├── tailwind.config.js    # Design specific tokens
    └── package.json
```

## ⚙️ Prerequisites
Ensure that you have the following software installed locally:
- Node.js (v16.14.0 or higher)
- npm (v8 or higher)
- A MongoDB Cluster (Local or Atlas)
- Git (for cloning and version control)

## 🔐 Environment Variables

### Backend (`/backend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `PORT` | API Server running port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/eventhub` |
| `JWT_SECRET` | Secret key for signing tokens| `supersecret_jwt_key_99` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`/frontend/.env.local`)
| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Backend API gateway | `http://localhost:5000/api` |

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CampusEventHub.git
cd CampusEventHub
```

### 2. Setup the Backend
```bash
cd backend
npm install
# Create .env file based on the environment variables table
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
# Create .env.local file based on the frontend environment table
npm run dev
```

The frontend will start typically on `http://localhost:5173` while the backend runs parallel on `http://localhost:5000`.

## 🌐 API Endpoints Summary

| Group | Method | Path | Description | Access | 
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Create account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and retrieve token | Public |
| **Events** | `GET` | `/api/events` | List all events (paginated) | Public |
| **Events** | `POST` | `/api/events` | Create new event | Organizer |
| **Events** | `GET` | `/api/events/search`| Search events | Public |
| **RSVP** | `POST` | `/api/rsvp` | Register for an event | Student |
| **RSVP** | `GET` | `/api/rsvp/my-events` | Get all RSVPs for logged-in user | Student |

## 📸 Screenshots
*(To be populated post-deployment)*
- `![Home Page View](/docs/images/home.png)`
- `![RSVP QR Code](/docs/images/qr-code.png)`
- `![Organizer Dashboard](/docs/images/dashboard.png)`

## 🤝 Contributing Guidelines
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes using Conventional Commits (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request toward the `develop` branch. Ensure code passes local linting.

## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.
