"use client";

import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot } from "lexical";

import htmlToDocx from "html-to-docx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

export default function DownloadButtons() {
    const [editor] = useLexicalComposerContext();

    const getHtml = () => {
        let html = "";

        editor.getEditorState().read(() => {
            html = $generateHtmlFromNodes(editor, null);
        });

        return `
            <html>
            <head>
                <style>
                    body{
                        font-family: Arial;
                        padding:40px;
                        line-height:1.5;
                    }

                    table{
                        border-collapse:collapse;
                        width:100%;
                    }

                    table,td,th{
                        border:1px solid #000;
                    }

                    img{
                        max-width:100%;
                    }
                </style>
            </head>

            <body>
                ${html}
            </body>
            </html>
        `;
    };

    const downloadDocx = async () => {
        const html = getHtml();

        const fileBuffer = await htmlToDocx(html);

        saveAs(
            new Blob([fileBuffer]),
            "document.docx"
        );
    };

    const downloadPdf = async () => {
        const html = getHtml();

        const container = document.createElement("div");
        container.innerHTML = html;

        await html2pdf()
            .from(container)
            .set({
                margin: 0.5,
                filename: "document.pdf",
                image: {
                    type: "jpeg",
                    quality: 1,
                },
                html2canvas: {
                    scale: 2,
                },
                jsPDF: {
                    unit: "in",
                    format: "a4",
                    orientation: "portrait",
                },
            })
            .save();
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={downloadDocx}
            >
                <FileText className="w-4 h-4 mr-2" />
                DOCX
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={downloadPdf}
            >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
            </Button>
        </>
    );
}