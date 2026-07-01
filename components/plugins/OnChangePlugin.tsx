"use client";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEditorContext } from "../editor/EditorContext";

export default function EditorOnChangePlugin() {
  const { setEditor } = useEditorContext();
  return (
    <OnChangePlugin
      onChange={(editorState, editor) => {
        setEditor(editor);
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          console.log(html);
        });
      }}
    />
  );
}