import Editor from "@/components/editor/Editor";
import { getTemplateById } from "@/app/editorTemplates/templates";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ template?: string }> | { template?: string };
}) {
    const params = await searchParams;
    const templateId = params?.template;
    const matchedTemplate = getTemplateById(templateId);
    return (
        <main className="p-8">
            <Editor key={templateId ?? "blank"} initialHtml={matchedTemplate?.html} />
        </main>
    );
}