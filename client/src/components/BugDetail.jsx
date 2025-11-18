import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBug();
  }, [id]);

  const fetchBug = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bugs/${id}`);
      setBug(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bug:', err);
      setError('Failed to load bug details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await axios.delete(`/api/bugs/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting bug:', err);
        setError('Failed to delete bug');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'critical': return 'priority-critical';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading bug details...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchBug} className="btn">Retry</button>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="empty-state">
        <h2>Bug not found</h2>
        <p>The bug you're looking for doesn't exist.</p>
        <Link to="/" className="btn">Back to Bug List</Link>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ textAlign: 'left', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{bug.title}</h2>
        <div>
          <Link to={`/bugs/${id}/edit`} className="btn">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger" style={{ marginLeft: '10px' }}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span className={`bug-status ${getStatusClass(bug.status)}`}>
          {bug.status.replace('-', ' ')}
        </span>
        <span className={`bug-priority ${getPriorityClass(bug.priority)}`} style={{ marginLeft: '10px' }}>
          {bug.priority}
        </span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Description</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{bug.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4>Reporter</h4>
          <p>{bug.reporter}</p>
        </div>
        {bug.assignee && (
          <div>
            <h4>Assignee</h4>
            <p>{bug.assignee}</p>
          </div>
        )}
      </div>

      {bug.tags && bug.tags.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Tags</h4>
          <div>
            {bug.tags.map(tag => (
              <span key={tag} style={{
                display: 'inline-block',
                backgroundColor: '#ecf0f1',
                color: '#2c3e50',
                padding: '4px 8px',
                borderRadius: '4px',
                marginRight: '5px',
                marginBottom: '5px',
                fontSize: '0.9rem'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', color: '#7f8c8d', fontSize: '0.9rem' }}>
        <p>Created: {new Date(bug.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(bug.updatedAt).toLocaleString()}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/" className="btn btn-secondary">Back to Bug List</Link>
      </div>
    </div>
  );
};

export default BugDetail;
