"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  ChevronDown,
  CaseSensitive,
  CaseUpper,
  CaseLower,
  Strikethrough,
  Subscript,
  Superscript,
  X,
} from "lucide-react";

export default function TextTransformDropdown() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);

  const updateText = (transform: (text: string) => string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.getNodes().forEach((node) => {
        if (node instanceof TextNode) {
          node.setTextContent(transform(node.getTextContent()));
        }
      });
    });

    editor.focus();
  };

  const applyFormat = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.getNodes().forEach((node) => {
        if (!(node instanceof TextNode)) return;

        switch (type) {
          case "strike":
            node.toggleFormat("strikethrough");
            break;
          case "sub":
            node.toggleFormat("subscript");
            break;
          case "sup":
            node.toggleFormat("superscript");
            break;
          case "clear":
            node.setFormat(0);
            node.setStyle("");
            break;
        }
      });
    });

    editor.focus();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          Aa
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {/* UPPERCASE */}
        <DropdownMenuItem onClick={() => updateText((t) => t.toUpperCase())} className="flex justify-between">
          <div className="flex items-center gap-2">
            <CaseUpper className="h-4 w-4" />
            <span>UPPERCASE</span>
          </div>
          <span className="text-xs text-muted-foreground">ABC</span>
        </DropdownMenuItem>

        {/* lowercase */}
        <DropdownMenuItem onClick={() => updateText((t) => t.toLowerCase())} className="flex justify-between">
          <div className="flex items-center gap-2">
            <CaseLower className="h-4 w-4" />
            <span>lowercase</span>
          </div>
          <span className="text-xs text-muted-foreground">abc</span>
        </DropdownMenuItem>

        {/* Capitalize */}
        <DropdownMenuItem
          onClick={() =>
            updateText((t) =>
              t
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ")
            )
          }
          className="flex justify-between"
        >
          <div className="flex items-center gap-2">
            <CaseSensitive className="h-4 w-4" />
            <span>Capitalize</span>
          </div>
          <span className="text-xs text-muted-foreground">Abc</span>
        </DropdownMenuItem>

        <div className="h-px bg-border my-1" />

        {/* Strikethrough */}
        <DropdownMenuItem onClick={() => applyFormat("strike")} className="flex justify-between">
          <div className="flex items-center gap-2">
            <Strikethrough className="h-4 w-4" />
            <span>Strikethrough</span>
          </div>
          <span className="text-xs text-muted-foreground">abc</span>
        </DropdownMenuItem>

        {/* Subscript */}
        <DropdownMenuItem onClick={() => applyFormat("sub")} className="flex justify-between">
          <div className="flex items-center gap-2">
            <Subscript className="h-4 w-4" />
            <span>Subscript</span>
          </div>
          <span className="text-xs text-muted-foreground">x₂</span>
        </DropdownMenuItem>

        {/* Superscript */}
        <DropdownMenuItem onClick={() => applyFormat("sup")} className="flex justify-between">
          <div className="flex items-center gap-2">
            <Superscript className="h-4 w-4" />
            <span>Superscript</span>
          </div>
          <span className="text-xs text-muted-foreground">x²</span>
        </DropdownMenuItem>

        <div className="h-px bg-border my-1" />

        {/* Clear */}
        <DropdownMenuItem onClick={() => applyFormat("clear")} className="flex justify-between">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4" />
            <span>Clear formatting</span>
          </div>
          <span className="text-xs text-muted-foreground">reset</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}