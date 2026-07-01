"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PAGE_SIZES, PageSizeKey } from "./PageSizes";

interface PageSizeContextType {
  pageSize: PageSizeKey;
  setPageSize: (size: PageSizeKey) => void;
}

const PageSizeContext = createContext<PageSizeContextType | null>(null);

export function PageSizeProvider({ children }: { children: ReactNode }) {
  const [pageSize, setPageSize] = useState<PageSizeKey>("pageless");
  return (
    <PageSizeContext.Provider value={{ pageSize, setPageSize }}>
      {children}
    </PageSizeContext.Provider>
  );
}

export function usePageSize() {
  const ctx = useContext(PageSizeContext);
  if (!ctx) throw new Error("usePageSize must be used within PageSizeProvider");
  return ctx;
}

export { PAGE_SIZES };