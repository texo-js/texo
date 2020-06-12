// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  coverageDirectory: "coverage",
  testEnvironment: "node",
  globals: {
    'ts-jest': {
      packageJson: 'package.json'
    }
  }
};
