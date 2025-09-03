const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    highPriority BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Helper function to promisify database operations
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// REST API Endpoints

// GET /api/todos - Fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await dbAll('SELECT * FROM todos ORDER BY created_at DESC');
    // Convert SQLite boolean integers to JavaScript booleans
    const formattedTodos = todos.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed),
      highPriority: Boolean(todo.highPriority)
    }));
    res.json(formattedTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, completed = false, highPriority = false } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await dbRun(
      'INSERT INTO todos (title, completed, highPriority) VALUES (?, ?, ?)',
      [title.trim(), completed ? 1 : 0, highPriority ? 1 : 0]
    );

    const newTodo = await dbGet('SELECT * FROM todos WHERE id = ?', [result.id]);
    const formattedTodo = {
      ...newTodo,
      completed: Boolean(newTodo.completed),
      highPriority: Boolean(newTodo.highPriority)
    };

    res.status(201).json(formattedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update an existing todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, highPriority } = req.body;

    // Check if todo exists
    const existingTodo = await dbGet('SELECT * FROM todos WHERE id = ?', [id]);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }
    if (highPriority !== undefined) {
      updates.push('highPriority = ?');
      params.push(highPriority ? 1 : 0);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await dbRun(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedTodo = await dbGet('SELECT * FROM todos WHERE id = ?', [id]);
    const formattedTodo = {
      ...updatedTodo,
      completed: Boolean(updatedTodo.completed),
      highPriority: Boolean(updatedTodo.highPriority)
    };

    res.json(formattedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun('DELETE FROM todos WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// DELETE /api/todos/completed - Clear all completed todos
app.delete('/api/todos/completed', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM todos WHERE completed = 1');
    res.json({ deletedCount: result.changes });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Failed to clear completed todos' });
  }
});

// PUT /api/todos/toggle-all - Toggle all todos completion state
app.put('/api/todos/toggle-all', async (req, res) => {
  try {
    const { completed } = req.body;
    
    await dbRun(
      'UPDATE todos SET completed = ?, updated_at = CURRENT_TIMESTAMP',
      [completed ? 1 : 0]
    );

    const todos = await dbAll('SELECT * FROM todos ORDER BY created_at DESC');
    const formattedTodos = todos.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed),
      highPriority: Boolean(todo.highPriority)
    }));

    res.json(formattedTodos);
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ error: 'Failed to toggle all todos' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TodoMVC API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TodoMVC API server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});