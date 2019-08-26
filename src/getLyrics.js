const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

module.exports = async function getLyrics(
  artistAndSong,
  stealthEnabled = false
) {
  try {
    if (stealthEnabled) {
      console.log(`Enabling 'puppeteer-extra-plugin-stealth'...`);
      puppeteer.use(pluginStealth());
    }
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`,
    });
    const url = `https://genius.com/${artistAndSong}-lyrics`;
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    const selector = '.lyrics';
    await page.waitForSelector(selector);
    const textElement = await page.$(selector);
    const textHandle = await textElement.getProperty('innerText');
    const text = await textHandle.jsonValue();
    await browser.close();
    return text;
  } catch (err) {
    const errorMessage = `Problem getting lyrics from Genius: \n${err.message}`;
    console.log(errorMessage);
    throw errorMessage;
  }
};
