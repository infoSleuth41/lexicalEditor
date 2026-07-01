"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import type { LexicalEditor } from "lexical";

type ContextType = {
    editor: LexicalEditor | null;
    setEditor: (editor: LexicalEditor) => void;
};

const EditorContext = createContext<ContextType | null>(null);

export function EditorProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [editor, setEditor] = useState<LexicalEditor | null>(null);

    return (
        <EditorContext.Provider
            value={{
                editor,
                setEditor,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export function useEditorContext() {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error(
            "useEditorContext must be used inside EditorProvider"
        );
    }

    return context;
}