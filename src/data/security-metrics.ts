export interface CampaignResult {
  tier: string;
  passRate: string;
  costPerSuccess: string;
  status: string;
}

export const campaignResults: CampaignResult[] = [
  {
    tier: "T1",
    passRate: "~0%",
    costPerSuccess: "negligible",
    status: "Defended (baseline)",
  },
  {
    tier: "T2",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Log-only measurement",
  },
  {
    tier: "T3",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
  },
  {
    tier: "T4",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Log-only measurement",
  },
  {
    tier: "T5",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Log-only measurement",
  },
  {
    tier: "T6",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
  },
  {
    tier: "T7",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
  },
  {
    tier: "T8",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
  },
];

export const lastUpdated = "April 2026";
