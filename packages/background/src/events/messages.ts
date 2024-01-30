import { Message } from "@keplr-wallet/router";

export class SubscribeOnStatusChangeMsg extends Message<void> {
  public static type() {
    return "subscribe-on-status-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnStatusChangeMsg.type();
  }
}

export class UnsubscribeOnStatusChangeMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-status-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnStatusChangeMsg.type();
  }
}

export class SubscribeOnNetworkChangeMsg extends Message<void> {
  public static type() {
    return "subscribe-on-network-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnNetworkChangeMsg.type();
  }
}

export class UnsubscribeOnNetworkChangeMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-network-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnNetworkChangeMsg.type();
  }
}

export class SubscribeOnAccountChangeMsg extends Message<void> {
  public static type() {
    return "subscribe-on-account-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnAccountChangeMsg.type();
  }
}

export class UnsubscribeOnAccountChangeMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-account-changed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnAccountChangeMsg.type();
  }
}

export class SubscribeOnTxFailedMsg extends Message<void> {
  public static type() {
    return "subscribe-on-tx-failed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnTxFailedMsg.type();
  }
}

export class UnsubscribeOnTxFailedMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-tx-failed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnTxFailedMsg.type();
  }
}

export class SubscribeOnTxSuccessfulMsg extends Message<void> {
  public static type() {
    return "subscribe-on-tx-successful";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnTxSuccessfulMsg.type();
  }
}

export class UnsubscribeOnTxSuccessfulMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-tx-successful";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnTxSuccessfulMsg.type();
  }
}

export class SubscribeOnEVMTxFailedMsg extends Message<void> {
  public static type() {
    return "subscribe-on-evm-tx-failed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnEVMTxFailedMsg.type();
  }
}

export class UnsubscribeOnEVMTxFailedMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-evm-tx-failed";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnEVMTxFailedMsg.type();
  }
}

export class SubscribeOnEVMTxSuccessfulMsg extends Message<void> {
  public static type() {
    return "subscribe-on-evm-tx-successful";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return SubscribeOnEVMTxSuccessfulMsg.type();
  }
}

export class UnsubscribeOnEVMTxSuccessfulMsg extends Message<void> {
  public static type() {
    return "unsubscribe-on-evm-tx-successful";
  }

  constructor(public readonly handler: any) {
    super();
  }

  validateBasic(): void {
    if (!this.handler) {
      throw new Error("handler is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return UnsubscribeOnEVMTxSuccessfulMsg.type();
  }
}

export class EmitOnEVMTxSuccessfulMsg extends Message<void> {
  public static type() {
    return "emit-on-evm-tx-successful";
  }

  constructor(public readonly txn: any) {
    super();
  }

  validateBasic(): void {
    if (!this.txn) {
      throw new Error("txn is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return EmitOnEVMTxSuccessfulMsg.type();
  }
}

export class EmitOnEVMTxFailedMsg extends Message<void> {
  public static type() {
    return "emit-on-evm-tx-failed";
  }

  constructor(public readonly txn: any) {
    super();
  }

  validateBasic(): void {
    if (!this.txn) {
      throw new Error("txn is empty");
    }
  }

  route(): string {
    return "events";
  }

  type(): string {
    return EmitOnEVMTxFailedMsg.type();
  }
}
