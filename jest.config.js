const nextJest = require("next/jest")

const createJestConfig = nextJest({ dir: "./" })

const customJestConfig = {
  setupFiles: ["<rootDir>/tests/polyfills.ts"], // 👈 primero
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"], // 👈 después
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
}

module.exports = createJestConfig(customJestConfig)
