import { NextResponse } from "next/server";

const cluster =
  (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as
    | "devnet"
    | "mainnet-beta"
    | "localnet"
    | undefined) ?? "devnet";

const INDEXER_BASE =
  cluster === "mainnet-beta"
    ? "https://8004-indexer-main.qnt.sh/rest/v1"
    : "https://8004-indexer-dev.qnt.sh/rest/v1";

// Solana base58 pubkey: 32-44 chars, base58 alphabet only.
const PUBKEY_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Server-side proxy to the 8004 agent indexer.
 * Bypasses the indexer's missing CORS headers by fetching server-side.
 * Caches at the edge for 30 seconds.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");

  if (!owner || !PUBKEY_REGEX.test(owner)) {
    return NextResponse.json(
      { error: "Invalid or missing owner pubkey" },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);

  try {
    const upstream = `${INDEXER_BASE}/agents?owner=eq.${owner}&limit=100`;
    const res = await fetch(upstream, { signal: controller.signal });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Indexer returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Indexer unreachable" },
      { status: 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
