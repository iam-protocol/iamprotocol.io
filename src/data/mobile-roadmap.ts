import type { Feature } from "./types";

export const mobileRoadmapItems: Feature[] = [
  {
    icon: "smartphone",
    title: "Native sensor access",
    description:
      "Direct accelerometer, gyroscope, touch pressure, and microphone access. No browser permission dialogs.",
    benefit:
      "Sub-millisecond sensor timestamps enable cross-modal temporal analysis that browsers can't match.",
  },
  {
    icon: "activity",
    title: "Physical liveness signals",
    description:
      "Touch-IMU shockwave detection. A real finger press produces a Z-axis accelerometer spike within 5-10ms. Programmatic injection does not.",
    benefit:
      "Research shows mobile biometric verification achieves significantly lower error rates than desktop.",
  },
  {
    icon: "solana",
    title: "Solana dApp Store distribution",
    description:
      "Trust Score persists across every dApp on Solana Mobile. Verify once on Seeker, use anywhere in the ecosystem.",
    benefit:
      "Push notification re-verification keeps the Trust Score active without manual prompts.",
  },
];
