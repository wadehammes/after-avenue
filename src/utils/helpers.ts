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

export const isVideo = (url: string | undefined): boolean => {
  if (!url) {
    return false;
  }

  return url.includes("videos.ctfassets.net");
};

export const convertBooleanToNumber = (value: boolean | number) => {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return value;
};
