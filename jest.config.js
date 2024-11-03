module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['text'],
    reporters: ['default', './test-reporter.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json-summary']
  };
  