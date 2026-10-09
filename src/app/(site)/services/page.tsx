import type { Metadata } from "next";
import { ServicesOverview } from "@/components/ServicesOverview";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Services | Tilted Needle",
  path: "/services",
  description:
    "Content creation, influencer marketing, paid advertising & performance, and app & web development. Four core capabilities, one integrated growth engine.",
});

export default function Services() {
  return <ServicesOverview />;
}
