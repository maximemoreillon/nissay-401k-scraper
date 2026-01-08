import "dotenv/config";
import { version } from "./package.json";
import { scrape } from "./scraper";
import { register } from "./registration";
console.log(`Nissay 401k scraper v${version}`);

const scrape_and_register = async () => {
  const valuation = await scrape();
  console.log({ valuation });
  await register(valuation);
};

scrape_and_register();
