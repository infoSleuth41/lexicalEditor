export type EditorTemplate = {
    id: string;
    name: string;
    description: string;
    /** Small preview shown on the template card. Swap for a real screenshot/thumbnail later. */
    thumbnailColor: string;
    /**
     * Lexical-compatible HTML (the same shape the editor itself exports/copies).
     * REPLACE the string below with the HTML you copied from the editor.
     */
    html: string;
};

export const EDITOR_TEMPLATES: EditorTemplate[] = [
    {
        id: "quarterly-report",
        name: "Quarterly Report",
        description: "Structured report layout with headings, tables, and source citations.",
        thumbnailColor: "#e8edf5",
        html: `<ol class="list-decimal pl-6 my-2 space-y-1"><li value="1" class="leading-7" style="--listitem-marker-font-size: 12px;"><u><b><strong class="font-bold underline" style="font-size: 12px; white-space: pre-wrap;">ndascxjknjkd : </strong></b></u></li><li value="2" class="leading-7"><span style="white-space: pre-wrap;">fndsxjk : </span></li><li value="3" class="leading-7"><span style="white-space: pre-wrap;">fewfsdnfxjk</span></li></ol><p class="mb-2 leading-7 text-gray-900"><br></p><table class="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden my-6 bg-white shadow-sm"><colgroup><col><col><col></colgroup><tbody><tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"><th class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500 bg-gray-100 text-left font-semibold text-gray-900" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start; background-color: rgb(242, 243, 245);"><p class="mb-2 leading-7 text-gray-900"><br></p></th><th class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500 bg-gray-100 text-left font-semibold text-gray-900" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start; background-color: rgb(242, 243, 245);"><p class="mb-2 leading-7 text-gray-900"><br></p></th><th class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500 bg-gray-100 text-left font-semibold text-gray-900" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start; background-color: rgb(242, 243, 245);"><p class="mb-2 leading-7 text-gray-900"><br></p></th></tr><tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"><th class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500 bg-gray-100 text-left font-semibold text-gray-900" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start; background-color: rgb(242, 243, 245);"><p class="mb-2 leading-7 text-gray-900"><br></p></th><td class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start;"><p class="mb-2 leading-7 text-gray-900"><br></p></td><td class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start;"><p class="mb-2 leading-7 text-gray-900"><br></p></td></tr><tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"><th class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500 bg-gray-100 text-left font-semibold text-gray-900" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start; background-color: rgb(242, 243, 245);"><p class="mb-2 leading-7 text-gray-900"><br></p></th><td class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start;"><p class="mb-2 leading-7 text-gray-900"><br></p></td><td class="border border-gray-300 px-4 py-3 align-top min-w-[120px] text-sm text-gray-500" style="border: 1px solid black; width: 75px; vertical-align: top; text-align: start;"><p class="mb-2 leading-7 text-gray-900"><br></p></td></tr></tbody></table><p class="mb-2 leading-7 text-gray-900"><br></p><ol class="list-decimal pl-6 my-2 space-y-1"><li value="1" class="leading-7"><span style="white-space: pre-wrap;">fewdsfnxv kj</span></li><li value="2" class="leading-7"><span style="white-space: pre-wrap;">dsfnx jk</span></li><li value="3" class="leading-7"><span style="white-space: pre-wrap;">fedasnxjk</span></li><li value="4" class="leading-7"><span style="white-space: pre-wrap;">saccnjk eidnif ewjdsn 3eqnwdsfjk : </span></li><li value="5" class="leading-7"></li></ol>`,
    },
];

export function getTemplateById(id: string | undefined | null): EditorTemplate | undefined {
    if (!id) return undefined;
    return EDITOR_TEMPLATES.find((t) => t.id === id);
}