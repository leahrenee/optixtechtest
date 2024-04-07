import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  modulePaths: ["src/"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // ts-jest configuration goes here
      },
    ],
  },
};

export default jestConfig;
