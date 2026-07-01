const theme = {
    paragraph: "mb-2",
    heading: {
        h1: "text-4xl font-bold mb-4",
        h2: "text-3xl font-bold mb-3",
        h3: "text-2xl font-bold mb-2",
    },
    quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
    code: "block rounded-md bg-muted font-mono text-sm bg-black-400",
    link: "text-blue-600 underline hover:text-blue-800",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        code: "rounded bg-muted px-1 py-0.5 font-mono text-sm",
    },
    list: {
        ul: "list-disc ml-6",
        ol: "list-decimal ml-6",
        listitem: "my-1",

        listitemChecked: "line-through text-muted-foreground",
        listitemUnchecked: "",

        nested: {
            listitem: "ml-4",
        },
    },
};

export default theme;