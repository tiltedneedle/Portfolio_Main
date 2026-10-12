import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { JsonLd } from "@/components/JsonLd";
import { servicesList } from "@/lib/services-data";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return servicesList.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesList.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.title} | Tilted Needle`,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesList.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <ServiceDetailPage service={service} />
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
    </>
  );
}
