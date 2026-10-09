import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacyLastUpdated, privacySections } from "@/lib/legal-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy | Tilted Needle",
  path: "/privacy",
  description:
    "How Tilted Needle collects, uses, and protects your personal data. Our commitment to your privacy under UK GDPR and applicable data protection law.",
});

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={privacyLastUpdated}
      sections={privacySections}
    />
  );
}
