import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // <-- WE IMPORTED PORTAL
import { filterSuggestionItems } from "@blocknote/core"; 
import { useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { MermaidBlock } from "./MermaidBlock";
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

const CustomMenu = (props) => {
  return (
    <div className="cyber-slash-menu-wrapper">
      {props.items.map((item, index) => (
        <div
          key={index}
          className={`cyber-slash-menu-item ${index === props.selectedIndex ? 'selected' : ''}`}
          onMouseDown={(e) => {
            // PREVENTS EDITOR BLUR SO THE CLICK ACTUALLY FIRES
            e.preventDefault(); 
            props.onItemClick(item);
          }}
        >
          {item.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{item.title}</span>
            {item.subtext && <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{item.subtext}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- CUSTOM SCHEMA ---
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    mermaid: MermaidBlock(),
  },
});

// --- 1. THE ACTUAL EDITOR ---
function EditorCore({ documentId, initialContent, onSyncStatusChange, nodes, links, onAddLink, onRemoveLink, user }) {
  const editor = useCreateBlockNote({ schema, initialContent });
  const debounceTimer = useRef(null);
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);

  useEffect(() => {
    nodesRef.current = nodes;
    linksRef.current = links;
  }, [nodes, links]);
  
  // --- AUTO-SYNAPSE STATE ---
  const [suggestedSynapse, setSuggestedSynapse] = useState(null);

  // --- NEURAL COPILOT STATE ---
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiTargetBlock, setAiTargetBlock] = useState(null);

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
        
        const plainText = editor.document.map(block => {
          if (Array.isArray(block.content)) {
            return block.content.map(c => c.text || '').join('');
          }
          return '';
        }).join(' ').toLowerCase();

        let foundSuggestion = null;
        const currentNodes = nodesRef.current;
        const currentLinks = linksRef.current;

        for (const node of currentNodes) {
          if (String(node.id) === String(documentId) || !node.name || node.name.length < 3) continue;

          const alreadyLinked = currentLinks.some(l => {
            const sId = String(typeof l.source === 'object' ? l.source.id : l.source);
            const tId = String(typeof l.target === 'object' ? l.target.id : l.target);
            const docIdStr = String(documentId);
            const nodeIdStr = String(node.id);
            return (sId === docIdStr && tId === nodeIdStr) || (sId === nodeIdStr && tId === docIdStr);
          });

          if (!alreadyLinked && isSemanticMatch(plainText, node.name)) {
            foundSuggestion = node;
            break; 
          }
        }
        
        setSuggestedSynapse(foundSuggestion);

        const activeLinks = currentLinks.filter(l => {
          const sId = String(typeof l.source === 'object' ? l.source.id : l.source);
          const tId = String(typeof l.target === 'object' ? l.target.id : l.target);
          const docIdStr = String(documentId);
          return sId === docIdStr || tId === docIdStr;
        });

        for (const link of activeLinks) {
          const sId = String(typeof link.source === 'object' ? link.source.id : link.source);
          const tId = String(typeof link.target === 'object' ? link.target.id : link.target);
          const docIdStr = String(documentId);
          const otherNodeId = sId === docIdStr ? tId : sId;
          
          const otherNode = currentNodes.find(n => String(n.id) === otherNodeId);

          if (otherNode) {
            const hasSemanticMatch = isSemanticMatch(plainText, otherNode.name);
            const hasLiteralMatch = plainText.includes(`[[${otherNode.name.toLowerCase()}]]`);

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

  // --- NEURAL COPILOT EXECUTION ENGINE ---
  const handleExecuteAI = async () => {
    if (!aiInput.trim() || !aiTargetBlock) return;

    const query = aiInput;
    const currentBlock = aiTargetBlock;

    setIsAiModalOpen(false);
    setAiInput("");
    
    editor.updateBlock(currentBlock, {
      type: "paragraph",
      content: "✨ Fetching neural response..."
    });

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
      
      const allText = editor.document.map(b => b.content ? b.content.map(c => c.text).join('') : '').join('\n');
      
      const promptText = `You are an AI co-pilot inside a high-fidelity Zettelkasten note-taking app. 
      Here is the current document's context:\n"${allText}"\n\n
      The user wants you to do the following: "${query}"
      Respond using rich Markdown formatting (headings, bullet points, bold text, and code blocks). 
      CRITICAL INSTRUCTION: If the user asks for a diagram, flowchart, graph, or visual representation, you MUST ALWAYS generate it using valid Mermaid.js syntax inside a \`\`\`mermaid code block. Do NOT use backslashes for line breaks. ALWAYS wrap node labels in double quotes (e.g., A["Label with spaces and (special) chars"] ) to prevent syntax errors.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      // Intercept Mermaid blocks and inject them as our custom React blocks
      let finalBlocks = [];
      const parts = text.split(/(```mermaid\n[\s\S]*?\n```)/g);
      
      for (const part of parts) {
        if (part.startsWith('```mermaid')) {
          let code = part.replace(/^```mermaid\n/, '').replace(/\n```$/, '');
          finalBlocks.push({
            type: "mermaid",
            props: { code: code.trim() }
          });
        } else if (part.trim()) {
          const blocks = await editor.tryParseMarkdownToBlocks(part);
          finalBlocks = finalBlocks.concat(blocks);
        }
      }

      if (finalBlocks.length === 0) {
        finalBlocks = [{ type: "paragraph", content: text }];
      }

      editor.replaceBlocks([currentBlock], finalBlocks);
      handleEditorChange();

    } catch (error) {
      console.error(error);
      editor.updateBlock(currentBlock, {
        type: "paragraph",
        content: "❌ Neural Link Failed. Check your API key or network connection."
      });
    }
  };

  const insertAIAssistant = (editor) => ({
    title: "Neural Copilot",
    onItemClick: () => {
      setAiTargetBlock(editor.getTextCursorPosition().block);
      setIsAiModalOpen(true);
    },
    aliases: ["ai", "copilot", "gemini", "generate"],
    group: "Neural Tools", 
    icon: <span style={{ fontSize: '14px' }}>✨</span>,
  });

  const insertMermaid = (editor) => ({
    title: "Mermaid Diagram",
    onItemClick: () => {
      editor.insertBlocks(
        [
          {
            type: "mermaid",
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    aliases: ["mermaid", "diagram", "chart"],
    group: "Advanced Tools", 
    icon: <span style={{ fontSize: '14px' }}>📊</span>,
  });

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
            createdAt: Date.now(),
            userId: user.uid
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
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), insertAIAssistant(editor), insertMermaid(editor)], query)
          }
          suggestionMenuComponent={CustomMenu}
        />
        <SuggestionMenuController
          triggerCharacter={"@"}
          getItems={getMentionItems}
          suggestionMenuComponent={CustomMenu}
        />
      </BlockNoteView>

      {/* --- CYBER MODAL TELEPORTED VIA PORTAL --- */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAiModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ background: '#050508', border: '1px solid #1a1a1a', borderLeft: '3px solid var(--accent)', width: '500px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
              >
                <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '1rem', marginTop: 0, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>✨</span> NEURAL COPILOT
                </h3>
                <p style={{ color: '#888', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  What should I write, analyze, or expand on?
                </p>
                
                <input 
                  autoFocus
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteAI();
                    if (e.key === 'Escape') {
                      setIsAiModalOpen(false);
                      setAiInput("");
                    }
                  }}
                  placeholder="e.g. Summarize the concept of React Hooks..."
                  style={{ background: '#0a0a0f', border: '1px solid #333', color: '#fff', width: '100%', padding: '0.8rem', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', marginBottom: '1.5rem', borderRadius: '2px', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    onClick={() => {
                      setIsAiModalOpen(false);
                      setAiInput("");
                    }}
                    style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '2px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleExecuteAI}
                    style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }}
                  >
                    Initialize Run
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* --- AUTO-SYNAPSE UI TELEPORTED VIA PORTAL --- */}
      {typeof document !== 'undefined' && createPortal(
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
        </AnimatePresence>,
        document.body
      )}
      
    </div>
  );
}

// --- 2. THE DATA LOADER ---
function BlockEditor({ documentId, onSyncStatusChange, nodes, links, onAddLink, onRemoveLink, user }) {
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
      user={user}
    />
  );
}

export default BlockEditor;