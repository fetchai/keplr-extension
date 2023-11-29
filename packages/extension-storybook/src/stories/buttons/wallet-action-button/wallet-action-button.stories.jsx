import React from "react";
import { WalletActionsButton } from "./index";
import receiveIcon from "../../assets/arrow-down.svg";
export default {
  title: "Component/WalletActionsButton",
  component: WalletActionsButton,
};

const Template = (args) => <WalletActionsButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Receive",
  image: receiveIcon,
  onClick: console.log("Receive button clicked"),
};
