import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders seeded tasks after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Set up the monorepo', done: true }]
    });

    render(<App />);

    expect(await screen.findByText('Set up the monorepo')).toBeInTheDocument();
  });

  it('shows an error when loading tasks fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 500 });

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load tasks');
  });

  it('adds a task via the form', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, title: 'Write more tests', done: false })
      });

    render(<App />);
    await waitFor(() => expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument());

    await user.type(screen.getByLabelText('New task title'), 'Write more tests');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Write more tests')).toBeInTheDocument();
  });
});
