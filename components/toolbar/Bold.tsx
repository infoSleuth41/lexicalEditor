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
import { Bold as BoldIcon } from "lucide-react";

import { Button } from "../ui/button";

export default function Bold() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsBold(selection.hasFormat("bold"));
                    }
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        setIsBold(selection.hasFormat("bold"));
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
            variant={isBold ? "secondary" : "ghost"}
            size="icon"
            onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
            }
        >
            <BoldIcon className="h-4 w-4" />
        </Button>
    );
}