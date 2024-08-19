import { draftMode } from "next/headers";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import "src/styles/fonts.css";
import "src/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { fetchNavigation } from "src/contentful/getNavigation";
import { NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(`${envUrl()}`),
    alternates: {
      canonical: "/",
    },
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

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.ico" />
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
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        {draftMode().isEnabled ? (
          <div className="draftMode">
            Draft mode is on!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </div>
        ) : null}
        <Providers>
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
