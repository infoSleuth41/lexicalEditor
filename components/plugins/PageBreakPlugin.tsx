"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

interface Props {
    pageHeightPx: number;
    pageGap: number;
    marginPx: number;
}

export default function PageBreakPlugin({ pageHeightPx, pageGap, marginPx }: Props) {
    const [editor] = useLexicalComposerContext();
    const cycle = pageHeightPx + pageGap;

    useEffect(() => {
        function adjustBlocks() {
            const root = editor.getRootElement();
            if (!root) return;

            const children = Array.from(root.children) as HTMLElement[];

            // Step 1: reset all our previously set margins
            children.forEach((el) => {
                el.style.marginTop = "";
            });

            // Step 2: multi-pass — keep adjusting until no block lands in a gap
            // (pushing one block can shift subsequent blocks into the next gap)
            for (let pass = 0; pass < 20; pass++) {
                let anyChanged = false;

                children.forEach((el) => {
                    const posInCycle = el.offsetTop % cycle;

                    if (posInCycle >= pageHeightPx) {
                        // Block top is inside the gap zone — push it to
                        // the start of the next page's content area (after top margin)
                        const pushAmount = cycle + marginPx - posInCycle;
                        const current = parseFloat(el.style.marginTop) || 0;
                        el.style.marginTop = `${current + pushAmount}px`;
                        anyChanged = true;
                    }
                });

                if (!anyChanged) break;
            }
        }

        // Run after every Lexical state update
        const unregister = editor.registerUpdateListener(() => {
            // rAF ensures layout is computed before we read offsetTop
            requestAnimationFrame(adjustBlocks);
        });

        // Also run once on mount
        requestAnimationFrame(adjustBlocks);

        return unregister;
    }, [editor, cycle, pageHeightPx, marginPx]);

    return null;
}