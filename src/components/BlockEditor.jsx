import React, { useState, useEffect, useRef } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; 

// --- 1. THE ACTUAL EDITOR ---
function EditorCore({ documentId, initialContent, onSyncStatusChange }) {
  const editor = useCreateBlockNote({ initialContent });
  
  // A ref to hold our timer so we can reset it while you type
  const debounceTimer = useRef(null);

  const handleEditorChange = () => {
    if (!documentId || !editor) return;

    // 1. Instantly tell the UI we have unsaved changes
    onSyncStatusChange('unsaved');

    // 2. Clear the previous timer if you keep typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // 3. Wait exactly 1 second after you STOP typing to save
    debounceTimer.current = setTimeout(async () => {
      onSyncStatusChange('syncing'); // Tell UI we are uploading

      try {
        const currentContent = JSON.stringify(editor.document);
        const docRef = doc(db, 'nodes', documentId);
        await updateDoc(docRef, { content: currentContent });
        
        onSyncStatusChange('saved'); // Tell UI we secured the bag
      } catch (error) {
        console.error("Sync failed", error);
        onSyncStatusChange('error');
      }
    }, 1000); 
  };

  return (
    <div style={{ color: '#fff', marginTop: '1rem' }}>
      <BlockNoteView 
        editor={editor} 
        theme="dark" 
        onChange={handleEditorChange} 
      />
    </div>
  );
}

// --- 2. THE DATA LOADER ---
function BlockEditor({ documentId, onSyncStatusChange }) {
  const [initialContent, setInitialContent] = useState("loading");

  useEffect(() => {
    async function loadDocument() {
      if (!documentId) return;
      
      setInitialContent("loading");
      const docRef = doc(db, 'nodes', documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().content) {
        setInitialContent(JSON.parse(docSnap.data().content));
      } else {
        setInitialContent(undefined); 
      }
    }
    
    loadDocument();
  }, [documentId]);

  if (initialContent === "loading") {
    return <div style={{ color: '#555', fontFamily: 'monospace', marginTop: '2rem', padding: '0 54px' }}>[ Fetching Neural Data... ]</div>;
  }

  return (
    <EditorCore 
      key={documentId} 
      documentId={documentId} 
      initialContent={initialContent} 
      onSyncStatusChange={onSyncStatusChange} 
    />
  );
}

export default BlockEditor;