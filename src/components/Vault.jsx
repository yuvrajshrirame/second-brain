import React from 'react';
import GraphEngine from './GraphEngine';
import BlockEditor from './BlockEditor';

function Vault() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '250px 1fr 1fr 1fr',
      gridTemplateRows: '1fr 1fr 1fr',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#020203',
      color: '#fff',
      gap: '1px', 
      background: '#111', 
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* PANEL 1: Sidebar */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 4', backgroundColor: '#050508', padding: '1rem' }}>
        <h3 style={{ color: '#cfa861', fontFamily: 'monospace', marginBottom: '2rem' }}>// NETWORK_NODES</h3>
        <button style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #cfa861', color: '#cfa861', cursor: 'pointer', fontFamily: 'monospace' }}>
          + CREATE_NODE
        </button>
      </div>

      {/* PANEL 2: The Editor */}
      <div style={{ gridColumn: '2 / 5', gridRow: '1 / 3', backgroundColor: '#020203', overflowY: 'auto' }}>
         <BlockEditor />
      </div>

      {/* PANEL 3: The Graph Engine */}
      <div style={{ gridColumn: '2 / 5', gridRow: '3 / 4', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#cfa861', fontFamily: 'monospace', fontSize: '0.8rem', zIndex: 10, pointerEvents: 'none' }}>
           NEURAL_MAP_ONLINE
         </div>
         {/* The interactive 2D physics graph */}
         <GraphEngine />
      </div>

    </div>
  );
}

export default Vault;