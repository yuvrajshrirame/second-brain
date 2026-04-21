import React, { useState, useEffect, useRef } from 'react';
import { filterSuggestionItems } from "@blocknote/core"; // NEW IMPORT
import { useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; 

// --- 1. THE ACTUAL EDITOR ---
function EditorCore({ documentId, initialContent, onSyncStatusChange, nodes, onAddLink }) {
  const editor = useCreateBlockNote({ initialContent });
  const debounceTimer = useRef(null);

  const handleEditorChange = () => {
    if (!documentId || !editor) return;
    onSyncStatusChange('unsaved');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      onSyncStatusChange('syncing');
      try {
        const currentContent = JSON.stringify(editor.document);
        const docRef = doc(db, 'nodes', documentId);
        await updateDoc(docRef, { content: currentContent });
        onSyncStatusChange('saved');
      } catch (error) {
        console.error("Sync failed", error);
        onSyncStatusChange('error');
      }
    }, 1000); 
  };

  // --- THE NEURAL LINKING ENGINE ---
  const getMentionItems = async (query) => {
    // Filter nodes based on what you type after the '@'
    const filteredNodes = nodes.filter(node => 
      node.name.toLowerCase().includes(query.toLowerCase()) && 
      node.id !== documentId // Prevent linking to itself!
    );

    return filteredNodes.map((node) => ({
      title: node.name,
      onItemClick: () => {
        // 1. Insert the aesthetic bracket link into the text
        editor.insertText(`[[${node.name}]] `);
        
        // 2. Tell the Vault to update the physics graph in the cloud
        onAddLink(documentId, node.id);
      },
    }));
  };

  return (
    <div style={{ color: '#fff', marginTop: '1rem' }}>
      <BlockNoteView 
        editor={editor} 
        theme="dark" 
        onChange={handleEditorChange} 
      >
        {/* CORRECTED: We wrap it in a function and filter it so it doesn't crash */}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(getDefaultReactSlashMenuItems(editor), query)
          }
        />
        
        {/* Your custom @ linking menu */}
        <SuggestionMenuController
          triggerCharacter={"@"}
          getItems={getMentionItems}
        />
      </BlockNoteView>
    </div>
  );
}

// --- 2. THE DATA LOADER ---
function BlockEditor({ documentId, onSyncStatusChange, nodes, onAddLink }) {
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
      nodes={nodes}
      onAddLink={onAddLink}
    />
  );
}

export default BlockEditor;