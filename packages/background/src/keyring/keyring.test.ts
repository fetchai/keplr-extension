import { Buffer } from "buffer";
import scrypt from "scrypt-js";
import { webcrypto } from "crypto";
import {
  SecretKey as SecretKeyBls,
  PublicKey as PublicKeyBls,
  Signature as SignatureBls,
  verify as verifyBls,
} from "@chainsafe/blst";
import { MemoryKVStore } from "@keplr-wallet/common";
import { Mnemonic, PubKeySecp256k1 } from "@keplr-wallet/crypto";
import { ScryptParams } from "./types";
import { KeyRing, KeyRingStatus } from "./keyring";
import { mnemonicToSeedSync } from "bip39";

const BLS_SIGNATURE_SIZE_COMPRESSED = 96;

describe("Keyring", () => {
  describe("with Secp256k1 private key", () => {
    let testKeyring: KeyRing;
    const testRNG = (array: any) => {
      // @ts-ignore
      return Promise.resolve(webcrypto.getRandomValues(array));
    };

    beforeAll(async () => {
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

      expect(testKeyring).toBeTruthy();
      expect(testKeyring.status).toEqual(KeyRingStatus.NOTLOADED);
      expect(testKeyring.isLocked()).toEqual(true);
      await testKeyring.restore();
    });

    it("should be able to import a mnemonic", async () => {
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

    it("should generate a valid signature", async () => {
      const chainID = "test-chain";
      const testMessage = Buffer.from("test message 123");
      const signature = await testKeyring.sign(null, chainID, 0, testMessage);
      expect(signature).toBeTruthy();

      const secretKey = testKeyring.getKey(chainID, 0);
      const pubKey = new PubKeySecp256k1(secretKey.pubKey);
      expect(pubKey.verify(testMessage, signature)).toEqual(true);
    });
  });

  describe("with bls12381 private key", () => {
    let testKeyring: KeyRing;
    const testRNG = (array: any) => {
      // @ts-ignore
      return Promise.resolve(webcrypto.getRandomValues(array));
    };

    beforeAll(async () => {
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

      expect(testKeyring).toBeTruthy();
      expect(testKeyring.status).toEqual(KeyRingStatus.NOTLOADED);
      expect(testKeyring.isLocked()).toEqual(true);
      await testKeyring.restore();
    });

    it("should be able to import a secret key", async () => {
      const testPassword = "test password";
      const mnemonic = await Mnemonic.generateSeed(testRNG, 128);
      const seed = mnemonicToSeedSync(mnemonic, testPassword);
      expect(seed).not.toEqual("");

      const secretKey = SecretKeyBls.fromKeygen(Buffer.alloc(32, 1));
      await testKeyring.createPrivateKey(
        "sha256",
        secretKey.toBytes(),
        testPassword,
        {}
      );
    });

    it("should generate a valid signature", async () => {
      const chainID = "test-chain";
      const testMessage = Buffer.from("test message 123");
      const signatureBytes = await testKeyring.sign(
        null,
        chainID,
        0,
        testMessage
      );
      expect(signatureBytes).toBeTruthy();

      const signature = SignatureBls.fromBytes(signatureBytes);
      expect(signature.value).toHaveLength(BLS_SIGNATURE_SIZE_COMPRESSED);

      const secretKey = testKeyring.getKey(chainID, 0);
      const publicKey = PublicKeyBls.fromBytes(secretKey.pubKey);
      expect(verifyBls(testMessage, publicKey, signature)).toEqual(true);
    });
  });
});
