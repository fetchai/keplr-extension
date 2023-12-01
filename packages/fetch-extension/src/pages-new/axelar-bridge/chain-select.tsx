import React, { useState } from "react";
// import style from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
// import { formatTokenName } from "@utils/format";

import { Card } from "../../new-components-1/card";
import { Dropdown } from "../../new-components-1/dropdown";

interface ChainSelectProps {
  chains: any[];
  recieverChain: any;
  setRecieverChain: any;
  isChainsLoaded: boolean;
  depositAddress: string;
  setRecipientAddress: any;
}

export const ChainSelect = observer(
  ({
    chains,
    recieverChain,
    setRecieverChain,
    isChainsLoaded,
    depositAddress,
    setRecipientAddress,
  }: ChainSelectProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { chainStore, accountStore } = useStore();

    const handleChainSelect = async (chain: string) => {
      setRecieverChain(chain);
      setDropdownOpen(false);
    };

    // const isEvm = chainStore.current.features?.includes("evm") ?? false;

    return (
      <div>
        <Card
          heading={
            !isChainsLoaded ? (
              <>
                loading <i className="fas fa-spinner fa-spin ml-2" />
              </>
            ) : recieverChain ? (
              recieverChain.chainName
            ) : (
              "Transfer To"
            )
          }
          rightContent={require("@assets/svg/wireframe/chevron-down.svg")}
          style={{
            height: "72px",
            background: "rgba(255,255,255,0.1)",
            marginBottom: "16px",
          }}
          onClick={() => !depositAddress && setDropdownOpen(true)}
        />

        <Dropdown
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          title={"Transfer to"}
          closeClicked={() => setDropdownOpen(false)}
        >
          {chains.map(
            (chain: any) =>
              chain.chainId &&
              chainStore.current.chainId !== chain.chainId?.toString() && (
                <Card
                  heading={chain.chainName}
                  key={chain.chainId}
                  onClick={() => {
                    handleChainSelect(chain);
                    setRecipientAddress(
                      accountStore.getAccount(chain.chainId).bech32Address
                    );
                  }}
                  subheading={
                    accountStore.getAccount(chain.chainId.toString())
                      .bech32Address
                  }
                />
              )
          )}
        </Dropdown>
      </div>
    );
  }
);
