import React, { FunctionComponent, useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
} from "reactstrap";
import "./validators-input.scss";

interface ValidatorDropdownProps {
  label: string;
  validators: string[];
}

export const ValidatorDropdown: FunctionComponent<ValidatorDropdownProps> = ({
  label,
  validators,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectValidator = (validator: string) => {
    setSelectedValidator(validator);
  };

  return (
    <FormGroup style={{ borderRadius: "0%" }}>
      <Label>{label}</Label>
      <br />
      <ButtonDropdown
        className="validators-dropdown"
        isOpen={isOpen}
        toggle={toggleDropdown}
      >
        <DropdownToggle caret>
          {selectedValidator || "Search by name or address"}
        </DropdownToggle>
        <DropdownMenu>
          {validators.map((validator) => (
            <DropdownItem
              key={validator}
              active={validator === selectedValidator}
              onClick={() => selectValidator(validator)}
            >
              {validator}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </FormGroup>
  );
};
