import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import Button from '../components/ui/button';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { AccountData, Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {}
}

import cn from 'classnames';
import { parseUnit } from '@/util';
import { ChainInfo } from '@/types';

interface FaucetSenderState {
  denom: string;
  faucetBalance: string;
  myAddress: string;
  myBalance: string;
  toSend: string;
}

const chainInfo: ChainInfo = {
  chainId: 'dorado-1',
  chainName: 'DORADO TestNet',
  rpc: 'https://rpc-dorado.fetch.ai:443 ',
  rest: 'https://rest-fetchhub.fetch.ai:443',
  decimals: 18,
};

const SendPage = () => {
  const [transactionDetails, setTransactionDetails] = useState({
    denom: '',
    faucetBalance: '',
    myAddress: '',
    myBalance: '',
    toSend: '',
  });
  const [recipient, setRecipient] = useState('');

  const handleClick = async () => {
    const { keplr } = window;
    if (!keplr) {
      alert('Connect fetch first!');
      return;
    }

    const offlineSigner = window.getOfflineSigner!('dorado-1');
    const signingClient = await SigningStargateClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner
    );

    const account: AccountData = (await offlineSigner.getAccounts())[0];
    const denom = 'atestfet';
    const balance = (await signingClient.getBalance(account.address, denom))
      .amount;

    setTransactionDetails((prev) => {
      return { ...prev, myAddress: account.address, myBalance: balance };
    });

    try {
      const sendResult = await signingClient.sendTokens(
        account.address,
        recipient,
        [
          {
            denom: denom,
            amount: parseUnit(transactionDetails.toSend, chainInfo.decimals),
          },
        ],
        {
          amount: [{ denom: 'atestfet', amount: '5000' }],
          gas: '2000000',
        }
      );

      console.log(sendResult);
    } catch (error) {
      console.log(error);
    }
  };

  // const sendBalance = async () => {
  //   if (window.keplr) {
  //     const key = await window.keplr.getKey(chainInfo.chainId);
  //     const protoMsgs = {
  //       typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  //       value: MsgSend.encode({
  //         fromAddress: key.bech32Address,
  //         toAddress: recipient,
  //         amount: [
  //           {
  //             denom: "uosmo",
  //             amount : ""
  //           },
  //         ],
  //       }).finish(),
  //     }

  //     try {
  //       const gasUsed = await simulateMsgs(
  //         chainInfo,
  //         key.bech32Address,
  //         [protoMsgs],
  //         [{denom: "uosmo",
  //           amount: "236",}]
  //         );

  //       if(gasUsed) {
  //         await sendMsgs(
  //           window.keplr,
  //           chainInfo,
  //           key.bech32Address,
  //           [protoMsgs],
  //           {
  //             amount: [{denom: "uosmo",
  //               amount: "236",}],
  //             gas: Math.floor(gasUsed * 1.5).toString(),
  //           })
  //       }
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         console.log(e.message);
  //       }
  //     }

  //   }
  // }

  return (
    <>
      <NextSeo
        title="Farms"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />

      <div className="m-auto flex h-[80vh] w-[50%] flex-col items-center justify-center">
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className={cn('relative flex gap-3')}>
            <div>
              <p className="mb-2">Amount</p>
              <input
                className="rounded-lg border-2 border-black/30 py-3 px-5"
                value={transactionDetails.toSend}
                onChange={(e) =>
                  setTransactionDetails((prev) => {
                    return { ...prev, toSend: e.target.value };
                  })
                }
              />
            </div>
            <div>
              <p className="mb-2">Address</p>
              <input
                className="rounded-lg border-2 border-black/30 py-3 px-5"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={handleClick}
        >
          SEND
        </Button>
      </div>
    </>
  );
};

export default SendPage;
