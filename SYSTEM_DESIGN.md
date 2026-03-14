# Campus Event Hub - Complete System Design Document

This document outlines the professional, hackathon-ready system design and documentation package for Campus Event Hub.

## Section 1 — Complete MERN Stack Architecture

Our application relies on a four-tier architecture model standard for MERN stack applications.

- **Client Layer (React.js):** Built with React.js using Tailwind CSS for UI design. Uses React Router v6 for client-side routing. State management relies on the Context API (`AuthContext` for user states). It communicates with the backend via Axios interceptors carrying a JWT.
- **Server Layer (Express.js):** Acts as the API Gateway. Connects the client to the database. Validates incoming requests, authenticates the JWT through middleware, and structures responses.
- **Business Logic Layer (Controllers):** Handles precise application logic (e.g., atomic decrement of seat counts, determining RSVP status, generating QR codes).
- **Database Layer (MongoDB):** Uses Mongoose ODM. Features indexed collections for fast text searching. Relies on `ObjectId` referencing for relational-style queries between Users, Events, and RSVPs.

### Architecture Diagram
```text
+-------------------------------------------------------------+
|                       CLIENT LAYER                          |
|  +--------------+  +--------------+  +-------------------+  |
|  | React Router |  | Auth Context |  | UI / Tailwind CSS |  |
|  +--------------+  +--------------+  +-------------------+  |
+-------------------------------------------------------------+
                               |
                        [ Axios HTTP ]
                               |
                               ▼
+-------------------------------------------------------------+
|                       SERVER LAYER                          |
|  +--------------+  +------------------+  +---------------+  |
|  | Express App  |  |  JWT Middleware  |  | API Routing   |  |
|  +--------------+  +------------------+  +---------------+  |
+-------------------------------------------------------------+
                               |
                    [ Request Object Flow ]
                               |
                               ▼
+-------------------------------------------------------------+
|                   BUSINESS LOGIC LAYER                      |
|  +--------------+  +------------------+  +---------------+  |
|  | Auth Service |  | Event Generation |  |  RSVP Logix   |  |
|  +--------------+  +------------------+  +---------------+  |
+-------------------------------------------------------------+
                               |
                       [ Mongoose ODM ]
                               |
                               ▼
+-------------------------------------------------------------+
|                     DATABASE LAYER                          |
|                 +---------------------+                     |
|                 |    MongoDB Atlas    |                     |
|                 | (Users/Events/RSVPs)|                     |
|                 +---------------------+                     |
+-------------------------------------------------------------+
```

## Section 2 — Detailed System Flow

### Overall System Flow
```text
Browser -> React Router -> UI Render -> User Action -> Axios API Call 
   -> Express Route -> JWT Middleware -> Controller Logic -> Mongoose Query 
   -> MongoDB Execution -> JSON Response -> Axios Promise Resolves -> React Updates State/UI
```

### Event Creation Flow
**Actor:** Organizer
```text
[UI] Organizer fills EventForm -> Clicks Submit
[React] POST /api/events with FormData and JWT
[Express] Authenticate JWT -> Check role === 'organizer'
[Controller] Validate fields -> new Event(req.body).save()
[MongoDB] Create Event Document
[Express] Return 201 Created { event }
[React] Redirect to /dashboard -> Show newly created event
```

### Event Listing and Pagination Flow
**Actor:** Any User
```text
[UI] Navigates to Home Page
[React] useEffect triggers GET /api/events?page=1&limit=10
[Express] Extract query params -> Controller limits find() and counts totals
[MongoDB] db.events.find().skip(0).limit(10)
[Express] Return 200 OK { events: [...], totalCount: 50, totalPages: 5 }
[React] Component updates state -> Renders EventCard grid -> Render Pagination component
```

### RSVP and QR Ticket Flow
**Actor:** Student
```text
[UI] Student clicks "RSVP Now" on EventDetailsPage
[React] POST /api/rsvp with eventId
[Express] Auth Middleware -> Extract userId
[Controller] Fetch Event. Check availableSeats > 0.
[MongoDB] Decrement seat count atomically: findOneAndUpdate({$inc: {availableSeats: -1}})
[Controller] Generate RSVP Document -> Generate QR Code String (userId + eventId + string)
[MongoDB] Save RSVP Document
[Express] Return 201 Created { rsvp, qrCodeData }
[React] Open QRCodeModal showing generated Ticket
```

### Event Search Flow
**Actor:** Any User
```text
[UI] User types "Hackathon" in SearchBar
[React] useDebounce pauses 500ms -> GET /api/events/search?q=Hackathon
[Express] Extract 'q' -> Query MongoDB text index
[MongoDB] db.events.find({ $text: { $search: "Hackathon" } })
[Express] Return results array
[React] Update events state -> Seamlessly update EventCard grid (no reload)
```

## Section 3 — Professional Folder Structure

