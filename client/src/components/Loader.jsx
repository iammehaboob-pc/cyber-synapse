import React from 'react';

const Loader = ({ message = 'LOADING NEURAL LINK...' }) => {
  return (
    <div className="loader-container">
      <div className="scanner-ring"></div>
      <p 
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '0.85rem',
          color: 'var(--neon-cyan)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: '0.5rem'
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default Loader;
