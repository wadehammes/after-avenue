import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "After Avenue | Award-winning Post House in Atlanta, GA",
    short_name: "After Avenue",
    description:
      "An award-winning post-production house in Atlanta, GA. The last stop before your story begins.",
    start_url: "/",
    display: "standalone",
    background_color: "#171818",
    theme_color: "#171818",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
