import { GoogleAnalytics } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";
import { area, arida } from "src/app/fonts";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import "src/styles/globals.css";
import classNames from "classnames";
import type { Metadata } from "next";
import { fetchGlobalVariables } from "src/contentful/getGlobalVariables";
import { fetchNavigation } from "src/contentful/getNavigation";
import { NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(`${envUrl()}/`),
    applicationName: "After Avenue",
    creator: "After Avenue",
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    icons: {
      apple: "/images/apple-touch-icon.png",
      icon: [
        { sizes: "16x16", type: "image/png", url: "/images/favicon-16x16.png" },
        { sizes: "32x32", type: "image/png", url: "/images/favicon-32x32.png" },
      ],
    },
    keywords: ["videography", "post production"],
    publisher: "After Avenue",
    referrer: "origin-when-cross-origin",
  };
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = await draftMode();

  const [nav, globalVariables] = await Promise.all([
    fetchNavigation({ id: NAVIGATION_ID, preview: false }),
    fetchGlobalVariables({ preview: draft.isEnabled }),
  ]);

  return (
    <html lang="en" className={classNames(arida.variable, area.variable)}>
      <head>
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap-index.xml"
        />
      </head>
      <body>
        {draft.isEnabled ? (
          <div className="draftMode">
            You are previewing in draft mode!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </div>
        ) : null}
        <Providers globalVariables={globalVariables}>
          <Toaster />
          <div className="page">
            <Navigation navigationItems={nav?.navigationItems ?? []} />
            <main className="page-content">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
      {process.env.GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  );
}
