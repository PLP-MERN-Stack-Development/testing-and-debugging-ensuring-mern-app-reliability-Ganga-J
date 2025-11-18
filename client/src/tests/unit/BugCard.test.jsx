import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugCard from '../../components/BugCard';

const mockBug = {
  _id: '1',
  title: 'Test Bug Title',
  description: 'This is a test bug description that should be truncated',
  status: 'open',
  priority: 'high',
  reporter: 'John Doe',
  assignee: 'Jane Smith',
  tags: ['frontend', 'urgent'],
  createdAt: '2023-01-01T00:00:00.000Z'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BugCard Component', () => {
  it('renders bug information correctly', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    expect(screen.getByText('Test Bug Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test bug description that should be truncated')).toBeInTheDocument();
    expect(screen.getByText('Reporter: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Assignee: Jane Smith')).toBeInTheDocument();
  });

  it('displays truncated description for long descriptions', () => {
    const longDescription = 'a'.repeat(150);
    const bugWithLongDesc = { ...mockBug, description: longDescription };

    renderWithRouter(<BugCard bug={bugWithLongDesc} />);

    const descriptionElement = screen.getByText(`${'a'.repeat(100)}...`);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('applies correct status class', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    const statusElement = screen.getByText('open');
    expect(statusElement).toHaveClass('status-open');
  });

  it('applies correct priority class', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    const priorityElement = screen.getByText('high');
    expect(priorityElement).toHaveClass('priority-high');
  });

  it('renders tags when present', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('does not render assignee section when assignee is not present', () => {
    const bugWithoutAssignee = { ...mockBug, assignee: '' };
    renderWithRouter(<BugCard bug={bugWithoutAssignee} />);

    expect(screen.queryByText('Assignee:')).not.toBeInTheDocument();
  });

  it('renders creation date', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    expect(screen.getByText('Created: 1/1/2023')).toBeInTheDocument();
  });

  it('renders View Details link', () => {
    renderWithRouter(<BugCard bug={mockBug} />);

    const linkElement = screen.getByRole('link', { name: /view details/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/bugs/1');
  });

  it('handles different status values', () => {
    const statuses = ['open', 'in-progress', 'resolved', 'closed'];

    statuses.forEach(status => {
      const bugWithStatus = { ...mockBug, status };
      const { rerender } = renderWithRouter(<BugCard bug={bugWithStatus} />);

      const statusElement = screen.getByText(status.replace('-', ' '));
      expect(statusElement).toHaveClass(`status-${status}`);

      rerender(
        <BrowserRouter>
          <BugCard bug={{ ...bugWithStatus, status: statuses[(statuses.indexOf(status) + 1) % statuses.length] }} />
        </BrowserRouter>
      );
    });
  });

  it('handles different priority values', () => {
    const priorities = ['low', 'medium', 'high', 'critical'];

    priorities.forEach(priority => {
      const bugWithPriority = { ...mockBug, priority };
      renderWithRouter(<BugCard bug={bugWithPriority} />);

      const priorityElement = screen.getByText(priority);
      expect(priorityElement).toHaveClass(`priority-${priority}`);
    });
  });
});
