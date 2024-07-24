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
import { Account, NetworkConfig, WalletApi, WalletStatus } from "@fetchai/wallet-types";

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
  const [account, setAccount] = React.useState<Account>();
  const [network, setNetwork] = React.useState<NetworkConfig>();
  const [networks, setNetworks] = React.useState<NetworkConfig[]>();

  useEffect(() => {
    init();

    // window.addEventListener("fetchwallet_walletstatuschange", getStatus);
    // window.addEventListener("fetchwallet_networkchange", getNetwork);
    // window.addEventListener("fetchwallet_keystorechange", getAccount);

    // return () => {
    //   // window.removeEventListener("fetchwallet_walletstatuschange", getStatus);
    //   // window.removeEventListener("fetchwallet_networkchange", getNetwork);
    //   // window.removeEventListener("fetchwallet_keystorechange", getAccount);
    // }
  }, []);

  const init = async () => {
    console.log("@#!#@#init")
    const fetchBrowserWallet = await getFetchWalletFromWindow();

    if (fetchBrowserWallet) {
      setWallet(fetchBrowserWallet.wallet);
      const status = await fetchBrowserWallet.wallet.status();
      setStatus(status);

      if (status === WalletStatus.UNLOCKED) {
        // TODO: should have networks permission for this
        await fetchBrowserWallet.wallet.enable("fetchhub-4")
        // TODO: Add check for permissions for chain enabled because this shows request rejected when approved.
        await fetchBrowserWallet.wallet.networks.switchToNetworkByChainId("fetchhub-4");
        const network = await fetchBrowserWallet.wallet.networks.getNetwork();
        setNetwork(network)
        const networks = await fetchBrowserWallet.wallet.networks.listNetworks();
        setNetworks(networks)
      }
    }
  };

  const getAccount = async () => {
    const account = await wallet?.accounts.currentAccount();
    if (account) {
      setAccount(account);
    }
  };

  const getStatus = async () => {
    const status = await wallet?.status();
    if (status) {
      setStatus(status);
    }
  };

  const getNetwork = async () => {
    const network = await wallet?.networks.getNetwork();
    if (network) {
      setNetwork(network);
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
        </div>
      </div>
    );
  }

  if (status === WalletStatus.EMPTY) {
    return <h1>Wallet Empty. Please create an account in the wallet</h1>
  }

  // if (!network) {
  //   return (
  //     <div className="item">
  //       <div className="item-title">Wallet Locked</div>

  //       <div className="item-content">
  //         <div>
  //           <button
  //             className="keplr-button"
  //             disabled={!wallet}
  //             onClick={async () => {
  //               await wallet?.unlockWallet();
  //             }}
  //           >
  //             Connect
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h2 style={{ marginTop: "30px" }}>
        Request to Eridanus Testnet via Fetch Wallet Provider
      </h2>

      <div className="item-container">
        <div className="item">
          <div className="item-title">Get address</div>

          <div className="item-content">
            <div>Network: {network?.chainName}</div>
            <div>
              <button className="keplr-button" onClick={getAccount}>
                Get Address
              </button>
            </div>
            <div>Address: {account?.address}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Get balance</div>

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
