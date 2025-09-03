# TodoMVC Angular with SQLite Backend

This is a full-stack TodoMVC application built with Angular frontend and Node.js + Express + SQLite backend.

## Features

- ✅ Persistent SQLite database storage
- 🔄 Real-time UI updates
- 🚩 High priority todo support
- 📱 Mobile-first responsive design
- 🌐 RESTful API endpoints
- ⚡ Error handling and fallback states

## Quick Start

### Option 1: Run Everything (Recommended)
```bash
npm run fullstack
```

This will start both the backend (port 3000) and frontend (port 4200) automatically.

### Option 2: Run Separately

1. **Start Backend:**
```bash
npm run backend
```

2. **Start Frontend (in another terminal):**
```bash
npm start
```

## API Endpoints

The backend exposes the following REST API endpoints:

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update an existing todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos/completed` - Clear all completed todos
- `PUT /api/todos/toggle-all` - Toggle all todos completion state
- `GET /api/health` - Health check endpoint

## Database Schema

The SQLite database (`backend/db.sqlite`) contains a `todos` table with the following structure:

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  highPriority BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
examples/angular/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── todos.service.ts    # HTTP-based service
│   │   ├── header/             # Todo input component
│   │   ├── todo-item/          # Individual todo component
│   │   ├── todo-list/          # Todo list component
│   │   └── footer/             # Filters and actions
│   └── styles.css              # TailwindCSS imports
├── backend/                # Node.js + Express backend
│   ├── server.js              # Express server with API routes
│   ├── package.json           # Backend dependencies
│   └── db.sqlite              # SQLite database (auto-created)
├── tailwind.config.js         # Tailwind configuration
└── start-fullstack.sh         # Startup script for both services
```

## Technology Stack

**Frontend:**
- Angular 17 (Standalone Components)
- TailwindCSS 3 (Futuristic dark theme)
- RxJS for reactive state management
- Iconify for modern icons

**Backend:**
- Node.js + Express
- SQLite3 for database
- CORS enabled for frontend communication

## Development

- Frontend runs on `http://localhost:4200`
- Backend API runs on `http://localhost:3000`
- Database file is automatically created at `backend/db.sqlite`

## Error Handling

If the backend is not running, the frontend will display an error banner and gracefully handle the offline state.