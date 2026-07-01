"use client";

import { useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    TOGGLE_LINK_COMMAND,
    $isLinkNode,
} from "@lexical/link";
import {
    $getSelection,
    $isRangeSelection,
    $setSelection,
    BaseSelection,
} from "lexical";
import { Link as LinkIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";

export default function LinkButton() {
    const [editor] = useLexicalComposerContext();

    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [isLink, setIsLink] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const selectionRef = useRef<BaseSelection | null>(null);

    const applyLink = () => {
        let finalUrl: string | null = null;

        if (url.trim()) {
            finalUrl = url.trim();

            if (
                !finalUrl.startsWith("http://") &&
                !finalUrl.startsWith("https://")
            ) {
                finalUrl = `https://${finalUrl}`;
            }
        }

        editor.update(() => {
            if (selectionRef.current) {
                $setSelection(selectionRef.current);
            }

            editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                finalUrl
            );
        });

        setOpen(false);
        setUrl("");
        setIsLink(false);
    };

    const removeLink = () => {
        editor.update(() => {
            if (selectionRef.current) {
                $setSelection(selectionRef.current);
            }

            editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                null
            );
        });

        setOpen(false);
        setUrl("");
        setIsLink(false);
    };

    const close = () => {
        setOpen(false);
        setUrl("");
        setIsLink(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(value) => {
                if (value) {
                    editor.getEditorState().read(() => {
                        const selection = $getSelection();

                        selectionRef.current = selection
                            ? selection.clone()
                            : null;

                        setUrl("");
                        setIsLink(false);

                        if ($isRangeSelection(selection)) {
                            const node = selection.anchor.getNode();

                            const parent = node.getParent();

                            if ($isLinkNode(node)) {
                                setUrl(node.getURL());
                                setIsLink(true);
                            } else if (parent && $isLinkNode(parent)) {
                                setUrl(parent.getURL());
                                setIsLink(true);
                            }
                        }
                    });
                }

                setOpen(value);

                if (value) {
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 50);
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="center"
                side="top"
                className="w-80 space-y-3"
            >
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                        {isLink ? "Edit Link" : "Insert Link"}
                    </h4>

                    <Input
                        ref={inputRef}
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                applyLink();
                            }
                        }}
                    />
                </div>

                <div className="flex justify-between">
                    {isLink ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={removeLink}
                        >
                            Remove
                        </Button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={close}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            onClick={applyLink}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}