import * as AutoLocker from "./auto-lock-account/internal";
import { KVStore } from "@keplr-wallet/common";
import * as Umbral from "./umbral/internal";
import { Router } from "@keplr-wallet/router";
import { ChainsService } from "./chains";
import { KeyRingService } from "./keyring";
import { PermissionService } from "./permission";

export function initExtension(
  router: Router,
  storeCreator: (prefix: string) => KVStore,
  chainsService: ChainsService,
  keyRingService: KeyRingService,
  permissionService: PermissionService
) {
  const autoLockAccountService = new AutoLocker.AutoLockAccountService(
    storeCreator("auto-lock-account")
  );
  const umbralService = new Umbral.UmbralService(chainsService);

  AutoLocker.init(router, autoLockAccountService);
  Umbral.init(router, umbralService);

  return {
    initFn: async () => {
      // No need to wait because user can't interact with app right after launch.
      await autoLockAccountService.init(keyRingService);
      await umbralService.init(keyRingService, permissionService);
    },
  };
}
