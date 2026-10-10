"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Shown when a page throws while rendering, instead of Next's bare default
 * ("Application error: a client-side exception has occurred"). Same slate as
 * the 404. "Try again" re-fetches and re-renders the page (`retry`). When the
 * root layout itself fails, app/global-error.tsx takes over instead.
 */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)]">
      <title>Something went wrong | Tilted Needle</title>
      <div className="mx-auto w-full max-w-[1600px] px-6 py-32 md:px-14">
        <p className="mono mb-8">
          Error <span className="text-[color:var(--ink-faint)]">/</span> Cut short
        </p>
        <h1 className="display max-w-[10ch] text-[clamp(64px,11vw,176px)]">
          This take <span className="em-serif">broke.</span>
        </h1>
        <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
          Something went wrong on our side while this page loaded. Try it again, or go back to the reel.
        </p>
        <div className="mt-10 flex items-center gap-8">
          <button type="button" onClick={() => retry()} className="pill pill-solid px-7 py-3 text-[15px]">
            Try again
          </button>
          <Link href="/" className="slate-link text-[13px]">
            Back to the reel
          </Link>
        </div>
      </div>
    </main>
  );
}
