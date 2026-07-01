"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRangeSelection } from "lexical";
import { useEffect } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { blockTypes, shortcutMap } from "./blockTypes";

import { $getSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_CHECK_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from "@lexical/list";

import { $createCodeNode } from "@lexical/code";
import {
    $createHeadingNode,
    $createQuoteNode,
} from "@lexical/rich-text";

import { $createParagraphNode } from "lexical";

export default function BlockType() {
    const [editor] = useLexicalComposerContext();

    const [value, setValue] = useState("paragraph");

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = `${e.altKey ? "Alt+" : ""}${e.key}`;

            const value = shortcutMap[key];
            if (!value) return;

            e.preventDefault();
            handleChange(value);
        };

        window.addEventListener("keydown", handler);

        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleChange = (newValue: string) => {
        setValue(newValue);

        switch (newValue) {
            case "bullet":
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                return;

            case "number":
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                return;

            case "check":
                editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
                return;
        }

        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            switch (newValue) {
                case "paragraph":
                    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    $setBlocksType(selection, () => $createParagraphNode());
                    break;

                case "h1":
                    $setBlocksType(selection, () => $createHeadingNode("h1"));
                    break;

                case "h2":
                    $setBlocksType(selection, () => $createHeadingNode("h2"));
                    break;

                case "h3":
                    $setBlocksType(selection, () => $createHeadingNode("h3"));
                    break;

                case "quote":
                    $setBlocksType(selection, () => $createQuoteNode());
                    break;

                case "code":
                    $setBlocksType(selection, () => $createCodeNode());
                    break;
            }
        });
    };

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Normal">
                    {(() => {
                        const item = blockTypes.find((t) => t.value === value);
                        if (!item) return "Normal";

                        const Icon = item.icon;

                        return (
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </div>
                        );
                    })()}
                </SelectValue>
            </SelectTrigger>

            <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={8}
                className="min-w-55"
            >
                {blockTypes.map((item) => {
                    const Icon = item.icon;

                    return (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                            className="flex w-full items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </div>

                            {item.shortcut && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {item.shortcut}
                                </span>
                            )}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}