import React, { useRef, useEffect, useMemo } from 'react';

function GraphEngine({ data, selectedNodeId, onNodeClick }) {
  const canvasRef = useRef(null);
  const physicsStateRef = useRef(new Map());

  // --- 1. FILTER DATA (The Local Orbit Logic) ---
  const localData = useMemo(() => {
    if (!data || !data.nodes || !selectedNodeId) return { nodes: [], links: [] };
    const safeSelectedId = String(selectedNodeId);

    const relevantLinks = data.links.filter(link => {
      const sId = String(typeof link.source === 'object' ? link.source.id : link.source);
      const tId = String(typeof link.target === 'object' ? link.target.id : link.target);
      return sId === safeSelectedId || tId === safeSelectedId;
    });

    const orbitNodeIds = new Set([safeSelectedId]);
    relevantLinks.forEach(link => {
      orbitNodeIds.add(String(typeof link.source === 'object' ? link.source.id : link.source));
      orbitNodeIds.add(String(typeof link.target === 'object' ? link.target.id : link.target));
    });

    const relevantNodes = data.nodes.filter(node => orbitNodeIds.has(String(node.id)));
    return { nodes: relevantNodes, links: relevantLinks };
  }, [data, selectedNodeId]);

  // --- 2. CUSTOM HTML5 PHYSICS ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Initialize node physics state with organic floating parameters
    let simulationNodes = localData.nodes.map(n => {
      const prev = physicsStateRef.current.get(n.id);
      return {
        ...n,
        x: prev ? prev.x : Math.random() * width,  
        y: prev ? prev.y : Math.random() * height,
        vx: prev ? prev.vx : 0, 
        vy: prev ? prev.vy : 0,
        isCenter: String(n.id) === String(selectedNodeId),
        // FLOATING MATH: Random offsets so they don't all move in unison
        floatPhaseX: prev ? prev.floatPhaseX : Math.random() * Math.PI * 2,
        floatPhaseY: prev ? prev.floatPhaseY : Math.random() * Math.PI * 2,
        floatSpeedX: prev ? prev.floatSpeedX : 0.5 + Math.random() * 0.8, 
        floatSpeedY: prev ? prev.floatSpeedY : 0.5 + Math.random() * 0.8
      };
    });

    let animationFrameId;

    // --- PHYSICS TUNING PARAMETERS ---
    const REPULSION = 1500;        // How hard nodes push away
    const SPRING_LENGTH = 80;      // Ideal length of the links
    const SPRING_STIFFNESS = 0.05; // Snappiness of the links
    const DAMPING = 0.85;          // Friction (0.0 to 1.0)
    const NODE_RADIUS = 6;         // Visual size of the nodes
    const FLOAT_AMPLITUDE = 0.03;  // How aggressively they drift

    // --- RENDER LOOP ---
    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Continuous time to drive the sine waves
      const time = Date.now() * 0.001; 

      // A. APPLY FORCES
      for (let i = 0; i < simulationNodes.length; i++) {
        let n1 = simulationNodes[i];

        // Center Gravity (Pulls everything gently to the middle)
        n1.vx += (width / 2 - n1.x) * 0.01;
        n1.vy += (height / 2 - n1.y) * 0.01;

        // THE FLOATING FORCE (Continuous organic drift)
        n1.vx += Math.sin(time * n1.floatSpeedX + n1.floatPhaseX) * FLOAT_AMPLITUDE;
        n1.vy += Math.cos(time * n1.floatSpeedY + n1.floatPhaseY) * FLOAT_AMPLITUDE;

        // Node Repulsion (Coulomb's Law)
        for (let j = i + 1; j < simulationNodes.length; j++) {
          let n2 = simulationNodes[j];
          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          let distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          let force = REPULSION / (distance * distance);
          let fx = (dx / distance) * force;
          let fy = (dy / distance) * force;

          n1.vx -= fx; n1.vy -= fy;
          n2.vx += fx; n2.vy += fy;
        }
      }

      // Spring Forces (Hooke's Law for links)
      localData.links.forEach(link => {
        const sId = String(typeof link.source === 'object' ? link.source.id : link.source);
        const tId = String(typeof link.target === 'object' ? link.target.id : link.target);
        
        let n1 = simulationNodes.find(n => String(n.id) === sId);
        let n2 = simulationNodes.find(n => String(n.id) === tId);
        
        if (n1 && n2) {
          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          let distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          let force = (distance - SPRING_LENGTH) * SPRING_STIFFNESS;
          let fx = (dx / distance) * force;
          let fy = (dy / distance) * force;

          n1.vx += fx; n1.vy += fy;
          n2.vx -= fx; n2.vy -= fy;
        }
      });

      // B. DRAW LINKS
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#333333';
      
      localData.links.forEach(link => {
        const sId = String(typeof link.source === 'object' ? link.source.id : link.source);
        const tId = String(typeof link.target === 'object' ? link.target.id : link.target);
        let n1 = simulationNodes.find(n => String(n.id) === sId);
        let n2 = simulationNodes.find(n => String(n.id) === tId);
        
        if (n1 && n2) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      });

      // C. UPDATE POSITIONS & DRAW NODES
      simulationNodes.forEach(node => {
        // Apply velocity & damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        // Persist the state so it doesn't scramble on re-renders
        physicsStateRef.current.set(node.id, {
          x: node.x, y: node.y, vx: node.vx, vy: node.vy,
          floatPhaseX: node.floatPhaseX, floatPhaseY: node.floatPhaseY,
          floatSpeedX: node.floatSpeedX, floatSpeedY: node.floatSpeedY
        });

        // Draw Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = node.isCenter ? '#cfa861' : '#ffffff';
        ctx.fill();

        // Draw Text Label
        ctx.fillStyle = '#888888';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name || 'Node', node.x, node.y + 16);
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // --- CUSTOM CLICK DETECTION ---
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      for (let node of simulationNodes) {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If clicked within 10px of the node center, trigger the change
        if (distance <= NODE_RADIUS + 4) {
          onNodeClick(node.id);
          break; 
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Cleanup when unmounting or data changes
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [localData, selectedNodeId, onNodeClick]); 

  const isIsolated = localData.nodes.length <= 1;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#030304',
      paddingBottom: '24px' 
    }}>
      
      {/* CSS Overlay for Isolated Nodes */}
      {isIsolated && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: '#555', fontFamily: 'var(--font-mono, monospace)', 
          fontSize: '11px', textAlign: 'center', zIndex: 10, pointerEvents: 'none' 
        }}>
          [ NODE ISOLATED ]<br/><br/>Use @ in the editor<br/>to link concepts.
        </div>
      )}

      {/* The Custom Interactive Canvas */}
      <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'auto',
          marginBottom: 'auto'
      }}>
        <canvas 
          ref={canvasRef} 
          width={340} 
          height={280} 
          style={{ 
            opacity: isIsolated ? 0.3 : 1, 
            transition: 'opacity 0.5s',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #1a1a1a', 
            backgroundColor: '#000'
          }} 
        />
      </div>
    </div>
  );
}

export default GraphEngine;