import React from "react";
import { ButtonToggle } from "./index";

export default {
  title: "Component/ButtonToggle",
  component: ButtonToggle,
};

const Template = (args) => <ButtonToggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Toggle Button",
  content:
    "This is the content that gets displayed when the button is toggled.",
};
