import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: [
    '.ts'
  ],
  globals: {
    'ts-jest': {
      tsconfig: false,
      useESM: true,
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    "\\.(ts|js)x?$": "ts-jest",
  }
}

export default config;