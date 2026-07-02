"use client";

import { useEffect, useRef, useState } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import Placeholder from "../ui/Placeholder";
import EditorHistoryPlugin from "./HistoryPlugin";
import EditorAutoFocusPlugin from "./AutoFocusPlugin";
import EditorOnChangePlugin from "./OnChangePlugin";
import PageBreakPlugin from "./PageBreakPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { usePageSize } from "../editor/PageSizeContext";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import ImagesPlugin from "./ImagesPlugin"
import PollPlugin from "./PollPlugin"

const PAGE_GAP = 0;
const CANVAS_BG = "#b0b7c3";

function PagedEditor({
    pageWidthPx,
    pageHeightPx,
    marginPx,
}: {
    pageWidthPx: number;
    pageHeightPx: number;
    marginPx: number;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState(1);

    const cycle = pageHeightPx + PAGE_GAP;
    const containerHeight = pageCount * pageHeightPx + (pageCount - 1) * PAGE_GAP;

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => {
            const count = Math.max(1, Math.ceil(el.scrollHeight / pageHeightPx));
            setPageCount(count);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [pageHeightPx]);

    return (
        <div
            style={{
                backgroundColor: CANVAS_BG,
                minHeight: "100%",
                paddingTop: 32,
                paddingBottom: 32,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
            }}
        >
            <div
                className="relative"
                style={{ width: pageWidthPx, height: containerHeight }}
            >
                {/* ── white page bands ── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            to bottom,
                            #ffffff      0px,
                            #ffffff      ${pageHeightPx}px,
                            ${CANVAS_BG} ${pageHeightPx}px,
                            ${CANVAS_BG} ${cycle}px
                        )`,
                        backgroundSize: `100% ${cycle}px`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
                    }}
                />

                {/* ── 1px border at bottom of each page ── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            to bottom,
                            transparent 0px,
                            transparent ${pageHeightPx - 1}px,
                            #c0c0c0     ${pageHeightPx - 1}px,
                            #c0c0c0     ${pageHeightPx}px,
                            transparent ${pageHeightPx}px,
                            transparent ${cycle}px
                        )`,
                        backgroundSize: `100% ${cycle}px`,
                    }}
                />

                {/* ── editable content ── */}
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            id="editor-contentt"
                            ref={contentRef as React.RefObject<HTMLDivElement>}
                            className="editor-content relative outline-none"
                            style={{
                                padding: marginPx,
                                minHeight: pageHeightPx,
                                background: "transparent",
                            }}
                        />
                    }
                    placeholder={<Placeholder offset={marginPx} />}
                    ErrorBoundary={LexicalErrorBoundary}
                />

                {/* ── plugins ── */}
                <PageBreakPlugin
                    pageHeightPx={pageHeightPx}
                    pageGap={PAGE_GAP}
                    marginPx={marginPx}
                />
                <EditorHistoryPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <LinkPlugin />
                <ClickableLinkPlugin />
                <EditorAutoFocusPlugin />
                <EditorOnChangePlugin />
                <TablePlugin
                    hasCellMerge={true}
                    hasCellBackgroundColor={true}
                    hasHorizontalScroll={true}
                />
                <ImagesPlugin />
                <PollPlugin />
            </div>
        </div>
    );
}

export default function EditorPlugins() {
    const { pageWidthPx, pageHeightPx, marginPx, pageSize } = usePageSize();

    if (pageSize === "pageless" || !pageWidthPx || !pageHeightPx) {
        return (
            <div className="relative mx-auto max-w-4xl">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="editor-content min-h-[500px] p-4 outline-none" />
                    }
                    placeholder={<Placeholder />}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <EditorHistoryPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <LinkPlugin />
                <ClickableLinkPlugin />
                <EditorAutoFocusPlugin />
                <EditorOnChangePlugin />
                <TablePlugin
                    hasCellMerge={true}
                    hasCellBackgroundColor={true}
                    hasHorizontalScroll={true}
                />
                <ImagesPlugin />
                <PollPlugin />
            </div>
        );
    }

    return (
        <PagedEditor
            pageWidthPx={pageWidthPx}
            pageHeightPx={pageHeightPx}
            marginPx={marginPx}
        />
    );
}