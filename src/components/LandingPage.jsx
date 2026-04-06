import React from 'react';

function LandingPage({ onEnter }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10 }}>
      
      <h1 style={{ fontSize: '6rem', fontWeight: '900', letterSpacing: '-3px', margin: 0, color: '#fff' }}>
        brain<span style={{ color: 'var(--accent)' }}>.exe</span>
      </h1>
      
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem', letterSpacing: '2px' }}>
        SYSTEM READY
      </p>

      <button onClick={onEnter} className="action-btn" style={{ marginTop: '4rem' }}>
        INITIALIZE_VAULT
      </button>

    </div>
  );
}

export default LandingPage;