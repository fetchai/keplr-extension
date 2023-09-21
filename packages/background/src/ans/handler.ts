import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import { PubKeyPayload, SignPayload } from "./messages";
import { NameService } from "./service";

export const getNameServiceHandler: (service: NameService) => Handler = (
  service
) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case SignPayload:
        return handleSignPayload(service)(env, msg as SignPayload);
      case PubKeyPayload:
        return handleLookupPubKey(service)(env, msg as PubKeyPayload);
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handleSignPayload: (
  service: NameService
) => InternalHandler<SignPayload> = (service) => {
  return async (env, msg) => {
    const signature = await service.sign(env, msg.chainId, msg.digest);
    return signature;
  };
};

const handleLookupPubKey: (
  service: NameService
) => InternalHandler<PubKeyPayload> = (service) => {
  return async (env, msg) => {
    const pubKey = await service.getPubKey(env, msg.chainId);
    return pubKey;
  };
};
