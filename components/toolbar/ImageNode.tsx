import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from "lexical";

import { DecoratorNode, createCommand, type LexicalCommand } from "lexical";
import { useState } from "react";
import { $getNodeByKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export interface ImagePayload {
    src: string;
    altText: string;
    width?: number;
    height?: number;
    key?: NodeKey;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand("INSERT_IMAGE_COMMAND");

export type SerializedImageNode = Spread<
    {
        src: string;
        altText: string;
        width?: number;
        height?: number;
        type: "image";
        version: 1;
    },
    SerializedLexicalNode
>;

function ImageComponent({
    src,
    altText,
    width,
    nodeKey,
}: {
    src: string;
    altText: string;
    width?: number;
    nodeKey: NodeKey;
}) {
    const [editor] = useLexicalComposerContext();
    const [selected, setSelected] = useState(false);

    const handleDelete = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) node.remove();
        });
    };

    return (
        <div
            className="group relative inline-block max-w-full"
            onClick={() => setSelected((s) => !s)}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={altText}
                style={width ? { width } : undefined}
                className={`max-w-full rounded-md ${selected ? "ring-2 ring-primary" : ""}`}
                draggable={false}
            />
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                }}
                className="absolute right-2 top-2 hidden rounded-md bg-black/60 px-2 py-1 text-xs text-white group-hover:block"
            >
                Remove
            </button>
        </div>
    );
}

export class ImageNode extends DecoratorNode<React.ReactNode> {
    __src: string;
    __altText: string;
    __width?: number;
    __height?: number;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { src, altText, width, height } = serializedNode;
        return $createImageNode({ src, altText, width, height });
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.__src,
            altText: this.__altText,
            width: this.__width,
            height: this.__height,
            type: "image",
            version: 1,
        };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        };
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("img");
        element.setAttribute("src", this.__src);
        element.setAttribute("alt", this.__altText);
        if (this.__width) element.setAttribute("width", String(this.__width));
        return { element };
    }

    constructor(src: string, altText: string, width?: number, height?: number, key?: NodeKey) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width;
        this.__height = height;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement("span");
        const theme = config.theme;
        const className = theme.image;
        if (className !== undefined) span.className = className;
        return span;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): React.ReactNode {
        return (
            <ImageComponent
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                nodeKey={this.getKey()}
            />
        );
    }
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
    if (domNode instanceof HTMLImageElement) {
        const { src, alt } = domNode;
        const node = $createImageNode({ src, altText: alt });
        return { node };
    }
    return null;
}

export function $createImageNode({ src, altText, width, height, key }: ImagePayload): ImageNode {
    return new ImageNode(src, altText, width, height, key);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}