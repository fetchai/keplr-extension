import { Buffer } from "buffer";
import scrypt from "scrypt-js";
import { webcrypto } from "crypto";
import { SecretKey as SecretKeyBls } from "@chainsafe/blst";
import { MemoryKVStore } from "@keplr-wallet/common";
import {
  KeyCurves,
  Mnemonic,
  PubKeySecp256k1,
  PublicKeyBls12381,
} from "@keplr-wallet/crypto";
import { ScryptParams } from "./types";
import { KeyRing, KeyRingStatus } from "./keyring";
import { mnemonicToSeedSync } from "bip39";

const BLS_SIGNATURE_SIZE_COMPRESSED = 96;

describe("Keyring", () => {
  describe("with Secp256k1 private key", () => {
    let testKeyring: KeyRing;

    beforeAll(async () => {
      testKeyring = await newTestKeyring("test_keyring_secp256k1");

      expect(testKeyring).toBeTruthy();
      expect(testKeyring.status).toEqual(KeyRingStatus.EMPTY);
      expect(testKeyring.isLocked()).toEqual(true);
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
        bip44HDPath,
        KeyCurves.secp256k1
      );
    });

    it("should generate a valid signature", async () => {
      const chainID = "test-chain";
      const testMessage = Buffer.from("test message 123");
      const signature = await testKeyring.sign(null, chainID, 0, testMessage);
      expect(signature).toBeTruthy();

      const key = testKeyring.getKey(chainID, 0);
      expect(key.algo).toEqual(KeyCurves.secp256k1);

      const pubKey = new PubKeySecp256k1(key.pubKey);
      expect(pubKey.verify(testMessage, signature)).toEqual(true);
    });
  });

  describe("with bls12381 private key", () => {
    let testKeyring: KeyRing;

    beforeAll(async () => {
      testKeyring = await newTestKeyring("test_keyring_bls12381");

      expect(testKeyring).toBeTruthy();
      expect(testKeyring.status).toEqual(KeyRingStatus.EMPTY);
      expect(testKeyring.isLocked()).toEqual(true);
    });

    it("#createPrivateKey", async () => {
      const testPassword = "test password";
      const mnemonic = await Mnemonic.generateSeed(testRNG, 128);
      const seed = mnemonicToSeedSync(mnemonic, testPassword);
      expect(seed).not.toEqual("");

      const secretKey = SecretKeyBls.fromKeygen(Buffer.alloc(32, 1));
      await testKeyring.createPrivateKey(
        "sha256",
        secretKey.toBytes(),
        testPassword,
        {},
        KeyCurves.bls12381
      );
      // TODO: more assertions against testKeyring
    });

    it("should generate a valid signature", async () => {
      const chainID = "test-chain";
      const testMessage = Buffer.from("test message 123");
      const key = testKeyring.getKey(chainID, 0);
      expect(key.algo).toEqual("bls12381");

      const signature = await testKeyring.sign(null, chainID, 0, testMessage);
      expect(signature).toHaveLength(BLS_SIGNATURE_SIZE_COMPRESSED);

      const publicKey = new PublicKeyBls12381(key.pubKey);
      expect(publicKey.verify(testMessage, signature)).toEqual(true);
    });
  });
});

function testRNG<T>(array: T): Promise<T> {
  // @ts-ignore
  return Promise.resolve(webcrypto.getRandomValues(array));
}

async function newTestKeyring(kvStoreName: string) {
  const keyStore = new MemoryKVStore(kvStoreName);
  const keyRing = new KeyRing([], keyStore, null, testRNG, {
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

  await keyRing.restore();
  return keyRing;
}
