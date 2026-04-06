import React from 'react';

function Vault() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '250px 1fr 1fr 1fr', // Sidebar + 3 columns
      gridTemplateRows: '1fr 1fr 1fr',          // 3 rows
      height: '100vh',
      width: '100vw',
      backgroundColor: '#020203',
      color: '#fff',
      gap: '1px', // Creates the "border" effect between panels
      background: '#111', // The color of the borders
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* PANEL 1: Sidebar (Node Creation / List) */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 4', backgroundColor: '#050508', padding: '1rem' }}>
        <h3 style={{ color: '#cfa861', fontFamily: 'monospace', marginBottom: '2rem' }}>// NETWORK_NODES</h3>
        <button style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #cfa861', color: '#cfa861', cursor: 'pointer', fontFamily: 'monospace' }}>
          + CREATE_NODE
        </button>
        {/* Note list will go here */}
      </div>

      {/* PANEL 2: The Editor (Top Right) */}
      <div style={{ gridColumn: '2 / 5', gridRow: '1 / 3', backgroundColor: '#020203', padding: '2rem', overflowY: 'auto' }}>
         <p style={{ color: '#888', fontFamily: 'monospace' }}>[ Block Editor Module Loading... ]</p>
      </div>

      {/* PANEL 3: The Graph Engine (Bottom Right) */}
      <div style={{ gridColumn: '2 / 5', gridRow: '3 / 4', backgroundColor: '#000', position: 'relative' }}>
         <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#cfa861', fontFamily: 'monospace', fontSize: '0.8rem' }}>NEURAL_MAP_OFFLINE</div>
      </div>

    </div>
  );
}

export default Vault;