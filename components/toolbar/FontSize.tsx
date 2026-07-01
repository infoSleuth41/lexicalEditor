"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

const MIN_SIZE = 8;
const MAX_SIZE = 72;
const DEFAULT_SIZE = 16;

export default function FontSize() {
    const [editor] = useLexicalComposerContext();
    const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

    const applyFontSize = (size: number) => {
        const newSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size));

        setFontSize(newSize);

        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            $patchStyleText(selection, {
                "font-size": `${newSize}px`,
            });
        });
    };

    return (
        <div className="flex items-center">
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-6 p-0"
                onClick={() => applyFontSize(fontSize - 1)}
                disabled={fontSize <= MIN_SIZE}
            >
                <Minus className="h-3.5 w-3.5" />
            </Button>

            <div className="mx-0.5 flex h-7 w-10 items-center justify-center rounded-md border text-sm font-medium">
                {fontSize}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-6 p-0"
                onClick={() => applyFontSize(fontSize + 1)}
                disabled={fontSize >= MAX_SIZE}
            >
                <Plus className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}