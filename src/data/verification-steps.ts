import type { VerificationStep } from "./types";

export const verificationSteps: VerificationStep[] = [
  {
    title: "01 — Challenge",
    description:
      "Dynamic phrases and curves generated per session. Challenges switch mid-capture to force real-time adaptation.",
    detail:
      "Each session generates multiple nonsense phrases from different syllable subsets, switching every few seconds. The Lissajous tracing curve also changes mid-session. This prevents pre-computed responses — a bot would need to generate matching behavioral data for an unpredictable challenge in real time.",
    icon: "mic",
  },
  {
    title: "02 — Capture",
    description:
      "Three sensor streams: audio, motion, and touch. Each stage captured independently under user control.",
    detail:
      "The Pulse SDK accesses the device microphone, accelerometer, gyroscope, and touch digitizer. Each sensor captures until the user signals completion. Raw data stays in device memory and never touches a network interface. On desktop, motion falls back to cursor tracking.",
    icon: "activity",
  },
  {
    title: "03 — Extract + Score",
    description:
      "MFCC, jerk, fractal dimension, statistical condensing. Plus entropy scoring to detect synthetic data.",
    detail:
      "Audio features: 13 MFCC coefficients plus delta and delta-delta, with per-coefficient entropy to detect TTS artifacts. Motion and touch: jerk and jounce analysis with jitter variance scoring — real human tremor fluctuates over time, synthetic data stays constant. Features that look too clean are flagged.",
    icon: "scan",
  },
  {
    title: "04 — Hash",
    description:
      "SimHash projects features into a 256-bit fingerprint. Same-user fingerprints cluster; imposters diverge.",
    detail:
      "The expanded feature vector (including entropy and jitter metrics) is passed through SimHash using random hyperplane projections. The output is a Temporal Fingerprint. Two fingerprints from the same person have small Hamming distance. The entropy features mean synthetic data produces a different fingerprint than real behavioral data.",
    icon: "hash",
  },
  {
    title: "05 — Commit",
    description:
      "Poseidon(fingerprint || salt) produces the TBH commitment. The fingerprint and salt stay on-device.",
    detail:
      "A large cryptographically-secure salt is generated. The Poseidon hash function (chosen for ZK-circuit efficiency over BN254 field elements) takes the fingerprint concatenated with the salt to produce H_TBH. This commitment is the only value that leaves the device.",
    icon: "lock",
  },
  {
    title: "06 — Prove",
    description:
      "Groth16 ZK proof: distance is within the valid range. Not too similar (replay), not too different (imposter).",
    detail:
      "The proof verifies four things: both commitments are valid Poseidon hashes of real fingerprints, the Hamming distance falls below the maximum threshold (natural human variation), and the distance exceeds a minimum threshold (blocks perfect replay where a bot submits identical data). The verifier learns nothing about the actual fingerprints.",
    icon: "proof",
  },
  {
    title: "07 — Verify",
    description:
      "Proof verified on Solana. Anchor updated. Progressive Trust Score recalculated from verification history.",
    detail:
      "The proof is submitted via the IAM relayer (walletless) or the user's wallet (wallet-connected). The verifier checks the Groth16 proof on-chain. On success, the Anchor stores the verification timestamp in a rolling history. Trust Score recalculates using recency weighting and regularity analysis — consistent verifications over weeks score higher than rapid bursts.",
    icon: "check-circle",
  },
];
