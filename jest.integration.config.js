/**
 * Jest configuration for integration tests
 * Uses Node.js environment for server-side testing
 */

module.exports = {
  displayName: 'Integration Tests',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Not needed for Node.js tests
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/tests/integration/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'scripts/**/*.{js,mjs}',
    'lib/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  testTimeout: 60000, // 60 seconds for integration tests
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(contentlayer2|@contentlayer2)/)'
  ]
};
