"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createPollNode, INSERT_POLL_COMMAND } from "../toolbar/PollNode";

export default function PollPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            INSERT_POLL_COMMAND,
            (payload) => {
                const pollNode = $createPollNode(payload.question);
                $insertNodes([pollNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}