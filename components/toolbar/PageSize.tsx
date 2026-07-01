"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    usePageSize,
    PAGE_SIZES,
    MARGIN_PRESETS,
    PageSizeKey,
    Orientation,
    MarginKey,
} from "../editor/PageSizeContext";

export default function PageSize() {
    const {
        pageSize,
        orientation,
        marginKey,
        setPageSize,
        setOrientation,
        setMarginKey,
    } = usePageSize();

    const [open, setOpen] = useState(false);
    const [subOpen, setSubOpen] = useState<"orientation" | "margins" | null>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const disabled = pageSize === "pageless";

    function openMenu() {
        const rect = btnRef.current?.getBoundingClientRect();
        if (rect) {
            setCoords({ top: rect.bottom + 4, left: rect.left });
        }
        setOpen(true);
    }

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            if (
                btnRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
            setSubOpen(null);
        }

        function handleReposition() {
            const rect = btnRef.current?.getBoundingClientRect();
            if (rect) setCoords({ top: rect.bottom + 4, left: rect.left });
        }

        document.addEventListener("mousedown", handleClickOutside);
        // keep the menu glued to the button if the toolbar (or page) scrolls/resizes
        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => (open ? setOpen(false) : openMenu())}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                title="Page size"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
                        className="w-72 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
                    >
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Page size
                        </div>

                        <MenuItem
                            label="Pageless"
                            selected={pageSize === "pageless"}
                            onClick={() => {
                                setPageSize("pageless");
                                setOpen(false);
                            }}
                        />

                        {(Object.keys(PAGE_SIZES) as Array<Exclude<PageSizeKey, "pageless">>).map((key) => (
                            <MenuItem
                                key={key}
                                label={PAGE_SIZES[key].label}
                                selected={pageSize === key}
                                onClick={() => {
                                    setPageSize(key);
                                    setOpen(false);
                                }}
                            />
                        ))}

                        <div className="my-1 h-px bg-border" />

                        <div className="relative">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => setSubOpen(subOpen === "orientation" ? null : "orientation")}
                                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                Orientation
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                            {subOpen === "orientation" && !disabled && (
                                <div className="absolute left-full top-0 ml-1 w-44 rounded-lg border bg-popover p-1 shadow-md">
                                    {(["portrait", "landscape"] as Orientation[]).map((o) => (
                                        <MenuItem
                                            key={o}
                                            label={o === "portrait" ? "Portrait" : "Landscape"}
                                            selected={orientation === o}
                                            onClick={() => {
                                                setOrientation(o);
                                                setOpen(false);
                                                setSubOpen(null);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => setSubOpen(subOpen === "margins" ? null : "margins")}
                                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                Margins
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                            {subOpen === "margins" && !disabled && (
                                <div className="absolute left-full top-0 ml-1 w-44 rounded-lg border bg-popover p-1 shadow-md">
                                    {(Object.keys(MARGIN_PRESETS) as MarginKey[]).map((key) => (
                                        <MenuItem
                                            key={key}
                                            label={MARGIN_PRESETS[key].label}
                                            selected={marginKey === key}
                                            onClick={() => {
                                                setMarginKey(key);
                                                setOpen(false);
                                                setSubOpen(null);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}

function MenuItem({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={selected ? "opacity-100" : "opacity-0"}
            >
                <path d="M20 6L9 17l-5-5" />
            </svg>
            {label}
        </button>
    );
}