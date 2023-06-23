import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import arrowIcon from "@assets/icon/right-arrow.png";
import style from "./style.module.scss";
import selectAll from "@assets/icon/chat-seen-status.png";

export const FilterActivities: React.FC<{
  onFilterChange: (filter: string[]) => void;
  options: any[];
  selectedFilter: any[];
}> = ({ onFilterChange, options, selectedFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value: string) => {
    const newFilters = selectedFilter;
    if (newFilters.includes(value)) {
      onFilterChange(newFilters.filter((item) => item !== value));
    } else {
      onFilterChange([...newFilters, value]);
    }
  };

  const handleDeselectClicks = () => {
    onFilterChange([]);
  };

  const handleSelectClicks = () => {
    const allFilters = options.map((option) => option.value);
    onFilterChange(allFilters);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles["dropdown-toggle"]}>
        <div className={styles["dropdown-heading"]} onClick={toggleDropdown}>
          <span>Filter</span>
          <img src={arrowIcon} alt="Arrow Icon" className={styles.arrowIcon} />
        </div>
        {isOpen && (
          <div className={styles["dropdown-menu-popup"]}>
            <div className={styles["select"]}>
              <div onClick={handleSelectClicks}>
                <img className={style.image} src={selectAll} alt="" />
                Select all
              </div>
              <div onClick={handleDeselectClicks}>
                <img
                  style={{ width: "10%", paddingBottom: "2px" }}
                  draggable={false}
                  src={require("@assets/svg/gov-cross.svg")}
                  className={style.image}
                />
                Deselect all
              </div>
            </div>
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
