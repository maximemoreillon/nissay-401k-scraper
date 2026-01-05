import puppeteer, { Page, Browser } from "puppeteer";

const {
  NISSAY_401K_LOGIN_URL = "",
  NISSAY_401K_PASSWORD = "",
  NISSAY_401K_USERNAME = "",
} = process.env;

export const scrape = async () => {
  console.log(`[Scraper] Scraper started`);

  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch {
    browser = await puppeteer.launch();
  }

  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(NISSAY_401K_LOGIN_URL);

    await page.waitForSelector("input[name='AUTH_USERID']", { timeout: 5000 });

    await page.locator("input[name='AUTH_USERID']").fill(NISSAY_401K_USERNAME);
    await page
      .locator("input[name='AUTH_PASSWORD']")
      .fill(NISSAY_401K_PASSWORD);

    await page
      .locator(
        "img[src='/dmckanyusha/salsa_open/auth/image/login_btn003.gif?20230320']"
      )
      .click();

    console.log(`[Scraper] Credentials submitted`);

    console.log(`[Scraper] Clicking next...`);
    await page
      .locator("img[src='/dmckanyusha/app/ckz/image/ckz_btn031JE.gif']")
      .click();

    console.log(`[Scraper] Arrived to valuation page`);

    await page.waitForNavigation();

    const frameHandle = await page.waitForSelector("[name='mainFrame']");
    if (!frameHandle) throw new Error("iFrame not found");
    const frame = await frameHandle.contentFrame();
    if (!frame) throw new Error("iFrame content is null");

    const row = await frame.$(".valuationRow");
    const cells = await row?.$$eval("td", (td) =>
      td.map((td) => td.textContent)
    );

    if (!cells) throw new Error("No cells");
    const [valuation] = cells;
    if (!valuation) throw new Error("No valuation");

    return Number(valuation.replaceAll("円", "").replaceAll(",", ""));
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
};
