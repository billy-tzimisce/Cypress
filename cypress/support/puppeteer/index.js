const { setup, retry } = require('@cypress/puppeteer')

module.exports = function puppeteerSetup(on) {
  setup({
    on,
    onMessage: {
      async switchTabAndGetContent (browser) {
        const page = await pageRetrier(browser, 'https://loja.vr.com.br/')

        await page.bringToFront()
        await page.waitForTimeout(4000)
        const headingTwo = await page.waitForSelector('h1')
        const headingTwoText = await page.evaluate(el => el.textContent, headingTwo)

        headingTwo.dispose()
        await page.waitForTimeout(1000)
        await page.close()

        return headingTwoText
      },
    },
  })
}

async function pageRetrier(browser, url) {
  const page = await retry(async () => {
    const pages = await browser.pages()
    const page = pages.find(page => page.url().includes(url))

    if (!page) throw new Error('Could not find page')

    return page
  })

  return page
}
