module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/test-utils/setup.ts"],
  testEnvironment: "node"
};
