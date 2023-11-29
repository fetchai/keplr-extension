import React, { useState } from "react";
import { Dropdown } from "./index";
import { Card } from "../card";
import activeImage from "../assets/check.svg";
export default {
  title: "Component/Dropdown",
  component: Dropdown,
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleCardClick = (cardId) => {
    setActiveCard(cardId);
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Open Dropdown</button>
      <Dropdown {...args} isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <Card
            style={activeCard !== "element1" && { background: "transparent" }}
            heading={"Element 1"}
            isActive={activeCard === "element1"}
            onClick={() => handleCardClick("element1")}
            rightContent={
              activeCard === "element1" && <img src={activeImage} alt="" />
            }
          />
          <Card
            style={activeCard !== "element2" && { background: "transparent" }}
            heading={"Element 2"}
            isActive={activeCard === "element2"}
            onClick={() => handleCardClick("element2")}
            rightContent={
              activeCard === "element2" && <img src={activeImage} alt="" />
            }
          />
        </div>
      </Dropdown>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Example Dropdown",
  closeClicked: () => console.log("Dropdown closed"),
};
