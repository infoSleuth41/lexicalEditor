"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { Type } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const fonts = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
];

export default function FontFamily() {
    const [editor] = useLexicalComposerContext();
    const [value, setValue] = useState(fonts[0].value);

    const applyFont = (font: string) => {
        setValue(font);

        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            $patchStyleText(selection, {
                "font-family": font,
            });
        });
    };

    const currentFont = fonts.find((f) => f.value === value);

    return (
        <Select value={value} onValueChange={applyFont}>
            <SelectTrigger className="w-40">
                <SelectValue>
                    <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <span className="text-sm">
                            {currentFont?.label ?? "Font"}
                        </span>
                    </div>
                </SelectValue>
            </SelectTrigger>

            <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={8}
                className="min-w-55"
            >
                {fonts.map((font) => (
                    <SelectItem
                        key={font.value}
                        value={font.value}
                        className="flex items-center justify-between"
                    >
                        <span style={{ fontFamily: font.value }}>
                            {font.label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}