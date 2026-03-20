import {
  Activity,
  Anchor,
  ArrowRight,
  BarChart3,
  Bot,
  Clock,
  Code,
  Cpu,
  Gift,
  Github,
  Globe,
  Shield,
  ShieldCheck,
  Users,
  Vote,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  pulse: Activity,
  proof: ShieldCheck,
  anchor: Anchor,
  airdrop: Gift,
  vote: Vote,
  bot: Bot,
  code: Code,
  github: Github,
  shield: Shield,
  chart: BarChart3,
  globe: Globe,
  zap: Zap,
  clock: Clock,
  users: Users,
  cpu: Cpu,
  "arrow-right": ArrowRight,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Shield;
}
