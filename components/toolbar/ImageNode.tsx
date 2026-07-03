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
import { useEffect, useRef, useState } from "react";
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

const MIN_WIDTH = 80;

type Corner = "nw" | "ne" | "sw" | "se";

/** Finds how wide the image is allowed to get — the usable content width
 * of the nearest `.editor-content` ancestor (its box minus its own padding),
 * so a resize can never push the image past the page/margins. */
function getMaxWidth(el: HTMLElement): number {
    const container = el.closest<HTMLElement>(".editor-content");
    if (!container) return Infinity;
    const style = window.getComputedStyle(container);
    const paddingX = parseFloat(style.paddingLeft || "0") + parseFloat(style.paddingRight || "0");
    return Math.max(MIN_WIDTH, container.clientWidth - paddingX);
}

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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const resizingRef = useRef(false);

    const handleDelete = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) node.remove();
        });
    };

    const commitWidth = (finalWidth: number) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node instanceof ImageNode) {
                node.setWidth(Math.round(finalWidth));
            }
        });
    };

    const startResize = (e: React.PointerEvent, corner: Corner) => {
        e.preventDefault();
        e.stopPropagation();
        const img = imgRef.current;
        if (!img) return;

        resizingRef.current = true;
        const startX = e.clientX;
        const startWidth = img.getBoundingClientRect().width;
        const maxWidth = getMaxWidth(img);
        const sign = corner === "ne" || corner === "se" ? 1 : -1;

        const handleMove = (moveEvent: PointerEvent) => {
            if (!resizingRef.current) return;
            const deltaX = (moveEvent.clientX - startX) * sign;
            const newWidth = Math.min(maxWidth, Math.max(MIN_WIDTH, startWidth + deltaX));
            img.style.width = `${newWidth}px`;
        };

        const handleUp = () => {
            resizingRef.current = false;
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
            const finalWidth = img.getBoundingClientRect().width;
            commitWidth(finalWidth);
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    };

    // Deselect when clicking elsewhere.
    useEffect(() => {
        if (!selected) return;
        const handleDocClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setSelected(false);
            }
        };
        document.addEventListener("mousedown", handleDocClick);
        return () => document.removeEventListener("mousedown", handleDocClick);
    }, [selected]);

    const handleClasses =
        "absolute h-3 w-3 rounded-full border-2 border-primary bg-background z-10";

    return (
        <div
            ref={wrapperRef}
            className="group relative inline-block max-w-full select-none"
            onClick={(e) => {
                e.stopPropagation();
                setSelected((s) => !s);
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
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
                contentEditable={false}
                className="absolute right-2 top-2 hidden rounded-md bg-black/60 px-2 py-1 text-xs text-white group-hover:block"
            >
                Remove
            </button>

            {selected && (
                <>
                    <div
                        onPointerDown={(e) => startResize(e, "nw")}
                        className={`${handleClasses} -left-1.5 -top-1.5 cursor-nwse-resize`}
                        contentEditable={false}
                    />
                    <div
                        onPointerDown={(e) => startResize(e, "ne")}
                        className={`${handleClasses} -right-1.5 -top-1.5 cursor-nesw-resize`}
                        contentEditable={false}
                    />
                    <div
                        onPointerDown={(e) => startResize(e, "sw")}
                        className={`${handleClasses} -left-1.5 -bottom-1.5 cursor-nesw-resize`}
                        contentEditable={false}
                    />
                    <div
                        onPointerDown={(e) => startResize(e, "se")}
                        className={`${handleClasses} -right-1.5 -bottom-1.5 cursor-nwse-resize`}
                        contentEditable={false}
                    />
                </>
            )}
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

    setWidth(width: number): void {
        const writable = this.getWritable();
        writable.__width = width;
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