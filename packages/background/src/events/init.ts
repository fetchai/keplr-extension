import { Router } from "@keplr-wallet/router";
import { ROUTE } from "./constants";
import { getHandler } from "./handler";
import {
  SubscribeOnAccountChangeMsg,
  SubscribeOnNetworkChangeMsg,
  SubscribeOnStatusChangeMsg,
  UnsubscribeOnAccountChangeMsg,
  UnsubscribeOnNetworkChangeMsg,
  UnsubscribeOnStatusChangeMsg,
} from "./messages";
import { EventService } from "./service";

export function init(router: Router, service: EventService): void {
  router.registerMessage(SubscribeOnStatusChangeMsg);
  router.registerMessage(UnsubscribeOnStatusChangeMsg);
  router.registerMessage(SubscribeOnAccountChangeMsg);
  router.registerMessage(UnsubscribeOnAccountChangeMsg);
  router.registerMessage(SubscribeOnNetworkChangeMsg);
  router.registerMessage(UnsubscribeOnNetworkChangeMsg);

  router.addHandler(ROUTE, getHandler(service));
}
