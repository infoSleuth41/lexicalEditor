"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import{ useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type InsertAction =
  | "hr"
  | "image"
  | "table"
  | "poll"
  | "columns"
  | "sticky"
  | "date"
  | "equation";

export default function InsertDropdown() {
  const [editor] = useLexicalComposerContext();

  const handleInsert = (value: InsertAction) => {
    switch (value) {
      case "hr":
        console.log("Insert horizontal rule");
        break;

      case "image":
        console.log("Insert image");
        break;

      case "table":
        console.log("Insert table");
        break;

      case "poll":
        console.log("Insert poll");
        break;

      case "columns":
        console.log("Insert columns layout");
        break;

      case "sticky":
        console.log("Insert sticky note");
        break;

      case "date":
        console.log("Insert date");
        break;

      case "equation":
        console.log("Insert equation");
        break;
    }
  };

  return (
    <Select onValueChange={handleInsert}>
      <SelectTrigger className="w-35">
        <SelectValue placeholder="Insert" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="hr">Horizontal Rule</SelectItem>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="table">Table</SelectItem>
        <SelectItem value="poll">Poll</SelectItem>
        <SelectItem value="columns">Columns Layout</SelectItem>
        <SelectItem value="sticky">Sticky Note</SelectItem>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="equation">Equation</SelectItem>
      </SelectContent>
    </Select>
  );
}