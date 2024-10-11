import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { WebPage } from "schema-dts";
import { VercelPage } from "src/components/VercelPage/VercelPage.component";
import { fetchResponse } from "src/api/helpers";
import { fetchAllDeployments } from "src/vercel/getDeployments";
import { VERCEL_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import type { Deployment } from "src/vercel/getDeployments";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(`${envUrl()}/vercel`),
    alternates: {
      canonical: "/",
    },
    title: "Vercel | After Avenue",
  };
}

const VercelDashboard = async () => {

  const allDeployments = await fetchAllDeployments();

  //TODO: do i need anything to return notFound() here or above or is that handled elsewhere?

  return (
    <VercelPage initialDeployments={allDeployments}/>
  );
};

export default VercelDashboard;
