"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";

const PRESETS = [
  "#FFF59D",
  "#FFCDD2",
  "#C8E6C9",
  "#BBDEFB",
  "#E1BEE7",
  "#FFE0B2",
  "#D7CCC8",
  "#F5F5F5",
];

export default function TextBackgroundColor() {
  const [editor] = useLexicalComposerContext();

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#FFF59D");

  const applyBgColor = (value: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.getNodes().forEach((node) => {
        if (node instanceof TextNode) {
          node.setStyle(`background-color:${value}`);
        }
      });
    });

    editor.focus();
  };

  const handleApply = () => {
    applyBgColor(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted relative">
          <Highlighter className="h-4 w-4" />

          {/* tiny preview bar */}
          <span
            className="absolute bottom-1 h-0.5 w-4 rounded"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-75 p-4 space-y-4 rounded-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Background Color</p>

          <div
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="h-px bg-border" />

        {/* Picker */}
        <div className="space-y-3">
          <HexColorPicker
            color={color}
            onChange={setColor}
            style={{ width: "100%" }}
          />

          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Presets</p>

          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setColor(preset);
                  applyBgColor(preset);
                }}
                className="h-8 w-8 rounded-md border transition hover:scale-110"
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApply}>
            Apply
          </Button>

          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}