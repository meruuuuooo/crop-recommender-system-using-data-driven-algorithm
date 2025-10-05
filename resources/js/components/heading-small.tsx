export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header>
            <h3 className="mb-0.5 text-base font-medium sm:text-lg">{title}</h3>
            {description && <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>}
        </header>
    );
}
