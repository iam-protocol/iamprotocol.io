import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-mono text-base tracking-tight text-foreground">
          Entros<span className="text-cyan">_</span>docs
        </span>
      ),
      url: "/docs",
    },
    githubUrl: "https://github.com/entros-protocol",
    links: [
      { text: "Site", url: "/", active: "url" },
      { text: "Verify", url: "/verify", active: "url" },
      { text: "Paper", url: "/paper", active: "url" },
    ],
  };
}
