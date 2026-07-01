import {
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
} from "lucide-react";

export const blockTypes = [
  {
    value: "paragraph",
    label: "Normal",
    icon: Pilcrow,
    shortcut: "Alt + 0",
  },
  {
    value: "h1",
    label: "Heading 1",
    icon: Heading1,
    shortcut: "Alt + 1",
  },
  {
    value: "h2",
    label: "Heading 2",
    icon: Heading2,
    shortcut: "Alt + 2",
  },
  {
    value: "h3",
    label: "Heading 3",
    icon: Heading3,
    shortcut: "Alt + 3",
  },
  {
    value: "bullet",
    label: "Bullet List",
    icon: List,
    shortcut: "Alt + B",
  },
  {
    value: "number",
    label: "Numbered List",
    icon: ListOrdered,
    shortcut: "Alt + N",
  },
  {
    value: "check",
    label: "Check List",
    icon: ListChecks,
    shortcut: "Alt + C",
  },
  {
    value: "quote",
    label: "Quote",
    icon: Quote,
    shortcut: "Alt + Q",
  },
  {
    value: "code",
    label: "Code Block",
    icon: Code2,
    shortcut: "Alt + K",
  },
];

export const shortcutMap = blockTypes.reduce((acc, item) => {
  if (!item.shortcut) return acc;

  const key = item.shortcut
    .replace(/\s/g, "")
    .replace("Ctrl+", "Ctrl+")
    .replace("Alt+", "Alt+");

  acc[key] = item.value;
  return acc;
}, {} as Record<string, string>);