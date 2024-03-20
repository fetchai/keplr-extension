import React, { useRef } from "react";
import styles from "./style.module.scss";

export const FilterActivities: React.FC<{
  onFilterChange: (filter: string[]) => void;
  options?: any[];
  selectedFilter?: any[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}> = ({ setIsOpen, isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles["dropdown-container"]}>
      <div
        className={styles["dropdown"]}
        onClick={toggleDropdown}
        ref={dropdownRef}
      >
        <div className={styles["dropdownToggle"]} ref={dropdownRef}>
          <div className={styles["dropdownHeading"]}>
            Filter
            <img
              src={require("@assets/svg/wireframe/filter.svg")}
              alt="filter"
              className={styles["arrowIcon"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
