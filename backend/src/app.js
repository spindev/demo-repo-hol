import express from 'express';

// in-memory seed data, resets on every restart - good enough for a demo
const tasks = [
  { id: 1, title: 'Set up the monorepo', done: true },
  { id: 2, title: 'Write the CI workflow', done: false },
  { id: 3, title: 'Enable code scanning', done: false }
];

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/tasks', (_req, res) => {
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { title } = req.body ?? {};
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required' });
    }
    const task = { id: tasks.length + 1, title, done: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  return app;
}
