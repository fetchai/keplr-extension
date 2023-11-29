import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export interface TxRequestModel {
  address: string;
  status: string;
  txTypeInProgress: string;
  code: string;
}

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

export const txConverter = {
  toFirestore(data: WithFieldValue<TxRequest>): TxRequestModel {
    return <TxRequestModel>{
      address: data.address,
      status: data.status,
      txTypeInProgress: data.txTypeInProgress,
      code: data.code,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TxRequest {
    const data = snapshot.data(options) as TxRequestModel;
    return new TxRequest(
      data.address,
      data.status,
      data.txTypeInProgress,
      data.code
    );
  },
};
