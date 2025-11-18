import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BugCard from './BugCard';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  useEffect(() => {
    fetchBugs();
  }, [filters]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await axios.get(`/api/bugs?${params}`);
      setBugs(response.data.bugs);
      setError(null);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError('Failed to load bugs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchBugs} className="btn">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <h2>All Bugs</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {bugs.length === 0 ? (
        <div className="empty-state">
          <h2>No bugs found</h2>
          <p>There are no bugs matching your criteria.</p>
          <Link to="/bugs/new" className="btn">Report First Bug</Link>
        </div>
      ) : (
        <div className="bug-list">
          {bugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
