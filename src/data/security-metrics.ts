export interface CampaignResult {
  tier: string;
  passRate: string;
  costPerSuccess: string;
  status: string;
}

export const campaignResults: CampaignResult[] = [
  {
    tier: "T1",
    passRate: "0%",
    costPerSuccess: "N/A",
    status: "Defended (2,000 attempts)",
  },
  {
    tier: "T2",
    passRate: "0%",
    costPerSuccess: "N/A",
    status: "Defended (4,000 attempts)",
  },
  {
    tier: "T3",
    passRate: "0%",
    costPerSuccess: "N/A",
    status: "Defended (8,000 attempts)",
  },
  {
    tier: "T4",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
  },
  {
    tier: "T5",
    passRate: "pending",
    costPerSuccess: "pending",
    status: "Not yet tested",
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

export const lastUpdated = "April 18, 2026";