```text
eventhub/
├── README.md
├── package.json
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js               # Entry point
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose Connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── rsvpController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # Protects routes
│   │   └── roleMiddleware.js   # Ensures organizer only functions
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Rsvp.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── rsvpRoutes.js
│   └── utils/
│       ├── generateToken.js
│       └── qrGenerator.js
└── frontend/
    ├── package.json
    ├── .env.local
    ├── tailwind.config.js
    ├── index.html
    ├── src/
        ├── main.jsx
        ├── App.jsx
        ├── assets/
        ├── components/
        │   ├── common/         # Reusable standard pieces
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── Loader.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   ├── Pagination.jsx
        │   │   └── Modal.jsx
        │   └── events/         # Feature specific components
        │       ├── EventCard.jsx
        │       ├── EventForm.jsx
        │       ├── SearchBar.jsx
        │       └── QRCodeTicket.jsx
        ├── context/
        │   └── AuthContext.jsx # Global State Management for user auth
        ├── hooks/
        │   ├── useAuth.js
        │   └── useDebounce.js
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── EventDetailsPage.jsx
        │   ├── CreateEventPage.jsx
        │   ├── OrganizerDashboard.jsx
        │   └── MyEventsPage.jsx
        └── utils/
            └── api.js          # Pre-configured Axios instance
```

## Section 4 — MongoDB Schema Design

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

```javascript
// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['hackathon', 'workshop', 'seminar', 'cultural', 'other'],
    required: true 
  },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

// Text Index for full-text search engine
eventSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Event', eventSchema);
```

```javascript
// models/Rsvp.js
const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrCodeData: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: { createdAt: 'registeredAt', updatedAt: true } });

module.exports = mongoose.model('Rsvp', rsvpSchema);
```

## Section 5 — Backend API Routes

### Event Routes (`/api/events`)
| Method | Path | Auth | Description | Payload/Query | Response Shape |
|---|---|---|---|---|---|
| GET | `/` | None | Get all events | Query: `?page=1&limit=10` | `{ events: [...], totalPages, count }` |
| GET | `/search` | None | Full text search events | Query: `?q=keyword` | `{ events: [...] }` |
| GET | `/:id` | None | Get single event details | Params: `id` | `{ event }` |
| POST | `/` | Organizer | Create newly formed event | JSON Body | `{ message, event }` |
| PUT | `/:id` | Organizer | Update event fields | JSON Body | `{ message, event }` |
| DELETE| `/:id` | Organizer | Delete an existing event| Params: `id` | `{ message: "Deleted" }` |

### RSVP Routes (`/api/rsvp`)
| Method | Path | Auth | Description | Payload/Query | Response Shape |
|---|---|---|---|---|---|
| POST | `/` | Student/Org | Register for an event | Body: `{ eventId }` | `{ message, rsvp, qrCodeData }` |
| DELETE| `/:id` | Student | Cancel RSVP | Params: `id` | `{ message: "Cancelled RSVP" }` |
| GET | `/my-events`| Student | Get RSVPs of logged user| None | `{ rsvps: [...populated] }` |
| GET | `/event/:id`| Organizer | Get all RSVPs for event | Params: `id` | `{ rsvps: [...populated] }` |

### Auth Routes (`/api/auth`)
| Method | Path | Auth | Description | Payload/Query | Response Shape |
|---|---|---|---|---|---|
| POST | `/register`| None | Create new user account | `{ name, email, password, role }` | `{ _id, name, email, role, token }` |
| POST | `/login` | None | Authenticate user account | `{ email, password }` | `{ _id, name, email, role, token }` |
| GET | `/profile` | Any User | Get logged-in user profile | None | `{ _id, name, email, role }` |

## Section 6 — React Component Architecture

**React Component Tree:**
```text
App
 ├── AuthContext.Provider
 ├── Navbar (Accesses Context)
 ├── Routes
 │    ├── HomePage (Public)
 │    │    ├── SearchBar
 │    │    ├── EventCard (Iterated)
 │    │    └── Pagination
 │    ├── EventDetailsPage (Public)
 │    │    ├── RSVPButton
 │    │    └── QRCodeTicket (Modal Triggered)
 │    ├── LoginPage (Public)
 │    ├── RegisterPage (Public)
 │    ├── ProtectedRoute (Student)
 │    │    └── MyEventsPage
 │    │         └── EventCard (User's RSVP'd Events)
 │    └── ProtectedRoute (Organizer)
 │         ├── OrganizerDashboard
 │         │    └── EventCard (Organizer's Events)
 │         └── CreateEventPage
 │              └── EventForm
 └── Footer
```

**Props and State Highlights:**
- **AuthContext:** Holds `user` object and `token`. Exposes `login(credentials)`, `logout()`, `register()`.
- **HomePage:** Local State: `events` (Array), `page` (Number), `isLoading` (Boolean). Calls `GET /api/events`.
- **EventCard:** Props: `event` (Object). Renders high-quality card layout routing to Details.
- **SearchBar:** Uses `useDebounce` hook state to capture input, calls `GET /api/events/search?q=` without spamming API.
- **EventDetailsPage:** Local State: `event`, `qrCodeModalOpen`. Props: None (gets ID from URL params). Uses Context to enable/disable RSVP button.

## Section 7 — UI/UX Layout Description

