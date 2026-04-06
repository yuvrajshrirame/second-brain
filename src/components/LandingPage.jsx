import React from 'react';

function LandingPage({ onEnter }) {
  return (
    <div style={{ overflowY: 'auto', height: '100vh', width: '100vw' }}>
      
      {/* HERO SECTION */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: '900', letterSpacing: '-3px', margin: 0, color: '#fff' }}>
          brain<span style={{ color: 'var(--accent)' }}>.exe</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', letterSpacing: '2px', fontFamily: 'monospace' }}>
          SCROLL DOWN OR INITIALIZE
        </p>
        <button onClick={onEnter} className="action-btn" style={{ marginTop: '4rem' }}>
          INITIALIZE_VAULT
        </button>
      </div>

      {/* FEATURE GRID SECTION */}
      <div className="feature-section">
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', borderBottom: '1px solid #222', paddingBottom: '1rem', fontFamily: 'sans-serif' }}>
          System Architecture.
        </h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div style={{ color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '1rem' }}>01 / GRAPH ENGINE</div>
            <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontFamily: 'sans-serif' }}>Neural Topology</h3>
            <p style={{ color: '#888', margin: 0, lineHeight: '1.6' }}>
              Navigate your knowledge base through a high-performance WebGL environment. Visualize the connections between your thoughts instantly.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '1rem' }}>02 / CLOUD SYNC</div>
            <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontFamily: 'sans-serif' }}>Infinite Storage</h3>
            <p style={{ color: '#888', margin: 0, lineHeight: '1.6' }}>
              Built on Google Firebase infrastructure. Every keystroke is saved and synced across your network with zero latency.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '1rem' }}>03 / BLOCK EDITOR</div>
            <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontFamily: 'sans-serif' }}>Frictionless Capture</h3>
            <p style={{ color: '#888', margin: 0, lineHeight: '1.6' }}>
              A professional-grade, Notion-style text editor. Hit the slash key to instantly format thoughts, write code, and build bi-directional links.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default LandingPage;