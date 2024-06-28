import React from "react";
import { createContext, useContext, useState } from "react";

export interface DropdownContext {
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContext | null>(null);

export const DropdownContextProvider = ({ children }: { children: any }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isDropdownOpen, setIsDropdownOpen }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = (): DropdownContext => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("You have forgot to use DropdownContextProvider");
  }
  return context;
};
