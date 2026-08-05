import { useEffect, useState } from 'react';
import { fetchTasks, createTask } from './api.js';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await createTask(title.trim());
      setTasks((current) => [...current, task]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <h1>Task Tracker</h1>
      <p className="subtitle">Fictive demo app for the GitHub Actions workshop</p>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a new task"
          aria-label="New task title"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p role="alert" className="error">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'done' : ''}>
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
