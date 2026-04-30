import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

function GraphEngine({ data, selectedNodeId, onNodeClick }) {
  
  // --- THE LOCAL ORBIT FILTER ---
  // This intercepts the massive global database and filters it down 
  // to ONLY the selected node and its direct 1st-degree connections.
  const localData = useMemo(() => {
    if (!data || !selectedNodeId) return { nodes: [], links: [] };

    const safeSelectedId = String(selectedNodeId);

    // 1. Find all links connected to the currently selected node
    const relevantLinks = data.links.filter(link => {
      const sId = String(typeof link.source === 'object' ? link.source.id : link.source);
      const tId = String(typeof link.target === 'object' ? link.target.id : link.target);
      return sId === safeSelectedId || tId === safeSelectedId;
    });

    // 2. Identify all unique nodes in this specific cluster
    const orbitNodeIds = new Set([safeSelectedId]);
    relevantLinks.forEach(link => {
      orbitNodeIds.add(String(typeof link.source === 'object' ? link.source.id : link.source));
      orbitNodeIds.add(String(typeof link.target === 'object' ? link.target.id : link.target));
    });

    // 3. Filter the master node list to only show the cluster
    const relevantNodes = data.nodes.filter(node => orbitNodeIds.has(String(node.id)));

    return { nodes: relevantNodes, links: relevantLinks };
  }, [data, selectedNodeId]);

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      {/* Fallback UI if the node has zero connections */}
      {localData.nodes.length <= 1 ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'var(--font-mono)', fontSize: '11px', textAlign: 'center', padding: '1rem' }}>
          [ NODE ISOLATED ]<br/><br/>Use @ in the editor<br/>to link concepts.
        </div>
      ) : (
        <ForceGraph2D
          graphData={localData}
          backgroundColor="#000000"
          /* Center node is Gold, orbiting nodes are pure White */
          nodeColor={(node) => String(node.id) === String(selectedNodeId) ? '#cfa861' : '#ffffff'}
          nodeRelSize={6}
          linkColor={() => '#333333'}
          nodeLabel="name"
          width={340} /* Hardcoded to fit your right column perfectly */
          height={260} /* Keeps it inside the widget panel without scrolling */
          onNodeClick={(node) => onNodeClick(node.id)}
          
          /* THE MAGIC: Little data pulses traveling along the active links */
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleColor={() => '#cfa861'}
        />
      )}
    </div>
  );
}

export default GraphEngine;