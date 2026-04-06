import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

function GraphEngine() {
  // Stable mock data to test the layout
  const data = useMemo(() => ({
    nodes: [
      { id: '1', name: 'Root Concept', val: 5 },
      { id: '2', name: 'React', val: 3 },
      { id: '3', name: 'Database', val: 3 }
    ],
    links: [
      { source: '1', target: '2' },
      { source: '1', target: '3' }
    ]
  }), []);

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <ForceGraph2D
        graphData={data}
        backgroundColor="#000000"
        nodeColor={() => '#cfa861'}
        linkColor={() => '#333333'}
        nodeLabel="name"
        width={window.innerWidth - 250} // Total width minus the sidebar
        height={window.innerHeight / 3} // Exact height of the bottom panel
      />
    </div>
  );
}

export default GraphEngine;