import React, { useState } from "react";
import styles from "./style.module.scss";
import searchImage from "../assets/search.svg";

export const SearchCard = ({ elements }: any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filterElements = () => {
    return elements.filter((element: any) => {
      const elementName = element.name?.toLowerCase() || "";
      const componentChildren =
        element.component?.props.children?.toLowerCase() || "";

      return (
        elementName.includes(searchTerm.toLowerCase()) ||
        componentChildren.includes(searchTerm.toLowerCase())
      );
    });
  };

  return (
    <div>
      <div className={styles["cardContainer"]}>
        <input
          className={styles["searchInput"]}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <img src={searchImage} alt="Search" />
      </div>
      <div>
        <ul>
          {filterElements().map((result: any, index: any) => (
            <div key={index}>
              {result.component ? result.component : <div>{result.name}</div>}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
