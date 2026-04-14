# IAM Protocol — Security & Quality Audit Tracker

Last updated: 2026-04-14

---

## Pulse SDK (`@iam-protocol/pulse-sdk`)

### Critical

- [x] **Audio extraction replaced** — MFCCs removed. New speaker feature extractor (F0, jitter, shimmer, HNR, formant ratios, LTAS) produces 44 content-independent features. Fixed in 0.3.0.
- [x] **Audio fallback vector length** — Consistent 44-element zero vector on fallback. Fixed.
- [x] **Empty wasmUrl/zkeyUrl crashes snarkjs** — Added validation before proof generation. Fixed.
- [x] **Proof serializer missing public signal count check** — Added validation. Fixed.
- [x] **Relayer submission no timeout** — Added 30s AbortController timeout. Fixed.
- [x] **Relayer submission trusts `success` field loosely** — Changed to strict `result.success === true`. Fixed.
- [x] **`verify()` method doesn't await stop promises** — Stop promises now properly chained via `.then(() => session.stop*())`. Fixed.
- [x] **Wallet submission returns success when anchor IDL fetch fails** — Added explicit error return when `anchorIdl` is null. Fixed.
- [x] **Reconstructed previousTBH has dummy `commitmentBytes`** — Now uses `bigintToBytes32()` for proper reconstruction. Fixed.
- [x] **localStorage stores raw fingerprint in plaintext** — Encrypted with AES-256-GCM via Web Crypto API. Non-extractable CryptoKey stored in IndexedDB. Plaintext fallback with warning when crypto APIs unavailable. Automatic migration of legacy plaintext data. Fixed.

### High

- [x] **`extractFeatures` zero-fills for missing audio** — Now throws error since audio is mandatory. Fixed.
- [x] **SimHash hyperplane cache dimension mismatch** — Added warning when feature vector dimension differs from expected 134. Fixed.
- [x] **`ctx.sampleRate` read after `ctx.close()`** — Captured sampleRate early before async operations. Fixed.
- [x] **Challenge generation uses `Math.random()`** — Replaced with `crypto.getRandomValues()` in both phrase and lissajous generators. Fixed.

### Medium

- [x] **Re-verification sends 3 separate transactions** — Each of create_challenge, verify_proof, update_anchor was a separate `.rpc()` call requiring its own wallet prompt. Partial failure left orphaned PDAs on-chain (challenge created but proof failed). Batched all 3 into a single atomic transaction with 250K CU budget using `.instruction()` + `wallet.sendTransaction`. 1 prompt, atomic revert on failure. Fixed 2026-04-10.
- [ ] **`any` types for wallet and connection** — Solana adapter types are optional peer deps, can't be strictly typed without making them required. Documented with eslint-disable comments.
- [x] **`verifyProofLocally` uses Node.js `fs` in browser bundle** — Changed to accept VK object directly, no fs import. Fixed.
- [x] **`Buffer.from()` in browser-targeted code** — Replaced with `TextEncoder.encode()` and `Uint8Array`. Fixed.
- [x] **`@solana/spl-token` missing from peerDependencies** — Added as optional peer dependency. Fixed.
- [x] **`Math.min(...values)` stack overflow for large arrays** — Replaced spread with loop in entropy(). Fixed.
- [x] **`skipAudio()` API contradicts mandatory audio requirement** — Removed skipAudio(). Audio failure now throws. Fixed.

### Penetration Testing Results (2026-04-11, 8 phases)

Test harness at `pulse-sdk/test/pentest.test.ts`. 60/60 tests pass.

