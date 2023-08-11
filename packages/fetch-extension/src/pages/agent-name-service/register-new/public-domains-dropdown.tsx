import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import style from "./style.module.scss";

interface DomainDropdownProps {
  publicDomains: string[];
  onSelectDomain: (selectedDomain: string) => void;
}

const PublicDomainDropdown: React.FC<DomainDropdownProps> = ({
  publicDomains,
  onSelectDomain,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(dropdownOpen ? false : true);
  };

  const handleDomainSelection = (selectedDomain: string) => {
    onSelectDomain(selectedDomain);
    toggleDropdown();
  };

  return (
    <Dropdown
      className={style["dropdown"]}
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle className={style["dropdown-toggle"]} caret>
        suffix
      </DropdownToggle>
      {dropdownOpen && (
        <DropdownMenu>
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

export default PublicDomainDropdown;
