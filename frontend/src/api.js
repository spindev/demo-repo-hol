const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to load tasks: ${res.status}`);
  }
  return res.json();
}

export async function createTask(title) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.status}`);
  }
  return res.json();
}
