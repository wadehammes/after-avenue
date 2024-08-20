export const isBrowser = () => {
  return Boolean(typeof window !== "undefined");
};

export const envUrl = () => {
  if (process.env.ENVIRONMENT === "local") {
    return "http://localhost:7777";
  }

  if (process.env.ENVIRONMENT === "staging") {
    return "https://after-avenue.vercel.app/";
  }

  return "https://www.afteravenue.com";
};

export const createImageUrl = (src: string) => {
  if (!src) {
    return "";
  }

  if (src.startsWith("http")) {
    return src;
  }

  return `https:${src}`;
};
