import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  SubscribeOnAccountChangeMsg,
  SubscribeOnNetworkChangeMsg,
  SubscribeOnStatusChangeMsg,
  SubscribeOnTxFailedMsg,
  SubscribeOnTxSuccessfulMsg,
  UnsubscribeOnAccountChangeMsg,
  UnsubscribeOnNetworkChangeMsg,
  UnsubscribeOnStatusChangeMsg,
  UnsubscribeOnTxFailedMsg,
  UnsubscribeOnTxSuccessfulMsg,
} from "./messages";
import { EventService } from "./service";

export const getHandler: (service: EventService) => Handler = (service) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case SubscribeOnStatusChangeMsg:
        return handleSubscribeOnStatusChangeMsg(service)(
          env,
          msg as SubscribeOnStatusChangeMsg
        );
      case UnsubscribeOnStatusChangeMsg:
        return handleUnsubscribeOnStatusChangeMsg(service)(
          env,
          msg as UnsubscribeOnStatusChangeMsg
        );
      case SubscribeOnAccountChangeMsg:
        return handleSubscribeOnAccountChangeMsg(service)(
          env,
          msg as SubscribeOnAccountChangeMsg
        );
      case UnsubscribeOnAccountChangeMsg:
        return handleUnsubscribeOnAccountChangeMsg(service)(
          env,
          msg as UnsubscribeOnAccountChangeMsg
        );
      case SubscribeOnNetworkChangeMsg:
        return handleSubscribeOnNetworkChangeMsg(service)(
          env,
          msg as SubscribeOnNetworkChangeMsg
        );
      case UnsubscribeOnNetworkChangeMsg:
        return handleUnsubscribeOnNetworkChangeMsg(service)(
          env,
          msg as UnsubscribeOnNetworkChangeMsg
        );
      case SubscribeOnTxSuccessfulMsg:
        return handleSubscribeOnTxSuccessfulMsg(service)(
          env,
          msg as SubscribeOnTxSuccessfulMsg
        );
      case UnsubscribeOnTxSuccessfulMsg:
        return handleUnsubscribeOnTxSuccessfulMsg(service)(
          env,
          msg as UnsubscribeOnTxSuccessfulMsg
        );
      case SubscribeOnTxFailedMsg:
        return handleSubscribeOnTxFailedMsg(service)(
          env,
          msg as SubscribeOnTxFailedMsg
        );
      case UnsubscribeOnTxFailedMsg:
        return handleUnsubscribeOnTxFailedMsg(service)(
          env,
          msg as UnsubscribeOnTxFailedMsg
        );
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handleSubscribeOnStatusChangeMsg: (
  service: EventService
) => InternalHandler<SubscribeOnStatusChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing status change event...");
    service.subscribeStatusChange(handlerFunction);
  };
};

const handleUnsubscribeOnStatusChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnStatusChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing status change event...");
    service.unSubscribeStatusChange(handlerFunction);
  };
};

const handleSubscribeOnAccountChangeMsg: (
  service: EventService
) => InternalHandler<SubscribeOnAccountChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing account change event...");
    service.subscribeAccountChange(handlerFunction);
  };
};

const handleUnsubscribeOnAccountChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnAccountChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing account change event...");
    service.unSubscribeAccountChange(handlerFunction);
  };
};

const handleSubscribeOnNetworkChangeMsg: (
  service: EventService
) => InternalHandler<SubscribeOnNetworkChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing network change event...");
    service.subscribeNetworkChange(handlerFunction);
  };
};

const handleUnsubscribeOnNetworkChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnNetworkChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing network change event...");
    service.unSubscribeNetworkChange(handlerFunction);
  };
};

const handleSubscribeOnTxSuccessfulMsg: (
  service: EventService
) => InternalHandler<SubscribeOnTxSuccessfulMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing onTxSuccessful event...");
    service.subscribeTxSuccessful(handlerFunction);
  };
};

const handleUnsubscribeOnTxSuccessfulMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnTxSuccessfulMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing onTxSuccessful event...");
    service.unSubscribeTxSuccessful(handlerFunction);
  };
};

const handleUnsubscribeOnTxFailedMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnTxFailedMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing OnTxFailed event...");
    service.unSubscribeTxFailed(handlerFunction);
  };
};

const handleSubscribeOnTxFailedMsg: (
  service: EventService
) => InternalHandler<SubscribeOnTxFailedMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing OnTxFailed event...");
    service.subscribeTxFailed(handlerFunction);
  };
};
