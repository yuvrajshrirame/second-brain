import React, { useState, useEffect, useRef } from 'react';
import { filterSuggestionItems } from "@blocknote/core"; 
import { useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { AnimatePresence, motion } from 'framer-motion';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; 

// --- LOCAL NLP HEURISTIC ENGINE ---
const STOP_WORDS = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "for", "on", "with", "as", "is", "it", "this", "that", "at", "by", "from"]);

function isSemanticMatch(plainText, nodeName) {
  const textLower = plainText.toLowerCase();
  const nameLower = nodeName.toLowerCase();

  if (textLower.includes(nameLower)) return true;

  const nameTokens = nameLower.split(/[\s,.-]+/).filter(word => 
    word.length > 2 && !STOP_WORDS.has(word) 
  );

  if (nameTokens.length === 0) return false;

  let matchCount = 0;
  for (const token of nameTokens) {
    const regex = new RegExp(`\\b${token}\\b`, 'i');
    if (regex.test(textLower)) {
      matchCount++;
    }
  }

  const matchPercentage = matchCount / nameTokens.length;
  return matchPercentage >= 0.75; 
}

// --- 1. THE ACTUAL EDITOR ---
function EditorCore({ documentId, initialContent, onSyncStatusChange, nodes, links, onAddLink, onRemoveLink }) {
  const editor = useCreateBlockNote({ initialContent });
  const debounceTimer = useRef(null);
  
  // --- AUTO-SYNAPSE STATE ---
  const [suggestedSynapse, setSuggestedSynapse] = useState(null);

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
        
        // 1. Extract plain text from the editor
        const plainText = editor.document.map(block => {
          if (Array.isArray(block.content)) {
            return block.content.map(c => c.text || '').join('');
          }
          return '';
        }).join(' ').toLowerCase();

        // 2. Scan for unlinked connections using Semantic NLP
        let foundSuggestion = null;
        for (const node of nodes) {
          if (node.id === documentId || !node.name || node.name.length < 3) continue;

          const alreadyLinked = links.some(l => {
            const sId = typeof l.source === 'object' ? l.source.id : l.source;
            const tId = typeof l.target === 'object' ? l.target.id : l.target;
            return (sId === documentId && tId === node.id) || (sId === node.id && tId === documentId);
          });

          if (!alreadyLinked && isSemanticMatch(plainText, node.name)) {
            foundSuggestion = node;
            break; 
          }
        }
        
        setSuggestedSynapse(foundSuggestion);

        // --- 3. STALE SYNAPSE CLEANUP ENGINE ---
        const activeLinks = links.filter(l => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          return sId === documentId || tId === documentId;
        });

        for (const link of activeLinks) {
          const sId = typeof link.source === 'object' ? link.source.id : link.source;
          const tId = typeof link.target === 'object' ? link.target.id : link.target;
          const otherNodeId = sId === documentId ? tId : sId;
          
          const otherNode = nodes.find(n => n.id === otherNodeId);

          if (otherNode) {
            const hasSemanticMatch = isSemanticMatch(plainText, otherNode.name);
            const hasLiteralMatch = plainText.includes(`[[${otherNode.name.toLowerCase()}]]`);

            // If the text has been deleted, sever the neural link!
            if (!hasSemanticMatch && !hasLiteralMatch) {
              onRemoveLink(link.id);
            }
          }
        }

        onSyncStatusChange('saved');

      } catch (error) {
        console.error("Sync failed", error);
        onSyncStatusChange('error');
      }
    }, 1000); 
  };

  const handleAcceptSynapse = () => {
    if (suggestedSynapse) {
      onAddLink(documentId, suggestedSynapse.id);
      setSuggestedSynapse(null); 
    }
  };

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
    <div className="notion-editor-wrapper" style={{ marginTop: '0.5rem', position: 'relative' }}>
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

      <AnimatePresence>
        {suggestedSynapse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#050508',
              border: '1px solid var(--accent)',
              padding: '12px 24px',
              borderRadius: '4px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 9999,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)' }}></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff' }}>
                Synapse Detected: <span style={{ color: 'var(--accent)' }}>{suggestedSynapse.name}</span>
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleAcceptSynapse}
                style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }}
              >
                Form Link
              </button>
              <button 
                onClick={() => setSuggestedSynapse(null)}
                style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '2px' }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// --- 2. THE DATA LOADER ---
function BlockEditor({ documentId, onSyncStatusChange, nodes, links, onAddLink, onRemoveLink }) {
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
      links={links}
      onAddLink={onAddLink}
      onRemoveLink={onRemoveLink}
    />
  );
}

export default BlockEditor;