import Link from "next/link";
import { mainNav } from "@/data/navigation";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-lg font-bold text-foreground">
          IAM
        </Link>
        <ul className="flex items-center gap-8">
          {mainNav.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
