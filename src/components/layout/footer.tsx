import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12">
        <div className="flex gap-8 text-sm text-muted">
          <a href="https://github.com/iam-protocol" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href="https://twitter.com/iam_protocol" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            Twitter
          </a>
          <Link href="/technology" className="transition-colors hover:text-foreground">
            Paper
          </Link>
          <Link href="/solutions" className="transition-colors hover:text-foreground">
            Docs
          </Link>
        </div>
        <p className="text-xs text-subtle">
          IAM Protocol
        </p>
      </div>
    </footer>
  );
}
