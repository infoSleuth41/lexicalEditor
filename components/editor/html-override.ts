import type { DOMConversionMap, DOMConversionOutput } from "lexical";
import { $isTextNode } from "lexical";
import { $isListItemNode } from "@lexical/list";

export const htmlImportOverrides: DOMConversionMap = {
    span: (domNode: HTMLElement) => {
        const fontSize = domNode.style.fontSize;
        if (!fontSize) return null;

        return {
            conversion: (): DOMConversionOutput => ({
                node: null, // <-- required; null = "don't create a node, just process children"
                forChild: (lexicalNode, parent) => {
                    if ($isTextNode(lexicalNode)) {
                        const existing = lexicalNode.getStyle() || "";
                        lexicalNode.setStyle(`${existing}font-size: ${fontSize};`);
                    }
                    return lexicalNode;
                },
            }),
            priority: 1,
        };
    },

    li: (domNode: HTMLElement) => {
        const markerSize = domNode.style.getPropertyValue("--listitem-marker-font-size");
        if (!markerSize) return null;

        return {
            conversion: (): DOMConversionOutput => ({
                forChild: (lexicalNode) => lexicalNode,
                after: (childNodes) => childNodes,
                node: null, // let the default li converter build the node
            }),
            priority: 1,
        };
    },
};