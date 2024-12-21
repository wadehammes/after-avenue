export interface VercelDeploymentsResponse {
  deployments: DeploymentType[];
}

export enum DeploymentStates {
  Ready = "READY",
  Queued = "QUEUED",
  Building = "BUILDING",
  Error = "ERROR",
}

export enum DeploymentHookRefs {
  Staging = "staging",
  Main = "main",
}

export interface DeploymentType {
  uid: string;
  name: string;
  url: string | null;
  state: DeploymentStates;
  created: number;
  meta: {
    deployHookRef: DeploymentHookRefs;
    githubCommitRef: DeploymentHookRefs;
    githubCommitSha: string;
    githubCommitMessage: string;
    deployHookName: string;
  };
  target: "production" | null;
  aliasAssigned: number;
}
