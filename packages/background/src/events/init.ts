import { Router } from "@keplr-wallet/router";
import { ROUTE } from "./constants";
import { getHandler } from "./handler";
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
  SubscribeOnEVMTxFailedMsg,
  SubscribeOnEVMTxSuccessfulMsg,
  UnsubscribeOnEVMTxFailedMsg,
  UnsubscribeOnEVMTxSuccessfulMsg,
  EmitOnEVMTxFailedMsg,
  EmitOnEVMTxSuccessfulMsg,
} from "./messages";
import { EventService } from "./service";

export function init(router: Router, service: EventService): void {
  router.registerMessage(SubscribeOnStatusChangeMsg);
  router.registerMessage(UnsubscribeOnStatusChangeMsg);
  router.registerMessage(SubscribeOnAccountChangeMsg);
  router.registerMessage(UnsubscribeOnAccountChangeMsg);
  router.registerMessage(SubscribeOnNetworkChangeMsg);
  router.registerMessage(UnsubscribeOnNetworkChangeMsg);
  router.registerMessage(SubscribeOnTxSuccessfulMsg);
  router.registerMessage(UnsubscribeOnTxSuccessfulMsg);
  router.registerMessage(SubscribeOnTxFailedMsg);
  router.registerMessage(UnsubscribeOnTxFailedMsg);
  router.registerMessage(SubscribeOnEVMTxSuccessfulMsg);
  router.registerMessage(UnsubscribeOnEVMTxSuccessfulMsg);
  router.registerMessage(SubscribeOnEVMTxFailedMsg);
  router.registerMessage(UnsubscribeOnEVMTxFailedMsg);
  router.registerMessage(EmitOnEVMTxFailedMsg);
  router.registerMessage(EmitOnEVMTxSuccessfulMsg);
  router.addHandler(ROUTE, getHandler(service));
}
