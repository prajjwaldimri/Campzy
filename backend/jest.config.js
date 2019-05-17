module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/test-utils/setup.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
