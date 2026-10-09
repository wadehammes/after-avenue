import type { Config } from "@jest/types";
import nextJest from "next/jest.js";

const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  preset: "ts-jest",
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupTests.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(isbot|jest-dom|@faker-js|@base-ui)/)",
  ],
  verbose: true,
};

const createJestConfig = nextJest({ dir: "./" })(customJestConfig);

const allowEsmPackagesInTransformIgnorePatterns = (patterns: string[]) =>
  patterns.map((pattern) => {
    if (pattern.includes("next/src/shared/lib)/")) {
      return pattern.replace(
        "next/src/shared/lib)/",
        "next/src/shared/lib|@faker-js|@base-ui)/",
      );
    }
    if (pattern.includes("next[\\\\/]src[\\\\/]shared[\\\\/]lib)[\\\\/]")) {
      return pattern.replace(
        "next[\\\\/]src[\\\\/]shared[\\\\/]lib)[\\\\/]",
        "next[\\\\/]src[\\\\/]shared[\\\\/]lib|@faker-js|@base-ui\\+)[\\\\/]",
      );
    }
    return pattern;
  });

export default async () => {
  const jestConfig = await createJestConfig();

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(svg)$": "<rootDir>/src/tests/mocks/svgMock.tsx",
  };

  return {
    ...jestConfig,
    moduleNameMapper,
    testTimeout: 20000,
    transformIgnorePatterns: allowEsmPackagesInTransformIgnorePatterns(
      jestConfig.transformIgnorePatterns ?? [],
    ),
  };
};
