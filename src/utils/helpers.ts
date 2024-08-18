export const isBrowser = () => {
  return Boolean(typeof window !== "undefined");
};

export const envUrl = () => {
  if (process.env.ENVIRONMENT === "local") {
    return "http://localhost:7777";
  }

  if (process.env.ENVIRONMENT === "staging") {
    return "https://staging.provisioner.agency";
  }

  return "https://www.provisioner.agency";
};
