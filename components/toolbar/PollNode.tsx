import type {
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from "lexical";

import {
    DecoratorNode,
    createCommand,
    type LexicalCommand,
    $getNodeByKey,
} from "lexical";
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plus, X, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface PollPayload {
    question: string;
    options?: PollOption[];
    key?: NodeKey;
}

export const INSERT_POLL_COMMAND: LexicalCommand<{ question: string }> =
    createCommand("INSERT_POLL_COMMAND");

export type SerializedPollNode = Spread<
    {
        question: string;
        options: PollOption[];
        type: "poll";
        version: 1;
    },
    SerializedLexicalNode
>;

function makeOptionId() {
    return Math.random().toString(36).slice(2, 9);
}

function PollComponent({
    question,
    options,
    nodeKey,
}: {
    question: string;
    options: PollOption[];
    nodeKey: NodeKey;
}) {
    const [editor] = useLexicalComposerContext();
    const [votedId, setVotedId] = useState<string | null>(null);
    const [newOptionText, setNewOptionText] = useState("");

    const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

    const updateOptions = (
        compute: (options: PollOption[]) => PollOption[]
    ) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isPollNode(node)) {
                node.setOptions(compute(node.__options));
            }
        });
    };

    const handleVote = (id: string) => {
        updateOptions((opts) =>
            opts.map((o) => {
                if (o.id === id)
                    return {
                        ...o,
                        votes: o.votes + (votedId === id ? -1 : 1),
                    };

                if (o.id === votedId)
                    return {
                        ...o,
                        votes: Math.max(0, o.votes - 1),
                    };

                return o;
            })
        );

        setVotedId((prev) => (prev === id ? null : id));
    };

    const handleAddOption = () => {
        const text = newOptionText.trim();

        if (!text) return;

        updateOptions((opts) => [
            ...opts,
            {
                id: makeOptionId(),
                text,
                votes: 0,
            },
        ]);

        setNewOptionText("");
    };

    const handleRemoveOption = (id: string) => {
        updateOptions((opts) => opts.filter((o) => o.id !== id));
    };

    const handleDeletePoll = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);

            if ($isPollNode(node)) {
                node.remove();
            }
        });
    };

    return (
        <div
            className="group my-2 max-w-md rounded-lg border bg-card p-4 shadow-sm"
            contentEditable={false}
        >
            <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{question}</p>

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleDeletePoll}
                    className="invisible h-8 w-8 group-hover:visible text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {options.map((option) => {
                    const pct =
                        totalVotes > 0
                            ? Math.round((option.votes / totalVotes) * 100)
                            : 0;

                    const isVoted = votedId === option.id;

                    return (
                        <div
                            key={option.id}
                            className="group flex items-center gap-2"
                        >
                            <button
                                type="button"
                                onClick={() => handleVote(option.id)}
                                className={`relative flex-1 overflow-hidden rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                                    isVoted
                                        ? "border-primary"
                                        : "border-input"
                                }`}
                            >
                                <div
                                    className="absolute inset-y-0 left-0 bg-primary/10"
                                    style={{ width: `${pct}%` }}
                                />

                                <div className="relative flex items-center justify-between">
                                    <span>{option.text}</span>

                                    <span className="text-xs text-muted-foreground">
                                        {option.votes} · {pct}%
                                    </span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleRemoveOption(option.id)
                                }
                                className="hidden text-muted-foreground hover:text-destructive group-hover:block"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 flex items-center gap-2">
                <Input
                    placeholder="Add an option"
                    value={newOptionText}
                    onChange={(e) =>
                        setNewOptionText(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddOption();
                        }
                    }}
                    className="h-8"
                />

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddOption}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
                {totalVotes} vote{totalVotes === 1 ? "" : "s"}
            </p>
        </div>
    );
}

export class PollNode extends DecoratorNode<React.ReactNode> {
    __question: string;
    __options: PollOption[];

    static getType(): string {
        return "poll";
    }

    static clone(node: PollNode): PollNode {
        return new PollNode(
            node.__question,
            [...node.__options],
            node.__key
        );
    }

    static importJSON(serializedNode: SerializedPollNode): PollNode {
        return $createPollNode(
            serializedNode.question,
            serializedNode.options
        );
    }

    exportJSON(): SerializedPollNode {
        return {
            question: this.__question,
            options: this.__options,
            type: "poll",
            version: 1,
        };
    }

    constructor(
        question: string,
        options?: PollOption[],
        key?: NodeKey
    ) {
        super(key);

        this.__question = question;

        this.__options =
            options ??
            [
                {
                    id: makeOptionId(),
                    text: "Option 1",
                    votes: 0,
                },
                {
                    id: makeOptionId(),
                    text: "Option 2",
                    votes: 0,
                },
            ];
    }

    setOptions(options: PollOption[]): void {
        const writable = this.getWritable();
        writable.__options = options;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const div = document.createElement("div");

        const className = config.theme.poll;

        if (className !== undefined) {
            div.className = className;
        }

        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): React.ReactNode {
        return (
            <PollComponent
                question={this.__question}
                options={this.__options}
                nodeKey={this.getKey()}
            />
        );
    }
}

export function $createPollNode(
    question: string,
    options?: PollOption[]
): PollNode {
    return new PollNode(question, options);
}

export function $isPollNode(
    node: LexicalNode | null | undefined
): node is PollNode {
    return node instanceof PollNode;
}