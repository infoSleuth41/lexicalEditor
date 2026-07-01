"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { usePageSize, PAGE_SIZES } from "./PageSizeContext";
import { PageSizeKey } from "./PageSizes";

export default function PageSize() {
  const { pageSize, setPageSize } = usePageSize();

  return (
    <Select
      value={pageSize}
      onValueChange={(value : any) => setPageSize(value as PageSizeKey)}
    >
      <SelectTrigger className="h-8 w-32">
        <SelectValue placeholder="Page size" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(PAGE_SIZES).map(([key, { label }]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}