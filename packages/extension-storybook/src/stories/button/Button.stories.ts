import { Button } from "./button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: "Component/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: "Claim rewards",
    onClick: () => console.log("Claim rewards clicked"),
  },
};

export const PrimaryBlur = {
  args: {
    // primary: true,
    label: "Claim rewards",
    className: 'storybook-button--primaryBlur',
    onClick: () => console.log("Claim rewards clicked"),
  },
};

export const Secondary = {
  args: {
    label: "Claim rewards",
    onClick: () => console.log("Claim rewards clicked"),
  },
};

export const Large = {
  args: {
    size: "large",
    label: "Claim rewards",
  },
};

export const Small = {
  args: {
    size: "small",
    label: "Button",
  },
};
