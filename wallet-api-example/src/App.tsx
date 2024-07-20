import React, { useEffect } from "react";
import { OsmosisChainInfo } from "./constants";
import { Balances } from "./types/balance";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { isAddress } from "@ethersproject/address";
import { sendMsgs } from "./util/sendMsgs";
import { api } from "./util/api";
import { simulateMsgs } from "./util/simulateMsgs";
import { MsgSend } from "./proto-types-gen/src/cosmos/bank/v1beta1/tx";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";
import { getFetchWalletFromWindow } from "./util/getKeplrFromWindow";
import { WalletApi, WalletStatus } from "../../packages/wallet-types";

function App() {
  const [address, setAddress] = React.useState<string>("");
  const [balance, setBalance] = React.useState<string>("");
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");

  const [evmResult1, setEvmResult1] = React.useState<string>("");

  const [evmResult2, setEvmResult2] = React.useState<string>("");

  const [evmResult3, setEvmResult3] = React.useState<string>("");

  const [evmRecipient, setEvmRecipient] = React.useState<string>("");
  const [evmAmount, setEvmAmount] = React.useState<string>("");
  const [evmResult4, setEvmResult4] = React.useState<string>("");

  const [evmChainId, setEvmChainId] = React.useState<string>("");

  const [evmTokenAddress, setEvmTokenAddress] = React.useState<string>("");
  const [wallet, setWallet] = React.useState<WalletApi>();
  const [status, setStatus] = React.useState<WalletStatus>(WalletStatus.NOTLOADED)

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const fetchBrowserWallet = await getFetchWalletFromWindow();

    if (fetchBrowserWallet) {
      setWallet(fetchBrowserWallet.wallet);
      const status = await fetchBrowserWallet.wallet.status();
      setStatus(status);
    }

    // const keplr = window.keplr;
    // if (keplr) {
    //   try {
    //     await keplr.experimentalSuggestChain(OsmosisChainInfo);
    //     if (!keplr.ethereum.isConnected()) {
    //       await keplr.ethereum.enable();
    //     }
    //   } catch (e) {
    //     if (e instanceof Error) {
    //       console.log(e.message);
    //     }
    //   }
    // }
  };

  const getKeyFromKeplr = async () => {
    const key = await window.fetchBrowserWallet?.keplr?.getKey(OsmosisChainInfo.chainId);
    if (key) {
      setAddress(key.bech32Address);
    }
  };

  const getBalance = async () => {
    const key = await window.fetchBrowserWallet?.keplr?.getKey(OsmosisChainInfo.chainId);

    if (key) {
      const uri = `${OsmosisChainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find(
        (balance) => balance.denom === "uosmo"
      );
      const osmoDecimal = OsmosisChainInfo.currencies.find(
        (currency) => currency.coinMinimalDenom === "uosmo"
      )?.coinDecimals;

      if (balance) {
        const amount = new Dec(balance.amount, osmoDecimal);
        setBalance(`${amount.toString(osmoDecimal)} OSMO`);
      } else {
        setBalance(`0 OSMO`);
      }
    }
  };

  const sendBalance = async () => {
    if (window.fetchBrowserWallet) {
      const key = await window.fetchBrowserWallet?.keplr?.getKey(OsmosisChainInfo.chainId);
      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: key.bech32Address,
          toAddress: recipient,
          amount: [
            {
              denom: "uosmo",
              amount: DecUtils.getTenExponentN(6)
                .mul(new Dec(amount))
                .truncate()
                .toString(),
            },
          ],
        }).finish(),
      };

      try {
        // const gasUsed = await simulateMsgs(
        //   OsmosisChainInfo,
        //   key?.bech32Address ?? "",
        //   [protoMsgs],
        //   [{ denom: "uosmo", amount: "236" }]
        // );

        // if (gasUsed) {
        //   await sendMsgs(
        //     window.fetchBrowserWallet?.keplr,
        //     OsmosisChainInfo,
        //     key?.bech32Address,
        //     [protoMsgs],
        //     {
        //       amount: [{ denom: "uosmo", amount: "236" }],
        //       gas: Math.floor(gasUsed * 1.5).toString(),
        //     }
        //   );
        // }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  if (status === WalletStatus.NOTLOADED) {
    return <h1>Loading...</h1>
  }

  if (status === WalletStatus.LOCKED) {
    return (
      <div className="item">
        <div className="item-title">Wallet Locked</div>

        <div className="item-content">
          <div>
            <button
              className="keplr-button"
              disabled={!wallet}
              onClick={async () => {
                await wallet?.unlockWallet();
              }}
            >
              Unlock
            </button>
          </div>
          <div>Address: {address}</div>
        </div>
      </div>
    );
  }

  if (status === WalletStatus.EMPTY) {
    return <h1>Wallet Empty. Please create an account in the wallet</h1>
  }

  return (
    <div>
      <h2 style={{ marginTop: "30px" }}>
        Request to Osmosis Testnet via Keplr Provider
      </h2>

      <div className="item-container">
        <div className="item">
          <div className="item-title">Get OSMO Address</div>

          <div className="item-content">
            <div>
              <button className="keplr-button" onClick={getKeyFromKeplr}>
                Get Address
              </button>
            </div>
            <div>Address: {address}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Get OSMO Balance</div>

          <div className="item-content">
            <button className="keplr-button" onClick={getBalance}>
              Get Balance
            </button>

            <div>Balance: {balance}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Send OSMO</div>

          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Recipient:
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Amount:
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button className="keplr-button" onClick={sendBalance}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
