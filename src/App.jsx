import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LandingPage from './components/LandingPage';
import BootSequence from './components/BootSequence';
import Vault from './components/Vault';

function App() {
  const [appState, setAppState] = useState('marketing');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Silently check if the user is logged in the background
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (isCheckingAuth) return <div style={{ height: '100vh', backgroundColor: '#020203' }}></div>;

  return (
    <>
      {/* We pass onEnter to trigger the boot sequence, NOT the Google popup */}
      {appState === 'marketing' && <LandingPage onEnter={() => setAppState('booting')} />}
      
      {appState === 'booting' && <BootSequence onComplete={() => setAppState('vault')} />}
      
      {/* We pass the user to the Vault so IT can decide to lock or unlock */}
      {appState === 'vault' && <Vault user={user} />}
    </>
  );
}

export default App;