### 1. Home Page
- **Layout:** Standard Nav header, large Hero Section emphasizing discovery, Main grid of events, Footer.
- **Design:** Deep clean modern scheme (Slate and Azure blue - `bg-slate-50`, `text-slate-900`, `bg-blue-600` for CTA). 
- **Elements:** Large, centered `SearchBar` with shadow hover effect. `EventCard` elements map into a CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). Card images have `hover:scale-105 transition-transform` micro-interactions.

### 2. Event Details Page
- **Layout:** Split level. Left: Large Event Banner Image natively responsive. Right: Title, Category Badge, Date, Location, and Available Seats indicator using a progress bar styled element.
- **Design:** Uses Tailwind `backdrop-blur-md` on the RSVP modal for a clean modern ticketing feel.

### 3. Login/Register Page
- **Layout:** Split view desktop (Left: abstract illustration/brand color `bg-indigo-600`, Right: clean centered form constraint). Mobile: Centered Form.
- **Design:** Inputs use simple `border-gray-300 focus:ring-2 focus:ring-blue-500` styles.

### 4. Organizer Dashboard
- **Layout:** Sidebar navigation (Create Event, My Events, Profile), Main large feed.
- **Design:** Dashboard table-view. Uses Tailwind Tables for clean alignment of titles, status, attendees, and action buttons.

## Section 8 — Database Relationships
```text
[ USER ] (1) ---------- (<) [ EVENT ]
           creates
           
[ USER ] (1) ---------- (<) [ RSVP ]
         registers

[ EVENT ](1) ---------- (<) [ RSVP ]
        tracks attendees
```
- **User to Event Configuration:** One Organizer User can create many Events. Event stores `organizerId`.
- **User to RSVP:** A Student User can have many RSVPs.
- **Event to RSVP:** One Event holds the link for multiple RSVPs generated against it.

**Example Mongoose Populate Query:**
To load an Event and its Organizer details:
```javascript
const event = await Event.findById(req.params.id)
  .populate('organizerId', 'name email'); // retrieves User Name and Email attached referencing ObjectId
```
Recommended Index: Besides the Text Search Index, a compound index on `RSVP (eventId, userId)` ensures users cannot double RSVP for the same event via database constraint limits.

## Section 9 — Git Workflow

**Branch Naming Convention:** Start branches with type:
- `main` - production ready code
- `develop` - active integrated branch
- `feature/login-system` - new features
- `bugfix/seat-count-error` - fixing bugs
- `hotfix/qr-code-crash` - fixing live issues

**Step-by-Step Commit Workflow (Conventional Commits):**
```bash
git checkout -b feature/auth-pages
git add .
git commit -m "feat: implement frontend login and register pages with context"
git push origin feature/auth-pages
```

**Pull Request Process:**
- **Title:** e.g., "feat: integrate Context API for User Logic"
- **Description:** Points out major files modified. Indicates if database migrations or environment variables need updating.
- **Review:** Teammates review for clean code, missing imports, and logic bugs, before Squash Merging into `develop`.

**Production-ready .gitignore for MERN Monorepo:**
```text
node_modules/
.env
.env.*
dist/
build/
.DS_Store
```

## Section 10 — Deployment Suggestions

**Frontend on Vercel:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment:** Map `VITE_API_URL` to the live render backend string.

**Backend on Render.com:**
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:** `MONGO_URI` (Atlas Connection), `JWT_SECRET` (Secure string), `CLIENT_URL` (Frontend URL for CORS validation), `PORT=5000`

**Database on MongoDB Atlas:**
- Set up an `M0 Free Tier` cluster.
- Configure IP Whitelist to `0.0.0.0/0` safely passing through Render IP.
- Network connection string goes into `MONGO_URI`.

## Section 11 — Hackathon Presentation Guide

### 30-Second Hook
"Have you ever missed a campus tech talk or free food event simply because you didn't see the specific WhatsApp forward in time? We built Campus Event Hub: the unified, centralized, search-driven ticketing platform for students to never miss out, and for organizers to actually manage seat counts without chaos."

### Demo Script
1. Open Home Page -> Demonstrate visually engaging grid.
2. Search Engine -> Type "Career" -> show instant UI update.
3. User Flow -> Login as Student -> Click Event -> Hit "RSVP Now".
4. The Magic -> Show absolute UI generation of QR Ticket dynamically.
5. Organizer Flow -> Switch to Organizer account -> Create rapid event -> Show Dashboard tracking attendees.

### 3 Technical Highlights
1. **RegEx/Text Indexing:** Fast querying of MongoDB events via native `$text`.
2. **Atomic Operations:** Utilizing `$inc` operator for seat allocation, making the system immune to double-booking concurrency race conditions.
3. **JWT Stateless Authentication:** Securely storing sessions without memory bloat.

### Future Scope
1. NodeMailer triggered event reminder receipts.
2. Export attendees list to CSV via the Dashboard.
3. Calendar (.ics) generation payload embedded in the client side.

---
*(End of System Design. The complete README.md will be generated in the root repository directory next.)*
