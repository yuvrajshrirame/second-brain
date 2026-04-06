import React, { useState, useEffect } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; 

// --- 1. THE ACTUAL EDITOR ---
// This component only mounts when the data is 100% ready
function EditorCore({ documentId, initialContent }) {
  // Now, the editor initializes with the real data from the start
  const editor = useCreateBlockNote({
    initialContent: initialContent
  });

  const handleEditorChange = async () => {
    if (!documentId || !editor) return;
    const currentContent = JSON.stringify(editor.document);
    const docRef = doc(db, 'nodes', documentId);
    await updateDoc(docRef, { content: currentContent });
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
// This acts as a shield, waiting for Firebase before showing the editor
function BlockEditor({ documentId }) {
  const [initialContent, setInitialContent] = useState("loading");

  useEffect(() => {
    async function loadDocument() {
      if (!documentId) return;
      
      // Reset to loading state when we switch documents
      setInitialContent("loading");

      const docRef = doc(db, 'nodes', documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().content) {
        // We have data! Parse it and get ready.
        setInitialContent(JSON.parse(docSnap.data().content));
      } else {
        // It's a blank document
        setInitialContent(undefined); 
      }
    }
    
    loadDocument();
  }, [documentId]);

  // While fetching, show the terminal loading text
  if (initialContent === "loading") {
    return <div style={{ color: '#555', fontFamily: 'monospace', marginTop: '2rem', padding: '0 54px' }}>[ Fetching Neural Data... ]</div>;
  }

  // Once data arrives, render the editor and pass the data in
  return <EditorCore key={documentId} documentId={documentId} initialContent={initialContent} />;
}

export default BlockEditor;