import React, { useRef } from 'react';

const TiltCard = ({ children, className = '', containerStyle = {}, cardStyle = {} }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    cardRef.current.style.transform = `translateY(-10px) translateZ(40px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `translateY(0) translateZ(0) rotateX(0) rotateY(0)`;
  };

  return (
    <div 
      className={`dashboard-panel-container ${className}`} 
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dashboard-panel" ref={cardRef} style={cardStyle}>
        {children}
      </div>
    </div>
  );
};

// Common Inline Icon Component
const Icon = ({ path }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

function LandingPage({ onEnter }) {
  const tickerItems = [
    'Smart Auto-Linking', 'Markdown Support', 'Neural Copilot AI',
    'Interactive Flowcharts', 'Visual Mind Maps', 'Slash Commands',
    'Mermaid Diagrams', 'Block-Based Editing', 'Real-Time Sync',
    'Dark Mode Aesthetic', 'Contextual AI Search', 'Developer First'
  ];

  return (
    <div className="editorial-wrapper">
      
      {/* 0. GLASS NAVIGATION */}
      <nav className="editorial-nav">
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/puzzle.png" alt="logo" style={{ width: '20px', height: '20px', opacity: 0.9 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '2px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>2NDBRAIN</span>
        </div>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a 
            href="https://docs.uraj.dev/2ndbrain" 
            target="_blank" 
            rel="noreferrer"
            className="hide-on-mobile"
            style={{ 
              color: '#888', textDecoration: 'none', fontFamily: 'var(--font-sans)', 
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', 
              transition: 'color 0.3s ease', cursor: 'pointer' 
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
          >
            Explore Docs
          </a>
          <button className="nav-btn" onClick={onEnter}>INIT</button>
        </div>
      </nav>

      {/* 1. THE REFINED HERO SECTION */}
      <header className="editorial-hero">
        <div className="hero-content-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '4rem', marginTop: '5vh' }}>
          
          <div style={{ flex: 1, zIndex: 10 }}>
            <h1 className="hero-title animate-fade-up" style={{ margin: '0 0 1.5rem 0', fontSize: '4.2rem', lineHeight: '1.05' }}>
              Architect the <em>architecture</em> <br/>
              of your mind.
            </h1>
            <p className="hero-subtitle animate-fade-up animate-delay-1" style={{ maxWidth: '85%' }}>
              Move beyond linear folders. A high-fidelity workspace designed for developers who deal in <em>networks</em>, not lists.
            </p>
          </div>

          <div className="neural-network-visual animate-fade-up animate-delay-2 hide-on-mobile" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%', maxWidth: '550px', aspectRatio: '1/1', perspective: '1200px', transformStyle: 'preserve-3d' }}>
            {/* Ambient Background Glow */}
            <div style={{ position: 'absolute', width: '400px', height: '400px', filter: 'blur(100px)', opacity: 0.3, background: 'radial-gradient(circle, rgba(207,168,97,0.5) 0%, transparent 70%)', transform: 'translateZ(-100px)' }}></div>
            
            {/* 3D Glass Brain Image - Static */}
            <img 
              src="/hero-brain.jpg" 
              alt="3D Glass Brain" 
              style={{ 
                position: 'absolute', 
                width: '65%', 
                height: '65%', 
                objectFit: 'contain',
                mixBlendMode: 'screen',
                WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)',
                maskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)',
                transform: 'translateZ(0)'
              }} 
            />
            
            {/* React-like 3D Orbits */}
            <div className="react-orbit" style={{ '--ry': '0deg', '--dur': '8s' }}>
              <div className="electron" style={{ '--hide-delay': '0s' }}></div>
            </div>
            <div className="react-orbit" style={{ '--ry': '60deg', '--dur': '12s' }}>
              <div className="electron" style={{ background: 'var(--accent)', '--hide-delay': 'calc(var(--dur) * -0.83)' }}></div>
            </div>
            <div className="react-orbit" style={{ '--ry': '120deg', '--dur': '10s' }}>
              <div className="electron" style={{ '--hide-delay': 'calc(var(--dur) * -0.67)' }}></div>
            </div>

            <style>
              {`
                .react-orbit {
                  position: absolute;
                  top: 0; left: 0; right: 0; bottom: 0;
                  margin: auto;
                  width: 90%; height: 90%;
                  border: 1px solid rgba(207, 168, 97, 0.15);
                  border-radius: 50%;
                  transform-style: preserve-3d;
                  animation: spin-orbit var(--dur) linear infinite;
                }

                @keyframes spin-orbit {
                  0% { transform: rotateY(var(--ry)) rotateX(75deg) rotateZ(0deg); }
                  100% { transform: rotateY(var(--ry)) rotateX(75deg) rotateZ(360deg); }
                }

                .electron {
                  position: absolute;
                  top: -6px; left: calc(50% - 6px);
                  width: 12px; height: 12px;
                  background: #fff;
                  border-radius: 50%;
                  box-shadow: 0 0 20px 8px rgba(207, 168, 97, 0.8);
                  animation: 
                    counter-spin var(--dur) linear infinite,
                    fade-electron var(--dur) linear infinite var(--hide-delay);
                }

                @keyframes counter-spin {
                  0% { transform: rotateZ(0deg) rotateX(-75deg) rotateY(calc(-1 * var(--ry))); }
                  100% { transform: rotateZ(-360deg) rotateX(-75deg) rotateY(calc(-1 * var(--ry))); }
                }

                @keyframes fade-electron {
                  0% { opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { opacity: 0; }
                }
              `}
            </style>
          </div>
        </div>
      </header>

      {/* ✦ NEW: GOLD SCROLLING TICKER MARQUEE */}
      <div className="ticker-marquee">
        <div className="ticker-content">
          {[...tickerItems, ...tickerItems].map((item, index) => (
             <div key={index} className="ticker-item">{item}</div>
          ))}
        </div>
      </div>

      {/* 2. THE EDITORIAL BODY */}
      
      {/* SECTION 01: TOPOLOGY -> VISUAL GRAPH */}
      <section className="panel-grid-section">
        <div className="cyber-grid-bg"></div>
        
        <div className="animate-fade-up section-header-wrap" style={{ zIndex: 10, position: 'relative' }}>
          <span className="cyber-header" style={{ marginBottom: '0.5rem' }}>01 // The Graph</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 300, color: '#fff', margin: '0 0 1rem 0' }} className="responsive-h2">
            See your thoughts <br/><em>in orbit.</em>
          </h2>
          <p className="section-text section-text-bordered" style={{ maxWidth: '60%', borderLeft: '1px solid var(--accent)', paddingLeft: '2rem' }}>
            Your notes shouldn't sit in isolated folders. Watch concepts automatically gravitate towards each other, revealing hidden connections in a <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>densely interconnected</span> visual mind map.
          </p>
        </div>
        
        {/* Visual Panel */}
        <div className="glass-visual-container responsive-glass-container" style={{ margin: 0, height: '400px' }}>
          <div className="glow-back" style={{ top: '60%', left: '70%', background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 60%)' }}></div>
          <TiltCard containerStyle={{ width: '90%' }} cardStyle={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div className="responsive-card-content" style={{ color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div>[[ System Architecture ]]</div>
               <div>↪ linked to: [[ Database Schema ]]</div>
               <div>↪ referenced by: 3 unlinked mentions</div>
               <div className="long-text-wrap" style={{ opacity: 0.2, marginTop: '2rem' }}>[ Current Project ] ----------→ [ Bug Fixes ]</div>
               <div style={{ opacity: 0.1 }}> ↓ </div>
               <div style={{ opacity: 0.05 }}> [ Meeting Notes ] </div>
             </div>
          </TiltCard>
        </div>
      </section>

      {/* SECTION 02: CAPTURE -> AI COPILOT */}
      <section className="panel-grid-section">
        <div className="animate-fade-up section-header-wrap align-right" style={{ zIndex: 10, position: 'relative', textAlign: 'right' }}>
          <span className="cyber-header" style={{ marginBottom: '0.5rem', justifyContent: 'flex-end' }}>02 // AI Copilot</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 300, color: '#fff', margin: '0 0 1rem 0' }} className="responsive-h2">
            Intelligence on <em>demand.</em>
          </h2>
          <p className="section-text section-text-bordered-right" style={{ marginLeft: 'auto', borderRight: '1px solid var(--accent)', paddingRight: '2rem', maxWidth: '60%' }}>
            Type `/ai` to summon the Neural Copilot. Ask it to summarize complex documents, format your code blocks, or instantly generate <span style={{color: 'var(--highlight-gold)', fontWeight: 'bold'}}>interactive flowcharts</span> from thin air.
          </p>
        </div>
        
        {/* Visual Panel */}
        <div className="glass-visual-container responsive-glass-container" style={{ margin: 0, height: '400px', gridColumn: '1 / 2' }}>
          <div className="glow-back" style={{ top: '30%', left: '20%', background: 'radial-gradient(circle at center, rgba(207, 168, 97, 0.1) 0%, transparent 60%)' }}></div>
          <TiltCard containerStyle={{ width: '90%' }} cardStyle={{ position: 'relative', height: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div className="responsive-card-content" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>$ /generate diagram for authentication flow</div>
            
            {/* Pure CSS Diagram */}
            <div className="pure-css-diagram-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', transform: 'scale(0.85)' }}>
                <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem', color: '#ccc', fontFamily: 'var(--font-mono)' }}>[Client]</div>
                <div style={{ color: 'rgba(255,255,255,0.2)' }}>→</div>
                <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(207,168,97,0.05)', border: '1px solid var(--accent)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', boxShadow: '0 0 15px rgba(207,168,97,0.1)' }}>[Auth API]</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ color: 'rgba(255,255,255,0.2)' }}>↗</div>
                     <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem', color: '#ccc', fontFamily: 'var(--font-mono)' }}>[Database]</div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ color: 'rgba(255,255,255,0.2)' }}>↘</div>
                     <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem', color: '#ccc', fontFamily: 'var(--font-mono)' }}>[App State]</div>
                   </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ✦ NEW: THE ANATOMY OF THOUGHT */}
      <section className="panel-grid-section">
        <div className="cyber-grid-bg"></div>

        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 300, color: '#fff', margin: '0 0 3rem 0' }} className="responsive-h2-sm">
            The <em>Features.</em>
          </h2>
        </div>

        {/* Triple Panel Layout */}
        <div className="panel-row">
          
          <TiltCard>
            <span className="dashboard-panel-number">01</span>
            <h3 className="dashboard-panel-title">Visual <em>Mind Maps</em></h3>
            <p className="dashboard-panel-text">
              Ideas don't exist in a vacuum. Every note is automatically woven into a visual web of links, giving you a bird's-eye view of your entire project landscape.
            </p>
          </TiltCard>

          <TiltCard>
            <span className="dashboard-panel-number">02</span>
            <h3 className="dashboard-panel-title">Block-Based <em>Editor</em></h3>
            <p className="dashboard-panel-text">
              A professional block-editor that gets out of your way. Summon powerful formatting, write native code, and weave links—all without ever touching your mouse.
            </p>
          </TiltCard>

          <TiltCard className="panel-span-2">
            <span className="dashboard-panel-number">03</span>
            <h3 className="dashboard-panel-title">Smart <em>Auto-Linking</em></h3>
            <p className="dashboard-panel-text">
              Type naturally. The editor scans your text in real-time and subtly suggests connections to existing notes, turning fleeting thoughts into highly-linkable concepts.
            </p>
          </TiltCard>

        </div>
      </section>

      {/* ✦ NEW: THE WORKFLOW */}
      <section className="workflow-section">
        <div className="cyber-grid-bg"></div>

        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 300, color: '#fff', margin: '0 0 5rem 0' }} className="responsive-h2-sm">
            The <em>Workflow.</em>
          </h2>
        </div>

        <div className="workflow-step">
          <span className="workflow-num">I.</span>
          <div>
            <h3 className="workflow-step-title">Write Without Friction</h3>
            <p className="workflow-step-text">
              Use slash commands to quickly insert headings, lists, code blocks, and images. Drop raw text and terminal outputs into the editor and format it later.
            </p>
          </div>
        </div>

        <div className="workflow-step">
          <span className="workflow-num">II.</span>
          <div>
            <h3 className="workflow-step-title">Generate Diagrams with AI</h3>
            <p className="workflow-step-text">
              Stop fighting with charting software. Ask the Neural Copilot to map out your database schema, and watch it generate interactive Mermaid diagrams in <span style={{color: 'var(--accent)'}}>seconds</span>.
            </p>
          </div>
        </div>

        <div className="workflow-step">
          <span className="workflow-num">III.</span>
          <div>
            <h3 className="workflow-step-title">Connect & <em>Synthesize</em></h3>
            <p className="workflow-step-text">
              Link your notes using double brackets `[[ ]]`. Jump into the visual graph to explore how your API documentation connects to your frontend components.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE GRAND FINAL CTA */}
      <section className="cta-section">
        <div className="cyber-grid-bg"></div>
        
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '7rem', fontWeight: 300, color: '#fff', margin: '0 0 5rem 0' }} className="responsive-h2-lg">
          Stop <em>Forgetting.</em>
        </h2>
        
        <button 
          onClick={onEnter}
          className="cta-btn"
          style={{
            background: 'var(--accent)', color: '#000', border: 'none',
            padding: '1.2rem 4rem', fontSize: '0.9rem', letterSpacing: '2px',
            textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.3s', borderRadius: '2px',
            position: 'relative', zIndex: 20
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#fff'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'var(--accent)'; }}
        >
          Initialize Your Brain
        </button>
      </section>

      {/* 4. THE GRAND FOOTER */}
      <footer style={{ background: '#000', borderTop: '1px solid #1a1a1a', color: '#444', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 10 }}>
         <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', lineHeight: '1.8' }}>
           SYSTEM.v2.0 // DEVELOPER WORKSPACE // BUILT FOR SPEED // MADE WITH ❤️ BY YUVRAJ SHRIRAME <br/> <a 
             href="https://docs.uraj.dev/2ndbrain" 
             target="_blank" 
             rel="noreferrer"
             style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s ease', borderBottom: '1px solid #444' }}
             onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.borderBottom = '1px solid #fff'; }}
             onMouseLeave={(e) => { e.target.style.color = '#444'; e.target.style.borderBottom = '1px solid #444'; }}
           >
             EXPLORE DOCUMENTATION
           </a>
         </div>
      </footer>

    </div>
  );
}

export default LandingPage;