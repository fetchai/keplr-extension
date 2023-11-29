import React, { useState } from "react";
import { Dropdown } from "./index";
import { Card } from "../card";

export default {
  title: "Component/Dropdown",
  component: Dropdown,
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Open Dropdown</button>
      <Dropdown {...args} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Example Dropdown",
  closeClicked: () => console.log("Dropdown closed"),
  children: (
    <div>
      <Card heading={"Element 1"} isActive={true} />
      <Card style={{ background: "transparent" }} heading={"Element 2"} />
    </div>
  ),
};
