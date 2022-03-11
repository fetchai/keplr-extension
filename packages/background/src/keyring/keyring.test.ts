import { KeyRing, KeyRingStatus } from "./keyring";
import { MemoryKVStore } from "@keplr-wallet/common";
import { Buffer } from "buffer";
import scrypt from "scrypt-js";
import { Mnemonic, PubKeySecp256k1 } from "@keplr-wallet/crypto";
import { webcrypto } from "crypto";
import { ScryptParams } from "./types";

describe("Keyring", () => {
  describe("with Secp256k1 private key", () => {
    let testKeyring: KeyRing;
    const testRNG = (array: any) => {
      // @ts-ignore
      return Promise.resolve(webcrypto.getRandomValues(array));
    };

    beforeAll(() => {
      const testKeyringStore = new MemoryKVStore("test_keyring");
      testKeyring = new KeyRing([], testKeyringStore, null, testRNG, {
        scrypt: async (text: string, params: ScryptParams) => {
          return scrypt.scrypt(
            Buffer.from(text),
            Buffer.from(params.salt, "hex"),
            params.n,
            params.r,
            params.p,
            params.dklen
          );
        },
      });
    });

    it("should be able to import a key", async () => {
      expect(testKeyring).toBeTruthy();
      expect(testKeyring.status).toEqual(KeyRingStatus.NOTLOADED);
      expect(testKeyring.isLocked()).toEqual(true);
      await testKeyring.restore();
      const mnemonic = await Mnemonic.generateSeed(testRNG, 128);
      expect(mnemonic).not.toEqual("");
      const testPassword = "test password";
      const bip44HDPath = {
        account: 0,
        change: 0,
        addressIndex: 0,
      };
      await testKeyring.createMnemonicKey(
        "sha256",
        mnemonic,
        testPassword,
        {},
        bip44HDPath
      );
    });

    it("should generate valid signatures", async () => {
      const chainID = "test-chain";
      const testMessage = Buffer.from("test message 123");
      const signature = await testKeyring.sign(null, chainID, 0, testMessage);
      expect(signature).toBeTruthy();

      const privKey = testKeyring.getKey(chainID, 0);
      const pubKey = new PubKeySecp256k1(privKey.pubKey);
      expect(pubKey.verify(testMessage, signature)).toEqual(true);
    });
  });
});
