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
import { Palette } from "lucide-react";

const PRESETS = [
  "#000000",
  "#374151",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function TextColor() {
  const [editor] = useLexicalComposerContext();

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#000000");

  const applyColor = (value: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.getNodes().forEach((node) => {
        if (node instanceof TextNode) {
          node.setStyle(`color:${value}`);
        }
      });
    });

    editor.focus();
  };

  const handleApply = () => {
    applyColor(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted transition"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[300px] p-4 space-y-4 rounded-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Text Color</p>

          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color }}
            title={color}
          />
        </div>

        <div className="h-px bg-border" />

        {/* Picker */}
        <div className="space-y-3">
          <HexColorPicker
            color={color}
            onChange={(c) => setColor(c)}
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

          <div className="grid grid-cols-5 gap-2">
            {PRESETS.map((preset) => {
              const isActive = preset === color;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setColor(preset);
                    applyColor(preset);
                  }}
                  className={`h-8 w-8 rounded-md border transition-all hover:scale-110 ${
                    isActive ? "ring-2 ring-offset-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: preset }}
                />
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApply}>
            Apply
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}