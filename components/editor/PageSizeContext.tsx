"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PageSizeKey =
    | "pageless"
    | "a4"
    | "letter"
    | "legal"
    | "tabloid"
    | "a3"
    | "a5"
    | "b4"
    | "b5"
    | "statement"
    | "executive"
    | "folio";

export type Orientation = "portrait" | "landscape";
export type MarginKey = "normal" | "narrow" | "wide";

export const PAGE_SIZES: Record<Exclude<PageSizeKey, "pageless">, { label: string; w: number; h: number }> = {
    a4: { label: 'A4 (8.27" x 11.69")', w: 8.27, h: 11.69 },
    letter: { label: 'Letter (8.5" x 11")', w: 8.5, h: 11 },
    legal: { label: 'Legal (8.5" x 14")', w: 8.5, h: 14 },
    tabloid: { label: 'Tabloid (11" x 17")', w: 11, h: 17 },
    a3: { label: 'A3 (11.69" x 16.54")', w: 11.69, h: 16.54 },
    a5: { label: 'A5 (5.83" x 8.27")', w: 5.83, h: 8.27 },
    b4: { label: 'B4 (9.84" x 13.90")', w: 9.84, h: 13.9 },
    b5: { label: 'B5 (6.93" x 9.84")', w: 6.93, h: 9.84 },
    statement: { label: 'Statement (5.5" x 8.5")', w: 5.5, h: 8.5 },
    executive: { label: 'Executive (7.25" x 10.5")', w: 7.25, h: 10.5 },
    folio: { label: 'Folio (8.5" x 13")', w: 8.5, h: 13 },
};

export const MARGIN_PRESETS: Record<MarginKey, { label: string; inches: number }> = {
    normal: { label: 'Normal (1")', inches: 1 },
    narrow: { label: 'Narrow (0.5")', inches: 0.5 },
    wide: { label: 'Wide (1.5")', inches: 1.5 },
};

const DPI = 96;

interface PageSizeState {
    pageSize: PageSizeKey;
    orientation: Orientation;
    marginKey: MarginKey;
    setPageSize: (s: PageSizeKey) => void;
    setOrientation: (o: Orientation) => void;
    setMarginKey: (m: MarginKey) => void;
    pageWidthPx: number | null;
    pageHeightPx: number | null;
    marginPx: number;
}

const PageSizeContext = createContext<PageSizeState | null>(null);

export function PageSizeProvider({ children }: { children: ReactNode }) {
    const [pageSize, setPageSize] = useState<PageSizeKey>("a4"); // ← default a4
    const [orientation, setOrientation] = useState<Orientation>("portrait");
    const [marginKey, setMarginKey] = useState<MarginKey>("normal");

    let pageWidthPx: number | null = null;
    let pageHeightPx: number | null = null;

    if (pageSize !== "pageless") {
        const { w, h } = PAGE_SIZES[pageSize];
        const [width, height] = orientation === "portrait" ? [w, h] : [h, w];
        pageWidthPx = Math.round(width * DPI);
        pageHeightPx = Math.round(height * DPI);
    }

    const marginPx = Math.round(MARGIN_PRESETS[marginKey].inches * DPI);

    return (
        <PageSizeContext.Provider
            value={{
                pageSize,
                orientation,
                marginKey,
                setPageSize,
                setOrientation,
                setMarginKey,
                pageWidthPx,
                pageHeightPx,
                marginPx,
            }}
        >
            {children}
        </PageSizeContext.Provider>
    );
}

export function usePageSize() {
    const ctx = useContext(PageSizeContext);
    if (!ctx) throw new Error("usePageSize must be used within a PageSizeProvider");
    return ctx;
}