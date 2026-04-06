import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import BootSequence from './components/BootSequence';
import Vault from './components/Vault';

function App() {
  const [appState, setAppState] = useState('marketing'); // marketing -> booting -> vault

  return (
    <>
      <div className="bg-system">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {appState === 'marketing' && <LandingPage onEnter={() => setAppState('booting')} />}
      
      {appState === 'booting' && <BootSequence onComplete={() => setAppState('vault')} />}
      
      {appState === 'vault' && <Vault />}
    </>
  );
}

export default App;