"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const NETWORK = "devnet" as const;

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(NETWORK),
    [],
  );

  // Wallet Standard auto-detects every browser-extension wallet that implements
  // the standard (Phantom, Backpack, Solflare, Glow, MetaMask Snap, …) at
  // runtime via the `wallet-standard:register-wallet` event. The legacy
  // PhantomWalletAdapter previously listed here was redundant on Chrome and
  // actively broken on Firefox (stale `window.phantom.solana` detection
  // before the content script injected). Empty array + Wallet Standard is
  // the current Anza-recommended pattern; the only adapter we register
  // explicitly is the Mobile Wallet Adapter for Android, which Wallet
  // Standard cannot auto-detect because mobile browsers have no extensions.
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {
          name: "Entros Protocol",
          uri: "https://entros.io",
          icon: "/logos/Entros.png",
        },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        chain: "solana:devnet",
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      }),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
