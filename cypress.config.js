const { defineConfig } = require('cypress')

const puppeteerSetup = require('./cypress/support/puppeteer')
const { getChromiumWebBrowsers } = require('./cypress/support/utils')

module.exports = defineConfig({
  pageLoadTimeout: 10000,
  viewportWidth: 1500,
  viewportHeight: 1300,
  projectId: 'VR',
  e2e: {
    setupNodeEvents(on, config) {
      puppeteerSetup(on)
      return getChromiumWebBrowsers(config)
    },
  },
})