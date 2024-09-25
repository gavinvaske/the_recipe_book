import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  registerUIElement: (id: string, ref: any) => void;
  unregisterUIElement: (id: string) => void;
  closeAllUIElements: () => void;
  uiElements: UIElement[];
}

interface UIElement {
  id: string;
  ref: React.RefObject<HTMLDivElement>;
}

const defaultUIContext: UIContextType = {
  registerUIElement: () => {},
  unregisterUIElement: () => {},
  closeAllUIElements: () => {},
  uiElements: []
}

// Create a context
const UIContext = createContext<UIContextType>(defaultUIContext);

export interface ClosableHTMLElement extends HTMLDivElement {
  close: () => void; // Expose a close method
}

type Ref = React.RefObject<ClosableHTMLElement>

type UiComponentReference = {
  id: string,
  ref: Ref
}

export const UIProvider = ({ children }) => {
  const [uiElements, setUIElements] = useState<UiComponentReference[]>([]);

  const registerUIElement = (id: string, ref: Ref) => {
    setUIElements(prevElements => [...prevElements, { id, ref }]);
  };

  const unregisterUIElement = (id: string) => {
    setUIElements(prevElements => prevElements.filter(element => element.id !== id));
  };

  const closeAllUIElements = () => {
    uiElements.forEach(element => {
      if (element.ref.current && element.ref.current.close) {
        element.ref.current.close(); // Call the exposed close method
      }
    });
  };

  return (
    <UIContext.Provider value={{ registerUIElement, unregisterUIElement, closeAllUIElements, uiElements }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  return useContext(UIContext);
};