import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; // Changed from @blocknote/react
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; // Changed from @blocknote/react/style.css

function BlockEditor() {
  // Initializes the editor
  const editor = useCreateBlockNote();

  return (
    <div style={{ padding: '2rem', height: '100%', color: '#fff' }}>
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}

export default BlockEditor;