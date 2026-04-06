import React, { useState, useEffect } from 'react';

function BootSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // The fake terminal logs
    const bootLogs = [
      "INITIALIZING KERNEL...",
      "MOUNTING ENCRYPTED FILE SYSTEM...",
      "CONNECTING TO NEURAL NETWORK...",
      "LOADING 3D RENDER ENGINE...",
      "SYNCING PROTOCOLS...",
      "BOOT SEQUENCE COMPLETE."
    ];

    let currentLog = 0;
    
    // Add a new log line every 400ms
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      }
    }, 400);

    // Fill the progress bar sporadically
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          setTimeout(onComplete, 800); // Pause briefly before entering vault
          return 100;
        }
        // Jump randomly between 5% and 20%
        return prev + Math.floor(Math.random() * 15) + 5; 
      });
    }, 300);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div style={{
      height: '100vh', width: '100vw', backgroundColor: '#020203', color: '#cfa861',
      fontFamily: "'Courier New', Courier, monospace", padding: '2rem', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ color: '#fff', marginBottom: '2rem', letterSpacing: '2px' }}>SYSTEM BOOT</h2>

        {/* Log Output */}
        <div style={{ marginBottom: '2rem', minHeight: '150px' }}>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '0.5rem', opacity: 0.8 }}>{`> ${log}`}</div>
          ))}
          {/* Blinking Cursor */}
          <div style={{ 
            display: 'inline-block', width: '10px', height: '1em', 
            backgroundColor: '#cfa861', animation: 'blink 1s step-end infinite' 
          }}></div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '2px', backgroundColor: '#111', position: 'relative' }}>
          <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', backgroundColor: '#cfa861', transition: 'width 0.2s ease' }}></div>
        </div>
        <div style={{ marginTop: '0.5rem', textAlign: 'right', fontSize: '0.9rem', color: '#888' }}>
          {Math.min(progress, 100)}%
        </div>
      </div>
    </div>
  );
}

export default BootSequence;