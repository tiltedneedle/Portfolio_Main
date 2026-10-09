import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsLastUpdated, termsSections } from "@/lib/legal-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service | Tilted Needle",
  path: "/terms",
  description:
    "The terms and conditions governing your use of the Tilted Needle website and our social media production and marketing services.",
});

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={termsLastUpdated}
      sections={termsSections}
    />
  );
}
