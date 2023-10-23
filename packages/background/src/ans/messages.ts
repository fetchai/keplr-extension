import { Message } from "@keplr-wallet/router";
import { ROUTE } from "./constants";

export class SignPayload extends Message<string> {
  public static type() {
    return "sign-payload";
  }

  constructor(
    public readonly chainId: string,
    public readonly digest: Uint8Array
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("Chain id is empty");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SignPayload.type();
  }
}

export class PubKeyPayload extends Message<Uint8Array> {
  public static type() {
    return "lookup-pub-key";
  }

  constructor(public readonly chainId: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("Chain id is empty");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return PubKeyPayload.type();
  }
}

export class MakeVerificationStringPayload extends Message<string> {
  public static type() {
    return "make-verification-string-payload";
  }

  constructor(
    public readonly chainId: string,
    public readonly signature: Buffer
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("Chain id is empty");
    }
    if (!this.signature) {
      throw new Error("Signature is empty");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return MakeVerificationStringPayload.type();
  }
}
