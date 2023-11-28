import React from "react";
import { TabsPanel } from "./index";
import { Card } from "../card";

export default {
  title: "Component/TabsPanel",
  component: TabsPanel,
};

const Template = (args) => <TabsPanel {...args} />;

const tabs = [
  { id: "Tab1", component: <div>Content for Tab 1</div> },
  { id: "Tab2", component: <div>Content for Tab 2</div>, disabled: true },
  {
    id: "Tab3",
    component: (
      <div>
        <Card
          heading={"Fetch.ai"}
          subheading={"1200 FET"}
          rightContent={"$1200"}
        />
      </div>
    ),
  },
];

export const Default = Template.bind({});
Default.args = {
  tabs: tabs,
};
