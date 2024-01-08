import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  SubscribeOnAccountChangeMsg,
  SubscribeOnNetworkChangeMsg,
  SubscribeOnStatusChangeMsg,
  UnsubscribeOnAccountChangeMsg,
  UnsubscribeOnNetworkChangeMsg,
  UnsubscribeOnStatusChangeMsg,
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
    service.subscribeStatusChange(handlerFunction);
  };
};

const handleUnsubscribeOnStatusChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnStatusChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    service.unSubscribeStatusChange(handlerFunction);
  };
};

const handleSubscribeOnAccountChangeMsg: (
  service: EventService
) => InternalHandler<SubscribeOnAccountChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    console.log("handler function eventhandler", handlerFunction);
    service.subscribeAccountChange(handlerFunction);
  };
};

const handleUnsubscribeOnAccountChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnAccountChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    service.unSubscribeAccountChange(handlerFunction);
  };
};

const handleSubscribeOnNetworkChangeMsg: (
  service: EventService
) => InternalHandler<SubscribeOnNetworkChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    service.subscribeNetworkChange(handlerFunction);
  };
};

const handleUnsubscribeOnNetworkChangeMsg: (
  service: EventService
) => InternalHandler<UnsubscribeOnNetworkChangeMsg> = (service) => {
  return async (_, msg) => {
    const handlerFunction = new Function(`return ${msg.handler}`)();
    service.unSubscribeNetworkChange(handlerFunction);
  };
};
