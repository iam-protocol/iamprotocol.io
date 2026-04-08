import type { IntegrationSnippet } from "./types";

export const integrationSnippets: IntegrationSnippet[] = [
  {
    mode: "walletless",
    title: "Walletless verification",
    description:
      "Users verify without a wallet. The Pulse SDK generates a proof and submits it via the IAM relayer. Your API key identifies your escrow account.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';

const pulse = new PulseSDK({
  cluster: 'devnet',
  relayerUrl: 'https://relayer.iam-protocol.org',
});

// User completes Pulse challenge on your site
const result = await pulse.verify();

if (result.success) {
  // result.commitment — the on-chain TBH hash
  grantAccess(result.commitment);
}`,
  },
  {
    mode: "wallet-connected",
    title: "Wallet-connected verification",
    description:
      "For DeFi and DAO users who want self-custody. The user signs the verification transaction with their own wallet.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const pulse = new PulseSDK({ cluster: 'devnet' });
const { wallet } = useWallet();
const { connection } = useConnection();

// User completes challenge, signs tx with wallet
const result = await pulse.verify(
  touchElement, wallet.adapter, connection
);

if (result.success) {
  // result.txSignature — Solana transaction signature
  grantAccess(result.commitment);
}`,
  },
];

export const useCaseSnippets = [
  {
    title: "Check if a wallet is human",
    description: "Use this to verify if a wallet has a valid IAM attestation on-chain.",
    code: `import { verifyIAMAttestation } from '@iam-protocol/pulse-sdk';
import { useConnection } from '@solana/wallet-adapter-react';

// Inside your component or API route
const { connection } = useConnection();

try {
  // attestation: { isHuman: boolean, trustScore: number, verifiedAt: number, mode: string, expired: boolean } | null
  const attestation = await verifyIAMAttestation(walletAddress, connection);

  if (!attestation || !attestation.isHuman || attestation.expired) {
    throw new Error("Access Denied: User is not verified.");
  }

  // Proceed securely
  grantAccess();
} catch (e) {
  console.error("IAM Verification failed:", e);
}`
  },
  {
    title: "Gate access on Trust Score",
    description: "Require a minimum trust score to interact with your protocol.",
    code: `import { PublicKey } from '@solana/web3.js';
import { PROGRAM_IDS } from '@iam-protocol/pulse-sdk';

async function checkTrustThreshold(walletAddress, connection, minScore = 50) {
  try {
    const pubkey = new PublicKey(walletAddress);
    const programId = new PublicKey(PROGRAM_IDS.iamAnchor);
    const [identityPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode("identity"), pubkey.toBuffer()],
      programId
    );

    // Bypasses SDK IDL dependencies to avoid network timeout/cors issues
    const account = await connection.getAccountInfo(identityPda);
    
    if (!account || account.data.length < 62) {
      throw new Error("No IAM Anchor found");
    }

    const view = new DataView(account.data.buffer, account.data.byteOffset, account.data.byteLength);
    const trustScore = view.getUint16(60, true);
    
    if (trustScore < minScore) {
      throw new Error(\`Trust score too low: \${trustScore}\`);
    }
    
    return true;
  } catch (e) {
    console.error("Trust threshold validation failed:", e);
    return false;
  }
}`
  },
  {
    title: "Display verification status",
    description: "Use the drop-in React component to show identity status.",
    code: `import { IAMBadge } from "@/components/ui/iam-badge";
import { useConnection } from "@solana/wallet-adapter-react";

export function ProfileHeader({ walletAddress }) {
  const { connection } = useConnection();
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">{walletAddress}</h2>
      {/* Renders a verified pill with the trust score */}
      <IAMBadge walletAddress={walletAddress} connection={connection} />
    </div>
  );
}`
  }
];
