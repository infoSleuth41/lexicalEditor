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
import { Underline as UnderlineIcon } from "lucide-react";

import { Button } from "../ui/button";

export default function Underline() {
    const [editor] = useLexicalComposerContext();
    const [isUnderline, setIsUnderline] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsUnderline(selection.hasFormat("underline"));
                    }
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsUnderline(selection.hasFormat("underline"));
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
            variant={isUnderline ? "secondary" : "ghost"}
            size="icon"
            onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
        >
            <UnderlineIcon className="h-4 w-4" />
        </Button>
    );
}