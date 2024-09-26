import React, { createContext, useContext, useState } from 'react';

interface DropdownContextType {
  registerDropdown: (id: string, ref: any) => void;
  unregisterDropdown: (id: string) => void;
  closeAllDropdowns: () => void;
}

const defaultDropdownContext: DropdownContextType = {
  registerDropdown: () => {},
  unregisterDropdown: () => {},
  closeAllDropdowns: () => {}
}

// Create a context
const DropdownContext = createContext<DropdownContextType>(defaultDropdownContext);

export interface Closable {
  close: () => void;
}

export interface ClosableHTMLElement extends HTMLDivElement, Closable {}

export type RefToClosableHtmlElement = React.RefObject<ClosableHTMLElement>

type DropdownRef = {
  id: string,
  ref: RefToClosableHtmlElement
}

export const DropdownProvider = ({ children }) => {
  const [dropdownRefs, setDropdownRefs] = useState<DropdownRef[]>([]);

  const registerDropdown = (id: string, ref: RefToClosableHtmlElement) => {
    setDropdownRefs(prevElements => [...prevElements, { id, ref }]);
  };

  const unregisterDropdown = (id: string) => {
    setDropdownRefs(prevElements => prevElements.filter(element => element.id !== id));
  };

  const closeAllDropdowns = () => {
    dropdownRefs.forEach(element => {
      if (element.ref.current && element.ref.current.close) {
        element.ref.current.close(); // Call the exposed close method
      }
    });
  };

  return (
    <DropdownContext.Provider value={{ registerDropdown, unregisterDropdown, closeAllDropdowns }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  return useContext(DropdownContext);
};