import "dotenv/config";
import { version } from "./package.json";
import { scrape } from "./scraper";
import { register } from "./registration";
import { logger } from "./logger";
logger.info(`Nissay 401k scraper v${version}`);

const scrape_and_register = async () => {
  const valuation = await scrape();
  logger.info({ valuation }, "Valuation scraped");
  await register(valuation);
  logger.info("Valuation registered");
};

scrape_and_register().catch((error) => {
  logger.error({ err: error }, "Scrape and register failed");
  process.exit(1);
});
