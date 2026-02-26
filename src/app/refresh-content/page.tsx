import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Refresh Content | After Avenue",
};

export default function Deploy() {
  if (process.env.ENVIRONMENT === "production") {
    redirect("/");
  }

  return <DeployPage />;
}
