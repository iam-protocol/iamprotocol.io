"use client";

import { WalletProvider } from "@/components/providers/wallet-provider";
import { PulseProvider } from "@/components/providers/pulse-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <PulseProvider>{children}</PulseProvider>
    </WalletProvider>
  );
}
