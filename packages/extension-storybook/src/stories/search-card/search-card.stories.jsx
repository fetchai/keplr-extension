import React from "react";
import { SearchCard } from "./index";
import { Card } from "../card";

export default {
  title: "Component/SearchCard",
  component: SearchCard,
  argTypes: {
    elements: {
      control: "array",
    },
  },
};

const Template = (args) => <SearchCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  elements: [
    { name: "fetchhub", component: <div>fetchhub </div> },
    { name: "ethereum", component: <div>ethereum </div> },
    { name: "cosmos", component: <div>cosmos </div> },
    { name: "dorado", component: <div>dorado </div> },
  ],
};
