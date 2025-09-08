/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'scripts/**/*.{js,mjs}',
    'lib/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  moduleFileExtensions: ['js', 'mjs', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  },
  testTimeout: 30000, // 30 seconds for network requests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

module.exports = config;