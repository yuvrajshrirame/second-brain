import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
// We will import BootSequence and Vault in Phase 2

function App() {
  const [appState, setAppState] = useState('marketing');

  return (
    <>
      <div className="bg-system">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {appState === 'marketing' && <LandingPage onEnter={() => setAppState('booting')} />}
      
      {appState === 'booting' && (
        <div style={{position: 'relative', zIndex: 10, color: 'white', textAlign: 'center', marginTop: '20vh'}}>
          <h1>[ BOOTING SYSTEM... ]</h1>
        </div>
      )}
      
      {appState === 'vault' && (
        <div style={{position: 'relative', zIndex: 10, color: 'white', textAlign: 'center', marginTop: '20vh'}}>
          <h1>[ VAULT LOADED ]</h1>
        </div>
      )}
    </>
  );
}

export default App;