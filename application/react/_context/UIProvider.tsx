import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  registerUIElement: (id: string, ref: any) => void;
  unregisterUIElement: (id: string) => void;
  closeAllUIElements: () => void;
}

const defaultUIContext: UIContextType = {
  registerUIElement: () => {},
  unregisterUIElement: () => {},
  closeAllUIElements: () => {},
}

// Create a context
const UIContext = createContext<UIContextType>(defaultUIContext);

export interface ClosableHTMLElement extends HTMLElement {
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
    <UIContext.Provider value={{ registerUIElement, unregisterUIElement, closeAllUIElements }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  return useContext(UIContext);
};