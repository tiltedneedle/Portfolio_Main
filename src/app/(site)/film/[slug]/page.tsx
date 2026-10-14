import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilmPage } from "@/components/room/FilmPage";
import { JsonLd } from "@/components/JsonLd";
import { filmBySlug, films, nextFilm } from "@/lib/films";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const film = filmBySlug(slug);
  if (!film) return {};
  const title = film.title + " | " + film.client + " | Tilted Needle";
  // The card's picture is this segment's own opengraph-image (the film's slate).
  return pageMeta({ title, description: film.summary, path: "/film/" + film.slug, type: "video.other", homeCard: false });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = filmBySlug(slug);
  if (!film) notFound();
  return (
    <>
      <FilmPage film={film} next={nextFilm(film)} />
      {/* The trail a result can show in place of "› film › the-jet-broker":
          the nav's Work, which is the films on the home page, then the film. */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Work", path: "/#work" },
          { name: film.title, path: `/film/${film.slug}` },
        ])}
      />
    </>
  );
}
