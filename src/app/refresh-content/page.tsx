import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { Environments } from "src/interfaces/common.interfaces";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Refresh Content | After Avenue",
};

export const RefreshContent = async ({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) => {
  const { token } = (await searchParams) ?? {};

  if (
    process.env.ENVIRONMENT === Environments.Production &&
    (!token || token !== process.env.REFRESH_CONTENT_ACCESS_TOKEN)
  ) {
    return notFound();
  }

  return <DeployPage />;
};

export default RefreshContent;
