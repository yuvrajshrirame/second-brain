import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Your new Firebase connection!
import GraphEngine from './GraphEngine';
import BlockEditor from './BlockEditor';

const Icon = ({ path }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

function Vault() {
  // 1. CLOUD STATE
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // Local state for the title input so typing doesn't lag while syncing to the cloud
  const [localTitle, setLocalTitle] = useState("");

  // 2. THE REAL-TIME SYNC (Fires automatically when the app loads)
  useEffect(() => {
    // Listen to the 'nodes' collection in your database
    const unsubscribeNodes = onSnapshot(collection(db, 'nodes'), (snapshot) => {
      const fetchedNodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setGraphData(prev => ({ ...prev, nodes: fetchedNodes }));

      // If nothing is selected and we just loaded nodes, select the first one
      if (!selectedNodeId && fetchedNodes.length > 0) {
        setSelectedNodeId(fetchedNodes[0].id);
        setLocalTitle(fetchedNodes[0].name);
      }
    });

    // Listen to the 'links' collection
    const unsubscribeLinks = onSnapshot(collection(db, 'links'), (snapshot) => {
      const fetchedLinks = snapshot.docs.map(doc => doc.data());
      setGraphData(prev => ({ ...prev, links: fetchedLinks }));
    });

    return () => {
      unsubscribeNodes();
      unsubscribeLinks();
    };
  }, [selectedNodeId]);

  // Update local title state whenever we switch documents
  useEffect(() => {
    const active = graphData.nodes.find(n => n.id === selectedNodeId);
    if (active) setLocalTitle(active.name);
  }, [selectedNodeId, graphData.nodes]);

  const activeNode = graphData.nodes.find(n => n.id === selectedNodeId) || { name: 'Loading...' };

  // --- LAYOUT STATE ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- CLOUD ACTIONS ---
  
  // 1. Create a file in Firebase
  const handleCreateNode = async () => {
    // Add the new node to Firestore
    const newNodeRef = await addDoc(collection(db, 'nodes'), { 
      name: 'Untitled', 
      val: 3,
      createdAt: Date.now() 
    });

    // If we have an active node, draw a physics link from it to the new node
    if (selectedNodeId) {
      await addDoc(collection(db, 'links'), { 
        source: selectedNodeId, 
        target: newNodeRef.id 
      });
    }

    setSelectedNodeId(newNodeRef.id);
  };

  // 2. Update the file name in Firebase (Fires when you click away from the title input)
  const handleTitleBlur = async () => {
    if (!selectedNodeId) return;
    const nodeRef = doc(db, 'nodes', selectedNodeId);
    await updateDoc(nodeRef, { name: localTitle });
  };

  return (
    <div className="vault-layout">
      
      {/* --- LEFT COLUMN --- */}
      <div className={`vault-left-col ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>
            <Icon path="M3 12h18M3 6h18M3 18h18" /> 
          </button>
          <h2 className="nav-text" style={{ fontSize: '1rem', fontWeight: '500', margin: 0, overflow: 'hidden' }}>Vault</h2>
        </div>

        <div style={{ flex: 1, paddingTop: '1rem' }}>
          <div className="vault-nav-item" onClick={handleCreateNode}>
            <Icon path="M12 5v14M5 12h14" />
            <span className="nav-text" style={{ color: 'var(--accent)' }}>New Node</span>
          </div>
          
          <div className="cyber-header" style={{ padding: '1rem 1.5rem 0.5rem', margin: 0 }}>
             <span className="nav-text">DIRECTORY</span>
          </div>
          <div className="vault-nav-item"><Icon path="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><span className="nav-text">Inbox</span></div>
        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingBottom: '1rem' }}>
          <div className="vault-nav-item"><Icon path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /><span className="nav-text">Settings</span></div>
        </div>
      </div>

      {/* --- CENTER COLUMN --- */}
      <div className={`vault-center-col ${isFullScreen ? 'fullscreen' : ''}`}>
        <div className="editor-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#fff' }}>Vault</span>
            <span style={{ color: '#444' }}>/</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> 
              {localTitle}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#4ade80' }}>Synced to Cloud</span>
            <button className="top-nav-btn" onClick={() => setIsFullScreen(!isFullScreen)} title="Toggle Fullscreen">
              <Icon path={isFullScreen ? "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" : "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"} />
            </button>
          </div>
        </div>

        <div className="editor-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="notion-page-transition" key={selectedNodeId} style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 4rem 10rem 4rem' }}>
            
            <input 
              type="text" 
              className="notion-title-input" 
              value={localTitle} 
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur} // Saves to Firebase ONLY when you click away
              placeholder="Untitled"
              disabled={!selectedNodeId}
            />
            
            {/* The Editor is still local for now. We connect it next. */}
            <BlockEditor documentId={selectedNodeId} />

          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="vault-right-col" style={{ display: isFullScreen ? 'none' : 'flex' }}>
        
        <div className="widget-panel" style={{ padding: 0, height: '300px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, width: 'calc(100% - 3rem)' }}>
            <span>NETWORK MAP</span>
            <span style={{ color: '#4ade80' }}>[ONLINE]</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {graphData.nodes.length > 0 ? (
               <GraphEngine data={graphData} selectedNodeId={selectedNodeId} onNodeClick={(id) => setSelectedNodeId(id)} />
            ) : (
               <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#444'}}>Awaiting First Node...</div>
            )}
          </div>
        </div>

        <div className="widget-panel" style={{ flex: 1, overflowY: 'auto' }} className="editor-scroll-area">
          <div className="cyber-header" style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>CLOUD NODES</div>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            {graphData.nodes.map(node => (
               <div 
                 key={node.id} 
                 onClick={() => setSelectedNodeId(node.id)}
                 style={{ 
                   padding: '0.8rem 0', borderBottom: '1px solid #111', cursor: 'pointer', transition: 'padding-left 0.2s',
                   borderLeft: selectedNodeId === node.id ? '2px solid var(--accent)' : '2px solid transparent',
                   paddingLeft: selectedNodeId === node.id ? '10px' : '0'
                 }}
               >
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