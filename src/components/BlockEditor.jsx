import React, { useState, useEffect, useRef } from 'react';
import { filterSuggestionItems } from "@blocknote/core"; 
import { useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
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
    const filteredNodes = nodes.filter(node => 
      node.name.toLowerCase().includes(query.toLowerCase()) && 
      node.id !== documentId
    );

    const items = filteredNodes.map((node) => ({
      title: `Link to: ${node.name}`,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "text",
            text: `[[${node.name}]]`,
            styles: { textColor: "yellow" } 
          },
          { type: "text", text: " ", styles: {} }
        ]);
        onAddLink(documentId, node.id);
      },
    }));

    const exactMatch = nodes.some(n => n.name.toLowerCase() === query.toLowerCase());
    
    if (query.trim().length > 0 && !exactMatch) {
      items.push({
        title: `+ Create new node: "${query}"`,
        onItemClick: async () => {
          onSyncStatusChange('syncing');
          const newNodeRef = await addDoc(collection(db, 'nodes'), { 
            name: query, 
            content: '',
            val: 3, 
            createdAt: Date.now() 
          });

          editor.insertInlineContent([
            {
              type: "text",
              text: `[[${query}]]`,
              styles: { textColor: "yellow" }
            },
            { type: "text", text: " ", styles: {} }
          ]);

          onAddLink(documentId, newNodeRef.id);
          onSyncStatusChange('saved');
        }
      });
    }

    return items;
  };

  return (
    <div className="notion-editor-wrapper" style={{ marginTop: '0.5rem' }}>
      <BlockNoteView 
        editor={editor} 
        theme="dark" 
        onChange={handleEditorChange} 
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(getDefaultReactSlashMenuItems(editor), query)
          }
        />
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