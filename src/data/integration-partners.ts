import type { IntegrationPartner } from "./types";

export const integrationPartners: IntegrationPartner[] = [
  {
    name: "Jupiter",
    category: "DeFi",
    description: "Sybil-resistant airdrops and governance participation.",
    icon: "airdrop",
  },
  {
    name: "Marinade",
    category: "DeFi / DAO",
    description: "One-person-one-vote for MNDE governance proposals.",
    icon: "vote",
  },
  {
    name: "Tensor",
    category: "NFT",
    description: "Fair mint allocations and verified trader competitions.",
    icon: "gamepad",
  },
  {
    name: "Drift",
    category: "DeFi",
    description: "Bot-free trading competitions with Anchor age requirements.",
    icon: "chart",
  },
  {
    name: "Realms",
    category: "DAO Framework",
    description: "Quadratic voting backed by human-verified identity.",
    icon: "users",
  },
  {
    name: "Metaplex",
    category: "NFT Infrastructure",
    description: "Creator verification and provenance for NFT collections.",
    icon: "palette",
  },
  {
    name: "DRiP",
    category: "Social",
    description: "Referral reward gating to eliminate bot farming.",
    icon: "bot",
  },
  {
    name: "Helium",
    category: "DePIN",
    description: "Unique operator verification for hotspot networks.",
    icon: "globe",
  },
];
