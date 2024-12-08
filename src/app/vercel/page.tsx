import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, useSearchParams } from "next/navigation";
import type { WebPage } from "schema-dts";
import { fetchResponse } from "src/api/helpers";
import { VercelPage } from "src/components/VercelPage/VercelPage.component";
import { VERCEL_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import { fetchFilteredDeployments } from "src/vercel/getDeployments";
import type { Deployment } from "src/vercel/getDeployments";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(`${envUrl()}/vercel`),
    alternates: {
      canonical: "/",
    },
    title: "Vercel | After Avenue",
  };
}

const VercelDashboard = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams
  const key = searchParams.key

  if (key !== process.env.VERCEL_PAGE_KEY) {
    return notFound();
  }

  const latestDeployment = await fetchFilteredDeployments(1, "READY");
  const latestBuilding = await fetchFilteredDeployments(1, "BUILDING");

  const testLatestBuilding = [
    {
      uid: "dpl_8HrhpGa9kRbDxQ8BXcf5MZY16Xod",
      name: "after-avenue",
      url: "after-avenue-c9j7toumj-wadehammes.vercel.app",
      created: 1729514606451,
      source: "git",
      state: "BUILDING",
      readyState: "BUILDING",
      readySubstate: "STAGED",
      type: "LAMBDAS",
      creator: {
        uid: "I8KU1E3utWY33iEl2YmGe5C7",
        email: "w+vercel@dehammes.com",
        username: "nthoftype",
        githubLogin: "wadehammes",
      },
      inspectorUrl:
        "https://vercel.com/wadehammes/after-avenue/8HrhpGa9kRbDxQ8BXcf5MZY16Xod",
      meta: {
        githubCommitAuthorName: "Test Data",
        githubCommitMessage: "Chore: package updates 102124",
        githubCommitOrg: "wadehammes",
        githubCommitRef: "wade-10-21-chore-package-updates-102124",
        githubCommitRepo: "after-avenue",
        githubCommitSha: "3c0c6b96e5c7a5cb1db4209da3da4ab45ab1b994",
        githubDeployment: "1",
        githubOrg: "wadehammes",
        githubRepo: "after-avenue",
        githubRepoOwnerType: "User",
        githubCommitRepoId: "843566878",
        githubRepoId: "843566878",
        githubRepoVisibility: "public",
        githubCommitAuthorLogin: "wadehammes",
        githubPrId: "102",
        branchAlias:
          "after-avenue-git-wade-10-21-chore-package-upd-2d547c-wadehammes.vercel.app",
      },
      target: null,
      aliasError: null,
      aliasAssigned: 1729514702193,
      isRollbackCandidate: false,
      createdAt: 1729514606451,
      buildingAt: 1729514607936,
      ready: 1729514701981,
      projectSettings: { commandForIgnoringBuildStep: null },
    },
  ];

  return (
    <VercelPage
      initialDeployments={latestDeployment}
      latestBuilding={testLatestBuilding}
    />
  );
};

export default VercelDashboard;
