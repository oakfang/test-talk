module.exports = {
  server: {
    command: `npm start`,
    port: 5000,
    launchTimeout: 10000,
    debug: true,
  },
  launch: {
    headless: !process.env.SHOW_BROWSER,
  },
};
