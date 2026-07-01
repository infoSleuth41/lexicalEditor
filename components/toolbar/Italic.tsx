"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
} from "lexical";

import { mergeRegister } from "@lexical/utils";
import { Italic as ItalicIcon } from "lucide-react";

import { Button } from "../ui/button";

export default function Italic() {
    const [editor] = useLexicalComposerContext();
    const [isItalic, setIsItalic] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsItalic(selection.hasFormat("italic"));
                    }
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsItalic(selection.hasFormat("italic"));
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    return (
        <Button
            type="button"
            variant={isItalic ? "secondary" : "ghost"}
            size="icon"
            onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
        >
            <ItalicIcon className="h-4 w-4" />
        </Button>
    );
}