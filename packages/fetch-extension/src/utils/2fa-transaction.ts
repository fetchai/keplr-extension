import {
  deleteDoc,
  doc,
  FirestoreError,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestoreApp } from "../../firebaseConfig";
import {
  txConverter,
  TxRequest,
  TxRequestModel,
} from "../pages/2fa/firebase-tx-request-converter";

export const firebaseTxRequestListener = (
  address: string,
  onNext: (data: TxRequest) => void,
  onError: (error: FirestoreError) => void
) => {
  const docRef = doc(firestoreApp, "txnRequest", address).withConverter(
    txConverter
  );
  onSnapshot(
    docRef,
    (snapshot) => {
      console.log("Metadata", snapshot.metadata);
      if (snapshot.exists() && !snapshot.metadata.fromCache) {
        onNext(snapshot.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    },
    (error) => {
      onError(error);
    }
  );
};

export const firebaseTxRequest = async (address: string) => {
  const docRef = doc(firestoreApp, "txnRequest", address);
  await setDoc(docRef, <TxRequestModel>{
    address: address,
    status: "pending",
    txTypeInProgress: "send",
    code: Math.random().toString().slice(2, 6),
  });
};

export const firebaseTxRequestRejected = async (address: string) => {
  const docRef = doc(firestoreApp, "txnRequest", address);
  await updateDoc(docRef, { status: "rejected" });
};

export const deleteFirebaseTxRequest = async (address: string) => {
  const docRef = doc(firestoreApp, "txnRequest", address);
  await deleteDoc(docRef);
};
