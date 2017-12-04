const { send } = require("micro");
const puppeteer = require("puppeteer");

const { CHROME_BIN } = process.env;

const index = async function(req, res) {
  const date = new Date().toLocaleDateString();
  const config = {
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };
  if (CHROME_BIN) config.executablePath = CHROME_BIN;
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.goto("https://resume.jeffrey.engineer/");

  await page.emulateMedia("print");

  const data = await page.pdf({
    format: "letter",
    scale: 0.8,
    printBackground: true,
    margin: {
      top: 0,
      left: 64,
      right: 64,
      bottom: 0
    }
  });

  browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=JeffreyCanty_Resume_${date}.pdf`
  );

  send(res, 200, data);
};

const noop = () => {};
const ping = () => `pong`;
module.exports = { index, ping };
