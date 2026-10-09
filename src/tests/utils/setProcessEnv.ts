type WritableProcessEnv = Record<string, string | undefined>;

export const setProcessEnv = (values: WritableProcessEnv): void => {
  const env = process.env as WritableProcessEnv;

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }
};
