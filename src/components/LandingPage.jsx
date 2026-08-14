import React from 'react';

// Common Inline Icon Component
const Icon = ({ path }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

function LandingPage({ onEnter }) {
  // Master list of concepts for the scrolling ticker (image 4 inspiration)
  const tickerItems = [
    'Bi-Directional Linking', 'Zettelkasten Methodology', 'Dynamic Ontologies',
    'Algorithmic Surfacing', 'Fluid Capture', 'Spaced Repetition',
    'Graph Visualization', 'Immutable Context', 'Deep Synthesis',
    'Non-Linear Thinking', 'Augmented Cognition', 'Neural Mapping',
    'Progressive Summarization', 'Second Brain Protocol'
  ];

  return (
    <div className="editorial-wrapper">
      
      {/* 0. GLASS NAVIGATION (Modified + Extended) */}
      <nav className="editorial-nav">
        <div className="nav-logo"><span style={{ color: 'var(--accent)'}}>2nd</span>Brain</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a 
            href="https://docs.uraj.dev/2ndbrain" 
            target="_blank" 
            rel="noreferrer"
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
          <button className="nav-btn" onClick={onEnter}>Initialize</button>
        </div>
      </nav>

      {/* 1. THE REFINED HERO SECTION */}
      <header className="editorial-hero">
        {/* User request: title clamp smaller from v1.4, still serif */}
        <h1 className="hero-title animate-fade-up">
          Architect the <br/>
          <em>architecture</em> <br/>
          of your mind.
        </h1>
        <p className="hero-subtitle animate-fade-up animate-delay-1">
          Move beyond linear folders. A high-fidelity neural vault designed exclusively for those who deal in <em>networks</em>, not lists.
        </p>
      </header>

      {/* ✦ NEW: GOLD SCROLLING TICKER MARQUEE (Image 4 inspiration) */}
      <div className="ticker-marquee">
        <div className="ticker-content">
          {[...tickerItems, ...tickerItems].map((item, index) => (
             <div key={index} className="ticker-item">{item}</div>
          ))}
        </div>
      </div>

      {/* 2. THE EDITORIAL BODY (Modified with dashboard panel styles from Image 5) */}
      
      {/* SECTION 01: TOPOLOGY */}
      <section className="panel-grid-section">
        <div className="cyber-grid-bg"></div> {/* Subtle background grid texture */}
        
        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative' }}>
          {/* Gold number subtitle style (image 5) */}
          <span className="cyber-header" style={{ marginBottom: '0.5rem' }}>01 // Topology</span>
          {/* Main title serif from inspire image 4/9 */}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 300, color: '#fff', margin: '0 0 1rem 0' }}>
            See your thoughts <br/><em>in orbit.</em>
          </h2>
          <p className="section-text" style={{ maxWdth: '60%', borderLeft: '1px solid var(--accent)', paddingLeft: '2rem' }}>
            Your biology is a processor, not a hard drive. Watch clusters of knowledge gravitate towards each other, revealing connections hidden in the noise of <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>densely interconnected</span> intellectual life.
          </p>
        </div>
        
        {/* Visual Panel (Original Layout + modified visual) */}
        <div className="glass-visual-container" style={{ margin: 0, height: '400px' }}>
          <div className="glow-back" style={{ top: '60%', left: '70%', background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 60%)' }}></div>
          {/* Dashboard-style panel wrapper (image 6) */}
          <div className="dashboard-panel" style={{ position: 'relative', width: '90%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Abstract Zettelkasten Linked Nodes visual (image 6) */}
             <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div>[[ Information Architecture ]]</div>
               <div>↪ linked to: [[ Cognitive Load ]]</div>
               <div>↪ referenced by: 3 unlinked mentions</div>
               <div style={{ opacity: 0.2, marginTop: '2rem' }}>[ Current Node ] ----------→ [ Emerging Idea ]</div>
               <div style={{ opacity: 0.1 }}> ↓ </div>
               <div style={{ opacity: 0.05 }}> [ Historical Context ] </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: CAPTURE */}
      <section className="panel-grid-section">
        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative', textAlign: 'right' }}>
          <span className="cyber-header" style={{ marginBottom: '0.5rem' }}>02 // Capture</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 300, color: '#fff', margin: '0 0 1rem 0' }}>
            Zero-Friction <em>entry.</em>
          </h2>
          <p className="section-text" style={{ marginLeft: 'auto', borderRight: '1px solid var(--accent)', paddingRight: '2rem' }}>
            semantic search doesn't just match keywords; it understands the <span style={{color: 'var(--highlight-gold)', fontWeight: 'bold'}}>intent</span> behind your scattered thoughts. Capture raw text andCategorize it later. Drop FLEETING thoughts into the daily inbox immediately.
          </p>
        </div>
        
        {/* Visual Panel */}
        <div className="glass-visual-container" style={{ margin: 0, height: '400px', gridColumn: '1 / 2' }}>
          <div className="glow-back" style={{ top: '30%', left: '20%', background: 'radial-gradient(circle at center, rgba(207, 168, 97, 0.1) 0%, transparent 60%)' }}></div>
          {/* Dashboard-style panel wrapper (image 6) */}
          <div className="dashboard-panel" style={{ position: 'relative', width: '90%', height: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '3rem' }}>
            <div style={{ height: '2px', width: '30%', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            <div style={{ height: '12px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            <div style={{ height: '24px', width: '40%', background: 'rgba(207,168,97,0.1)', border: '1px solid rgba(207,168,97,0.3)', marginTop: 'auto' }}></div>
          </div>
        </div>
      </section>

      {/* ✦ NEW: THE ANATOMY OF THOUGHT (Panel Grid from Image 5) */}
      <section className="panel-grid-section">
        <div className="cyber-grid-bg"></div>

        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative' }}>
          {/* Inspired title from Image 5 */}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 300, color: '#fff', margin: '0 0 3rem 0' }}>
            The <em>Anatomy</em> of Thought.
          </h2>
        </div>

        {/* Triple Panel Layout */}
        <div className="panel-row">
          
          <div className="dashboard-panel">
            <span className="dashboard-panel-number">01</span>
            <h3 className="dashboard-panel-title">The <em>Knowledge</em> Graph</h3>
            <p className="dashboard-panel-text">
              Ideas don't exist in a vacuum. Every note, quote, and thought is automatically woven into a visual web of bi-directional links. Watch understanding compound over time.
            </p>
          </div>

          <div className="dashboard-panel">
            <span className="dashboard-panel-number">02</span>
            <h3 className="dashboard-panel-title">Zero-Friction <em>Capture</em></h3>
            <p className="dashboard-panel-text">
              A professional block-editor that gets out of your way. Summon powerful formatting, write native code, and weave links—all without ever touching your mouse.
            </p>
          </div>

          <div className="dashboard-panel" style={{ gridColumn: '1 / 3' }}>
            <span className="dashboard-panel-number">03</span>
            <h3 className="dashboard-panel-title">Dynamic <em>Ontology</em></h3>
            <p className="dashboard-panel-text">
              Transform fleeting notes into permanent wisdom. Designed specifically for the ruthless distillation of information into atomic, highly-linkable concepts. Designed for Spaced Repetition and Fluid capture.
            </p>
          </div>

        </div>
      </section>

      {/* ✦ NEW: THE WORKFLOW (Step Linear Layout from Image 7/8) */}
      <section className="workflow-section">
        <div className="cyber-grid-bg"></div>

        <div className="animate-fade-up" style={{ zIndex: 10, position: 'relative' }}>
          {/* Inspired title from Image 7 */}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 300, color: '#fff', margin: '0 0 5rem 0' }}>
            The <em>Workflow.</em>
          </h2>
        </div>

        {/* Step I: Roman numeral (image 7) */}
        <div className="workflow-step">
          <span className="workflow-num">I.</span>
          <div>
            <h3 className="workflow-step-title">Capture everything</h3>
            <p className="workflow-step-text">
              Semantic search understands the ruthless distillation of information intent behind your scattered thoughts. free your working memory. Drop raw text, terminal output, and URLs into the daily inbox.
            </p>
          </div>
        </div>

        {/* Step II: Roman numeral (image 7) */}
        <div className="workflow-step">
          <span className="workflow-num">II.</span>
          <div>
            <h3 className="workflow-step-title">Progressive Summarization</h3>
            <p className="workflow-step-text">
              Bold the main points. highlight the core thesis. Leave breadcrumbs for your future self so you can grasp the essence of a 10,000-word document in <span style={{color: 'var(--accent)'}}>30 seconds</span>. Categorize it later. 
            </p>
          </div>
        </div>

        {/* Step III: Roman numeral (image 8) */}
        <div className="workflow-step">
          <span className="workflow-num">III.</span>
          <div>
            <h3 className="workflow-step-title">Network & <em>Synthesize</em></h3>
            <p className="workflow-step-text">
              Link your notes together. This is where the brain thinks. find the <span style={{color: 'var(--accent)'}}>hidden collision</span> between a philosophy quote you saved in 2023 and a system architecture pattern you learned today. engineered for deep synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE GRAND FINAL CTA (Modified title/button from Inspire Image 4/9) */}
      <section style={{ padding: '8rem 5vw 10rem 5vw', textAlign: 'center', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
        <div className="cyber-grid-bg"></div>
        
        {/* Inspired title from Image 9 */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '7rem', fontWeight: 300, color: '#fff', margin: '0 0 5rem 0' }}>
          Stop <em>Forgetting.</em>
        </h2>
        
        {/* Button Text Inspired by image 4 */}
        <button 
          onClick={onEnter}
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

      {/* 4. THE GRAND FOOTER (Minimal mono style from Image 9) */}
      <footer style={{ background: '#000', borderTop: '1px solid #1a1a1a', color: '#444', textAlign: 'center', padding: '1rem', position: 'relative', zIndex: 10 }}>
         <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px' }}>
           SYSTEM.v2.0 // COGNITIVE ARCHITECTURE // DESIGNED FOR FOCUS // MADE WITH ❤️ BY YUVRAJ SHRIRAME // <a 
             href="https://docs.uraj.dev/2ndbrain" 
             target="_blank" 
             rel="noreferrer"
             style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s ease' }}
             onMouseEnter={(e) => e.target.style.color = '#fff'}
             onMouseLeave={(e) => e.target.style.color = '#444'}
           >
             EXPLORE DOCUMENTATION
           </a>
         </div>
      </footer>

    </div>
  );
}

export default LandingPage;