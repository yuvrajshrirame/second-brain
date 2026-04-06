import React, { useState } from 'react';
import GraphEngine from './GraphEngine';
import BlockEditor from './BlockEditor';

// Quick inline SVG components to keep it clean and dependency-free
const Icon = ({ path }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

function Vault() {
  // --- CORE STATE ---
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: '1', name: 'System Design Principles', val: 5 },
      { id: '2', name: 'React State Management', val: 3 },
      { id: '3', name: 'Quote: Naval Ravikant', val: 3 }
    ],
    links: [
      { source: '1', target: '2' },
      { source: '1', target: '3' }
    ]
  });

  const [selectedNodeId, setSelectedNodeId] = useState('1');
  const activeNode = graphData.nodes.find(n => n.id === selectedNodeId) || graphData.nodes[0];

  // --- LAYOUT STATE ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- ACTIONS ---
  const handleCreateNode = () => {
    const newNodeId = Date.now().toString(); 
    const newNode = { id: newNodeId, name: 'Untitled', val: 3 };
    const newLink = { source: '1', target: newNodeId };

    setGraphData(prev => ({
      nodes: [...prev.nodes, newNode],
      links: [...prev.links, newLink]
    }));
    setSelectedNodeId(newNodeId);
  };

  const handleTitleChange = (e) => {
    const newName = e.target.value;
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === selectedNodeId ? { ...n, name: newName } : n)
    }));
  };

  return (
    <div className="vault-layout">
      
      {/* ==========================================
          LEFT COLUMN: Navigation & Folders
          ========================================== */}
      <div className={`vault-left-col ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Toggle & Title Area */}
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
          >
            <Icon path="M3 12h18M3 6h18M3 18h18" /> {/* Hamburger Menu */}
          </button>
          {/* CORRECTED: Removed "Nexus" */}
          <h2 className="nav-text" style={{ fontSize: '1rem', fontWeight: '500', margin: 0, overflow: 'hidden' }}>Vault</h2>
        </div>

        {/* Directory List with Icons */}
        <div style={{ flex: 1, paddingTop: '1rem' }}>
          
          <div className="vault-nav-item" onClick={handleCreateNode}>
            <Icon path="M12 5v14M5 12h14" /> {/* Plus Icon */}
            <span className="nav-text" style={{ color: 'var(--accent)' }}>New Node</span>
          </div>
          
          <div className="cyber-header" style={{ padding: '1rem 1.5rem 0.5rem', margin: 0 }}>
             <span className="nav-text">DIRECTORY</span>
          </div>

          <div className="vault-nav-item">
            <Icon path="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <span className="nav-text">Inbox</span>
          </div>
          <div className="vault-nav-item">
            <Icon path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <span className="nav-text">Projects</span>
          </div>
          <div className="vault-nav-item">
            <Icon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <span className="nav-text">Areas</span>
          </div>
          <div className="vault-nav-item">
            <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            <span className="nav-text">Archives</span>
          </div>
        </div>

        {/* Bottom Settings */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingBottom: '1rem' }}>
          <div className="vault-nav-item">
            <Icon path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            <span className="nav-text">Settings</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          CENTER COLUMN: THE NOTION WORKSPACE
          ========================================== */}
      <div className={`vault-center-col ${isFullScreen ? 'fullscreen' : ''}`}>
        
        {/* Notion Style Top Navigation Bar */}
        <div className="editor-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* CORRECTED: Removed "Nexus" */}
            <span style={{ color: '#fff' }}>Vault</span>
            <span style={{ color: '#444' }}>/</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> 
              {activeNode.name}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Edited just now</span>
            <button className="top-nav-btn">Share</button>
            <button className="top-nav-btn"><Icon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></button>
            <button className="top-nav-btn" onClick={() => setIsFullScreen(!isFullScreen)} title="Toggle Fullscreen">
              <Icon path={isFullScreen ? "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" : "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"} />
            </button>
          </div>
        </div>

        {/* The Document Area */}
        <div className="editor-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="notion-page-transition" key={selectedNodeId} style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 4rem 10rem 4rem' }}>
            
            <input 
              type="text" 
              className="notion-title-input" 
              value={activeNode.name} 
              onChange={handleTitleChange}
              placeholder="Untitled"
            />
            
            <BlockEditor />

          </div>
        </div>
      </div>

      {/* ==========================================
          RIGHT COLUMN: Context & Insights
          ========================================== */}
      <div className="vault-right-col" style={{ display: isFullScreen ? 'none' : 'flex' }}>
        
        <div className="widget-panel" style={{ padding: 0, height: '300px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, width: 'calc(100% - 3rem)' }}>
            <span>NETWORK MAP</span>
            <span style={{ color: 'var(--accent)' }}>[LIVE]</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GraphEngine data={graphData} selectedNodeId={selectedNodeId} onNodeClick={(id) => setSelectedNodeId(id)} />
          </div>
        </div>

        <div className="widget-panel" style={{ flex: 1, overflowY: 'auto' }} className="editor-scroll-area">
          <div className="cyber-header" style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>RECENT NODES</div>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            {graphData.nodes.map(node => (
               <div 
                 key={node.id} 
                 onClick={() => setSelectedNodeId(node.id)}
                 style={{ 
                   padding: '0.8rem 0', 
                   borderBottom: '1px solid #111', 
                   cursor: 'pointer', 
                   transition: 'padding-left 0.2s',
                   borderLeft: selectedNodeId === node.id ? '2px solid var(--accent)' : '2px solid transparent',
                   paddingLeft: selectedNodeId === node.id ? '10px' : '0'
                 }}
               >
                 <div style={{ fontSize: '0.6rem', color: '#666', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>TODAY</div>
                 <div style={{ color: selectedNodeId === node.id ? '#fff' : '#888', fontSize: '0.9rem' }}>{node.name}</div>
               </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Vault;