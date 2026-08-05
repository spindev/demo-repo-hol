import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('GET /api/tasks returns seeded tasks', async () => {
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 3);
});

test('POST /api/tasks requires a title', async () => {
  const res = await request(app).post('/api/tasks').send({});
  assert.equal(res.status, 400);
});

test('POST /api/tasks creates a task', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'New task' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'New task');
  assert.equal(res.body.done, false);
});

test('unknown routes return 404', async () => {
  const res = await request(app).get('/api/nope');
  assert.equal(res.status, 404);
});