- [x] **Phase 1: Replay attack blocked** — Exact replays produce distance=0, caught by min_distance=3. Deterministic pipeline prevents replay. PASS.
- [ ] **Phase 2: Naive synthesis passes re-verification** — Different noise seeds with same structural parameters produce distance=48, within [3,96) threshold. A basic TTS + scripted input bot passes. VULNERABILITY.
- [ ] **Phase 3: 100% sustained re-verification** — 10/10 parameter-varied sessions land within threshold. Distances: [56,38,65,54,50,53,37,90,78,82]. A bot can build Trust Score indefinitely. CRITICAL VULNERABILITY.
- [ ] **Phase 3b: Human baseline → bot re-verification** — Bot mimicking a human's voice profile passes 10/10 re-verifications. Bot can maintain a human's identity without their ongoing participation. CRITICAL VULNERABILITY.
- [ ] **Phase 4: Cross-modality correlation not distinguishable** — Correlation difference between "human" and "bot" sessions: 0.010. Too small to use as detection signal. Client-side correlation checks would not help. FINDING.
- [ ] **Phase 5: Sybil economics** — 1000 synthetic identities at Trust Score 200: 1.1 hours, 0.2 SOL. Economically trivial. CRITICAL VULNERABILITY.
- [ ] **Phase 6: Feature-level optimization converges in 251 iterations (45ms)** — Attacker with source access can craft any target fingerprint. Hyperplanes are deterministic from hardcoded seed. CRITICAL VULNERABILITY.
- [ ] **Phase 6b: Full pipeline 90% success rate** — Random parameter search through full extraction pipeline passes 27/30 attempts. Attacker doesn't need optimization — random variation works. CRITICAL VULNERABILITY.

