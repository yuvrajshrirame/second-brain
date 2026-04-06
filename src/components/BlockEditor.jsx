import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; 
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css"; 

function BlockEditor() {
  const editor = useCreateBlockNote();

  return (
    <div style={{ color: '#fff' }}>
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}

export default BlockEditor;