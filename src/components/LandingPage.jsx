import React from 'react';

function LandingPage({ onEnter }) {
  return (
    <div className="editorial-wrapper">
      
      {/* GLASS NAVIGATION */}
      <nav className="editorial-nav">
        <div className="nav-logo">brain<span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>.exe</span></div>
        <button className="nav-btn" onClick={onEnter}>Initialize</button>
      </nav>

      {/* 1. THE MASTERPIECE HERO */}
      <header className="editorial-hero">
        <h1 className="hero-title animate-fade-up">
          Architect the <br/>
          <em>architecture</em> <br/>
          of your mind.
        </h1>
        <p className="hero-subtitle animate-fade-up animate-delay-1">
          Move beyond linear folders. A high-fidelity WebGL vault designed exclusively for those who think in <em>networks</em>, not lists.
        </p>
      </header>

      {/* 2. SECTION 01: GLASS ORB LAYOUT */}
      <section className="editorial-section">
        <div className="animate-fade-up">
          <span className="section-number">01 // Topology</span>
          <h2 className="section-title">See your thoughts <br/><em>in orbit.</em></h2>
          <p className="section-text">
            Every note you take is automatically mapped into a high-performance physics engine. Watch as clusters of knowledge naturally gravitate towards each other, revealing connections hidden in the noise.
          </p>
        </div>
        
        {/* The Glassdoor Visual */}
        <div className="glass-visual-container">
          <div className="glow-back"></div>
          <div className="glass-panel glass-floating-card"></div>
          <div className="glass-panel glass-floating-card" style={{ zIndex: 2 }}></div>
        </div>
      </section>

      {/* 3. SECTION 02: REVERSED */}
      <section className="editorial-section section-reverse">
        <div>
          <span className="section-number">02 // Capture</span>
          <h2 className="section-title">Frictionless <em>entry.</em></h2>
          <p className="section-text">
            A professional block-editor that gets out of your way. Summon powerful formatting, write native code, and weave bi-directional links—all without ever touching your mouse.
          </p>
        </div>
        
        {/* The Abstract Editor Visual */}
        <div className="glass-visual-container">
          <div className="glow-back" style={{ background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 60%)' }}></div>
          <div className="glass-panel glass-floating-card" style={{ width: '80%', display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1rem' }}>
            <div style={{ height: '2px', width: '30%', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ height: '10px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            <div style={{ height: '10px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            <div style={{ height: '20px', width: '40%', background: 'rgba(207,168,97,0.1)', border: '1px solid rgba(207,168,97,0.3)', marginTop: 'auto' }}></div>
          </div>
        </div>
      </section>

      {/* 4. THE GRAND FOOTER */}
      <section style={{ padding: '15rem 10vw', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 300, margin: '0 0 3rem 0' }}>
          Enter the <em>Vault.</em>
        </h2>
        <button 
          onClick={onEnter}
          style={{
            background: 'var(--accent)', color: '#000', border: 'none',
            padding: '1.2rem 4rem', fontSize: '0.9rem', letterSpacing: '2px',
            textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.3s', borderRadius: '2px'
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#fff'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'var(--accent)'; }}
        >
          Initialize System
        </button>
      </section>

    </div>
  );
}

export default LandingPage;