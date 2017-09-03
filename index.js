const { send, json } = require('micro');
const cors = require('micro-cors')();
const puppeteer = require('puppeteer');
const { CHROME_BIN } = process.env;
const handler = async function(req, res) {
  const params = await json(req);
  const { width, height, url, fullPage } = params;

  if (!url) {
    const error = {
      status: '400',
      code: 400,
      title: 'Bad Request',
      detail: 'Missing `url` in request body.',
    };
    send(res, 400, error);
  }
  const config = {
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (CHROME_BIN) config.executablePath = CHROME_BIN;
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setViewport({
    width: parseInt(width) || 1366,
    height: parseInt(height) || 1024,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {
    waitUntil: 'networkidle',
  });
  const buffer = await page.screenshot({
    fullPage: Boolean(fullPage) ? true : false,
  });
  const response = {
    url,
    params,
    dataURI: await buffer.toString('base64'),
  };
  browser.close();
  send(res, 200, response);
};

module.exports = cors(handler);
