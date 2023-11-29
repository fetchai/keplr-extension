import { doc, updateDoc } from "@react-native-firebase/firestore/lib/modular";
import firestore from "@react-native-firebase/firestore";

import {
  FirestoreError,
  onSnapshot,
} from "@react-native-firebase/firestore/lib/modular/snapshot";

const firestoreInstance = firestore();

export const firebaseTxRequestListener = (
  address: string,
  onNext: (data?: TxRequest) => void,
  onError: (error: FirestoreError) => void
) => {
  const docRef = doc(firestoreInstance, "txnRequest", address);
  onSnapshot(
    docRef,
    (snapshot) => {
      console.log(
        "Snapshot",
        snapshot.data(),
        "fromCache",
        snapshot.metadata.fromCache
      );
      if (snapshot.exists && snapshot.get("status") == "pending") {
        onNext(
          new TxRequest(
            snapshot.get("address"),
            snapshot.get("status"),
            snapshot.get("txTypeInProgress"),
            snapshot.get("code")
          )
        );
      } else {
        // docSnap.data() will be undefined in this case
        onNext(undefined);
      }
    },
    (error) => {
      onError(error);
    }
  );
};

export const firebaseTxRequestRejected = async (address: string) => {
  const docRef = doc(firestoreInstance, "txnRequest", address);
  await updateDoc(docRef, { status: "rejected" });
};

export class TxRequest {
  constructor(
    readonly address: string,
    readonly status: string,
    readonly txTypeInProgress: string,
    readonly code: string
  ) {}

  toString() {
    return (
      this.address +
      ", " +
      this.status +
      ", " +
      this.txTypeInProgress +
      ", " +
      this.code
    );
  }
}
