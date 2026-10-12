/**
 * Structured data for search engines, as the Next docs recommend: a plain
 * script tag in the layout or page. Every "<" is written as <, so no
 * string in the data can close the tag early, whatever it holds later.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
