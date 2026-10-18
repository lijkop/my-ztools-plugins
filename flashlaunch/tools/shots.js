const puppeteer = require("puppeteer-core");
const { findBrowser } = require("./browser");
(async () => {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8123/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".card");

  await page.setViewport({ width: 820, height: 600 });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: "tools/shot-820.png" });

  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: "tools/shot-dark.png" });

  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await page.setViewport({ width: 1000, height: 680 });
  await page.click('.tab[data-tab="webs"]');
  await new Promise((r) => setTimeout(r, 200));
  await page.click(".card:nth-child(2)");
  await page.waitForSelector(".modal");
  await new Promise((r) => setTimeout(r, 260));
  await page.screenshot({ path: "tools/shot-query.png" });
  await browser.close();
})();
