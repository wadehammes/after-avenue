import { draftMode } from "next/headers";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "src/styles/globals.css";
import "src/styles/swiper.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
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

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body>
        {draftMode().isEnabled ? (
          <p>
            Draft mode is on!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </p>
        ) : null}
        <Providers>
          <div className="page">
            <Navigation />
            <main className="page-content">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />
    </html>
  );
}
