"use client";

import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { Plus, ChevronDown, Minus, Image as ImageIcon, Table2, BarChart3 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { INSERT_IMAGE_COMMAND } from "./ImageNode";
import { INSERT_POLL_COMMAND } from "./PollNode";

type DialogMode = "image" | "table" | "poll" | null;

export default function Insert() {
    const [editor] = useLexicalComposerContext();
    const [dialogMode, setDialogMode] = useState<DialogMode>(null);

    // image state
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    // table state
    const [rows, setRows] = useState("3");
    const [columns, setColumns] = useState("3");

    // poll state
    const [pollQuestion, setPollQuestion] = useState("");

    const closeDialog = () => {
        setDialogMode(null);
        setImageUrl("");
        setImageAlt("");
        setRows("3");
        setColumns("3");
        setPollQuestion("");
    };

    const handleInsertHorizontalRule = () => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImageUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const confirmInsertImage = () => {
        if (!imageUrl.trim()) return;
        const src = imageUrl.trim();
        const altText = imageAlt.trim() || "image";
        // The dialog steals focus from the editor, which clears its
        // selection. Re-focus + restore a selection before dispatching,
        // or the insert silently no-ops.
        editor.focus(
            () => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
            },
            { defaultSelection: "rootEnd" }
        );
        closeDialog();
    };

    const confirmInsertTable = () => {
        const r = String(Math.max(1, Math.min(20, Number(rows) || 3)));
        const c = String(Math.max(1, Math.min(10, Number(columns) || 3)));
        editor.focus(
            () => {
                editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: r, columns: c });
            },
            { defaultSelection: "rootEnd" }
        );
        closeDialog();
    };

    const confirmInsertPoll = () => {
        const question = pollQuestion.trim() || "Untitled poll";
        editor.focus(
            () => {
                editor.dispatchCommand(INSERT_POLL_COMMAND, { question });
            },
            { defaultSelection: "rootEnd" }
        );
        closeDialog();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Insert
                        <ChevronDown className="h-3 w-3 opacity-60" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onSelect={handleInsertHorizontalRule} className="gap-2">
                        <Minus className="h-4 w-4" />
                        Horizontal Rule
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setDialogMode("image")} className="gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Image
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setDialogMode("table")} className="gap-2">
                        <Table2 className="h-4 w-4" />
                        Table
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setDialogMode("poll")} className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Poll
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Image dialog */}
            <Dialog open={dialogMode === "image"} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="image-upload">Upload from device</Label>
                            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageFileChange} />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">or</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                placeholder="https://example.com/photo.jpg"
                                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image-alt">Alt text (optional)</Label>
                            <Input
                                id="image-alt"
                                placeholder="Describe the image"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeDialog}>
                            Cancel
                        </Button>
                        <Button onClick={confirmInsertImage} disabled={!imageUrl.trim()}>
                            Insert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Table dialog */}
            <Dialog open={dialogMode === "table"} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Insert Table</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="table-rows">Rows</Label>
                            <Input
                                id="table-rows"
                                type="number"
                                min={1}
                                max={20}
                                value={rows}
                                onChange={(e) => setRows(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="table-columns">Columns</Label>
                            <Input
                                id="table-columns"
                                type="number"
                                min={1}
                                max={10}
                                value={columns}
                                onChange={(e) => setColumns(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeDialog}>
                            Cancel
                        </Button>
                        <Button onClick={confirmInsertTable}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Poll dialog */}
            <Dialog open={dialogMode === "poll"} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Insert Poll</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="poll-question">Question</Label>
                        <Input
                            id="poll-question"
                            placeholder="What should we build next?"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            You can add options once the poll is inserted.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeDialog}>
                            Cancel
                        </Button>
                        <Button onClick={confirmInsertPoll}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}