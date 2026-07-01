interface PlaceholderProps {
    offset?: number; // in px — matches ContentEditable padding in paged mode
}

export default function Placeholder({ offset = 16 }: PlaceholderProps) {
    return (
        <div
            className="pointer-events-none absolute text-sm text-muted-foreground"
            style={{ top: offset, left: offset }}
        >
            Start writing...
        </div>
    );
}