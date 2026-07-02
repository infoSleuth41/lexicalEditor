"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import theme from "./theme";
import Toolbar from "../toolbar/Toolbar";
import EditorPlugins from "../plugins/EditorPlugins";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LinkNode } from "@lexical/link";
import { TextNode } from "lexical";
import { PageSizeProvider } from "./PageSizeContext";
import { EditorProvider } from "./EditorContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ImageNode } from "../toolbar/ImageNode";
import { PollNode } from "../toolbar/PollNode";


const initialConfig: InitialConfigType = {
    namespace: "Editor",
    theme,

    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        TextNode,
        HorizontalRuleNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        ImageNode,
        PollNode,
    ],

    onError(error: Error) {
        throw error;
    },
};

export default function Editor() {
    return (
        <PageSizeProvider>
            <EditorProvider>
                <div className="rounded-xl border bg-background shadow-sm">
                    <LexicalComposer initialConfig={initialConfig}>
                        <Toolbar />

                        {/* scroll viewport — the page(s) render centered inside this */}
                        <div className="relative max-h-[80vh] overflow-y-auto bg-muted/40 py-8">
                            <EditorPlugins />
                        </div>
                    </LexicalComposer>
                </div>
            </EditorProvider>
        </PageSizeProvider>
    );
}