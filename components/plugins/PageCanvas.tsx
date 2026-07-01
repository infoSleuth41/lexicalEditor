"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  pageWidth: number;
  pageHeight: number;
  pageGap: number;
  pageCount: number;
  margin: number;
}

export default function PageCanvas({
  children,
  pageWidth,
  pageHeight,
  pageGap,
  pageCount,
}: Props) {
  const totalHeight =
    pageCount * pageHeight +
    (pageCount - 1) * pageGap;

  return (
    <div
      className="flex justify-center py-8"
      style={{
        minHeight: totalHeight + 64,
      }}
    >
      <div
        className="relative"
        style={{
          width: pageWidth,
          height: totalHeight,
        }}
      >
        {/* Pages */}
        {Array.from({ length: pageCount }).map((_, index) => (
          <div
            key={index}
            className="absolute left-0 bg-white border border-gray-300 rounded-sm"
            style={{
              width: pageWidth,
              height: pageHeight,
              top: index * (pageHeight + pageGap),
              boxShadow:
                "0 1px 3px rgba(0,0,0,.18),0 4px 14px rgba(0,0,0,.10)",
            }}
          />
        ))}

        {/* Editor Layer */}
        <div
          className="absolute left-0 top-0 z-10"
          style={{
            width: pageWidth,
            height: totalHeight,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}