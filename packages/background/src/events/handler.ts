import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  EmitOnEVMTxFailedMsg,
  EmitOnEVMTxSuccessfulMsg,
  SubscribeOnAccountChangeMsg,
  SubscribeOnEVMTxFailedMsg,
  SubscribeOnEVMTxSuccessfulMsg,
  SubscribeOnNetworkChangeMsg,
  SubscribeOnStatusChangeMsg,
  SubscribeOnTxFailedMsg,
  SubscribeOnTxSuccessfulMsg,
  UnsubscribeOnAccountChangeMsg,
  UnsubscribeOnEVMTxFailedMsg,
  UnsubscribeOnEVMTxSuccessfulMsg,
  UnsubscribeOnNetworkChangeMsg,
  UnsubscribeOnStatusChangeMsg,
  UnsubscribeOnTxFailedMsg,
  UnsubscribeOnTxSuccessfulMsg,
} from "./messages";
import { EventService } from "./service";
import { eventEmitter } from "./event-emitter";

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
      case SubscribeOnEVMTxSuccessfulMsg:
        return handleSubscribeOnEVMTxSuccessfulMsg(service)(
          env,
          msg as SubscribeOnEVMTxSuccessfulMsg
        );
      case UnsubscribeOnEVMTxSuccessfulMsg:
        return handleUnsubscribeOnEVMTxSuccessfulMsg(service)(
          env,
          msg as UnsubscribeOnEVMTxSuccessfulMsg
        );
      case SubscribeOnEVMTxFailedMsg:
        return handleSubscribeOnEVMTxFailedMsg(service)(
          env,
          msg as SubscribeOnEVMTxFailedMsg
        );
      case UnsubscribeOnEVMTxFailedMsg:
        return handleUnsubscribeOnEVMTxFailedMsg(service)(
          env,
          msg as UnsubscribeOnEVMTxFailedMsg
        );
      case EmitOnEVMTxFailedMsg:
        return handleEmitOnEVMTxFailedMsg()(env, msg as EmitOnEVMTxFailedMsg);
      case EmitOnEVMTxSuccessfulMsg:
        return handleEmitOnEVMTxSuccessfulMsg()(
          env,
          msg as EmitOnEVMTxSuccessfulMsg
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

const handleSubscribeOnEVMTxSuccessfulMsg: (
  service: EventService
) => InternalHandler<SubscribeOnEVMTxSuccessfulMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing onEVMTxSuccessful event...");
    service.subscribeEVMTxSuccessful(handlerFunction);
  };
};

const handleUnsubscribeOnEVMTxSuccessfulMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnEVMTxSuccessfulMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing onEVMTxSuccessful event...");
    service.unSubscribeEVMTxSuccessful(handlerFunction);
  };
};

const handleUnsubscribeOnEVMTxFailedMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnEVMTxFailedMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("unsubscribing OnEVMTxFailed event...");
    service.unSubscribeEVMTxFailed(handlerFunction);
  };
};

const handleSubscribeOnEVMTxFailedMsg: (
  service: EventService
) => InternalHandler<SubscribeOnEVMTxFailedMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("subscribing OnEVMTxFailed event...");
    service.subscribeEVMTxFailed(handlerFunction);
  };
};

const handleEmitOnEVMTxFailedMsg: () => InternalHandler<EmitOnEVMTxFailedMsg> =
  () => {
    return async (_, msg) => {
      eventEmitter.emit("EVMTxFailed", msg.txn);
    };
  };

const handleEmitOnEVMTxSuccessfulMsg: () => InternalHandler<EmitOnEVMTxSuccessfulMsg> =
  () => {
    return async (_, msg) => {
      console.log("inside handler");
      eventEmitter.emit("EVMTxSuccessful", msg.txn);
    };
  };
