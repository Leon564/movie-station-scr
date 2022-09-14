import "dotenv/config";
import Puppeteer from "puppeteer";

export default {
  BearerToken: process.env.BEARER_TOKEN || "",
  browser: async () => {
    const browser = await Puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests",
        "--disable-site-isolation-trials",
      ],
    });
    return browser;
  },
};
