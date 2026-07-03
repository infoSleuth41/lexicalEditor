"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { TableCellNode } from "@lexical/table";
import {
    GripVertical,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Trash2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
    $getTableCellFromSelection,
    $getRowFromCell,
    $getTableFromRow,
    $getColumnIndex,
    $insertRow,
    $insertColumn,
    $deleteRow,
    $deleteColumn,
} from "../toolbar/TableUtils";

export default function TableActionMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    const [cellKey, setCellKey] = useState<string | null>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const updatePosition = useCallback(() => {
        if (!cellKey) {
            setRect(null);
            return;
        }
        const el = editor.getElementByKey(cellKey);
        if (!el) {
            setRect(null);
            return;
        }
        setRect(el.getBoundingClientRect());
    }, [editor, cellKey]);

    // Track which cell (if any) the selection is currently inside.
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const cell = $getTableCellFromSelection();
                setCellKey(cell ? cell.getKey() : null);
            });
        });
    }, [editor]);

    useEffect(() => {
        updatePosition();
    }, [updatePosition]);

    // Reposition on scroll (capture phase, since the editor scrolls in an
    // inner container) and on resize.
    useEffect(() => {
        const handler = () => updatePosition();
        window.addEventListener("scroll", handler, true);
        window.addEventListener("resize", handler);
        return () => {
            window.removeEventListener("scroll", handler, true);
            window.removeEventListener("resize", handler);
        };
    }, [updatePosition]);

    if (!cellKey || !rect || typeof document === "undefined") return null;

    const runTableUpdate = (fn: (cell: TableCellNode) => void) => {
        editor.update(() => {
            const cell = $getTableCellFromSelection();
            if (!cell) return;
            fn(cell);
        });
        setMenuOpen(false);
    };

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: rect.top - 2,
                left: rect.left - 26,
                zIndex: 50,
            }}
        >
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        contentEditable={false}
                        className="flex h-5 w-5 items-center justify-center rounded border bg-background shadow-sm hover:bg-muted"
                    >
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuItem
                        className="gap-2"
                        onSelect={() =>
                            runTableUpdate((cell) => $insertRow($getRowFromCell(cell), "above"))
                        }
                    >
                        <ArrowUp className="h-4 w-4" /> Insert row above
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2"
                        onSelect={() =>
                            runTableUpdate((cell) => $insertRow($getRowFromCell(cell), "below"))
                        }
                    >
                        <ArrowDown className="h-4 w-4" /> Insert row below
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2"
                        onSelect={() =>
                            runTableUpdate((cell) => {
                                const row = $getRowFromCell(cell);
                                const table = $getTableFromRow(row);
                                $insertColumn(table, $getColumnIndex(cell), "left");
                            })
                        }
                    >
                        <ArrowLeft className="h-4 w-4" /> Insert column left
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2"
                        onSelect={() =>
                            runTableUpdate((cell) => {
                                const row = $getRowFromCell(cell);
                                const table = $getTableFromRow(row);
                                $insertColumn(table, $getColumnIndex(cell), "right");
                            })
                        }
                    >
                        <ArrowRight className="h-4 w-4" /> Insert column right
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => runTableUpdate((cell) => $deleteRow($getRowFromCell(cell)))}
                    >
                        <Trash2 className="h-4 w-4" /> Delete row
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() =>
                            runTableUpdate((cell) => {
                                const row = $getRowFromCell(cell);
                                const table = $getTableFromRow(row);
                                $deleteColumn(table, $getColumnIndex(cell));
                            })
                        }
                    >
                        <Trash2 className="h-4 w-4" /> Delete column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() =>
                            runTableUpdate((cell) => {
                                const row = $getRowFromCell(cell);
                                const table = $getTableFromRow(row);
                                table.remove();
                            })
                        }
                    >
                        <Trash2 className="h-4 w-4" /> Delete table
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>,
        document.body
    );
}