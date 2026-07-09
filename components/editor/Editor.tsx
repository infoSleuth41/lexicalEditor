"use client";

import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import theme from "./theme";
import Toolbar from "../toolbar/Toolbar";
import EditorPlugins from "../plugins/EditorPlugins";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LinkNode } from "@lexical/link";
import { $getRoot, $insertNodes, TextNode } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { PageSizeProvider } from "./PageSizeContext";
import { EditorProvider } from "./EditorContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ImageNode } from "../toolbar/ImageNode";
import { PollNode } from "../toolbar/PollNode";
import { htmlImportOverrides } from "./html-override";

const EDITOR_NODES = [
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
];

const initialConfig: InitialConfigType = {
    namespace: "Editor",
    theme,
    nodes: EDITOR_NODES,
    html: { import: htmlImportOverrides },
    onError(error: Error) {
        throw error;
    },
};

const FORMAT_TAGS = "b, strong, em, i, u, s, code";

function hoistInlineStylesIntoSpans(root: ParentNode) {
    root.querySelectorAll<HTMLElement>(FORMAT_TAGS).forEach((el) => {
        const styleAttr = el.getAttribute("style");
        if (!styleAttr) return;

        const span = document.createElement("span");
        span.setAttribute("style", styleAttr);
        while (el.firstChild) {
            span.appendChild(el.firstChild);
        }
        el.appendChild(span);
        el.removeAttribute("style");
    });
}

function InitialHtmlPlugin({ html }: { html?: string }) {
    const [editor] = useLexicalComposerContext();
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (!html || hasLoaded.current) return;
        hasLoaded.current = true;

        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");

            hoistInlineStylesIntoSpans(dom.body);

            const nodes = $generateNodesFromDOM(editor, dom);

            const root = $getRoot();
            root.clear();
            root.select();
            $insertNodes(nodes);
        });
    }, [editor, html]);

    return null;
}

export default function Editor({ initialHtml }: { initialHtml?: string }) {
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

                        <InitialHtmlPlugin html={initialHtml} />
                    </LexicalComposer>
                </div>
            </EditorProvider>
        </PageSizeProvider>
    );
}