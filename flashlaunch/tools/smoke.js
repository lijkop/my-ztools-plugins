/* 浏览器预览冒烟测试：node tools/smoke.js */
const puppeteer = require("puppeteer-core");
const { findBrowser } = require("./browser");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 680, deviceScaleFactor: 1 });

  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  await page.goto("http://127.0.0.1:8123/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".card");
  await new Promise((r) => setTimeout(r, 300));

  const initial = await page.evaluate(() => ({
    apps: document.querySelectorAll(".card").length,
    tab: document.querySelector(".tab.is-active").dataset.tab,
  }));

  // 点击第一张卡片 -> 预览启动
  await page.click(".card");
  await page.waitForFunction(
    () => document.body.innerText.includes("（预览）启动"),
    { timeout: 2000 },
  );

  // 搜索过滤
  await page.click("#search");
  await page.type("#search", "term");
  await new Promise((r) => setTimeout(r, 200));
  const searchCount = await page.evaluate(() => document.querySelectorAll(".card").length);
  await page.click("#search-clear");

  // 添加菜单截图
  await page.click("#add-btn");
  await page.waitForSelector(".menu");
  await page.screenshot({ path: "tools/shot-menu.png" });

  // 添加网页
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll(".menu button")].find((b) =>
      b.textContent.includes("添加网址"),
    );
    btn.click();
  });
  await page.waitForSelector(".modal");
  await page.type("#f-name", "测试站点");
  await page.type("#f-path", "https://example.com");
  await page.type("#f-alias", "ex");
  await page.screenshot({ path: "tools/shot-editor.png" });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll(".modal-footer .btn")].find(
      (b) => b.textContent === "添加",
    );
    btn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const afterAdd = await page.evaluate(() => ({
    modalOpen: Boolean(document.querySelector(".modal")),
    activeTab: document.querySelector(".tab.is-active").dataset.tab,
    count: document.querySelectorAll(".card").length,
    toast: document.body.innerText.includes("已添加"),
  }));

  // 设置：隐藏名称 + 保存
  await page.click("#settings-btn");
  await page.waitForSelector(".modal");
  await page.click("#s-hide");
  await page.screenshot({ path: "tools/shot-settings.png" });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll(".modal-footer .btn")].find(
      (b) => b.textContent === "保存",
    );
    btn.click();
  });
  await new Promise((r) => setTimeout(r, 250));
  const hiddenNames = await page.evaluate(() => document.querySelector("#app").classList.contains("hide-names"));
  const hideSetting = await page.evaluate(
    () => JSON.parse(localStorage.getItem("flashlaunch-preview-db"))["fl.settings"].hideNames,
  );

  // 网址面板截图
  await page.click('.tab[data-tab="webs"]');
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: "tools/shot-webs.png" });
  const webTab = await page.evaluate(() => ({
    activeTab: document.querySelector(".tab.is-active").dataset.tab,
    cards: document.querySelectorAll(".card").length,
  }));

  // 刷新验证持久化
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".card");
  const persisted = await page.evaluate(() => ({
    activeTab: document.querySelector(".tab.is-active").dataset.tab,
    cards: document.querySelectorAll(".card").length,
    hideNames: document.querySelector("#app").classList.contains("hide-names"),
  }));

  // 恢复默认（避免污染后续手动预览）
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("flashlaunch-preview-db"));
    db["fl.settings"].hideNames = false;
    localStorage.setItem("flashlaunch-preview-db", JSON.stringify(db));
  });

  console.log(JSON.stringify({ initial, searchCount, afterAdd, hiddenNames, hideSetting, webTab, persisted, errors }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error("SMOKE FAILED:", e);
  process.exit(1);
});
