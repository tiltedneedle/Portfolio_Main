import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tilted Needle",
    short_name: "Tilted Needle",
    description:
      "A short-form production studio in London and Dubai. Eight films, 5B+ views, $250M+ in revenue for the people in them.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    // Square, opaque marks on the stage colour. The white logo listed here
    // before is 799x1027 and white on transparent, which a launcher would
    // crop and draw on a light tile; "any" is a size for SVGs, not PNGs.
    icons: [
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
