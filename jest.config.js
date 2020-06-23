module.exports = {
  "preset": "ts-jest/presets/js-with-babel",
  "testEnvironment": "node",
  "collectCoverage": true,
  "coveragePathIgnorePatterns": [ "/node_modules/", "/lib/" ],
  "coverageDirectory": "coverage",
  "globals": {
    "ts-jest": {
      "packageJson": "package.json"
    }
  }
}
