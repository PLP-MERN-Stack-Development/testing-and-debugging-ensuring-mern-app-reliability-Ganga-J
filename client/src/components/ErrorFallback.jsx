import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>
        Oops! Something went wrong
      </h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px', maxWidth: '500px' }}>
        We're sorry, but an unexpected error occurred. This has been logged and our team will look into it.
      </p>
      <details style={{ marginBottom: '20px', textAlign: 'left', maxWidth: '500px' }}>
        <summary style={{ cursor: 'pointer', color: '#2c3e50' }}>
          Error Details (for developers)
        </summary>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          overflow: 'auto',
          marginTop: '10px'
        }}>
          {error.message}
          {error.stack && (
            <>
              {'\n\n'}
              {error.stack}
            </>
          )}
        </pre>
      </details>
      <button
        onClick={resetErrorBoundary}
        className="btn"
        style={{ marginRight: '10px' }}
      >
        Try Again
      </button>
      <button
        onClick={() => window.location.href = '/'}
        className="btn btn-secondary"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorFallback;
