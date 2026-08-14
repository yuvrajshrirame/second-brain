import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, provider } from '../firebase';
import GraphEngine from './GraphEngine';
import BlockEditor from './BlockEditor';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icon = ({ path }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const EllipsisIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

function Vault({ user }) {
  // --- CLOUD STATE ---
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [folders, setFolders] = useState([]); 
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [localTitle, setLocalTitle] = useState("");

  // --- LAYOUT & DIRECTORY STATE ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeFolder, setActiveFolder] = useState('all'); 
  const [syncStatus, setSyncStatus] = useState('saved');

  // --- FOLDER MANAGEMENT STATE ---
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [openFolderMenuId, setOpenFolderMenuId] = useState(null);

  // --- CUSTOM MODAL STATE ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger', 
    confirmText: 'Confirm',
    onConfirm: null
  });

  // --- GLOBAL TOOLTIP STATE ---
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const showTooltip = (e, text) => {
    if (!isSidebarCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, text, x: rect.right + 12, y: rect.top + rect.height / 2 });
  };
  
  const hideTooltip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 });

  // --- GLOBAL CLICK HANDLER ---
  useEffect(() => {
    const handleClickOutside = () => setOpenFolderMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // --- REAL-TIME SYNC ---
  // SECURITY: every query below is scoped to the signed-in user's own documents
  // via a `where('userId', '==', user.uid)` filter, so one account never receives
  // another account's nodes/links/folders in its snapshot.
  useEffect(() => {
    if (!user) return;

    const nodesQuery = query(collection(db, 'nodes'), where('userId', '==', user.uid));
    const unsubscribeNodes = onSnapshot(nodesQuery, (snapshot) => {
      const fetchedNodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGraphData(prev => ({ ...prev, nodes: fetchedNodes }));
      if (!selectedNodeId && fetchedNodes.length > 0) {
        setSelectedNodeId(fetchedNodes[0].id);
        setLocalTitle(fetchedNodes[0].name);
      }
    });

    const linksQuery = query(collection(db, 'links'), where('userId', '==', user.uid));
    const unsubscribeLinks = onSnapshot(linksQuery, (snapshot) => {
      const fetchedLinks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGraphData(prev => ({ ...prev, links: fetchedLinks }));
    });

    const foldersQuery = query(collection(db, 'folders'), where('userId', '==', user.uid));
    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const fetchedFolders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedFolders.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setFolders(fetchedFolders);
    });

    return () => {
      unsubscribeNodes();
      unsubscribeLinks();
      unsubscribeFolders();
    };
  }, [selectedNodeId, user]);

  useEffect(() => {
    const active = graphData.nodes.find(n => n.id === selectedNodeId);
    if (active) setLocalTitle(active.name);
  }, [selectedNodeId, graphData.nodes]);

  const activeNode = graphData.nodes.find(n => n.id === selectedNodeId) || {};

  // --- GAMIFICATION ---
  const totalXP = (graphData.nodes.length * 10) + (graphData.links.length * 25);
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const currentLevelProgress = totalXP % 100;
  const prevLevelRef = useRef(currentLevel);

  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      fireSynapseBurst();
      prevLevelRef.current = currentLevel;
    }
  }, [currentLevel]);

  const fireSynapseBurst = () => {
    const colors = ['#cfa861', '#ffffff', '#1a1a1a']; 
    confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors, zIndex: 9999 });
    confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors, zIndex: 9999 });
  };

  // --- NODE ACTIONS ---
  const handleCreateNode = async () => {
    const newNodeRef = await addDoc(collection(db, 'nodes'), { 
      name: 'Untitled', 
      val: 3, 
      createdAt: Date.now(),
      folder: activeFolder === 'all' ? null : activeFolder,
      userId: user.uid
    });
    
    setSelectedNodeId(newNodeRef.id);
  };

  const handleTitleBlur = async () => {
    if (!selectedNodeId) return;
    setSyncStatus('syncing');
    await updateDoc(doc(db, 'nodes', selectedNodeId), { name: localTitle });
    setSyncStatus('saved');
  };

  const handleMoveNode = async (newFolder) => {
    if (!selectedNodeId) return;
    setSyncStatus('syncing');
    await updateDoc(doc(db, 'nodes', selectedNodeId), { folder: newFolder || null });
    setSyncStatus('saved');
  };

  const handleAddLink = async (sourceId, targetId) => {
    const linkExists = graphData.links.some(link => {
      const sId = typeof link.source === 'object' ? link.source.id : link.source;
      const tId = typeof link.target === 'object' ? link.target.id : link.target;
      return (sId === sourceId && tId === targetId) || (sId === targetId && tId === sourceId);
    });

    if (!linkExists) {
      await addDoc(collection(db, 'links'), { source: sourceId, target: targetId, userId: user.uid });
    }
  };

  const handleRemoveLink = async (linkId) => {
    if (!linkId) return;
    await deleteDoc(doc(db, 'links', linkId));
  };

  const triggerDeleteNode = () => {
    if (!selectedNodeId) return;
    
    const targetId = selectedNodeId; 
    
    setModalConfig({
      isOpen: true,
      title: 'ERASE NEURAL NODE?',
      message: 'This will permanently delete this node and sever all cognitive links connected to it. This action cannot be undone.',
      type: 'danger',
      confirmText: 'Purge Node',
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        setSelectedNodeId(null);
        setLocalTitle("");
        setSyncStatus('syncing');

        await deleteDoc(doc(db, 'nodes', targetId));
        
        const linksToSever = graphData.links.filter(l => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          return sId === targetId || tId === targetId;
        });

        for (const link of linksToSever) {
          if (link.id) await deleteDoc(doc(db, 'links', link.id));
        }

        setSyncStatus('saved');
      }
    });
  };

  // --- FOLDER MANAGEMENT ACTIONS ---
  const handleCreateFolder = async () => {
    if (!isAddingFolder || !newFolderName.trim()) {
      setIsAddingFolder(false);
      return;
    }
    
    const nameToSave = newFolderName.trim();
    setIsAddingFolder(false);
    setNewFolderName("");

    await addDoc(collection(db, 'folders'), {
      name: nameToSave,
      createdAt: Date.now(),
      userId: user.uid
    });
  };

  const handleRenameFolder = async (folderId) => {
    if (editFolderName.trim()) {
      await updateDoc(doc(db, 'folders', folderId), { name: editFolderName.trim() });
    }
    setEditingFolderId(null);
  };

  const triggerDeleteFolder = (folderId, e) => {
    if(e) e.stopPropagation(); 
    setModalConfig({
      isOpen: true,
      title: 'DELETE DIRECTORY?',
      message: 'Are you sure you want to delete this folder? Any nodes currently stored inside will NOT be deleted; they will simply become "Unassigned" and visible in All Nodes.',
      type: 'warning',
      confirmText: 'Delete Directory',
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        
        if (activeFolder === folderId) setActiveFolder('all');
        
        const orphanedNodes = graphData.nodes.filter(n => n.folder === folderId);
        for (const node of orphanedNodes) {
          await updateDoc(doc(db, 'nodes', node.id), { folder: null });
        }
        await deleteDoc(doc(db, 'folders', folderId));
      }
    });
  };

  // --- SIGN OUT CONFIRMATION ---
  const triggerSignOut = () => {
    setModalConfig({
      isOpen: true,
      title: 'DISCONNECT NEURAL LINK?',
      message: 'Are you sure you want to sign out and lock the vault? End-to-end encryption will be re-engaged.',
      type: 'warning',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        await signOut(auth);
      }
    });
  };

  const displayedNodes = graphData.nodes.filter(n => {
    if (activeFolder === 'all') return true;
    return n.folder === activeFolder;
  });

  // ==========================================
  // LOCK SCREEN
  // ==========================================
  if (!user) {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#020203', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-mono)' }}>
         <div style={{ width: '60px', height: '60px', border: '1px solid var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 30px rgba(207, 168, 97, 0.1)' }}>
            <Icon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
         </div>
         <h2 style={{ letterSpacing: '6px', marginBottom: '1rem', fontWeight: 300, fontSize: '1.5rem' }}>SYSTEM LOCKED</h2>
         <p style={{ color: '#555', marginBottom: '3rem', fontFamily: 'var(--font-sans)', letterSpacing: '1px' }}>End-to-End Encryption Active. Authentication required.</p>
         <button onClick={() => signInWithPopup(auth, provider)} style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '1rem 3rem', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: 'pointer', borderRadius: '2px' }}>
           Decrypt via Google
         </button>
      </div>
    );
  }

  // ==========================================
  // THE VAULT COCKPIT
  // ==========================================
  return (
    <div className="vault-layout">
      
      <AnimatePresence>
        {modalConfig.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ background: '#050508', border: '1px solid #1a1a1a', borderLeft: modalConfig.type === 'danger' ? '3px solid #ef4444' : '3px solid var(--accent)', width: '400px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <h3 style={{ fontFamily: 'var(--font-mono)', color: modalConfig.type === 'danger' ? '#ef4444' : 'var(--accent)', fontSize: '1rem', marginTop: 0, letterSpacing: '1px' }}>
                {modalConfig.title}
              </h3>
              <p style={{ color: '#888', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {modalConfig.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={modalConfig.onConfirm}
                  style={{ background: modalConfig.type === 'danger' ? '#ef4444' : 'var(--accent)', color: '#000', border: 'none', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }}
                >
                  {modalConfig.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`vault-left-col ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ 
          padding: isSidebarCollapsed ? '1.5rem 0' : '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
          gap: '12px' 
        }}>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Icon path="M3 12h18M3 6h18M3 18h18" /> 
          </button>
          <h2 className="nav-text" style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>Vault</h2>
        </div>

        {!isSidebarCollapsed && (
          <div className="xp-container animate-fade-up">
            <div className="xp-header">
              <span className="xp-title">COGNITIVE LEVEL</span>
              <span className="xp-level">Lv.{currentLevel}</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${currentLevelProgress}%` }}></div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, paddingTop: '1rem', overflowY: 'auto' }} className="editor-scroll-area">
          <div 
            className="vault-nav-item" 
            onClick={handleCreateNode} 
            data-tooltip="New Node"
            onMouseEnter={(e) => showTooltip(e, 'New Node')}
            onMouseLeave={hideTooltip}
          >
            <Icon path="M12 5v14M5 12h14" />
            <span className="nav-text" style={{ color: 'var(--accent)' }}>New Node</span>
          </div>
          
          <div className="cyber-header" style={{ 
            padding: '1rem 1.5rem 0.5rem', 
            margin: 0, 
            display: isSidebarCollapsed ? 'none' : 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
             <span className="nav-text">DIRECTORY</span>
             {!isSidebarCollapsed && (
               <button 
                 onClick={() => {
                   setIsAddingFolder(true);
                   setNewFolderName(""); 
                 }} 
                 style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
                 title="Create Custom Directory"
               >
                 +
               </button>
             )}
          </div>
          
          <div 
            className="vault-nav-item" 
            onClick={() => setActiveFolder('all')} 
            data-tooltip="All Nodes" 
            onMouseEnter={(e) => showTooltip(e, 'All Nodes')}
            onMouseLeave={hideTooltip}
            style={{ borderLeft: activeFolder === 'all' ? '2px solid var(--accent)' : '2px solid transparent', background: activeFolder === 'all' ? 'rgba(255,255,255,0.03)' : 'transparent' }}
          >
            <Icon path="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
            <span className="nav-text" style={{ color: activeFolder === 'all' ? '#fff' : '#888' }}>All Nodes</span>
          </div>

          <AnimatePresence>
            {folders.map(folder => (
              <motion.div 
                key={folder.id}
                initial={{ opacity: 1, height: 'auto' }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} 
                transition={{ duration: 0.2 }}
                className="vault-nav-item" 
                onClick={() => setActiveFolder(folder.id)} 
                data-tooltip={folder.name}
                onMouseEnter={(e) => showTooltip(e, folder.name)}
                onMouseLeave={hideTooltip}
                style={{ 
                  borderLeft: activeFolder === folder.id ? '2px solid var(--accent)' : '2px solid transparent', 
                  background: activeFolder === folder.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                  position: 'relative', 
                  zIndex: openFolderMenuId === folder.id ? 10 : 1, 
                  overflow: openFolderMenuId === folder.id ? 'visible' : 'hidden' 
                }}
              >
                <Icon path="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z" />
                
                <div className="nav-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, overflow: 'hidden' }}>
                  {editingFolderId === folder.id ? (
                    <input
                      autoFocus
                      value={editFolderName}
                      onClick={e => e.stopPropagation()}
                      onChange={e => setEditFolderName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRenameFolder(folder.id)}
                      onBlur={() => handleRenameFolder(folder.id)}
                      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent)', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}
                    />
                  ) : (
                    <span style={{ color: activeFolder === folder.id ? '#fff' : '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder.name}</span>
                  )}
                  
                  {!isSidebarCollapsed && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenFolderMenuId(openFolderMenuId === folder.id ? null : folder.id); 
                      }} 
                      style={{ background: 'transparent', border: 'none', color: openFolderMenuId === folder.id ? '#fff' : '#666', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', flexShrink: 0 }}
                      title="Folder Options"
                    >
                      <EllipsisIcon />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {openFolderMenuId === folder.id && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '2.5rem',
                        background: '#0a0a0f',
                        border: '1px solid #222',
                        borderRadius: '4px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '120px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                          setEditFolderName(folder.name);
                          setOpenFolderMenuId(null);
                        }}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#ccc', cursor: 'pointer', borderBottom: '1px solid #1a1a1a', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        Rename
                      </div>
                      <div 
                        onClick={(e) => {
                          triggerDeleteFolder(folder.id, e);
                          setOpenFolderMenuId(null);
                        }}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        Delete
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            ))}

            {isAddingFolder && !isSidebarCollapsed && (
              <motion.div 
                key="new-folder-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="vault-nav-item"
                style={{ display: 'flex', alignItems: 'center', paddingRight: '1.5rem', overflow: 'hidden' }}
              >
                <Icon path="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z" />
                <div className="nav-text" style={{ flex: 1, display: 'flex' }}>
                  <input
                    autoFocus
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') {
                        setIsAddingFolder(false);
                        setNewFolderName("");
                      }
                    }}
                    onBlur={() => {
                      if (newFolderName.trim()) {
                        handleCreateFolder();
                      } else {
                        setIsAddingFolder(false);
                      }
                    }}
                    placeholder="Folder name..."
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent)', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingBottom: '1rem', paddingTop: '0.5rem' }}>
          <a 
            href="https://docs.uraj.dev/2ndbrain" 
            target="_blank" 
            rel="noreferrer" 
            className="vault-nav-item" 
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
            data-tooltip="Documentation"
            onMouseEnter={(e) => showTooltip(e, 'Documentation')}
            onMouseLeave={hideTooltip}
          >
            <Icon path="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            <span className="nav-text">Documentation</span>
          </a>
          <div 
            className="vault-nav-item" 
            onClick={triggerSignOut} 
            style={{ marginTop: '0.2rem' }} 
            data-tooltip="Sign Out"
            onMouseEnter={(e) => showTooltip(e, 'Sign Out')}
            onMouseLeave={hideTooltip}
          >
            <Icon path="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            <span className="nav-text">Sign Out</span>
          </div>
        </div>
      </div>

      <div className={`vault-center-col ${isFullScreen ? 'fullscreen' : ''}`}>
        <div className="editor-top-nav">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: syncStatus === 'saved' ? '#4ade80' : syncStatus === 'syncing' ? 'var(--accent)' : '#888', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', transition: 'color 0.3s ease' }}>
              {syncStatus === 'saved' ? <><span style={{fontSize:'10px'}}>●</span> Synced</> : syncStatus === 'syncing' ? <><span style={{fontSize:'10px'}}>◌</span> Syncing...</> : <><span style={{fontSize:'10px'}}>○</span> Unsaved</>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AnimatePresence>
              {selectedNodeId && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <select 
                    value={activeNode.folder || ''} 
                    onChange={(e) => handleMoveNode(e.target.value)}
                    style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '0.3rem 0.6rem', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    <option value="">/Unassigned</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>/{f.name}</option>
                    ))}
                  </select>

                  <button className="top-nav-btn" onClick={triggerDeleteNode} title="Delete Node" style={{ color: '#ef4444' }}>
                    <Icon path="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </button>
                  <div style={{ width: '1px', height: '15px', background: '#333' }}></div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="top-nav-btn" onClick={() => setIsFullScreen(!isFullScreen)} title="Toggle Fullscreen">
              <Icon path={isFullScreen ? "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" : "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"} />
            </button>
          </div>

        </div>

        <div className="editor-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
          {!selectedNodeId ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontFamily: 'var(--font-mono)', letterSpacing: '3px', fontSize: '0.9rem' }}>
               [ SYSTEM IDLE : SELECT OR INITIALIZE NODE ]
            </div>
          ) : (
            <div className="notion-page-transition" key={selectedNodeId} style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 4rem 10rem 4rem' }}>
              <input 
                type="text" 
                className="notion-title-input" 
                value={localTitle} 
                onChange={(e) => { setLocalTitle(e.target.value); setSyncStatus('unsaved'); }}
                onBlur={handleTitleBlur} 
                placeholder="Untitled"
              />
              <BlockEditor 
                documentId={selectedNodeId} 
                onSyncStatusChange={setSyncStatus} 
                nodes={graphData.nodes} 
                links={graphData.links}
                onAddLink={handleAddLink} 
                onRemoveLink={handleRemoveLink}
                user={user}
              />
            </div>
          )}
        </div>
      </div>

      <div className="vault-right-col" style={{ display: isFullScreen ? 'none' : 'flex' }}>
        
        <div className="widget-panel" style={{ padding: 0, height: '300px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, width: 'calc(100% - 3rem)' }}>
            <span>LOCAL ORBIT</span>
            <span style={{ color: '#4ade80' }}>[ONLINE]</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GraphEngine data={graphData} selectedNodeId={selectedNodeId} onNodeClick={(id) => setSelectedNodeId(id)} />
          </div>
        </div>

        <div className="widget-panel" style={{ flex: 1, overflowY: 'auto' }} className="editor-scroll-area">
          <div className="cyber-header" style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
             CLOUD NODES <span style={{color: '#555'}}>({displayedNodes.length})</span>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            {displayedNodes.length === 0 ? (
               <div style={{ color: '#444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '1rem' }}>No nodes in this directory.</div>
            ) : (
              <AnimatePresence>
                {displayedNodes.map(node => (
                  <motion.div 
                    key={node.id} 
                    initial={{ opacity: 0, height: 0, x: 20 }}
                    animate={{ opacity: 1, height: 'auto', x: 0 }}
                    exit={{ opacity: 0, height: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ 
                      padding: '0.8rem 0', borderBottom: '1px solid #111', cursor: 'pointer', transition: 'padding-left 0.2s',
                      borderLeft: selectedNodeId === node.id ? '2px solid var(--accent)' : '2px solid transparent',
                      paddingLeft: selectedNodeId === node.id ? '10px' : '0', overflow: 'hidden'
                    }}
                  >
                    <div style={{ color: selectedNodeId === node.id ? '#fff' : '#888', fontSize: '0.9rem' }}>{node.name || 'Untitled'}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
      {/* --- GLOBAL FIXED TOOLTIP --- */}
      {tooltip.visible && isSidebarCollapsed && (
        <div style={{
          position: 'fixed',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translateY(-50%)',
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(8px)',
          color: 'var(--accent)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 99999,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }}>
          {tooltip.text}
        </div>
      )}

    </div>
  );
}

export default Vault;