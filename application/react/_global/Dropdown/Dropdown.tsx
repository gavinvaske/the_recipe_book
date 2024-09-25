import React, { PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import './Dropdown.scss';
import { useDropdownContext } from '../../_context/dropdownProvider';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  isActive?: boolean;
  classNames?: string;
};

export const Dropdown = (props: PropsWithChildren<Props>) => {
  const { isActive, classNames, children } = props;
  const context = useDropdownContext();
  const [isOpen, setIsOpen] = React.useState(isActive || false);
  
  if (!context) {
    throw new Error('useDropdownContext() must be used within a DropdownProvider');
  }

  const { registerDropdown, unregisterDropdown } = context;
  const elementRef = React.useRef(null);

  // Expose the close method to the parent component
  useImperativeHandle(elementRef, () => ({
    close: () => {
      if (isOpen && elementRef.current) {
        setIsOpen(false);
      }
    }
  }));

  useEffect(() => {
    setIsOpen(isActive || false);
  }, [isActive]);

  useEffect(() => {
    const uuid = uuidv4();

    registerDropdown(uuid, elementRef);

    return () => {
      unregisterDropdown(uuid);
    };
  }, []);

  return (
    <div className={`dropdown-menu ${classNames} ${isOpen ? 'active' : ''}`} ref={elementRef}>
      {children}
    </div>
  );
};