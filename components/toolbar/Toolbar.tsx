"use client";

import { Separator } from "../ui/separator";
import BlockType from "./blocktype/BlockType";
import FontFamily from "./FontFamily";
import FontSize from "./FontSize";
import UndoRedo from "./UndoRedo";
import Bold from "./Bold";
import Italic from "./Italic";
import Underline from "./Underline";
import LinkButton from "./LinkButton";
import TextColor from "./TextColor";
import Background from "./Background";
import Formatting from "./Formatting";
import Alignment from "./Alignment";
import PageSize from "./PageSize";
import DownloadPDF from "./DownloadPdf";
import DownloadDocx from "./DownloadDocx";
import Insert from "./Insert";

export default function Toolbar() {
    return (
        <div className="w-full border-b bg-background">
            <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2 p-2">
                <UndoRedo />
                <Separator orientation="vertical" className="h-8" />

                <BlockType />
                <Separator orientation="vertical" className="h-8" />

                <FontFamily />
                <Separator orientation="vertical" className="h-8" />

                <FontSize />
                <Separator orientation="vertical" className="h-8" />

                <Bold />
                <Italic />
                <Underline />
                <LinkButton />
                <TextColor />
                <Background />
                <Formatting />
                <Separator orientation="vertical" className="h-8" />

                <PageSize />
                <Separator orientation="vertical" className="h-8" />

                <Alignment />
                <Separator orientation="vertical" className="h-8" />

                <Insert />
                <Separator orientation="vertical" className="h-8" />

                <DownloadPDF />
                <DownloadDocx />
            </div>
        </div>
    );
}