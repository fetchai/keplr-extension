import React from "react";
import { Card, CardProps } from "./index";
import { Story } from "@storybook/react";

export default {
  title: "Components/Card",
  component: Card,
};

const Template: Story<CardProps> = (args: CardProps) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  heading: "Card Heading",
  subheading: "Card Subheading",
  rightContent: "Right Content",
  isActive: false,
};

export const WithImage = Template.bind({});
WithImage.args = {
  heading: "Card with Image",
  leftImage: "https://example.com/image.jpg",
  subheading: "Card Subheading",
  rightContent: "Right Content",
  isActive: false,
};

export const ActiveCard = Template.bind({});
ActiveCard.args = {
  heading: "Active Card",
  rightContent: "Right Content",
  isActive: true,
};

export const CustomContent = Template.bind({});
CustomContent.args = {
  heading: "Custom Content",
  subheading: "Card Subheading",
  rightContent: <div style={{ color: "indigo" }}>Custom Right Content</div>,
  isActive: false,
};
