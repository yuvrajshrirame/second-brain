import { createReactBlockSpec } from "@blocknote/react";
import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'var(--font-mono, monospace)',
});

export const MermaidBlock = createReactBlockSpec(
  {
    type: "mermaid",
    propSchema: {
      code: {
        default: "graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const [isEditing, setIsEditing] = useState(false);
      const [code, setCode] = useState(props.block.props.code);
      const containerRef = useRef(null);

      // Sync external changes to local state
      useEffect(() => {
        if (!isEditing && props.block.props.code !== code) {
          setCode(props.block.props.code);
        }
      }, [props.block.props.code, isEditing, code]);

      useEffect(() => {
        if (!isEditing && containerRef.current) {
          let isMounted = true;
          
          const renderDiagram = async () => {
            // Give the browser a tiny moment to calculate layout bounds
            await new Promise(resolve => setTimeout(resolve, 50));
            if (!isMounted || !containerRef.current) return;

            try {
              containerRef.current.innerHTML = '';
              const uniqueId = `mermaid-${props.block.id.replace(/[^a-zA-Z0-9]/g, '')}`;
              
              // Clean up AI generated markdown backticks and trailing backslashes
              let cleanCode = code.trim();
              if (cleanCode.startsWith('```')) {
                cleanCode = cleanCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
              }
              // Remove trailing backslashes (AI often adds these for hard line breaks in markdown)
              cleanCode = cleanCode.replace(/\\(\r?\n|$)/g, '$1');

              if (!cleanCode) {
                containerRef.current.innerHTML = `<div style="color: #888; font-family: monospace; padding: 1rem; text-align: center;">[ EMPTY DIAGRAM ]</div>`;
                return;
              }

              // Mermaid can sometimes throw non-standard errors, so we parse first if possible, or just catch it
              const { svg } = await mermaid.render(uniqueId, cleanCode);
              if (isMounted && containerRef.current) {
                containerRef.current.innerHTML = svg;
              }
            } catch (error) {
              console.error("Mermaid syntax error:", error);
              // Mermaid sometimes leaves a rogue error div in the body, let's clean it up if it exists
              const rogueError = document.getElementById(`d${props.block.id.replace(/[^a-zA-Z0-9]/g, '')}`);
              if (rogueError) rogueError.remove();
              
              if (isMounted && containerRef.current) {
                containerRef.current.innerHTML = `<div style="color: #ff5555; font-family: monospace; padding: 1rem; border: 1px dashed #ff5555; background: rgba(255,0,0,0.05); text-align: center; white-space: pre-wrap; font-size: 12px;">[ MERMAID SYNTAX ERROR ]\n${error.message || 'Invalid diagram syntax'}</div>`;
              }
            }
          };
          
          renderDiagram();
          return () => { isMounted = false; };
        }
      }, [code, isEditing, props.block.id]);

      const handleBlur = () => {
        setIsEditing(false);
        props.editor.updateBlock(props.block, {
          type: "mermaid",
          props: { ...props.block.props, code: code }
        });
      };

      return (
        <div style={{ width: '100%', margin: '1rem 0' }}>
          {isEditing ? (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '10px', background: '#cfa861', color: '#000', fontSize: '0.6rem', padding: '2px 6px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Mermaid Source</div>
              <textarea
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  background: '#0a0a0f',
                  color: '#4ade80',
                  border: '1px solid #333',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.85rem',
                  padding: '1.5rem 1rem 1rem 1rem',
                  borderRadius: '4px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              style={{
                width: '100%',
                padding: '2rem 1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: 'auto',
                transition: 'border 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #cfa861'}
              onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
            >
              <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
            </div>
          )}
        </div>
      );
    },
  }
);
