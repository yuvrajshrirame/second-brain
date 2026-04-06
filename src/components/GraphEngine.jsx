import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

function GraphEngine({ data, selectedNodeId, onNodeClick }) {
  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <ForceGraph2D
        graphData={data}
        backgroundColor="#000000"
        /* Highlight the selected node in pure White, Root in gray, others in Gold */
        nodeColor={(node) => 
          node.id === selectedNodeId ? '#ffffff' : 
          node.id === '1' ? '#555555' : '#cfa861'
        }
        nodeRelSize={6}
        linkColor={() => '#333333'}
        nodeLabel="name"
        width={window.innerWidth - 260} 
        height={window.innerHeight / 3}
        /* Fires when you click a bubble in the physics simulation */
        onNodeClick={(node) => onNodeClick(node.id)}
      />
    </div>
  );
}

export default GraphEngine;