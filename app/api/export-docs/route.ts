import { NextRequest, NextResponse } from "next/server";
import HTMLtoDOCX from "html-to-docx";

const IN_TO_TWIP = 1440; // 1 inch = 1440 twips

export async function POST(req: NextRequest) {
    const { html, widthIn, heightIn, marginIn, orientation } = await req.json();

    const fileBuffer = await HTMLtoDOCX(html, null, {
        orientation, // "portrait" | "landscape"
        pageSize: {
            width: Math.round(widthIn * IN_TO_TWIP),
            height: Math.round(heightIn * IN_TO_TWIP),
        },
        margins: {
            top: Math.round(marginIn * IN_TO_TWIP),
            bottom: Math.round(marginIn * IN_TO_TWIP),
            left: Math.round(marginIn * IN_TO_TWIP),
            right: Math.round(marginIn * IN_TO_TWIP),
        },
        title: "Document",
        font: "Arial",
    });

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": 'attachment; filename="document.docx"',
        },
    });
}