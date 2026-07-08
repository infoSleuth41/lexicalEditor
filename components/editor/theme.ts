const theme = {
  // Paragraphs
  paragraph: "mb-2 leading-7 text-gray-900",

  // Headings
  heading: {
    h1: "text-4xl font-bold tracking-tight mb-5 mt-8",
    h2: "text-3xl font-semibold tracking-tight mb-4 mt-7",
    h3: "text-2xl font-semibold tracking-tight mb-3 mt-6",
  },

  // Quote
  quote:
    "border-l-4 border-blue-500 bg-blue-50 italic text-gray-700 px-4 py-3 my-4 rounded-r-md",

  // Code Block
  code:
    "block rounded-lg bg-gray-900 text-gray-100 font-mono text-sm p-4 overflow-x-auto my-4",

  // Links
  link: "text-blue-600 underline underline-offset-2 hover:text-blue-700",

  // Inline Text
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code:
      "rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-red-600",
  },

  // Lists
  list: {
    ul: "list-disc pl-6 my-2 space-y-1",
    ol: "list-decimal pl-6 my-2 space-y-1",

    listitem: "leading-7",

    listitemChecked: "line-through text-gray-400",

    listitemUnchecked: "",

    nested: {
      listitem: "list-none",
    },
  },

  // =========================
  // TABLE
  // =========================

  table:
    "w-full border-collapse border border-gray-200 rounded-lg overflow-hidden my-6 bg-white shadow-sm",

  tableRow:
    "border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150",

  tableCell:
    "border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500",

  tableCellHeader:
    "border border-gray-300 bg-gray-100 px-4 py-3 text-left font-semibold text-gray-900",

  tableSelected:
    "ring-2 ring-blue-500 ring-offset-1",

  tableCellSelected:
    "bg-blue-100",

  // Horizontal Rule
  hr: "my-6 border-t border-gray-300",

  // Custom Nodes
  image: "my-4 rounded-md shadow-sm",

  poll: "my-2",
};

export default theme;