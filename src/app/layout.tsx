import { draftMode } from "next/headers";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import "src/styles/fonts.css";
import "src/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { fetchGlobalVariables } from "src/contentful/getGlobalVariables";
import { fetchNavigation } from "src/contentful/getNavigation";
import { NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(`${envUrl()}/`),
    keywords: ["videography", "post production"],
    creator: "After Avenue",
    publisher: "After Avenue",
  };
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await fetchNavigation({
    id: NAVIGATION_ID,
    preview: false,
  });

  const globalVariables = await fetchGlobalVariables({
    preview: draftMode().isEnabled,
  });

  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap-index.xml"
        />
      </head>
      <body>
        {draftMode().isEnabled ? (
          <div className="draftMode">
            You are previewing in draft mode!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </div>
        ) : null}
        <Providers globalVariables={globalVariables}>
          <div className="page">
            <Navigation navigationItems={nav?.navigationItems ?? []} />
            <main className="page-content">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />
    </html>
  );
}
