import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import BugList from '../../components/BugList';

const mockBugs = [
  {
    _id: '1',
    title: 'Bug 1',
    description: 'Description 1',
    status: 'open',
    priority: 'high',
    reporter: 'Reporter 1',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Bug 2',
    description: 'Description 2',
    status: 'resolved',
    priority: 'medium',
    reporter: 'Reporter 2',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BugList Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays bugs on mount', async () => {
    axios.get.mockResolvedValue({
      data: { bugs: mockBugs, total: 2, totalPages: 1, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/bugs?');
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Bug 2')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load bugs. Please try again.')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('filters bugs by status', async () => {
    axios.get.mockResolvedValueOnce({
      data: { bugs: mockBugs, total: 2, totalPages: 1, currentPage: 1 }
    }).mockResolvedValueOnce({
      data: { bugs: [mockBugs[0]], total: 1, totalPages: 1, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Statuses');
    fireEvent.change(statusFilter, { target: { value: 'open' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/bugs?status=open');
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.queryByText('Bug 2')).not.toBeInTheDocument();
    });
  });

  it('filters bugs by priority', async () => {
    axios.get.mockResolvedValueOnce({
      data: { bugs: mockBugs, total: 2, totalPages: 1, currentPage: 1 }
    }).mockResolvedValueOnce({
      data: { bugs: [mockBugs[0]], total: 1, totalPages: 1, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
    });

    const priorityFilter = screen.getByDisplayValue('All Priorities');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/bugs?priority=high');
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.queryByText('Bug 2')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no bugs found', async () => {
    axios.get.mockResolvedValue({
      data: { bugs: [], total: 0, totalPages: 0, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('No bugs found')).toBeInTheDocument();
      expect(screen.getByText('Report First Bug')).toBeInTheDocument();
    });
  });

  it('renders bug cards with correct information', async () => {
    axios.get.mockResolvedValue({
      data: { bugs: mockBugs, total: 2, totalPages: 1, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Reporter: Reporter 1')).toBeInTheDocument();
      expect(screen.getByText('open')).toHaveClass('status-open');
      expect(screen.getByText('high')).toHaveClass('priority-high');
    });
  });

  it('handles API response with different structure gracefully', async () => {
    axios.get.mockResolvedValue({
      data: { bugs: null, total: 0 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('No bugs found')).toBeInTheDocument();
    });
  });

  it('applies filters correctly in combination', async () => {
    axios.get.mockResolvedValueOnce({
      data: { bugs: mockBugs, total: 2, totalPages: 1, currentPage: 1 }
    }).mockResolvedValueOnce({
      data: { bugs: [mockBugs[0]], total: 1, totalPages: 1, currentPage: 1 }
    });

    renderWithRouter(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Statuses');
    const priorityFilter = screen.getByDisplayValue('All Priorities');

    fireEvent.change(statusFilter, { target: { value: 'open' } });
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/bugs?status=open&priority=high');
    });
  });
});
