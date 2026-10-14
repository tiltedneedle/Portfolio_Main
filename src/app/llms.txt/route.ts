import { servicesList } from "@/lib/services-data";
import { films } from "@/lib/films";
import { organizationSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";

/**
 * /llms.txt: the site in plain text for language-model crawlers, in the
 * llmstxt.org shape (a name, a one-line summary, then sections of links with
 * a line each). Every line is the site's own copy, read from the same data
 * the pages render, so it cannot drift from them. Whether the engines read
 * it is their business; it costs nothing to serve.
 */
export const dynamic = "force-static";

const page = (path: string) => SITE_URL + path;

export function GET() {
  const org = organizationSchema;
  const lines = [
    `# ${org.name}`,
    "",
    `> ${org.description}`,
    "",
    org.slogan,
    "",
    `Studios in ${org.address.map((a) => a.addressLocality).join(" and ")}; work for clients worldwide. Contact: ${org.email}.`,
    "",
    "## Services",
    "",
    ...servicesList.map((s) => `- [${s.title}](${page("/services/" + s.slug)}): ${s.tagline} ${s.description}`),
    "",
    "## Films",
    "",
    "Eight case studies, each a person, a claim and a number.",
    "",
    ...films.map(
      (f) =>
        `- [${f.title}](${page("/film/" + f.slug)}): ${f.client}, ${f.year}. ${f.summary} ${f.metrics
          .map((m) => `${m.label} ${m.value}`)
          .join("; ")}. ${f.highlight}.`,
    ),
    "",
    "## Pages",
    "",
    `- [Home](${page("/")})`,
    `- [Services](${page("/services")})`,
    `- [The library](${page("/portfolio")}): everything the studio has published, on one board`,
    `- [Careers](${page("/careers")})`,
    `- [Book a demo](${page("/book-demo")})`,
    `- [Privacy policy](${page("/privacy")})`,
    `- [Terms](${page("/terms")})`,
    "",
    "## Profiles",
    "",
    ...org.sameAs.map((u) => `- ${u}`),
  ];
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
