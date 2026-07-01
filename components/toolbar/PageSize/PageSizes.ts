export type PageSizeKey =
  | "pageless"
  | "a4"
  | "letter"
  | "legal"
  | "a3"
  | "a5"
  | "b4"
  | "b5"
  | "statement"
  | "executive";

export interface PageDimension {
  label: string;
  width: number | null;  // null = pageless (fluid)
  height: number | null; // null = pageless (no breaks)
}

export const PAGE_SIZES: Record<PageSizeKey, PageDimension> = {
  pageless: { label: "Pageless", width: null, height: null },
  a4:        { label: "A4",        width: 794,  height: 1123 },
  letter:    { label: "Letter",    width: 816,  height: 1056 },
  legal:     { label: "Legal",     width: 816,  height: 1344 },
  a3:        { label: "A3",        width: 1123, height: 1587 },
  a5:        { label: "A5",        width: 559,  height: 794  },
  b4:        { label: "B4",        width: 945,  height: 1334 },
  b5:        { label: "B5",        width: 665,  height: 945  },
  statement: { label: "Statement", width: 528,  height: 816  },
  executive: { label: "Executive", width: 696,  height: 1008 },
};

export const PAGE_MARGIN = 96; // ~1 inch top/bottom margin per page, in px
export const PAGE_GAP = 24;    // visual gap between stacked pages