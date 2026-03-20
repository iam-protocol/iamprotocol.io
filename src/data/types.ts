export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  benefit: string;
}

export interface UseCase {
  icon: string;
  title: string;
  problem: string;
  solution: string;
}

export interface Stat {
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
}

export interface DeveloperSnippet {
  language: string;
  title: string;
  code: string;
  installCommand: string;
}
