import React, { createContext, useContext, useState } from 'react';

interface TargetNode {
  target: Node
}
interface DropdownContextType {
  registerDropdown: (id: string, ref: any) => void;
  unregisterDropdown: (id: string) => void;
  closeDropdownsIfClickWasOutside: ({ target }: TargetNode) => void;
}

const defaultDropdownContext: DropdownContextType = {
  registerDropdown: () => {},
  unregisterDropdown: () => {},
  closeDropdownsIfClickWasOutside: ({ target }: TargetNode) => {}
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

  const closeDropdownsIfClickWasOutside = ({ target }: TargetNode) => {
    const wasADropdownClicked = dropdownRefs.some(element => element.ref.current && element.ref.current.contains(target));

    if (!wasADropdownClicked) {
      dropdownRefs.forEach(({ ref }) => {
        ref.current?.close()
      });
    }
  };

  return (
    <DropdownContext.Provider value={{ registerDropdown, unregisterDropdown, closeDropdownsIfClickWasOutside }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  return useContext(DropdownContext);
};