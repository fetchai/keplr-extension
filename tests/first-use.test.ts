import puppeteer, { Target } from "puppeteer";
import {
  extensionPopupURL,
  extensionRegisterURL,
  getElementText,
  importMnemonic,
  newTestBrowser,
  testSenderMnemonic,
} from "./helpers";
import { accountNameSelector, balanceTextSelector } from "./selectors";

describe("first-time use", () => {
  let browser: puppeteer.Browser;

  beforeEach(async () => {
    browser = await newTestBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  it("should close the popup page and open the register page in a new tab", async () => {
    const destroyedTargetPromise = new Promise<puppeteer.Target>((resolve) => {
      browser.once("targetdestroyed", resolve);
    });

    const page = await browser.newPage();
    await page.goto(extensionPopupURL());

    // Popup page should be closed.
    await expect(destroyedTargetPromise).resolves.toBeTruthy();

    const registerTarget = await browser.waitForTarget((target) => {
      return target.url() === extensionRegisterURL();
    });
    expect(registerTarget.type()).toEqual("page");

    const registerPage = await registerTarget.page();
    expect(registerPage).not.toEqual(null);
    expect(await registerPage?.title()).toEqual("Fetch.ai Wallet");
  });

  it("should support importing a mnemonic", async () => {
    const destroyedTargetPromise = new Promise<puppeteer.Target>((resolve) => {
      browser.on("targetdestroyed", (target: Target) => {
        if (target.url() === extensionRegisterURL()) resolve(target);
      });
    });

    await (await browser.newPage()).goto(extensionPopupURL());
    await importMnemonic(browser, testSenderMnemonic, "sender");

    // Popup is closed when no account exists
    const destroyedTarget = await destroyedTargetPromise;
    expect(destroyedTarget.url()).toMatch(RegExp(extensionPopupURL() + "/?"));

    setTimeout(() => {}, 2000);

    // Re-open popup page
    const popupPage = await browser.newPage();
    await popupPage.goto(extensionPopupURL());
    const balanceText = await popupPage.$eval(
      balanceTextSelector,
      getElementText
    );
    expect(balanceText).toEqual("200 TESTFET");

    const accountName = await popupPage?.$eval(
      accountNameSelector,
      getElementText
    );
    expect(accountName).toEqual("sender");
  }, 20000);
});
