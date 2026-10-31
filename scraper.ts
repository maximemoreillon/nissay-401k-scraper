import puppeteer from "puppeteer";
import { logger } from "./logger";

const {
  NISSAY_401K_LOGIN_URL = "https://401k.nissay.co.jp/dmckanyusha/salsa_open/auth/extra/Login_ip.jsp",
  NISSAY_401K_PASSWORD = "",
  NISSAY_401K_USERNAME = "",
} = process.env;

export const scrape = async () => {
  logger.info(`[Scraper] Scraper started`);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(NISSAY_401K_LOGIN_URL);

  await page.waitForSelector("input[name='AUTH_USERID']");

  await page.locator("input[name='AUTH_USERID']").fill(NISSAY_401K_USERNAME);
  await page.locator("input[name='AUTH_PASSWORD']").fill(NISSAY_401K_PASSWORD);

  await page
    .locator(
      "img[src='/dmckanyusha/salsa_open/auth/image/login_btn003.gif?20230320']",
    )
    .click();

  logger.info(`[Scraper] Credentials submitted`);

  logger.info(`[Scraper] Clicking next...`);
  // Wait for navigation concurrently with the click so a fast page load is not missed
  await Promise.all([
    page.waitForNavigation(),
    page
      .locator("img[src='/dmckanyusha/app/ckz/image/ckz_btn031JE.gif']")
      .click(),
  ]);

  logger.info(`[Scraper] Arrived to valuation page`);

  const frameHandle = await page.waitForSelector("[name='mainFrame']");
  if (!frameHandle) throw new Error("iFrame not found");
  const frame = await frameHandle.contentFrame();
  if (!frame) throw new Error("iFrame content is null");

  // The iframe content loads after the parent page, so wait for the row to appear
  const row = await frame.waitForSelector(".valuationRow");
  const cells = await row?.$$eval("td", (td) => td.map((td) => td.textContent));

  if (!cells?.length) throw new Error("No cells");
  const [valuationString] = cells;
  if (!valuationString) throw new Error("No valuation");

  const valuation = Number(
    valuationString.replaceAll("円", "").replaceAll(",", ""),
  );
  if (Number.isNaN(valuation)) throw new Error(`Invalid valuation: ${valuationString}`);

  await browser.close();

  return valuation;
};
