import { useCallback } from "react";
import { ledgerUSBVendorId } from "@ledgerhq/devices";

export const useUSBDevices = () => {
  const testUSBDevices = useCallback(async (isWebHID: boolean) => {
    const anyNavigator = navigator as any;
    let protocol: any;
    if (isWebHID) {
      protocol = anyNavigator.hid;
    } else {
      protocol = anyNavigator.usb;
    }

    const devices = await protocol.getDevices();

    const exist = devices.find((d: any) => d.vendorId === ledgerUSBVendorId);
    return !!exist;
  }, []);

  return { testUSBDevices };
};
