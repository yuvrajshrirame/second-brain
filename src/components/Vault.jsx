import React from 'react';
import GraphEngine from './GraphEngine';
import BlockEditor from './BlockEditor';

function Vault() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 1fr 1fr',
      gridTemplateRows: '1fr 1fr 1fr',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#020203',
      color: '#fff',
      gap: '1px', 
      background: '#1a1a1a', // Border color between panels
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* PANEL 1: Professional Sidebar */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 4', backgroundColor: '#050508', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <span className="panel-title">SYSTEM_DIRECTORY</span>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <button className="vault-sidebar-btn">+ NEW_NODE</button>
          
          <div style={{ color: '#555', fontSize: '0.7rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>FAVORITES</div>
          <div className="vault-nav-item"># React Fundamentals</div>
          <div className="vault-nav-item"># Firebase Setup</div>
          
          <div style={{ color: '#555', fontSize: '0.7rem', margin: '2rem 0 0.5rem 0', letterSpacing: '1px' }}>RECENT ACTIVITY</div>
          <div className="vault-nav-item">System Architecture</div>
          <div className="vault-nav-item">Project Ideas 2026</div>
          <div className="vault-nav-item">API Keys (Encrypted)</div>
        </div>
      </div>

      {/* PANEL 2: The Editor with Header */}
      <div style={{ gridColumn: '2 / 5', gridRow: '1 / 3', backgroundColor: '#020203', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <span className="panel-title">EDITOR // Root / React Fundamentals</span>
          <span style={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace' }}>SAVED</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <BlockEditor />
        </div>
      </div>

      {/* PANEL 3: The Graph Engine with Controls */}
      <div style={{ gridColumn: '2 / 5', gridRow: '3 / 4', backgroundColor: '#000000', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header" style={{ borderBottom: 'none', position: 'absolute', width: '100%', zIndex: 10, background: 'transparent' }}>
          <span className="panel-title" style={{ background: 'rgba(5,5,8,0.8)', padding: '5px 10px', borderRadius: '2px' }}>NEURAL_MAP_ONLINE</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <GraphEngine />
        </div>
      </div>

    </div>
  );
}

export default Vault;