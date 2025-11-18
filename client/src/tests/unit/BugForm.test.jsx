import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import BugForm from '../../components/BugForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BugForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithRouter(<BugForm />);

    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('displays "Report New Bug" heading for new bug', () => {
    renderWithRouter(<BugForm />);

    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    renderWithRouter(<BugForm />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);

    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput.value).toBe('Test Bug');
    expect(descriptionInput.value).toBe('Test Description');
  });

  it('adds and removes tags', () => {
    renderWithRouter(<BugForm />);

    const tagInput = screen.getByPlaceholderText('Add a tag');
    const addButton = screen.getByText('Add Tag');

    fireEvent.change(tagInput, { target: { value: 'frontend' } });
    fireEvent.click(addButton);

    expect(screen.getByText('frontend')).toBeInTheDocument();

    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);

    expect(screen.queryByText('frontend')).not.toBeInTheDocument();
  });

  it('prevents adding duplicate tags', () => {
    renderWithRouter(<BugForm />);

    const tagInput = screen.getByPlaceholderText('Add a tag');
    const addButton = screen.getByText('Add Tag');

    fireEvent.change(tagInput, { target: { value: 'duplicate' } });
    fireEvent.click(addButton);
    fireEvent.change(tagInput, { target: { value: 'duplicate' } });
    fireEvent.click(addButton);

    expect(screen.getAllByText('duplicate')).toHaveLength(1);
  });

  it('submits form data correctly for new bug', async () => {
    axios.post.mockResolvedValue({ data: { _id: '1' } });

    renderWithRouter(<BugForm />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);
    const reporterInput = screen.getByLabelText(/reporter \*/i);
    const submitButton = screen.getByText('Report Bug');

    fireEvent.change(titleInput, { target: { value: 'New Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Bug Description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/bugs', {
        title: 'New Bug',
        description: 'Bug Description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe',
        assignee: '',
        tags: []
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on submission failure', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Validation failed' } }
    });

    renderWithRouter(<BugForm />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);
    const reporterInput = screen.getByLabelText(/reporter \*/i);
    const submitButton = screen.getByText('Report Bug');

    fireEvent.change(titleInput, { target: { value: 'New Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Bug Description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    });
  });

  it('navigates back on cancel', () => {
    renderWithRouter(<BugForm />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('disables submit button during loading', async () => {
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithRouter(<BugForm />);

    const titleInput = screen.getByLabelText(/title \*/i);
    const descriptionInput = screen.getByLabelText(/description \*/i);
    const reporterInput = screen.getByLabelText(/reporter \*/i);
    const submitButton = screen.getByText('Report Bug');

    fireEvent.change(titleInput, { target: { value: 'New Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Bug Description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });
});
