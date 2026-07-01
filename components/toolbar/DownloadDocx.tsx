"use client";

import { Download } from "lucide-react";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { $getRoot, $isParagraphNode } from "lexical";
import { useEditorContext } from "../editor/EditorContext";

export default function DownloadDocx() {
    const { editor } = useEditorContext();

    const handleDownload = async () => {
        if (!editor) {
            alert("Editor not initialized");
            return;
        }

        const paragraphs: Paragraph[] = [];

        editor.getEditorState().read(() => {
            const root = $getRoot();

            root.getChildren().forEach((node) => {
                if ($isParagraphNode(node)) {
                    paragraphs.push(
                        new Paragraph({
                            text: node.getTextContent(),
                        })
                    );
                } else {
                    paragraphs.push(
                        new Paragraph({
                            text: node.getTextContent(),
                        })
                    );
                }
            });
        });

        const doc = new Document({
            sections: [
                {
                    children: paragraphs,
                },
            ],
        });

        const blob = await Packer.toBlob(doc);

        saveAs(blob, "document.docx");
    };

    return (
        <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-gray-100"
            title="Download DOCX"
        >
            <Download size={18} />
        </button>
    );
}