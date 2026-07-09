import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { EDITOR_TEMPLATES } from "./templates";

export default function EditorTemplatesPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                        Start a new document
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Pick a template to begin, or start from a blank page.
                    </p>
                </header>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                    <Link
                        href="/editor"
                        className="group flex flex-col gap-3 outline-none"
                    >
                        <div
                            className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-400 transition-colors group-hover:border-neutral-400 group-hover:text-neutral-600 group-focus-visible:ring-2 group-focus-visible:ring-neutral-400"
                        >
                            <Plus className="h-9 w-9" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900">
                                Blank document
                            </p>
                            <p className="text-xs text-neutral-500">Start from scratch</p>
                        </div>
                    </Link>

                    {EDITOR_TEMPLATES.map((tpl) => (
                        <Link
                            key={tpl.id}
                            href={`/editor?template=${tpl.id}`}
                            className="group flex flex-col gap-3 outline-none"
                        >
                            <div
                                className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-neutral-400"
                                style={{ backgroundColor: tpl.thumbnailColor }}
                            >
                                <div className="flex h-full w-full flex-col gap-1.5 rounded bg-white p-3 shadow-inner">
                                    <FileText
                                        className="mb-1 h-4 w-4 text-neutral-400"
                                        strokeWidth={1.5}
                                    />
                                    <div className="h-2 w-3/4 rounded-sm bg-neutral-200" />
                                    <div className="h-1.5 w-full rounded-sm bg-neutral-100" />
                                    <div className="h-1.5 w-full rounded-sm bg-neutral-100" />
                                    <div className="h-1.5 w-2/3 rounded-sm bg-neutral-100" />
                                    <div className="mt-2 h-10 w-full rounded-sm border border-neutral-100" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    {tpl.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {tpl.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}