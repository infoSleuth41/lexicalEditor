"use client";

import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function DownloadPDF() {
    const handleDownload = async () => {
        const editor = document.getElementById("editor-contentt");

        if (!editor) {
            alert("Editor not found");
            return;
        }

        try {
            const dataUrl = await toPng(editor, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const img = new Image();

            img.onload = () => {
                const ratio = img.width / img.height;

                let pdfWidth = pageWidth;
                let pdfHeight = pdfWidth / ratio;

                if (pdfHeight > pageHeight) {
                    pdfHeight = pageHeight;
                    pdfWidth = pdfHeight * ratio;
                }

                pdf.addImage(
                    dataUrl,
                    "PNG",
                    0,
                    0,
                    pdfWidth,
                    pdfHeight
                );

                pdf.save("document.pdf");
            };

            img.src = dataUrl;
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-gray-100"
            title="Download PDF"
        >
            <Download size={18} />
        </button>
    );
}