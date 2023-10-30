import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import style from "./style.module.scss";
import { observer } from "mobx-react-lite";

interface ChainSelectProps {
  chains: any[];
  recieverChain: any;
  setRecieverChain: any;
  isChainsLoaded: boolean;
  depositAddress: string;
}

export const ChainSelect = observer(
  ({
    chains,
    recieverChain,
    setRecieverChain,
    isChainsLoaded,
    depositAddress,
  }: ChainSelectProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleChainSelect = async (chain: string) => {
      setRecieverChain(chain);
      setDropdownOpen(!dropdownOpen);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className={style["label"]}>To Chain</div>
        <ButtonDropdown
          isOpen={dropdownOpen}
          toggle={() => setDropdownOpen(!dropdownOpen)}
          disabled={!isChainsLoaded || depositAddress?.length > 0}
        >
          <DropdownToggle
            className={
              depositAddress && depositAddress.length > 0
                ? style["dropdown-toggle"]
                : ""
            }
            style={{ width: "150px" }}
            caret
          >
            {!isChainsLoaded ? (
              <React.Fragment>
                loading <i className="fas fa-spinner fa-spin ml-2" />
              </React.Fragment>
            ) : recieverChain ? (
              recieverChain.id
            ) : (
              "Select network"
            )}
          </DropdownToggle>
          <DropdownMenu style={{ maxHeight: "200px", overflow: "auto" }}>
            {chains.map((chain: any) => (
              <DropdownItem
                key={chain.id}
                onClick={() => handleChainSelect(chain)}
              >
                {chain.id}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
);
