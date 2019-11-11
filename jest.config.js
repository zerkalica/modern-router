module.exports = {
  ...require('ts-build-scripts').createJestConfig(__dirname),
  jestEnvironment: "node"
}
