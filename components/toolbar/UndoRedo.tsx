"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    REDO_COMMAND,
    UNDO_COMMAND,
} from "lexical";

import { Redo2, Undo2 } from "lucide-react";
import ToolbarButton from "./ToolbarButton";

export default function UndoRedo() {
    const [editor] = useLexicalComposerContext();

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    useEffect(() => {
        const unregisterUndo = editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        const unregisterRedo = editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        return () => {
            unregisterUndo();
            unregisterRedo();
        };
    }, [editor]);

    return (
        <>
            <ToolbarButton
                icon={Undo2}
                disabled={!canUndo}
                tooltip="Undo"
                shortcut="Ctrl+Z"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            />

            <ToolbarButton
                icon={Redo2}
                disabled={!canRedo}
                tooltip="Redo"
                shortcut="Ctrl+Y"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            />
        </>
    );
}