module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/test-utils/setup.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/schemas/**/*.{ts}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
