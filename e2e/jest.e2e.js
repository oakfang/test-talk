const path = require("path");

module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./*\\.test\\.js$",
  setupFilesAfterEnv: [path.resolve(__dirname, "setup.js")],
};
