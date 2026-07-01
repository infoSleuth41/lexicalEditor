"use client";

import { ReactNode } from "react";
import { PAGE_SIZES, usePageSize } from "./PageSizeContext";
import { PAGE_GAP, PAGE_MARGIN } from "./PageSizes";

export default function PagedContainer({ children }: { children: ReactNode }) {
  const { pageSize } = usePageSize();
  const dims = PAGE_SIZES[pageSize];

  if (pageSize === "pageless" || !dims.width || !dims.height) {
    return (
      <div className="mx-auto w-full max-w-3xl px-8 py-6">{children}</div>
    );
  }

  const bandHeight = dims.height + PAGE_GAP;

  return (
    <div
      className="mx-auto"
      style={{
        width: dims.width,
        paddingTop: PAGE_MARGIN,
        paddingBottom: PAGE_MARGIN,
        paddingLeft: PAGE_MARGIN / 2,
        paddingRight: PAGE_MARGIN / 2,
        // Repeating gradient: white "page" band + gray "gap" band, simulating page breaks
        backgroundImage: `linear-gradient(
          to bottom,
          white 0px,
          white ${dims.height}px,
          hsl(var(--muted)) ${dims.height}px,
          hsl(var(--muted)) ${bandHeight}px
        )`,
        backgroundSize: `100% ${bandHeight}px`,
        backgroundRepeat: "repeat-y",
        boxShadow: "0 0 0 1px hsl(var(--border))",
      }}
    >
      {children}
    </div>
  );
}