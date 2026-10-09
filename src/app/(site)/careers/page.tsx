import type { Metadata } from "next";
import { CareersPage } from "@/components/CareersPage";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Careers | Tilted Needle",
  path: "/careers",
  description:
    "Join the team behind the views. Tilted Needle is a social-media production company in London and Dubai working with world-class brands and creators. Explore open roles and apply.",
});

export default function Careers() {
  return <CareersPage />;
}
