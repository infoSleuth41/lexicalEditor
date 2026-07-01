"use client";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  shortcut?: string;
}

export default function ToolbarButton({
  icon: Icon,
  onClick,
  disabled,
  tooltip,
  shortcut,
}: ToolbarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="flex items-center gap-6 px-3 py-2"
        >
          <span>{tooltip}</span>

          {shortcut && (
            <span className="text-xs text-muted-foreground">
              {shortcut}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}