## 🚀 Project Highlights

- 🎓 Centralized platform for discovering campus events
- 📅 Real-time event listing with search & pagination
- 🎟 RSVP system with seat availability validation
- 🔐 Role-based dashboards (Student & Organizer)
- 📱 QR Code ticket generation for event entry
- 🧩 Clean MERN stack architecture
- ⚡ Fast and responsive UI built with Tailwind CSS


## 🧱 System Architecture
User (Student / Organizer)
        │
        ▼
React Frontend (UI)
        │
Axios API Requests
        │
Node.js + Express Backend
        │
Controller / Business Logic
        │
MongoDB Database
        │
JSON Response
        │
React Updates UI


The system follows a **layered MERN architecture**, separating presentation, application logic, and data layers for maintainability and scalability.



## 🧠 Key Technical Features

### 1️⃣ Event Search Engine
Uses MongoDB regex/text search to allow users to quickly find events by title or category.

### 2️⃣ Seat Availability Logic
Ensures users cannot RSVP if an event is full by checking available seats before creating an RSVP record.

### 3️⃣ QR Code Ticket System
After successful RSVP, a unique QR code is generated for each attendee to enable fast event check-in.

### 4️⃣ Role-Based Access Control
Organizers can manage events while students can only register and view events.




## 📊 Future Improvements

- 📧 Email notifications for event reminders
- 📅 Google Calendar integration
- 📊 Admin analytics dashboard
- 🔔 Push notifications for new events
- 🤖 AI-based event recommendations


## 📈 Project Status

Project developed as part of a **Full Stack MERN Hackathon Project**.

Current Version: **v1.0**

Planned Updates:
- UI enhancements
- Notification system
- Event analytics dashboard


## 🧑‍💻 Author

**Hemang Singh Solanki**

Aspiring Full Stack Developer  
MERN Stack | C++ | Problem Solving
