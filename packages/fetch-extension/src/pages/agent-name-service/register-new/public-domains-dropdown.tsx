import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import style from "./style.module.scss";

interface DomainDropdownProps {
  selectedPublicDomain: string;
  setSelectedPublicDomain: (selectedDomain: string) => void;
}

export const PublicDomainDropdown: React.FC<DomainDropdownProps> = ({
  selectedPublicDomain,
  setSelectedPublicDomain,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const publicDomains = ["agent", "world"];
  const toggleDropdown = () => {
    setDropdownOpen(dropdownOpen ? false : true);
  };

  const handleDomainSelection = (selectedDomain: string) => {
    setSelectedPublicDomain(selectedDomain);
    toggleDropdown();
  };

  return (
    <Dropdown
      className={style["dropdown"]}
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle className={style["dropdown-toggle"]} caret>
        {selectedPublicDomain}
      </DropdownToggle>
      {dropdownOpen && (
        <DropdownMenu style={{ minWidth: "40px" }}>
          {publicDomains.map((domain, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleDomainSelection(domain)}
            >
              {domain}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  );
};
