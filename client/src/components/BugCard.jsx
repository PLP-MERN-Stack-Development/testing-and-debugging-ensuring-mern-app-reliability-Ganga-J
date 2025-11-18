import React from 'react';
import { Link } from 'react-router-dom';

const BugCard = ({ bug }) => {
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

  return (
    <div className="bug-card">
      <h3>{bug.title}</h3>
      <p>{bug.description.length > 100
        ? `${bug.description.substring(0, 100)}...`
        : bug.description}</p>
      <div style={{ marginBottom: '10px' }}>
        <span className={`bug-status ${getStatusClass(bug.status)}`}>
          {bug.status.replace('-', ' ')}
        </span>
        <span className={`bug-priority ${getPriorityClass(bug.priority)}`}>
          {bug.priority}
        </span>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>
        <p>Reporter: {bug.reporter}</p>
        {bug.assignee && <p>Assignee: {bug.assignee}</p>}
        <p>Created: {new Date(bug.createdAt).toLocaleDateString()}</p>
      </div>
      {bug.tags && bug.tags.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          {bug.tags.map(tag => (
            <span key={tag} style={{
              display: 'inline-block',
              backgroundColor: '#ecf0f1',
              color: '#2c3e50',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.8rem',
              marginRight: '5px',
              marginBottom: '5px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link to={`/bugs/${bug._id}`} className="btn">View Details</Link>
    </div>
  );
};

export default BugCard;
