module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/test-utils/setup.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts}", "!**/node_modules/**", "!**/vendor/**"]
};
