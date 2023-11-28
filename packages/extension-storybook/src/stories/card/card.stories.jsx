import React from "react";
import { Card } from "./index";

export default {
  title: "Component/Card",
  component: Card,
};

const Template = (args) => <Card {...args} />;

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
