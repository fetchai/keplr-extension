import React, { useState } from "react";
import styles from "./style.module.scss";
import arrowIcon from "@assets/icon/right-arrow.png";

export const FilterActivities: React.FC<{
  onFilterChange: (filter: string[]) => void;
  options: any[];
  selectedFilter: any[];
}> = ({ onFilterChange, options, selectedFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value: string) => {
    const newFilters = selectedFilter;
    if (newFilters.includes(value)) {
      onFilterChange(
        newFilters.filter((item) => item !== value && item !== "All")
      );
    } else {
      if (value == "All") onFilterChange(options.map((option) => option.value));
      else onFilterChange([...newFilters, value]);
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles["dropdown-toggle"]} onClick={toggleDropdown}>
        <span>Filter</span>
        <img src={arrowIcon} alt="Arrow Icon" className={styles.arrowIcon} />

        {isOpen && (
          <div className={styles["dropdown-menu-popup"]}>
            <div className={styles["dropdown-menu"]}>
              {options.map((option) => (
                <label key={option.value} className={styles["dropdown-item"]}>
                  <input
                    type="checkbox"
                    className="mx-2"
                    value={option.value}
                    checked={selectedFilter.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
