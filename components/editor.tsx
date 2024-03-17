'use client';

import { useTheme } from 'next-themes';
import {
  BlockNoteEditor,
  PartialBlock,
} from '@blocknote/core';
import {
  BlockNoteView,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import { useEdgeStore } from '@/lib/edgestore';

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({
  onChange,
  initialContent,
  editable,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });

    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        onChange={() => {
          onChange(
            JSON.stringify(editor.document, null, 2)
          );
        }}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        editable={editable}
        editor={editor}
      />
    </div>
  );
};

export default Editor;