**Required hardening (informed by pen test results):**
- Server-generated challenges (prevent pre-computation)
- ~~Server-side feature validation with hidden models (attacker can't see checks)~~ — DONE: iam-validation microservice deployed on Railway with proprietary detection models, bearer token auth, internal networking. 2026-04-13.
- ~~Cross-wallet fingerprint registry (detect Sybil clustering in feature space)~~ — DONE: SimHash registry with server-side secret seed, Mutex-guarded check-and-register, 24h TTL eviction. 2026-04-13. See Sybil Registry section above for scale limitations.
- Tighter Hamming distance threshold (96 bits too generous, need empirical human data)
- Raw audio TTS detection (spectral artifacts, breath patterns)

### Sybil Registry (added 2026-04-14)

- [ ] **Sybil registry 1:N matching does not scale beyond small populations** — The SimHash-based cross-wallet fingerprint comparison is a 1:N identification problem. At 30M users (450 trillion pairs), even a 0.01% FMR produces thousands of false Sybil matches per user. Behavioral biometrics lack the discriminability required for global deduplication at scale. At 1,000-10,000 users, the current design is functional. Beyond that, the binary pass/fail gate must be replaced with probabilistic Sybil scoring, scoped comparison, and ensemble signals. See `docs/BLUEPRINT-sybil-at-scale.md` for full analysis, math, and phased implementation plan. **CRITICAL ARCHITECTURAL LIMITATION.**
- [ ] **No wallet migration mechanism** — If a wallet is compromised or lost, the user cannot verify with a new wallet because the Sybil registry flags them as a duplicate. Current mitigation: 24-hour TTL evicts old fingerprints. Production requires an on-chain `migrate_identity` instruction with proof of old wallet ownership. See `docs/BLUEPRINT-sybil-at-scale.md`.
- [ ] **In-memory registry lost on service restart** — The Sybil registry is stored in process memory. Service restart or redeployment clears all fingerprints. Production requires persistent storage (database-backed registry). Acceptable for devnet/hackathon.
- [ ] **24-hour TTL allows spaced Sybil farming** — An attacker can register one wallet, wait 24 hours for eviction, then register another. The TTL that enables wallet recovery also enables slow Sybil farming. Production needs persistent registry with longer retention and explicit migration flow.

### Low

- [x] **No tests for extraction, submission, session, or sensor modules** — Added 21 extraction tests (speaker, motion, touch, mouse dynamics, fusion). 60 total tests (including pen test). Fixed.
- [x] **ScriptProcessorNode deprecated** — Documented in audio.ts with migration note for v1.0. All current browsers support it.
- [x] **In-memory localStorage fallback lost on page reload** — Documented in anchor.ts. Private browsing users must re-enroll each session.

---

## Protocol Core (`protocol-core`)

### Critical — VERIFICATION PIPELINE (requires coordinated cross-repo changes)

These items directly affect the on-chain verification flow. Fixing any one of them requires rebuilding and redeploying the Anchor programs to devnet, updating the executor node's instruction builders and PDA derivation if account contexts change, potentially updating the SDK's wallet submission path, and regenerating the test fixture. All changes must be tested end-to-end (browser → SDK → executor → Solana devnet) after deployment. Do not fix these in isolation.

- [x] **`update_anchor` has no access control** — Added `constraint = identity_state.owner == authority.key() @ IamAnchorError::Unauthorized` to UpdateAnchor context. Fixed.

- [x] **`compute_trust_score` writes nothing on-chain** — Moved trust score computation into `update_anchor` (iam-anchor). Trust score is now auto-computed from verification history and protocol config on every update. `update_anchor` reads ProtocolConfig via cross-program PDA. Removed `new_trust_score` parameter. `compute_trust_score` in iam-registry remains as a read-only preview instruction. Fixed.

- [x] **Failed proofs don't revert transaction** — Replaced `.is_ok()` with `?` in verify_proof. Invalid proofs now revert the entire transaction — challenge nonce preserved, no VerificationResult PDA created, no SOL wasted. Executor simplified: tx confirmation implies proof validity, removed PDA read. Fixed.

- [x] **Verification key conversion needs manual verification** — Manual byte-by-byte audit confirmed: all G1 points (alpha, IC[0-4]), G2 points (beta, gamma, delta) with reversed coordinate ordering (x_c1, x_c0, y_c1, y_c0), and nr_pubinputs=4 match exactly between verification_key.json and verifying_key.rs. Conversion script is correct. Verified.

### High

- [x] **`proof_hash` XOR fold is trivially colliding** — Replaced with rotate-and-XOR hash. Fixed.
- [x] **`mock_verifier.rs` compiled into production** — Gated behind `#[cfg(test)]`. Fixed.
- [x] **`f64::sqrt()` in trust score is non-deterministic on-chain** — Replaced with deterministic integer sqrt (Newton's method). Fixed.
- [x] **`Vec::new()` heap allocation in trust score** — Replaced with fixed `[i64; 9]` array. Fixed.
- [x] **Vault PDA has no unstake instruction** — Added `unstake_validator` instruction. Transfers staked SOL from vault back to validator via System Program CPI with PDA signing. Closes ValidatorState account (returns rent, allows re-registration). Authority constraint prevents unauthorized unstaking. Fixed.
- [x] **Trust score rewarded burst over consistency** — Same-day verifications inflated recency score linearly. 10 verifications in 1 day scored higher than weekly verifications over 10 weeks. Fixed by deduplicating `recent_timestamps` by calendar day before computing recency and regularity scores. Multiple same-day verifications now count once. Fixed 2026-04-10.
- [x] **`create_challenge` accepts zero nonces** — No input validation on nonce parameter. Zero nonce produces predictable PDA seeds and defeats anti-replay. Added `require!(nonce != [0u8; 32])` check matching the commitment validation pattern in iam-anchor. Fixed 2026-04-10.
- [ ] **No integration tests for trust score or nonce validation** — Trust score deduplication and nonce zero-check have no anchor test coverage. Assigned to contributor (Pluto).
- [x] **3 iam-registry tests failing due to test ordering** — `initializes protocol config` wrapped in try/catch for idempotent initialization. Trust score tests updated with `recent_timestamps` third argument to match current instruction signature. Fixed.

### Medium

- [x] **Recency score integer truncation** — `(recency_score / 100) * increment` discarded fractional multiplier, creating dead zones where additional unique verification days contributed zero points. Reordered to `(recency_score * increment) / 100` to preserve precision. Fixed 2026-04-10.
- [ ] **`challenge_expiry` config unused** — Deferred: changes instruction interface, needs coordinated executor/SDK update.
- [x] **`recent_timestamps` capped at 10 entries** — Expanded to 52 timestamp slots with transparent migration for existing accounts. Dashboard updated to read all 52 slots. Fixed 2026-04-12.
- [x] **No `close` instructions for Challenge/VerificationResult accounts** — Added close_challenge and close_verification_result with ownership validation. Fixed.

---

## Circuits (`circuits`)

### High

- [ ] **Single-contributor trusted setup** — Toxic waste known to whoever ran the script. Production needs multi-contributor ceremony. Documented prominently in circuits README with mainnet ceremony plan. Acceptable for devnet, required before mainnet.
- [x] **No verification that ptau is large enough** — setup.sh now verifies constraint count fits within 2^12 (ptau level 12) and exits with error if exceeded. Fixed.

### Medium

- [x] **Test randomness non-reproducible** — Replaced Math.random/crypto.getRandomValues with seeded Mulberry32 PRNG (SHA-256 of label). All test vectors are deterministic and reproducible across runs. Fixed.
- [x] **`verifyProof` helper is dead code** — Removed from test_vectors.ts. Tests use snarkjs.groth16.verify directly. Fixed.

### Low

- [x] **No negative-distance or boundary test cases** — Added tests for min_distance=0, impossible constraint range (min_distance > threshold), and tight boundary (distance exactly at min_distance with threshold=min+1). Fixed.

---

## Executor Node (`executor-node`)

### Critical — VERIFICATION PIPELINE (requires coordinated change with protocol-core)

- [x] **`is_first_verification` is client-controlled** — Server-side CommitmentRegistry tracks seen commitments per API key. If a commitment is already known, executor overrides `is_first_verification` to false regardless of client claim. First verification now returns `verified: null, registered: true` (not `verified: true`). Fixed.

### High

- [x] **API key comparison not constant-time** — Replaced with `subtle::ConstantTimeEq`. Fixed.
- [x] **`CorsLayer::permissive()` allows all origins** — CORS now configurable via `CORS_ORIGINS` env var (JSON array of allowed origins). Permissive fallback when not configured (development). Fixed.
- [x] **Rate limiter never evicts old entries** — Added timestamp-based eviction after 5 minutes of inactivity. Fixed.
- [x] **`remaining_quota` in response is stale after refund** — Added `get_remaining()` method, response uses fresh value. Fixed.

### Medium

- [x] **`is_valid` byte offset 80 is a magic number** — Extracted to named constant with length validation. Fixed.
- [x] **Event monitor log parsing is fragile** — Added verifier program ID filter before matching event names. Fixed.
- [x] **No transaction retry logic** — Added exponential backoff retry (3 attempts) with fresh blockhash per attempt. Fixed.

### SAS Integration (added 2026-04-06)

- [ ] **`/attest` endpoint does not verify caller owns the wallet** — Any authenticated client (valid API key) can call `/attest` with any wallet address. The endpoint verifies that an IdentityState PDA exists on-chain for that wallet, but does not verify the caller controls the wallet. Acceptable for devnet because API key gates access and the SDK calls this after a verified session. Production should add a signed challenge or pass-through from the wallet-connected verification flow to prove wallet ownership.
- [ ] **SAS credential authority is the relayer keypair** — The same keypair that relays walletless verifications is also the SAS credential authority. Compromise of the relayer keypair means an attacker can issue fake attestations. Production should use a separate authority keypair stored in a more secure environment (HSM or separate secrets manager), distinct from the relayer hot wallet.
- [ ] **Agent Anchor hardcodes devnet program ID** — `attestAgentOperator` uses `AGENT_REGISTRY_CONFIG.programIdDevnet` for PDA derivation. Production needs the program ID to be selected based on cluster (devnet vs mainnet) via PulseConfig.
- [ ] **No rate limiting specific to `/attest`** — The `/attest` endpoint shares the same per-API-key rate limiter as `/verify`. An attacker with a valid API key could spam attestation requests for wallets that have IdentityState accounts. Each request costs ~0.003 SOL from the relayer. Production should add attestation-specific rate limiting or require the attestation to follow a recent verification transaction.

### Status Endpoint (added 2026-04-08, PR #12 under review)

- [ ] **`/status` endpoint exposes relayer SOL balance publicly** — Any unauthenticated request to `/status` returns `relayer_balance_lamports`. On mainnet, an attacker could monitor this to detect when the relayer is running low and time denial-of-service. Fix: return balance only for authenticated requests, or redact for public.
- [ ] **`/status` makes an RPC call on every request** — `get_balance()` hits Solana RPC per request with no caching. Rapid polling burns through RPC rate limits. Fix: cache balance with 30s TTL using atomics.
- [ ] **`.unwrap()` in StatusMetrics::new()** — `SystemTime::now().duration_since(UNIX_EPOCH).unwrap()` should use `.unwrap_or_default()` per repo conventions. Review feedback sent.

---

## Website (`iam-human.io`)

### High

- [x] **Wallet flow dispatches PROOF_COMPLETE on blind 2s timer** — Now dispatches after actual proof generation. Fixed.
- [x] **Walletless flow has no timeout on `session.complete()`** — Added 60s timeout via Promise.race. Fixed.
- [x] **`preparing` state is vestigial** — Removed dead state and conditional. Fixed.

### Medium

- [x] **No error boundary around PulseChallenge** — Added VerifyErrorBoundary with reset handler. Fixed.
- [x] **`touchRef` forwarding uses `as any` cast** — Replaced with MutableRefObject type and dependency array. Fixed.
- [x] **Audio level callback causes ~60 re-renders/sec** — Throttled to every 6th frame (~10/sec). Fixed.
- [x] **`VERIFICATION_FAILED` has no state guard** — Added guard: won't override verified state. Removed idle guard so permission errors surface to the user. Fixed.
- [x] **Desktop verification flow broken by double-click race** — Added startingRef re-entry guard and requesting state to handleStart(). Button shows "Requesting access..." during permission dialog. Fixed.
- [x] **Wallet-connected flow has no timeout on session.complete()** — Added 60s Promise.race timeout matching walletless flow. Fixed.

---

## Dependency Versions (audited 2026-03-25)

### Actionable Now

- [x] **Website `@coral-xyz/anchor` 0.30.1 behind org standard 0.32.1** — Updated to 0.32.1. Fixed.
- [x] **Website `lucide-react` 0.577 behind v1.x** — Updated to 1.6.0. No icon name breakages. Fixed.
- [x] **TypeScript 5.x behind 6.0 across all JS/TS repos** — Updated to 6.0 across pulse-sdk, circuits, protocol-core, token-contracts, website. All compile clean. Fixed.
- [ ] **Executor `solana-client`/`solana-sdk` 2.2 behind v4.0** — `solana-client` 4.0 is still beta (4.0.0-beta.4). Using beta in production is worse than stable 2.2. RPC protocol is backward compatible. Upgrade when 4.0 stable releases.
- [x] **`mocha` 10.x behind 11.x in protocol-core, token-contracts, circuits** — Updated to 11.x across all three repos. Fixed.

### Blocked (Anchor 0.32.1 dependency tree)

- [x] **`spl-token-2022` crate 8.x behind v10.0** — Upgraded to v9 (max compatible with Anchor 0.32.1). v10 requires a newer solana-program than Anchor provides. v9 is one version behind, not two. Fixed.

### Watch (not actionable yet)

- [ ] **Anchor 1.0.0-rc.5 available** — Release candidate, not stable. Migration from 0.32.x will be significant. Monitor for stable release.
- [ ] **`@solana/kit` (web3.js v2) 6.5 available** — New API replacing `@solana/web3.js`. Ecosystem still migrating. Plan eventual adoption.

### Current (no action needed)

- `groth16-solana` 0.2.0, `snarkjs` 0.7.6, `circomlib` 2.0.5, `circomlibjs` 0.1.7 — all latest
- `meyda` 5.6.3, `pitchfinder` 2.3.4 — latest
- `axum` 0.8, `tower-http` 0.6, `tokio` 1.x, `dashmap` 6 — current major versions
- `react` 19.2.4, `next` 16.2.0, `tailwindcss` v4 — latest
- Rust 1.92, Solana CLI 3.0.13, Node 24, Circom 2.2.3 — all current

---

## Methodology

Findings are categorized as:
- **Critical**: Will cause incorrect behavior, security failures, or data loss
- **High**: Correctness issues, silent failures, fragile patterns
- **Medium**: Type safety, code quality, maintainability
- **Low**: Minor issues, test gaps, documentation

Items are checked off `[x]` when fixed and verified. Date of fix is noted in commit history.
