# Campus Events Management System

A full-stack college event management platform built with React, TypeScript, Tailwind CSS, Flask, and SQLite.

## Features

- **Event Discovery**: Browse upcoming campus events with filtering by category
- **Event Details**: View comprehensive event information with registration
- **Category Browsing**: Explore events by category (Music, Career, Arts, Technology, Sports, Culture)
- **Event Submission**: Submit new events with a user-friendly form
- **Statistics Dashboard**: View platform statistics with animated counters
- **Responsive Design**: Fully responsive layout for all devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons
- Sonner for toast notifications

### Backend
- Flask (Python)
- Flask-SQLAlchemy for ORM
- Flask-CORS for cross-origin requests
- SQLite database

## Project Structure

```
/mnt/okcomputer/output/
├── app/                    # React frontend
│   ├── src/
│   │   ├── sections/       # Page sections (Hero, Events, Categories, etc.)
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   └── index.css       # Global styles
│   └── dist/               # Built frontend files
├── backend/                # Flask backend
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── seed_data.py        # Sample data generator
│   └── requirements.txt    # Python dependencies
└── start.sh                # Startup script
```

## Authentication & Roles

For demonstration and testing purposes, the platform uses a simulated role-based authentication system:
- **Admin Access**: Log in with the email `admin@university.edu` to access the protected Admin Dashboard.
- **Normal User Access**: Log in with any other email address to explore the platform as a standard user.

## API Endpoints

### Events
- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/<id>` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/<id>` - Update event
- `DELETE /api/events/<id>` - Delete event

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get single user
- `POST /api/users` - Create new user

### Registrations
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create registration
- `DELETE /api/registrations/<id>` - Cancel registration

### Stats
- `GET /api/stats` - Get platform statistics

## Getting Started

### Prerequisites

### Installation

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/college_event.git
cd college_event
```

2. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Seed the database:
```bash
python3 seed_data.py
```

3. Start the Flask backend:
```bash
python3 app.py
```

4. The backend will run on `http://localhost:5000`

### Frontend Development

1. Install Node dependencies:
```bash
cd app
npm install
```

2. Start development server:
```bash
npm run dev
```

3. The frontend will run on `http://localhost:5173`

### Production Build

1. Build the frontend:
```bash
cd app
npm run build
```

2. The built files will be in `app/dist/`

## Database Schema

### Event
- id (Integer, Primary Key)
- title (String)
- description (Text)
- date (Date)
- start_time (Time)
- end_time (Time)
- location (String)
- category (String)
- image_url (String)
- organizer (String)
- contact_email (String)
- max_attendees (Integer)
- current_attendees (Integer)
- highlights (JSON)
- is_featured (Boolean)
- status (String)

### User
- id (Integer, Primary Key)
- student_id (String, Unique)
- first_name (String)
- last_name (String)
- email (String, Unique)
- phone (String)
- major (String)
- year (String)

### Registration
- id (Integer, Primary Key)
- event_id (Integer, Foreign Key)
- user_id (Integer, Foreign Key)
- registration_date (DateTime)
- status (String)
- notes (Text)

### Category
- id (Integer, Primary Key)
- name (String, Unique)
- description (String)
- icon (String)
- image_url (String)
- event_count (Integer)

## Design System

### Colors
- Primary Orange: `#ff8a01`
- Secondary Green: `#314c53`
- Background Gray: `#f3f3f3`
- Light Gray: `#f9f9fa`
- Dark Gray: `#afafaf`

### Typography
- Headings: Montserrat (700)
- Body: Inter (400, 500, 600)
