import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BugForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    reporter: '',
    assignee: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchBug();
    }
  }, [id, isEditing]);

  const fetchBug = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bugs/${id}`);
      const bug = response.data;
      setFormData({
        title: bug.title,
        description: bug.description,
        status: bug.status,
        priority: bug.priority,
        reporter: bug.reporter,
        assignee: bug.assignee || '',
        tags: bug.tags || []
      });
    } catch (err) {
      console.error('Error fetching bug:', err);
      setError('Failed to load bug data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await axios.put(`/api/bugs/${id}`, formData);
      } else {
        await axios.post('/api/bugs', formData);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving bug:', err);
      setError(err.response?.data?.message || 'Failed to save bug');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Loading bug data...</div>;
  }

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Bug' : 'Report New Bug'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength="1000"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reporter">Reporter *</label>
          <input
            type="text"
            id="reporter"
            name="reporter"
            value={formData.reporter}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button type="button" onClick={handleAddTag} className="btn btn-secondary">
              Add Tag
            </button>
          </div>
          <div>
            {formData.tags.map(tag => (
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
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    marginLeft: '5px',
                    background: 'none',
                    border: 'none',
                    color: '#e74c3c',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Saving...' : (isEditing ? 'Update Bug' : 'Report Bug')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
