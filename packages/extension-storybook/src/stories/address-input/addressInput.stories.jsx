import React from "react";
import { AddressInput } from "./index";

export default {
  title: "Component/AddressInput",
  component: AddressInput,
};

const Template = (args) => <AddressInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  qrOnClick: () => {
    console.log("QR Code clicked");
  },
  atOnClick: () => {
    console.log("@ clicked");
  },
  qrDisabled: false,
  atDisabled: false,
};
export const ButtonsDisabled = Template.bind({});
ButtonsDisabled.args = {
  qrOnClick: () => {
    console.log("QR Code clicked");
  },
  atOnClick: () => {
    console.log("@ clicked");
  },
  qrDisabled: true,
  atDisabled: true,
};
