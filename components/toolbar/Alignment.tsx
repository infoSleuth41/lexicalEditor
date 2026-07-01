"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ArrowLeftToLine,
    ArrowRightToLine,
    IndentIncrease,
    IndentDecrease,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type AlignValue =
    | "left"
    | "center"
    | "right"
    | "justify"
    | "start"
    | "end"

const ALIGN_OPTIONS: {
    value: AlignValue;
    label: string;
    icon: React.ReactNode;
}[] = [
        { value: "left", label: "Left Align", icon: <AlignLeft size={16} /> },
        { value: "center", label: "Center Align", icon: <AlignCenter size={16} /> },
        { value: "right", label: "Right Align", icon: <AlignRight size={16} /> },
        { value: "justify", label: "Justify", icon: <AlignJustify size={16} /> },
        { value: "start", label: "Start Align", icon: <ArrowLeftToLine size={16} /> },
        { value: "end", label: "End Align", icon: <ArrowRightToLine size={16} /> },
    ];

export default function AlignmentDropdown() {
    const [editor] = useLexicalComposerContext();

    // 👇 this is the whole fix
    const [value, setValue] = useState<AlignValue>("left");

    const handleChange = (val: AlignValue) => {
        setValue(val);

        editor.update(() => {
            switch (val) {
                case "left":
                case "center":
                case "right":
                case "justify":
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, val);
                    break;

                case "start":
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                    break;

                case "end":
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                    break;
            }
        });
    };

    const selected = ALIGN_OPTIONS.find((o) => o.value === value);

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                    <SelectValue placeholder="Alignment" />
                </div>
            </SelectTrigger>

            <SelectContent position="popper" side="bottom" align="start">
                {ALIGN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                            {opt.icon}
                            <span>{opt.label}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}