// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer, { Browser, Serializable } from "puppeteer";
import {
  accountInputSelector,
  addAccountButton,
  doneButtonSelector,
  importButtonSelector,
  mnemonicTextAreaSelector,
  nextButtonSelector,
  passwordConfirmInputSelector,
  passwordInputSelector,
} from "./selectors";
import path from "path";

export const testSenderMnemonic =
  "boat leave enrich glare into second this model appear owner strong tail perfect fringe best still soup clap betray rigid bleak return minimum goddess";
export const testRecipientMnemonic =
  "claw paddle detail vanish tomato coil ocean warm dirt stable item season total earth advance code dentist present raise response obvious gospel access hard";

const extensionBuildPath = path.join(
  __dirname,
  "..",
  "packages",
  "extension",
  "dist"
);

export const defaultExtensionID = "odhnidbdampichnphploopmnllifbnln";
const defaultTestBrowserOpts = {
  headless: false,
  args: [
    `--disable-extensions-except=${extensionBuildPath}`,
    `--load-extension=${extensionBuildPath}`,
  ],
};

export const getElementText = (el: Element): Serializable => el.textContent;

export function extensionBaseURL(extensionID?: string): string {
  const _extID = extensionID || defaultExtensionID;
  return `chrome-extension://${_extID}`;
}

export function extensionPopupURL(extensionID?: string): string {
  return `${extensionBaseURL(extensionID)}/popup.html#`;
}

export function extensionRegisterURL(extensionID?: string): string {
  return `${extensionPopupURL(extensionID)}/register`;
}

export function extensionSendURL(extensionID?: string): string {
  return `${extensionPopupURL(extensionID)}/send`;
}

export function extensionAccountsURL(extensionID?: string): string {
  return `${extensionPopupURL(extensionID)}/setting/set-keyring`;
}

export async function newTestBrowser(opts?: any): Promise<puppeteer.Browser> {
  const mergedOpts = {
    ...defaultTestBrowserOpts,
    ...opts,
  };
  return puppeteer.launch(mergedOpts);
}

export async function addTestAccount(
  browser: Browser,
  mnemonic: string,
  accountName: string
): Promise<string> {
  const page = await browser.newPage();
  await page.goto(extensionAccountsURL());
  await page.click(addAccountButton);

  await importMnemonic(browser, mnemonic, accountName);

  // Return account address
  console.log("pause");
  return "fetch0123";
}

export async function importMnemonic(
  browser: Browser,
  mnemonic: string,
  accountName: string
) {
  const registerTarget = await browser.waitForTarget((target) => {
    return target.url() === extensionRegisterURL();
  });

  const registerPage = await registerTarget.page();

  // Wait for page load
  await registerPage?.evaluate(() => {
    return new Promise((resolve) => {
      document.onreadystatechange = () => {
        if (document.readyState !== "complete") return;
        resolve(null);
      };
    });
  });

  // Show import page
  await registerPage?.click(importButtonSelector);

  // Enter account info
  await registerPage?.type(mnemonicTextAreaSelector, mnemonic);
  await registerPage?.type(accountInputSelector, accountName);
  await registerPage?.type(passwordInputSelector, "12345678");
  await registerPage?.type(passwordConfirmInputSelector, "12345678");
  await registerPage?.click(nextButtonSelector);

  await registerPage?.waitForTimeout(2000);

  await registerPage?.click(doneButtonSelector);
}
